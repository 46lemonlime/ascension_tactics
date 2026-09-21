import { GRID_COLS, GRID_ROWS, DEPLOYMENT_ZONES, chebyshevDist, gridToWorld } from '../data/constants';
import { FACTIONS } from '../data/factions';
import { UNIT_ROSTER } from '../data/units';
import { buildFactionRosters } from '../data/rosters';
import { updateFogOfWar, hasLineOfSight } from './awareness';
import { resolveAttack } from './combat';
import { rallyUnit } from './morale';
import { pathTo } from './pathfinding';
import { PhysicsEngine } from './physics';
import { animateMovePath } from './movement';
import { clearTweens } from './effects';
import { sfx } from '../audio/synth';
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
  public actionMode: 'idle' | 'move' | 'shoot' = 'idle';
  public isExecutingAiTurn: boolean = false;
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

  private createInitialState(): GameState {
    const fow: number[][] = [];
    for (let r = 0; r < GRID_ROWS; r++) {
      fow[r] = new Array(GRID_COLS).fill(0);
    }

    return {
      mission: 'extermination',
      theme: 'jungle',
      turn: 1,
      round: 1,
      phase: 'deployment',
      units: [],
      fow,
      p1Score: 0,
      p2Score: 0,
      p1Roster: [],
      p2Roster: [],
      p1Deployed: [],
      p2Deployed: [],
      escortTargetC: Math.floor(GRID_COLS / 2),
      escortTargetR: 4,
      rosterPlayer: [],
      rosterEnemy: []
    };
  }

  public resetGameSession(): void {
    // 1. Clear all Tweens & Floaters
    clearTweens();

    // 2. Remove all existing unit 3D meshes from Three.js scene and clear tracking
    this.scene.unitMeshes.forEach(mesh => {
      this.scene.scene.remove(mesh);
    });
    this.scene.unitMeshes.clear();

    // 3. Clear scene highlights and targeting rings
    this.scene.clearHighlights();

    // 4. Hide datasheet & clear selection
    this.selectedUnitId = null;
    this.actionMode = 'idle';
    this.isExecutingAiTurn = false;
    this.datasheet.hide();

    // 5. Reset internal state
    this.state = this.createInitialState();

    // 6. Reset combat log
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
    updateFogOfWar(this.state);

    const p1Name = (FACTIONS[p1Faction] || FACTIONS.marines).name;
    const p2Name = (FACTIONS[p2Faction] || FACTIONS.chaos).name;
    this.dom.updateMissionHud(mission, `${p1Name} vs ${p2Name}`);
    this.log.log(`Warzone initialized: ${theme.toUpperCase()} theater. Mission: ${mission.toUpperCase()}. Deploy your strike force.`, 'info');
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

    sfx('footsteps');
    return unit;
  }

  public undeployPlayerCard(cardKey: string): void {
    const card = this.state.rosterPlayer?.find(cd => cd.key === cardKey);
    if (card && card.unitRef) {
      this.scene.removeUnitMesh(card.unitRef.id);
      this.state.units = this.state.units.filter(u => u.id !== card.unitRef!.id);
      card.placed = false;
      card.x = null;
      card.z = null;
      card.unitRef = null;
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

    updateFogOfWar(this.state);
    this.dom.updateTurnBanner(1, 1, 'battle');
    sfx('horn');
    this.log.log('Deployment complete! Combat commences.', 'alert');
  }

  public selectUnit(unitId: number | null): void {
    this.selectedUnitId = unitId;
    this.actionMode = 'idle';
    this.scene.clearHighlights();

    // Hide all selection rings
    this.scene.unitMeshes.forEach(mesh => {
      const ring = mesh.getObjectByName('selection_ring');
      if (ring) ring.visible = false;
    });

    if (unitId !== null) {
      const unit = this.state.units.find(u => u.id === unitId);
      if (unit) {
        const unitDef = UNIT_ROSTER[unit.unitDefId] || unit.def;
        const mesh = this.scene.unitMeshes.get(unit.id);
        if (mesh) {
          const ring = mesh.getObjectByName('selection_ring');
          if (ring) ring.visible = true;
        }

        this.datasheet.showUnit(unit, unitDef);

        // If player unit and can act, highlight range
        if (unit.player === 1 && !unit.isVip) {
          if (!unit.hasMoved) {
            this.enterMoveMode();
          } else if (!unit.hasAttacked) {
            this.enterShootMode();
          }
        }
        return;
      }
    }

    this.datasheet.hide();
  }

  public enterMoveMode(): void {
    if (this.selectedUnitId === null) return;
    const unit = this.state.units.find(u => u.id === this.selectedUnitId);
    if (!unit || unit.hasMoved || unit.isVip) return;

    this.actionMode = 'move';
    const unitDef = UNIT_ROSTER[unit.unitDefId] || unit.def;
    const moveRange = unitDef.movement || unit.m || 6;
    const reachTiles: Array<{ c: number; r: number }> = [];

    for (let dr = -moveRange; dr <= moveRange; dr++) {
      for (let dc = -moveRange; dc <= moveRange; dc++) {
        const nc = unit.c + dc;
        const nr = unit.r + dr;
        if (nc >= 0 && nc < GRID_COLS && nr >= 0 && nr < GRID_ROWS) {
          if (chebyshevDist(unit.c, unit.r, nc, nr) <= moveRange) {
            if (!this.state.units.some(u => u.c === nc && u.r === nr && u.id !== unit.id)) {
              reachTiles.push({ c: nc, r: nr });
            }
          }
        }
      }
    }

    this.scene.clearHighlights();
    this.scene.highlightTiles(reachTiles, 0x00f3ff, 0.4);
    this.log.log(`[TACTICAL] Select destination tile for ${unitDef.name} (${moveRange}" movement).`, 'info');
  }

  public enterShootMode(): void {
    if (this.selectedUnitId === null) return;
    const unit = this.state.units.find(u => u.id === this.selectedUnitId);
    if (!unit || unit.hasAttacked || unit.isVip) return;

    this.actionMode = 'shoot';
    const unitDef = UNIT_ROSTER[unit.unitDefId] || unit.def;
    const maxRange = Math.max(...(unitDef.weapons?.map(w => w.range) || [unit.range || 18]));

    const targetTiles: Array<{ c: number; r: number }> = [];
    this.state.units.forEach(enemy => {
      if (enemy.player !== unit.player && !enemy.dead) {
        const dist = chebyshevDist(unit.c, unit.r, enemy.c, enemy.r);
        if (dist <= maxRange && hasLineOfSight(unit.c, unit.r, enemy.c, enemy.r, this.state.theme)) {
          targetTiles.push({ c: enemy.c, r: enemy.r });
        }
      }
    });

    this.scene.clearHighlights();
    if (targetTiles.length > 0) {
      this.scene.highlightTiles(targetTiles, 0xff2a6d, 0.5);
      this.log.log(`[TARGETING] Hostiles in Line of Sight for ${unitDef.name}. Click red target to fire.`, 'combat');
    } else {
      this.log.log(`No valid hostiles in weapon range/Line of Sight for ${unitDef.name}.`, 'info');
    }
  }

  public handleTileClick(c: number, r: number): void {
    if (this.state.phase === 'deployment') return;
    if (this.state.turn !== 1 || this.isExecutingAiTurn) return;

    const clickedUnit = this.state.units.find(u => u.c === c && u.r === r && !u.dead);

    if (this.actionMode === 'move' && this.selectedUnitId !== null && !clickedUnit) {
      this.executeMove(this.selectedUnitId, c, r);
      return;
    }

    if (this.actionMode === 'shoot' && this.selectedUnitId !== null && clickedUnit) {
      if (clickedUnit.player !== 1) {
        this.executeAttack(this.selectedUnitId, clickedUnit.id);
        return;
      }
    }

    if (clickedUnit) {
      this.selectUnit(clickedUnit.id);
    } else {
      this.selectUnit(null);
    }
  }

  public executeMove(unitId: number, targetC: number, targetR: number): void {
    const unit = this.state.units.find(u => u.id === unitId);
    if (!unit) return;
    const unitDef = UNIT_ROSTER[unit.unitDefId] || unit.def;
    const moveRange = unitDef.movement || unit.m || 6;

    const dist = chebyshevDist(unit.c, unit.r, targetC, targetR);
    if (dist > moveRange) {
      this.log.log('Target tile is out of movement range!', 'alert');
      return;
    }

    const path = pathTo(unit.c, unit.r, targetC, targetR, unitDef.size || 1, this.state.theme, this.state.units, unit);
    if (!path || path.length === 0) {
      this.log.log('Path blocked by terrain or units!', 'alert');
      return;
    }

    unit.hasMoved = true;
    this.actionMode = 'idle';
    this.scene.clearHighlights();
    sfx('footsteps');

    animateMovePath(
      unit,
      path,
      this.state.units,
      () => {
        updateFogOfWar(this.state);
        this.selectUnit(unit.id);
        this.log.log(`${unitDef.name} advanced to coordinates [${targetC}, ${targetR}].`, 'info');

        // Automatically transition to shoot mode if targets exist
        if (!unit.hasAttacked) {
          this.enterShootMode();
        }
        this.checkVictoryConditions();
      },
      () => {
        updateFogOfWar(this.state);
      }
    );
  }

  public executeAttack(attackerId: number, defenderId: number): void {
    const attacker = this.state.units.find(u => u.id === attackerId);
    const defender = this.state.units.find(u => u.id === defenderId);
    if (!attacker || !defender) return;

    const attackerDef = UNIT_ROSTER[attacker.unitDefId] || attacker.def;
    const defenderDef = UNIT_ROSTER[defender.unitDefId] || defender.def;

    // Check FoW gating for action camera
    const isDefenderInFoW = this.state.fow[defender.r]?.[defender.c] !== 2;
    if (!isDefenderInFoW) {
      const aPos = gridToWorld(attacker.c, attacker.r);
      const dPos = gridToWorld(defender.c, defender.r);
      this.scene.cameraController.triggerActionCamera(new THREE.Vector3(aPos.x, 0, aPos.z), new THREE.Vector3(dPos.x, 0, dPos.z));
    }

    sfx('bolter');
    const result = resolveAttack(attacker, defender);
    attacker.hasAttacked = true;

    this.log.log(`[COMBAT] ${attackerDef.name} opened fire on ${defenderDef.name}: ${result.totalDamage} Damage dealt! (${result.casualties} casualties)`, 'combat');

    if (defender.wounds <= 0 || defender.hp <= 0) {
      this.eliminateUnit(defender);
    }

    this.selectUnit(attacker.id);
    this.checkVictoryConditions();
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
    if (this.selectedUnitId === unit.id) {
      this.selectUnit(null);
    }
  }

  public endTurn(): void {
    if (this.state.turn === 1) {
      this.state.turn = 2;
      this.dom.updateTurnBanner(2, this.state.round, 'battle');
      this.startAiTurn();
    } else {
      this.state.turn = 1;
      this.state.round++;
      this.resetUnitTurnFlags();
      this.evaluateObjectives();
      this.dom.updateTurnBanner(1, this.state.round, 'battle');
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
      await new Promise(r => setTimeout(r, 600));
      if (unit.wounds <= 0 || unit.dead) continue;

      // Find closest visible player unit (AI cannot target units in FoW)
      let closestTarget: Unit | null = null;
      let minDist = 999;

      this.state.units.forEach(pUnit => {
        if (pUnit.player === 1 && !pUnit.dead) {
          const d = chebyshevDist(unit.c, unit.r, pUnit.c, pUnit.r);
          if (d < minDist) {
            minDist = d;
            closestTarget = pUnit;
          }
        }
      });

      if (closestTarget) {
        const unitDef = UNIT_ROSTER[unit.unitDefId] || unit.def;
        const maxRange = Math.max(...(unitDef.weapons?.map(w => w.range) || [unit.range || 18]));

        if (minDist <= maxRange && hasLineOfSight(unit.c, unit.r, closestTarget.c, closestTarget.r, this.state.theme)) {
          this.executeAttack(unit.id, closestTarget.id);
        } else {
          // Advance towards target
          const dc = Math.sign(closestTarget.c - unit.c);
          const dr = Math.sign(closestTarget.r - unit.r);
          const targetC = Math.max(0, Math.min(GRID_COLS - 1, unit.c + dc * 2));
          const targetR = Math.max(0, Math.min(GRID_ROWS - 1, unit.r + dr * 2));

          if (!this.state.units.some(u => u.c === targetC && u.r === targetR && u.id !== unit.id)) {
            const path = pathTo(unit.c, unit.r, targetC, targetR, unitDef.size || 1, this.state.theme, this.state.units, unit);
            if (path && path.length > 0) {
              await new Promise<void>(resolve => {
                unit.hasMoved = true;
                sfx('footsteps');
                animateMovePath(
                  unit,
                  path,
                  this.state.units,
                  () => {
                    updateFogOfWar(this.state);
                    resolve();
                  },
                  () => {
                    updateFogOfWar(this.state);
                  }
                );
              });
            }
          }
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

