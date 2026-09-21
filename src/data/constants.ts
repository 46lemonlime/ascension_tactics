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

export const MAP_OBSTACLES: Record<string, string[]> = {
  // 1. JUNGLE: Dense obstacle network (~85), organic spore clusters, tree canopies
  jungle: [
    // West Sector Jungle Clusters
    key(2, 12), key(2, 13), key(3, 12), key(3, 13), key(4, 14), key(5, 14),
    key(2, 24), key(3, 24), key(3, 25), key(4, 25),
    key(2, 36), key(3, 36), key(3, 37), key(4, 38), key(5, 38),
    key(6, 10), key(7, 10), key(6, 11), key(7, 11), key(8, 12),
    key(6, 28), key(7, 28), key(6, 29), key(8, 30),
    key(6, 42), key(7, 42), key(7, 43), key(8, 44),
    // Midfield Ancient Spore Thickets & Canopy Chokepoints
    key(12, 16), key(13, 16), key(13, 17), key(14, 17),
    key(12, 32), key(13, 32), key(14, 33), key(13, 34),
    key(18, 14), key(19, 14), key(20, 14), key(19, 15), key(20, 15), key(21, 15),
    key(18, 26), key(19, 26), key(20, 27), key(21, 27), key(19, 28), key(20, 28),
    key(18, 40), key(19, 40), key(20, 40), key(21, 41),
    key(26, 16), key(27, 16), key(27, 17), key(28, 17),
    key(26, 32), key(27, 32), key(27, 33), key(28, 34),
    // East Sector Jungle Clusters
    key(32, 10), key(33, 10), key(33, 11), key(34, 11),
    key(32, 28), key(33, 28), key(34, 29),
    key(32, 42), key(33, 42), key(34, 43), key(33, 44),
    key(36, 12), key(37, 12), key(37, 13),
    key(36, 24), key(37, 24), key(37, 25),
    key(36, 36), key(37, 36), key(38, 37), key(37, 38)
  ],

  // 2. DESERT: Sparse obstacles (~30), rocky mesas, sandstone pillars, cacti
  desert: [
    key(6, 14), key(7, 14), key(7, 15), key(8, 15),
    key(6, 38), key(7, 38), key(7, 39), key(8, 39),
    key(14, 24), key(15, 24), key(14, 25), key(15, 25),
    key(24, 28), key(25, 28), key(24, 29), key(25, 29),
    key(32, 14), key(33, 14), key(33, 15), key(34, 15),
    key(32, 38), key(33, 38), key(33, 39), key(34, 39),
    key(19, 18), key(20, 18), key(19, 36), key(20, 36),
    key(10, 28), key(29, 24), key(18, 8), key(21, 46)
  ],

  // 3. SNOW: Moderate obstacles (~52), sweeping diagonal glacial mountain ridges & frost passes
  snow: [
    // Ridge 1 (North-West to Mid-North)
    key(4, 14), key(5, 14), key(6, 15), key(7, 15), key(8, 16), key(9, 16), key(10, 17), key(11, 17), key(12, 18),
    // Ridge 2 (North-East to Mid-North)
    key(35, 14), key(34, 14), key(33, 15), key(32, 15), key(31, 16), key(30, 16), key(29, 17), key(28, 17), key(27, 18),
    // Central Glacial Monoliths
    key(18, 26), key(19, 26), key(20, 26), key(21, 26), key(19, 27), key(20, 27), key(18, 28), key(19, 28), key(20, 28), key(21, 28),
    // Ridge 3 (South-West to Mid-South)
    key(4, 38), key(5, 38), key(6, 37), key(7, 37), key(8, 36), key(9, 36), key(10, 35), key(11, 35), key(12, 34),
    // Ridge 4 (South-East to Mid-South)
    key(35, 38), key(34, 38), key(33, 37), key(32, 37), key(31, 36), key(30, 36), key(29, 35), key(28, 35), key(27, 34),
    // Flanking Permafrost Outcroppings
    key(2, 26), key(3, 26), key(36, 26), key(37, 26), key(19, 10), key(20, 10), key(19, 44), key(20, 44)
  ],

  // 4. CITY: 4 large ruined city blocks + midfield fortified redoubts, wide streets & killzones
  city: [
    // NW Ruined City Block
    key(8, 12), key(9, 12), key(10, 12), key(11, 12), key(8, 13), key(9, 13), key(10, 13), key(11, 13), key(8, 14), key(9, 14), key(10, 14), key(11, 14),
    // NE Ruined City Block
    key(28, 12), key(29, 12), key(30, 12), key(31, 12), key(28, 13), key(29, 13), key(30, 13), key(31, 13), key(28, 14), key(29, 14), key(30, 14), key(31, 14),
    // SW Ruined City Block
    key(8, 38), key(9, 38), key(10, 38), key(11, 38), key(8, 39), key(9, 39), key(10, 39), key(11, 39), key(8, 40), key(9, 40), key(10, 40), key(11, 40),
    // SE Ruined City Block
    key(28, 38), key(29, 38), key(30, 38), key(31, 38), key(28, 39), key(29, 39), key(30, 39), key(31, 39), key(28, 40), key(29, 40), key(30, 40), key(31, 40),
    // Midfield Fortified Bunkers & Street Barricades
    key(18, 24), key(19, 24), key(20, 24), key(21, 24), key(18, 29), key(19, 29), key(20, 29), key(21, 29),
    key(9, 26), key(10, 26), key(29, 26), key(30, 26)
  ],

  // 5. TECH SPACE: Dual reactor cores, starship bulkheads, blast doors, and corridor junctions
  tech: [
    // North Central Plasma Reactor
    key(18, 18), key(19, 18), key(20, 18), key(21, 18), key(18, 19), key(19, 19), key(20, 19), key(21, 19),
    // South Central Plasma Reactor
    key(18, 34), key(19, 34), key(20, 34), key(21, 34), key(18, 35), key(19, 35), key(20, 35), key(21, 35),
    // West Sector Bulkheads & Blast Doors
    key(8, 12), key(9, 12), key(10, 12), key(8, 13), key(8, 17), key(8, 18), key(9, 18), key(10, 18),
    key(8, 32), key(9, 32), key(10, 32), key(8, 33), key(8, 37), key(8, 38), key(9, 38), key(10, 38),
    key(4, 24), key(4, 25), key(4, 26), key(4, 27), key(5, 26), key(6, 26),
    // East Sector Bulkheads & Blast Doors
    key(29, 12), key(30, 12), key(31, 12), key(31, 13), key(29, 18), key(30, 18), key(31, 18), key(31, 17),
    key(29, 32), key(30, 32), key(31, 32), key(31, 33), key(29, 38), key(30, 38), key(31, 38), key(31, 37),
    key(35, 24), key(35, 25), key(35, 26), key(35, 27), key(34, 26), key(33, 26)
  ]
};
