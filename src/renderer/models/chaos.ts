import * as THREE from 'three';
import { UnitDef, Team } from '../../data/types';
import {
  getCachedCylinder,
  getCachedSphere,
  getCachedBox,
  getCachedCone,
  getCachedStandardMaterial
} from './cache';

export function buildChaosFigure(
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
  const daemonRedMat = getCachedStandardMaterial({
    color: 0xef4444,
    roughness: 0.1,
    metalness: 0.9,
    emissive: 0xb91c1c,
    emissiveIntensity: 0.75
  });
  const gunMetalMat = getCachedStandardMaterial({ color: 0x18181b, roughness: 0.6, metalness: 0.7 });
  const boneMat = getCachedStandardMaterial({ color: 0xd6d3d1, roughness: 0.4, metalness: 0.1 });
  const clothMat = getCachedStandardMaterial({ color: 0x27272a, roughness: 0.95 });
  const darkCapeMat = getCachedStandardMaterial({ color: 0x7f1d1d, roughness: 0.9 });

  if (uType === 'c_cultists') {
    figBody.scale.set(0.85, 0.85, 0.85);

    const legGeo = getCachedCylinder(0.09, 0.11, 0.52, 14);
    const leftLeg = new THREE.Mesh(legGeo, clothMat);
    leftLeg.position.set(-0.16, 0.26, 0);
    figBody.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, clothMat);
    rightLeg.position.set(0.16, 0.26, 0);
    figBody.add(rightLeg);
    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    const torso = new THREE.Mesh(getCachedBox(0.38, 0.52, 0.26), clothMat);
    torso.position.y = 0.78;
    figBody.add(torso);
    const bandolier = new THREE.Mesh(getCachedBox(0.42, 0.08, 0.28), trimMat);
    bandolier.position.set(0, 0.78, 0);
    bandolier.rotation.z = 0.6;
    figBody.add(bandolier);

    const hood = new THREE.Mesh(getCachedCone(0.22, 0.45, 12), clothMat);
    hood.position.set(0, 1.22, -0.02);
    figBody.add(hood);
    const gasmask = new THREE.Mesh(getCachedBox(0.16, 0.14, 0.16), darkJointMat);
    gasmask.position.set(0, 1.12, 0.14);
    figBody.add(gasmask);
    const eyeLens = new THREE.Mesh(getCachedSphere(0.045, 10, 10), eyeGlowMat);
    eyeLens.position.set(0, 1.15, 0.22);
    figBody.add(eyeLens);

    const autogun = new THREE.Mesh(getCachedBox(0.1, 0.14, 0.6), gunMetalMat);
    autogun.position.set(0.24, 0.75, 0.3);
    figBody.add(autogun);
    const drumMag = new THREE.Mesh(getCachedCylinder(0.08, 0.08, 0.08, 14), darkJointMat);
    drumMag.position.set(0.24, 0.62, 0.28);
    figBody.add(drumMag);

    return;
  }

  const legGeo = getCachedCylinder(0.12, 0.16, 0.55, 14);
  const leftLeg = new THREE.Mesh(legGeo, armorMat);
  leftLeg.position.set(-0.2, 0.28, 0);
  leftLeg.castShadow = true;
  figBody.add(leftLeg);
  const rightLeg = new THREE.Mesh(legGeo, armorMat);
  rightLeg.position.set(0.2, 0.28, 0);
  rightLeg.castShadow = true;
  figBody.add(rightLeg);
  root.userData.leftLeg = leftLeg;
  root.userData.rightLeg = rightLeg;

  const torso = new THREE.Mesh(getCachedBox(0.55, 0.65, 0.38), armorMat);
  torso.position.y = 0.85;
  torso.castShadow = true;
  figBody.add(torso);

  const shGeo = getCachedSphere(0.24, 14, 14);
  const leftSh = new THREE.Mesh(shGeo, trimMat);
  leftSh.position.set(-0.42, 1.05, 0);
  leftSh.scale.set(1, 1.25, 1.3);
  figBody.add(leftSh);
  const rightSh = new THREE.Mesh(shGeo, trimMat);
  rightSh.position.set(0.42, 1.05, 0);
  rightSh.scale.set(1, 1.25, 1.3);
  figBody.add(rightSh);

  const helm = new THREE.Mesh(getCachedBox(0.32, 0.35, 0.35), armorMat);
  helm.position.y = 1.32;
  figBody.add(helm);
  const visor = new THREE.Mesh(getCachedBox(0.22, 0.06, 0.05), eyeGlowMat);
  visor.position.set(0, 1.33, 0.18);
  figBody.add(visor);

  if (uType === 'c_lord') {
    const hornGeo = getCachedCone(0.09, 0.65, 12);
    const lHorn = new THREE.Mesh(hornGeo, boneMat);
    lHorn.position.set(-0.28, 1.68, 0);
    lHorn.rotation.z = 0.55;
    lHorn.rotation.x = -0.2;
    figBody.add(lHorn);
    const rHorn = new THREE.Mesh(hornGeo, boneMat);
    rHorn.position.set(0.28, 1.68, 0);
    rHorn.rotation.z = -0.55;
    rHorn.rotation.x = -0.2;
    figBody.add(rHorn);

    const bp = new THREE.Mesh(getCachedBox(0.5, 0.5, 0.28), darkJointMat);
    bp.position.set(0, 0.95, -0.25);
    figBody.add(bp);

    const spikeGeo = getCachedCylinder(0.02, 0.03, 0.8, 8);
    const lSpike = new THREE.Mesh(spikeGeo, trimMat);
    lSpike.position.set(-0.25, 1.45, -0.26);
    figBody.add(lSpike);
    const rSpike = new THREE.Mesh(spikeGeo, trimMat);
    rSpike.position.set(0.25, 1.45, -0.26);
    figBody.add(rSpike);

    const skull1 = new THREE.Mesh(getCachedSphere(0.08, 12, 12), boneMat);
    skull1.position.set(-0.25, 1.65, -0.26);
    figBody.add(skull1);

    const cape = new THREE.Mesh(getCachedBox(0.65, 1.1, 0.04), darkCapeMat);
    cape.position.set(0, 0.8, -0.28);
    cape.rotation.x = -0.15;
    figBody.add(cape);

    const axeShaft = new THREE.Mesh(getCachedCylinder(0.03, 0.03, 1.25, 12), darkJointMat);
    axeShaft.position.set(-0.48, 1.1, 0.35);
    axeShaft.rotation.x = -0.4;
    figBody.add(axeShaft);
    const axeBlade1 = new THREE.Mesh(getCachedBox(0.04, 0.5, 0.35), daemonRedMat);
    axeBlade1.position.set(-0.48, 1.4, 0.45);
    figBody.add(axeBlade1);
    const axeBlade2 = new THREE.Mesh(getCachedBox(0.04, 0.5, 0.35), daemonRedMat);
    axeBlade2.position.set(-0.48, 1.4, 0.15);
    figBody.add(axeBlade2);

    const pistol = new THREE.Mesh(getCachedBox(0.12, 0.16, 0.42), gunMetalMat);
    pistol.position.set(0.42, 0.88, 0.3);
    figBody.add(pistol);
  } else if (uType === 'c_raptors') {
    const jpBox = new THREE.Mesh(getCachedBox(0.46, 0.5, 0.24), darkJointMat);
    jpBox.position.set(0, 0.95, -0.24);
    figBody.add(jpBox);

    const wingGeo = getCachedBox(0.04, 0.65, 0.35);
    const lWing = new THREE.Mesh(wingGeo, trimMat);
    lWing.position.set(-0.38, 1.15, -0.28);
    lWing.rotation.z = -0.4;
    figBody.add(lWing);
    const rWing = new THREE.Mesh(wingGeo, trimMat);
    rWing.position.set(0.38, 1.15, -0.28);
    rWing.rotation.z = 0.4;
    figBody.add(rWing);

    const flameGeo = getCachedCone(0.08, 0.25, 12);
    const lFlame = new THREE.Mesh(flameGeo, daemonRedMat);
    lFlame.position.set(-0.26, 0.72, -0.32);
    lFlame.rotation.x = Math.PI;
    figBody.add(lFlame);
    const rFlame = new THREE.Mesh(flameGeo, daemonRedMat);
    rFlame.position.set(0.26, 0.72, -0.32);
    rFlame.rotation.x = Math.PI;
    figBody.add(rFlame);

    const ca = new THREE.Mesh(getCachedBox(0.06, 0.85, 0.25), trimMat);
    ca.position.set(-0.45, 1.1, 0.35);
    ca.rotation.x = -0.55;
    figBody.add(ca);

    const pistol = new THREE.Mesh(getCachedBox(0.12, 0.16, 0.38), gunMetalMat);
    pistol.position.set(0.38, 0.85, 0.3);
    figBody.add(pistol);
  } else if (uType === 'c_obliterators') {
    figBody.scale.set(1.4, 1.4, 1.4);

    const lLeg = new THREE.Mesh(getCachedBox(0.28, 0.58, 0.32), armorMat);
    lLeg.position.set(-0.28, 0.29, 0);
    figBody.add(lLeg);
    const rLeg = new THREE.Mesh(getCachedBox(0.28, 0.58, 0.32), armorMat);
    rLeg.position.set(0.28, 0.29, 0);
    figBody.add(rLeg);
    root.userData.leftLeg = lLeg;
    root.userData.rightLeg = rLeg;

    const torsoMesh = new THREE.Mesh(getCachedBox(0.82, 0.75, 0.52), armorMat);
    torsoMesh.position.y = 0.9;
    figBody.add(torsoMesh);

    const fleshMass = new THREE.Mesh(getCachedSphere(0.32, 14, 14), daemonRedMat);
    fleshMass.position.set(0, 0.95, 0.18);
    figBody.add(fleshMass);

    for (let s = -1; s <= 1; s += 2) {
      const sh = new THREE.Mesh(getCachedBox(0.38, 0.38, 0.42), trimMat);
      sh.position.set(s * 0.58, 1.15, 0);
      figBody.add(sh);
      const spike = new THREE.Mesh(getCachedCone(0.06, 0.38, 10), boneMat);
      spike.position.set(s * 0.65, 1.45, 0);
      spike.rotation.z = s * -0.3;
      figBody.add(spike);
    }

    const lGun = new THREE.Mesh(getCachedBox(0.22, 0.26, 1.05), gunMetalMat);
    lGun.position.set(-0.62, 0.85, 0.45);
    figBody.add(lGun);
    const lCore = new THREE.Mesh(getCachedSphere(0.12, 12, 12), daemonRedMat);
    lCore.position.set(-0.62, 0.85, 0.95);
    figBody.add(lCore);

    const rGun = new THREE.Mesh(getCachedBox(0.22, 0.26, 1.05), gunMetalMat);
    rGun.position.set(0.62, 0.85, 0.45);
    figBody.add(rGun);
    const rCore = new THREE.Mesh(getCachedSphere(0.12, 12, 12), daemonRedMat);
    rCore.position.set(0.62, 0.85, 0.95);
    figBody.add(rCore);
  } else if (uType === 'c_defiler') {
    figBody.scale.set(1.55, 1.55, 1.55);

    const crawlerGroup = new THREE.Group();
    for (let legIdx = 0; legIdx < 4; legIdx++) {
      const ang = (legIdx * Math.PI) / 2 + Math.PI / 4;
      const legUpper = new THREE.Mesh(getCachedBox(0.12, 0.55, 0.14), darkJointMat);
      legUpper.position.set(Math.cos(ang) * 0.38, 0.45, Math.sin(ang) * 0.38);
      legUpper.rotation.y = -ang;
      legUpper.rotation.z = 0.65;
      crawlerGroup.add(legUpper);

      const legLower = new THREE.Mesh(getCachedCone(0.08, 0.65, 10), trimMat);
      legLower.position.set(Math.cos(ang) * 0.65, 0.18, Math.sin(ang) * 0.65);
      legLower.rotation.y = -ang;
      legLower.rotation.z = -0.55;
      crawlerGroup.add(legLower);
    }
    figBody.add(crawlerGroup);
    root.userData.leftLeg = crawlerGroup;
    root.userData.rightLeg = crawlerGroup;

    const chassis = new THREE.Mesh(getCachedBox(0.95, 0.45, 0.95), armorMat);
    chassis.position.y = 0.58;
    figBody.add(chassis);

    const skullHelm = new THREE.Mesh(getCachedBox(0.38, 0.35, 0.38), boneMat);
    skullHelm.position.set(0, 0.82, 0.42);
    figBody.add(skullHelm);
    const eyes = new THREE.Mesh(getCachedBox(0.24, 0.06, 0.06), daemonRedMat);
    eyes.position.set(0, 0.85, 0.62);
    figBody.add(eyes);

    const turret = new THREE.Mesh(getCachedCylinder(0.32, 0.36, 0.28, 14), trimMat);
    turret.position.set(0, 0.92, -0.05);
    figBody.add(turret);

    const cannonBarrel = new THREE.Mesh(getCachedCylinder(0.12, 0.14, 1.45, 14), gunMetalMat);
    cannonBarrel.position.set(0, 1.05, 0.65);
    cannonBarrel.rotation.x = Math.PI / 2;
    figBody.add(cannonBarrel);
    const cannonMuzzle = new THREE.Mesh(getCachedCylinder(0.16, 0.12, 0.25, 14), trimMat);
    cannonMuzzle.position.set(0, 1.05, 1.38);
    cannonMuzzle.rotation.x = Math.PI / 2;
    figBody.add(cannonMuzzle);

    for (let c = -1; c <= 1; c += 2) {
      const clawArm = new THREE.Mesh(getCachedBox(0.16, 0.18, 0.55), darkJointMat);
      clawArm.position.set(c * 0.52, 0.55, 0.45);
      figBody.add(clawArm);
      const clawBlade = new THREE.Mesh(getCachedCone(0.08, 0.55, 10), daemonRedMat);
      clawBlade.position.set(c * 0.52, 0.55, 0.85);
      clawBlade.rotation.x = Math.PI / 2;
      figBody.add(clawBlade);
    }
  } else {
    const hornGeo = getCachedCone(0.07, 0.42, 12);
    const lHorn = new THREE.Mesh(hornGeo, trimMat);
    lHorn.position.set(-0.2, 1.55, 0);
    lHorn.rotation.z = 0.4;
    figBody.add(lHorn);
    const rHorn = new THREE.Mesh(hornGeo, trimMat);
    rHorn.position.set(0.2, 1.55, 0);
    rHorn.rotation.z = -0.4;
    figBody.add(rHorn);

    const bp = new THREE.Mesh(getCachedBox(0.5, 0.5, 0.28), darkJointMat);
    bp.position.set(0, 0.95, -0.25);
    figBody.add(bp);

    const gun = new THREE.Mesh(getCachedBox(0.14, 0.18, 0.65), gunMetalMat);
    gun.position.set(0.28, 0.85, 0.35);
    figBody.add(gun);
    const bayonet = new THREE.Mesh(getCachedBox(0.02, 0.12, 0.3), boneMat);
    bayonet.position.set(0.28, 0.72, 0.65);
    figBody.add(bayonet);
  }
}
