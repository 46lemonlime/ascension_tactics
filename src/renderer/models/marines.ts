import * as THREE from 'three';
import { UnitDef, Team } from '../../data/types';

export function buildSpaceMarineFigure(
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
  const energyCyanMat = new THREE.MeshStandardMaterial({
    color: 0x67e8f9,
    roughness: 0.1,
    metalness: 0.9,
    emissive: 0x0284c7,
    emissiveIntensity: 0.7
  });
  const gunMetalMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.5, metalness: 0.7 });
  const goldRelicMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.85 });

  const legGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.55, 8);
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

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.65, 0.38), armorMat);
  torso.position.y = 0.85;
  torso.castShadow = true;
  figBody.add(torso);
  const aquila = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 0.08), trimMat);
  aquila.position.set(0, 0.9, 0.2);
  figBody.add(aquila);

  const shGeo = new THREE.SphereGeometry(0.24, 8, 8);
  const leftSh = new THREE.Mesh(shGeo, trimMat);
  leftSh.position.set(-0.42, 1.05, 0);
  leftSh.scale.set(1, 1.25, 1.3);
  figBody.add(leftSh);
  const rightSh = new THREE.Mesh(shGeo, trimMat);
  rightSh.position.set(0.42, 1.05, 0);
  rightSh.scale.set(1, 1.25, 1.3);
  figBody.add(rightSh);

  const helm = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.35, 0.35), armorMat);
  helm.position.y = 1.32;
  figBody.add(helm);
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.05), eyeGlowMat);
  visor.position.set(0, 1.33, 0.18);
  figBody.add(visor);

  if (uType === 'sm_captain') {
    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.04, 6, 16, Math.PI), goldRelicMat);
    halo.position.set(0, 1.58, -0.05);
    halo.rotation.z = Math.PI;
    figBody.add(halo);

    const cape = new THREE.Mesh(
      new THREE.BoxGeometry(0.68, 1.05, 0.04),
      new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.9 })
    );
    cape.position.set(0, 0.8, -0.28);
    cape.rotation.x = -0.15;
    figBody.add(cape);

    const bp = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.28), darkJointMat);
    bp.position.set(0, 0.95, -0.25);
    figBody.add(bp);

    const swordBlade = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.05, 0.14), energyCyanMat);
    swordBlade.position.set(-0.48, 1.2, 0.4);
    swordBlade.rotation.x = -0.6;
    figBody.add(swordBlade);

    const plasmaGun = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, 0.45), gunMetalMat);
    plasmaGun.position.set(0.42, 0.88, 0.32);
    figBody.add(plasmaGun);
    const plasmaCoil = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.22), energyCyanMat);
    plasmaCoil.position.set(0.42, 0.98, 0.32);
    figBody.add(plasmaCoil);
  } else if (uType === 'sm_assault') {
    const jpBox = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.52, 0.24), darkJointMat);
    jpBox.position.set(0, 0.95, -0.24);
    figBody.add(jpBox);

    const turbGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.65, 8);
    const lTurb = new THREE.Mesh(turbGeo, trimMat);
    lTurb.position.set(-0.28, 1.1, -0.26);
    lTurb.rotation.x = 0.25;
    figBody.add(lTurb);
    const rTurb = new THREE.Mesh(turbGeo, trimMat);
    rTurb.position.set(0.28, 1.1, -0.26);
    rTurb.rotation.x = 0.25;
    figBody.add(rTurb);

    const flameGeo = new THREE.ConeGeometry(0.08, 0.25, 6);
    const lFlame = new THREE.Mesh(flameGeo, energyCyanMat);
    lFlame.position.set(-0.28, 0.72, -0.32);
    lFlame.rotation.x = Math.PI;
    figBody.add(lFlame);
    const rFlame = new THREE.Mesh(flameGeo, energyCyanMat);
    rFlame.position.set(0.28, 0.72, -0.32);
    rFlame.rotation.x = Math.PI;
    figBody.add(rFlame);

    const cs = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, 0.16), trimMat);
    cs.position.set(-0.46, 1.15, 0.35);
    cs.rotation.x = -0.55;
    figBody.add(cs);

    const pistol = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 0.38), gunMetalMat);
    pistol.position.set(0.38, 0.85, 0.3);
    figBody.add(pistol);
  } else if (uType === 'sm_devastator') {
    const bp = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.52, 0.32), darkJointMat);
    bp.position.set(0, 0.95, -0.26);
    figBody.add(bp);
    const ammoDrum = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.28, 10), trimMat);
    ammoDrum.position.set(0.28, 0.85, -0.28);
    ammoDrum.rotation.z = Math.PI / 2;
    figBody.add(ammoDrum);

    const sight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.18), energyCyanMat);
    sight.position.set(0.2, 1.4, 0.1);
    figBody.add(sight);

    const hb = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.28, 1.1), gunMetalMat);
    hb.position.set(0.28, 0.82, 0.5);
    figBody.add(hb);
    const hbShroud = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.3, 8), trimMat);
    hbShroud.position.set(0.28, 0.82, 1.05);
    hbShroud.rotation.x = Math.PI / 2;
    figBody.add(hbShroud);

    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.45), goldRelicMat);
    belt.position.set(0.38, 0.78, 0.15);
    belt.rotation.y = 0.5;
    figBody.add(belt);
  } else if (uType === 'sm_centurion') {
    figBody.scale.set(1.45, 1.45, 1.45);

    const lLeg = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.6, 0.32), armorMat);
    lLeg.position.set(-0.28, 0.3, 0);
    figBody.add(lLeg);
    const rLeg = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.6, 0.32), armorMat);
    rLeg.position.set(0.28, 0.3, 0);
    figBody.add(rLeg);
    root.userData.leftLeg = lLeg;
    root.userData.rightLeg = rLeg;

    const torsoMesh = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.78, 0.52), armorMat);
    torsoMesh.position.y = 0.92;
    figBody.add(torsoMesh);

    const chestPod = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.28, 0.18), darkJointMat);
    chestPod.position.set(0, 1.05, 0.28);
    figBody.add(chestPod);
    for (let m = -2; m <= 2; m++) {
      const missile = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), energyCyanMat);
      missile.position.set(m * 0.12, 1.05, 0.38);
      figBody.add(missile);
    }

    const shBox = new THREE.BoxGeometry(0.38, 0.42, 0.48);
    const lSh = new THREE.Mesh(shBox, trimMat);
    lSh.position.set(-0.58, 1.15, 0);
    figBody.add(lSh);
    const rSh = new THREE.Mesh(shBox, trimMat);
    rSh.position.set(0.58, 1.15, 0);
    figBody.add(rSh);

    const drillGeo = new THREE.ConeGeometry(0.12, 0.55, 6);
    const lDrill = new THREE.Mesh(drillGeo, gunMetalMat);
    lDrill.position.set(-0.58, 0.75, 0.45);
    lDrill.rotation.x = Math.PI / 2;
    figBody.add(lDrill);
    const rDrill = new THREE.Mesh(drillGeo, gunMetalMat);
    rDrill.position.set(0.58, 0.75, 0.45);
    rDrill.rotation.x = Math.PI / 2;
    figBody.add(rDrill);
  } else if (uType === 'sm_dreadnought') {
    figBody.scale.set(1.55, 1.55, 1.55);

    const hip = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.22, 0.45), darkJointMat);
    hip.position.y = 0.45;
    figBody.add(hip);

    const legBox = new THREE.BoxGeometry(0.24, 0.45, 0.28);
    const lLeg = new THREE.Mesh(legBox, armorMat);
    lLeg.position.set(-0.35, 0.22, 0);
    figBody.add(lLeg);
    const rLeg = new THREE.Mesh(legBox, armorMat);
    rLeg.position.set(0.35, 0.22, 0);
    figBody.add(rLeg);
    root.userData.leftLeg = lLeg;
    root.userData.rightLeg = rLeg;

    const footBox = new THREE.BoxGeometry(0.32, 0.12, 0.48);
    const lFoot = new THREE.Mesh(footBox, darkJointMat);
    lFoot.position.set(-0.35, 0.06, 0.05);
    figBody.add(lFoot);
    const rFoot = new THREE.Mesh(footBox, darkJointMat);
    rFoot.position.set(0.35, 0.06, 0.05);
    figBody.add(rFoot);

    const hull = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.85, 0.72), armorMat);
    hull.position.y = 0.95;
    figBody.add(hull);

    const sarcophagus = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.65, 0.14), trimMat);
    sarcophagus.position.set(0, 0.95, 0.38);
    figBody.add(sarcophagus);

    const visionSlit = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.06, 0.08), eyeGlowMat);
    visionSlit.position.set(0, 1.15, 0.44);
    figBody.add(visionSlit);

    const lStack = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.45, 8), darkJointMat);
    lStack.position.set(-0.32, 1.5, -0.25);
    figBody.add(lStack);
    const rStack = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.45, 8), darkJointMat);
    rStack.position.set(0.32, 1.5, -0.25);
    figBody.add(rStack);

    const cannonBase = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.28, 0.55), darkJointMat);
    cannonBase.position.set(0.7, 0.95, 0.15);
    figBody.add(cannonBase);
    for (let b = 0; b < 6; b++) {
      const bAng = (b * Math.PI * 2) / 6;
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.85, 6), gunMetalMat);
      barrel.position.set(0.7 + Math.cos(bAng) * 0.09, 0.95 + Math.sin(bAng) * 0.09, 0.8);
      barrel.rotation.x = Math.PI / 2;
      figBody.add(barrel);
    }

    const clawArm = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.32, 0.55), armorMat);
    clawArm.position.set(-0.7, 0.95, 0.2);
    figBody.add(clawArm);
    for (let c = -1; c <= 1; c += 2) {
      const pincer = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.45, 4), trimMat);
      pincer.position.set(-0.7 + c * 0.08, 0.95, 0.65);
      pincer.rotation.x = Math.PI / 2;
      figBody.add(pincer);
    }
  } else {
    const bp = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.28), darkJointMat);
    bp.position.set(0, 0.95, -0.25);
    figBody.add(bp);

    const ventGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const leftVent = new THREE.Mesh(ventGeo, trimMat);
    leftVent.position.set(-0.28, 1.15, -0.25);
    figBody.add(leftVent);
    const rightVent = new THREE.Mesh(ventGeo, trimMat);
    rightVent.position.set(0.28, 1.15, -0.25);
    figBody.add(rightVent);

    const gun = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, 0.65), gunMetalMat);
    gun.position.set(0.28, 0.85, 0.35);
    figBody.add(gun);
    const mag = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, 0.14), trimMat);
    mag.position.set(0.28, 0.7, 0.3);
    figBody.add(mag);
  }
}
