import { GRID_COLS, GRID_ROWS, DEPLOYMENT_ZONES, chebyshevDist, gridToWorld } from '../data/constants';
import { FACTIONS } from '../data/factions';
import { UNIT_ROSTER } from '../data/units';
import { updateFogOfWar, hasLineOfSight } from './awareness';
import { resolveAttack } from './combat';
import { rallyUnit } from './morale';
import { pathTo } from './pathfinding';
import { PhysicsEngine } from './physics';
import { sfx } from '../audio/synth';
import type { GameState, Unit, UnitDef, MissionType } from '../data/types';
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
      escortTargetR: 4
    };
  }

  public startNewGame(p1Faction: string, p2Faction: string, theme: string, mission: MissionType): void {
    this.state = this.createInitialState();
    this.state.theme = theme;
    this.state.mission = mission;

    const f1 = FACTIONS[p1Faction] || FACTIONS.space_marines;
    const f2 = FACTIONS[p2Faction] || FACTIONS.chaos_marines;

    this.state.p1Roster = [...f1.roster];
    this.state.p2Roster = [...f2.roster];
    this.state.p1Deployed = new Array(f1.roster.length).fill(false);
    this.state.p2Deployed = new Array(f2.roster.length).fill(false);

    this.scene.initBoard(theme);

    // Domination Objectives
    if (mission === 'domination') {
      this.state.objectives = [
        { id: 1, c: 10, r: 28, radius: 2, controlledBy: 0, points: 0 },
        { id: 2, c: 20, r: 28, radius: 2, controlledBy: 0, points: 0 },
        { id: 3, c: 30, r: 28, radius: 2, controlledBy: 0, points: 0 }
      ];
    }

    // Deploy Enemy (AI) automatically
    this.autoDeployPlayer(2, f2.roster);

    // Escort VIP spawning
    if (mission === 'escort') {
      const vipDef = UNIT_ROSTER.vip_courier;
      this.deployUnitOnBoard(vipDef, 1, 20, 50, true);
    }

    this.scene.cameraController.frameDeploymentZone();
    this.log.log(`Battle initialized on ${theme.toUpperCase()} biome. Mission: ${mission.toUpperCase()}`, 'info');
  }

  public autoDeployPlayer(player: number, roster: UnitDef[]): void {
    const zone = player === 1 ? DEPLOYMENT_ZONES.player1 : DEPLOYMENT_ZONES.player2;
    let placed = 0;

    for (let r = zone.minR; r <= zone.maxR; r += 2) {
      for (let c = zone.minC + 2; c <= zone.maxC - 2; c += 3) {
        if (placed >= roster.length) break;
        if (!this.state.units.some(u => u.c === c && u.r === r)) {
          this.deployUnitOnBoard(roster[placed], player, c, r);
          if (player === 1) this.state.p1Deployed[placed] = true;
          if (player === 2) this.state.p2Deployed[placed] = true;
          placed++;
        }
      }
      if (placed >= roster.length) break;
    }
  }

  public deployUnitOnBoard(unitDef: UnitDef, player: number, c: number, r: number, isVip: boolean = false): Unit {
    const worldPos = gridToWorld(c, r);
    const faction = Object.values(FACTIONS).find(f => f.roster?.some(u => u.id === unitDef.id || u.type === unitDef.type));

    const unit: Unit = {
      id: this.nextUnitId++,
      unitDefId: unitDef.id || unitDef.type,
      type: unitDef.type || unitDef.id,
      player,
      team: player === 1 ? 'player' : 'enemy',
      name: unitDef.name,
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
    updateFogOfWar(this.state);
    this.scene.fowManager.updateVisibility(this.state.fow);
    this.dom.updateTurnBanner(1, 1, 'battle');
    sfx('horn');
    this.log.log('Deployment complete! Combat begins.', 'alert');
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

        this.datasheet.showUnit(unit, unitDef, (action) => {
          if (action === 'move') this.enterMoveMode();
          if (action === 'shoot') this.enterShootMode();
          if (action === 'rally') this.handleRally(unit);
        });
        return;
      }
    }

    this.datasheet.hide();
  }

  public enterMoveMode(): void {
    if (this.selectedUnitId === null) return;
    const unit = this.state.units.find(u => u.id === this.selectedUnitId);
    if (!unit || unit.hasMoved) return;

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
            reachTiles.push({ c: nc, r: nr });
          }
        }
      }
    }

    this.scene.clearHighlights();
    this.scene.highlightTiles(reachTiles, 0x00f3ff, 0.4);
    this.log.log(`Select destination for ${unitDef.name}`, 'info');
  }

  public enterShootMode(): void {
    if (this.selectedUnitId === null) return;
    const unit = this.state.units.find(u => u.id === this.selectedUnitId);
    if (!unit || unit.hasAttacked) return;

    this.actionMode = 'shoot';
    const unitDef = UNIT_ROSTER[unit.unitDefId] || unit.def;
    const maxRange = Math.max(...(unitDef.weapons?.map(w => w.range) || [unit.range || 18]));

    const targetTiles: Array<{ c: number; r: number }> = [];
    this.state.units.forEach(enemy => {
      if (enemy.player !== unit.player) {
        const dist = chebyshevDist(unit.c, unit.r, enemy.c, enemy.r);
        if (dist <= maxRange && hasLineOfSight(unit.c, unit.r, enemy.c, enemy.r, this.state.theme)) {
          targetTiles.push({ c: enemy.c, r: enemy.r });
        }
      }
    });

    this.scene.clearHighlights();
    this.scene.highlightTiles(targetTiles, 0xff2a6d, 0.5);
    this.log.log(`Select hostile target in Line of Sight for ${unitDef.name}`, 'info');
  }

  public handleTileClick(c: number, r: number): void {
    if (this.state.phase === 'deployment') {
      return;
    }

    if (this.state.turn !== 1 || this.isExecutingAiTurn) return;

    // Check if clicked an existing unit
    const clickedUnit = this.state.units.find(u => u.c === c && u.r === r);

    if (this.actionMode === 'move' && this.selectedUnitId !== null) {
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

    const path = pathTo(unit.c, unit.r, targetC, targetR, unitDef.size || 1, this.state.theme, this.state.units);
    if (!path || path.length === 0) {
      this.log.log('Path blocked by terrain or units!', 'alert');
      return;
    }

    unit.c = targetC;
    unit.r = targetR;
    const worldPos = gridToWorld(targetC, targetR);
    unit.x = worldPos.x;
    unit.z = worldPos.z;
    unit.anchor = { x: worldPos.x, z: worldPos.z };
    unit.hasMoved = true;
    sfx('footsteps');

    const mesh = this.scene.unitMeshes.get(unit.id);
    if (mesh) {
      mesh.position.set(worldPos.x, 0, worldPos.z);
    }

    updateFogOfWar(this.state);
    this.scene.fowManager.updateVisibility(this.state.fow);
    this.selectUnit(unit.id);
    this.log.log(`${unitDef.name} repositioned.`, 'info');
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

    this.log.log(`[COMBAT] ${attackerDef.name} attacks ${defenderDef.name}: ${result.totalDamage} Damage dealt! (${result.casualties} casualties)`, 'combat');

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
    this.log.log(`[CASUALTY] ${uDef.name} was destroyed!`, 'morale');
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
    this.log.log('--- Enemy Turn Begins ---', 'alert');

    const enemyUnits = this.state.units.filter(u => u.player === 2);

    for (const unit of enemyUnits) {
      await new Promise(r => setTimeout(r, 600));
      if (unit.wounds <= 0 || unit.dead) continue;

      // Find closest player unit
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
          // Move towards target
          const dc = Math.sign(closestTarget.c - unit.c);
          const dr = Math.sign(closestTarget.r - unit.r);
          const targetC = Math.max(0, Math.min(GRID_COLS - 1, unit.c + dc * 2));
          const targetR = Math.max(0, Math.min(GRID_ROWS - 1, unit.r + dr * 2));
          
          unit.c = targetC;
          unit.r = targetR;
          const worldPos = gridToWorld(targetC, targetR);
          unit.x = worldPos.x;
          unit.z = worldPos.z;
          unit.anchor = { x: worldPos.x, z: worldPos.z };

          const mesh = this.scene.unitMeshes.get(unit.id);
          if (mesh) {
            mesh.position.set(worldPos.x, 0, worldPos.z);
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
          if (chebyshevDist(u.c, u.r, obj.c, obj.r) <= obj.radius) {
            if (u.player === 1) p1Near++;
            if (u.player === 2) p2Near++;
          }
        });

        if (p1Near > p2Near) obj.controlledBy = 1;
        else if (p2Near > p1Near) obj.controlledBy = 2;

        if (obj.controlledBy === 1) this.state.p1Score += 10;
        if (obj.controlledBy === 2) this.state.p2Score += 10;
      });

      this.dom.updateMissionScore(`Domination Points: Player [${this.state.p1Score}] - Enemy [${this.state.p2Score}]`);
    }
  }

  public checkVictoryConditions(): void {
    const p1Alive = this.state.units.filter(u => u.player === 1 && !u.isVip && !u.dead);
    const p2Alive = this.state.units.filter(u => u.player === 2 && !u.dead);
    const vip = this.state.units.find(u => u.isVip);

    if (this.state.mission === 'escort') {
      if (vip && (vip.wounds <= 0 || vip.dead)) {
        this.dom.showGameOver(2, 'The sacred VIP Relic Courier was destroyed!', () => this.dom.showScreen('lobby'));
        return;
      }
      if (vip && chebyshevDist(vip.c, vip.r, this.state.escortTargetC, this.state.escortTargetR) <= 2) {
        this.dom.showGameOver(1, 'VIP successfully extracted to the evacuation dropship!', () => this.dom.showScreen('lobby'));
        return;
      }
    }

    if (p2Alive.length === 0) {
      this.dom.showGameOver(1, 'All hostile enemy forces were completely purged!', () => this.dom.showScreen('lobby'));
      return;
    }

    if (p1Alive.length === 0) {
      this.dom.showGameOver(2, 'Your strike force suffered total annihilation.', () => this.dom.showScreen('lobby'));
      return;
    }

    if (this.state.round > 6) {
      if (this.state.mission === 'domination') {
        const winner = this.state.p1Score >= this.state.p2Score ? 1 : 2;
        this.dom.showGameOver(winner, `Match concluded after 6 rounds. Final Score: ${this.state.p1Score} to ${this.state.p2Score}`, () => this.dom.showScreen('lobby'));
      } else {
        const winner = p1Alive.length >= p2Alive.length ? 1 : 2;
        this.dom.showGameOver(winner, `Match limit reached. Majority units standing: ${p1Alive.length} vs ${p2Alive.length}`, () => this.dom.showScreen('lobby'));
      }
    }
  }
}
