import { Unit } from '../data/types';
import { inBounds, key, DIRS } from '../data/constants';
import { OBSTACLES } from '../data/themes';

export function canFitUnit(
  gx: number,
  gz: number,
  _sz = 1,
  ignoreUnit: Unit | null = null,
  unitsList: Unit[] = []
): boolean {
  if (!inBounds(gx, gz)) return false;
  if (OBSTACLES.has(key(gx, gz))) return false;
  for (const u of unitsList) {
    if (!u.alive || u === ignoreUnit) continue;
    if (u.x === gx && u.z === gz) return false;
  }
  return true;
}

export function isBlocked(
  x: number,
  z: number,
  sz = 1,
  ignoreUnit: Unit | null = null,
  unitsList: Unit[] = []
): boolean {
  return !canFitUnit(x, z, sz, ignoreUnit, unitsList);
}

export function bfsReach(
  unit: Unit,
  unitsList: Unit[]
): { dist: Map<string, number>; parent: Map<string, string> } {
  if (unit.morale && unit.morale.state === 'BROKEN') {
    return { dist: new Map(), parent: new Map() };
  }
  const dist = new Map<string, number>([[key(unit.x, unit.z), 0]]);
  const parent = new Map<string, string>();
  const q: [number, number][] = [[unit.x, unit.z]];

  while (q.length) {
    const [x, z] = q.shift()!;
    const d = dist.get(key(x, z))!;
    if (d >= unit.m) continue;

    for (const [dx, dz] of DIRS) {
      const nx = x + dx;
      const nz = z + dz;
      const k = key(nx, nz);
      if (dist.has(k)) continue;
      if (!canFitUnit(nx, nz, 1, unit, unitsList)) continue;
      dist.set(k, d + 1);
      parent.set(k, key(x, z));
      q.push([nx, nz]);
    }
  }

  return { dist, parent };
}

export function pathTo(
  parent: Map<string, string>,
  fromK: string,
  toK: string
): { x: number; z: number }[] {
  const path: { x: number; z: number }[] = [];
  let k = toK;
  while (k !== fromK) {
    const [x, z] = k.split(',').map(Number);
    path.unshift({ x, z });
    const p = parent.get(k);
    if (!p) break;
    k = p;
  }
  return path;
}
