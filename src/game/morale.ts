import * as THREE from 'three';
import { Unit, MoraleState, Team } from '../data/types';
import { logCombat } from '../ui/combat-log';
import { showWorldText } from './effects';
import { FormationSystem } from './formation';
import { cheb, inBounds, ROWS } from '../data/constants';
import { canFitUnit } from './pathfinding';
import { animateMovePath } from './movement';

export function getSurvivingFigures(unit: Unit) {
  return unit.model.userData.figures.filter((f: any) => f.alive);
}

export function restructureSquadFormation(unit: Unit): void {
  if (!unit || !unit.model || !unit.model.userData || !unit.model.userData.figures) return;
  const living = getSurvivingFigures(unit);
  if (!living.length) return;
  const fType = (unit.def.formation && unit.def.formation.type) || 'wedge';
  const spacing = (unit.def.formation && unit.def.formation.spacing) || 1.45;
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
    .filter(u => u.alive && u.team !== unit.team)
    .forEach(enemy => {
      const d = cheb(unit, enemy);
      if (d < minDist) {
        minDist = d;
        nearestEnemy = enemy;
      }
    });

  const homeZ = unit.team === 'player' ? 52 : 2;
  const dirX = nearestEnemy
    ? Math.sign(unit.x - nearestEnemy.x) || (Math.random() < 0.5 ? 1 : -1)
    : 0;
  const dirZ = Math.sign(homeZ - unit.z) || (unit.team === 'player' ? 1 : -1);

  let bestTile: { x: number; z: number } | null = null;
  const candidates = [
    { x: unit.x + dirX * 2, z: unit.z + dirZ * 2 },
    { x: unit.x + dirX, z: unit.z + dirZ * 2 },
    { x: unit.x, z: unit.z + dirZ * 2 },
    { x: unit.x + dirX * 2, z: unit.z + dirZ },
    { x: unit.x + dirX, z: unit.z + dirZ }
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
          logCombat(`🏃 <b>${unit.name}</b> broke rank and fled in panic!`, unit.team, true);
        });
      }
    }, 450);
  }
}

export const MoraleSystem = {
  getCohesionFactor(state: MoraleState): number {
    switch (state) {
      case 'STEADY':
        return 1.0;
      case 'SHAKEN':
        return 0.75;
      case 'DISTRESSED':
        return 0.4;
      case 'PANICKED':
        return 0.15;
      case 'BROKEN':
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
        return '#34d399';
      case 'SHAKEN':
        return '#facc15';
      case 'DISTRESSED':
        return '#fb923c';
      case 'PANICKED':
        return '#f87171';
      case 'BROKEN':
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
    if (!unit || !unit.morale) return;
    const loss = dmg * 5 + casualties * (unit.morale.casualtyPenalty || 20);
    const oldState = unit.morale.state;
    unit.morale.current = Math.max(0, unit.morale.current - loss);
    unit.morale.state = this.getState(unit.morale.current);

    if (unit.morale.state !== oldState) {
      const color = this.getStateColor(unit.morale.state);
      showWorldText(
        `MORALE: ${unit.morale.state}!`,
        unit.model.position.clone().add(new THREE.Vector3(0, 3, 0)),
        color
      );
      logCombat(
        `<b>${unit.name}</b> morale dropped to <b style="color:${color}">${unit.morale.state}</b> (${unit.morale.current}%)!`,
        unit.team,
        true
      );

      if (unit.morale.state === 'BROKEN') {
        triggerBrokenFlee(unit, unitsList, isBusy);
      }
    }
  },

  rallyRoundStart(team: Team, unitsList: Unit[]): void {
    unitsList
      .filter(u => u.alive && u.team === team && u.morale)
      .forEach(u => {
        const oldState = u.morale.state;
        u.morale.current = Math.min(100, u.morale.current + (u.morale.recoverRate || 15));
        u.morale.state = this.getState(u.morale.current);
        if (oldState === 'BROKEN' && u.morale.state !== 'BROKEN') {
          showWorldText(
            'RALLIED!',
            u.model.position.clone().add(new THREE.Vector3(0, 3, 0)),
            '#34d399'
          );
          logCombat(`<b>${u.name}</b> has <b style="color:#34d399">RALLIED</b> and reformed rank!`, u.team);
          restructureSquadFormation(u);
        }
      });
  }
};
