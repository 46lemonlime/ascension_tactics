import * as THREE from 'three';
import { UnitDef, Team } from '../../data/types';

export function buildVipCourierFigure(
  _uType: string,
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
  const robeMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.85 });
  const goldRelicMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.25,
    metalness: 0.85
  });
  const energyCyanMat = new THREE.MeshStandardMaterial({
    color: 0x67e8f9,
    roughness: 0.1,
    metalness: 0.9,
    emissive: 0x0284c7,
    emissiveIntensity: 0.7
  });
  const gunMetalMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.5, metalness: 0.7 });

  // 1. Robed Body & Feet
  const robeGeo = new THREE.CylinderGeometry(0.24, 0.42, 0.75, 10);
  const robe = new THREE.Mesh(robeGeo, robeMat);
  robe.position.y = 0.38;
  robe.castShadow = true;
  figBody.add(robe);

  const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.35, 6), darkJointMat);
  leftLeg.position.set(-0.14, 0.18, 0);
  figBody.add(leftLeg);
  const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.35, 6), darkJointMat);
  rightLeg.position.set(0.14, 0.18, 0);
  figBody.add(rightLeg);
  root.userData.leftLeg = leftLeg;
  root.userData.rightLeg = rightLeg;

  // 2. Armored Torso with Cog Pattern
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.55, 0.32), armorMat);
  torso.position.y = 0.82;
  torso.castShadow = true;
  figBody.add(torso);

  const cog = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.06, 12), trimMat);
  cog.position.set(0, 0.85, 0.18);
  cog.rotation.x = Math.PI / 2;
  figBody.add(cog);

  // 3. Tech-Priest Hood & Cybernetic Optics
  const hood = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.45, 8), robeMat);
  hood.position.set(0, 1.25, -0.02);
  hood.rotation.x = -0.15;
  figBody.add(hood);

  const mask = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.18), gunMetalMat);
  mask.position.set(0, 1.15, 0.1);
  figBody.add(mask);

  const opticLens = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), eyeGlowMat);
  opticLens.position.set(0.06, 1.18, 0.2);
  figBody.add(opticLens);

  const rebreather = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.12, 8), trimMat);
  rebreather.position.set(-0.06, 1.1, 0.19);
  rebreather.rotation.x = Math.PI / 2;
  figBody.add(rebreather);

  // 4. Sacred Archeotech Relic Container on Back (Glowing Golden Urn / Chest)
  const relicChest = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.52, 0.32), goldRelicMat);
  relicChest.position.set(0, 0.92, -0.28);
  relicChest.castShadow = true;
  figBody.add(relicChest);

  const relicCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.12), energyCyanMat);
  relicCore.position.set(0, 0.92, -0.46);
  figBody.add(relicCore);

  // 5. Shoulder Mechadendrite / Servo-Claw
  const servoBase = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.45, 6), darkJointMat);
  servoBase.position.set(-0.28, 1.25, -0.15);
  servoBase.rotation.z = -0.35;
  servoBase.rotation.x = 0.25;
  figBody.add(servoBase);

  const servoClaw = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.12), trimMat);
  servoClaw.position.set(-0.38, 1.48, -0.05);
  figBody.add(servoClaw);

  // 6. Arc Pistol in Right Hand
  const pistol = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.15, 0.35), gunMetalMat);
  pistol.position.set(0.36, 0.78, 0.25);
  figBody.add(pistol);

  const pistolCoil = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 0.18), energyCyanMat);
  pistolCoil.position.set(0.36, 0.86, 0.25);
  figBody.add(pistolCoil);
}
