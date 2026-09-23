import { GRID_COLS, GRID_ROWS, DEPLOYMENT_ZONES, chebyshevDist, gridToWorld, unitWorldX, unitWorldZ, key, TILE_SIZE } from '../data/constants';
import { FACTIONS } from '../data/factions';
import { THEMES } from '../data/themes';
import { UNIT_ROSTER } from '../data/units';
import { buildFactionRosters } from '../data/rosters';
import { updateFogOfWar, hasLineOfSight, updatePlayerAwareness, playerAwareTiles, enemyAwareTiles } from './awareness';
import { resolveAttack } from './combat';
import { rallyUnit } from './morale';
import { pathTo, bfsReach } from './pathfinding';
import { PhysicsEngine } from './physics';
import { animateMovePath } from './movement';
import { clearTweens, spawnTeleportBeam, showWorldText } from './effects';
import { sfx } from '../audio/synth';
import { savePlayerCamera, restorePlayerCamera, getActionCamEnabled, getActiveCameraController, animateCameraTo } from '../renderer/camera';
import type { GameState, Unit, UnitDef, MissionType, DeploymentCard, EnemyRosterItem } from '../data/types';
import type { GameScene } from '../renderer/scene';
import type { CombatLogUI } from '../ui/combat-log';
import type { DatasheetUI } from '../ui/datasheet-ui';
import type { MinimapRadar } from '../ui/minimap-radar';
import type { DOMManager } from '../ui/dom';
import * as THREE from 'three';

export class GameEngine {
  public state: GameState;
  public scene: GameScene;
  public log: CombatLogUI;
  public datasheet: DatasheetUI;
  public minimap: MinimapRadar;
  public dom: DOMManager;
  public physics: PhysicsEngine;

  public selectedUnitId: number | null = null;
  public currentReach: { dist: Map<string, number>; parent: Map<string, string> } | null = null;
  public actionMode: 'idle' | 'move' | 'shoot' = 'idle';
  public isExecutingAiTurn: boolean = false;
  public isBusy: boolean = false;
  private nextUnitId: number = 1;

  constructor(
    scene: GameScene,
    log: CombatLogUI,
    datasheet: DatasheetUI,
    minimap: MinimapRadar,
    dom: DOMManager
  ) {
    this.scene = scene;
    this.log = log;
    this.datasheet = datasheet;
    this.minimap = minimap;
    this.dom = dom;
    this.physics = new PhysicsEngine();

    this.state = this.createInitialState();
  }

  public refreshAwareness(): void {
    const isDeployment = this.state.phase === 'deployment';
    this.scene.setFowVisible(!isDeployment);
    updatePlayerAwareness(
      isDeployment ? 'DEPLOYMENT' : 'BATTLE',
      this.state.units,
      this.scene.fowMeshes
    );
    updateFogOfWar(this.state);
    this.minimap.render(this.state);
  }

  private createInitialState(): GameState {
    return {
      mission: 'extermination',
      theme: 'jungle',
      turn: 1,
      round: 1,
      phase: 'deployment',
      units: [],
      fow: [],
      p1Score: 0,
      p2Score: 0,
      p1Roster: [],
      p2Roster: [],
      p1Deployed: [],
      p2Deployed: [],
      escortTargetC: 20,
      escortTargetR: 4,
      rosterPlayer: [],
      rosterEnemy: []
    };
  }

  public resetGameSession(): void {
    clearTweens();

    this.scene.clearHighlights();
    this.selectedUnitId = null;
    this.actionMode = 'idle';
    this.isExecutingAiTurn = false;

    this.state.units.forEach(u => {
      this.scene.removeUnitMesh(u.id);
    });

    this.state.units = [];
    this.state.p1Score = 0;
    this.state.p2Score = 0;
    this.state.turn = 1;
    this.state.round = 1;
    this.state.phase = 'deployment';
    this.state.rosterPlayer = [];
    this.state.rosterEnemy = [];
    this.state.objectives = [];
    this.nextUnitId = 1;

    const cockpit = document.getElementById('gameplay-cockpit');
    if (cockpit) cockpit.style.display = 'none';

    this.datasheet.hide();
    this.log.clear();
  }

  public startNewGame(
    p1Faction: string,
    p2Faction: string,
    theme: string,
    mission: MissionType,
    p1EscortRole: 'escort' | 'attack' = 'escort',
    p2EscortRole: 'escort' | 'attack' = 'attack'
  ): void {
    this.resetGameSession();
    this.state.p1Faction = p1Faction;
    this.state.p2Faction = p2Faction;
    this.state.theme = theme;
    this.state.mission = mission;
    this.state.escortRole = p1EscortRole;

    // Initialize board terrain
    this.scene.initBoard(theme);

    // Build authoritative faction rosters
    const { rosterPlayer, rosterEnemy } = buildFactionRosters(p1Faction, p2Faction);
    this.state.rosterPlayer = rosterPlayer;
    this.state.rosterEnemy = rosterEnemy;

    // Domination Objectives
    if (mission === 'domination') {
      this.state.objectives = [
        { id: 1, c: 8, r: 28, radius: 3, controlledBy: 0, points: 0 },
        { id: 2, c: 20, r: 28, radius: 3, controlledBy: 0, points: 0 },
        { id: 3, c: 32, r: 28, radius: 3, controlledBy: 0, points: 0 }
      ];
    }

    // Deploy Enemy units immediately to the board
    const enemyFaction = FACTIONS[p2Faction] || FACTIONS.chaos;
    rosterEnemy.forEach(item => {
      const uDef = UNIT_ROSTER[item.type] || UNIT_ROSTER.c_legion || UNIT_ROSTER.sm_tactical;
      const unit = this.deployUnitOnBoard(uDef, 2, item.x, item.z, false, item.name, enemyFaction);
      item.unitRef = unit;
    });

    // Escort VIP setup
    if (mission === 'escort') {
      const vipDef: UnitDef = UNIT_ROSTER.vip_courier || UNIT_ROSTER.sm_captain;

      if (p1EscortRole === 'escort') {
        this.state.escortTargetC = 20;
        this.state.escortTargetR = 4;
        this.deployUnitOnBoard(vipDef, 1, 20, 52, true, 'Sacred Relic Courier');
      } else {
        this.state.escortTargetC = 20;
        this.state.escortTargetR = 52;
        this.deployUnitOnBoard(vipDef, 2, 20, 4, true, 'Sacred Relic Courier', enemyFaction);
      }
    }

    this.state.phase = 'deployment';
    this.scene.cameraController.frameDeploymentZone();
    this.scene.updateDeploymentHighlights(this.state.rosterPlayer);
    this.refreshAwareness();

    const p1Name = (FACTIONS[p1Faction] || FACTIONS.marines).name;
    const p2Name = (FACTIONS[p2Faction] || FACTIONS.chaos).name;
    const themeName = (THEMES[theme] || THEMES.jungle).name;
    this.dom.updateMissionHud(mission, `${p1Name} vs ${p2Name}`);
    this.log.log(`Warzone initialized: ${themeName.toUpperCase()} theater. Mission: ${mission.toUpperCase()}. Deploy your strike force.`, 'info');
  }

  public deployPlayerCard(cardKey: string, c: number, r: number): Unit | null {
    const card = this.state.rosterPlayer?.find(cd => cd.key === cardKey);
    if (!card) return null;

    const z = DEPLOYMENT_ZONES.player1;
    if (c < z.minC || c > z.maxC || r < z.minR || r > z.maxR) {
      this.log.log('Deployment tile must be inside the southern zone (Rows 48–55)!', 'alert');
      return null;
    }

    if (this.state.units.some(u => u.c === c && u.r === r && u.id !== card.unitRef?.id)) {
      this.log.log('Deployment tile is already occupied!', 'alert');
      return null;
    }

    // If already deployed, remove previous mesh
    if (card.unitRef) {
      this.scene.removeUnitMesh(card.unitRef.id);
      this.state.units = this.state.units.filter(u => u.id !== card.unitRef!.id);
    }

    const uDef = UNIT_ROSTER[card.type] || UNIT_ROSTER.sm_tactical;
    const unit = this.deployUnitOnBoard(uDef, 1, c, r, card.isVip, card.name);
    card.placed = true;
    card.x = c;
    card.z = r;
    card.unitRef = unit;

    const wPos = gridToWorld(c, r);
    const beamColor = FACTIONS[this.state.p1Faction || 'marines']?.laserColor || 0x3b82f6;
    spawnTeleportBeam(new THREE.Vector3(wPos.x, 0, wPos.z), beamColor, this.scene.scene);
    showWorldText('DEPLOYED!', new THREE.Vector3(wPos.x, 0, wPos.z), '#34d399');

    this.scene.updateDeploymentHighlights(this.state.rosterPlayer);
    this.refreshAwareness();
    sfx('footsteps');
    return unit;
  }

  public undeployPlayerCard(cardKey: string): void {
    const card = this.state.rosterPlayer?.find(cd => cd.key === cardKey);
    if (card && card.unitRef) {
      const oldC = card.x !== null ? card.x : 0;
      const oldR = card.z !== null ? card.z : 0;
      const wPos = gridToWorld(oldC, oldR);

      this.scene.removeUnitMesh(card.unitRef.id);
      this.state.units = this.state.units.filter(u => u.id !== card.unitRef!.id);
      card.placed = false;
      card.x = null;
      card.z = null;
      card.unitRef = null;

      showWorldText('UNDEPLOYED', new THREE.Vector3(wPos.x, 0, wPos.z), '#fcd34d');
      this.scene.updateDeploymentHighlights(this.state.rosterPlayer);
      this.refreshAwareness();
      sfx('footsteps');
    }
  }

  public autoDeployPlayer(): void {
    if (!this.state.rosterPlayer) return;
    const zone = DEPLOYMENT_ZONES.player1;
    const defaultPositions = [
      { c: 20, r: 52 },
      { c: 14, r: 50 },
      { c: 26, r: 50 },
      { c: 8, r: 53 },
      { c: 32, r: 53 },
      { c: 20, r: 49 }
    ];

    let posIdx = 0;
    this.state.rosterPlayer.forEach(card => {
      if (!card.placed) {
        let placed = false;
        while (posIdx < defaultPositions.length) {
          const p = defaultPositions[posIdx++];
          if (!this.state.units.some(u => u.c === p.c && u.r === p.r)) {
            this.deployPlayerCard(card.key, p.c, p.r);
            placed = true;
            break;
          }
        }
        if (!placed) {
          // fallback scan
          for (let r = zone.minR; r <= zone.maxR; r += 2) {
            for (let c = zone.minC + 4; c <= zone.maxC - 4; c += 3) {
              if (!this.state.units.some(u => u.c === c && u.r === r)) {
                this.deployPlayerCard(card.key, c, r);
                placed = true;
                break;
              }
            }
            if (placed) break;
          }
        }
      }
    });
    this.refreshAwareness();
  }

  public deployUnitOnBoard(
    unitDef: UnitDef,
    player: number,
    c: number,
    r: number,
    isVip: boolean = false,
    customName?: string,
    faction?: any
  ): Unit {
    const worldPos = gridToWorld(c, r);

    const unit: Unit = {
      id: this.nextUnitId++,
      unitDefId: unitDef.id || unitDef.type,
      type: unitDef.type || unitDef.id,
      player,
      team: player === 1 ? 'player' : 'enemy',
      name: customName || unitDef.name,
      def: unitDef,
      c,
      r,
      x: worldPos.x,
      z: worldPos.z,
      px: worldPos.x,
      pz: worldPos.z,
      size: unitDef.size || 1,
      squadSize: unitDef.squadSize || 1,
      squadCasualties: new Array(unitDef.squadSize || 1).fill(false),
      wounds: unitDef.wounds || unitDef.hp || 5,
      maxWounds: unitDef.wounds || unitDef.hp || 5,
      hp: unitDef.hp || unitDef.wounds || 5,
      maxhp: unitDef.hp || unitDef.wounds || 5,
      morale: unitDef.leadership || 7,
      maxMorale: unitDef.leadership || 7,
      moraleState: 'steady',
      hasMoved: false,
      hasAttacked: false,
      isBroken: false,
      isVip,
      alive: true,
      dead: false,
      rotation: player === 1 ? Math.PI : 0,
      angle: player === 1 ? Math.PI : 0,
      anchor: { x: worldPos.x, z: worldPos.z },
      m: unitDef.movement || unitDef.m || 6,
      awareness: unitDef.awareness || 16,
      range: unitDef.range || 18,
      dmg: unitDef.dmg || 2,
      ranged: unitDef.ranged ?? true,
      hasMelee: unitDef.hasMelee ?? true,
      meleeDmg: unitDef.meleeDmg || 2,
      model: new THREE.Group()
    };

    const mesh = this.scene.addOrUpdateUnitMesh(unit, unitDef, faction);
    unit.model = mesh;
    this.state.units.push(unit);
    return unit;
  }

  public finalizeDeployment(): void {
    this.state.phase = 'battle';
    this.state.turn = 1;
    this.state.round = 1;

    // Show gameplay cockpit
    const cockpit = document.getElementById('gameplay-cockpit');
    if (cockpit) cockpit.style.display = 'flex';

    this.refreshAwareness();
    this.dom.updateTurnBanner(1, 1, 'battle');
    sfx('horn');
    this.log.log('Deployment complete! Combat commences.', 'alert');
  }

  public selectUnit(unitId: number | null): void {
    this.selectedUnitId = unitId;
    this.currentReach = null;
    this.actionMode = 'idle';
    this.scene.clearHighlights();
    this.scene.setTargetingRay(null, null, 'hidden');

    const callout = document.getElementById('los-callout');
    if (callout) callout.innerHTML = '';

    // Hide all selection rings
    this.scene.unitMeshes.forEach(mesh => {
      const ring = mesh.getObjectByName('selection_ring');
      if (ring) ring.visible = false;
    });

    if (unitId !== null) {
      const unit = this.state.units.find(u => u.id === unitId && !u.dead);
      if (unit) {
        const unitDef = UNIT_ROSTER[unit.unitDefId] || unit.def;
        const mesh = this.scene.unitMeshes.get(unit.id);
        if (mesh) {
          const ring = mesh.getObjectByName('selection_ring');
          if (ring) ring.visible = true;
        }

        this.datasheet.showUnit(unit, unitDef);

        // If player unit, simultaneously compute and highlight:
        // 1. Shooting Range (Amber 0xf59e0b, opacity 0.16) for all valid in-range tiles with LoS
        // 2. Movement Reach (Blue 0x3b82f6, opacity 0.42)
        // 3. Attack Targets (Red 0xef4444, opacity 0.70)
        if (unit.player === 1 && !unit.isVip) {
          const maxRange = Math.max(...(unitDef.weapons?.map(w => w.range) || [unit.range || 18]));

          // 1. Shooting Range Overlay
          const shootingTiles: Array<{ c: number; r: number }> = [];
          if (!unit.hasAttacked) {
            for (let rz = 0; rz < GRID_ROWS; rz++) {
              for (let cx = 0; cx < GRID_COLS; cx++) {
                if (chebyshevDist(unit.c, unit.r, cx, rz) <= maxRange) {
                  if (hasLineOfSight(unit.c, unit.r, cx, rz, this.state.theme)) {
                    shootingTiles.push({ c: cx, r: rz });
                  }
                }
              }
            }
          }

          // 2. Movement Reach Overlay
          const reachTiles: Array<{ c: number; r: number }> = [];
          if (!unit.hasMoved) {
            this.currentReach = bfsReach(unit, this.state.units);
            this.currentReach.dist.forEach((d, k) => {
              if (d > 0) {
                const [cx, rz] = k.split(',').map(Number);
                reachTiles.push({ c: cx, r: rz });
              }
            });
          }

          // 3. Attackable Enemies Overlay
          const targetTiles: Array<{ c: number; r: number }> = [];
          if (!unit.hasAttacked) {
            this.state.units.forEach(enemy => {
              if (enemy.player !== 1 && !enemy.dead && playerAwareTiles.has(`${enemy.c},${enemy.r}`)) {
                const dist = chebyshevDist(unit.c, unit.r, enemy.c, enemy.r);
                if (dist <= maxRange && hasLineOfSight(unit.c, unit.r, enemy.c, enemy.r, this.state.theme)) {
                  targetTiles.push({ c: enemy.c, r: enemy.r });
                }
              }
            });
          }

          if (shootingTiles.length > 0) {
            this.scene.highlightTiles(shootingTiles, 0xf59e0b, 0.16);
          }
          if (reachTiles.length > 0) {
            this.scene.highlightTiles(reachTiles, 0x3b82f6, 0.42);
          }
          if (targetTiles.length > 0) {
            this.scene.highlightTiles(targetTiles, 0xef4444, 0.70);
          }
        }
        return;
      }
    }

    this.datasheet.hide();
  }

  public enterMoveMode(): void {
    if (this.selectedUnitId !== null) {
      this.selectUnit(this.selectedUnitId);
    }
  }

  public enterShootMode(): void {
    if (this.selectedUnitId !== null) {
      this.selectUnit(this.selectedUnitId);
    }
  }

  public handleTileClick(c: number, r: number): void {
    if (this.state.phase === 'deployment') return;
    if (this.state.turn !== 1 || this.isExecutingAiTurn) return;

    const clickedUnit = this.state.units.find(u => u.c === c && u.r === r && !u.dead);

    // 1. If an enemy unit was clicked
    if (clickedUnit && clickedUnit.player !== 1) {
      if (this.selectedUnitId !== null) {
        const selected = this.state.units.find(u => u.id === this.selectedUnitId && !u.dead);
        if (selected && selected.player === 1 && !selected.hasAttacked && !selected.isVip) {
          const selectedDef = UNIT_ROSTER[selected.unitDefId] || selected.def;
          const maxRange = Math.max(...(selectedDef.weapons?.map(w => w.range) || [selected.range || 18]));
          const dist = chebyshevDist(selected.c, selected.r, clickedUnit.c, clickedUnit.r);
          const los = hasLineOfSight(selected.c, selected.r, clickedUnit.c, clickedUnit.r, this.state.theme);

          if (dist <= maxRange && los) {
            this.executeAttack(selected.id, clickedUnit.id);
            return;
          } else if (dist > maxRange) {
            this.log.log(`[OUT OF RANGE] Target is ${dist}" away (Max range: ${maxRange}").`, 'alert');
            return;
          } else if (!los) {
            this.log.log('[LINE OF SIGHT BLOCKED] Target obstructed by ruins/obstacles.', 'alert');
            return;
          }
        }
      }
      this.selectUnit(clickedUnit.id);
      return;
    }

    // 2. If a player unit was clicked
    if (clickedUnit && clickedUnit.player === 1) {
      this.selectUnit(clickedUnit.id);
      sfx('footsteps');
      return;
    }

    // 3. If an empty ground tile was clicked while a player unit is selected
    if (this.selectedUnitId !== null && this.currentReach) {
      const selected = this.state.units.find(u => u.id === this.selectedUnitId && !u.dead);
      const targetKey = key(c, r);
      if (selected && selected.player === 1 && !selected.hasMoved && this.currentReach.dist.has(targetKey)) {
        const fromK = key(selected.c, selected.r);
        const path = pathTo(this.currentReach.parent, fromK, targetKey);
        if (path && path.length > 0) {
          this.executeMove(selected.id, c, r, path);
          return;
        }
      }
    }

    // Otherwise deselect
    this.selectUnit(null);
  }

  public executeMove(unitId: number, targetC: number, targetR: number, precomputedPath?: any[]): void {
    const unit = this.state.units.find(u => u.id === unitId);
    if (!unit) return;
    const unitDef = UNIT_ROSTER[unit.unitDefId] || unit.def;

    let path = precomputedPath;
    if (!path || path.length === 0) {
      const fromK = key(unit.c, unit.r);
      const reach = this.currentReach || bfsReach(unit, this.state.units);
      if (reach.dist.has(key(targetC, targetR))) {
        path = pathTo(reach.parent, fromK, key(targetC, targetR));
      } else {
        path = pathTo(unit.c, unit.r, targetC, targetR, unitDef.size || 1, this.state.theme, this.state.units, unit);
      }
    }

    if (!path || path.length === 0) {
      this.log.log('Path blocked by terrain or units!', 'alert');
      return;
    }

    unit.hasMoved = true;
    this.currentReach = null;
    this.scene.clearHighlights();
    sfx('footsteps');

    animateMovePath(
      unit,
      path,
      this.state.units,
      () => {
        this.refreshAwareness();
        this.selectUnit(unit.id);
        this.log.log(`${unitDef.name} advanced to coordinates [${targetC}, ${targetR}].`, 'info');
        this.checkVictoryConditions();
      },
      () => {
        this.refreshAwareness();
      }
    );
  }

  public executeAttack(attackerId: number, defenderId: number, onDone?: () => void): void {
    const attacker = this.state.units.find(u => u.id === attackerId);
    const defender = this.state.units.find(u => u.id === defenderId);
    if (!attacker || !defender || this.isBusy) {
      if (onDone) onDone();
      return;
    }

    // Hide targeting ray during attack
    this.scene.setTargetingRay(null, null, 'hidden');

    const ctrl = getActiveCameraController();
    const camera = this.scene.camera;
    const controlsTarget = ctrl ? ctrl.controls.target : new THREE.Vector3();

    resolveAttack(
      attacker,
      defender,
      this.state.units,
      this.scene.scene,
      camera,
      controlsTarget,
      (b: boolean) => {
        this.isBusy = b;
      },
      () => this.isBusy,
      () => {
        if (attacker.player === 1) {
          if (attacker.hasMoved && attacker.hasAttacked) {
            this.selectUnit(null);
          } else {
            this.selectUnit(attacker.id);
          }
        } else {
          this.selectUnit(null);
        }
        this.refreshAwareness();
        this.checkVictoryConditions();
        if (onDone) onDone();
      },
      () => {
        const sel = this.state.units.find(u => u.id === this.selectedUnitId);
        if (sel) {
          const uDef = UNIT_ROSTER[sel.unitDefId] || sel.def;
          this.datasheet.showUnit(sel, uDef);
        }
      },
      () => {
        this.checkVictoryConditions();
      }
    );
  }

  public handleRally(unit: Unit): void {
    const result = rallyUnit(unit);
    if (result.success) {
      sfx('horn');
      this.log.log(`${(UNIT_ROSTER[unit.unitDefId] || unit.def).name} rallied successfully!`, 'success');
    } else {
      this.log.log(`${(UNIT_ROSTER[unit.unitDefId] || unit.def).name} failed to rally.`, 'alert');
    }
    this.selectUnit(unit.id);
  }

  public eliminateUnit(unit: Unit): void {
    const uDef = UNIT_ROSTER[unit.unitDefId] || unit.def;
    this.log.log(`[DESTROYED] ${uDef.name} was eliminated from the sector!`, 'morale');
    sfx('explosion');
    unit.alive = false;
    unit.dead = true;
    this.scene.removeUnitMesh(unit.id);
    this.state.units = this.state.units.filter(u => u.id !== unit.id);
    this.refreshAwareness();
    if (this.selectedUnitId === unit.id) {
      this.selectUnit(null);
    }
  }

  public endTurn(): void {
    if (this.state.phase !== 'battle') return;

    if (this.state.turn === 1) {
      this.selectUnit(null);
      savePlayerCamera();

      this.state.turn = 2;
      const btn = document.getElementById('btn-end-turn') as HTMLButtonElement | null;
      if (btn) btn.disabled = true;
      this.dom.updateTurnBanner(2, this.state.round, 'battle');
      sfx('horn');
      this.startAiTurn();
    } else {
      this.state.turn = 1;
      this.state.round++;
      this.resetUnitTurnFlags();
      this.evaluateObjectives();
      this.refreshAwareness();
      this.selectUnit(null);
      restorePlayerCamera(650);

      const btn = document.getElementById('btn-end-turn') as HTMLButtonElement | null;
      if (btn) btn.disabled = false;
      this.dom.updateTurnBanner(1, this.state.round, 'battle');
      sfx('horn');
      this.checkVictoryConditions();
    }
  }

  private resetUnitTurnFlags(): void {
    this.state.units.forEach(u => {
      u.hasMoved = false;
      u.hasAttacked = false;
    });
  }

  private async startAiTurn(): Promise<void> {
    this.isExecutingAiTurn = true;
    this.selectUnit(null);
    this.log.log('--- Enemy Overseer Turn Begins ---', 'alert');

    const enemyUnits = this.state.units.filter(u => u.player === 2 && !u.dead);

    for (const unit of enemyUnits) {
      if (unit.wounds <= 0 || unit.dead) continue;
      await new Promise(r => setTimeout(r, 200));
      if (unit.wounds <= 0 || unit.dead) continue;

      const unitDef = UNIT_ROSTER[unit.unitDefId] || unit.def;
      const maxRange = Math.max(...(unitDef.weapons?.map(w => w.range) || [unit.range || 18]));

      // 1. Can we attack immediately from current position?
      const inRangeLoS = this.state.units.filter(t =>
        t.player === 1 &&
        !t.dead &&
        enemyAwareTiles.has(`${t.c},${t.r}`) &&
        chebyshevDist(unit.c, unit.r, t.c, t.r) <= maxRange &&
        hasLineOfSight(unit.c, unit.r, t.c, t.r, this.state.theme)
      );

      if (inRangeLoS.length > 0) {
        inRangeLoS.sort((a, b) => {
          if (a.isVip && !b.isVip) return -1;
          if (!a.isVip && b.isVip) return 1;
          return a.wounds - b.wounds || chebyshevDist(unit.c, unit.r, a.c, a.r) - chebyshevDist(unit.c, unit.r, b.c, b.r);
        });
        await new Promise<void>(resolve => {
          this.executeAttack(unit.id, inRangeLoS[0].id, resolve);
        });
        continue;
      }

      // 2. Otherwise advance up to full movement speed along best BFS path
      const { dist, parent } = bfsReach(unit, this.state.units);
      const spottedTargets = this.state.units.filter(t => t.player === 1 && !t.dead && enemyAwareTiles.has(`${t.c},${t.r}`));

      let best: string | null = null;
      let bestScore = Infinity;

      dist.forEach((d, k) => {
        if (d === 0) return;
        const [x, z] = k.split(',').map(Number);
        let score = 0;

        if (spottedTargets.length > 0) {
          score = Math.min(...spottedTargets.map(p => chebyshevDist(x, z, p.c, p.r)));
          const hasShot = spottedTargets.some(t =>
            chebyshevDist(x, z, t.c, t.r) <= maxRange &&
            hasLineOfSight(x, z, t.c, t.r, this.state.theme)
          );
          if (hasShot) score -= 500;
        } else {
          if (this.state.mission === 'domination' && this.state.objectives) {
            score = Math.min(...this.state.objectives.map(obj => Math.hypot(x - obj.c, z - obj.r)));
          } else if (this.state.mission === 'escort') {
            score = Math.hypot(x - 20, z - 52);
          } else {
            score = Math.hypot(x - 20, z - 48);
          }
        }

        if (score < bestScore) {
          bestScore = score;
          best = k;
        }
      });

      if (best) {
        const fromK = key(unit.c, unit.r);
        const path = pathTo(parent, fromK, best);
        if (path && path.length > 0) {
          await new Promise<void>(resolve => {
            unit.hasMoved = true;
            sfx('footsteps');
            animateMovePath(
              unit,
              path,
              this.state.units,
              () => {
                this.refreshAwareness();
                // After moving full distance, shoot if target in range & LoS
                const inRangeAfterMove = this.state.units.filter(t =>
                  t.player === 1 &&
                  !t.dead &&
                  enemyAwareTiles.has(`${t.c},${t.r}`) &&
                  chebyshevDist(unit.c, unit.r, t.c, t.r) <= maxRange &&
                  hasLineOfSight(unit.c, unit.r, t.c, t.r, this.state.theme)
                );
                if (inRangeAfterMove.length > 0 && !unit.hasAttacked) {
                  this.executeAttack(unit.id, inRangeAfterMove[0].id, resolve);
                } else {
                  resolve();
                }
              },
              () => {
                this.refreshAwareness();
              }
            );
          });
        }
      }
    }

    this.isExecutingAiTurn = false;
    this.endTurn();
  }

  private evaluateObjectives(): void {
    if (this.state.mission === 'domination' && this.state.objectives) {
      this.state.objectives.forEach(obj => {
        let p1Near = 0;
        let p2Near = 0;

        this.state.units.forEach(u => {
          if (!u.dead && chebyshevDist(u.c, u.r, obj.c, obj.r) <= obj.radius) {
            if (u.player === 1) p1Near++;
            if (u.player === 2) p2Near++;
          }
        });

        if (p1Near > p2Near) obj.controlledBy = 1;
        else if (p2Near > p1Near) obj.controlledBy = 2;

        if (obj.controlledBy === 1) this.state.p1Score += 10;
        if (obj.controlledBy === 2) this.state.p2Score += 10;
      });

      this.dom.updateMissionHud(
        'Domination',
        `Score: 🟦 ${this.state.p1Score} VP vs 🟨 ${this.state.p2Score} VP`
      );
    }
  }

  public checkVictoryConditions(): void {
    const p1Alive = this.state.units.filter(u => u.player === 1 && !u.isVip && !u.dead);
    const p2Alive = this.state.units.filter(u => u.player === 2 && !u.dead);
    const vip = this.state.units.find(u => u.isVip);

    if (this.state.mission === 'escort') {
      if (vip && (vip.wounds <= 0 || vip.dead)) {
        this.dom.showGameOver(2, 'The sacred VIP Relic Courier was destroyed!', () => {
          this.resetGameSession();
          this.dom.showHomeScreen();
        });
        return;
      }
      if (vip && chebyshevDist(vip.c, vip.r, this.state.escortTargetC, this.state.escortTargetR) <= 2) {
        this.dom.showGameOver(1, 'VIP successfully extracted to the evacuation dropship!', () => {
          this.resetGameSession();
          this.dom.showHomeScreen();
        });
        return;
      }
    }

    if (p2Alive.length === 0) {
      this.dom.showGameOver(1, 'All hostile enemy forces were completely purged!', () => {
        this.resetGameSession();
        this.dom.showHomeScreen();
      });
      return;
    }

    if (p1Alive.length === 0) {
      this.dom.showGameOver(2, 'Your strike force suffered total annihilation.', () => {
        this.resetGameSession();
        this.dom.showHomeScreen();
      });
      return;
    }

    if (this.state.round > 8) {
      if (this.state.mission === 'domination') {
        const winner = this.state.p1Score >= this.state.p2Score ? 1 : 2;
        this.dom.showGameOver(winner, `Match concluded after 8 rounds. Final Score: ${this.state.p1Score} to ${this.state.p2Score}`, () => {
          this.resetGameSession();
          this.dom.showHomeScreen();
        });
      } else {
        const winner = p1Alive.length >= p2Alive.length ? 1 : 2;
        this.dom.showGameOver(winner, `Match round limit reached. Surviving Squads: ${p1Alive.length} vs ${p2Alive.length}`, () => {
          this.resetGameSession();
          this.dom.showHomeScreen();
        });
      }
    }
  }
}

