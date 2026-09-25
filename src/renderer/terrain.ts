import * as THREE from 'three';
import { GRID_COLS, GRID_ROWS, TILE_SIZE, MAP_OBSTACLES, worldX, worldZ, rnd } from '../data/constants';
import type { Theme } from '../data/types';
import { THEMES } from '../data/themes';

// 1. JUNGLE OBSTACLE BUILDER
export function buildJungleObstacle(group: THREE.Group, type: number): void {
  const barkMat = new THREE.MeshStandardMaterial({ color: 0x3d2817, roughness: 0.9 });
  const leafMat1 = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
  const leafMat2 = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.85 });
  const leafBright = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.7 });
  const boneMat = new THREE.MeshStandardMaterial({ color: 0xdfdacb, roughness: 0.75, metalness: 0.05 });
  const sporeMat = new THREE.MeshStandardMaterial({ color: 0x86efac, roughness: 0.3, emissive: 0x22c55e, emissiveIntensity: 0.6 });
  const mudMat = new THREE.MeshStandardMaterial({ color: 0x24180d, roughness: 0.95 });

  if (type === 0) {
    // 🌳 ALIEN JUNGLE TREE & CANOPY
    const trunkGeo = new THREE.CylinderGeometry(0.35, 0.6, 3.8, 8);
    const trunk = new THREE.Mesh(trunkGeo, barkMat);
    trunk.position.set(0.2, 1.9, 0);
    trunk.rotation.z = 0.08;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    group.add(trunk);

    // Sprawling gnarled roots
    const rootGeo = new THREE.CylinderGeometry(0.12, 0.28, 1.8, 6);
    const root1 = new THREE.Mesh(rootGeo, barkMat);
    root1.position.set(-0.6, 0.35, 0.4);
    root1.rotation.z = 1.1;
    root1.rotation.y = 0.5;
    group.add(root1);
    const root2 = new THREE.Mesh(rootGeo, barkMat);
    root2.position.set(0.7, 0.3, -0.5);
    root2.rotation.z = -1.0;
    root2.rotation.y = -0.4;
    group.add(root2);

    // Canopy foliage crowns
    const canopy1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.6, 1), leafMat1);
    canopy1.position.set(0.3, 3.8, 0.1);
    canopy1.castShadow = true;
    group.add(canopy1);

    const canopy2 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2, 1), leafBright);
    canopy2.position.set(-0.8, 3.2, 0.5);
    canopy2.castShadow = true;
    group.add(canopy2);

    const canopy3 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.1, 1), leafMat2);
    canopy3.position.set(0.9, 3.1, -0.6);
    canopy3.castShadow = true;
    group.add(canopy3);

    // Hanging creepers
    const vineGeo = new THREE.CylinderGeometry(0.05, 0.03, 1.8, 4);
    const vine1 = new THREE.Mesh(vineGeo, leafBright);
    vine1.position.set(-0.5, 2.2, 0.6);
    group.add(vine1);
    const vine2 = new THREE.Mesh(vineGeo, leafBright);
    vine2.position.set(0.6, 2.0, -0.4);
    group.add(vine2);
  } else if (type === 1) {
    // 🌾 OVERGROWN JUNGLE WEEDS, TALL CANE STALKS & THISTLE PLUMES
    const weedBase = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.2, 0.3, 8), mudMat);
    weedBase.position.y = 0.15;
    weedBase.receiveShadow = true;
    group.add(weedBase);

    // Tall arching weed stalks and reed stems
    const stalkMat = new THREE.MeshStandardMaterial({ color: 0x2e6b27, roughness: 0.8 });
    const stalkGeo = new THREE.CylinderGeometry(0.04, 0.09, 2.8, 5);

    const stalkConfigs = [
      { x: -0.5, z: 0.2, rotX: 0.15, rotZ: 0.25, h: 3.2, s: 1.1, mat: leafBright },
      { x: -0.2, z: -0.4, rotX: -0.2, rotZ: -0.1, h: 2.9, s: 1.0, mat: leafMat1 },
      { x: 0.3, z: 0.3, rotX: 0.1, rotZ: -0.3, h: 3.4, s: 1.2, mat: leafMat2 },
      { x: 0.6, z: -0.2, rotX: -0.25, rotZ: -0.2, h: 2.7, s: 0.95, mat: leafBright },
      { x: 0.0, z: 0.5, rotX: 0.3, rotZ: 0.05, h: 3.0, s: 1.05, mat: leafMat1 },
      { x: -0.7, z: -0.3, rotX: -0.15, rotZ: 0.35, h: 2.5, s: 0.9, mat: leafMat2 },
      { x: 0.5, z: 0.6, rotX: 0.25, rotZ: -0.25, h: 2.6, s: 0.9, mat: leafBright },
      { x: -0.1, z: 0.0, rotX: 0.05, rotZ: -0.05, h: 3.5, s: 1.25, mat: leafBright }
    ];

    stalkConfigs.forEach(cfg => {
      const stalk = new THREE.Mesh(stalkGeo, stalkMat);
      stalk.position.set(cfg.x, cfg.h * 0.45, cfg.z);
      stalk.rotation.x = cfg.rotX;
      stalk.rotation.z = cfg.rotZ;
      stalk.scale.set(cfg.s, cfg.s * (cfg.h / 2.8), cfg.s);
      stalk.castShadow = true;
      group.add(stalk);

      const plumeGeo = new THREE.ConeGeometry(0.18 * cfg.s, 0.7 * cfg.s, 5);
      const plume = new THREE.Mesh(plumeGeo, cfg.mat);
      plume.position.set(
        cfg.x - Math.sin(cfg.rotZ) * cfg.h * 0.85,
        cfg.h * 0.9,
        cfg.z + Math.sin(cfg.rotX) * cfg.h * 0.85
      );
      plume.rotation.x = cfg.rotX * 1.3;
      plume.rotation.z = cfg.rotZ * 1.3;
      group.add(plume);
    });

    // Outer dense ring of weed blades
    for (let a = 0; a < 14; a++) {
      const angle = (a / 14) * Math.PI * 2 + (a % 2 ? 0.2 : 0);
      const radius = 0.55 + (a % 3) * 0.35;
      const bladeHeight = 1.6 + (a % 4) * 0.45;
      const bladeGeo = new THREE.ConeGeometry(0.18, bladeHeight, 4);
      const bladeMat = a % 3 === 0 ? leafBright : a % 3 === 1 ? leafMat1 : leafMat2;
      const blade = new THREE.Mesh(bladeGeo, bladeMat);

      blade.position.set(Math.cos(angle) * radius, bladeHeight * 0.45, Math.sin(angle) * radius);
      blade.rotation.x = Math.sin(angle) * (0.35 + (a % 3) * 0.15);
      blade.rotation.z = -Math.cos(angle) * (0.35 + (a % 3) * 0.15);
      blade.rotation.y = angle + 0.5;
      blade.scale.set(0.7, 1.0, 0.15);
      blade.castShadow = true;
      group.add(blade);
    }
  } else {
    // ☠️ BLEACHED ANIMAL SKELETON, EXPOSED RIB CAGE & FUNGAL SPORES
    const spineGeo = new THREE.CylinderGeometry(0.14, 0.18, 3.6, 6);
    const spine = new THREE.Mesh(spineGeo, boneMat);
    spine.position.set(0, 0.45, 0);
    spine.rotation.z = Math.PI / 2 + 0.12;
    spine.rotation.y = 0.4;
    spine.castShadow = true;
    group.add(spine);

    // Arching rib bones
    for (let i = -3; i <= 3; i++) {
      const ribGeo = new THREE.TorusGeometry(0.75 + Math.abs(i) * 0.08, 0.07, 5, 12, Math.PI * 0.95);
      const ribL = new THREE.Mesh(ribGeo, boneMat);
      ribL.position.set(i * 0.45, 0.6, 0.15);
      ribL.rotation.y = 0.4;
      ribL.rotation.z = 0.2;
      ribL.castShadow = true;
      group.add(ribL);
    }

    // Creature skull
    const skull = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55, 0), boneMat);
    skull.position.set(1.9, 0.45, 0.8);
    skull.rotation.set(0.3, -0.6, 0.4);
    skull.castShadow = true;
    group.add(skull);

    // Glowing alien spore mushrooms
    for (let s = 0; s < 4; s++) {
      const spore = new THREE.Mesh(new THREE.SphereGeometry(0.24, 7, 7), sporeMat);
      spore.position.set(-0.9 + s * 0.6, 0.35 + (s % 2) * 0.15, 0.6 - (s % 3) * 0.4);
      spore.scale.set(1.2, 0.7, 1.2);
      group.add(spore);
    }
  }
}

// 2. DESERT OBSTACLE BUILDER
export function buildDesertObstacle(group: THREE.Group, type: number): void {
  const rockDark = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.9, metalness: 0.1 });
  const rockMid = new THREE.MeshStandardMaterial({ color: 0xa16207, roughness: 0.85, metalness: 0.15 });
  const sandMat = new THREE.MeshStandardMaterial({ color: 0xc28834, roughness: 0.95 });
  const cactusMat1 = new THREE.MeshStandardMaterial({ color: 0x2d5a1e, roughness: 0.82 });
  const cactusMat2 = new THREE.MeshStandardMaterial({ color: 0x3f6212, roughness: 0.78 });
  const cactusBloom = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.4, emissive: 0xbe123c, emissiveIntensity: 0.4 });

  function addSaguaro(x: number, y: number, z: number, height = 3.4, rad = 0.22, rotY = 0, armConfig = 'dual') {
    const cGroup = new THREE.Group();
    cGroup.position.set(x, y, z);
    cGroup.rotation.y = rotY;

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(rad * 0.9, rad, height, 8), cactusMat1);
    trunk.position.y = height / 2;
    trunk.castShadow = true;
    cGroup.add(trunk);

    const dome = new THREE.Mesh(new THREE.SphereGeometry(rad * 0.9, 8, 6), cactusMat1);
    dome.position.y = height;
    cGroup.add(dome);

    const flower = new THREE.Mesh(new THREE.ConeGeometry(rad * 0.55, rad * 0.9, 5), cactusBloom);
    flower.position.y = height + rad * 0.6;
    cGroup.add(flower);

    if (armConfig === 'dual' || armConfig === 'left') {
      const hArm1 = new THREE.Mesh(new THREE.CylinderGeometry(rad * 0.55, rad * 0.58, rad * 3.4, 6), cactusMat2);
      hArm1.position.set(-rad * 1.5, height * 0.48, 0);
      hArm1.rotation.z = Math.PI / 2;
      hArm1.castShadow = true;
      cGroup.add(hArm1);

      const vArm1 = new THREE.Mesh(new THREE.CylinderGeometry(rad * 0.5, rad * 0.55, height * 0.45, 6), cactusMat2);
      vArm1.position.set(-rad * 2.8, height * 0.66, 0);
      vArm1.castShadow = true;
      cGroup.add(vArm1);
    }

    if (armConfig === 'dual' || armConfig === 'right') {
      const hArm2 = new THREE.Mesh(new THREE.CylinderGeometry(rad * 0.5, rad * 0.55, rad * 2.8, 6), cactusMat2);
      hArm2.position.set(rad * 1.3, height * 0.62, 0);
      hArm2.rotation.z = -Math.PI / 2;
      hArm2.castShadow = true;
      cGroup.add(hArm2);

      const vArm2 = new THREE.Mesh(new THREE.CylinderGeometry(rad * 0.46, rad * 0.5, height * 0.36, 6), cactusMat2);
      vArm2.position.set(rad * 2.4, height * 0.76, 0);
      vArm2.castShadow = true;
      cGroup.add(vArm2);
    }

    group.add(cGroup);
  }

  function addBarrelCactus(x: number, y: number, z: number, s = 1.0) {
    const bGeo = new THREE.SphereGeometry(0.35 * s, 7, 7);
    bGeo.scale(1.1, 0.85, 1.1);
    const bMesh = new THREE.Mesh(bGeo, cactusMat2);
    bMesh.position.set(x, y + 0.28 * s, z);
    bMesh.castShadow = true;
    group.add(bMesh);
  }

  if (type === 0) {
    const crag1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.6, 0), rockMid);
    crag1.position.set(-0.3, 1.5, 0);
    crag1.scale.set(1.1, 1.8, 0.9);
    crag1.rotation.set(0.2, 0.4, 0.15);
    crag1.castShadow = true;
    group.add(crag1);

    const crag2 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.1, 0), rockDark);
    crag2.position.set(1.0, 0.9, 0.4);
    crag2.scale.set(0.9, 1.3, 1.1);
    crag2.rotation.set(-0.3, 0.6, -0.2);
    crag2.castShadow = true;
    group.add(crag2);

    const sandBase = new THREE.Mesh(new THREE.ConeGeometry(2.4, 0.8, 8), sandMat);
    sandBase.position.y = 0.35;
    sandBase.receiveShadow = true;
    group.add(sandBase);

    addSaguaro(0.85, 0.2, -0.6, 3.6, 0.22, 0.5, 'dual');
    addBarrelCactus(-1.1, 0.2, 0.6, 1.1);
  } else if (type === 1) {
    const dune1 = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 2.6, 1.4, 10), sandMat);
    dune1.position.set(0.2, 0.65, 0);
    dune1.scale.set(1.3, 1, 0.9);
    dune1.castShadow = true;
    group.add(dune1);

    const slab = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 0.4), rockDark);
    slab.position.set(0.6, 0.8, -0.4);
    slab.rotation.set(0.3, 0.5, -0.4);
    slab.castShadow = true;
    group.add(slab);

    addSaguaro(-0.6, 0.5, 0.2, 3.4, 0.2, -0.3, 'dual');
    addSaguaro(0.8, 0.3, 0.7, 2.2, 0.16, 0.8, 'left');
  } else {
    const towerGeo = new THREE.CylinderGeometry(0.55, 0.95, 4.2, 7);
    const tower = new THREE.Mesh(towerGeo, rockMid);
    tower.position.set(-0.3, 2.0, 0);
    tower.castShadow = true;
    group.add(tower);

    const collar = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 1.6), rockDark);
    collar.position.set(-0.3, 2.5, 0);
    group.add(collar);

    addSaguaro(0.85, 0, -0.3, 4.0, 0.24, 0.4, 'dual');
    addBarrelCactus(-1.1, 0, 0.7, 0.9);
  }
}

// 3. SNOW OBSTACLE BUILDER
export function buildSnowObstacle(group: THREE.Group, type: number): void {
  const graniteMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85 });
  const snowMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.95 });
  const iceMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.1,
    metalness: 0.3,
    transparent: true,
    opacity: 0.85
  });

  if (type === 0) {
    const peak = new THREE.Mesh(new THREE.ConeGeometry(1.8, 4.2, 7), graniteMat);
    peak.position.set(0, 2.1, 0);
    peak.castShadow = true;
    group.add(peak);

    const snowCap = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.8, 7), snowMat);
    snowCap.position.set(0, 3.3, 0);
    group.add(snowCap);

    const iceSpire = new THREE.Mesh(new THREE.ConeGeometry(0.35, 2.8, 5), iceMat);
    iceSpire.position.set(1.1, 1.4, 0.5);
    iceSpire.rotation.z = -0.2;
    group.add(iceSpire);
  } else if (type === 1) {
    const iceberg = new THREE.Mesh(new THREE.DodecahedronGeometry(1.7, 0), iceMat);
    iceberg.position.set(-0.2, 1.5, 0);
    iceberg.scale.set(1.1, 1.6, 0.95);
    iceberg.castShadow = true;
    group.add(iceberg);

    for (let a = 0; a < 3; a++) {
      const angle = a * 2.1;
      const shardGeo = new THREE.ConeGeometry(0.35, 2.6, 5);
      const shard = new THREE.Mesh(shardGeo, iceMat);
      shard.position.set(Math.cos(angle) * 1.0, 1.3, Math.sin(angle) * 1.0);
      group.add(shard);
    }
  } else {
    const snowDrift = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2.4, 1.2, 10), snowMat);
    snowDrift.position.set(0.2, 0.55, 0);
    snowDrift.castShadow = true;
    group.add(snowDrift);

    const boulder1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2, 0), graniteMat);
    boulder1.position.set(-0.6, 1.0, 0.3);
    boulder1.castShadow = true;
    group.add(boulder1);
  }
}

// 4. CITY OBSTACLE BUILDER
export function buildCityObstacle(group: THREE.Group, type: number): void {
  const concreteMat = new THREE.MeshStandardMaterial({ color: 0x272e39, roughness: 0.9, metalness: 0.1 });
  const darkConcrete = new THREE.MeshStandardMaterial({ color: 0x1a202c, roughness: 0.95 });
  const rubbleMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 });
  const hazardMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6, metalness: 0.3 });
  const rebarMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7, metalness: 0.6 });
  const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.8 });

  if (type === 0) {
    const wallGeo = new THREE.BoxGeometry(3.6, 3.8, 0.75);
    const wall = new THREE.Mesh(wallGeo, concreteMat);
    wall.position.y = 1.9;
    wall.castShadow = true;
    wall.receiveShadow = true;
    group.add(wall);

    const win1 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.2, 0.9), darkConcrete);
    win1.position.set(-0.9, 2.4, 0);
    group.add(win1);
    const win2 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.2, 0.9), darkConcrete);
    win2.position.set(0.9, 2.4, 0);
    group.add(win2);

    const floorSlab = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.25, 1.8), concreteMat);
    floorSlab.position.set(0, 1.6, 0.6);
    floorSlab.castShadow = true;
    group.add(floorSlab);
  } else if (type === 1) {
    const barricade = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.4, 1.0), concreteMat);
    barricade.position.y = 0.7;
    barricade.castShadow = true;
    group.add(barricade);

    const stripe = new THREE.Mesh(new THREE.BoxGeometry(3.42, 0.35, 1.02), hazardMat);
    stripe.position.y = 0.7;
    group.add(stripe);

    const beam = new THREE.Mesh(new THREE.BoxGeometry(0.25, 3.2, 0.25), rebarMat);
    beam.position.set(-0.8, 1.4, 0.6);
    beam.rotation.z = -0.45;
    beam.castShadow = true;
    group.add(beam);
  } else {
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.7, 2.8), concreteMat);
    base.position.y = 0.35;
    base.castShadow = true;
    group.add(base);

    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 3.8, 8), concreteMat);
    col.position.set(0.2, 2.0, 0);
    col.rotation.z = 0.15;
    col.castShadow = true;
    group.add(col);

    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), brassMat);
    skull.position.set(-0.7, 0.7, 0.5);
    group.add(skull);
  }
}

// 5. TECH SPACE OBSTACLE BUILDER
export function buildTechObstacle(group: THREE.Group, type: number): void {
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.7 });
  const darkMetal = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
  const cyanGlow = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    roughness: 0.2,
    emissive: 0x0891b2,
    emissiveIntensity: 0.6
  });
  const amberGlow = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.3,
    emissive: 0xd97706,
    emissiveIntensity: 0.6
  });

  if (type === 0) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(3.6, 3.2, 0.9), metalMat);
    wall.position.y = 1.6;
    wall.castShadow = true;
    wall.receiveShadow = true;
    group.add(wall);

    const conduit = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.6, 8), cyanGlow);
    conduit.rotation.z = Math.PI / 2;
    conduit.position.set(0, 2.8, 0.5);
    group.add(conduit);
  } else if (type === 1) {
    const gen = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.5, 1.4), metalMat);
    gen.position.y = 0.75;
    gen.castShadow = true;
    group.add(gen);

    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.8, 12), cyanGlow);
    core.position.set(-0.7, 0.9, 0);
    core.castShadow = true;
    group.add(core);

    const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 1.4, 12), amberGlow);
    tank.position.set(0.9, 0.7, 0);
    tank.castShadow = true;
    group.add(tank);
  } else {
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.6, 2.6), darkMetal);
    base.position.y = 0.3;
    group.add(base);

    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 4.0, 8), metalMat);
    mast.position.y = 2.0;
    mast.castShadow = true;
    group.add(mast);

    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), amberGlow);
    beacon.position.y = 4.2;
    group.add(beacon);

    for (let r = 0; r < 4; r++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.08, 6, 16), cyanGlow);
      ring.position.y = 1.0 + r * 0.75;
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
    }
  }
}

// 6. ASTRAL CRYSTAL SPIRE OBSTACLE BUILDER
export function buildAstralObstacle(group: THREE.Group, type: number): void {
  const crystalCyan = new THREE.MeshStandardMaterial({
    color: 0x67e8f9,
    roughness: 0.1,
    metalness: 0.2,
    emissive: 0x06b6d4,
    emissiveIntensity: 0.6,
    transparent: true,
    opacity: 0.85
  });
  const crystalPurple = new THREE.MeshStandardMaterial({
    color: 0xc084fc,
    roughness: 0.15,
    metalness: 0.3,
    emissive: 0x9333ea,
    emissiveIntensity: 0.7,
    transparent: true,
    opacity: 0.9
  });
  const wraithbone = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.4, metalness: 0.1 });
  const astralStone = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.85, metalness: 0.3 });
  const ringMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.2, emissive: 0x7e22ce, emissiveIntensity: 0.5 });

  if (type === 0) {
    // Floating crystal cluster spire
    const base = new THREE.Mesh(new THREE.DodecahedronGeometry(1.4, 0), astralStone);
    base.position.y = 0.5;
    base.scale.set(1.2, 0.7, 1.2);
    base.castShadow = true;
    group.add(base);

    const mainCrystal = new THREE.Mesh(new THREE.ConeGeometry(0.7, 3.8, 6), crystalCyan);
    mainCrystal.position.set(0, 2.3, 0);
    mainCrystal.castShadow = true;
    group.add(mainCrystal);

    const crystalCap = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.2, 6), crystalCyan);
    crystalCap.position.set(0, 0.4, 0);
    crystalCap.rotation.x = Math.PI;
    group.add(crystalCap);

    // Surrounding crystal shards
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const shard = new THREE.Mesh(new THREE.ConeGeometry(0.35, 2.2, 5), crystalPurple);
      shard.position.set(Math.cos(angle) * 0.9, 1.2, Math.sin(angle) * 0.9);
      shard.rotation.x = Math.sin(angle) * 0.4;
      shard.rotation.z = -Math.cos(angle) * 0.4;
      shard.castShadow = true;
      group.add(shard);
    }
  } else if (type === 1) {
    // Wraithbone monolith gateway
    const pillar1 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 4.0, 0.6), wraithbone);
    pillar1.position.set(-1.0, 2.0, 0);
    pillar1.castShadow = true;
    group.add(pillar1);

    const pillar2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 4.0, 0.6), wraithbone);
    pillar2.position.set(1.0, 2.0, 0);
    pillar2.castShadow = true;
    group.add(pillar2);

    const arch = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.5, 0.8), wraithbone);
    arch.position.set(0, 3.8, 0);
    arch.castShadow = true;
    group.add(arch);

    // Floating resonant prism in the gateway center
    const prism = new THREE.Mesh(new THREE.OctahedronGeometry(0.65, 0), crystalPurple);
    prism.position.set(0, 2.2, 0);
    prism.rotation.y = Math.PI / 4;
    group.add(prism);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.06, 6, 16), ringMat);
    ring.position.set(0, 2.2, 0);
    ring.rotation.x = Math.PI / 3;
    group.add(ring);
  } else {
    // Resonant obelisk with levitating rings
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.6, 0.8, 8), astralStone);
    pedestal.position.y = 0.4;
    pedestal.castShadow = true;
    group.add(pedestal);

    const obelisk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.6, 3.6, 6), wraithbone);
    obelisk.position.y = 2.4;
    obelisk.castShadow = true;
    group.add(obelisk);

    const apex = new THREE.Mesh(new THREE.OctahedronGeometry(0.5, 0), crystalCyan);
    apex.position.y = 4.4;
    group.add(apex);

    for (let r = 0; r < 3; r++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.85 + r * 0.2, 0.05, 6, 16), ringMat);
      ring.position.y = 1.4 + r * 0.9;
      ring.rotation.x = Math.PI / 2 + 0.2 * (r - 1);
      ring.rotation.y = 0.3 * r;
      group.add(ring);
    }
  }
}

// 7. CORRUPTED FLESH-WORLD OBSTACLE BUILDER
export function buildCorruptedObstacle(group: THREE.Group, type: number): void {
  const fleshDark = new THREE.MeshStandardMaterial({ color: 0x4a0404, roughness: 0.85, metalness: 0.1 });
  const fleshPulsing = new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.6, emissive: 0x4c0519, emissiveIntensity: 0.5 });
  const boneSpike = new THREE.MeshStandardMaterial({ color: 0xdfdacb, roughness: 0.7, metalness: 0.05 });
  const eyeGlow = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.2, emissive: 0xd97706, emissiveIntensity: 0.8 });
  const tentacleMat = new THREE.MeshStandardMaterial({ color: 0x581c87, roughness: 0.7, emissive: 0x3b0764, emissiveIntensity: 0.3 });

  if (type === 0) {
    // Demonic horns and bone spikes on fleshy mound
    const mound = new THREE.Mesh(new THREE.DodecahedronGeometry(1.6, 1), fleshDark);
    mound.position.y = 0.5;
    mound.scale.set(1.4, 0.7, 1.4);
    mound.castShadow = true;
    group.add(mound);

    // Large arching demon horn
    const horn1 = new THREE.Mesh(new THREE.ConeGeometry(0.45, 3.6, 8), boneSpike);
    horn1.position.set(-0.4, 1.8, 0);
    horn1.rotation.z = -0.35;
    horn1.rotation.y = 0.3;
    horn1.castShadow = true;
    group.add(horn1);

    const horn2 = new THREE.Mesh(new THREE.ConeGeometry(0.35, 2.8, 8), boneSpike);
    horn2.position.set(0.6, 1.4, 0.3);
    horn2.rotation.z = 0.4;
    horn2.rotation.y = -0.4;
    horn2.castShadow = true;
    group.add(horn2);

    // Sprouting bone spines
    for (let s = 0; s < 5; s++) {
      const angle = (s / 5) * Math.PI * 2;
      const spine = new THREE.Mesh(new THREE.ConeGeometry(0.12, 1.6, 5), boneSpike);
      spine.position.set(Math.cos(angle) * 1.1, 0.7, Math.sin(angle) * 1.1);
      spine.rotation.x = Math.sin(angle) * 0.5;
      spine.rotation.z = -Math.cos(angle) * 0.5;
      group.add(spine);
    }
  } else if (type === 1) {
    // Occult eye altar with staring ocular pustules
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 3.2, 8), fleshDark);
    pillar.position.y = 1.6;
    pillar.castShadow = true;
    group.add(pillar);

    // Main demonic central eye
    const mainEye = new THREE.Mesh(new THREE.SphereGeometry(0.65, 12, 12), eyeGlow);
    mainEye.position.set(0, 2.8, 0.4);
    mainEye.scale.set(1, 0.8, 0.6);
    group.add(mainEye);

    // Minor eyes around pillar
    for (let e = 0; e < 4; e++) {
      const angle = (e / 4) * Math.PI * 2 + 0.4;
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), eyeGlow);
      eye.position.set(Math.cos(angle) * 0.85, 1.2 + (e % 2) * 0.7, Math.sin(angle) * 0.85);
      group.add(eye);
    }

    // Horns crowning the altar
    const crownHorn = new THREE.Mesh(new THREE.ConeGeometry(0.25, 1.8, 6), boneSpike);
    crownHorn.position.set(-0.5, 3.8, 0);
    crownHorn.rotation.z = -0.3;
    group.add(crownHorn);

    const crownHorn2 = new THREE.Mesh(new THREE.ConeGeometry(0.25, 1.8, 6), boneSpike);
    crownHorn2.position.set(0.5, 3.8, 0);
    crownHorn2.rotation.z = 0.3;
    group.add(crownHorn2);
  } else {
    // Writhing tendril pillar with cysts
    const mainTendril = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.7, 3.8, 8), tentacleMat);
    mainTendril.position.set(0.1, 1.9, 0);
    mainTendril.rotation.z = 0.12;
    mainTendril.castShadow = true;
    group.add(mainTendril);

    const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.4, 2.2, 6), tentacleMat);
    branch.position.set(-0.6, 2.2, 0.3);
    branch.rotation.z = -0.6;
    branch.rotation.x = 0.3;
    branch.castShadow = true;
    group.add(branch);

    // Glowing pustule clusters
    for (let p = 0; p < 6; p++) {
      const cyst = new THREE.Mesh(new THREE.SphereGeometry(0.22, 6, 6), fleshPulsing);
      cyst.position.set(
        (p % 2 === 0 ? 0.35 : -0.35) * (0.8 + (p % 3) * 0.2),
        0.6 + p * 0.55,
        (p % 3 - 1) * 0.3
      );
      group.add(cyst);
    }
  }
}

// 8. DEVOURED WORLD OBSTACLE BUILDER
export function buildDevouredObstacle(group: THREE.Group, type: number): void {
  const chitinBlack = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.7, metalness: 0.3 });
  const chitinPurple = new THREE.MeshStandardMaterial({ color: 0x3b0764, roughness: 0.6, metalness: 0.2 });
  const acidBile = new THREE.MeshStandardMaterial({
    color: 0x84cc16,
    roughness: 0.2,
    emissive: 0x4d7c0f,
    emissiveIntensity: 0.8,
    transparent: true,
    opacity: 0.9
  });
  const strippedRock = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.95 });

  if (type === 0) {
    // Acid digestion chimney bio-vent
    const ventBase = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.7, 2.6, 8), chitinBlack);
    ventBase.position.y = 1.3;
    ventBase.castShadow = true;
    group.add(ventBase);

    // Acid pool at rim
    const acidPool = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.2, 8), acidBile);
    acidPool.position.y = 2.55;
    group.add(acidPool);

    // Chitin plates surrounding vent
    for (let c = 0; c < 4; c++) {
      const angle = (c / 4) * Math.PI * 2;
      const plate = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.8, 0.8), chitinPurple);
      plate.position.set(Math.cos(angle) * 1.25, 1.8, Math.sin(angle) * 1.25);
      plate.rotation.y = angle;
      plate.rotation.z = (c % 2 === 0 ? 0.15 : -0.15);
      plate.castShadow = true;
      group.add(plate);
    }
  } else if (type === 1) {
    // Ribbed bio-conduit spire / organism spine
    const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.8, 4.0, 7), chitinPurple);
    spine.position.y = 2.0;
    spine.castShadow = true;
    group.add(spine);

    // Rib plates
    for (let r = 0; r < 5; r++) {
      const rib = new THREE.Mesh(new THREE.TorusGeometry(0.7 - r * 0.08, 0.1, 4, 10, Math.PI * 1.2), chitinBlack);
      rib.position.set(0, 0.8 + r * 0.65, 0);
      rib.rotation.y = r * 0.4;
      rib.rotation.x = Math.PI / 2;
      group.add(rib);
    }

    // Glowing bile gland
    const gland = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), acidBile);
    gland.position.set(0, 3.8, 0);
    group.add(gland);
  } else {
    // Stripped bedrock crater with mandibles and toxic bile pool
    const crater = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.2, 0.6, 8), strippedRock);
    crater.position.y = 0.3;
    crater.castShadow = true;
    group.add(crater);

    const bilePool = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.15, 8), acidBile);
    bilePool.position.y = 0.55;
    group.add(bilePool);

    // Chitin mandibles / spikes
    for (let m = 0; m < 3; m++) {
      const angle = (m / 3) * Math.PI * 2;
      const mandible = new THREE.Mesh(new THREE.ConeGeometry(0.3, 2.4, 5), chitinBlack);
      mandible.position.set(Math.cos(angle) * 1.1, 1.2, Math.sin(angle) * 1.1);
      mandible.rotation.x = -Math.sin(angle) * 0.4;
      mandible.rotation.z = Math.cos(angle) * 0.4;
      mandible.castShadow = true;
      group.add(mandible);
    }
  }
}

// 9. TOMB WORLD OBSTACLE BUILDER
export function buildTombObstacle(group: THREE.Group, type: number): void {
  const livingMetal = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.35, metalness: 0.85 });
  const tombObsidian = new THREE.MeshStandardMaterial({ color: 0x030712, roughness: 0.5, metalness: 0.6 });
  const gaussGreen = new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    roughness: 0.1,
    emissive: 0x16a34a,
    emissiveIntensity: 0.9
  });
  const gaussBright = new THREE.MeshStandardMaterial({
    color: 0x86efac,
    roughness: 0.1,
    emissive: 0x22c55e,
    emissiveIntensity: 1.0
  });

  if (type === 0) {
    // Stepped living-metal pyramid pylon with floating apex crystal
    const step1 = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.7, 2.8), livingMetal);
    step1.position.y = 0.35;
    step1.castShadow = true;
    group.add(step1);

    const step2 = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.7, 2.0), livingMetal);
    step2.position.y = 1.05;
    step2.castShadow = true;
    group.add(step2);

    const step3 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.7, 1.2), tombObsidian);
    step3.position.y = 1.75;
    step3.castShadow = true;
    group.add(step3);

    // Floating Gauss apex octahedron
    const apex = new THREE.Mesh(new THREE.OctahedronGeometry(0.6, 0), gaussGreen);
    apex.position.y = 3.0;
    group.add(apex);

    // Gauss energy conduit lines
    const line = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.8, 6), gaussBright);
    line.position.y = 2.3;
    group.add(line);
  } else if (type === 1) {
    // Tomb gateway stasis portal
    const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 3.8, 0.7), livingMetal);
    p1.position.set(-1.1, 1.9, 0);
    p1.castShadow = true;
    group.add(p1);

    const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 3.8, 0.7), livingMetal);
    p2.position.set(1.1, 1.9, 0);
    p2.castShadow = true;
    group.add(p2);

    const lintel = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.6, 0.9), tombObsidian);
    lintel.position.set(0, 3.7, 0);
    lintel.castShadow = true;
    group.add(lintel);

    // Glowing Gauss portal field
    const portal = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 3.0), gaussGreen);
    portal.position.set(0, 1.8, 0);
    group.add(portal);

    // Conduit glowing bands
    for (let b = 0; b < 3; b++) {
      const band = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.12, 0.75), gaussGreen);
      band.position.set(-1.1, 0.8 + b * 1.1, 0);
      group.add(band);
      const band2 = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.12, 0.75), gaussGreen);
      band2.position.set(1.1, 0.8 + b * 1.1, 0);
      group.add(band2);
    }
  } else {
    // Gauss power obelisk with segmented floating rings
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.4, 0.6, 6), tombObsidian);
    base.position.y = 0.3;
    base.castShadow = true;
    group.add(base);

    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.55, 3.8, 6), livingMetal);
    core.position.y = 2.2;
    core.castShadow = true;
    group.add(core);

    const energyCore = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 4.0, 8), gaussGreen);
    energyCore.position.y = 2.2;
    group.add(energyCore);

    for (let r = 0; r < 3; r++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.08, 6, 6), gaussBright);
      ring.position.y = 1.2 + r * 1.1;
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
    }
  }
}

// 10. WARP RIFT WORLD OBSTACLE BUILDER
export function buildRiftObstacle(group: THREE.Group, type: number): void {
  const obsidianBasalt = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.8, metalness: 0.3 });
  const moltenCore = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    roughness: 0.3,
    emissive: 0xdc2626,
    emissiveIntensity: 0.9
  });
  const warpPurple = new THREE.MeshStandardMaterial({
    color: 0xa855f7,
    roughness: 0.2,
    emissive: 0x7e22ce,
    emissiveIntensity: 0.8,
    transparent: true,
    opacity: 0.85
  });
  const warpFire = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    roughness: 0.3,
    emissive: 0xea580c,
    emissiveIntensity: 0.85
  });

  if (type === 0) {
    // Basalt crag with molten fissure
    const crag1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.5, 0), obsidianBasalt);
    crag1.position.set(-0.4, 1.4, 0);
    crag1.scale.set(0.9, 1.8, 1.0);
    crag1.rotation.set(0.2, 0.4, 0.1);
    crag1.castShadow = true;
    group.add(crag1);

    const crag2 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.3, 0), obsidianBasalt);
    crag2.position.set(0.6, 1.1, 0.2);
    crag2.scale.set(0.8, 1.5, 0.9);
    crag2.rotation.set(-0.2, -0.3, -0.15);
    crag2.castShadow = true;
    group.add(crag2);

    // Glowing molten lava core in the fissure
    const magmaFissure = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.6, 1.2), moltenCore);
    magmaFissure.position.set(0.1, 1.3, 0.1);
    group.add(magmaFissure);

    // Floating embers / shards
    const ember = new THREE.Mesh(new THREE.DodecahedronGeometry(0.25, 0), warpFire);
    ember.position.set(0.2, 3.2, -0.2);
    group.add(ember);
  } else if (type === 1) {
    // Floating anti-gravity rock spires over molten vortex
    const baseRock = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.8, 0.7, 8), obsidianBasalt);
    baseRock.position.y = 0.35;
    baseRock.castShadow = true;
    group.add(baseRock);

    const ventGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.1, 8), warpPurple);
    ventGlow.position.y = 0.71;
    group.add(ventGlow);

    // Levitating shattered basalt shard
    const floatShard = new THREE.Mesh(new THREE.ConeGeometry(0.6, 2.6, 5), obsidianBasalt);
    floatShard.position.set(0, 2.6, 0);
    floatShard.rotation.x = Math.PI;
    floatShard.rotation.z = 0.15;
    floatShard.castShadow = true;
    group.add(floatShard);

    const floatShard2 = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.8, 5), obsidianBasalt);
    floatShard2.position.set(0.7, 2.0, 0.4);
    floatShard2.rotation.z = -0.3;
    group.add(floatShard2);

    // Warp energy aura
    const energyAura = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), warpFire);
    energyAura.position.set(0, 1.4, 0);
    group.add(energyAura);
  } else {
    // Warp rift monolith with vortex rings
    const monolith = new THREE.Mesh(new THREE.BoxGeometry(1.2, 3.8, 1.2), obsidianBasalt);
    monolith.position.y = 1.9;
    monolith.castShadow = true;
    group.add(monolith);

    const riftCore = new THREE.Mesh(new THREE.SphereGeometry(0.55, 10, 10), warpPurple);
    riftCore.position.set(0, 2.2, 0.65);
    group.add(riftCore);

    for (let v = 0; v < 3; v++) {
      const vortexRing = new THREE.Mesh(new THREE.TorusGeometry(0.9 + v * 0.25, 0.06, 6, 16), warpFire);
      vortexRing.position.set(0, 1.2 + v * 0.9, 0);
      vortexRing.rotation.x = Math.PI / 2.5 + v * 0.2;
      vortexRing.rotation.y = v * 0.4;
      group.add(vortexRing);
    }
  }
}

/**
 * Procedurally generates 3D meshes for map obstacles based on theme
 */
export function createObstacleMeshes(themeId: string): THREE.Group {
  const group = new THREE.Group();
  group.name = 'obstacles_group';

  const obstacles = MAP_OBSTACLES[themeId] || MAP_OBSTACLES.tech;

  obstacles.forEach(k => {
    const [x, z] = k.split(',').map(Number);
    const wx = worldX(x);
    const wz = worldZ(z);
    const obsGroup = new THREE.Group();
    obsGroup.position.set(wx, 0, wz);
    const type = (x * 3 + z) % 3;

    if (themeId === 'jungle') {
      buildJungleObstacle(obsGroup, type);
    } else if (themeId === 'desert') {
      buildDesertObstacle(obsGroup, type);
    } else if (themeId === 'snow') {
      buildSnowObstacle(obsGroup, type);
    } else if (themeId === 'city') {
      buildCityObstacle(obsGroup, type);
    } else if (themeId === 'tech') {
      buildTechObstacle(obsGroup, type);
    } else if (themeId === 'astral') {
      buildAstralObstacle(obsGroup, type);
    } else if (themeId === 'corrupted') {
      buildCorruptedObstacle(obsGroup, type);
    } else if (themeId === 'devoured') {
      buildDevouredObstacle(obsGroup, type);
    } else if (themeId === 'tomb') {
      buildTombObstacle(obsGroup, type);
    } else if (themeId === 'rift') {
      buildRiftObstacle(obsGroup, type);
    } else {
      buildTechObstacle(obsGroup, type);
    }

    group.add(obsGroup);
  });

  return group;
}

