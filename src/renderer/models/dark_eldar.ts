import * as THREE from 'three';
import { UnitDef, Team } from '../../data/types';

export function buildDarkEldarFigure(
  uType: string,
  _def: UnitDef,
  _team: Team,
  _isLeader: boolean,
  figBody: THREE.Group,
  root: THREE.Group,
  _armorMat: THREE.Material,
  trimMat: THREE.Material,
  _darkJointMat: THREE.Material,
  _eyeGlowMat: THREE.Material
): void {
  const obsidianMat = new THREE.MeshStandardMaterial({ color: 0x042f2e, roughness: 0.3, metalness: 0.85 });
  const toxicGlowMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
  const bladeMat = new THREE.MeshStandardMaterial({
    color: 0x34d399,
    roughness: 0.15,
    metalness: 0.95,
    emissive: 0x059669,
    emissiveIntensity: 0.65
  });
  const gunMetalMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.75 });
  const flayedMat = new THREE.MeshStandardMaterial({ color: 0x701a75, roughness: 0.85 });

  if (uType === 'de_archon') {
    figBody.scale.set(1.25, 1.25, 1.25);

    const legGeo = new THREE.CylinderGeometry(0.08, 0.11, 0.6, 8);
    const leftLeg = new THREE.Mesh(legGeo, obsidianMat);
    leftLeg.position.set(-0.16, 0.3, 0);
    figBody.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, obsidianMat);
    rightLeg.position.set(0.16, 0.3, 0);
    figBody.add(rightLeg);
    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.58, 0.28), obsidianMat);
    torso.position.y = 0.88;
    figBody.add(torso);

    const trophyPole1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 6), gunMetalMat);
    trophyPole1.position.set(-0.18, 1.35, -0.16);
    trophyPole1.rotation.z = 0.2;
    figBody.add(trophyPole1);
    const trophyPole2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 6), gunMetalMat);
    trophyPole2.position.set(0.18, 1.35, -0.16);
    trophyPole2.rotation.z = -0.2;
    figBody.add(trophyPole2);
    const bladeTrophy1 = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.28, 4), bladeMat);
    bladeTrophy1.position.set(-0.25, 1.7, -0.16);
    figBody.add(bladeTrophy1);
    const bladeTrophy2 = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.28, 4), bladeMat);
    bladeTrophy2.position.set(0.25, 1.7, -0.16);
    figBody.add(bladeTrophy2);

    const cape = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.95, 0.04), flayedMat);
    cape.position.set(0, 0.78, -0.18);
    cape.rotation.x = -0.12;
    figBody.add(cape);

    const collar = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.25, 0.04), trimMat);
    collar.position.set(0, 1.22, -0.1);
    figBody.add(collar);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.28, 0.24), obsidianMat);
    head.position.y = 1.32;
    figBody.add(head);

    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.04), toxicGlowMat);
    visor.position.set(0, 1.34, 0.13);
    figBody.add(visor);

    const swordBlade = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.95, 0.14), bladeMat);
    swordBlade.position.set(0.42, 1.15, 0.35);
    swordBlade.rotation.x = -0.45;
    figBody.add(swordBlade);

    const pistol = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.12, 0.42), gunMetalMat);
    pistol.position.set(-0.36, 0.85, 0.28);
    figBody.add(pistol);
  } else if (uType === 'de_incubi') {
    figBody.scale.set(1.1, 1.1, 1.1);

    const legGeo = new THREE.CylinderGeometry(0.09, 0.12, 0.58, 8);
    const leftLeg = new THREE.Mesh(legGeo, obsidianMat);
    leftLeg.position.set(-0.17, 0.29, 0);
    figBody.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, obsidianMat);
    rightLeg.position.set(0.17, 0.29, 0);
    figBody.add(rightLeg);
    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.56, 0.28), obsidianMat);
    torso.position.y = 0.85;
    figBody.add(torso);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.28, 0.26), obsidianMat);
    head.position.y = 1.25;
    figBody.add(head);

    const hornGeo = new THREE.ConeGeometry(0.05, 0.42, 5);
    const lHorn = new THREE.Mesh(hornGeo, trimMat);
    lHorn.position.set(-0.16, 1.45, 0);
    lHorn.rotation.z = 0.5;
    figBody.add(lHorn);
    const rHorn = new THREE.Mesh(hornGeo, trimMat);
    rHorn.position.set(0.16, 1.45, 0);
    rHorn.rotation.z = -0.5;
    figBody.add(rHorn);

    const eyes = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.04), toxicGlowMat);
    eyes.position.set(0, 1.26, 0.14);
    figBody.add(eyes);

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.4, 6), gunMetalMat);
    shaft.position.set(0.32, 0.95, 0.35);
    shaft.rotation.x = -0.35;
    figBody.add(shaft);
    const klaiveBlade = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.85, 0.22), bladeMat);
    klaiveBlade.position.set(0.32, 1.55, 0.55);
    klaiveBlade.rotation.x = -0.35;
    figBody.add(klaiveBlade);
  } else if (uType === 'de_scourges') {
    figBody.scale.set(1.1, 1.1, 1.1);

    const legGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.58, 6);
    const leftLeg = new THREE.Mesh(legGeo, obsidianMat);
    leftLeg.position.set(-0.16, 0.29, 0);
    figBody.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, obsidianMat);
    rightLeg.position.set(0.16, 0.29, 0);
    figBody.add(rightLeg);
    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.52, 0.26), obsidianMat);
    torso.position.y = 0.82;
    figBody.add(torso);

    const wingGeo = new THREE.BoxGeometry(0.85, 0.35, 0.03);
    const lWing = new THREE.Mesh(wingGeo, trimMat);
    lWing.position.set(-0.48, 1.15, -0.22);
    lWing.rotation.set(-0.2, 0.4, 0.5);
    figBody.add(lWing);
    const rWing = new THREE.Mesh(wingGeo, trimMat);
    rWing.position.set(0.48, 1.15, -0.22);
    rWing.rotation.set(-0.2, -0.4, -0.5);
    figBody.add(rWing);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.26, 0.24), obsidianMat);
    head.position.y = 1.22;
    figBody.add(head);
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.04, 0.04), toxicGlowMat);
    visor.position.set(0, 1.23, 0.13);
    figBody.add(visor);

    const lance = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, 1.35), gunMetalMat);
    lance.position.set(0.28, 0.85, 0.55);
    figBody.add(lance);
    const lanceTip = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.35, 4), bladeMat);
    lanceTip.position.set(0.28, 0.85, 1.25);
    lanceTip.rotation.x = Math.PI / 2;
    figBody.add(lanceTip);
  } else if (uType === 'de_talos') {
    figBody.scale.set(1.35, 1.35, 1.35);
    figBody.position.y = 0.2;

    const carapace = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.72, 0.65), obsidianMat);
    carapace.position.set(0, 0.75, 0);
    figBody.add(carapace);
    root.userData.leftLeg = carapace;
    root.userData.rightLeg = carapace;

    const repulsorNode = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), toxicGlowMat);
    repulsorNode.position.set(0, 0.32, 0);
    figBody.add(repulsorNode);

    const tailGeo = new THREE.CylinderGeometry(0.06, 0.04, 1.25, 6);
    const tail = new THREE.Mesh(tailGeo, obsidianMat);
    tail.position.set(0, 1.45, -0.25);
    tail.rotation.x = 0.65;
    figBody.add(tail);

    const stingerNeedle = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.45, 4), bladeMat);
    stingerNeedle.position.set(0, 1.95, 0.15);
    stingerNeedle.rotation.x = Math.PI / 2;
    figBody.add(stingerNeedle);

    const heatLance = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.75, 6), gunMetalMat);
    heatLance.position.set(0, 0.55, 0.55);
    heatLance.rotation.x = Math.PI / 2;
    figBody.add(heatLance);

    for (let s = -1; s <= 1; s += 2) {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.55), gunMetalMat);
      arm.position.set(s * 0.52, 0.75, 0.25);
      figBody.add(arm);
      const scalpel = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.45, 0.16), bladeMat);
      scalpel.position.set(s * 0.52, 0.65, 0.65);
      scalpel.rotation.x = -0.4;
      figBody.add(scalpel);
    }
  } else if (uType === 'de_ravager') {
    figBody.scale.set(1.55, 1.55, 1.55);
    figBody.position.y = 0.25;

    const hull = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.28, 1.8), obsidianMat);
    hull.position.set(0, 0.35, 0);
    figBody.add(hull);
    root.userData.leftLeg = hull;
    root.userData.rightLeg = hull;

    const prowBlade = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.35, 0.65), bladeMat);
    prowBlade.position.set(0, 0.35, 1.15);
    prowBlade.rotation.x = 0.4;
    figBody.add(prowBlade);

    const sailGeo = new THREE.BoxGeometry(0.04, 1.1, 0.55);
    const sail = new THREE.Mesh(sailGeo, trimMat);
    sail.position.set(0, 1.05, -0.65);
    sail.rotation.x = -0.25;
    figBody.add(sail);

    const prowLance = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 1.25, 6), gunMetalMat);
    prowLance.position.set(0, 0.55, 0.95);
    prowLance.rotation.x = Math.PI / 2;
    figBody.add(prowLance);

    const lLance = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 1.15, 6), gunMetalMat);
    lLance.position.set(-0.55, 0.48, 0.25);
    lLance.rotation.x = Math.PI / 2;
    figBody.add(lLance);
    const rLance = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 1.15, 6), gunMetalMat);
    rLance.position.set(0.55, 0.48, 0.25);
    rLance.rotation.x = Math.PI / 2;
    figBody.add(rLance);

    const engineL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), toxicGlowMat);
    engineL.position.set(-0.35, 0.32, -0.92);
    figBody.add(engineL);
    const engineR = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), toxicGlowMat);
    engineR.position.set(0.35, 0.32, -0.92);
    figBody.add(engineR);
  } else {
    figBody.scale.set(0.82, 0.82, 0.82);

    const legGeo = new THREE.CylinderGeometry(0.07, 0.09, 0.52, 6);
    const leftLeg = new THREE.Mesh(legGeo, obsidianMat);
    leftLeg.position.set(-0.15, 0.26, 0);
    figBody.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, obsidianMat);
    rightLeg.position.set(0.15, 0.26, 0);
    figBody.add(rightLeg);
    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.48, 0.24), obsidianMat);
    torso.position.y = 0.75;
    figBody.add(torso);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.26, 0.22), obsidianMat);
    head.position.y = 1.1;
    figBody.add(head);

    const crest = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.35, 4), trimMat);
    crest.position.set(0, 1.32, -0.05);
    crest.rotation.x = -0.3;
    figBody.add(crest);

    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.04, 0.04), toxicGlowMat);
    visor.position.set(0, 1.1, 0.12);
    figBody.add(visor);

    const rifle = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.14, 0.65), gunMetalMat);
    rifle.position.set(0.24, 0.68, 0.35);
    figBody.add(rifle);
    const bayonet = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.08, 0.22), bladeMat);
    bayonet.position.set(0.24, 0.58, 0.65);
    figBody.add(bayonet);
  }
}
