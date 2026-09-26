import type { PointLimit } from './types';

export interface BattleSettings {
  pointLimit: PointLimit;
  maxTurns: number | null;
  maxGameTimeSeconds: number | null;
  maxTurnTimeSeconds: number | null;
}

export const POINT_LIMIT_OPTIONS: PointLimit[] = [1000, 2000, 3000, 4000];

export const MAX_TURNS_OPTIONS: (number | null)[] = [20, 30, 40, 50, 60, null];

export interface GameTimeOption {
  label: string;
  seconds: number | null;
}

export const MAX_GAME_TIME_OPTIONS: GameTimeOption[] = [
  { label: '10 MIN', seconds: 600 },
  { label: '20 MIN', seconds: 1200 },
  { label: '30 MIN', seconds: 1800 },
  { label: '45 MIN', seconds: 2700 },
  { label: '60 MIN', seconds: 3600 },
  { label: 'UNLIMITED', seconds: null }
];

export interface TurnTimeOption {
  label: string;
  seconds: number | null;
}

export const MAX_TURN_TIME_OPTIONS: TurnTimeOption[] = [
  { label: '30 SEC', seconds: 30 },
  { label: '60 SEC', seconds: 60 },
  { label: '90 SEC', seconds: 90 },
  { label: '120 SEC', seconds: 120 },
  { label: '180 SEC', seconds: 180 },
  { label: 'UNLIMITED', seconds: null }
];

export const DEFAULT_BATTLE_SETTINGS: BattleSettings = {
  pointLimit: 2000,
  maxTurns: 40,
  maxGameTimeSeconds: 1800,
  maxTurnTimeSeconds: 120
};
