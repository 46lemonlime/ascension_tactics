import * as THREE from 'three';

export type Team = 'player' | 'enemy';
export type MoraleState = 'steady' | 'shaken' | 'broken' | 'STEADY' | 'SHAKEN' | 'DISTRESSED' | 'PANICKED' | 'BROKEN';
export type AppScreen = 'home' | 'lobby' | 'game';
export type MissionType = 'extermination' | 'escort' | 'domination';
export type MissionId = MissionType;
export type EscortStance = 'escort' | 'attack' | 'random';
export type EscortRole = 'player_escorts' | 'enemy_escorts';
export type CameraMode = 'iso' | 'top' | 'cinematic' | 'tactical';
export type FormationType = 'line' | 'column' | 'wedge' | 'loose' | 'block';
export type ParticleType = 'rain' | 'sand' | 'snow' | 'stars' | 'astral' | 'corruption' | 'acid' | 'gauss' | 'rift' | 'none';

export interface WeaponProfile {
  name: string;
  range: number;
  attacks: number;
  strength: number;
  ap: number;
  damage: number;
}

export interface UnitPhysicalProfile {
  radius: number;
  sepRadius: number;
  mass: number;
  maxSpeed: number;
  accel: number;
}

export interface FormationConfig {
  type: FormationType;
  spacing: number;
  cohesionWeight: number;
  separationWeight: number;
  obstacleAvoidWeight: number;
}

export interface MoraleProfile {
  base: number;
  brokenThreshold: number;
  panickedThreshold: number;
  distressedThreshold: number;
  shakenThreshold: number;
  recoverRate: number;
  casualtyPenalty: number;
}

export type MovementType = 'ground' | 'vehicle' | 'fly' | 'colossus';
export type AwarenessType = 'sensory' | 'vision' | 'psychic';

export interface UtilityProfile {
  movement: number;
  awareness: number;
  morale: number;
  movementType: MovementType;
  awarenessType: AwarenessType;
}

export interface UnitDef {
  id?: string;
  type: string;
  factionId: string;
  name: string;
  title: string;
  role?: string;
  icon: string;
  isCharacter?: boolean;
  isLarge?: boolean;
  isVip?: boolean;
  baseRadius?: number;
  squadSize: number;
  size?: number;
  wounds?: number;
  hp: number;
  movement?: number;
  m: number;
  movementType?: MovementType;
  awarenessType?: AwarenessType;
  utility?: UtilityProfile;
  leadership?: number;
  toughness?: number;
  t: number;
  armorSave?: number;
  sv: number;
  bs: number;
  ws: number;
  s: number;
  dmg: number;
  meleeDmg?: number;
  range: number;
  awareness: number;
  ranged: boolean;
  hasMelee: boolean;
  weapon: string;
  weapons?: WeaponProfile[];
  tags?: string[];
  color: number;
  trim: number;
  physical?: UnitPhysicalProfile;
  formation?: FormationConfig;
  moraleProfile?: MoraleProfile;
}

export interface Figure {
  root: THREE.Group;
  alive: boolean;
  idx: number;
  offset: { x: number; z: number };
  worldX: number;
  worldZ: number;
  vx: number;
  vz: number;
  targetX: number;
  targetZ: number;
  radius: number;
  sepRadius: number;
  mass: number;
}

export interface UnitMorale {
  current: number;
  max: number;
  state: MoraleState;
  base: number;
  recoverRate: number;
  casualtyPenalty: number;
}

export interface UnitMember {
  offsetX: number;
  offsetZ: number;
  alive: boolean;
}

export interface Unit {
  id: number;
  unitDefId: string;
  type: string;
  player: number;
  team: Team;
  name: string;
  def: UnitDef;
  c: number;
  r: number;
  x: number;
  z: number;
  px: number;
  pz: number;
  size: number;
  squadSize: number;
  squadCasualties: boolean[];
  members?: UnitMember[];
  wounds: number;
  maxWounds: number;
  hp: number;
  maxhp: number;
  movement?: number;
  morale: number | UnitMorale;
  maxMorale: number;
  moraleState: 'steady' | 'shaken' | 'broken';
  hasMoved: boolean;
  hasAttacked: boolean;
  isBroken: boolean;
  isVip?: boolean;
  alive: boolean;
  dead: boolean;
  rotation: number;
  angle: number;
  anchor: { x: number; z: number };
  m: number;
  awareness: number;
  range: number;
  dmg: number;
  ranged: boolean;
  hasMelee: boolean;
  meleeDmg: number;
  model: THREE.Group;
}

export interface Faction {
  id: string;
  name: string;
  sub: string;
  icon: string;
  color: number;
  colorHex: number;
  trim: number;
  trimHex: number;
  laserColor: number;
  desc: string;
  roster: UnitDef[];
  battlefieldIdentity?: string;
  quote?: string;
  doctrine?: string;
  strengths?: string[];
  weaknesses?: string[];
  uniqueMechanic?: {
    name: string;
    desc: string;
  };
  image?: string;
  emblem?: string;
}

export interface Objective {
  id: number;
  c: number;
  r: number;
  radius: number;
  controlledBy: number;
  points: number;
  name?: string;
  x?: number;
  z?: number;
  owner?: 'player' | 'enemy' | 'neutral';
  mesh?: THREE.Group;
}

export interface Obstacle {
  c: number;
  r: number;
  w: number;
  h: number;
  type: string;
}

export interface Theme {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  desc: string;
  groundColor: number;
  obstacleColor: number;
  skyColor: number;
  fogColor: number;
  particleColor: number;
  tableColor: number;
  particleType: ParticleType;
  particleSize: number;
  particleOpacity: number;
}

export type BiomeTheme = Theme;

export interface GameState {
  mission: MissionType;
  theme: string;
  turn: number;
  round: number;
  phase: 'deployment' | 'battle' | 'gameover';
  units: Unit[];
  fow: number[][];
  p1Score: number;
  p2Score: number;
  p1Roster: UnitDef[];
  p2Roster: UnitDef[];
  p1Deployed: boolean[];
  p2Deployed: boolean[];
  objectives?: Objective[];
  escortTargetC: number;
  escortTargetR: number;
  rosterPlayer?: DeploymentCard[];
  rosterEnemy?: EnemyRosterItem[];
  escortRole?: 'escort' | 'attack';
  p2EscortRole?: 'escort' | 'attack';
  p1Faction?: string;
  p2Faction?: string;
}

export interface DeploymentCard {
  key: string;
  type: string;
  name: string;
  isVip?: boolean;
  placed: boolean;
  x: number | null;
  z: number | null;
  unitRef: Unit | null;
}

export interface EnemyRosterItem {
  key: string;
  type: string;
  name: string;
  isVip?: boolean;
  x: number;
  z: number;
  unitRef: Unit | null;
}

export interface DominationNode {
  id: string;
  name: string;
  x: number;
  z: number;
  owner: 'player' | 'enemy' | 'neutral';
  mesh?: THREE.Group;
  ringMat?: THREE.MeshBasicMaterial;
  coreMat?: THREE.MeshBasicMaterial;
  beamMat?: THREE.MeshBasicMaterial;
}

export interface ExtractionZone {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  centerX: number;
  centerZ: number;
}

export interface CameraSnapshot {
  pos: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
}

export interface Tween {
  t: number;
  dur: number;
  onUpdate?: (p: number) => void;
  onDone?: () => void;
}

export interface Floater {
  el: HTMLDivElement;
  pos: THREE.Vector3;
  age: number;
}
