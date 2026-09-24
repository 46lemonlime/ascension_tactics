import * as THREE from 'three';
import { UnitDef, Team } from '../../data/types';
import {
  getCachedCylinder,
  getCachedSphere,
  getCachedBox,
  getCachedCone,
  getCachedTorus,
  getCachedOctahedron,
  getCachedDodecahedron,
  getCachedStandardMaterial
} from './cache';

/**
 * Builds distinctive Riftborn dimensional entities:
 * - rb_herald: Master of Dimensional Fractures with floating crown of void shards, 4 asymmetrical arms, crystalline Dimensional Blade, swirling warp flux orb, and orbiting spatial rings.
 * - rb_bloodletters: Predatory digitigrade stalkers with razor talons, elongated curved crest, spine spikes, and pulsing Hellblade with void claw.
 * - rb_screamers: Undulating manta-like phase gliders hovering on dimensional currents with glowing underside, tail spikes, and vortex maw.
 * - rb_horrors: Unstable shifting multi-limbed demonic entities with split secondary faces, casting shifting warpfire spheres.
 * - rb_crusher: Quadrupedal heavy dimensional siege juggernaut with tectonic horned crest, massive crystalline horns charged with rift energy.
 * - rb_greater_daemon: Titanic towering Avatar of the Void with massive sweeping jagged void wings, 4 asymmetrical arms with Void Great Cleaver and gravitational singularity.
 */
export function buildRiftbornFigure(
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
  // Riftborn Dimensional Materials (Cached)
  const voidFleshMat = getCachedStandardMaterial({
    color: 0x3b0764, // Deep abyssal purple void matter
    roughness: 0.45,
    metalness: 0.35
  });
  const riftMagentaMat = getCachedStandardMaterial({
    color: 0xf43f5e, // Radiant magenta dimensional fracture
    roughness: 0.15,
    metalness: 0.9,
    emissive: 0xe11d48,
    emissiveIntensity: 0.85
  });
  const crystalShardMat = getCachedStandardMaterial({
    color: 0xec4899, // Translucent pinkish-magenta void crystal
    roughness: 0.1,
    metalness: 0.95,
    emissive: 0xbe185d,
    emissiveIntensity: 0.6
  });
  const boneChitinMat = getCachedStandardMaterial({
    color: 0x1e1b4b, // Indigo-black tectonic bone chitin
    roughness: 0.35,
    metalness: 0.5
  });
  const phaseCyanMat = getCachedStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.1,
    metalness: 0.9,
    emissive: 0x0284c7,
    emissiveIntensity: 0.8
  });
  const darkTendonMat = getCachedStandardMaterial({
    color: 0x18181b,
    roughness: 0.85,
    metalness: 0.1
  });

  // -------------------------------------------------------------
  // 1. RIFT HERALD (rb_herald) - Master of Dimensional Fractures
  // -------------------------------------------------------------
  if (uType === 'rb_herald') {
    figBody.scale.set(1.1, 1.1, 1.1);

    // Undulating Ethereal Tendril Legs / Strands (Floating stance)
    const legGeo = getCachedCylinder(0.06, 0.02, 0.65, 12);
    const leftTendril = new THREE.Mesh(legGeo, riftMagentaMat);
    leftTendril.position.set(-0.16, 0.25, 0);
    leftTendril.rotation.z = -0.2;
    figBody.add(leftTendril);

    const rightTendril = new THREE.Mesh(legGeo, riftMagentaMat);
    rightTendril.position.set(0.16, 0.25, 0);
    rightTendril.rotation.z = 0.2;
    figBody.add(rightTendril);

    root.userData.leftLeg = leftTendril;
    root.userData.rightLeg = rightTendril;

    // Elongated Asymmetrical Torso with Fractured Void Core
    const torso = new THREE.Mesh(getCachedCone(0.32, 0.75, 12), voidFleshMat);
    torso.position.y = 0.85;
    torso.rotation.x = Math.PI; // Inverted demonic cone
    figBody.add(torso);

    const coreFracture = new THREE.Mesh(getCachedOctahedron(0.16), riftMagentaMat);
    coreFracture.position.set(0, 0.85, 0.12);
    figBody.add(coreFracture);

    // Orbiting Spatial Rings (Detached dimensional geometry)
    const ring1 = new THREE.Mesh(getCachedTorus(0.42, 0.025, 10, 24), riftMagentaMat);
    ring1.position.set(0, 0.85, 0);
    ring1.rotation.set(0.6, 0.4, 0);
    figBody.add(ring1);

    const ring2 = new THREE.Mesh(getCachedTorus(0.35, 0.02, 10, 24), crystalShardMat);
    ring2.position.set(0, 0.95, 0);
    ring2.rotation.set(-0.5, 0.8, 0.3);
    figBody.add(ring2);

    // Eyeless Visage & Floating Crown of Void Shards
    const head = new THREE.Mesh(getCachedCone(0.16, 0.45, 10), boneChitinMat);
    head.position.set(0, 1.35, 0.05);
    head.rotation.x = 0.25;
    figBody.add(head);

    const faceRift = new THREE.Mesh(getCachedBox(0.04, 0.25, 0.05), riftMagentaMat);
    faceRift.position.set(0, 1.35, 0.18);
    figBody.add(faceRift);

    // Floating Crown Shards
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const shard = new THREE.Mesh(getCachedCone(0.04, 0.22, 8), crystalShardMat);
      shard.position.set(Math.cos(angle) * 0.25, 1.62, Math.sin(angle) * 0.22);
      shard.rotation.x = Math.sin(angle) * 0.3;
      shard.rotation.z = -Math.cos(angle) * 0.3;
      figBody.add(shard);
    }

    // 4 Asymmetrical Arms:
    // Upper Right Arm: Jagged Crystalline Dimensional Blade
    const uRightArm = new THREE.Mesh(getCachedCylinder(0.045, 0.035, 0.45, 10), voidFleshMat);
    uRightArm.position.set(0.32, 1.05, 0.1);
    uRightArm.rotation.set(0.4, 0, -0.6);
    figBody.add(uRightArm);

    const blade = new THREE.Mesh(getCachedBox(0.05, 1.05, 0.12), crystalShardMat);
    blade.position.set(0.55, 1.25, 0.35);
    blade.rotation.set(-0.5, 0.2, -0.3);
    figBody.add(blade);

    // Upper Left Arm: Channeling Hovering Warp Flux Orb
    const uLeftArm = new THREE.Mesh(getCachedCylinder(0.045, 0.035, 0.45, 10), voidFleshMat);
    uLeftArm.position.set(-0.32, 1.05, 0.1);
    uLeftArm.rotation.set(-0.4, 0, 0.6);
    figBody.add(uLeftArm);

    const fluxOrb = new THREE.Mesh(getCachedSphere(0.14, 14, 14), riftMagentaMat);
    fluxOrb.position.set(-0.52, 1.2, 0.25);
    figBody.add(fluxOrb);

    // Lower Arms (Clawed appendages)
    const lRightArm = new THREE.Mesh(getCachedCylinder(0.035, 0.025, 0.35, 8), darkTendonMat);
    lRightArm.position.set(0.24, 0.72, 0.15);
    lRightArm.rotation.set(0.6, 0, -0.3);
    figBody.add(lRightArm);

    const lLeftArm = new THREE.Mesh(getCachedCylinder(0.035, 0.025, 0.35, 8), darkTendonMat);
    lLeftArm.position.set(-0.24, 0.72, 0.15);
    lLeftArm.rotation.set(0.6, 0, 0.3);
    figBody.add(lLeftArm);
  }

  // -------------------------------------------------------------
  // 2. RIFT STALKERS (rb_bloodletters) - Melee Dimensional Hunters
  // -------------------------------------------------------------
  else if (uType === 'rb_bloodletters') {
    figBody.scale.set(0.95, 0.95, 0.95);

    // Digitigrade (Backwards-Jointed) Predatory Legs with Razor Talons
    const lThigh = new THREE.Mesh(getCachedCylinder(0.09, 0.07, 0.4, 12), voidFleshMat);
    lThigh.position.set(-0.18, 0.45, -0.08);
    lThigh.rotation.x = -0.5;
    figBody.add(lThigh);

    const lShin = new THREE.Mesh(getCachedCylinder(0.065, 0.04, 0.42, 12), voidFleshMat);
    lShin.position.set(-0.18, 0.2, 0.05);
    lShin.rotation.x = 0.55;
    figBody.add(lShin);

    const rThigh = new THREE.Mesh(getCachedCylinder(0.09, 0.07, 0.4, 12), voidFleshMat);
    rThigh.position.set(0.18, 0.45, -0.08);
    rThigh.rotation.x = -0.5;
    figBody.add(rThigh);

    const rShin = new THREE.Mesh(getCachedCylinder(0.065, 0.04, 0.42, 12), voidFleshMat);
    rShin.position.set(0.18, 0.2, 0.05);
    rShin.rotation.x = 0.55;
    figBody.add(rShin);

    root.userData.leftLeg = lThigh;
    root.userData.rightLeg = rThigh;

    // Muscular Hunched Carapace Torso with Spines
    const torso = new THREE.Mesh(getCachedBox(0.38, 0.55, 0.32), voidFleshMat);
    torso.position.set(0, 0.82, 0);
    torso.rotation.x = 0.2;
    figBody.add(torso);

    // Jagged Spine Spikes
    for (let i = 0; i < 4; i++) {
      const spine = new THREE.Mesh(getCachedCone(0.04, 0.3, 8), boneChitinMat);
      spine.position.set(0, 0.65 + i * 0.12, -0.18 - i * 0.03);
      spine.rotation.x = -0.8;
      figBody.add(spine);
    }

    // Elongated Curved Chitinous Crest Head (No eyes, glowing void maw)
    const head = new THREE.Mesh(getCachedCone(0.16, 0.6, 10), boneChitinMat);
    head.position.set(0, 1.25, 0.2);
    head.rotation.x = 0.95; // Slanted backward crest
    figBody.add(head);

    const maw = new THREE.Mesh(getCachedBox(0.14, 0.08, 0.16), riftMagentaMat);
    maw.position.set(0, 1.15, 0.26);
    figBody.add(maw);

    // Right Arm: Pulsing Hellblade Forged from Dimensional Fracture
    const rightArm = new THREE.Mesh(getCachedCylinder(0.06, 0.05, 0.45, 12), voidFleshMat);
    rightArm.position.set(0.28, 0.92, 0.15);
    rightArm.rotation.set(0.4, 0, -0.3);
    figBody.add(rightArm);

    const hellblade = new THREE.Mesh(getCachedBox(0.04, 0.95, 0.14), crystalShardMat);
    hellblade.position.set(0.42, 1.15, 0.45);
    hellblade.rotation.set(-0.6, 0.1, -0.2);
    figBody.add(hellblade);

    // Left Arm: Multi-Jointed Grasping Void Claw
    const leftArm = new THREE.Mesh(getCachedCylinder(0.06, 0.05, 0.45, 12), voidFleshMat);
    leftArm.position.set(-0.28, 0.92, 0.15);
    leftArm.rotation.set(0.6, 0, 0.4);
    figBody.add(leftArm);

    const claw1 = new THREE.Mesh(getCachedCone(0.03, 0.2, 8), crystalShardMat);
    claw1.position.set(-0.4, 0.75, 0.4);
    claw1.rotation.x = 0.8;
    figBody.add(claw1);

    const claw2 = new THREE.Mesh(getCachedCone(0.03, 0.2, 8), crystalShardMat);
    claw2.position.set(-0.35, 0.7, 0.42);
    claw2.rotation.x = 0.8;
    figBody.add(claw2);
  }

  // -------------------------------------------------------------
  // 3. WARP SKIMMERS (rb_screamers) - Manta Phase Gliders
  // -------------------------------------------------------------
  else if (uType === 'rb_screamers') {
    figBody.scale.set(1.05, 1.05, 1.05);

    // Floating stance above base
    figBody.position.y = 0.35;

    // Main Undulating Manta Body
    const bodyGeo = getCachedCylinder(0.12, 0.38, 0.85, 14);
    const body = new THREE.Mesh(bodyGeo, voidFleshMat);
    body.position.set(0, 0.55, 0);
    body.rotation.x = Math.PI / 2;
    body.scale.set(1.4, 1.0, 0.45);
    figBody.add(body);

    // Glowing Underside Ribs
    const underside = new THREE.Mesh(getCachedBox(0.45, 0.08, 0.75), riftMagentaMat);
    underside.position.set(0, 0.48, 0);
    figBody.add(underside);

    // Wide Lateral Wing Blades (Left & Right)
    const wingGeo = getCachedBox(0.85, 0.04, 0.65);
    const leftWing = new THREE.Mesh(wingGeo, crystalShardMat);
    leftWing.position.set(-0.65, 0.55, -0.05);
    leftWing.rotation.set(0, 0.15, -0.18);
    figBody.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeo, crystalShardMat);
    rightWing.position.set(0.65, 0.55, -0.05);
    rightWing.rotation.set(0, -0.15, 0.18);
    figBody.add(rightWing);

    root.userData.leftLeg = leftWing;
    root.userData.rightLeg = rightWing;

    // Segmented Whip-Tail with Sharp Phase Spikes
    const tail1 = new THREE.Mesh(getCachedCylinder(0.06, 0.03, 0.55, 12), voidFleshMat);
    tail1.position.set(0, 0.62, -0.65);
    tail1.rotation.x = 1.35;
    figBody.add(tail1);

    const tail2 = new THREE.Mesh(getCachedCylinder(0.03, 0.015, 0.55, 12), riftMagentaMat);
    tail2.position.set(0, 0.78, -1.1);
    tail2.rotation.x = 1.6;
    figBody.add(tail2);

    const tailSpike = new THREE.Mesh(getCachedCone(0.06, 0.35, 8), crystalShardMat);
    tailSpike.position.set(0, 0.85, -1.45);
    tailSpike.rotation.x = -Math.PI / 2;
    figBody.add(tailSpike);

    // Forward Lamprey Vortex Maw with Barbed Mandibles
    const maw = new THREE.Mesh(getCachedTorus(0.14, 0.04, 10, 20), riftMagentaMat);
    maw.position.set(0, 0.55, 0.45);
    figBody.add(maw);

    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const horn = new THREE.Mesh(getCachedCone(0.03, 0.22, 8), boneChitinMat);
      horn.position.set(Math.cos(angle) * 0.18, 0.55 + Math.sin(angle) * 0.12, 0.48);
      horn.rotation.x = Math.PI / 2;
      horn.rotation.z = angle;
      figBody.add(horn);
    }
  }

  // -------------------------------------------------------------
  // 4. REALITY PHANTOMS (rb_horrors) - Shifting Multi-Limbed Entities
  // -------------------------------------------------------------
  else if (uType === 'rb_horrors') {
    figBody.scale.set(0.85, 0.85, 0.85);

    // Wispy Tapering Leg Tendrils
    const lLeg = new THREE.Mesh(getCachedCone(0.08, 0.55, 10), voidFleshMat);
    lLeg.position.set(-0.14, 0.25, 0);
    lLeg.rotation.x = 0.2;
    figBody.add(lLeg);

    const rLeg = new THREE.Mesh(getCachedCone(0.08, 0.55, 10), voidFleshMat);
    rLeg.position.set(0.14, 0.25, 0);
    rLeg.rotation.x = -0.2;
    figBody.add(rLeg);

    root.userData.leftLeg = lLeg;
    root.userData.rightLeg = rLeg;

    // Amorphous Shifting Torso with Glowing Crystalline Core
    const torso = new THREE.Mesh(getCachedDodecahedron(0.32), voidFleshMat);
    torso.position.y = 0.75;
    figBody.add(torso);

    const core = new THREE.Mesh(getCachedOctahedron(0.18), riftMagentaMat);
    core.position.set(0, 0.75, 0.1);
    figBody.add(core);

    // Primary Head & Secondary Split Demonic Faces
    const mainHead = new THREE.Mesh(getCachedSphere(0.14, 14, 14), boneChitinMat);
    mainHead.position.set(0, 1.15, 0.05);
    figBody.add(mainHead);

    const eyeRift1 = new THREE.Mesh(getCachedSphere(0.04, 10, 10), riftMagentaMat);
    eyeRift1.position.set(-0.06, 1.16, 0.16);
    figBody.add(eyeRift1);

    const eyeRift2 = new THREE.Mesh(getCachedSphere(0.04, 10, 10), riftMagentaMat);
    eyeRift2.position.set(0.06, 1.16, 0.16);
    figBody.add(eyeRift2);

    const sideFace = new THREE.Mesh(getCachedCone(0.1, 0.25, 8), riftMagentaMat);
    sideFace.position.set(0.24, 0.95, 0.12);
    sideFace.rotation.set(0.3, 0.4, -0.6);
    figBody.add(sideFace);

    // Flailing Tendril Arms casting Shifting Warpfire
    const arm1 = new THREE.Mesh(getCachedCylinder(0.04, 0.02, 0.55, 10), riftMagentaMat);
    arm1.position.set(0.35, 0.85, 0.2);
    arm1.rotation.set(0.6, 0, -0.4);
    figBody.add(arm1);

    const fireOrb1 = new THREE.Mesh(getCachedDodecahedron(0.12), crystalShardMat);
    fireOrb1.position.set(0.5, 1.05, 0.42);
    figBody.add(fireOrb1);

    const arm2 = new THREE.Mesh(getCachedCylinder(0.04, 0.02, 0.55, 10), riftMagentaMat);
    arm2.position.set(-0.35, 0.85, 0.2);
    arm2.rotation.set(-0.4, 0, 0.5);
    figBody.add(arm2);

    const fireOrb2 = new THREE.Mesh(getCachedDodecahedron(0.12), phaseCyanMat);
    fireOrb2.position.set(-0.5, 0.95, 0.38);
    figBody.add(fireOrb2);
  }

  // -------------------------------------------------------------
  // 5. BEHEMOTH JUGGERNAUT (rb_crusher) - Quadrupedal Siege Beast
  // -------------------------------------------------------------
  else if (uType === 'rb_crusher') {
    figBody.scale.set(1.2, 1.2, 1.2);

    // Heavy Quadrupedal Pillars (Front & Rear Legs)
    const legGeo = getCachedCylinder(0.14, 0.16, 0.65, 14);
    
    // Front Left & Right (Mapped to main animation pairs)
    const lFrontLeg = new THREE.Mesh(legGeo, boneChitinMat);
    lFrontLeg.position.set(-0.48, 0.32, 0.42);
    figBody.add(lFrontLeg);

    const rFrontLeg = new THREE.Mesh(legGeo, boneChitinMat);
    rFrontLeg.position.set(0.48, 0.32, 0.42);
    figBody.add(rFrontLeg);

    // Rear Left & Right
    const lRearLeg = new THREE.Mesh(legGeo, boneChitinMat);
    lRearLeg.position.set(-0.45, 0.32, -0.48);
    figBody.add(lRearLeg);

    const rRearLeg = new THREE.Mesh(legGeo, boneChitinMat);
    rRearLeg.position.set(0.45, 0.32, -0.48);
    figBody.add(rRearLeg);

    root.userData.leftLeg = lFrontLeg;
    root.userData.rightLeg = rFrontLeg;

    // Massive Muscular / Tectonic Carapace Body
    const body = new THREE.Mesh(getCachedBox(0.85, 0.75, 1.35), voidFleshMat);
    body.position.set(0, 0.78, 0);
    figBody.add(body);

    // Heavy Jagged Spines Venting Void Energy
    for (let i = 0; i < 4; i++) {
      const spineL = new THREE.Mesh(getCachedCone(0.08, 0.5, 8), crystalShardMat);
      spineL.position.set(-0.25, 1.2 + i * 0.05, -0.4 + i * 0.25);
      spineL.rotation.set(-0.3, 0, -0.3);
      figBody.add(spineL);

      const spineR = new THREE.Mesh(getCachedCone(0.08, 0.5, 8), crystalShardMat);
      spineR.position.set(0.25, 1.2 + i * 0.05, -0.4 + i * 0.25);
      spineR.rotation.set(-0.3, 0, 0.3);
      figBody.add(spineR);
    }

    // Heavy Tectonic Horned Crest Head with Massive Twin Crystal Horns
    const head = new THREE.Mesh(getCachedBox(0.48, 0.45, 0.55), boneChitinMat);
    head.position.set(0, 0.88, 0.85);
    head.rotation.x = 0.2;
    figBody.add(head);

    const hornL = new THREE.Mesh(getCachedCone(0.1, 0.95, 12), crystalShardMat);
    hornL.position.set(-0.32, 1.25, 1.15);
    hornL.rotation.set(0.65, -0.2, -0.35);
    figBody.add(hornL);

    const hornR = new THREE.Mesh(getCachedCone(0.1, 0.95, 12), crystalShardMat);
    hornR.position.set(0.32, 1.25, 1.15);
    hornR.rotation.set(0.65, 0.2, 0.35);
    figBody.add(hornR);

    // Glowing Void Maw
    const maw = new THREE.Mesh(getCachedBox(0.3, 0.15, 0.2), riftMagentaMat);
    maw.position.set(0, 0.72, 1.05);
    figBody.add(maw);
  }

  // -------------------------------------------------------------
  // 6. AVATAR OF THE VOID (rb_greater_daemon) - Titanic Rift Manifestation
  // -------------------------------------------------------------
  else {
    figBody.scale.set(1.5, 1.5, 1.5);

    // Titanic Digitigrade Hooved Legs
    const lThigh = new THREE.Mesh(getCachedCylinder(0.18, 0.14, 0.75, 14), voidFleshMat);
    lThigh.position.set(-0.38, 0.65, -0.15);
    lThigh.rotation.x = -0.4;
    figBody.add(lThigh);

    const lShin = new THREE.Mesh(getCachedCylinder(0.14, 0.1, 0.85, 14), boneChitinMat);
    lShin.position.set(-0.38, 0.28, 0.1);
    lShin.rotation.x = 0.45;
    figBody.add(lShin);

    const rThigh = new THREE.Mesh(getCachedCylinder(0.18, 0.14, 0.75, 14), voidFleshMat);
    rThigh.position.set(0.38, 0.65, -0.15);
    rThigh.rotation.x = -0.4;
    figBody.add(rThigh);

    const rShin = new THREE.Mesh(getCachedCylinder(0.14, 0.1, 0.85, 14), boneChitinMat);
    rShin.position.set(0.38, 0.28, 0.1);
    rShin.rotation.x = 0.45;
    figBody.add(rShin);

    root.userData.leftLeg = lThigh;
    root.userData.rightLeg = rThigh;

    // Colossal Muscular Torso & Rift Sternum
    const torso = new THREE.Mesh(getCachedBox(0.85, 1.05, 0.55), voidFleshMat);
    torso.position.set(0, 1.35, 0);
    figBody.add(torso);

    const sternumRift = new THREE.Mesh(getCachedOctahedron(0.28), riftMagentaMat);
    sternumRift.position.set(0, 1.45, 0.28);
    figBody.add(sternumRift);

    // Massive Sweeping Jagged Void Wings
    const wingGeo = getCachedBox(1.8, 1.4, 0.08);
    const lWing = new THREE.Mesh(wingGeo, crystalShardMat);
    lWing.position.set(-1.15, 1.85, -0.45);
    lWing.rotation.set(-0.2, 0.55, 0.35);
    figBody.add(lWing);

    const rWing = new THREE.Mesh(wingGeo, crystalShardMat);
    rWing.position.set(1.15, 1.85, -0.45);
    rWing.rotation.set(-0.2, -0.55, -0.35);
    figBody.add(rWing);

    // Towering Crowned Demonic Head with Sweeping Horns
    const head = new THREE.Mesh(getCachedCone(0.28, 0.8, 12), boneChitinMat);
    head.position.set(0, 2.1, 0.15);
    head.rotation.x = 0.35;
    figBody.add(head);

    const bigHornL = new THREE.Mesh(getCachedCone(0.12, 1.3, 12), boneChitinMat);
    bigHornL.position.set(-0.45, 2.6, 0.1);
    bigHornL.rotation.set(0.3, 0, -0.75);
    figBody.add(bigHornL);

    const bigHornR = new THREE.Mesh(getCachedCone(0.12, 1.3, 12), boneChitinMat);
    bigHornR.position.set(0.45, 2.6, 0.1);
    bigHornR.rotation.set(0.3, 0, 0.75);
    figBody.add(bigHornR);

    // 4 Arms:
    // Upper Right: Colossal Void Great Cleaver
    const uRArm = new THREE.Mesh(getCachedCylinder(0.12, 0.09, 0.75, 12), voidFleshMat);
    uRArm.position.set(0.65, 1.65, 0.2);
    uRArm.rotation.set(0.4, 0, -0.4);
    figBody.add(uRArm);

    const cleaver = new THREE.Mesh(getCachedBox(0.12, 1.85, 0.45), crystalShardMat);
    cleaver.position.set(1.05, 1.95, 0.65);
    cleaver.rotation.set(-0.6, 0.1, -0.2);
    figBody.add(cleaver);

    // Upper Left: Swirling Gravitational Singularity Sphere
    const uLArm = new THREE.Mesh(getCachedCylinder(0.12, 0.09, 0.75, 12), voidFleshMat);
    uLArm.position.set(-0.65, 1.65, 0.2);
    uLArm.rotation.set(-0.4, 0, 0.4);
    figBody.add(uLArm);

    const singularity = new THREE.Mesh(getCachedSphere(0.32, 16, 16), riftMagentaMat);
    singularity.position.set(-1.15, 1.85, 0.55);
    figBody.add(singularity);

    // Lower Arms
    const lRArm = new THREE.Mesh(getCachedCylinder(0.08, 0.06, 0.55, 12), voidFleshMat);
    lRArm.position.set(0.48, 1.15, 0.25);
    lRArm.rotation.set(0.6, 0, -0.2);
    figBody.add(lRArm);

    const lLArm = new THREE.Mesh(getCachedCylinder(0.08, 0.06, 0.55, 12), voidFleshMat);
    lLArm.position.set(-0.48, 1.15, 0.25);
    lLArm.rotation.set(0.6, 0, 0.2);
    figBody.add(lLArm);
  }
}
