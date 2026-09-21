import * as THREE from 'three';

export type Team = 'player' | 'enemy';
export type MoraleState = 'STEADY' | 'SHAKEN' | 'DISTRESSED' | 'PANICKED' | 'BROKEN';
export type GameState = 'HOME' | 'RACE_SELECT' | 'DEPLOYMENT' | 'BATTLE';
export type MissionId = 'extermination' | 'escort' | 'domination';
export type EscortStance = 'escort' | 'attack' | 'random';
export type EscortRole = 'player_escorts' | 'enemy_escorts';
export type CameraMode = 'iso' | 'top' | 'cinematic';
export type FormationType = 'line' | 'column' | 'wedge' | 'loose' | 'block';
export type ParticleType = 'rain' | 'sand' | 'snow' | 'stars' | 'none';

export interface Faction {
  id: string;
  name: string;
  sub: string;
  icon: string;
  color: number;
  trim: number;
  laserColor: number;
  desc: string;
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

export interface UnitDef {
  type: string;
  factionId: string;
  name: string;
  title: string;
  icon: string;
  isCharacter?: boolean;
  isLarge?: boolean;
  isVip?: boolean;
  baseRadius?: number;
  squadSize: number;
  hp: number;
  m: number;
  awareness: number;
  range: number;
  dmg: number;
  meleeDmg?: number;
  ranged: boolean;
  hasMelee: boolean;
  bs: number;
  ws: number;
  s: number;
  t: number;
  sv: number;
  color: number;
  trim: number;
  weapon: string;
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

export interface Unit {
  type: string;
  team: Team;
  name: string;
  def: UnitDef;
  size: number;
  x: number;
  z: number;
  px: number;
  pz: number;
  angle: number;
  anchor: { x: number; z: number };
  hp: number;
  maxhp: number;
  squadSize: number;
  m: number;
  awareness: number;
  range: number;
  dmg: number;
  ranged: boolean;
  hasMelee: boolean;
  meleeDmg: number;
  alive: boolean;
  dead: boolean;
  hasMoved: boolean;
  hasAttacked: boolean;
  isVip?: boolean;
  morale: UnitMorale;
  model: THREE.Group;
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

export interface BiomeTheme {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  desc: string;
  tableColor: number;
  particleColor: number;
  particleType: ParticleType;
  particleSize: number;
  particleOpacity: number;
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
