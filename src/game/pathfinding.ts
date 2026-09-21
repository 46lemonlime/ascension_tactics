import type { Unit } from '../data/types';
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
    if (!u.alive || u.dead || u === ignoreUnit) continue;
    const ux = u.c !== undefined ? u.c : u.x;
    const uz = u.r !== undefined ? u.r : u.z;
    if (ux === gx && uz === gz) return false;
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
  if (unit.moraleState === 'broken' || (typeof unit.morale === 'object' && unit.morale.state === 'BROKEN')) {
    return { dist: new Map(), parent: new Map() };
  }
  const ux = unit.c !== undefined ? unit.c : unit.x;
  const uz = unit.r !== undefined ? unit.r : unit.z;
  const dist = new Map<string, number>([[key(ux, uz), 0]]);
  const parent = new Map<string, string>();
  const q: [number, number][] = [[ux, uz]];
  const moveRange = unit.m || 6;

  while (q.length) {
    const [x, z] = q.shift()!;
    const d = dist.get(key(x, z))!;
    if (d >= moveRange) continue;

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
  a: Map<string, string> | number,
  b: string | number,
  c?: string | number,
  toR?: number,
  _sz: number = 1,
  _theme?: string,
  unitsList: Unit[] = []
): any[] {
  if (a instanceof Map) {
    const parent = a;
    const fromK = b as string;
    const toK = c as string;
    const path: { x: number; z: number }[] = [];
    let curr = toK;
    while (curr !== fromK) {
      const [x, z] = curr.split(',').map(Number);
      path.unshift({ x, z });
      const p = parent.get(curr);
      if (!p) break;
      curr = p;
    }
    return path;
  } else {
    // Coordinate pathfinding: (fromC, fromR, toC, toR)
    const fromC = a as number;
    const fromR = b as number;
    const toC = c as number;
    const targetR = toR as number;

    const startK = key(fromC, fromR);
    const endK = key(toC, targetR);
    const q: [number, number][] = [[fromC, fromR]];
    const parent = new Map<string, string>();
    const visited = new Set<string>([startK]);

    while (q.length > 0) {
      const [currC, currR] = q.shift()!;
      if (currC === toC && currR === targetR) break;

      for (const [dc, dr] of DIRS) {
        const nc = currC + dc;
        const nr = currR + dr;
        const nk = key(nc, nr);
        if (inBounds(nc, nr) && !visited.has(nk) && canFitUnit(nc, nr, 1, null, unitsList)) {
          visited.add(nk);
          parent.set(nk, key(currC, currR));
          q.push([nc, nr]);
        }
      }
    }

    const path: Array<{ c: number; r: number; x: number; z: number }> = [];
    let curr = endK;
    if (!parent.has(curr) && startK !== endK) return [];
    while (curr !== startK) {
      const [col, row] = curr.split(',').map(Number);
      path.unshift({ c: col, r: row, x: col, z: row });
      const p = parent.get(curr);
      if (!p) break;
      curr = p;
    }
    return path;
  }
}
