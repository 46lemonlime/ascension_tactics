import * as THREE from 'three';
import { GRID_COLS, GRID_ROWS, TILE_SIZE, MAP_OBSTACLES, gridToWorld } from '../data/constants';
import { THEMES } from '../data/themes';
import type { Obstacle, Theme } from '../data/types';

/**
 * Procedurally generates 3D meshes for map obstacles based on theme
 */
export function createObstacleMeshes(themeId: string): THREE.Group {
  const group = new THREE.Group();
  group.name = 'obstacles_group';

  const theme: Theme = THEMES[themeId] || THEMES.jungle;
  const obstacles: Obstacle[] = MAP_OBSTACLES[themeId] || MAP_OBSTACLES.jungle;

  obstacles.forEach((obs, idx) => {
    const worldPos = gridToWorld(obs.c, obs.r);
    const obsGroup = new THREE.Group();
    obsGroup.position.set(worldPos.x, 0, worldPos.z);
    obsGroup.name = `obstacle_${idx}_${obs.type}`;

    switch (obs.type) {
      case 'ruins':
      case 'building':
      case 'bunker':
      case 'cathedral':
        createBuildingObstacle(obsGroup, obs, theme);
        break;
      case 'rocks':
      case 'crater':
      case 'dune':
        createRockObstacle(obsGroup, obs, theme);
        break;
      case 'trees':
      case 'crystals':
      case 'tech_spire':
      case 'monolith':
        createSpireObstacle(obsGroup, obs, theme);
        break;
      default:
        createGenericObstacle(obsGroup, obs, theme);
        break;
    }

    group.add(obsGroup);
  });

  return group;
}

function createBuildingObstacle(parent: THREE.Group, obs: Obstacle, theme: Theme): void {
  const width = obs.w * TILE_SIZE * 0.9;
  const depth = obs.h * TILE_SIZE * 0.9;
  const height = 4.5 + Math.random() * 2.0;

  const wallMat = new THREE.MeshStandardMaterial({
    color: theme.obstacleColor,
    roughness: 0.9,
    metalness: 0.1
  });

  const trimMat = new THREE.MeshStandardMaterial({
    color: 0x3b3a36,
    roughness: 0.7,
    metalness: 0.3
  });

  // Broken walls / Gothic ruin structure
  const mainWallGeo = new THREE.BoxGeometry(width, height, depth * 0.35);
  const mainWall = new THREE.Mesh(mainWallGeo, wallMat);
  mainWall.position.set(0, height / 2, -depth * 0.25);
  mainWall.castShadow = true;
  mainWall.receiveShadow = true;
  parent.add(mainWall);

  const sideWallGeo = new THREE.BoxGeometry(width * 0.3, height * 0.75, depth * 0.7);
  const sideWall = new THREE.Mesh(sideWallGeo, wallMat);
  sideWall.position.set(-width * 0.35, (height * 0.75) / 2, 0);
  sideWall.castShadow = true;
  sideWall.receiveShadow = true;
  parent.add(sideWall);

  // Buttresses / pillars
  [-width * 0.45, width * 0.45].forEach(x => {
    const colGeo = new THREE.BoxGeometry(0.8, height * 1.1, 0.8);
    const col = new THREE.Mesh(colGeo, trimMat);
    col.position.set(x, (height * 1.1) / 2, -depth * 0.25);
    col.castShadow = true;
    parent.add(col);
  });

  // Gothic arch debris / rubble
  for (let i = 0; i < 4; i++) {
    const rubbleGeo = new THREE.BoxGeometry(0.8 + Math.random() * 0.8, 0.4 + Math.random() * 0.5, 0.8 + Math.random() * 0.8);
    const rubble = new THREE.Mesh(rubbleGeo, wallMat);
    rubble.position.set((Math.random() - 0.5) * width * 0.8, 0.25, (Math.random() - 0.5) * depth * 0.8);
    rubble.rotation.set(Math.random() * 0.5, Math.random() * Math.PI, Math.random() * 0.5);
    rubble.castShadow = true;
    parent.add(rubble);
  }
}

function createRockObstacle(parent: THREE.Group, obs: Obstacle, theme: Theme): void {
  const width = obs.w * TILE_SIZE * 0.85;
  const depth = obs.h * TILE_SIZE * 0.85;

  const rockMat = new THREE.MeshStandardMaterial({
    color: theme.obstacleColor,
    roughness: 0.95,
    metalness: 0.05,
    flatShading: true
  });

  const count = Math.max(2, obs.w * obs.h);
  for (let i = 0; i < count; i++) {
    const radius = 1.2 + Math.random() * 1.8;
    const rockGeo = new THREE.DodecahedronGeometry(radius, 1);
    const rockMesh = new THREE.Mesh(rockGeo, rockMat);

    const rx = (Math.random() - 0.5) * width * 0.7;
    const rz = (Math.random() - 0.5) * depth * 0.7;
    rockMesh.position.set(rx, radius * 0.7, rz);
    rockMesh.scale.set(1 + Math.random() * 0.4, 0.8 + Math.random() * 0.6, 1 + Math.random() * 0.4);
    rockMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    rockMesh.castShadow = true;
    rockMesh.receiveShadow = true;
    parent.add(rockMesh);
  }
}

function createSpireObstacle(parent: THREE.Group, obs: Obstacle, theme: Theme): void {
  const width = obs.w * TILE_SIZE * 0.8;
  const depth = obs.h * TILE_SIZE * 0.8;

  const spireMat = new THREE.MeshStandardMaterial({
    color: theme.obstacleColor,
    roughness: 0.3,
    metalness: 0.8
  });

  const glowMat = new THREE.MeshBasicMaterial({
    color: theme.particleColor || 0x00ffff
  });

  const numSpires = Math.max(1, Math.floor((obs.w + obs.h) / 2));
  for (let i = 0; i < numSpires; i++) {
    const h = 4.0 + Math.random() * 3.5;
    const spireGeo = new THREE.ConeGeometry(0.8 + Math.random() * 0.6, h, 6);
    const spire = new THREE.Mesh(spireGeo, spireMat);
    const sx = (Math.random() - 0.5) * width * 0.6;
    const sz = (Math.random() - 0.5) * depth * 0.6;
    spire.position.set(sx, h / 2, sz);
    spire.castShadow = true;
    parent.add(spire);

    // Glowing tip or emitter
    const tip = new THREE.Mesh(new THREE.OctahedronGeometry(0.4), glowMat);
    tip.position.set(sx, h + 0.2, sz);
    parent.add(tip);
  }
}

function createGenericObstacle(parent: THREE.Group, obs: Obstacle, theme: Theme): void {
  const width = obs.w * TILE_SIZE * 0.9;
  const depth = obs.h * TILE_SIZE * 0.9;
  const height = 3.0;

  const mat = new THREE.MeshStandardMaterial({
    color: theme.obstacleColor,
    roughness: 0.8
  });

  const geo = new THREE.BoxGeometry(width, height, depth);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = height / 2;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
}
