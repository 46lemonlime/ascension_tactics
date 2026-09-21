import * as THREE from 'three';
import type { Unit, MoraleState, Team } from '../data/types';
import { logCombat } from '../ui/combat-log';
import { showWorldText } from './effects';
import { FormationSystem } from './formation';
import { cheb, inBounds, ROWS } from '../data/constants';
import { canFitUnit } from './pathfinding';
import { animateMovePath } from './movement';

export function getSurvivingFigures(unit: Unit) {
  if (!unit || !unit.model || !unit.model.userData || !unit.model.userData.figures) return [];
  return unit.model.userData.figures.filter((f: any) => f.alive);
}

export function restructureSquadFormation(unit: Unit): void {
  if (!unit || !unit.model || !unit.model.userData || !unit.model.userData.figures) return;
  const living = getSurvivingFigures(unit);
  if (!living.length) return;
  const fType = (unit.def?.formation && unit.def.formation.type) || 'wedge';
  const spacing = (unit.def?.formation && unit.def.formation.spacing) || 1.45;
  const newOffsets = FormationSystem.getOffsets(unit.squadSize, fType, spacing, living.length);

  const anchorX = unit.model.position.x;
  const anchorZ = unit.model.position.z;
  const angle = unit.model.rotation.y;

  living.forEach((fig: any, idx: number) => {
    fig.offset = newOffsets[idx] || { x: 0, z: 0 };
    const off = fig.offset;
    const wx = anchorX + (off.x * Math.cos(angle) - off.z * Math.sin(angle));
    const wz = anchorZ + (off.x * Math.sin(angle) + off.z * Math.cos(angle));
    fig.targetX = wx;
    fig.targetZ = wz;
  });
}

export function triggerBrokenFlee(unit: Unit, unitsList: Unit[], isBusy: () => boolean): void {
  if (!unit || !unit.alive) return;

  let nearestEnemy: Unit | null = null;
  let minDist = 9999;
  unitsList
    .filter(u => u.alive && (u.team !== unit.team || u.player !== unit.player))
    .forEach(enemy => {
      const d = cheb(unit, enemy);
      if (d < minDist) {
        minDist = d;
        nearestEnemy = enemy;
      }
    });

  const homeZ = unit.team === 'player' || unit.player === 1 ? 52 : 2;
  const ux = unit.c !== undefined ? unit.c : unit.x;
  const uz = unit.r !== undefined ? unit.r : unit.z;
  const ex = nearestEnemy ? (nearestEnemy.c !== undefined ? nearestEnemy.c : nearestEnemy.x) : ux;
  const dirX = nearestEnemy
    ? Math.sign(ux - ex) || (Math.random() < 0.5 ? 1 : -1)
    : 0;
  const dirZ = Math.sign(homeZ - uz) || (unit.player === 1 ? 1 : -1);

  let bestTile: { x: number; z: number } | null = null;
  const candidates = [
    { x: ux + dirX * 2, z: uz + dirZ * 2 },
    { x: ux + dirX, z: uz + dirZ * 2 },
    { x: ux, z: uz + dirZ * 2 },
    { x: ux + dirX * 2, z: uz + dirZ },
    { x: ux + dirX, z: uz + dirZ }
  ];

  for (const c of candidates) {
    if (inBounds(c.x, c.z) && canFitUnit(c.x, c.z, 1, unit, unitsList)) {
      bestTile = c;
      break;
    }
  }

  if (bestTile) {
    const fleePath = [{ x: bestTile.x, z: bestTile.z }];
    setTimeout(() => {
      if (unit.alive && !isBusy()) {
        animateMovePath(unit, fleePath, unitsList, () => {
          showWorldText(
            'FLEEING!',
            unit.model.position.clone().add(new THREE.Vector3(0, 3, 0)),
            '#dc2626'
          );
          logCombat(`🏃 <b>${unit.name}</b> broke rank and fled in panic!`, 'morale');
        });
      }
    }, 450);
  }
}

export const MoraleSystem = {
  getCohesionFactor(state: MoraleState): number {
    switch (state) {
      case 'STEADY':
      case 'steady':
        return 1.0;
      case 'SHAKEN':
      case 'shaken':
        return 0.75;
      case 'DISTRESSED':
        return 0.4;
      case 'PANICKED':
        return 0.15;
      case 'BROKEN':
      case 'broken':
        return 0.0;
      default:
        return 1.0;
    }
  },

  getState(val: number): MoraleState {
    if (val >= 60) return 'STEADY';
    if (val >= 40) return 'SHAKEN';
    if (val >= 20) return 'DISTRESSED';
    if (val >= 10) return 'PANICKED';
    return 'BROKEN';
  },

  getStateColor(state: MoraleState): string {
    switch (state) {
      case 'STEADY':
      case 'steady':
        return '#34d399';
      case 'SHAKEN':
      case 'shaken':
        return '#facc15';
      case 'DISTRESSED':
        return '#fb923c';
      case 'PANICKED':
        return '#f87171';
      case 'BROKEN':
      case 'broken':
        return '#dc2626';
      default:
        return '#34d399';
    }
  },

  applyDamage(
    unit: Unit,
    dmg: number,
    casualties: number,
    unitsList: Unit[],
    isBusy: () => boolean
  ): void {
    if (!unit) return;
    const moraleObj = typeof unit.morale === 'object' ? unit.morale : null;
    if (moraleObj) {
      const loss = dmg * 5 + casualties * (moraleObj.casualtyPenalty || 20);
      const oldState = moraleObj.state;
      moraleObj.current = Math.max(0, moraleObj.current - loss);
      moraleObj.state = this.getState(moraleObj.current);
      unit.moraleState = moraleObj.state === 'BROKEN' ? 'broken' : moraleObj.state === 'SHAKEN' ? 'shaken' : 'steady';

      if (moraleObj.state !== oldState) {
        const color = this.getStateColor(moraleObj.state);
        showWorldText(
          `MORALE: ${moraleObj.state}!`,
          unit.model.position.clone().add(new THREE.Vector3(0, 3, 0)),
          color
        );
        logCombat(
          `<b>${unit.name}</b> morale dropped to <b style="color:${color}">${moraleObj.state}</b> (${moraleObj.current}%)!`,
          'morale'
        );

        if (moraleObj.state === 'BROKEN') {
          unit.isBroken = true;
          triggerBrokenFlee(unit, unitsList, isBusy);
        }
      }
    } else {
      const currentVal = typeof unit.morale === 'number' ? unit.morale : 7;
      if (casualties > 0) {
        const test = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
        if (test > currentVal) {
          unit.moraleState = 'broken';
          unit.isBroken = true;
          logCombat(`<b>${unit.name}</b> failed battleshock test and is BROKEN!`, 'morale');
          triggerBrokenFlee(unit, unitsList, isBusy);
        }
      }
    }
  },

  rallyRoundStart(team: Team, unitsList: Unit[]): void {
    unitsList
      .filter(u => u.alive && u.team === team && u.morale)
      .forEach(u => {
        if (typeof u.morale === 'object') {
          const oldState = u.morale.state;
          u.morale.current = Math.min(100, u.morale.current + (u.morale.recoverRate || 15));
          u.morale.state = this.getState(u.morale.current);
          u.moraleState = u.morale.state === 'BROKEN' ? 'broken' : u.morale.state === 'SHAKEN' ? 'shaken' : 'steady';
          if (oldState === 'BROKEN' && u.morale.state !== 'BROKEN') {
            u.isBroken = false;
            showWorldText(
              'RALLIED!',
              u.model.position.clone().add(new THREE.Vector3(0, 3, 0)),
              '#34d399'
            );
            logCombat(`<b>${u.name}</b> has <b style="color:#34d399">RALLIED</b> and reformed rank!`, 'morale');
            restructureSquadFormation(u);
          }
        }
      });
  }
};

export function rallyUnit(unit: Unit): { success: boolean } {
  if (!unit) return { success: false };
  if (typeof unit.morale === 'object') {
    unit.morale.current = Math.min(100, unit.morale.current + 40);
    unit.morale.state = MoraleSystem.getState(unit.morale.current);
    unit.moraleState = unit.morale.state === 'BROKEN' ? 'broken' : unit.morale.state === 'SHAKEN' ? 'shaken' : 'steady';
  } else {
    unit.morale = unit.maxMorale || 7;
    unit.moraleState = 'steady';
  }
  unit.isBroken = false;
  return { success: true };
}
