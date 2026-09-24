import * as THREE from 'three';
import { UnitDef, Team } from '../../data/types';
import {
  getCachedCylinder,
  getCachedSphere,
  getCachedBox,
  getCachedCone,
  getCachedStandardMaterial
} from './cache';

export function buildTyranidFigure(
  uType: string,
  _def: UnitDef,
  _team: Team,
  _isLeader: boolean,
  figBody: THREE.Group,
  root: THREE.Group,
  armorMat: THREE.Material,
  trimMat: THREE.Material,
  _darkJointMat: THREE.Material,
  eyeGlowMat: THREE.Material
): void {
  const boneMat = getCachedStandardMaterial({ color: 0xf3f4f6, roughness: 0.25, metalness: 0.1 });
  const bioWeaponMat = getCachedStandardMaterial({
    color: 0x10b981,
    roughness: 0.4,
    emissive: 0x047857,
    emissiveIntensity: 0.35
  });
  const fleshJointMat = getCachedStandardMaterial({ color: 0x581c87, roughness: 0.7 });

  if (uType === 'ty_tyrant') {
    figBody.scale.set(1.36, 1.36, 1.36);

    const thighGeo = getCachedCone(0.18, 0.65, 14);
    const leftThigh = new THREE.Mesh(thighGeo, armorMat);
    leftThigh.position.set(-0.28, 0.42, -0.12);
    leftThigh.rotation.set(-0.4, 0, 0.2);
    figBody.add(leftThigh);

    const rightThigh = new THREE.Mesh(thighGeo, armorMat);
    rightThigh.position.set(0.28, 0.42, -0.12);
    rightThigh.rotation.set(-0.4, 0, -0.2);
    figBody.add(rightThigh);

    const shinGeo = getCachedCylinder(0.12, 0.08, 0.5, 12);
    const leftShin = new THREE.Mesh(shinGeo, fleshJointMat);
    leftShin.position.set(-0.32, 0.18, 0.06);
    leftShin.rotation.x = 0.35;
    figBody.add(leftShin);
    const rightShin = new THREE.Mesh(shinGeo, fleshJointMat);
    rightShin.position.set(0.32, 0.18, 0.06);
    rightShin.rotation.x = 0.35;
    figBody.add(rightShin);

    root.userData.leftLeg = leftThigh;
    root.userData.rightLeg = rightThigh;

    const tail1 = new THREE.Mesh(getCachedCylinder(0.14, 0.09, 0.6, 12), armorMat);
    tail1.position.set(0, 0.45, -0.4);
    tail1.rotation.x = -0.9;
    figBody.add(tail1);
    const tail2 = new THREE.Mesh(getCachedCylinder(0.09, 0.04, 0.65, 12), fleshJointMat);
    tail2.position.set(0, 0.22, -0.85);
    tail2.rotation.x = -0.4;
    figBody.add(tail2);
    const tailBlade = new THREE.Mesh(getCachedCone(0.08, 0.35, 10), boneMat);
    tailBlade.position.set(0, 0.18, -1.18);
    tailBlade.rotation.x = 1.2;
    figBody.add(tailBlade);

    const thoraxGeo = getCachedCone(0.48, 1.0, 14);
    const thorax = new THREE.Mesh(thoraxGeo, trimMat);
    thorax.position.set(0, 0.95, 0);
    thorax.rotation.x = 0.35;
    figBody.add(thorax);

    const ribGeo = getCachedBox(0.44, 0.45, 0.28);
    const rib = new THREE.Mesh(ribGeo, fleshJointMat);
    rib.position.set(0, 0.85, 0.12);
    figBody.add(rib);

    const chimGeo1 = getCachedCylinder(0.07, 0.04, 0.65, 12);
    const lChim1 = new THREE.Mesh(chimGeo1, armorMat);
    lChim1.position.set(-0.2, 1.25, -0.22);
    lChim1.rotation.set(-0.35, 0, -0.25);
    figBody.add(lChim1);
    const rChim1 = new THREE.Mesh(chimGeo1, armorMat);
    rChim1.position.set(0.2, 1.25, -0.22);
    rChim1.rotation.set(-0.35, 0, 0.25);
    figBody.add(rChim1);

    const chimGeo2 = getCachedCylinder(0.06, 0.035, 0.45, 12);
    const lChim2 = new THREE.Mesh(chimGeo2, armorMat);
    lChim2.position.set(-0.16, 0.95, -0.28);
    lChim2.rotation.set(-0.45, 0, -0.3);
    figBody.add(lChim2);
    const rChim2 = new THREE.Mesh(chimGeo2, armorMat);
    rChim2.position.set(0.16, 0.95, -0.28);
    rChim2.rotation.set(-0.45, 0, 0.3);
    figBody.add(rChim2);

    const headGeo = getCachedCone(0.36, 0.9, 14);
    const head = new THREE.Mesh(headGeo, armorMat);
    head.position.set(0, 1.45, 0.28);
    head.rotation.x = 0.85;
    figBody.add(head);

    const crownCenter = new THREE.Mesh(getCachedCone(0.09, 0.55, 10), boneMat);
    crownCenter.position.set(0, 1.82, 0.35);
    crownCenter.rotation.x = 0.5;
    figBody.add(crownCenter);
    const crownL = new THREE.Mesh(getCachedCone(0.07, 0.45, 10), boneMat);
    crownL.position.set(-0.18, 1.74, 0.28);
    crownL.rotation.set(0.4, 0, -0.35);
    figBody.add(crownL);
    const crownR = new THREE.Mesh(getCachedCone(0.07, 0.45, 10), boneMat);
    crownR.position.set(0.18, 1.74, 0.28);
    crownR.rotation.set(0.4, 0, 0.35);
    figBody.add(crownR);

    const eye1 = new THREE.Mesh(getCachedSphere(0.06, 10, 10), eyeGlowMat);
    eye1.position.set(-0.12, 1.42, 0.52);
    figBody.add(eye1);
    const eye2 = new THREE.Mesh(getCachedSphere(0.06, 10, 10), eyeGlowMat);
    eye2.position.set(0.12, 1.42, 0.52);
    figBody.add(eye2);

    const talonGeo = getCachedCone(0.09, 1.35, 10);
    const lTalon = new THREE.Mesh(talonGeo, boneMat);
    lTalon.position.set(-0.65, 1.35, 0.4);
    lTalon.rotation.set(-1.25, 0, 0.45);
    figBody.add(lTalon);
    const rTalon = new THREE.Mesh(talonGeo, boneMat);
    rTalon.position.set(0.65, 1.35, 0.4);
    rTalon.rotation.set(-1.25, 0, -0.45);
    figBody.add(rTalon);

    const cannonBody = new THREE.Mesh(getCachedCylinder(0.12, 0.14, 1.1, 14), fleshJointMat);
    cannonBody.position.set(0.25, 0.85, 0.55);
    cannonBody.rotation.x = Math.PI / 2;
    figBody.add(cannonBody);
    const cannonMuzzle = new THREE.Mesh(getCachedCone(0.18, 0.45, 12), bioWeaponMat);
    cannonMuzzle.position.set(0.25, 0.85, 1.15);
    cannonMuzzle.rotation.x = -Math.PI / 2;
    figBody.add(cannonMuzzle);
    const venomSac = new THREE.Mesh(getCachedSphere(0.18, 14, 14), bioWeaponMat);
    venomSac.position.set(0.25, 0.72, 0.3);
    figBody.add(venomSac);
  } else if (uType === 'ty_warriors') {
    figBody.scale.set(1.05, 1.05, 1.05);

    const legGeo = getCachedCone(0.13, 0.65, 12);
    const leftLeg = new THREE.Mesh(legGeo, armorMat);
    leftLeg.position.set(-0.24, 0.3, -0.1);
    leftLeg.rotation.set(-0.3, 0, 0.2);
    figBody.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, armorMat);
    rightLeg.position.set(0.24, 0.3, -0.1);
    rightLeg.rotation.set(-0.3, 0, -0.2);
    figBody.add(rightLeg);
    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    const tail = new THREE.Mesh(getCachedCylinder(0.08, 0.025, 0.8, 12), armorMat);
    tail.position.set(0, 0.35, -0.45);
    tail.rotation.x = -0.9;
    figBody.add(tail);

    const thorax = new THREE.Mesh(getCachedCone(0.36, 0.85, 14), trimMat);
    thorax.position.set(0, 0.85, 0);
    thorax.rotation.x = 0.4;
    figBody.add(thorax);

    const lChim = new THREE.Mesh(getCachedCylinder(0.05, 0.03, 0.42, 10), armorMat);
    lChim.position.set(-0.14, 1.1, -0.18);
    lChim.rotation.set(-0.35, 0, -0.25);
    figBody.add(lChim);
    const rChim = new THREE.Mesh(getCachedCylinder(0.05, 0.03, 0.42, 10), armorMat);
    rChim.position.set(0.14, 1.1, -0.18);
    rChim.rotation.set(-0.35, 0, 0.25);
    figBody.add(rChim);

    const head = new THREE.Mesh(getCachedCone(0.28, 0.75, 14), armorMat);
    head.position.set(0, 1.25, 0.22);
    head.rotation.x = 0.8;
    figBody.add(head);

    const warriorHorn = new THREE.Mesh(getCachedCone(0.06, 0.4, 10), boneMat);
    warriorHorn.position.set(0, 1.55, 0.32);
    warriorHorn.rotation.x = 0.5;
    figBody.add(warriorHorn);

    const eye = new THREE.Mesh(getCachedSphere(0.06, 10, 10), eyeGlowMat);
    eye.position.set(0, 1.25, 0.42);
    figBody.add(eye);

    const talonGeo = getCachedCone(0.06, 0.95, 10);
    const lTalon = new THREE.Mesh(talonGeo, boneMat);
    lTalon.position.set(-0.48, 1.05, 0.35);
    lTalon.rotation.set(-1.1, 0, 0.5);
    figBody.add(lTalon);
    const rTalon = new THREE.Mesh(talonGeo, boneMat);
    rTalon.position.set(0.48, 1.05, 0.35);
    rTalon.rotation.set(-1.1, 0, -0.5);
    figBody.add(rTalon);

    const spitter = new THREE.Mesh(getCachedCylinder(0.07, 0.09, 0.75, 12), bioWeaponMat);
    spitter.position.set(0.2, 0.7, 0.4);
    spitter.rotation.x = Math.PI / 2;
    figBody.add(spitter);
  } else if (uType === 'ty_stealers') {
    figBody.scale.set(0.95, 0.95, 0.95);
    figBody.rotation.x = 0.28;
    figBody.position.z = 0.08;

    const thighGeo = getCachedCone(0.12, 0.58, 12);
    const leftLeg = new THREE.Mesh(thighGeo, armorMat);
    leftLeg.position.set(-0.24, 0.26, -0.18);
    leftLeg.rotation.set(-0.6, 0, 0.3);
    figBody.add(leftLeg);
    const rightLeg = new THREE.Mesh(thighGeo, armorMat);
    rightLeg.position.set(0.24, 0.26, -0.18);
    rightLeg.rotation.set(-0.6, 0, -0.3);
    figBody.add(rightLeg);
    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    const tail = new THREE.Mesh(getCachedCylinder(0.06, 0.02, 0.6, 12), fleshJointMat);
    tail.position.set(0, 0.3, -0.4);
    tail.rotation.x = -1.1;
    figBody.add(tail);

    const torso = new THREE.Mesh(getCachedCone(0.28, 0.75, 14), trimMat);
    torso.position.set(0, 0.75, 0);
    torso.rotation.x = 0.55;
    figBody.add(torso);

    const domeSkull = new THREE.Mesh(getCachedCone(0.22, 0.85, 14), armorMat);
    domeSkull.position.set(0, 1.15, 0.28);
    domeSkull.rotation.x = 1.25;
    figBody.add(domeSkull);

    const fangedJaw = new THREE.Mesh(getCachedBox(0.16, 0.12, 0.22), boneMat);
    fangedJaw.position.set(0, 0.95, 0.55);
    figBody.add(fangedJaw);

    const eyeL = new THREE.Mesh(getCachedSphere(0.045, 10, 10), eyeGlowMat);
    eyeL.position.set(-0.09, 1.08, 0.46);
    figBody.add(eyeL);
    const eyeR = new THREE.Mesh(getCachedSphere(0.045, 10, 10), eyeGlowMat);
    eyeR.position.set(0.09, 1.08, 0.46);
    figBody.add(eyeR);

    const rendGeo = getCachedCone(0.055, 0.85, 10);
    const lRend1 = new THREE.Mesh(rendGeo, boneMat);
    lRend1.position.set(-0.45, 0.95, 0.5);
    lRend1.rotation.set(-1.4, 0, 0.35);
    figBody.add(lRend1);
    const rRend1 = new THREE.Mesh(rendGeo, boneMat);
    rRend1.position.set(0.45, 0.95, 0.5);
    rRend1.rotation.set(-1.4, 0, -0.35);
    figBody.add(rRend1);

    const clawGeo2 = getCachedCone(0.045, 0.65, 10);
    const lRend2 = new THREE.Mesh(clawGeo2, boneMat);
    lRend2.position.set(-0.35, 0.65, 0.4);
    lRend2.rotation.set(-1.2, 0, 0.5);
    figBody.add(lRend2);
    const rRend2 = new THREE.Mesh(clawGeo2, boneMat);
    rRend2.position.set(0.35, 0.65, 0.4);
    rRend2.rotation.set(-1.2, 0, -0.5);
    figBody.add(rRend2);
  } else if (uType === 'ty_biovore') {
    figBody.scale.set(1.25, 1.25, 1.25);
    figBody.position.y = -0.05;

    const fLegGeo = getCachedCone(0.14, 0.52, 12);
    const flLeg = new THREE.Mesh(fLegGeo, armorMat);
    flLeg.position.set(-0.36, 0.22, 0.22);
    flLeg.rotation.set(0.3, 0, 0.5);
    figBody.add(flLeg);
    const frLeg = new THREE.Mesh(fLegGeo, armorMat);
    frLeg.position.set(0.36, 0.22, 0.22);
    frLeg.rotation.set(0.3, 0, -0.5);
    figBody.add(frLeg);

    const blLeg = new THREE.Mesh(fLegGeo, armorMat);
    blLeg.position.set(-0.34, 0.2, -0.28);
    blLeg.rotation.set(-0.4, 0, 0.6);
    figBody.add(blLeg);
    const brLeg = new THREE.Mesh(fLegGeo, armorMat);
    brLeg.position.set(0.34, 0.2, -0.28);
    brLeg.rotation.set(-0.4, 0, -0.6);
    figBody.add(brLeg);
    root.userData.leftLeg = flLeg;
    root.userData.rightLeg = frLeg;

    const carapace = new THREE.Mesh(getCachedSphere(0.48, 16, 16), trimMat);
    carapace.position.set(0, 0.55, 0);
    carapace.scale.set(1.1, 0.8, 1.2);
    figBody.add(carapace);

    const mortarBase = new THREE.Mesh(getCachedCylinder(0.22, 0.28, 0.75, 14), fleshJointMat);
    mortarBase.position.set(0, 0.85, -0.08);
    mortarBase.rotation.x = -0.75;
    figBody.add(mortarBase);
    const mortarMuzzle = new THREE.Mesh(getCachedCylinder(0.26, 0.2, 0.35, 14), bioWeaponMat);
    mortarMuzzle.position.set(0, 1.2, -0.32);
    mortarMuzzle.rotation.x = -0.75;
    figBody.add(mortarMuzzle);
    const sporeCore = new THREE.Mesh(getCachedSphere(0.16, 14, 14), bioWeaponMat);
    sporeCore.position.set(0, 1.25, -0.35);
    figBody.add(sporeCore);

    const head = new THREE.Mesh(getCachedCone(0.24, 0.55, 12), armorMat);
    head.position.set(0, 0.5, 0.42);
    head.rotation.x = 0.5;
    figBody.add(head);
    const eyes = new THREE.Mesh(getCachedSphere(0.05, 10, 10), eyeGlowMat);
    eyes.position.set(0, 0.52, 0.62);
    figBody.add(eyes);
  } else if (uType === 'ty_carnifex') {
    figBody.scale.set(1.6, 1.6, 1.6);
    figBody.position.z = 0.1;

    const thighGeo = getCachedCone(0.24, 0.75, 14);
    const leftLeg = new THREE.Mesh(thighGeo, armorMat);
    leftLeg.position.set(-0.35, 0.42, -0.15);
    leftLeg.rotation.set(-0.4, 0, 0.25);
    figBody.add(leftLeg);
    const rightLeg = new THREE.Mesh(thighGeo, armorMat);
    rightLeg.position.set(0.35, 0.42, -0.15);
    rightLeg.rotation.set(-0.4, 0, -0.25);
    figBody.add(rightLeg);
    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    const shinGeo = getCachedCylinder(0.16, 0.12, 0.55, 12);
    const lShin = new THREE.Mesh(shinGeo, fleshJointMat);
    lShin.position.set(-0.4, 0.18, 0.08);
    lShin.rotation.x = 0.4;
    figBody.add(lShin);
    const rShin = new THREE.Mesh(shinGeo, fleshJointMat);
    rShin.position.set(0.4, 0.18, 0.08);
    rShin.rotation.x = 0.4;
    figBody.add(rShin);

    const tail = new THREE.Mesh(getCachedCylinder(0.16, 0.06, 0.85, 12), armorMat);
    tail.position.set(0, 0.4, -0.55);
    tail.rotation.x = -0.8;
    figBody.add(tail);
    const tailClub = new THREE.Mesh(getCachedSphere(0.15, 12, 12), boneMat);
    tailClub.position.set(0, 0.18, -0.95);
    figBody.add(tailClub);

    const carapace = new THREE.Mesh(getCachedSphere(0.55, 16, 16), trimMat);
    carapace.position.set(0, 0.95, 0.05);
    carapace.scale.set(1.2, 0.95, 1.35);
    figBody.add(carapace);

    for (let r = -1; r <= 1; r++) {
      const ridge = new THREE.Mesh(getCachedCone(0.08, 0.35, 10), boneMat);
      ridge.position.set(r * 0.22, 1.45, -0.15);
      ridge.rotation.x = -0.5;
      figBody.add(ridge);
    }

    const head = new THREE.Mesh(getCachedBox(0.48, 0.42, 0.55), armorMat);
    head.position.set(0, 1.05, 0.45);
    head.rotation.x = 0.2;
    figBody.add(head);

    const plasmaGlow = new THREE.Mesh(getCachedSphere(0.14, 14, 14), bioWeaponMat);
    plasmaGlow.position.set(0, 0.98, 0.72);
    figBody.add(plasmaGlow);

    const lTusk = new THREE.Mesh(getCachedCone(0.07, 0.45, 10), boneMat);
    lTusk.position.set(-0.25, 0.92, 0.7);
    lTusk.rotation.set(0.3, 0, -0.4);
    figBody.add(lTusk);
    const rTusk = new THREE.Mesh(getCachedCone(0.07, 0.45, 10), boneMat);
    rTusk.position.set(0.25, 0.92, 0.7);
    rTusk.rotation.set(0.3, 0, 0.4);
    figBody.add(rTusk);

    const bigTalonGeo = getCachedCone(0.12, 1.45, 10);
    const lTal1 = new THREE.Mesh(bigTalonGeo, boneMat);
    lTal1.position.set(-0.75, 1.25, 0.45);
    lTal1.rotation.set(-1.25, 0, 0.45);
    figBody.add(lTal1);
    const rTal1 = new THREE.Mesh(bigTalonGeo, boneMat);
    rTal1.position.set(0.75, 1.25, 0.45);
    rTal1.rotation.set(-1.25, 0, -0.45);
    figBody.add(rTal1);

    const medTalonGeo = getCachedCone(0.09, 1.15, 10);
    const lTal2 = new THREE.Mesh(medTalonGeo, boneMat);
    lTal2.position.set(-0.65, 0.75, 0.4);
    lTal2.rotation.set(-1.1, 0, 0.35);
    figBody.add(lTal2);
    const rTal2 = new THREE.Mesh(medTalonGeo, boneMat);
    rTal2.position.set(0.65, 0.75, 0.4);
    rTal2.rotation.set(-1.1, 0, -0.35);
    figBody.add(rTal2);
  } else {
    figBody.scale.set(0.72, 0.72, 0.72);
    figBody.rotation.x = 0.22;

    const legGeo = getCachedCone(0.09, 0.45, 10);
    const leftLeg = new THREE.Mesh(legGeo, armorMat);
    leftLeg.position.set(-0.2, 0.2, -0.08);
    leftLeg.rotation.set(-0.3, 0, 0.2);
    figBody.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, armorMat);
    rightLeg.position.set(0.2, 0.2, -0.08);
    rightLeg.rotation.set(-0.3, 0, -0.2);
    figBody.add(rightLeg);
    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    const tail = new THREE.Mesh(getCachedCylinder(0.05, 0.015, 0.65, 12), fleshJointMat);
    tail.position.set(0, 0.28, -0.4);
    tail.rotation.x = -0.7;
    figBody.add(tail);

    const abdomen = new THREE.Mesh(getCachedCone(0.24, 0.65, 12), trimMat);
    abdomen.position.set(0, 0.65, 0);
    abdomen.rotation.x = 0.45;
    figBody.add(abdomen);

    const head = new THREE.Mesh(getCachedCone(0.18, 0.55, 12), armorMat);
    head.position.set(0, 0.95, 0.2);
    head.rotation.x = 0.8;
    figBody.add(head);

    const eye = new THREE.Mesh(getCachedSphere(0.045, 10, 10), eyeGlowMat);
    eye.position.set(0, 0.95, 0.35);
    figBody.add(eye);

    const borer = new THREE.Mesh(getCachedCylinder(0.06, 0.08, 0.48, 12), bioWeaponMat);
    borer.position.set(0, 0.52, 0.32);
    borer.rotation.x = Math.PI / 2;
    figBody.add(borer);
  }
}
