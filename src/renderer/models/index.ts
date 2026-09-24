import * as THREE from 'three';
import type { Unit, UnitDef, Faction, Figure } from '../../data/types';
import { buildSpaceMarineFigure } from './marines';
import { buildChaosFigure } from './chaos';
import { buildOrcFigure } from './orcs';
import { buildNecronFigure } from './necrons';
import { buildEldarFigure } from './eldar';
import { buildDarkEldarFigure } from './dark_eldar';
import { buildTyranidFigure } from './tyranids';
import { buildTauFigure } from './tau';
import { buildDirectorateFigure } from './directorate';
import { buildRiftbornFigure } from './riftborn';
import { buildVipCourierFigure } from './vip';
import { FormationSystem } from '../../game/formation';
import { unitWorldX, unitWorldZ } from '../../data/constants';
import { getCachedCylinder, getCachedRing, getCachedStandardMaterial, getCachedBasicMaterial } from './cache';

/**
 * Creates a circular bevelled wargaming base (Warhammer 40k style round base)
 */
export function createWargamingBase(radius: number = 0.85, height: number = 0.18, color: number = 0x18181c): THREE.Group {
  const group = new THREE.Group();

  // Base rim
  const baseGeo = getCachedCylinder(radius * 0.95, radius, height, 28);
  const baseMat = getCachedStandardMaterial({
    color,
    roughness: 0.85,
    metalness: 0.1
  });
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.y = height / 2;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  group.add(baseMesh);

  // Textured top surface
  const topGeo = getCachedCylinder(radius * 0.92, radius * 0.92, 0.04, 28);
  const topMat = getCachedStandardMaterial({
    color: 0x3a3630,
    roughness: 0.95,
    metalness: 0.05
  });
  const topMesh = new THREE.Mesh(topGeo, topMat);
  topMesh.position.y = height + 0.02;
  group.add(topMesh);

  return group;
}

function buildFigureWithBuilder(
  builder: Function,
  unitDef: UnitDef,
  primaryColor: number,
  trimColor: number,
  isLeader: boolean = false
): THREE.Group {
  const root = new THREE.Group();
  const figBody = new THREE.Group();
  root.add(figBody);

  const armorMat = new THREE.MeshStandardMaterial({ color: primaryColor, roughness: 0.35, metalness: 0.25 });
  const trimMat = new THREE.MeshStandardMaterial({ color: trimColor, roughness: 0.35, metalness: 0.6 });
  const darkJointMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.85 });
  const eyeGlowMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9 });

  builder(
    unitDef.type || unitDef.id,
    unitDef,
    'player',
    isLeader,
    figBody,
    root,
    armorMat,
    trimMat,
    darkJointMat,
    eyeGlowMat
  );

  return root;
}

export function createMarineFigure(unitDef: UnitDef, primaryColor: number = 0x1d4ed8, trimColor: number = 0xf59e0b, isLeader = false): THREE.Group {
  return buildFigureWithBuilder(buildSpaceMarineFigure, unitDef, primaryColor, trimColor, isLeader);
}

export function createChaosFigure(unitDef: UnitDef, primaryColor: number = 0x991b1b, trimColor: number = 0xb45309, isLeader = false): THREE.Group {
  return buildFigureWithBuilder(buildChaosFigure, unitDef, primaryColor, trimColor, isLeader);
}

export function createDirectorateFigure(unitDef: UnitDef, primaryColor: number = 0x3f6212, trimColor: number = 0xd97706, isLeader = false): THREE.Group {
  return buildFigureWithBuilder(buildDirectorateFigure, unitDef, primaryColor, trimColor, isLeader);
}

export function createRiftbornFigure(unitDef: UnitDef, primaryColor: number = 0x4c1d95, trimColor: number = 0xf43f5e, isLeader = false): THREE.Group {
  return buildFigureWithBuilder(buildRiftbornFigure, unitDef, primaryColor, trimColor, isLeader);
}

export function createOrcFigure(unitDef: UnitDef, primaryColor: number = 0x15803d, trimColor: number = 0xd97706, isLeader = false): THREE.Group {
  return buildFigureWithBuilder(buildOrcFigure, unitDef, primaryColor, trimColor, isLeader);
}

export function createNecronFigure(unitDef: UnitDef, primaryColor: number = 0x334155, trimColor: number = 0x22c55e, isLeader = false): THREE.Group {
  return buildFigureWithBuilder(buildNecronFigure, unitDef, primaryColor, trimColor, isLeader);
}

export function createEldarFigure(unitDef: UnitDef, primaryColor: number = 0x0f172a, trimColor: number = 0xfde68a, isLeader = false): THREE.Group {
  return buildFigureWithBuilder(buildEldarFigure, unitDef, primaryColor, trimColor, isLeader);
}

export function createDarkEldarFigure(unitDef: UnitDef, primaryColor: number = 0x042f2e, trimColor: number = 0x10b981, isLeader = false): THREE.Group {
  return buildFigureWithBuilder(buildDarkEldarFigure, unitDef, primaryColor, trimColor, isLeader);
}

export function createTyranidFigure(unitDef: UnitDef, primaryColor: number = 0x581c87, trimColor: number = 0xe9d5ff, isLeader = false): THREE.Group {
  return buildFigureWithBuilder(buildTyranidFigure, unitDef, primaryColor, trimColor, isLeader);
}

export function createTauFigure(unitDef: UnitDef, primaryColor: number = 0xc2410c, trimColor: number = 0x06b6d4, isLeader = false): THREE.Group {
  return buildFigureWithBuilder(buildTauFigure, unitDef, primaryColor, trimColor, isLeader);
}

export function createVipFigure(unitDef?: UnitDef): THREE.Group {
  const def = unitDef || ({ type: 'vip_courier', id: 'vip_courier', squadSize: 1, isVip: true } as any);
  return buildFigureWithBuilder(buildVipCourierFigure, def, 0xf59e0b, 0x38bdf8, true);
}

/**
 * Creates an individual miniature model based on unit type and faction
 */
export function createMiniatureFigure(unitDef: UnitDef, faction: Faction | undefined, isLeader: boolean = false): THREE.Group {
  if (unitDef.isVip || unitDef.id === 'vip_courier' || unitDef.type === 'vip_courier') {
    return createVipFigure(unitDef);
  }

  const primaryColor = faction?.colorHex ?? faction?.color ?? 0x2563eb;
  const trimColor = faction?.trimHex ?? faction?.trim ?? 0xf59e0b;
  const factionId = faction?.id || unitDef.factionId || 'space_marines';

  switch (factionId) {
    case 'directorate':
    case 'guard':
    case 'astra_militarum':
      return createDirectorateFigure(unitDef, primaryColor, trimColor, isLeader);
    case 'riftborn':
    case 'daemons':
    case 'chaos_daemons':
      return createRiftbornFigure(unitDef, primaryColor, trimColor, isLeader);
    case 'forsaken':
    case 'chaos':
    case 'chaos_marines':
      return createChaosFigure(unitDef, primaryColor, trimColor, isLeader);
    case 'ghar':
    case 'orcs':
    case 'orks':
      return createOrcFigure(unitDef, primaryColor, trimColor, isLeader);
    case 'revenant':
    case 'necros':
    case 'necrons':
      return createNecronFigure(unitDef, primaryColor, trimColor, isLeader);
    case 'elyri':
    case 'eldar':
    case 'aeldari':
      return createEldarFigure(unitDef, primaryColor, trimColor, isLeader);
    case 'veykari':
    case 'dark_eldar':
    case 'drukhari':
      return createDarkEldarFigure(unitDef, primaryColor, trimColor, isLeader);
    case 'devourers':
    case 'tyranids':
      return createTyranidFigure(unitDef, primaryColor, trimColor, isLeader);
    case 'concordat':
    case 'tau':
      return createTauFigure(unitDef, primaryColor, trimColor, isLeader);
    case 'ascendants':
    case 'marines':
    case 'space_marines':
    default:
      return createMarineFigure(unitDef, primaryColor, trimColor, isLeader);
  }
}

/**
 * Creates the complete Squad Root Mesh containing miniature models for all squad members,
 * selection decal, status markers, and health visualizers.
 */
export function createSquadUnitMesh(unit: Unit, unitDef: UnitDef, faction: Faction | undefined): THREE.Group {
  const rootGroup = new THREE.Group();
  rootGroup.name = `unit_${unit.id}`;

  const squadSize = unit.squadSize || unitDef.squadSize || 1;
  const figureScale = squadSize > 1 ? 0.68 : (unitDef.size > 1 ? 1.0 + (unitDef.size - 1) * 0.4 : 0.85);

  const fType = (unitDef.formation && unitDef.formation.type) || 'wedge';
  const spacing = (unitDef.formation && unitDef.formation.spacing) || 1.45;
  const offsets = FormationSystem.getOffsets(squadSize, fType, spacing, squadSize);

  const anchorX = unitWorldX(unit.c !== undefined ? unit.c : (unit.x || 0), unit.size || unitDef.size || 1);
  const anchorZ = unitWorldZ(unit.r !== undefined ? unit.r : (unit.z || 0), unit.size || unitDef.size || 1);
  const angle = unit.rotation || 0;

  const figures: Figure[] = [];

  for (let i = 0; i < squadSize; i++) {
    const memberRoot = new THREE.Group();
    memberRoot.name = `member_${i}`;

    // 1. Individual circular tabletop base
    const baseRadius = squadSize > 1 ? 0.55 : 0.85 * (unitDef.size > 1 ? unitDef.size * 0.8 : 1.0);
    const base = createWargamingBase(baseRadius, 0.15, unit.player === 1 ? 0x111827 : 0x1f1515);
    memberRoot.add(base);

    // 2. Individual selection halo ring attached directly around this miniature's base
    const selRingGeo = getCachedRing(baseRadius * 0.95, baseRadius * 1.15, 28);
    const selRingMat = getCachedBasicMaterial({
      color: unit.player === 1 ? 0x60a5fa : 0xf87171,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const selRing = new THREE.Mesh(selRingGeo, selRingMat);
    selRing.position.y = 0.17;
    memberRoot.add(selRing);
    memberRoot.userData.selectRing = selRing;

    // 3. Miniature Figure Body
    const figure = createMiniatureFigure(unitDef, faction, i === 0);
    figure.scale.set(figureScale, figureScale, figureScale);
    figure.position.y = 0.15;
    memberRoot.add(figure);

    // Propagate figure animation references to memberRoot
    memberRoot.userData.leftLeg = figure.userData.leftLeg;
    memberRoot.userData.rightLeg = figure.userData.rightLeg;
    memberRoot.userData.figBody = figure.userData.figBody || figure;
    memberRoot.userData.figure = figure;
    memberRoot.userData.animProfile = figure.userData.animProfile;
    memberRoot.userData.wheels = figure.userData.wheels;

    const off = offsets[i] || { x: 0, z: 0 };
    const slotX = anchorX + (off.x * Math.cos(angle) - off.z * Math.sin(angle));
    const slotZ = anchorZ + (off.x * Math.sin(angle) + off.z * Math.cos(angle));

    const figData: Figure = {
      root: memberRoot,
      alive: true,
      idx: i,
      offset: { ...off },
      worldX: slotX,
      worldZ: slotZ,
      vx: 0,
      vz: 0,
      targetX: slotX,
      targetZ: slotZ,
      radius: unitDef.physical?.radius || (unitDef.size >= 2 ? 2.2 : 0.65),
      sepRadius: unitDef.physical?.sepRadius || (unitDef.size >= 2 ? 3.4 : 1.25),
      mass: unitDef.physical?.mass || (unitDef.size >= 2 ? 8.0 : 1.0)
    };

    figures.push(figData);
    memberRoot.position.set(off.x, 0, off.z);
    rootGroup.add(memberRoot);
  }

  rootGroup.userData.figures = figures;
  return rootGroup;
}
