import * as THREE from 'three';
import { gridToWorld, TILE_SIZE } from '../data/constants';
import type { Objective } from '../data/types';

/**
 * Creates 3D interactive holographic beacons for Domination mode
 */
export function createDominationBeacons(objectives: Objective[]): THREE.Group {
  const group = new THREE.Group();
  group.name = 'domination_beacons';

  objectives.forEach(obj => {
    const worldPos = gridToWorld(obj.c, obj.r);
    const beaconGroup = new THREE.Group();
    beaconGroup.name = `objective_${obj.id}`;
    beaconGroup.position.set(worldPos.x, 0.05, worldPos.z);

    // Objective radius pad
    const padGeo = new THREE.CylinderGeometry(obj.radius * TILE_SIZE, obj.radius * TILE_SIZE, 0.1, 32);
    const padMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.6,
      metalness: 0.4
    });
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.receiveShadow = true;
    beaconGroup.add(pad);

    // Glowing border ring
    const ringGeo = new THREE.RingGeometry(obj.radius * TILE_SIZE * 0.95, obj.radius * TILE_SIZE, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: obj.controlledBy === 1 ? 0x00f3ff : (obj.controlledBy === 2 ? 0xff2a6d : 0xffcc00),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.name = 'beacon_ring';
    ring.position.y = 0.08;
    beaconGroup.add(ring);

    // Central holographic column
    const colGeo = new THREE.CylinderGeometry(0.3, 0.3, 4.0, 16);
    const colMat = new THREE.MeshBasicMaterial({
      color: obj.controlledBy === 1 ? 0x00f3ff : (obj.controlledBy === 2 ? 0xff2a6d : 0xffcc00),
      transparent: true,
      opacity: 0.35,
      wireframe: true
    });
    const col = new THREE.Mesh(colGeo, colMat);
    col.name = 'beacon_column';
    col.position.y = 2.0;
    beaconGroup.add(col);

    // Floating diamond insignia
    const diaGeo = new THREE.OctahedronGeometry(0.7);
    const diaMat = new THREE.MeshStandardMaterial({
      color: obj.controlledBy === 1 ? 0x00f3ff : (obj.controlledBy === 2 ? 0xff2a6d : 0xffcc00),
      emissive: obj.controlledBy === 1 ? 0x005577 : (obj.controlledBy === 2 ? 0x770022 : 0x554400),
      roughness: 0.2,
      metalness: 0.8
    });
    const diamond = new THREE.Mesh(diaGeo, diaMat);
    diamond.name = 'beacon_diamond';
    diamond.position.y = 4.2;
    beaconGroup.add(diamond);

    group.add(beaconGroup);
  });

  return group;
}

/**
 * Updates Domination beacon colors based on control state
 */
export function updateDominationBeacons(beaconGroup: THREE.Group, objectives: Objective[]): void {
  objectives.forEach(obj => {
    const objMesh = beaconGroup.getObjectByName(`objective_${obj.id}`);
    if (!objMesh) return;

    const color = obj.controlledBy === 1 ? 0x00f3ff : (obj.controlledBy === 2 ? 0xff2a6d : 0xffcc00);
    const ring = objMesh.getObjectByName('beacon_ring') as THREE.Mesh;
    if (ring && ring.material instanceof THREE.MeshBasicMaterial) {
      ring.material.color.setHex(color);
    }

    const col = objMesh.getObjectByName('beacon_column') as THREE.Mesh;
    if (col && col.material instanceof THREE.MeshBasicMaterial) {
      col.material.color.setHex(color);
    }

    const diamond = objMesh.getObjectByName('beacon_diamond') as THREE.Mesh;
    if (diamond && diamond.material instanceof THREE.MeshStandardMaterial) {
      diamond.material.color.setHex(color);
      diamond.material.emissive.setHex(obj.controlledBy === 1 ? 0x005577 : (obj.controlledBy === 2 ? 0x770022 : 0x554400));
    }
  });
}

/**
 * Creates 3D Extraction Landing Zone for Escort Mode
 */
export function createEscortExtractionZone(c: number, r: number): THREE.Group {
  const group = new THREE.Group();
  group.name = 'escort_extraction_zone';

  const worldPos = gridToWorld(c, r);
  group.position.set(worldPos.x, 0.05, worldPos.z);

  // Large helipad landing marker
  const padGeo = new THREE.CylinderGeometry(TILE_SIZE * 2.0, TILE_SIZE * 2.0, 0.15, 32);
  const padMat = new THREE.MeshStandardMaterial({
    color: 0x1f2937,
    roughness: 0.7,
    metalness: 0.3
  });
  const pad = new THREE.Mesh(padGeo, padMat);
  group.add(pad);

  // Outer safety warning ring
  const ringGeo = new THREE.RingGeometry(TILE_SIZE * 1.8, TILE_SIZE * 2.0, 32);
  ringGeo.rotateX(-Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x00ff66,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.y = 0.09;
  group.add(ring);

  // 4 Corner marker beacons
  const cornerOffsets = [
    [-TILE_SIZE * 1.5, -TILE_SIZE * 1.5],
    [TILE_SIZE * 1.5, -TILE_SIZE * 1.5],
    [-TILE_SIZE * 1.5, TILE_SIZE * 1.5],
    [TILE_SIZE * 1.5, TILE_SIZE * 1.5]
  ];

  cornerOffsets.forEach(([ox, oz]) => {
    const postGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.2, 8);
    const postMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
    const post = new THREE.Mesh(postGeo, postMat);
    post.position.set(ox, 0.6, oz);
    group.add(post);

    const lightGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0x00ff66 });
    const light = new THREE.Mesh(lightGeo, lightMat);
    light.position.set(ox, 1.25, oz);
    group.add(light);
  });

  return group;
}
