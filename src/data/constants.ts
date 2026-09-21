export const COLS = 40;
export const ROWS = 56;
export const TILE_SIZE = 6.0;

export const DIRS: [number, number][] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1]
];

export const key = (x: number, z: number): string => `${x},${z}`;
export const inBounds = (x: number, z: number): boolean => x >= 0 && z >= 0 && x < COLS && z < ROWS;
export const unitSize = (_u?: any): number => 1;

export function getUnitOccupiedTiles(x: number, z: number): { x: number; z: number; key: string }[] {
  return [{ x, z, key: key(x, z) }];
}

export function unitDistance(a: any, b: any): number {
  if (!a || !b) return 999;
  const ax = a.x !== undefined ? a.x : (a.gx !== undefined ? a.gx : 0);
  const az = a.z !== undefined ? a.z : (a.gz !== undefined ? a.gz : (a.y !== undefined ? a.y : 0));
  const bx = b.x !== undefined ? b.x : (b.gx !== undefined ? b.gx : 0);
  const bz = b.z !== undefined ? b.z : (b.gz !== undefined ? b.gz : (b.y !== undefined ? b.y : 0));
  return Math.max(Math.abs(ax - bx), Math.abs(az - bz));
}

export const cheb = (a: any, b: any): number => unitDistance(a, b);

export const rnd = (a: number, b: number): number => a + Math.random() * (b - a);

export const PLAYER_DEPLOY_MIN_Z = 48;
export const PLAYER_DEPLOY_MAX_Z = 55;
export const ENEMY_DEPLOY_MIN_Z = 0;
export const ENEMY_DEPLOY_MAX_Z = 7;

export const MAX_ROUNDS = 8;
export const DOMINATION_TARGET_SCORE = 100;

export const worldX = (gx: number): number => (gx - COLS / 2 + 0.5) * TILE_SIZE;
export const worldZ = (gz: number): number => (gz - ROWS / 2 + 0.5) * TILE_SIZE;
export const unitWorldX = (gx: number, _sz = 1): number => worldX(gx);
export const unitWorldZ = (gz: number, _sz = 1): number => worldZ(gz);
export const gridX = (wx: number): number => Math.floor(wx / TILE_SIZE + COLS / 2);
export const gridZ = (wz: number): number => Math.floor(wz / TILE_SIZE + ROWS / 2);
