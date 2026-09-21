import { Unit } from '../data/types';
import { key, unitDistance, COLS, ROWS, PLAYER_DEPLOY_MIN_Z, PLAYER_DEPLOY_MAX_Z } from '../data/constants';
import { OBSTACLES } from '../data/themes';

export const playerAwareTiles = new Set<string>();
export const enemyAwareTiles = new Set<string>();

export function lineIntersectsBox(
  x0: number,
  z0: number,
  x1: number,
  z1: number,
  minX: number,
  minZ: number,
  maxX: number,
  maxZ: number
): boolean {
  let tmin = 0,
    tmax = 1;
  const dx = x1 - x0;
  const dz = z1 - z0;

  if (Math.abs(dx) > 1e-6) {
    let t1 = (minX - x0) / dx;
    let t2 = (maxX - x0) / dx;
    if (t1 > t2) {
      const tmp = t1;
      t1 = t2;
      t2 = tmp;
    }
    tmin = Math.max(tmin, t1);
    tmax = Math.min(tmax, t2);
    if (tmin > tmax) return false;
  } else {
    if (x0 < minX || x0 > maxX) return false;
  }

  if (Math.abs(dz) > 1e-6) {
    let t1 = (minZ - z0) / dz;
    let t2 = (maxZ - z0) / dz;
    if (t1 > t2) {
      const tmp = t1;
      t1 = t2;
      t2 = tmp;
    }
    tmin = Math.max(tmin, t1);
    tmax = Math.min(tmax, t2);
    if (tmin > tmax) return false;
  } else {
    if (z0 < minZ || z0 > maxZ) return false;
  }

  return true;
}

export function checkLineOfSight(x0: number, z0: number, x1: number, z1: number): boolean {
  if (x0 === x1 && z0 === z1) return true;

  const sx = x0 + 0.5,
    sz = z0 + 0.5;
  const ex = x1 + 0.5,
    ez = z1 + 0.5;

  for (const k of OBSTACLES) {
    const [ox, oz] = k.split(',').map(Number);
    if ((ox === x0 && oz === z0) || (ox === x1 && oz === z1)) continue;

    const minX = ox + 0.18,
      maxX = ox + 0.82;
    const minZ = oz + 0.18,
      maxZ = oz + 0.82;

    if (lineIntersectsBox(sx, sz, ex, ez, minX, minZ, maxX, maxZ)) {
      return false;
    }
  }
  return true;
}

export function checkUnitLineOfSight(a: any, b: any): boolean {
  if (!a || !b) return false;
  const ax = a.x !== undefined ? a.x : a.gx !== undefined ? a.gx : 0;
  const az = a.z !== undefined ? a.z : a.gz !== undefined ? a.gz : 0;
  const bx = b.x !== undefined ? b.x : b.gx !== undefined ? b.gx : 0;
  const bz = b.z !== undefined ? b.z : b.gz !== undefined ? b.gz : 0;
  return checkLineOfSight(ax, az, bx, bz);
}

export function updatePlayerAwareness(
  gameState: string,
  unitsList: Unit[],
  fowMeshes: Map<string, any>
): void {
  playerAwareTiles.clear();

  if (gameState === 'DEPLOYMENT') {
    for (let z = Math.max(0, PLAYER_DEPLOY_MIN_Z - 6); z < ROWS; z++) {
      for (let x = 0; x < COLS; x++) {
        playerAwareTiles.add(key(x, z));
      }
    }
  } else {
    const playerUnits = unitsList.filter(u => u.alive && u.team === 'player');

    if (playerUnits.length === 0) {
      for (let z = PLAYER_DEPLOY_MIN_Z; z <= PLAYER_DEPLOY_MAX_Z; z++) {
        for (let x = 0; x < COLS; x++) playerAwareTiles.add(key(x, z));
      }
    }

    playerUnits.forEach(u => {
      const awareness = u.awareness || (u.def && u.def.awareness) || 14;
      const attenuatedRange = Math.max(Math.floor(awareness * 0.55), 5);

      const minX = Math.max(0, u.x - awareness);
      const maxX = Math.min(COLS - 1, u.x + awareness);
      const minZ = Math.max(0, u.z - awareness);
      const maxZ = Math.min(ROWS - 1, u.z + awareness);

      for (let z = minZ; z <= maxZ; z++) {
        for (let x = minX; x <= maxX; x++) {
          const d = unitDistance(u, { x, z });
          if (d <= awareness) {
            if (checkLineOfSight(u.x, u.z, x, z)) {
              playerAwareTiles.add(key(x, z));
            } else if (d <= attenuatedRange) {
              playerAwareTiles.add(key(x, z));
            }
          }
        }
      }
    });
  }

  // Update 3D Fog of War Shroud
  fowMeshes.forEach((mesh, k) => {
    if (playerAwareTiles.has(k)) {
      mesh.material.opacity = 0;
      mesh.visible = false;
    } else {
      mesh.material.opacity = 0.84;
      mesh.visible = true;
    }
  });

  // Update Enemy 3D Models Visibility (hidden in Fog of War)
  unitsList.forEach(u => {
    if (u.team === 'enemy') {
      const isVisible = u.alive && playerAwareTiles.has(key(u.x, u.z));
      u.model.visible = isVisible;
    }
  });

  // Calculate Enemy Awareness field
  enemyAwareTiles.clear();
  const enemyUnits = unitsList.filter(u => u.alive && u.team === 'enemy');
  enemyUnits.forEach(u => {
    const awareness = u.awareness || (u.def && u.def.awareness) || 14;
    const attenuatedRange = Math.max(Math.floor(awareness * 0.55), 5);

    const minX = Math.max(0, u.x - awareness);
    const maxX = Math.min(COLS - 1, u.x + awareness);
    const minZ = Math.max(0, u.z - awareness);
    const maxZ = Math.min(ROWS - 1, u.z + awareness);

    for (let z = minZ; z <= maxZ; z++) {
      for (let x = minX; x <= maxX; x++) {
        const d = unitDistance(u, { x, z });
        if (d <= awareness) {
          if (checkLineOfSight(u.x, u.z, x, z)) {
            enemyAwareTiles.add(key(x, z));
          } else if (d <= attenuatedRange) {
            enemyAwareTiles.add(key(x, z));
          }
        }
      }
    }
  });
}
