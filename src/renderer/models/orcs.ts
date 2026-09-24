import * as THREE from 'three';
import { UnitDef, Team } from '../../data/types';
import {
  getCachedCylinder,
  getCachedSphere,
  getCachedBox,
  getCachedCone,
  getCachedTorus,
  getCachedStandardMaterial
} from './cache';

export function buildOrkFigure(
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
  const orkSkinMat = getCachedStandardMaterial({ color: 0x166534, roughness: 0.65, metalness: 0.1 });
  const gunMetalMat = getCachedStandardMaterial({ color: 0x27272a, roughness: 0.6, metalness: 0.75 });
  const rustPlateMat = getCachedStandardMaterial({ color: 0x78350f, roughness: 0.8, metalness: 0.3 });
  const boneMat = getCachedStandardMaterial({ color: 0xf3f4f6, roughness: 0.35, metalness: 0.1 });
  const bloodMat = getCachedStandardMaterial({ color: 0x991b1b, roughness: 0.5 });

  if (uType === 'ork_warboss') {
    figBody.scale.set(1.4, 1.4, 1.4);

    const legGeo = getCachedBox(0.28, 0.55, 0.32);
    const leftLeg = new THREE.Mesh(legGeo, armorMat);
    leftLeg.position.set(-0.28, 0.26, 0);
    figBody.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, armorMat);
    rightLeg.position.set(0.28, 0.26, 0);
    figBody.add(rightLeg);
    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    const bootGeo = getCachedBox(0.32, 0.16, 0.46);
    const lBoot = new THREE.Mesh(bootGeo, gunMetalMat);
    lBoot.position.set(-0.28, 0.08, 0.06);
    figBody.add(lBoot);
    const rBoot = new THREE.Mesh(bootGeo, gunMetalMat);
    rBoot.position.set(0.28, 0.08, 0.06);
    figBody.add(rBoot);

    const torso = new THREE.Mesh(getCachedBox(0.85, 0.75, 0.6), orkSkinMat);
    torso.position.set(0, 0.82, 0.05);
    torso.rotation.x = 0.15;
    figBody.add(torso);

    const chestPlate = new THREE.Mesh(getCachedBox(0.78, 0.48, 0.18), armorMat);
    chestPlate.position.set(0, 0.85, 0.34);
    chestPlate.rotation.x = 0.15;
    figBody.add(chestPlate);

    const shGeo = getCachedBox(0.42, 0.38, 0.45);
    const lSh = new THREE.Mesh(shGeo, rustPlateMat);
    lSh.position.set(-0.58, 1.05, 0.05);
    lSh.rotation.z = 0.25;
    figBody.add(lSh);
    const rSh = new THREE.Mesh(shGeo, armorMat);
    rSh.position.set(0.58, 1.05, 0.05);
    rSh.rotation.z = -0.25;
    figBody.add(rSh);

    for (let s = -1; s <= 1; s += 2) {
      const spike = new THREE.Mesh(getCachedCone(0.06, 0.25, 10), gunMetalMat);
      spike.position.set(s * 0.65, 1.3, 0.05);
      spike.rotation.z = s * -0.3;
      figBody.add(spike);
    }

    const head = new THREE.Mesh(getCachedBox(0.42, 0.36, 0.44), orkSkinMat);
    head.position.set(0, 1.08, 0.3);
    figBody.add(head);

    const ironGob = new THREE.Mesh(getCachedBox(0.44, 0.22, 0.25), gunMetalMat);
    ironGob.position.set(0, 0.98, 0.46);
    figBody.add(ironGob);

    const tuskGeo = getCachedCone(0.05, 0.22, 10);
    const lTusk = new THREE.Mesh(tuskGeo, boneMat);
    lTusk.position.set(-0.16, 1.08, 0.52);
    lTusk.rotation.x = -0.4;
    lTusk.rotation.z = -0.2;
    figBody.add(lTusk);
    const rTusk = new THREE.Mesh(tuskGeo, boneMat);
    rTusk.position.set(0.16, 1.08, 0.52);
    rTusk.rotation.x = -0.4;
    rTusk.rotation.z = 0.2;
    figBody.add(rTusk);

    const eyeGeo = getCachedSphere(0.045, 10, 10);
    const lEye = new THREE.Mesh(eyeGeo, eyeGlowMat);
    lEye.position.set(-0.12, 1.14, 0.5);
    figBody.add(lEye);
    const rEye = new THREE.Mesh(eyeGeo, eyeGlowMat);
    rEye.position.set(0.12, 1.14, 0.5);
    figBody.add(rEye);

    const pole = new THREE.Mesh(getCachedCylinder(0.035, 0.035, 1.4, 12), gunMetalMat);
    pole.position.set(0, 1.6, -0.25);
    figBody.add(pole);
    const banner = new THREE.Mesh(getCachedBox(0.45, 0.35, 0.04), bloodMat);
    banner.position.set(0, 1.85, -0.25);
    figBody.add(banner);
    const bossSkull = new THREE.Mesh(getCachedSphere(0.12, 14, 14), boneMat);
    bossSkull.position.set(0, 2.15, -0.25);
    figBody.add(bossSkull);

    // Right Arm: Power Klaw
    const rArm = new THREE.Mesh(getCachedBox(0.24, 0.5, 0.24), orkSkinMat);
    rArm.position.set(0.62, 0.8, 0.15);
    figBody.add(rArm);
    const klawBase = new THREE.Mesh(getCachedBox(0.32, 0.32, 0.35), rustPlateMat);
    klawBase.position.set(0.68, 0.65, 0.35);
    figBody.add(klawBase);
    const bladeGeo = getCachedCone(0.08, 0.45, 10);
    const pincer1 = new THREE.Mesh(bladeGeo, gunMetalMat);
    pincer1.position.set(0.76, 0.72, 0.62);
    pincer1.rotation.x = Math.PI / 2 + 0.3;
    figBody.add(pincer1);
    const pincer2 = new THREE.Mesh(bladeGeo, gunMetalMat);
    pincer2.position.set(0.6, 0.72, 0.62);
    pincer2.rotation.x = Math.PI / 2 + 0.3;
    figBody.add(pincer2);
    const pincerBottom = new THREE.Mesh(bladeGeo, gunMetalMat);
    pincerBottom.position.set(0.68, 0.52, 0.62);
    pincerBottom.rotation.x = Math.PI / 2 - 0.3;
    figBody.add(pincerBottom);

    // Left Arm: Twin Kombi-Shoota
    const lArm = new THREE.Mesh(getCachedBox(0.24, 0.5, 0.24), orkSkinMat);
    lArm.position.set(-0.62, 0.8, 0.15);
    figBody.add(lArm);
    const shootaBody = new THREE.Mesh(getCachedBox(0.26, 0.28, 0.75), gunMetalMat);
    shootaBody.position.set(-0.65, 0.75, 0.42);
    figBody.add(shootaBody);
    const barrel1 = new THREE.Mesh(getCachedCylinder(0.05, 0.05, 0.35, 12), darkJointMat);
    barrel1.position.set(-0.72, 0.82, 0.85);
    barrel1.rotation.x = Math.PI / 2;
    figBody.add(barrel1);
    const barrel2 = new THREE.Mesh(getCachedCylinder(0.05, 0.05, 0.35, 12), darkJointMat);
    barrel2.position.set(-0.58, 0.82, 0.85);
    barrel2.rotation.x = Math.PI / 2;
    figBody.add(barrel2);
  } else if (uType === 'ork_nobz') {
    figBody.scale.set(1.12, 1.12, 1.12);

    const legGeo = getCachedCylinder(0.14, 0.18, 0.52, 14);
    const leftLeg = new THREE.Mesh(legGeo, armorMat);
    leftLeg.position.set(-0.22, 0.26, 0);
    figBody.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, armorMat);
    rightLeg.position.set(0.22, 0.26, 0);
    figBody.add(rightLeg);
    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    const torso = new THREE.Mesh(getCachedBox(0.68, 0.65, 0.48), orkSkinMat);
    torso.position.set(0, 0.75, 0.05);
    torso.rotation.x = 0.15;
    figBody.add(torso);
    const armorVest = new THREE.Mesh(getCachedBox(0.62, 0.45, 0.2), rustPlateMat);
    armorVest.position.set(0, 0.78, 0.25);
    armorVest.rotation.x = 0.15;
    figBody.add(armorVest);

    const head = new THREE.Mesh(getCachedBox(0.35, 0.32, 0.38), orkSkinMat);
    head.position.set(0, 1.05, 0.22);
    figBody.add(head);
    const helmet = new THREE.Mesh(getCachedBox(0.37, 0.18, 0.4), gunMetalMat);
    helmet.position.set(0, 1.16, 0.22);
    figBody.add(helmet);

    const eyes = new THREE.Mesh(getCachedBox(0.22, 0.06, 0.06), eyeGlowMat);
    eyes.position.set(0, 1.06, 0.4);
    figBody.add(eyes);

    const haft = new THREE.Mesh(getCachedCylinder(0.04, 0.04, 1.1, 12), darkJointMat);
    haft.position.set(0.48, 0.85, 0.3);
    haft.rotation.x = -0.4;
    figBody.add(haft);
    const axeBlade = new THREE.Mesh(getCachedBox(0.06, 0.42, 0.32), gunMetalMat);
    axeBlade.position.set(0.48, 1.25, 0.45);
    axeBlade.rotation.x = -0.4;
    figBody.add(axeBlade);

    const slugga = new THREE.Mesh(getCachedBox(0.16, 0.2, 0.48), gunMetalMat);
    slugga.position.set(-0.42, 0.75, 0.32);
    figBody.add(slugga);
  } else if (uType === 'ork_lootaz') {
    const legGeo = getCachedCylinder(0.12, 0.16, 0.5, 14);
    const leftLeg = new THREE.Mesh(legGeo, rustPlateMat);
    leftLeg.position.set(-0.2, 0.25, 0);
    figBody.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, rustPlateMat);
    rightLeg.position.set(0.2, 0.25, 0);
    figBody.add(rightLeg);
    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    const torso = new THREE.Mesh(getCachedBox(0.58, 0.6, 0.42), orkSkinMat);
    torso.position.set(0, 0.72, 0.05);
    torso.rotation.x = 0.18;
    figBody.add(torso);

    const head = new THREE.Mesh(getCachedBox(0.32, 0.3, 0.34), orkSkinMat);
    head.position.set(0, 1.0, 0.2);
    figBody.add(head);
    const goggles = new THREE.Mesh(getCachedCylinder(0.08, 0.08, 0.28, 14), eyeGlowMat);
    goggles.position.set(0, 1.02, 0.35);
    goggles.rotation.z = Math.PI / 2;
    figBody.add(goggles);

    const gen = new THREE.Mesh(getCachedBox(0.48, 0.55, 0.38), darkJointMat);
    gen.position.set(0, 0.85, -0.25);
    figBody.add(gen);
    const pipe1 = new THREE.Mesh(getCachedCylinder(0.04, 0.05, 0.45, 12), rustPlateMat);
    pipe1.position.set(-0.16, 1.2, -0.25);
    figBody.add(pipe1);
    const pipe2 = new THREE.Mesh(getCachedCylinder(0.04, 0.05, 0.55, 12), rustPlateMat);
    pipe2.position.set(0.16, 1.25, -0.25);
    figBody.add(pipe2);

    const deffgun = new THREE.Mesh(getCachedBox(0.22, 0.26, 1.25), gunMetalMat);
    deffgun.position.set(0.36, 1.05, 0.5);
    deffgun.rotation.x = -0.08;
    figBody.add(deffgun);
    const deffMuzzle = new THREE.Mesh(getCachedCylinder(0.09, 0.09, 0.35, 14), darkJointMat);
    deffMuzzle.position.set(0.36, 1.05, 1.15);
    deffMuzzle.rotation.x = Math.PI / 2;
    figBody.add(deffMuzzle);
  } else if (uType === 'ork_mek_gunz') {
    figBody.scale.set(1.35, 1.35, 1.35);

    const carriage = new THREE.Mesh(getCachedBox(0.75, 0.28, 0.95), rustPlateMat);
    carriage.position.y = 0.35;
    figBody.add(carriage);

    const wheelGeo = getCachedCylinder(0.35, 0.35, 0.16, 16);
    const lWheel = new THREE.Mesh(wheelGeo, gunMetalMat);
    lWheel.position.set(-0.52, 0.35, 0.05);
    lWheel.rotation.z = Math.PI / 2;
    figBody.add(lWheel);
    const rWheel = new THREE.Mesh(wheelGeo, gunMetalMat);
    rWheel.position.set(0.52, 0.35, 0.05);
    rWheel.rotation.z = Math.PI / 2;
    figBody.add(rWheel);
    root.userData.leftLeg = lWheel;
    root.userData.rightLeg = rWheel;

    const shield = new THREE.Mesh(getCachedBox(0.95, 0.65, 0.12), armorMat);
    shield.position.set(0, 0.65, 0.42);
    shield.rotation.x = -0.25;
    figBody.add(shield);

    const barrel = new THREE.Mesh(getCachedCylinder(0.16, 0.22, 1.35, 16), gunMetalMat);
    barrel.position.set(0, 0.68, 0.65);
    barrel.rotation.x = Math.PI / 2;
    figBody.add(barrel);

    const muzzle = new THREE.Mesh(getCachedCylinder(0.24, 0.18, 0.35, 14), rustPlateMat);
    muzzle.position.set(0, 0.68, 1.35);
    muzzle.rotation.x = Math.PI / 2;
    figBody.add(muzzle);

    const traktorCoil = new THREE.Mesh(getCachedTorus(0.22, 0.06, 10, 20), trimMat);
    traktorCoil.position.set(0, 0.68, 0.85);
    figBody.add(traktorCoil);
  } else if (uType === 'ork_deff_dread') {
    figBody.scale.set(1.5, 1.5, 1.5);

    const legGeo = getCachedBox(0.26, 0.45, 0.28);
    const lLeg = new THREE.Mesh(legGeo, armorMat);
    lLeg.position.set(-0.35, 0.22, 0);
    figBody.add(lLeg);
    const rLeg = new THREE.Mesh(legGeo, armorMat);
    rLeg.position.set(0.35, 0.22, 0);
    figBody.add(rLeg);
    root.userData.leftLeg = lLeg;
    root.userData.rightLeg = rLeg;

    const footGeo = getCachedBox(0.35, 0.14, 0.48);
    const lFoot = new THREE.Mesh(footGeo, gunMetalMat);
    lFoot.position.set(-0.35, 0.07, 0.05);
    figBody.add(lFoot);
    const rFoot = new THREE.Mesh(footGeo, gunMetalMat);
    rFoot.position.set(0.35, 0.07, 0.05);
    figBody.add(rFoot);

    const boiler = new THREE.Mesh(getCachedCylinder(0.55, 0.52, 0.95, 16), armorMat);
    boiler.position.set(0, 0.95, 0);
    figBody.add(boiler);

    const jawPlate = new THREE.Mesh(getCachedBox(0.65, 0.35, 0.22), rustPlateMat);
    jawPlate.position.set(0, 0.82, 0.45);
    figBody.add(jawPlate);
    const eyeVisor = new THREE.Mesh(getCachedBox(0.32, 0.08, 0.1), eyeGlowMat);
    eyeVisor.position.set(0, 1.15, 0.48);
    figBody.add(eyeVisor);

    const lPipe = new THREE.Mesh(getCachedCylinder(0.08, 0.09, 0.65, 12), rustPlateMat);
    lPipe.position.set(-0.32, 1.55, -0.25);
    figBody.add(lPipe);
    const rPipe = new THREE.Mesh(getCachedCylinder(0.08, 0.09, 0.65, 12), rustPlateMat);
    rPipe.position.set(0.32, 1.55, -0.25);
    figBody.add(rPipe);

    for (let r = -1; r <= 1; r += 2) {
      const pod = new THREE.Mesh(getCachedBox(0.24, 0.24, 0.55), darkJointMat);
      pod.position.set(r * 0.68, 1.25, 0.25);
      figBody.add(pod);
      const warhead = new THREE.Mesh(getCachedCone(0.08, 0.25, 10), bloodMat);
      warhead.position.set(r * 0.68, 1.25, 0.58);
      warhead.rotation.x = Math.PI / 2;
      figBody.add(warhead);
    }

    for (let s = -1; s <= 1; s += 2) {
      const sawArm = new THREE.Mesh(getCachedBox(0.18, 0.18, 0.55), darkJointMat);
      sawArm.position.set(s * 0.68, 0.72, 0.25);
      figBody.add(sawArm);
      const sawBlade = new THREE.Mesh(getCachedCylinder(0.28, 0.28, 0.04, 16), gunMetalMat);
      sawBlade.position.set(s * 0.68, 0.72, 0.65);
      sawBlade.rotation.x = Math.PI / 2;
      figBody.add(sawBlade);
    }
  } else {
    figBody.scale.set(0.85, 0.85, 0.85);

    const legGeo = getCachedCylinder(0.12, 0.15, 0.48, 14);
    const leftLeg = new THREE.Mesh(legGeo, darkJointMat);
    leftLeg.position.set(-0.18, 0.24, 0);
    figBody.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, darkJointMat);
    rightLeg.position.set(0.18, 0.24, 0);
    figBody.add(rightLeg);
    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    const torso = new THREE.Mesh(getCachedBox(0.52, 0.55, 0.38), orkSkinMat);
    torso.position.set(0, 0.68, 0.05);
    torso.rotation.x = 0.15;
    figBody.add(torso);

    const head = new THREE.Mesh(getCachedBox(0.3, 0.28, 0.32), orkSkinMat);
    head.position.set(0, 0.95, 0.2);
    figBody.add(head);

    const ironCap = new THREE.Mesh(getCachedBox(0.32, 0.12, 0.34), armorMat);
    ironCap.position.set(0, 1.08, 0.2);
    figBody.add(ironCap);

    const eyes = new THREE.Mesh(getCachedBox(0.18, 0.05, 0.05), eyeGlowMat);
    eyes.position.set(0, 0.96, 0.36);
    figBody.add(eyes);

    const choppaHaft = new THREE.Mesh(getCachedCylinder(0.03, 0.03, 0.65, 12), darkJointMat);
    choppaHaft.position.set(0.36, 0.75, 0.22);
    choppaHaft.rotation.x = -0.3;
    figBody.add(choppaHaft);
    const choppaBlade = new THREE.Mesh(getCachedBox(0.04, 0.28, 0.22), gunMetalMat);
    choppaBlade.position.set(0.36, 0.98, 0.3);
    choppaBlade.rotation.x = -0.3;
    figBody.add(choppaBlade);

    const shoota = new THREE.Mesh(getCachedBox(0.14, 0.16, 0.55), gunMetalMat);
    shoota.position.set(-0.32, 0.68, 0.28);
    figBody.add(shoota);
  }
}

export const buildOrcFigure = buildOrkFigure;
