import * as THREE from 'three';
import type { Unit, UnitDef, Faction } from '../../data/types';
import { createMarineFigure } from './marines';
import { createChaosFigure } from './chaos';
import { createOrcFigure } from './orcs';
import { createNecronFigure } from './necrons';
import { createEldarFigure } from './eldar';
import { createDarkEldarFigure } from './dark_eldar';
import { createTyranidFigure } from './tyranids';
import { createTauFigure } from './tau';
import { createVipFigure } from './vip';

/**
 * Creates a circular bevelled wargaming base (Warhammer 40k style round base)
 */
export function createWargamingBase(radius: number = 0.85, height: number = 0.18, color: number = 0x18181c): THREE.Group {
  const group = new THREE.Group();

  // Base rim
  const baseGeo = new THREE.CylinderGeometry(radius * 0.95, radius, height, 24);
  const baseMat = new THREE.MeshStandardMaterial({
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
  const topGeo = new THREE.CylinderGeometry(radius * 0.92, radius * 0.92, 0.04, 24);
  const topMat = new THREE.MeshStandardMaterial({
    color: 0x3a3630,
    roughness: 0.95,
    metalness: 0.05
  });
  const topMesh = new THREE.Mesh(topGeo, topMat);
  topMesh.position.y = height + 0.02;
  group.add(topMesh);

  return group;
}

/**
 * Creates an individual miniature model based on unit type and faction
 */
export function createMiniatureFigure(unitDef: UnitDef, faction: Faction | undefined): THREE.Group {
  if (unitDef.isVip || unitDef.id === 'vip_courier') {
    return createVipFigure();
  }

  const primaryColor = faction?.colorHex ?? 0x2563eb;
  const trimColor = faction?.trimHex ?? 0xf59e0b;
  const factionId = faction?.id ?? 'space_marines';

  switch (factionId) {
    case 'chaos_marines':
      return createChaosFigure(unitDef, primaryColor, trimColor);
    case 'orcs':
      return createOrcFigure(unitDef, primaryColor, trimColor);
    case 'necrons':
      return createNecronFigure(unitDef, primaryColor, trimColor);
    case 'eldar':
      return createEldarFigure(unitDef, primaryColor, trimColor);
    case 'dark_eldar':
      return createDarkEldarFigure(unitDef, primaryColor, trimColor);
    case 'tyranids':
      return createTyranidFigure(unitDef, primaryColor, trimColor);
    case 'tau':
      return createTauFigure(unitDef, primaryColor, trimColor);
    case 'space_marines':
    default:
      return createMarineFigure(unitDef, primaryColor, trimColor);
  }
}

/**
 * Creates the complete Squad Root Mesh containing miniature models for all squad members,
 * selection decal, status markers, and health visualizers.
 */
export function createSquadUnitMesh(unit: Unit, unitDef: UnitDef, faction: Faction | undefined): THREE.Group {
  const rootGroup = new THREE.Group();
  rootGroup.name = `unit_${unit.id}`;

  const squadSize = unit.squadSize || 1;
  const figureScale = squadSize > 1 ? 0.68 : (unitDef.size > 1 ? 1.0 + (unitDef.size - 1) * 0.4 : 0.85);

  // Miniature group that holds all individual member meshes
  const membersGroup = new THREE.Group();
  membersGroup.name = 'members_group';

  for (let i = 0; i < squadSize; i++) {
    const memberRoot = new THREE.Group();
    memberRoot.name = `member_${i}`;

    // Base
    const baseRadius = squadSize > 1 ? 0.55 : 0.85 * (unitDef.size > 1 ? unitDef.size * 0.8 : 1.0);
    const base = createWargamingBase(baseRadius, 0.15, unit.player === 1 ? 0x111827 : 0x1f1515);
    memberRoot.add(base);

    // Figure
    const figure = createMiniatureFigure(unitDef, faction);
    figure.scale.set(figureScale, figureScale, figureScale);
    figure.position.y = 0.15;
    memberRoot.add(figure);

    // Initial member offset if squad members exist
    if (unit.members && unit.members[i]) {
      memberRoot.position.set(unit.members[i].offsetX, 0, unit.members[i].offsetZ);
    }

    membersGroup.add(memberRoot);
  }
  rootGroup.add(membersGroup);

  // Selection indicator ring (hidden by default)
  const ringGeo = new THREE.RingGeometry(1.2 * unitDef.size, 1.4 * unitDef.size, 32);
  ringGeo.rotateX(-Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({
    color: unit.player === 1 ? 0x00ffff : 0xff3b30,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8
  });
  const selectionRing = new THREE.Mesh(ringGeo, ringMat);
  selectionRing.name = 'selection_ring';
  selectionRing.position.y = 0.05;
  selectionRing.visible = false;
  rootGroup.add(selectionRing);

  // Target indicator ring (for attack targets)
  const targetRingGeo = new THREE.RingGeometry(1.3 * unitDef.size, 1.55 * unitDef.size, 32);
  targetRingGeo.rotateX(-Math.PI / 2);
  const targetRingMat = new THREE.MeshBasicMaterial({
    color: 0xff0044,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.9
  });
  const targetRing = new THREE.Mesh(targetRingGeo, targetRingMat);
  targetRing.name = 'target_ring';
  targetRing.position.y = 0.06;
  targetRing.visible = false;
  rootGroup.add(targetRing);

  // Deployment preview ghosting or highlights if needed
  return rootGroup;
}
