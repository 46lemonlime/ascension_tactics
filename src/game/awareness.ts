import type { Unit, GameState } from '../data/types';
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

export const hasLineOfSight = (c1: number, r1: number, c2: number, r2: number, _theme?: string): boolean => {
  return checkLineOfSight(c1, r1, c2, r2);
};

export function checkUnitLineOfSight(a: any, b: any): boolean {
  if (!a || !b) return false;
  const ax = a.c !== undefined ? a.c : (a.x !== undefined ? a.x : (a.gx !== undefined ? a.gx : 0));
  const az = a.r !== undefined ? a.r : (a.z !== undefined ? a.z : (a.gz !== undefined ? a.gz : 0));
  const bx = b.c !== undefined ? b.c : (b.x !== undefined ? b.x : (b.gx !== undefined ? b.gx : 0));
  const bz = b.r !== undefined ? b.r : (b.z !== undefined ? b.z : (b.gz !== undefined ? b.gz : 0));
  return checkLineOfSight(ax, az, bx, bz);
}

export function updateFogOfWar(state: GameState): void {
  if (!state.fow || state.fow.length === 0) {
    state.fow = [];
    for (let r = 0; r < ROWS; r++) state.fow[r] = new Array(COLS).fill(0);
  }

  if (state.phase === 'deployment') {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        state.fow[r][c] = 2;
      }
    }
    return;
  }

  // Degrade current visible (2) to explored (1)
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (state.fow[r][c] === 2) {
        state.fow[r][c] = 1;
      }
    }
  }

  // Reveal around living player units
  const playerUnits = state.units.filter(u => u.player === 1 && u.alive && !u.dead);
  playerUnits.forEach(u => {
    const awareness = u.awareness || u.def?.awareness || 14;
    const minC = Math.max(0, u.c - awareness);
    const maxC = Math.min(COLS - 1, u.c + awareness);
    const minR = Math.max(0, u.r - awareness);
    const maxR = Math.min(ROWS - 1, u.r + awareness);

    for (let r = minR; r <= maxR; r++) {
      for (let c = minC; c <= maxC; c++) {
        if (unitDistance({ c: u.c, r: u.r }, { c, r }) <= awareness) {
          if (checkLineOfSight(u.c, u.r, c, r)) {
            state.fow[r][c] = 2;
          }
        }
      }
    }
  });
}

export function updatePlayerAwareness(
  gameState: string,
  unitsList: Unit[],
  fowMeshes?: Map<string, any>
): void {
  playerAwareTiles.clear();

  if (gameState === 'DEPLOYMENT') {
    for (let z = 0; z < ROWS; z++) {
      for (let x = 0; x < COLS; x++) {
        playerAwareTiles.add(key(x, z));
      }
    }
  } else {
    const playerUnits = unitsList.filter(u => u.alive && !u.dead && (u.team === 'player' || u.player === 1));

    if (playerUnits.length === 0) {
      for (let z = PLAYER_DEPLOY_MIN_Z; z <= PLAYER_DEPLOY_MAX_Z; z++) {
        for (let x = 0; x < COLS; x++) playerAwareTiles.add(key(x, z));
      }
    }

    playerUnits.forEach(u => {
      const ux = u.c !== undefined ? u.c : u.x;
      const uz = u.r !== undefined ? u.r : u.z;
      const awareness = u.awareness || u.def?.awareness || 14;
      const attenuatedRange = Math.max(Math.floor(awareness * 0.55), 5);

      const minX = Math.max(0, ux - awareness);
      const maxX = Math.min(COLS - 1, ux + awareness);
      const minZ = Math.max(0, uz - awareness);
      const maxZ = Math.min(ROWS - 1, uz + awareness);

      for (let z = minZ; z <= maxZ; z++) {
        for (let x = minX; x <= maxX; x++) {
          const d = unitDistance({ c: ux, r: uz }, { c: x, r: z });
          if (d <= awareness) {
            if (checkLineOfSight(ux, uz, x, z)) {
              playerAwareTiles.add(key(x, z));
            } else if (d <= attenuatedRange) {
              playerAwareTiles.add(key(x, z));
            }
          }
        }
      }
    });
  }

  // Update 3D Fog of War Shroud if passed
  if (fowMeshes) {
    fowMeshes.forEach((mesh, k) => {
      if (playerAwareTiles.has(k)) {
        mesh.material.opacity = 0;
        mesh.visible = false;
      } else {
        mesh.material.opacity = 0.84;
        mesh.visible = true;
      }
    });
  }

  // Update Enemy 3D Models Visibility (hidden in Fog of War)
  unitsList.forEach(u => {
    if (u.team === 'enemy' || u.player === 2) {
      const ux = u.c !== undefined ? u.c : u.x;
      const uz = u.r !== undefined ? u.r : u.z;
      const isVisible = u.alive && !u.dead && playerAwareTiles.has(key(ux, uz));
      if (u.model) u.model.visible = isVisible;
    }
  });

  // Calculate Enemy Awareness field
  enemyAwareTiles.clear();
  const enemyUnits = unitsList.filter(u => u.alive && !u.dead && (u.team === 'enemy' || u.player === 2));
  enemyUnits.forEach(u => {
    const ux = u.c !== undefined ? u.c : u.x;
    const uz = u.r !== undefined ? u.r : u.z;
    const awareness = u.awareness || u.def?.awareness || 14;
    const attenuatedRange = Math.max(Math.floor(awareness * 0.55), 5);

    const minX = Math.max(0, ux - awareness);
    const maxX = Math.min(COLS - 1, ux + awareness);
    const minZ = Math.max(0, uz - awareness);
    const maxZ = Math.min(ROWS - 1, uz + awareness);

    for (let z = minZ; z <= maxZ; z++) {
      for (let x = minX; x <= maxX; x++) {
        const d = unitDistance({ c: ux, r: uz }, { c: x, r: z });
        if (d <= awareness) {
          if (checkLineOfSight(ux, uz, x, z)) {
            enemyAwareTiles.add(key(x, z));
          } else if (d <= attenuatedRange) {
            enemyAwareTiles.add(key(x, z));
          }
        }
      }
    }
  });
}
