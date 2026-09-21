import * as THREE from 'three';
import type { UnitDef } from '../../data/types';

export function createTauFigure(unitDef: UnitDef, primaryColor: number, trimColor: number): THREE.Group {
  const group = new THREE.Group();
  const armorMat = new THREE.MeshStandardMaterial({ color: primaryColor, roughness: 0.35, metalness: 0.2 });
  const trimMat = new THREE.MeshStandardMaterial({ color: trimColor, roughness: 0.4, metalness: 0.5 });
  const darkClothMat = new THREE.MeshStandardMaterial({ color: 0x222226, roughness: 0.8 });
  const lensMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
  const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x1f242b, roughness: 0.5, metalness: 0.7 });

  const isBattlesuit = unitDef.tags?.includes('vehicle') || unitDef.tags?.includes('walker') || unitDef.name.toLowerCase().includes('crisis') || unitDef.name.toLowerCase().includes('broadside') || unitDef.name.toLowerCase().includes('stealth');
  const isTank = unitDef.name.toLowerCase().includes('hammerhead') || unitDef.name.toLowerCase().includes('devilfish') || unitDef.tags?.includes('tank');

  if (isTank) {
    // Grav-tank chassis
    const hullGeo = new THREE.BoxGeometry(3.6, 1.2, 5.0);
    const hull = new THREE.Mesh(hullGeo, armorMat);
    hull.position.y = 1.4;
    group.add(hull);

    // Front nose slope
    const noseGeo = new THREE.ConeGeometry(1.8, 2.5, 4);
    const nose = new THREE.Mesh(noseGeo, armorMat);
    nose.rotation.x = Math.PI / 2;
    nose.rotation.y = Math.PI / 4;
    nose.position.set(0, 1.2, 2.8);
    group.add(nose);

    // Jet turbines / grav engines
    [-1.9, 1.9].forEach(side => {
      const engGeo = new THREE.CylinderGeometry(0.5, 0.6, 3.2, 12);
      const eng = new THREE.Mesh(engGeo, darkMetalMat);
      eng.rotation.x = Math.PI / 2;
      eng.position.set(side, 1.3, -0.6);
      group.add(eng);

      const podWingGeo = new THREE.BoxGeometry(0.8, 0.15, 2.0);
      const podWing = new THREE.Mesh(podWingGeo, trimMat);
      podWing.position.set(side * 1.1, 1.4, -0.5);
      group.add(podWing);
    });

    // Railgun / Ion Cannon Turret
    const turretGeo = new THREE.CylinderGeometry(0.9, 1.1, 0.8, 12);
    const turret = new THREE.Mesh(turretGeo, trimMat);
    turret.position.set(0, 2.2, 0.2);
    group.add(turret);

    const cannonGeo = new THREE.CylinderGeometry(0.18, 0.22, 5.2, 10);
    const cannon = new THREE.Mesh(cannonGeo, darkMetalMat);
    cannon.rotation.x = Math.PI / 2;
    cannon.position.set(0, 2.3, 2.6);
    group.add(cannon);

    const railTip = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.8), lensMat);
    railTip.position.set(0, 2.3, 5.2);
    group.add(railTip);

  } else if (isBattlesuit) {
    // Crisis / Broadside / Stealth battlesuit
    const isHeavy = unitDef.name.toLowerCase().includes('broadside');
    const scale = isHeavy ? 1.4 : 1.15;

    // Torso blocky high-tech
    const torsoGeo = new THREE.BoxGeometry(1.6 * scale, 1.8 * scale, 1.3 * scale);
    const torso = new THREE.Mesh(torsoGeo, armorMat);
    torso.position.y = 2.0 * scale;
    group.add(torso);

    // Jetpack on back
    const jetpackGeo = new THREE.BoxGeometry(1.8 * scale, 1.2 * scale, 0.8 * scale);
    const jetpack = new THREE.Mesh(jetpackGeo, trimMat);
    jetpack.position.set(0, 2.3 * scale, -0.9 * scale);
    group.add(jetpack);

    // Jet thrusters
    [-0.7 * scale, 0.7 * scale].forEach(side => {
      const thrusterGeo = new THREE.CylinderGeometry(0.3 * scale, 0.22 * scale, 0.9 * scale, 8);
      const thruster = new THREE.Mesh(thrusterGeo, darkMetalMat);
      thruster.position.set(side, 2.3 * scale, -1.3 * scale);
      thruster.rotation.x = -0.3;
      group.add(thruster);
    });

    // Sensor head
    const headGeo = new THREE.CylinderGeometry(0.45 * scale, 0.5 * scale, 0.5 * scale, 8);
    const head = new THREE.Mesh(headGeo, armorMat);
    head.position.set(0, 2.9 * scale, 0.1 * scale);
    group.add(head);

    const sensorGeo = new THREE.BoxGeometry(0.25 * scale, 0.15 * scale, 0.25 * scale);
    const sensor = new THREE.Mesh(sensorGeo, lensMat);
    sensor.position.set(0.2 * scale, 3.0 * scale, 0.4 * scale);
    group.add(sensor);

    // Heavy Pauldrons
    [-1.1 * scale, 1.1 * scale].forEach(side => {
      const padGeo = new THREE.BoxGeometry(0.6 * scale, 0.8 * scale, 0.9 * scale);
      const pad = new THREE.Mesh(padGeo, trimMat);
      pad.position.set(side, 2.4 * scale, 0);
      group.add(pad);
    });

    // Legs
    [-0.55 * scale, 0.55 * scale].forEach(side => {
      const legGeo = new THREE.CylinderGeometry(0.32 * scale, 0.38 * scale, 1.6 * scale, 8);
      const leg = new THREE.Mesh(legGeo, armorMat);
      leg.position.set(side, 0.9 * scale, 0);
      group.add(leg);

      const footGeo = new THREE.BoxGeometry(0.6 * scale, 0.35 * scale, 1.0 * scale);
      const foot = new THREE.Mesh(footGeo, trimMat);
      foot.position.set(side, 0.2 * scale, 0.2 * scale);
      group.add(foot);
    });

    // Arm Weapons (Plasma rifle, Burst cannon or Heavy Rail rifle)
    const armGeo = new THREE.CylinderGeometry(0.22 * scale, 0.28 * scale, 1.2 * scale, 8);
    const armR = new THREE.Mesh(armGeo, darkClothMat);
    armR.position.set(1.1 * scale, 1.6 * scale, 0.4 * scale);
    armR.rotation.x = Math.PI / 4;
    group.add(armR);

    const weaponGeo = new THREE.BoxGeometry(0.45 * scale, 0.6 * scale, 2.2 * scale);
    const weapon = new THREE.Mesh(weaponGeo, darkMetalMat);
    weapon.position.set(1.3 * scale, 1.7 * scale, 1.1 * scale);
    group.add(weapon);

    const muzzleGeo = new THREE.CylinderGeometry(0.12 * scale, 0.12 * scale, 0.4 * scale, 8);
    const muzzle = new THREE.Mesh(muzzleGeo, lensMat);
    muzzle.rotation.x = Math.PI / 2;
    muzzle.position.set(1.3 * scale, 1.7 * scale, 2.2 * scale);
    group.add(muzzle);

    if (isHeavy) {
      // Shoulder-mounted Heavy Rail Rifles
      const railRifle = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 3.2), darkMetalMat);
      railRifle.position.set(-1.0, 3.1, 0.6);
      group.add(railRifle);
    }

  } else {
    // Fire Warrior / Pathfinder Infantry
    // Torso with Tau chest plate
    const torsoGeo = new THREE.BoxGeometry(0.75, 0.95, 0.5);
    const torso = new THREE.Mesh(torsoGeo, darkClothMat);
    torso.position.y = 1.45;
    group.add(torso);

    const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.55, 0.25), armorMat);
    chestPlate.position.set(0, 1.6, 0.2);
    group.add(chestPlate);

    // Tau curved helmet
    const helmGeo = new THREE.CylinderGeometry(0.35, 0.25, 0.5, 8);
    const helm = new THREE.Mesh(helmGeo, armorMat);
    helm.position.set(0, 2.15, 0);
    helm.rotation.x = 0.2;
    group.add(helm);

    // Single cyclopean eye lens
    const lensGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.position.set(0.12, 2.2, 0.3);
    group.add(lens);

    // Left shoulder large Tau guard
    const shoulderGuard = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.65, 0.65), trimMat);
    shoulderGuard.position.set(-0.55, 1.6, 0);
    group.add(shoulderGuard);

    // Tau emblem insignia circle
    const badge = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 12), lensMat);
    badge.rotation.z = Math.PI / 2;
    badge.position.set(-0.71, 1.6, 0);
    group.add(badge);

    // Legs
    [-0.22, 0.22].forEach(side => {
      const legGeo = new THREE.CylinderGeometry(0.15, 0.18, 1.1, 8);
      const leg = new THREE.Mesh(legGeo, darkClothMat);
      leg.position.set(side, 0.6, 0);
      group.add(leg);

      const shin = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.5, 0.25), armorMat);
      shin.position.set(side, 0.45, 0.1);
      group.add(shin);

      // Hoof feet
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.2, 0.35), darkMetalMat);
      foot.position.set(side, 0.1, 0.08);
      group.add(foot);
    });

    // Pulse Rifle / Carbine
    const rifleGeo = new THREE.BoxGeometry(0.15, 0.22, 1.8);
    const rifle = new THREE.Mesh(rifleGeo, armorMat);
    rifle.position.set(0.3, 1.3, 0.7);
    rifle.rotation.x = 0.1;
    group.add(rifle);

    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.8, 8), darkMetalMat);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0.3, 1.3, 1.6);
    group.add(barrel);
  }

  return group;
}
