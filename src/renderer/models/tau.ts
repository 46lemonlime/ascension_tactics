import * as THREE from 'three';
import { UnitDef, Team } from '../../data/types';
import {
  getCachedCylinder,
  getCachedSphere,
  getCachedBox,
  getCachedCone,
  getCachedStandardMaterial,
  getCachedBasicMaterial
} from './cache';

export function buildTauFigure(
  uType: string,
  _def: UnitDef,
  _team: Team,
  _isLeader: boolean,
  figBody: THREE.Group,
  root: THREE.Group,
  armorMat: THREE.Material,
  trimMat: THREE.Material,
  darkJointMat: THREE.Material,
  eyeGlowMat: THREE.Material
): void {
  const cyanEnergyMat = getCachedBasicMaterial({ color: 0x06b6d4 });
  const gunMetalMat = getCachedStandardMaterial({ color: 0x1e293b, roughness: 0.6, metalness: 0.8 });

  if (uType === 'tau_commander') {
    // --- XV8 CRISIS BATTLESUIT COMMANDER (Scale 1.35x) ---
    figBody.scale.set(1.35, 1.35, 1.35);

    const legGeo = getCachedBox(0.26, 0.65, 0.28);
    const leftLeg = new THREE.Mesh(legGeo, armorMat);
    leftLeg.position.set(-0.28, 0.32, 0);
    figBody.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, armorMat);
    rightLeg.position.set(0.28, 0.32, 0);
    figBody.add(rightLeg);
    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    const footGeo = getCachedBox(0.28, 0.12, 0.42);
    const lFoot = new THREE.Mesh(footGeo, darkJointMat);
    lFoot.position.set(-0.28, 0.06, 0.08);
    figBody.add(lFoot);
    const rFoot = new THREE.Mesh(footGeo, darkJointMat);
    rFoot.position.set(0.28, 0.06, 0.08);
    figBody.add(rFoot);

    const torso = new THREE.Mesh(getCachedBox(0.72, 0.75, 0.48), armorMat);
    torso.position.y = 0.95;
    figBody.add(torso);

    const chestEmblem = new THREE.Mesh(getCachedCylinder(0.18, 0.18, 0.08, 16), trimMat);
    chestEmblem.position.set(0, 1.0, 0.26);
    chestEmblem.rotation.x = Math.PI / 2;
    figBody.add(chestEmblem);

    // Dual Jetpack Thrusters with Cyan Exhaust
    const jetGeo = getCachedBox(0.22, 0.62, 0.32);
    const lJet = new THREE.Mesh(jetGeo, trimMat);
    lJet.position.set(-0.32, 1.15, -0.32);
    lJet.rotation.x = 0.2;
    figBody.add(lJet);
    const rJet = new THREE.Mesh(jetGeo, trimMat);
    rJet.position.set(0.32, 1.15, -0.32);
    rJet.rotation.x = 0.2;
    figBody.add(rJet);

    const nozzleGeo = getCachedCylinder(0.08, 0.12, 0.2, 14);
    const lNoz = new THREE.Mesh(nozzleGeo, cyanEnergyMat);
    lNoz.position.set(-0.32, 0.8, -0.36);
    figBody.add(lNoz);
    const rNoz = new THREE.Mesh(nozzleGeo, cyanEnergyMat);
    rNoz.position.set(0.32, 0.8, -0.36);
    figBody.add(rNoz);

    // Commander Sensor Dome Head
    const head = new THREE.Mesh(getCachedCylinder(0.26, 0.24, 0.32, 16), armorMat);
    head.position.set(0, 1.45, 0);
    figBody.add(head);

    const sensorL = new THREE.Mesh(getCachedSphere(0.09, 14, 14), eyeGlowMat);
    sensorL.position.set(0.1, 1.48, 0.22);
    figBody.add(sensorL);

    const antenna = new THREE.Mesh(getCachedCylinder(0.02, 0.02, 0.45, 8), trimMat);
    antenna.position.set(-0.25, 1.7, 0);
    antenna.rotation.z = -0.25;
    figBody.add(antenna);

    // Right Arm: Triple-barrel Rotary Burst Cannon
    const cannonBase = new THREE.Mesh(getCachedBox(0.18, 0.18, 0.5), darkJointMat);
    cannonBase.position.set(0.55, 0.95, 0.25);
    figBody.add(cannonBase);
    for (let b = 0; b < 3; b++) {
      const bAng = (b * Math.PI * 2) / 3;
      const barrel = new THREE.Mesh(getCachedCylinder(0.035, 0.035, 0.6, 12), gunMetalMat);
      barrel.position.set(0.55 + Math.cos(bAng) * 0.07, 0.95 + Math.sin(bAng) * 0.07, 0.75);
      barrel.rotation.x = Math.PI / 2;
      figBody.add(barrel);
    }

    // Left Arm: Heavy Fusion Blaster + Shield Guard
    const fusionGun = new THREE.Mesh(getCachedBox(0.2, 0.22, 0.8), gunMetalMat);
    fusionGun.position.set(-0.55, 0.95, 0.35);
    figBody.add(fusionGun);
    const shieldPlate = new THREE.Mesh(getCachedBox(0.06, 0.5, 0.4), trimMat);
    shieldPlate.position.set(-0.7, 1.0, 0.15);
    figBody.add(shieldPlate);
  } else if (uType === 'tau_stealth') {
    // --- XV25 STEALTH BATTLESUIT TEAM ---
    figBody.scale.set(1.05, 1.05, 1.05);

    const legGeo = getCachedBox(0.22, 0.55, 0.22);
    const leftLeg = new THREE.Mesh(legGeo, armorMat);
    leftLeg.position.set(-0.22, 0.28, 0);
    figBody.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, armorMat);
    rightLeg.position.set(0.22, 0.28, 0);
    figBody.add(rightLeg);
    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    // Distinct Bulbous Egg-Shaped Stealth Torso
    const eggTorso = new THREE.Mesh(getCachedSphere(0.38, 16, 16), armorMat);
    eggTorso.position.set(0, 0.88, 0);
    eggTorso.scale.set(1, 1.25, 0.9);
    figBody.add(eggTorso);

    const domeHelm = new THREE.Mesh(getCachedSphere(0.24, 14, 14), trimMat);
    domeHelm.position.set(0, 1.3, 0.05);
    figBody.add(domeHelm);
    const stealthEye = new THREE.Mesh(getCachedBox(0.22, 0.06, 0.06), eyeGlowMat);
    stealthEye.position.set(0, 1.3, 0.24);
    figBody.add(stealthEye);

    // Rounded stealth thruster pack with glowing field ring
    const pack = new THREE.Mesh(getCachedBox(0.42, 0.45, 0.25), darkJointMat);
    pack.position.set(0, 0.95, -0.28);
    figBody.add(pack);
    const node = new THREE.Mesh(getCachedSphere(0.08, 12, 12), cyanEnergyMat);
    node.position.set(0, 1.05, -0.4);
    figBody.add(node);

    // Underslung Burst Cannon
    const bc = new THREE.Mesh(getCachedBox(0.16, 0.18, 0.8), gunMetalMat);
    bc.position.set(0.42, 0.8, 0.35);
    figBody.add(bc);
  } else if (uType === 'tau_pathfinders') {
    // --- PATHFINDER SNIPERS (Rail Rifles) ---
    const legGeo = getCachedBox(0.16, 0.55, 0.18);
    const leftLeg = new THREE.Mesh(legGeo, armorMat);
    leftLeg.position.set(-0.18, 0.28, 0);
    figBody.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, armorMat);
    rightLeg.position.set(0.18, 0.28, 0);
    figBody.add(rightLeg);
    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    const torso = new THREE.Mesh(getCachedBox(0.44, 0.58, 0.32), armorMat);
    torso.position.y = 0.82;
    figBody.add(torso);

    // Scout Helmet with External Rangefinder
    const head = new THREE.Mesh(getCachedCylinder(0.2, 0.18, 0.28, 14), armorMat);
    head.position.set(0, 1.25, 0);
    figBody.add(head);
    const opticVisor = new THREE.Mesh(getCachedBox(0.25, 0.08, 0.12), cyanEnergyMat);
    opticVisor.position.set(0.04, 1.28, 0.18);
    figBody.add(opticVisor);

    // Scout Recon Sat-Uplink Dish on Pack
    const pack = new THREE.Mesh(getCachedBox(0.35, 0.4, 0.2), darkJointMat);
    pack.position.set(0, 0.88, -0.22);
    figBody.add(pack);
    const dish = new THREE.Mesh(getCachedCylinder(0.14, 0.14, 0.04, 14), trimMat);
    dish.position.set(0.18, 1.15, -0.25);
    dish.rotation.x = 0.5;
    figBody.add(dish);

    // Massive Long-range Hyper-Velocity Rail Rifle
    const railStock = new THREE.Mesh(getCachedBox(0.1, 0.14, 0.5), darkJointMat);
    railStock.position.set(0.28, 0.8, 0.25);
    figBody.add(railStock);
    const railBarrel = new THREE.Mesh(getCachedBox(0.08, 0.08, 1.1), gunMetalMat);
    railBarrel.position.set(0.28, 0.8, 0.95);
    figBody.add(railBarrel);
    const railCoil = new THREE.Mesh(getCachedBox(0.1, 0.1, 0.4), cyanEnergyMat);
    railCoil.position.set(0.28, 0.8, 0.8);
    figBody.add(railCoil);
    const bipod = new THREE.Mesh(getCachedBox(0.22, 0.18, 0.04), trimMat);
    bipod.position.set(0.28, 0.68, 1.35);
    figBody.add(bipod);
  } else if (uType === 'tau_broadside') {
    // --- XV88 BROADSIDE BATTLESUIT (Scale 1.45x Heavy Fire Support) ---
    figBody.scale.set(1.45, 1.45, 1.45);

    const legGeo = getCachedBox(0.3, 0.68, 0.32);
    const leftLeg = new THREE.Mesh(legGeo, armorMat);
    leftLeg.position.set(-0.32, 0.34, 0);
    figBody.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, armorMat);
    rightLeg.position.set(0.32, 0.34, 0);
    figBody.add(rightLeg);
    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    // Recoil Stabilizer Anchors on Heels
    const stabGeo = getCachedBox(0.12, 0.35, 0.35);
    const lStab = new THREE.Mesh(stabGeo, darkJointMat);
    lStab.position.set(-0.32, 0.18, -0.26);
    lStab.rotation.x = -0.3;
    figBody.add(lStab);
    const rStab = new THREE.Mesh(stabGeo, darkJointMat);
    rStab.position.set(0.32, 0.18, -0.26);
    rStab.rotation.x = -0.3;
    figBody.add(rStab);

    // Reinforced Heavy Torso
    const torso = new THREE.Mesh(getCachedBox(0.82, 0.8, 0.55), armorMat);
    torso.position.y = 0.98;
    figBody.add(torso);

    const head = new THREE.Mesh(getCachedCylinder(0.24, 0.22, 0.28, 14), armorMat);
    head.position.set(0, 1.45, 0.05);
    figBody.add(head);
    const optic = new THREE.Mesh(getCachedSphere(0.08, 14, 14), cyanEnergyMat);
    optic.position.set(0, 1.48, 0.25);
    figBody.add(optic);

    // Twin Over-Shoulder Heavy Railguns
    const lRail = new THREE.Mesh(getCachedBox(0.14, 0.16, 1.45), gunMetalMat);
    lRail.position.set(-0.45, 1.42, 0.45);
    figBody.add(lRail);
    const rRail = new THREE.Mesh(getCachedBox(0.14, 0.16, 1.45), gunMetalMat);
    rRail.position.set(0.45, 1.42, 0.45);
    figBody.add(rRail);

    const lRailCoil = new THREE.Mesh(getCachedBox(0.16, 0.18, 0.5), cyanEnergyMat);
    lRailCoil.position.set(-0.45, 1.42, 0.35);
    figBody.add(lRailCoil);
    const rRailCoil = new THREE.Mesh(getCachedBox(0.16, 0.18, 0.5), cyanEnergyMat);
    rRailCoil.position.set(0.45, 1.42, 0.35);
    figBody.add(rRailCoil);

    // Arm-Mounted Smart Missile Pods
    const podGeo = getCachedBox(0.28, 0.32, 0.42);
    const lPod = new THREE.Mesh(podGeo, trimMat);
    lPod.position.set(-0.62, 0.88, 0.25);
    figBody.add(lPod);
    const rPod = new THREE.Mesh(podGeo, trimMat);
    rPod.position.set(0.62, 0.88, 0.25);
    figBody.add(rPod);
  } else if (uType === 'tau_hammerhead') {
    // --- TX7 HAMMERHEAD GUNSHIP: HEAVY HOVER TANK (Scale 1.6x) ---
    figBody.scale.set(1.6, 1.6, 1.6);
    figBody.position.y = 0.15; // Hovering altitude

    // Main Hover Tank Carapace / Hull
    const hull = new THREE.Mesh(getCachedBox(1.1, 0.32, 1.5), armorMat);
    hull.position.set(0, 0.35, 0);
    figBody.add(hull);
    root.userData.leftLeg = hull;
    root.userData.rightLeg = hull;

    // Sloped Nose Prow & Sensor Array
    const nose = new THREE.Mesh(getCachedCone(0.55, 0.65, 8), armorMat);
    nose.position.set(0, 0.32, 0.95);
    nose.rotation.x = Math.PI / 2;
    nose.rotation.y = Math.PI / 4;
    figBody.add(nose);
    const sensorNose = new THREE.Mesh(getCachedSphere(0.12, 14, 14), cyanEnergyMat);
    sensorNose.position.set(0, 0.35, 1.25);
    figBody.add(sensorNose);

    // Forward Jet Winglets with Engines
    const wingGeo = getCachedBox(0.45, 0.08, 0.55);
    const lWing = new THREE.Mesh(wingGeo, trimMat);
    lWing.position.set(-0.75, 0.32, 0.2);
    lWing.rotation.y = 0.25;
    figBody.add(lWing);
    const rWing = new THREE.Mesh(wingGeo, trimMat);
    rWing.position.set(0.75, 0.32, 0.2);
    rWing.rotation.y = -0.25;
    figBody.add(rWing);

    const engGeo = getCachedCylinder(0.14, 0.16, 0.65, 14);
    const lEng = new THREE.Mesh(engGeo, darkJointMat);
    lEng.position.set(-0.85, 0.32, 0.1);
    lEng.rotation.x = Math.PI / 2;
    figBody.add(lEng);
    const rEng = new THREE.Mesh(engGeo, darkJointMat);
    rEng.position.set(0.85, 0.32, 0.1);
    rEng.rotation.x = Math.PI / 2;
    figBody.add(rEng);

    const lJetGlow = new THREE.Mesh(getCachedSphere(0.12, 12, 12), cyanEnergyMat);
    lJetGlow.position.set(-0.85, 0.32, -0.26);
    figBody.add(lJetGlow);
    const rJetGlow = new THREE.Mesh(getCachedSphere(0.12, 12, 12), cyanEnergyMat);
    rJetGlow.position.set(0.85, 0.32, -0.26);
    figBody.add(rJetGlow);

    // Heavy Railgun Rotating Turret
    const turret = new THREE.Mesh(getCachedCylinder(0.38, 0.42, 0.28, 16), trimMat);
    turret.position.set(0, 0.6, -0.15);
    figBody.add(turret);

    const railgunHousing = new THREE.Mesh(getCachedBox(0.28, 0.24, 0.65), darkJointMat);
    railgunHousing.position.set(0, 0.72, 0.15);
    figBody.add(railgunHousing);

    // Ultra-Long Heavy Solid Railgun Barrel (extends 2.2 units forward)
    const longRail = new THREE.Mesh(getCachedBox(0.14, 0.14, 2.2), gunMetalMat);
    longRail.position.set(0, 0.72, 1.25);
    figBody.add(longRail);
    const muzzleBrake = new THREE.Mesh(getCachedBox(0.22, 0.18, 0.3), trimMat);
    muzzleBrake.position.set(0, 0.72, 2.35);
    figBody.add(muzzleBrake);
    const railCoil = new THREE.Mesh(getCachedBox(0.16, 0.16, 0.8), cyanEnergyMat);
    railCoil.position.set(0, 0.72, 0.9);
    figBody.add(railCoil);
  } else {
    // --- STRIKE TEAM FIRE WARRIORS (Pulse Rifles) ---
    const legGeo = getCachedBox(0.18, 0.55, 0.2);
    const leftLeg = new THREE.Mesh(legGeo, armorMat);
    leftLeg.position.set(-0.2, 0.28, 0);
    figBody.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, armorMat);
    rightLeg.position.set(0.2, 0.28, 0);
    figBody.add(rightLeg);
    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    const torso = new THREE.Mesh(getCachedBox(0.48, 0.6, 0.35), armorMat);
    torso.position.y = 0.82;
    figBody.add(torso);

    // Iconic Asymmetrical Large Shoulder Guard on Left Shoulder
    const shoulderGuard = new THREE.Mesh(getCachedBox(0.14, 0.48, 0.42), trimMat);
    shoulderGuard.position.set(-0.38, 1.02, 0);
    shoulderGuard.rotation.z = -0.2;
    figBody.add(shoulderGuard);

    const head = new THREE.Mesh(getCachedCylinder(0.22, 0.2, 0.3, 14), armorMat);
    head.position.set(0, 1.25, 0);
    figBody.add(head);
    const sensor = new THREE.Mesh(getCachedSphere(0.07, 14, 14), eyeGlowMat);
    sensor.position.set(0.08, 1.28, 0.18);
    figBody.add(sensor);

    const pack = new THREE.Mesh(getCachedBox(0.35, 0.4, 0.2), darkJointMat);
    pack.position.set(0, 0.88, -0.24);
    figBody.add(pack);

    // Long 2-Handed Pulse Rifle
    const rifle = new THREE.Mesh(getCachedBox(0.1, 0.14, 1.15), darkJointMat);
    rifle.position.set(0.32, 0.82, 0.45);
    figBody.add(rifle);
    const barrel = new THREE.Mesh(getCachedCylinder(0.04, 0.04, 0.5, 12), trimMat);
    barrel.position.set(0.32, 0.82, 1.1);
    barrel.rotation.x = Math.PI / 2;
    figBody.add(barrel);
  }
}
