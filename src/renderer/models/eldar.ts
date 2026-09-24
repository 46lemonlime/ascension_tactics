import * as THREE from 'three';
import { UnitDef, Team } from '../../data/types';
import {
  getCachedCylinder,
  getCachedSphere,
  getCachedBox,
  getCachedCone,
  getCachedStandardMaterial
} from './cache';

export function buildEldarFigure(
  uType: string,
  _def: UnitDef,
  _team: Team,
  _isLeader: boolean,
  figBody: THREE.Group,
  root: THREE.Group,
  armorMat: THREE.Material,
  _trimMat: THREE.Material,
  darkJointMat: THREE.Material,
  eyeGlowMat: THREE.Material
): void {
  const boneMat = getCachedStandardMaterial({ color: 0xfde68a, roughness: 0.35, metalness: 0.15 });
  const soulstoneMat = getCachedStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.1,
    metalness: 0.9,
    emissive: 0x0284c7,
    emissiveIntensity: 0.8
  });
  const runeMat = getCachedStandardMaterial({ color: 0xf59e0b, roughness: 0.2, metalness: 0.85 });
  const bladeMat = getCachedStandardMaterial({
    color: 0x67e8f9,
    roughness: 0.1,
    metalness: 0.95,
    emissive: 0x0ea5e9,
    emissiveIntensity: 0.7
  });
  const gunMetalMat = getCachedStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.7 });
  const maneMat = getCachedStandardMaterial({ color: 0xd97706, roughness: 0.6 });

  if (uType === 'eld_farseer') {
    figBody.scale.set(1.25, 1.25, 1.25);

    const robeGeo = getCachedCone(0.38, 0.95, 16);
    const robe = new THREE.Mesh(robeGeo, armorMat);
    robe.position.set(0, 0.48, 0);
    figBody.add(robe);
    root.userData.leftLeg = robe;
    root.userData.rightLeg = robe;

    const torso = new THREE.Mesh(getCachedBox(0.42, 0.55, 0.28), armorMat);
    torso.position.y = 0.95;
    figBody.add(torso);

    const gem1 = new THREE.Mesh(getCachedSphere(0.05, 12, 12), soulstoneMat);
    gem1.position.set(0, 0.98, 0.15);
    figBody.add(gem1);
    const runePlate = new THREE.Mesh(getCachedBox(0.24, 0.28, 0.05), boneMat);
    runePlate.position.set(0, 0.92, 0.14);
    figBody.add(runePlate);

    const helmGeo = getCachedCone(0.18, 0.55, 14);
    const helm = new THREE.Mesh(helmGeo, boneMat);
    helm.position.set(0, 1.55, 0.02);
    helm.rotation.x = -0.15;
    figBody.add(helm);
    const visor = new THREE.Mesh(getCachedBox(0.16, 0.05, 0.06), soulstoneMat);
    visor.position.set(0, 1.35, 0.15);
    figBody.add(visor);

    const spearShaft = new THREE.Mesh(getCachedCylinder(0.025, 0.025, 1.8, 12), runeMat);
    spearShaft.position.set(0.42, 1.05, 0.25);
    figBody.add(spearShaft);
    const spearTip = new THREE.Mesh(getCachedCone(0.07, 0.45, 12), bladeMat);
    spearTip.position.set(0.42, 1.95, 0.25);
    figBody.add(spearTip);

    const pistol = new THREE.Mesh(getCachedBox(0.1, 0.14, 0.38), boneMat);
    pistol.position.set(-0.38, 0.92, 0.28);
    figBody.add(pistol);
  } else if (uType === 'eld_banshees') {
    figBody.scale.set(1.05, 1.05, 1.05);

    const legGeo = getCachedCylinder(0.08, 0.11, 0.58, 14);
    const leftLeg = new THREE.Mesh(legGeo, boneMat);
    leftLeg.position.set(-0.16, 0.29, 0);
    figBody.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, boneMat);
    rightLeg.position.set(0.16, 0.29, 0);
    figBody.add(rightLeg);
    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    const torso = new THREE.Mesh(getCachedBox(0.4, 0.52, 0.26), boneMat);
    torso.position.y = 0.82;
    figBody.add(torso);

    const head = new THREE.Mesh(getCachedBox(0.22, 0.28, 0.24), boneMat);
    head.position.y = 1.22;
    figBody.add(head);

    const maneGeo = getCachedCone(0.18, 0.65, 14);
    const mane = new THREE.Mesh(maneGeo, maneMat);
    mane.position.set(0, 1.45, -0.15);
    mane.rotation.x = -0.65;
    figBody.add(mane);

    const maskEyes = new THREE.Mesh(getCachedBox(0.16, 0.04, 0.04), soulstoneMat);
    maskEyes.position.set(0, 1.24, 0.13);
    figBody.add(maskEyes);

    const swordBlade = new THREE.Mesh(getCachedBox(0.04, 0.85, 0.12), bladeMat);
    swordBlade.position.set(0.38, 1.05, 0.32);
    swordBlade.rotation.x = -0.45;
    figBody.add(swordBlade);

    const pistol = new THREE.Mesh(getCachedBox(0.09, 0.12, 0.34), gunMetalMat);
    pistol.position.set(-0.34, 0.78, 0.25);
    figBody.add(pistol);
  } else if (uType === 'eld_reapers') {
    figBody.scale.set(1.1, 1.1, 1.1);

    const legGeo = getCachedCylinder(0.09, 0.13, 0.58, 14);
    const leftLeg = new THREE.Mesh(legGeo, darkJointMat);
    leftLeg.position.set(-0.18, 0.29, 0);
    figBody.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, darkJointMat);
    rightLeg.position.set(0.18, 0.29, 0);
    figBody.add(rightLeg);
    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    const torso = new THREE.Mesh(getCachedBox(0.48, 0.58, 0.3), darkJointMat);
    torso.position.y = 0.85;
    figBody.add(torso);

    const helm = new THREE.Mesh(getCachedBox(0.26, 0.32, 0.28), boneMat);
    helm.position.y = 1.28;
    figBody.add(helm);
    const skullVisor = new THREE.Mesh(getCachedBox(0.18, 0.06, 0.06), eyeGlowMat);
    skullVisor.position.set(0, 1.28, 0.15);
    figBody.add(skullVisor);

    const launcher = new THREE.Mesh(getCachedBox(0.2, 0.24, 1.1), gunMetalMat);
    launcher.position.set(0.36, 1.05, 0.45);
    figBody.add(launcher);
    for (let t = -1; t <= 1; t++) {
      const tube = new THREE.Mesh(getCachedCylinder(0.035, 0.035, 0.15, 12), boneMat);
      tube.position.set(0.36 + t * 0.06, 1.05, 1.02);
      tube.rotation.x = Math.PI / 2;
      figBody.add(tube);
    }
  } else if (uType === 'eld_support_weapon') {
    figBody.scale.set(1.35, 1.35, 1.35);

    const sled = new THREE.Mesh(getCachedBox(0.85, 0.22, 1.1), armorMat);
    sled.position.y = 0.35;
    figBody.add(sled);
    root.userData.leftLeg = sled;
    root.userData.rightLeg = sled;

    const vaneGeo = getCachedBox(0.24, 0.06, 0.85);
    const lVane = new THREE.Mesh(vaneGeo, boneMat);
    lVane.position.set(-0.52, 0.38, 0);
    lVane.rotation.z = 0.3;
    figBody.add(lVane);
    const rVane = new THREE.Mesh(vaneGeo, boneMat);
    rVane.position.set(0.52, 0.38, 0);
    rVane.rotation.z = -0.3;
    figBody.add(rVane);

    const dish = new THREE.Mesh(getCachedCylinder(0.42, 0.18, 0.35, 16), boneMat);
    dish.position.set(0, 0.65, 0.55);
    dish.rotation.x = Math.PI / 2;
    figBody.add(dish);

    const emitter = new THREE.Mesh(getCachedSphere(0.14, 14, 14), soulstoneMat);
    emitter.position.set(0, 0.65, 0.75);
    figBody.add(emitter);

    const powerPylon = new THREE.Mesh(getCachedCone(0.08, 0.55, 12), runeMat);
    powerPylon.position.set(0, 0.75, -0.25);
    powerPylon.rotation.x = -0.35;
    figBody.add(powerPylon);
  } else if (uType === 'eld_wraithlord') {
    figBody.scale.set(1.6, 1.6, 1.6);

    const legGeo = getCachedCylinder(0.11, 0.14, 0.85, 14);
    const leftLeg = new THREE.Mesh(legGeo, armorMat);
    leftLeg.position.set(-0.25, 0.42, 0);
    figBody.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, armorMat);
    rightLeg.position.set(0.25, 0.42, 0);
    figBody.add(rightLeg);
    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    const footGeo = getCachedBox(0.22, 0.08, 0.42);
    const lFoot = new THREE.Mesh(footGeo, boneMat);
    lFoot.position.set(-0.25, 0.04, 0.08);
    figBody.add(lFoot);
    const rFoot = new THREE.Mesh(footGeo, boneMat);
    rFoot.position.set(0.25, 0.04, 0.08);
    figBody.add(rFoot);

    const torso = new THREE.Mesh(getCachedBox(0.58, 0.85, 0.38), armorMat);
    torso.position.y = 1.15;
    figBody.add(torso);

    const soulCore = new THREE.Mesh(getCachedSphere(0.12, 14, 14), soulstoneMat);
    soulCore.position.set(0, 1.25, 0.2);
    figBody.add(soulCore);

    const domeHelm = new THREE.Mesh(getCachedCone(0.26, 1.05, 16), boneMat);
    domeHelm.position.set(0, 1.85, -0.12);
    domeHelm.rotation.x = -0.55;
    figBody.add(domeHelm);

    const lanceHousing = new THREE.Mesh(getCachedBox(0.14, 0.16, 0.45), boneMat);
    lanceHousing.position.set(-0.45, 1.65, 0.1);
    figBody.add(lanceHousing);
    const lanceBarrel = new THREE.Mesh(getCachedCylinder(0.04, 0.05, 1.35, 14), bladeMat);
    lanceBarrel.position.set(-0.45, 1.65, 0.75);
    lanceBarrel.rotation.x = Math.PI / 2;
    figBody.add(lanceBarrel);

    const glaiveShaft = new THREE.Mesh(getCachedCylinder(0.035, 0.035, 2.2, 14), runeMat);
    glaiveShaft.position.set(0.55, 1.25, 0.35);
    glaiveShaft.rotation.x = -0.25;
    figBody.add(glaiveShaft);
    const glaiveBlade = new THREE.Mesh(getCachedBox(0.06, 1.15, 0.25), bladeMat);
    glaiveBlade.position.set(0.55, 2.25, 0.55);
    glaiveBlade.rotation.x = -0.25;
    figBody.add(glaiveBlade);
  } else {
    figBody.scale.set(0.82, 0.82, 0.82);

    const legGeo = getCachedCylinder(0.07, 0.09, 0.52, 12);
    const leftLeg = new THREE.Mesh(legGeo, armorMat);
    leftLeg.position.set(-0.15, 0.26, 0);
    figBody.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, armorMat);
    rightLeg.position.set(0.15, 0.26, 0);
    figBody.add(rightLeg);
    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    const torso = new THREE.Mesh(getCachedBox(0.38, 0.48, 0.24), armorMat);
    torso.position.y = 0.75;
    figBody.add(torso);

    const soulstone = new THREE.Mesh(getCachedSphere(0.04, 10, 10), soulstoneMat);
    soulstone.position.set(0, 0.78, 0.13);
    figBody.add(soulstone);

    const helmGeo = getCachedCone(0.14, 0.42, 14);
    const helm = new THREE.Mesh(helmGeo, boneMat);
    helm.position.set(0, 1.25, -0.04);
    helm.rotation.x = -0.15;
    figBody.add(helm);

    const visor = new THREE.Mesh(getCachedBox(0.14, 0.04, 0.05), soulstoneMat);
    visor.position.set(0, 1.1, 0.11);
    figBody.add(visor);

    const cata = new THREE.Mesh(getCachedBox(0.1, 0.14, 0.5), gunMetalMat);
    cata.position.set(0.24, 0.68, 0.35);
    figBody.add(cata);
    const clip = new THREE.Mesh(getCachedBox(0.06, 0.16, 0.12), boneMat);
    clip.position.set(0.24, 0.56, 0.22);
    clip.rotation.x = -0.3;
    figBody.add(clip);
  }
}
