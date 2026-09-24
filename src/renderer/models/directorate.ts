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

/**
 * Builds distinctive Directorate military-industrial figures and combat vehicles:
 * - dir_marshal: Senior officer with peaked cap, greatcoat tails, flak-carapace chestplate, radio backpack with antenna, pistol & power sabre.
 * - dir_shock_troops: Mass infantry with rimmed ballistic helmet, goggles, flak vest, pouches, field backpack, and standard las-rifle.
 * - dir_heavy_ordnance: Heavy support gunners with blast visor, ammo-feeder power backpack, braced twin autocannon on bipod/gun-shield.
 * - dir_sentinel: Bipedal mechanical scout walker with reverse-knee hydraulic legs, enclosed cabin, searchlight, and heavy plasma cannon.
 * - dir_basilisk: Self-propelled tracked siege howitzer with wide continuous tracks, driver cabin, open rear deck, and Earthshaker cannon.
 * - dir_battle_tank: Main battle tank with sloped armor hull, track skirts, rotating turret, long battle cannon with bore evacuator, and sponson bolters.
 */
export function buildDirectorateFigure(
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
  // Directorate Faction Palette Materials (Cached)
  const oliveFatiguesMat = getCachedStandardMaterial({
    color: 0x365314, // Dark olive drab fatigues
    roughness: 0.85,
    metalness: 0.05
  });
  const flakArmorMat = getCachedStandardMaterial({
    color: 0x4d7c0f, // Factory pressed military green flak plate
    roughness: 0.55,
    metalness: 0.25
  });
  const gunMetalMat = getCachedStandardMaterial({
    color: 0x27272a, // Parkerized dark weapon steel
    roughness: 0.45,
    metalness: 0.8
  });
  const brassTrimMat = getCachedStandardMaterial({
    color: 0xd97706, // Polished brass regimental trim & shell casings
    roughness: 0.35,
    metalness: 0.75
  });
  const leatherBrownMat = getCachedStandardMaterial({
    color: 0x451a03, // Combat leather harness and boots
    roughness: 0.9,
    metalness: 0.0
  });
  const plasmaCyanMat = getCachedStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.2,
    metalness: 0.8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.8
  });
  const warmVisorMat = getCachedStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.2,
    emissive: 0xd97706,
    emissiveIntensity: 0.6
  });
  const skinToneMat = getCachedStandardMaterial({
    color: 0xd4a373,
    roughness: 0.8
  });

  // -------------------------------------------------------------
  // 1. FIELD MARSHAL VANCE (dir_marshal) - High Military Commander
  // -------------------------------------------------------------
  if (uType === 'dir_marshal') {
    figBody.scale.set(0.95, 0.95, 0.95);

    // Boots & Legs (Olive fatigues with high leather riding boots)
    const legGeo = getCachedCylinder(0.09, 0.11, 0.55, 14);
    const leftLeg = new THREE.Mesh(legGeo, leatherBrownMat);
    leftLeg.position.set(-0.16, 0.28, 0);
    leftLeg.castShadow = true;
    figBody.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, leatherBrownMat);
    rightLeg.position.set(0.16, 0.28, 0);
    rightLeg.castShadow = true;
    figBody.add(rightLeg);

    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    // Torso with Greatcoat & Flak Carapace Breastplate
    const torso = new THREE.Mesh(getCachedBox(0.42, 0.56, 0.28), oliveFatiguesMat);
    torso.position.y = 0.82;
    torso.castShadow = true;
    figBody.add(torso);

    const breastplate = new THREE.Mesh(getCachedBox(0.36, 0.38, 0.12), flakArmorMat);
    breastplate.position.set(0, 0.86, 0.1);
    figBody.add(breastplate);

    const medalBar = new THREE.Mesh(getCachedBox(0.14, 0.06, 0.04), brassTrimMat);
    medalBar.position.set(-0.08, 0.94, 0.17);
    figBody.add(medalBar);

    // Greatcoat tails
    const coatTails = new THREE.Mesh(getCachedBox(0.44, 0.48, 0.05), oliveFatiguesMat);
    coatTails.position.set(0, 0.48, -0.14);
    coatTails.rotation.x = -0.12;
    figBody.add(coatTails);

    // Epaulets (Gilded regimental shoulder pads)
    const epauletGeo = getCachedBox(0.16, 0.06, 0.22);
    const leftEpaulet = new THREE.Mesh(epauletGeo, brassTrimMat);
    leftEpaulet.position.set(-0.28, 1.05, 0);
    figBody.add(leftEpaulet);

    const rightEpaulet = new THREE.Mesh(epauletGeo, brassTrimMat);
    rightEpaulet.position.set(0.28, 1.05, 0);
    figBody.add(rightEpaulet);

    // Head with Peaked Officer Cap
    const head = new THREE.Mesh(getCachedSphere(0.13, 14, 14), skinToneMat);
    head.position.y = 1.2;
    figBody.add(head);

    const capBase = new THREE.Mesh(getCachedCylinder(0.17, 0.14, 0.12, 16), oliveFatiguesMat);
    capBase.position.set(0, 1.28, 0);
    figBody.add(capBase);

    const capVisor = new THREE.Mesh(getCachedBox(0.18, 0.02, 0.12), gunMetalMat);
    capVisor.position.set(0, 1.24, 0.12);
    capVisor.rotation.x = 0.2;
    figBody.add(capVisor);

    const capInsignia = new THREE.Mesh(getCachedBox(0.06, 0.06, 0.04), brassTrimMat);
    capInsignia.position.set(0, 1.3, 0.13);
    figBody.add(capInsignia);

    // Radio Backpack with Comms Antenna
    const radioPack = new THREE.Mesh(getCachedBox(0.28, 0.38, 0.16), gunMetalMat);
    radioPack.position.set(0, 0.85, -0.2);
    figBody.add(radioPack);

    const antenna = new THREE.Mesh(getCachedCylinder(0.015, 0.015, 0.65, 8), gunMetalMat);
    antenna.position.set(0.1, 1.25, -0.22);
    figBody.add(antenna);

    // Right Arm: Master-Crafted Tactical Bolt Pistol
    const rightArm = new THREE.Mesh(getCachedCylinder(0.06, 0.06, 0.35, 12), oliveFatiguesMat);
    rightArm.position.set(0.3, 0.82, 0.1);
    rightArm.rotation.set(0.4, 0, -0.2);
    figBody.add(rightArm);

    const pistol = new THREE.Mesh(getCachedBox(0.08, 0.14, 0.32), gunMetalMat);
    pistol.position.set(0.34, 0.85, 0.3);
    figBody.add(pistol);

    const pistolGrip = new THREE.Mesh(getCachedBox(0.06, 0.12, 0.08), brassTrimMat);
    pistolGrip.position.set(0.34, 0.76, 0.2);
    figBody.add(pistolGrip);

    // Left Arm: Drawn Power Sabre with Energy Blade
    const leftArm = new THREE.Mesh(getCachedCylinder(0.06, 0.06, 0.35, 12), oliveFatiguesMat);
    leftArm.position.set(-0.3, 0.85, 0.05);
    leftArm.rotation.set(-0.5, 0, 0.3);
    figBody.add(leftArm);

    const sabreHilt = new THREE.Mesh(getCachedCylinder(0.03, 0.03, 0.18, 12), brassTrimMat);
    sabreHilt.position.set(-0.38, 0.72, 0.22);
    sabreHilt.rotation.x = 0.6;
    figBody.add(sabreHilt);

    const sabreBlade = new THREE.Mesh(getCachedBox(0.03, 0.85, 0.08), plasmaCyanMat);
    sabreBlade.position.set(-0.38, 1.15, 0.45);
    sabreBlade.rotation.x = -0.7;
    figBody.add(sabreBlade);
  }

  // -------------------------------------------------------------
  // 2. SHOCK TROOPERS (dir_shock_troops) - Standard Mass Infantry
  // -------------------------------------------------------------
  else if (uType === 'dir_shock_troops') {
    figBody.scale.set(0.88, 0.88, 0.88);

    // Legs with combat trousers and gaiters
    const legGeo = getCachedCylinder(0.085, 0.1, 0.52, 14);
    const leftLeg = new THREE.Mesh(legGeo, oliveFatiguesMat);
    leftLeg.position.set(-0.15, 0.26, 0);
    leftLeg.castShadow = true;
    figBody.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, oliveFatiguesMat);
    rightLeg.position.set(0.15, 0.26, 0);
    rightLeg.castShadow = true;
    figBody.add(rightLeg);

    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    // Torso with Flak Vest & Webbing
    const torso = new THREE.Mesh(getCachedBox(0.4, 0.5, 0.26), oliveFatiguesMat);
    torso.position.y = 0.76;
    torso.castShadow = true;
    figBody.add(torso);

    const flakVest = new THREE.Mesh(getCachedBox(0.38, 0.36, 0.14), flakArmorMat);
    flakVest.position.set(0, 0.8, 0.08);
    figBody.add(flakVest);

    // Ammo Pouches on Belt
    const pouchGeo = getCachedBox(0.1, 0.08, 0.08);
    const p1 = new THREE.Mesh(pouchGeo, leatherBrownMat);
    p1.position.set(-0.12, 0.55, 0.14);
    figBody.add(p1);
    const p2 = new THREE.Mesh(pouchGeo, leatherBrownMat);
    p2.position.set(0.12, 0.55, 0.14);
    figBody.add(p2);

    // Field Backpack / Kit
    const backpack = new THREE.Mesh(getCachedBox(0.32, 0.36, 0.18), oliveFatiguesMat);
    backpack.position.set(0, 0.78, -0.2);
    figBody.add(backpack);

    const bedroll = new THREE.Mesh(getCachedCylinder(0.07, 0.07, 0.34, 14), leatherBrownMat);
    bedroll.position.set(0, 0.98, -0.2);
    bedroll.rotation.z = Math.PI / 2;
    figBody.add(bedroll);

    // Angular Rimmed Ballistic Helmet with Tactical Goggles
    const head = new THREE.Mesh(getCachedSphere(0.12, 14, 14), skinToneMat);
    head.position.y = 1.12;
    figBody.add(head);

    const helmetDome = new THREE.Mesh(getCachedSphere(0.16, 14, 14), flakArmorMat);
    helmetDome.position.set(0, 1.16, 0);
    helmetDome.scale.set(1.05, 0.9, 1.1);
    figBody.add(helmetDome);

    const helmetRim = new THREE.Mesh(getCachedCylinder(0.2, 0.21, 0.04, 16), flakArmorMat);
    helmetRim.position.set(0, 1.12, 0);
    figBody.add(helmetRim);

    const goggles = new THREE.Mesh(getCachedBox(0.18, 0.05, 0.06), warmVisorMat);
    goggles.position.set(0, 1.18, 0.14);
    figBody.add(goggles);

    // Standard Military Las-Rifle held in 2-handed firing stance
    const rifleStock = new THREE.Mesh(getCachedBox(0.06, 0.1, 0.22), leatherBrownMat);
    rifleStock.position.set(0.18, 0.78, 0.12);
    rifleStock.rotation.y = -0.2;
    figBody.add(rifleStock);

    const rifleReceiver = new THREE.Mesh(getCachedBox(0.07, 0.12, 0.36), gunMetalMat);
    rifleReceiver.position.set(0.14, 0.82, 0.32);
    rifleReceiver.rotation.y = -0.2;
    figBody.add(rifleReceiver);

    const rifleBarrel = new THREE.Mesh(getCachedCylinder(0.025, 0.025, 0.38, 12), gunMetalMat);
    rifleBarrel.position.set(0.1, 0.84, 0.62);
    rifleBarrel.rotation.x = Math.PI / 2;
    rifleBarrel.rotation.z = 0.2;
    figBody.add(rifleBarrel);

    const batteryPack = new THREE.Mesh(getCachedBox(0.05, 0.1, 0.08), flakArmorMat);
    batteryPack.position.set(0.14, 0.72, 0.32);
    figBody.add(batteryPack);
  }

  // -------------------------------------------------------------
  // 3. HEAVY ORDNANCE BATTERY (dir_heavy_ordnance) - Autocannon Squad
  // -------------------------------------------------------------
  else if (uType === 'dir_heavy_ordnance') {
    figBody.scale.set(0.92, 0.92, 0.92);

    // Braced heavy gunner legs with heavy knee guards
    const legGeo = getCachedCylinder(0.095, 0.12, 0.54, 14);
    const leftLeg = new THREE.Mesh(legGeo, oliveFatiguesMat);
    leftLeg.position.set(-0.18, 0.27, -0.05);
    leftLeg.castShadow = true;
    figBody.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, oliveFatiguesMat);
    rightLeg.position.set(0.18, 0.27, 0.05);
    rightLeg.castShadow = true;
    figBody.add(rightLeg);

    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    // Heavy reinforced flak chestplate
    const torso = new THREE.Mesh(getCachedBox(0.44, 0.52, 0.3), oliveFatiguesMat);
    torso.position.y = 0.78;
    torso.castShadow = true;
    figBody.add(torso);

    const heavyArmor = new THREE.Mesh(getCachedBox(0.42, 0.4, 0.16), flakArmorMat);
    heavyArmor.position.set(0, 0.82, 0.1);
    figBody.add(heavyArmor);

    // Heavy Ammo Backpack with feed chute
    const ammoPack = new THREE.Mesh(getCachedBox(0.36, 0.44, 0.22), gunMetalMat);
    ammoPack.position.set(0, 0.85, -0.22);
    figBody.add(ammoPack);

    const ammoBelt = new THREE.Mesh(getCachedTorus(0.18, 0.04, 8, 16, Math.PI / 2), brassTrimMat);
    ammoBelt.position.set(0.2, 0.8, -0.05);
    ammoBelt.rotation.y = Math.PI / 2;
    figBody.add(ammoBelt);

    // Blast Visor Helmet with Targeting Optics
    const helmet = new THREE.Mesh(getCachedBox(0.28, 0.28, 0.3), flakArmorMat);
    helmet.position.set(0, 1.15, 0);
    figBody.add(helmet);

    const targetingOptic = new THREE.Mesh(getCachedCylinder(0.04, 0.04, 0.14, 12), warmVisorMat);
    targetingOptic.position.set(0.1, 1.18, 0.16);
    targetingOptic.rotation.x = Math.PI / 2;
    figBody.add(targetingOptic);

    // Braced Twin Autocannon with Gun-Shield
    const gunShield = new THREE.Mesh(getCachedBox(0.5, 0.32, 0.06), flakArmorMat);
    gunShield.position.set(0, 0.75, 0.38);
    figBody.add(gunShield);

    const gunReceiver = new THREE.Mesh(getCachedBox(0.22, 0.18, 0.45), gunMetalMat);
    gunReceiver.position.set(0, 0.82, 0.5);
    figBody.add(gunReceiver);

    const barrel1 = new THREE.Mesh(getCachedCylinder(0.035, 0.035, 0.75, 14), gunMetalMat);
    barrel1.position.set(-0.06, 0.84, 0.95);
    barrel1.rotation.x = Math.PI / 2;
    figBody.add(barrel1);

    const barrel2 = new THREE.Mesh(getCachedCylinder(0.035, 0.035, 0.75, 14), gunMetalMat);
    barrel2.position.set(0.06, 0.84, 0.95);
    barrel2.rotation.x = Math.PI / 2;
    figBody.add(barrel2);

    const muzzle1 = new THREE.Mesh(getCachedBox(0.09, 0.09, 0.12), gunMetalMat);
    muzzle1.position.set(-0.06, 0.84, 1.35);
    figBody.add(muzzle1);

    const muzzle2 = new THREE.Mesh(getCachedBox(0.09, 0.09, 0.12), gunMetalMat);
    muzzle2.position.set(0.06, 0.84, 1.35);
    figBody.add(muzzle2);
  }

  // -------------------------------------------------------------
  // 4. ARMORED SCOUT SENTINEL (dir_sentinel) - Bipedal Recon Walker
  // -------------------------------------------------------------
  else if (uType === 'dir_sentinel') {
    figBody.scale.set(1.15, 1.15, 1.15);

    // Left Mechanical Reverse-Knee Leg Assembly
    const leftLegGroup = new THREE.Group();
    const lUpper = new THREE.Mesh(getCachedCylinder(0.08, 0.08, 0.55, 12), gunMetalMat);
    lUpper.position.set(-0.42, 0.8, -0.1);
    lUpper.rotation.x = -0.4;
    leftLegGroup.add(lUpper);

    const lLower = new THREE.Mesh(getCachedCylinder(0.07, 0.07, 0.65, 12), gunMetalMat);
    lLower.position.set(-0.42, 0.38, 0.08);
    lLower.rotation.x = 0.45;
    leftLegGroup.add(lLower);

    const lFoot = new THREE.Mesh(getCachedBox(0.3, 0.08, 0.42), flakArmorMat);
    lFoot.position.set(-0.42, 0.05, 0.12);
    leftLegGroup.add(lFoot);

    figBody.add(leftLegGroup);

    // Right Mechanical Reverse-Knee Leg Assembly
    const rightLegGroup = new THREE.Group();
    const rUpper = new THREE.Mesh(getCachedCylinder(0.08, 0.08, 0.55, 12), gunMetalMat);
    rUpper.position.set(0.42, 0.8, -0.1);
    rUpper.rotation.x = -0.4;
    rightLegGroup.add(rUpper);

    const rLower = new THREE.Mesh(getCachedCylinder(0.07, 0.07, 0.65, 12), gunMetalMat);
    rLower.position.set(0.42, 0.38, 0.08);
    rLower.rotation.x = 0.45;
    rightLegGroup.add(rLower);

    const rFoot = new THREE.Mesh(getCachedBox(0.3, 0.08, 0.42), flakArmorMat);
    rFoot.position.set(0.42, 0.05, 0.12);
    rightLegGroup.add(rFoot);

    figBody.add(rightLegGroup);

    root.userData.leftLeg = leftLegGroup;
    root.userData.rightLeg = rightLegGroup;

    // Hip Pelvis Joint
    const pelvis = new THREE.Mesh(getCachedBox(0.75, 0.22, 0.45), gunMetalMat);
    pelvis.position.y = 1.05;
    figBody.add(pelvis);

    // Armored Enclosed Cabin & Roll-Cage
    const cabin = new THREE.Mesh(getCachedBox(0.68, 0.72, 0.82), flakArmorMat);
    cabin.position.set(0, 1.45, 0.05);
    figBody.add(cabin);

    // Sloped Frontal Glacis & Armored Vision Slit
    const visorPlate = new THREE.Mesh(getCachedBox(0.52, 0.12, 0.08), warmVisorMat);
    visorPlate.position.set(0, 1.55, 0.48);
    figBody.add(visorPlate);

    // Searchlight
    const lightHousing = new THREE.Mesh(getCachedCylinder(0.1, 0.08, 0.14, 14), gunMetalMat);
    lightHousing.position.set(-0.25, 1.85, 0.38);
    lightHousing.rotation.x = Math.PI / 2;
    figBody.add(lightHousing);

    const lightLens = new THREE.Mesh(getCachedCylinder(0.08, 0.08, 0.02, 14), warmVisorMat);
    lightLens.position.set(-0.25, 1.85, 0.46);
    lightLens.rotation.x = Math.PI / 2;
    figBody.add(lightLens);

    // Comms Whip Antenna
    const ant = new THREE.Mesh(getCachedCylinder(0.015, 0.015, 0.85, 8), gunMetalMat);
    ant.position.set(0.25, 2.1, -0.25);
    figBody.add(ant);

    // Heavy Right-Mounted Plasma Cannon
    const weaponArm = new THREE.Mesh(getCachedBox(0.18, 0.22, 0.65), gunMetalMat);
    weaponArm.position.set(0.48, 1.35, 0.35);
    figBody.add(weaponArm);

    const plasmaBarrel = new THREE.Mesh(getCachedCylinder(0.07, 0.07, 0.65, 14), gunMetalMat);
    plasmaBarrel.position.set(0.48, 1.35, 0.85);
    plasmaBarrel.rotation.x = Math.PI / 2;
    figBody.add(plasmaBarrel);

    const plasmaFins = new THREE.Mesh(getCachedBox(0.14, 0.12, 0.38), plasmaCyanMat);
    plasmaFins.position.set(0.48, 1.42, 0.72);
    figBody.add(plasmaFins);
  }

  // -------------------------------------------------------------
  // 5. BASILISK SIEGE HOWITZER (dir_basilisk) - Heavy Self-Propelled Artillery
  // -------------------------------------------------------------
  else if (uType === 'dir_basilisk') {
    figBody.scale.set(1.4, 1.4, 1.4);

    // Continuous Armored Treads (Left & Right Track Assemblies)
    const trackGeo = getCachedBox(0.38, 0.45, 2.2);
    const leftTrack = new THREE.Mesh(trackGeo, gunMetalMat);
    leftTrack.position.set(-0.85, 0.24, 0);
    figBody.add(leftTrack);

    const rightTrack = new THREE.Mesh(trackGeo, gunMetalMat);
    rightTrack.position.set(0.85, 0.24, 0);
    figBody.add(rightTrack);

    // Road Wheels attached along tracks
    const wheels: THREE.Mesh[] = [];
    const wheelGeo = getCachedCylinder(0.18, 0.18, 0.16, 16);
    const zPositions = [-0.8, -0.4, 0, 0.4, 0.8];
    zPositions.forEach(z => {
      const wLeft = new THREE.Mesh(wheelGeo, gunMetalMat);
      wLeft.position.set(-0.85, 0.2, z);
      wLeft.rotation.z = Math.PI / 2;
      figBody.add(wLeft);
      wheels.push(wLeft);

      const wRight = new THREE.Mesh(wheelGeo, gunMetalMat);
      wRight.position.set(0.85, 0.2, z);
      wRight.rotation.z = Math.PI / 2;
      figBody.add(wRight);
      wheels.push(wRight);
    });

    root.userData.wheels = wheels;
    root.userData.animProfile = 'vehicle_tracked';

    // Track Skirts & Mudguards
    const skirtGeo = getCachedBox(0.06, 0.28, 2.22);
    const lSkirt = new THREE.Mesh(skirtGeo, flakArmorMat);
    lSkirt.position.set(-1.06, 0.32, 0);
    figBody.add(lSkirt);

    const rSkirt = new THREE.Mesh(skirtGeo, flakArmorMat);
    rSkirt.position.set(1.06, 0.32, 0);
    figBody.add(rSkirt);

    // Main Chassis Hull & Forward Driver Cabin
    const hull = new THREE.Mesh(getCachedBox(1.4, 0.48, 1.9), flakArmorMat);
    hull.position.set(0, 0.42, 0);
    figBody.add(hull);

    const driverCabin = new THREE.Mesh(getCachedBox(1.2, 0.38, 0.8), flakArmorMat);
    driverCabin.position.set(0, 0.75, 0.5);
    figBody.add(driverCabin);

    const visionSlit = new THREE.Mesh(getCachedBox(0.6, 0.08, 0.04), warmVisorMat);
    visionSlit.position.set(0, 0.82, 0.91);
    figBody.add(visionSlit);

    // Open Rear Fighting Platform & Gun Shield
    const platform = new THREE.Mesh(getCachedBox(1.3, 0.15, 0.95), gunMetalMat);
    platform.position.set(0, 0.65, -0.45);
    figBody.add(platform);

    const gunShield = new THREE.Mesh(getCachedBox(1.15, 0.75, 0.12), flakArmorMat);
    gunShield.position.set(0, 1.05, -0.2);
    gunShield.rotation.x = -0.25;
    figBody.add(gunShield);

    // Massive Earthshaker Cannon Elevated at 30 Degrees
    const cannonMount = new THREE.Mesh(getCachedCylinder(0.24, 0.24, 0.45, 14), gunMetalMat);
    cannonMount.position.set(0, 0.95, -0.45);
    figBody.add(cannonMount);

    const cannonBreech = new THREE.Mesh(getCachedBox(0.35, 0.4, 0.65), gunMetalMat);
    cannonBreech.position.set(0, 1.15, -0.55);
    cannonBreech.rotation.x = -0.45;
    figBody.add(cannonBreech);

    const cannonBarrel = new THREE.Mesh(getCachedCylinder(0.12, 0.15, 2.1, 16), gunMetalMat);
    cannonBarrel.position.set(0, 1.7, 0.35);
    cannonBarrel.rotation.x = 1.12; // Elevated forward
    figBody.add(cannonBarrel);

    const muzzleBrake = new THREE.Mesh(getCachedCylinder(0.18, 0.18, 0.32, 14), gunMetalMat);
    muzzleBrake.position.set(0, 2.25, 1.25);
    muzzleBrake.rotation.x = 1.12;
    figBody.add(muzzleBrake);

    // Hydraulic Recoil Cylinders
    const cyl1 = new THREE.Mesh(getCachedCylinder(0.05, 0.05, 0.85, 10), brassTrimMat);
    cyl1.position.set(-0.16, 1.35, -0.15);
    cyl1.rotation.x = 1.12;
    figBody.add(cyl1);

    const cyl2 = new THREE.Mesh(getCachedCylinder(0.05, 0.05, 0.85, 10), brassTrimMat);
    cyl2.position.set(0.16, 1.35, -0.15);
    cyl2.rotation.x = 1.12;
    figBody.add(cyl2);
  }

  // -------------------------------------------------------------
  // 6. DIRECTORATE BATTLE TANK (dir_battle_tank) - Main Armored Dominator
  // -------------------------------------------------------------
  else {
    figBody.scale.set(1.4, 1.4, 1.4);

    // Heavy Track Assemblies (Left & Right)
    const trackGeo = getCachedBox(0.42, 0.52, 2.4);
    const leftTrack = new THREE.Mesh(trackGeo, gunMetalMat);
    leftTrack.position.set(-0.95, 0.28, 0);
    figBody.add(leftTrack);

    const rightTrack = new THREE.Mesh(trackGeo, gunMetalMat);
    rightTrack.position.set(0.95, 0.28, 0);
    figBody.add(rightTrack);

    // Road Wheels attached along tracks
    const wheels: THREE.Mesh[] = [];
    const wheelGeo = getCachedCylinder(0.20, 0.20, 0.18, 16);
    const zPositions = [-0.9, -0.45, 0, 0.45, 0.9];
    zPositions.forEach(z => {
      const wLeft = new THREE.Mesh(wheelGeo, gunMetalMat);
      wLeft.position.set(-0.95, 0.22, z);
      wLeft.rotation.z = Math.PI / 2;
      figBody.add(wLeft);
      wheels.push(wLeft);

      const wRight = new THREE.Mesh(wheelGeo, gunMetalMat);
      wRight.position.set(0.95, 0.22, z);
      wRight.rotation.z = Math.PI / 2;
      figBody.add(wRight);
      wheels.push(wRight);
    });

    root.userData.wheels = wheels;
    root.userData.animProfile = 'vehicle_tracked';

    // Sloped Armored Hull
    const hull = new THREE.Mesh(getCachedBox(1.5, 0.55, 2.2), flakArmorMat);
    hull.position.set(0, 0.48, 0);
    figBody.add(hull);

    const glacisPlate = new THREE.Mesh(getCachedBox(1.45, 0.42, 0.45), flakArmorMat);
    glacisPlate.position.set(0, 0.65, 0.95);
    glacisPlate.rotation.x = -0.55;
    figBody.add(glacisPlate);

    // Heavy Side Sponsons with Bolter Pods
    const sponsonGeo = getCachedBox(0.35, 0.38, 0.55);
    const lSponson = new THREE.Mesh(sponsonGeo, flakArmorMat);
    lSponson.position.set(-1.25, 0.55, 0.1);
    figBody.add(lSponson);

    const lGun = new THREE.Mesh(getCachedCylinder(0.04, 0.04, 0.35, 10), gunMetalMat);
    lGun.position.set(-1.42, 0.55, 0.35);
    lGun.rotation.x = Math.PI / 2;
    figBody.add(lGun);

    const rSponson = new THREE.Mesh(sponsonGeo, flakArmorMat);
    rSponson.position.set(1.25, 0.55, 0.1);
    figBody.add(rSponson);

    const rGun = new THREE.Mesh(getCachedCylinder(0.04, 0.04, 0.35, 10), gunMetalMat);
    rGun.position.set(1.42, 0.55, 0.35);
    rGun.rotation.x = Math.PI / 2;
    figBody.add(rGun);

    // Rotating Armored Turret
    const turret = new THREE.Mesh(getCachedBox(1.1, 0.5, 1.2), flakArmorMat);
    turret.position.set(0, 0.95, -0.05);
    figBody.add(turret);

    const commanderCupola = new THREE.Mesh(getCachedCylinder(0.22, 0.22, 0.16, 14), gunMetalMat);
    commanderCupola.position.set(-0.28, 1.25, -0.2);
    figBody.add(commanderCupola);

    // Heavy Battle Cannon with Thermal Sleeve & Bore Evacuator
    const mantlet = new THREE.Mesh(getCachedBox(0.5, 0.32, 0.25), gunMetalMat);
    mantlet.position.set(0, 0.95, 0.6);
    figBody.add(mantlet);

    const barrel1 = new THREE.Mesh(getCachedCylinder(0.1, 0.12, 1.3, 16), gunMetalMat);
    barrel1.position.set(0, 0.95, 1.25);
    barrel1.rotation.x = Math.PI / 2;
    figBody.add(barrel1);

    const boreEvacuator = new THREE.Mesh(getCachedCylinder(0.15, 0.15, 0.38, 16), flakArmorMat);
    boreEvacuator.position.set(0, 0.95, 1.45);
    boreEvacuator.rotation.x = Math.PI / 2;
    figBody.add(boreEvacuator);

    const muzzleMuzzle = new THREE.Mesh(getCachedCylinder(0.12, 0.12, 0.15, 14), gunMetalMat);
    muzzleMuzzle.position.set(0, 0.95, 1.95);
    muzzleMuzzle.rotation.x = Math.PI / 2;
    figBody.add(muzzleMuzzle);

    // Rear Engine Vents & External Fuel Drums
    const vent = new THREE.Mesh(getCachedBox(0.8, 0.1, 0.45), gunMetalMat);
    vent.position.set(0, 0.78, -0.85);
    figBody.add(vent);

    const fuelDrum1 = new THREE.Mesh(getCachedCylinder(0.16, 0.16, 0.45, 14), flakArmorMat);
    fuelDrum1.position.set(-0.4, 0.65, -1.22);
    fuelDrum1.rotation.z = Math.PI / 2;
    figBody.add(fuelDrum1);

    const fuelDrum2 = new THREE.Mesh(getCachedCylinder(0.16, 0.16, 0.45, 14), flakArmorMat);
    fuelDrum2.position.set(0.4, 0.65, -1.22);
    fuelDrum2.rotation.z = Math.PI / 2;
    figBody.add(fuelDrum2);
  }
}
