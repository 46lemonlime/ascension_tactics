import type { Obstacle } from './types';

export const GRID_COLS = 40;
export const GRID_ROWS = 56;
export const COLS = GRID_COLS;
export const ROWS = GRID_ROWS;
export const TILE_SIZE = 6.0;

export const DIRS: [number, number][] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1]
];

export const DEPLOYMENT_ZONES = {
  player1: { minC: 0, maxC: 39, minR: 48, maxR: 55 },
  player2: { minC: 0, maxC: 39, minR: 0, maxR: 7 }
};

export const PLAYER_DEPLOY_MIN_Z = 48;
export const PLAYER_DEPLOY_MAX_Z = 55;
export const ENEMY_DEPLOY_MIN_Z = 0;
export const ENEMY_DEPLOY_MAX_Z = 7;

export const MAX_ROUNDS = 8;
export const DOMINATION_TARGET_SCORE = 100;

export const key = (x: number, z: number): string => `${x},${z}`;
export const inBounds = (x: number, z: number): boolean => x >= 0 && z >= 0 && x < GRID_COLS && z < GRID_ROWS;
export const unitSize = (_u?: any): number => 1;

export function getUnitOccupiedTiles(x: number, z: number): { x: number; z: number; key: string }[] {
  return [{ x, z, key: key(x, z) }];
}

export function chebyshevDist(c1: number, r1: number, c2: number, r2: number): number {
  return Math.max(Math.abs(c1 - c2), Math.abs(r1 - r2));
}

export function unitDistance(a: any, b: any): number {
  if (!a || !b) return 999;
  const ax = a.c !== undefined ? a.c : (a.x !== undefined ? a.x : (a.gx !== undefined ? a.gx : 0));
  const az = a.r !== undefined ? a.r : (a.z !== undefined ? a.z : (a.gz !== undefined ? a.gz : (a.y !== undefined ? a.y : 0)));
  const bx = b.c !== undefined ? b.c : (b.x !== undefined ? b.x : (b.gx !== undefined ? b.gx : 0));
  const bz = b.r !== undefined ? b.r : (b.z !== undefined ? b.z : (b.gz !== undefined ? b.gz : (b.y !== undefined ? b.y : 0)));
  return chebyshevDist(ax, az, bx, bz);
}

export const cheb = (a: any, b: any): number => unitDistance(a, b);
export const rnd = (a: number, b: number): number => a + Math.random() * (b - a);

/**
 * World coordinate mapping helpers
 */
export const worldX = (gx: number): number => (gx - GRID_COLS / 2 + 0.5) * TILE_SIZE;
export const worldZ = (gz: number): number => (gz - GRID_ROWS / 2 + 0.5) * TILE_SIZE;
export const unitWorldX = (gx: number, _sz = 1): number => worldX(gx);
export const unitWorldZ = (gz: number, _sz = 1): number => worldZ(gz);

export const gridX = (wx: number): number => Math.floor(wx / TILE_SIZE + GRID_COLS / 2);
export const gridZ = (wz: number): number => Math.floor(wz / TILE_SIZE + GRID_ROWS / 2);

export function gridToWorld(c: number, r: number): { x: number; z: number } {
  return {
    x: worldX(c),
    z: worldZ(r)
  };
}

export function worldToGrid(x: number, z: number): { c: number; r: number } {
  return {
    c: Math.max(0, Math.min(GRID_COLS - 1, gridX(x))),
    r: Math.max(0, Math.min(GRID_ROWS - 1, gridZ(z)))
  };
}

export const MAP_OBSTACLES: Record<string, Obstacle[]> = {
  jungle: [
    { c: 6, r: 12, w: 3, h: 2, type: 'trees' },
    { c: 28, r: 14, w: 2, h: 3, type: 'ruins' },
    { c: 18, r: 24, w: 4, h: 2, type: 'rocks' },
    { c: 8, r: 36, w: 3, h: 3, type: 'trees' },
    { c: 26, r: 38, w: 3, h: 2, type: 'ruins' }
  ],
  desert: [
    { c: 10, r: 16, w: 4, h: 2, type: 'dune' },
    { c: 24, r: 20, w: 3, h: 3, type: 'rocks' },
    { c: 16, r: 32, w: 3, h: 2, type: 'crater' },
    { c: 28, r: 36, w: 2, h: 2, type: 'dune' }
  ],
  snow: [
    { c: 8, r: 14, w: 4, h: 2, type: 'rocks' },
    { c: 26, r: 18, w: 3, h: 3, type: 'bunker' },
    { c: 16, r: 28, w: 4, h: 3, type: 'rocks' },
    { c: 10, r: 40, w: 3, h: 2, type: 'bunker' }
  ],
  city: [
    { c: 8, r: 12, w: 4, h: 3, type: 'building' },
    { c: 28, r: 12, w: 4, h: 3, type: 'cathedral' },
    { c: 18, r: 26, w: 4, h: 4, type: 'ruins' },
    { c: 8, r: 38, w: 4, h: 3, type: 'building' },
    { c: 28, r: 38, w: 4, h: 3, type: 'building' }
  ],
  tech: [
    { c: 8, r: 14, w: 3, h: 3, type: 'tech_spire' },
    { c: 28, r: 14, w: 3, h: 3, type: 'monolith' },
    { c: 18, r: 26, w: 4, h: 4, type: 'tech_spire' },
    { c: 8, r: 38, w: 3, h: 3, type: 'monolith' },
    { c: 28, r: 38, w: 3, h: 3, type: 'tech_spire' }
  ]
};
