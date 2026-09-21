import * as THREE from 'three';
import { UnitDef, Team } from '../../data/types';

export function buildNecronFigure(
  uType: string,
  _def: UnitDef,
  _team: Team,
  _isLeader: boolean,
  figBody: THREE.Group,
  root: THREE.Group,
  _armorMat: THREE.Material,
  _trimMat: THREE.Material,
  _darkJointMat: THREE.Material,
  _eyeGlowMat: THREE.Material
): void {
  const necroMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.35, metalness: 0.85 });
  const gaussGlowMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
  const gaussDarkMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5, metalness: 0.8 });
  const goldGlyphMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.25, metalness: 0.9 });

  if (uType === 'nec_overlord') {
    figBody.scale.set(1.35, 1.35, 1.35);

    const legGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.65, 8);
    const leftLeg = new THREE.Mesh(legGeo, necroMat);
    leftLeg.position.set(-0.18, 0.32, 0);
    figBody.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, necroMat);
    rightLeg.position.set(0.18, 0.32, 0);
    figBody.add(rightLeg);
    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.65, 0.3), necroMat);
    torso.position.y = 0.9;
    figBody.add(torso);

    const ankh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.32, 0.08), goldGlyphMat);
    ankh.position.set(0, 0.92, 0.16);
    figBody.add(ankh);

    const nemesCollar = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.08, 6, 12, Math.PI), goldGlyphMat);
    nemesCollar.position.set(0, 1.25, 0.02);
    nemesCollar.rotation.z = Math.PI;
    figBody.add(nemesCollar);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.32, 0.26), necroMat);
    head.position.y = 1.38;
    figBody.add(head);

    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), gaussGlowMat);
    eyeL.position.set(-0.06, 1.4, 0.14);
    figBody.add(eyeL);
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), gaussGlowMat);
    eyeR.position.set(0.06, 1.4, 0.14);
    figBody.add(eyeR);

    const cloak = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.0, 0.04), gaussDarkMat);
    cloak.position.set(0, 0.8, -0.18);
    cloak.rotation.x = -0.1;
    figBody.add(cloak);

    const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.7, 8), goldGlyphMat);
    staff.position.set(0.45, 1.05, 0.2);
    figBody.add(staff);
    const scytheBlade = new THREE.Mesh(
      new THREE.TorusGeometry(0.28, 0.05, 4, 12, Math.PI * 0.75),
      gaussGlowMat
    );
    scytheBlade.position.set(0.55, 1.75, 0.2);
    scytheBlade.rotation.z = -0.8;
    figBody.add(scytheBlade);

    const lArm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.5, 6), necroMat);
    lArm.position.set(-0.35, 0.95, 0.2);
    lArm.rotation.x = -0.6;
    figBody.add(lArm);
    const resOrb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), gaussGlowMat);
    resOrb.position.set(-0.38, 1.15, 0.42);
    figBody.add(resOrb);
  } else if (uType === 'nec_immortals') {
    figBody.scale.set(1.08, 1.08, 1.08);

    const legGeo = new THREE.CylinderGeometry(0.09, 0.12, 0.58, 8);
    const leftLeg = new THREE.Mesh(legGeo, necroMat);
    leftLeg.position.set(-0.19, 0.29, 0);
    figBody.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, necroMat);
    rightLeg.position.set(0.19, 0.29, 0);
    figBody.add(rightLeg);
    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.6, 0.32), necroMat);
    torso.position.y = 0.85;
    figBody.add(torso);

    const shGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.24, 6);
    const lSh = new THREE.Mesh(shGeo, gaussDarkMat);
    lSh.position.set(-0.38, 1.05, 0);
    lSh.rotation.z = 0.3;
    figBody.add(lSh);
    const rSh = new THREE.Mesh(shGeo, gaussDarkMat);
    rSh.position.set(0.38, 1.05, 0);
    rSh.rotation.z = -0.3;
    figBody.add(rSh);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.3, 0.26), necroMat);
    head.position.y = 1.3;
    figBody.add(head);
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.05, 0.05), gaussGlowMat);
    visor.position.set(0, 1.32, 0.14);
    figBody.add(visor);

    const blaster = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.85), gaussDarkMat);
    blaster.position.set(0.28, 0.82, 0.45);
    figBody.add(blaster);
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8), gaussGlowMat);
    rod.position.set(0.28, 0.94, 0.45);
    rod.rotation.x = Math.PI / 2;
    figBody.add(rod);
  } else if (uType === 'nec_destroyers') {
    figBody.scale.set(1.18, 1.18, 1.18);

    const triChassis = new THREE.Group();
    for (let l = 0; l < 3; l++) {
      const lAng = (l * Math.PI * 2) / 3;
      const legUpper = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.42, 0.1), gaussDarkMat);
      legUpper.position.set(Math.cos(lAng) * 0.24, 0.42, Math.sin(lAng) * 0.24);
      legUpper.rotation.y = -lAng;
      legUpper.rotation.z = 0.55;
      triChassis.add(legUpper);

      const legLower = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.45, 0.08), necroMat);
      legLower.position.set(Math.cos(lAng) * 0.38, 0.18, Math.sin(lAng) * 0.38);
      legLower.rotation.y = -lAng;
      legLower.rotation.z = -0.45;
      triChassis.add(legLower);
    }
    figBody.add(triChassis);
    root.userData.leftLeg = triChassis;
    root.userData.rightLeg = triChassis;

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.62, 0.38), necroMat);
    torso.position.set(0, 0.85, 0.08);
    torso.rotation.x = 0.2;
    figBody.add(torso);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.28, 0.3), gaussDarkMat);
    head.position.set(0, 1.18, 0.24);
    figBody.add(head);
    const opticEye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), gaussGlowMat);
    opticEye.position.set(0, 1.18, 0.39);
    figBody.add(opticEye);

    const bladeGeo = new THREE.TorusGeometry(0.36, 0.06, 4, 16, Math.PI * 0.85);
    const lBlade = new THREE.Mesh(bladeGeo, gaussGlowMat);
    lBlade.position.set(-0.48, 0.85, 0.35);
    lBlade.rotation.x = 0.4;
    lBlade.rotation.y = 0.5;
    figBody.add(lBlade);
    const rBlade = new THREE.Mesh(bladeGeo, gaussGlowMat);
    rBlade.position.set(0.48, 0.85, 0.35);
    rBlade.rotation.x = 0.4;
    rBlade.rotation.y = -0.5;
    figBody.add(rBlade);
  } else if (uType === 'nec_heavy_destroyer') {
    figBody.scale.set(1.35, 1.35, 1.35);

    const sledGeo = new THREE.CylinderGeometry(0.55, 0.42, 0.32, 12);
    const sled = new THREE.Mesh(sledGeo, gaussDarkMat);
    sled.position.set(0, 0.28, -0.05);
    figBody.add(sled);
    root.userData.leftLeg = sled;
    root.userData.rightLeg = sled;

    const repulsorGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.08, 12), gaussGlowMat);
    repulsorGlow.position.set(0, 0.14, -0.05);
    figBody.add(repulsorGlow);

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.6, 0.32), necroMat);
    torso.position.set(0, 0.72, 0.05);
    torso.rotation.x = 0.15;
    figBody.add(torso);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.28, 0.26), necroMat);
    head.position.set(0, 1.15, 0.18);
    figBody.add(head);
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), gaussGlowMat);
    eye.position.set(0, 1.16, 0.31);
    figBody.add(eye);

    const cannon = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.3, 1.35), gaussDarkMat);
    cannon.position.set(0.32, 0.75, 0.65);
    cannon.rotation.x = -0.05;
    figBody.add(cannon);

    for (let r = 0; r < 2; r++) {
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.85, 8), gaussGlowMat);
      rod.position.set(0.32, 0.9 - r * 0.28, 0.65);
      rod.rotation.x = Math.PI / 2;
      figBody.add(rod);
    }
  } else if (uType === 'nec_doomstalker') {
    figBody.scale.set(1.6, 1.6, 1.6);

    const stiltGroup = new THREE.Group();
    for (let l = 0; l < 4; l++) {
      const ang = (l * Math.PI) / 2 + Math.PI / 4;
      const upperStilt = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.85, 0.08), gaussDarkMat);
      upperStilt.position.set(Math.cos(ang) * 0.32, 0.75, Math.sin(ang) * 0.32);
      upperStilt.rotation.y = -ang;
      upperStilt.rotation.z = 0.45;
      stiltGroup.add(upperStilt);

      const lowerStilt = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.95, 0.06), necroMat);
      lowerStilt.position.set(Math.cos(ang) * 0.55, 0.35, Math.sin(ang) * 0.55);
      lowerStilt.rotation.y = -ang;
      lowerStilt.rotation.z = -0.35;
      stiltGroup.add(lowerStilt);
    }
    figBody.add(stiltGroup);
    root.userData.leftLeg = stiltGroup;
    root.userData.rightLeg = stiltGroup;

    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.45, 12, 12), gaussDarkMat);
    dome.position.set(0, 1.25, 0);
    figBody.add(dome);

    const reactorEye = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), gaussGlowMat);
    reactorEye.position.set(0, 1.25, 0.38);
    figBody.add(reactorEye);

    const blasterBase = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.45, 8), necroMat);
    blasterBase.position.set(0, 1.7, 0.05);
    figBody.add(blasterBase);

    const blasterBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 1.85, 8), gaussDarkMat);
    blasterBarrel.position.set(0, 1.82, 0.85);
    blasterBarrel.rotation.x = Math.PI / 2;
    figBody.add(blasterBarrel);

    for (let ring = 0; ring < 3; ring++) {
      const accRing = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.04, 6, 12), gaussGlowMat);
      accRing.position.set(0, 1.82, 0.45 + ring * 0.45);
      figBody.add(accRing);
    }
  } else {
    figBody.scale.set(0.82, 0.82, 0.82);

    const legGeo = new THREE.CylinderGeometry(0.07, 0.09, 0.55, 6);
    const leftLeg = new THREE.Mesh(legGeo, necroMat);
    leftLeg.position.set(-0.16, 0.28, 0);
    figBody.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, necroMat);
    rightLeg.position.set(0.16, 0.28, 0);
    figBody.add(rightLeg);
    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.52, 0.26), necroMat);
    torso.position.set(0, 0.78, 0.03);
    torso.rotation.x = 0.1;
    figBody.add(torso);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.26, 0.22), necroMat);
    head.position.set(0, 1.12, 0.12);
    figBody.add(head);
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), gaussGlowMat);
    eye.position.set(0, 1.14, 0.23);
    figBody.add(eye);

    const flayer = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.7), gaussDarkMat);
    flayer.position.set(0.22, 0.72, 0.35);
    figBody.add(flayer);
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.45, 6), gaussGlowMat);
    rod.position.set(0.22, 0.8, 0.35);
    rod.rotation.x = Math.PI / 2;
    figBody.add(rod);
  }
}
