import * as THREE from 'three';
import { UnitDef, Team } from '../../data/types';
import {
  getCachedCylinder,
  getCachedSphere,
  getCachedBox,
  getCachedCone,
  getCachedStandardMaterial,
} from './cache';

/**
 * Builds the procedural 3D miniature used for Tyranid-family units.
 *
 * Each Tyranid unit has its own visual construction made from cached
 * Three.js primitive geometries. The resulting meshes are added to
 * `figBody`, while `root.userData` stores animation-relevant parts
 * such as the left and right legs.
 *
 * The model is intentionally procedural rather than loaded from an
 * external GLTF/GLB asset. This keeps the miniatures lightweight and
 * allows faction/unit-specific silhouettes to be constructed directly
 * from the renderer.
 *
 * @param uType        Unit type identifier, e.g. `ty_tyrant`.
 * @param _def         Unit definition.
 * @param _team        Team owning the miniature.
 * @param _isLeader    Whether this miniature is the squad leader.
 * @param figBody      Group containing the visible body geometry.
 * @param root         Root group for the complete miniature.
 * @param armorMat     Primary chitin/armor material.
 * @param trimMat      Secondary carapace/chitin material.
 * @param _darkJointMat Dark joint material reserved for shared builders.
 * @param eyeGlowMat   Material used for glowing eyes and psychic effects.
 */
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
  // ---------------------------------------------------------------------------
  // Shared Tyranid materials
  // ---------------------------------------------------------------------------

  /** Bone-colored material used for claws, horns, teeth, and spines. */
  const boneMat = getCachedStandardMaterial({
    color: 0xf3f4f6,
    roughness: 0.25,
    metalness: 0.1,
  });

  /** Bio-weapon / psychic-energy material with a subtle emissive glow. */
  const bioWeaponMat = getCachedStandardMaterial({
    color: 0x10b981,
    roughness: 0.4,
    emissive: 0x047857,
    emissiveIntensity: 0.35,
  });

  /** Flesh/joint material used for exposed organic areas. */
  const fleshJointMat = getCachedStandardMaterial({
    color: 0x581c87,
    roughness: 0.7,
  });

  // ---------------------------------------------------------------------------
  // Shared helper for quickly creating organic Tyranid model parts.
  // Supports spherical, conical, and cylindrical forms with consistent
  // positioning, scaling, shadows, and automatic attachment to the figure.
  // ---------------------------------------------------------------------------
  const bioPart = (
    position: [number, number, number],
    scale: [number, number, number],
    material: THREE.Material,
    geometry: 'sphere' | 'cone' | 'cylinder' = 'sphere'
  ): THREE.Mesh => {
    const shape = geometry === 'cone'
      ? new THREE.ConeGeometry(1, 2, 8)
      : geometry === 'cylinder'
        ? new THREE.CylinderGeometry(0.7, 1, 2, 8)
        : new THREE.SphereGeometry(1, 10, 8);

    const mesh = new THREE.Mesh(shape, material);
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    figBody.add(mesh);

    return mesh;
  };

  // ===========================================================================
  // TYRANID TYRANT
  // ===========================================================================

  if (uType === 'ty_tyrant') {
    figBody.scale.set(1.36, 1.36, 1.36);

    // -------------------------------------------------------------------------
    // Legs
    // -------------------------------------------------------------------------

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

    // The movement system uses these references for leg animation.
    root.userData.leftLeg = leftThigh;
    root.userData.rightLeg = rightThigh;

    // -------------------------------------------------------------------------
    // Tail
    // -------------------------------------------------------------------------

    const tail1 = new THREE.Mesh(
      getCachedCylinder(0.14, 0.09, 0.6, 12),
      armorMat
    );
    tail1.position.set(0, 0.45, -0.4);
    tail1.rotation.x = -0.9;
    figBody.add(tail1);

    const tail2 = new THREE.Mesh(
      getCachedCylinder(0.09, 0.04, 0.65, 12),
      fleshJointMat
    );
    tail2.position.set(0, 0.22, -0.85);
    tail2.rotation.x = -0.4;
    figBody.add(tail2);

    const tailBlade = new THREE.Mesh(
      getCachedCone(0.08, 0.35, 10),
      boneMat
    );
    tailBlade.position.set(0, 0.18, -1.18);
    tailBlade.rotation.x = 1.2;
    figBody.add(tailBlade);

    // -------------------------------------------------------------------------
    // Thorax and ribs
    // -------------------------------------------------------------------------

    const thoraxGeo = getCachedCone(0.48, 1.0, 14);

    const thorax = new THREE.Mesh(thoraxGeo, trimMat);
    thorax.position.set(0, 0.95, 0);
    thorax.rotation.x = 0.35;
    figBody.add(thorax);

    const ribGeo = getCachedBox(0.44, 0.45, 0.28);

    const rib = new THREE.Mesh(ribGeo, fleshJointMat);
    rib.position.set(0, 0.85, 0.12);
    figBody.add(rib);

    // -------------------------------------------------------------------------
    // Chitinous side structures
    // -------------------------------------------------------------------------

    const chimGeo1 = getCachedCylinder(0.07, 0.04, 0.65, 12);

    const leftChimera1 = new THREE.Mesh(chimGeo1, armorMat);
    leftChimera1.position.set(-0.2, 1.25, -0.22);
    leftChimera1.rotation.set(-0.35, 0, -0.25);
    figBody.add(leftChimera1);

    const rightChimera1 = new THREE.Mesh(chimGeo1, armorMat);
    rightChimera1.position.set(0.2, 1.25, -0.22);
    rightChimera1.rotation.set(-0.35, 0, 0.25);
    figBody.add(rightChimera1);

    const chimGeo2 = getCachedCylinder(0.06, 0.035, 0.45, 12);

    const leftChimera2 = new THREE.Mesh(chimGeo2, armorMat);
    leftChimera2.position.set(-0.16, 0.95, -0.28);
    leftChimera2.rotation.set(-0.45, 0, -0.3);
    figBody.add(leftChimera2);

    const rightChimera2 = new THREE.Mesh(chimGeo2, armorMat);
    rightChimera2.position.set(0.16, 0.95, -0.28);
    rightChimera2.rotation.set(-0.45, 0, 0.3);
    figBody.add(rightChimera2);

    // -------------------------------------------------------------------------
    // Head and crown
    // -------------------------------------------------------------------------

    const headGeo = getCachedCone(0.36, 0.9, 14);

    const head = new THREE.Mesh(headGeo, armorMat);
    head.position.set(0, 1.45, 0.28);
    head.rotation.x = 0.85;
    figBody.add(head);

    const crownCenter = new THREE.Mesh(
      getCachedCone(0.09, 0.55, 10),
      boneMat
    );
    crownCenter.position.set(0, 1.82, 0.35);
    crownCenter.rotation.x = 0.5;
    figBody.add(crownCenter);

    const crownL = new THREE.Mesh(
      getCachedCone(0.07, 0.45, 10),
      boneMat
    );
    crownL.position.set(-0.18, 1.74, 0.28);
    crownL.rotation.set(0.4, 0, -0.35);
    figBody.add(crownL);

    const crownR = new THREE.Mesh(
      getCachedCone(0.07, 0.45, 10),
      boneMat
    );
    crownR.position.set(0.18, 1.74, 0.28);
    crownR.rotation.set(0.4, 0, 0.35);
    figBody.add(crownR);

    // -------------------------------------------------------------------------
    // Eyes
    // -------------------------------------------------------------------------

    const eye1 = new THREE.Mesh(
      getCachedSphere(0.06, 10, 10),
      eyeGlowMat
    );
    eye1.position.set(-0.12, 1.42, 0.52);
    figBody.add(eye1);

    const eye2 = new THREE.Mesh(
      getCachedSphere(0.06, 10, 10),
      eyeGlowMat
    );
    eye2.position.set(0.12, 1.42, 0.52);
    figBody.add(eye2);

    // -------------------------------------------------------------------------
    // Talons
    // -------------------------------------------------------------------------

    const talonGeo = getCachedCone(0.09, 1.35, 10);

    const leftTalon = new THREE.Mesh(talonGeo, boneMat);
    leftTalon.position.set(-0.65, 1.35, 0.4);
    leftTalon.rotation.set(-1.25, 0, 0.45);
    figBody.add(leftTalon);

    const rightTalon = new THREE.Mesh(talonGeo, boneMat);
    rightTalon.position.set(0.65, 1.35, 0.4);
    rightTalon.rotation.set(-1.25, 0, -0.45);
    figBody.add(rightTalon);

    // -------------------------------------------------------------------------
    // Bio-cannon
    // -------------------------------------------------------------------------

    const cannonBody = new THREE.Mesh(
      getCachedCylinder(0.12, 0.14, 1.1, 14),
      fleshJointMat
    );
    cannonBody.position.set(0.25, 0.85, 0.55);
    cannonBody.rotation.x = Math.PI / 2;
    figBody.add(cannonBody);

    const cannonMuzzle = new THREE.Mesh(
      getCachedCone(0.18, 0.45, 12),
      bioWeaponMat
    );
    cannonMuzzle.position.set(0.25, 0.85, 1.15);
    cannonMuzzle.rotation.x = -Math.PI / 2;
    figBody.add(cannonMuzzle);

    const venomSac = new THREE.Mesh(
      getCachedSphere(0.18, 14, 14),
      bioWeaponMat
    );
    venomSac.position.set(0.25, 0.72, 0.3);
    figBody.add(venomSac);

  // ===========================================================================
  // TYRANID WARRIORS
  // ===========================================================================

  } else if (uType === 'ty_warriors') {
    figBody.scale.set(1.05, 1.05, 1.05);

    // -------------------------------------------------------------------------
    // Legs
    // -------------------------------------------------------------------------

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

    // -------------------------------------------------------------------------
    // Tail
    // -------------------------------------------------------------------------

    const tail = new THREE.Mesh(
      getCachedCylinder(0.08, 0.025, 0.8, 12),
      armorMat
    );
    tail.position.set(0, 0.35, -0.45);
    tail.rotation.x = -0.9;
    figBody.add(tail);

    // -------------------------------------------------------------------------
    // Thorax
    // -------------------------------------------------------------------------

    const thorax = new THREE.Mesh(
      getCachedCone(0.36, 0.85, 14),
      trimMat
    );
    thorax.position.set(0, 0.85, 0);
    thorax.rotation.x = 0.4;
    figBody.add(thorax);

    // -------------------------------------------------------------------------
    // Chitin structures
    // -------------------------------------------------------------------------

    const leftChimera = new THREE.Mesh(
      getCachedCylinder(0.05, 0.03, 0.42, 10),
      armorMat
    );
    leftChimera.position.set(-0.14, 1.1, -0.18);
    leftChimera.rotation.set(-0.35, 0, -0.25);
    figBody.add(leftChimera);

    const rightChimera = new THREE.Mesh(
      getCachedCylinder(0.05, 0.03, 0.42, 10),
      armorMat
    );
    rightChimera.position.set(0.14, 1.1, -0.18);
    rightChimera.rotation.set(-0.35, 0, 0.25);
    figBody.add(rightChimera);

    // -------------------------------------------------------------------------
    // Head and horn
    // -------------------------------------------------------------------------

    const head = new THREE.Mesh(
      getCachedCone(0.28, 0.75, 14),
      armorMat
    );
    head.position.set(0, 1.25, 0.22);
    head.rotation.x = 0.8;
    figBody.add(head);

    const warriorHorn = new THREE.Mesh(
      getCachedCone(0.06, 0.4, 10),
      boneMat
    );
    warriorHorn.position.set(0, 1.55, 0.32);
    warriorHorn.rotation.x = 0.5;
    figBody.add(warriorHorn);

    // -------------------------------------------------------------------------
    // Eye
    // -------------------------------------------------------------------------

    const eye = new THREE.Mesh(
      getCachedSphere(0.06, 10, 10),
      eyeGlowMat
    );
    eye.position.set(0, 1.25, 0.42);
    figBody.add(eye);

    // -------------------------------------------------------------------------
    // Talons
    // -------------------------------------------------------------------------

    const talonGeo = getCachedCone(0.06, 0.95, 10);

    const leftTalon = new THREE.Mesh(talonGeo, boneMat);
    leftTalon.position.set(-0.48, 1.05, 0.35);
    leftTalon.rotation.set(-1.1, 0, 0.5);
    figBody.add(leftTalon);

    const rightTalon = new THREE.Mesh(talonGeo, boneMat);
    rightTalon.position.set(0.48, 1.05, 0.35);
    rightTalon.rotation.set(-1.1, 0, -0.5);
    figBody.add(rightTalon);

    // -------------------------------------------------------------------------
    // Bio-spitter
    // -------------------------------------------------------------------------

    const spitter = new THREE.Mesh(
      getCachedCylinder(0.07, 0.09, 0.75, 12),
      bioWeaponMat
    );
    spitter.position.set(0.2, 0.7, 0.4);
    spitter.rotation.x = Math.PI / 2;
    figBody.add(spitter);

  // ===========================================================================
  // GENESTEALERS
  // ===========================================================================

  } else if (uType === 'ty_stealers') {
    figBody.scale.set(0.95, 0.95, 0.95);
    figBody.rotation.x = 0.28;
    figBody.position.z = 0.08;

    // -------------------------------------------------------------------------
    // Legs
    // -------------------------------------------------------------------------

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

    // -------------------------------------------------------------------------
    // Tail
    // -------------------------------------------------------------------------

    const tail = new THREE.Mesh(
      getCachedCylinder(0.06, 0.02, 0.6, 12),
      fleshJointMat
    );
    tail.position.set(0, 0.3, -0.4);
    tail.rotation.x = -1.1;
    figBody.add(tail);

    // -------------------------------------------------------------------------
    // Torso
    // -------------------------------------------------------------------------

    const torso = new THREE.Mesh(
      getCachedCone(0.28, 0.75, 14),
      trimMat
    );
    torso.position.set(0, 0.75, 0);
    torso.rotation.x = 0.55;
    figBody.add(torso);

    // -------------------------------------------------------------------------
    // Skull and jaw
    // -------------------------------------------------------------------------

    const domeSkull = new THREE.Mesh(
      getCachedCone(0.22, 0.85, 14),
      armorMat
    );
    domeSkull.position.set(0, 1.15, 0.28);
    domeSkull.rotation.x = 1.25;
    figBody.add(domeSkull);

    const fangedJaw = new THREE.Mesh(
      getCachedBox(0.16, 0.12, 0.22),
      boneMat
    );
    fangedJaw.position.set(0, 0.95, 0.55);
    figBody.add(fangedJaw);

    // -------------------------------------------------------------------------
    // Eyes
    // -------------------------------------------------------------------------

    const eyeL = new THREE.Mesh(
      getCachedSphere(0.045, 10, 10),
      eyeGlowMat
    );
    eyeL.position.set(-0.09, 1.08, 0.46);
    figBody.add(eyeL);

    const eyeR = new THREE.Mesh(
      getCachedSphere(0.045, 10, 10),
      eyeGlowMat
    );
    eyeR.position.set(0.09, 1.08, 0.46);
    figBody.add(eyeR);

    // -------------------------------------------------------------------------
    // Rending claws
    // -------------------------------------------------------------------------

    const rendGeo = getCachedCone(0.055, 0.85, 10);

    const leftRend1 = new THREE.Mesh(rendGeo, boneMat);
    leftRend1.position.set(-0.45, 0.95, 0.5);
    leftRend1.rotation.set(-1.4, 0, 0.35);
    figBody.add(leftRend1);

    const rightRend1 = new THREE.Mesh(rendGeo, boneMat);
    rightRend1.position.set(0.45, 0.95, 0.5);
    rightRend1.rotation.set(-1.4, 0, -0.35);
    figBody.add(rightRend1);

    const clawGeo2 = getCachedCone(0.045, 0.65, 10);

    const leftRend2 = new THREE.Mesh(clawGeo2, boneMat);
    leftRend2.position.set(-0.35, 0.65, 0.4);
    leftRend2.rotation.set(-1.2, 0, 0.5);
    figBody.add(leftRend2);

    const rightRend2 = new THREE.Mesh(clawGeo2, boneMat);
    rightRend2.position.set(0.35, 0.65, 0.4);
    rightRend2.rotation.set(-1.2, 0, -0.5);
    figBody.add(rightRend2);

  // ===========================================================================
  // BIOVORE
  // ===========================================================================

  } else if (uType === 'ty_biovore') {
    figBody.scale.set(1.25, 1.25, 1.25);
    figBody.position.y = -0.05;

    // -------------------------------------------------------------------------
    // Four legs
    // -------------------------------------------------------------------------

    const frontLegGeo = getCachedCone(0.14, 0.52, 12);

    const frontLeftLeg = new THREE.Mesh(frontLegGeo, armorMat);
    frontLeftLeg.position.set(-0.36, 0.22, 0.22);
    frontLeftLeg.rotation.set(0.3, 0, 0.5);
    figBody.add(frontLeftLeg);

    const frontRightLeg = new THREE.Mesh(frontLegGeo, armorMat);
    frontRightLeg.position.set(0.36, 0.22, 0.22);
    frontRightLeg.rotation.set(0.3, 0, -0.5);
    figBody.add(frontRightLeg);

    const backLeftLeg = new THREE.Mesh(frontLegGeo, armorMat);
    backLeftLeg.position.set(-0.34, 0.2, -0.28);
    backLeftLeg.rotation.set(-0.4, 0, 0.6);
    figBody.add(backLeftLeg);

    const backRightLeg = new THREE.Mesh(frontLegGeo, armorMat);
    backRightLeg.position.set(0.34, 0.2, -0.28);
    backRightLeg.rotation.set(-0.4, 0, -0.6);
    figBody.add(backRightLeg);

    root.userData.leftLeg = frontLeftLeg;
    root.userData.rightLeg = frontRightLeg;

    // -------------------------------------------------------------------------
    // Carapace
    // -------------------------------------------------------------------------

    const carapace = new THREE.Mesh(
      getCachedSphere(0.48, 16, 16),
      trimMat
    );
    carapace.position.set(0, 0.55, 0);
    carapace.scale.set(1.1, 0.8, 1.2);
    figBody.add(carapace);

    // -------------------------------------------------------------------------
    // Spore mortar
    // -------------------------------------------------------------------------

    const mortarBase = new THREE.Mesh(
      getCachedCylinder(0.22, 0.28, 0.75, 14),
      fleshJointMat
    );
    mortarBase.position.set(0, 0.85, -0.08);
    mortarBase.rotation.x = -0.75;
    figBody.add(mortarBase);

    const mortarMuzzle = new THREE.Mesh(
      getCachedCylinder(0.26, 0.2, 0.35, 14),
      bioWeaponMat
    );
    mortarMuzzle.position.set(0, 1.2, -0.32);
    mortarMuzzle.rotation.x = -0.75;
    figBody.add(mortarMuzzle);

    const sporeCore = new THREE.Mesh(
      getCachedSphere(0.16, 14, 14),
      bioWeaponMat
    );
    sporeCore.position.set(0, 1.25, -0.35);
    figBody.add(sporeCore);

    // -------------------------------------------------------------------------
    // Head and eye
    // -------------------------------------------------------------------------

    const head = new THREE.Mesh(
      getCachedCone(0.24, 0.55, 12),
      armorMat
    );
    head.position.set(0, 0.5, 0.42);
    head.rotation.x = 0.5;
    figBody.add(head);

    const eyes = new THREE.Mesh(
      getCachedSphere(0.05, 10, 10),
      eyeGlowMat
    );
    eyes.position.set(0, 0.52, 0.62);
    figBody.add(eyes);

  // ===========================================================================
  // ZOANTHROPE / "ZOETROPE"
  // ===========================================================================

  } else if (uType === 'ty_zootrope') {
    /*
     * The Zoanthrope has a deliberately different silhouette from the
     * ground-based Tyranids above:
     *
     *   - enormous psychic cranium
     *   - small organic body
     *   - no conventional legs
     *   - tapered lower body
     *   - rear carapace plates
     *   - vestigial arms and claws
     *   - visible psychic energy around the head
     *
     * The unit floats rather than standing like a Warrior or Carnifex.
     */

    figBody.scale.set(1.28, 1.28, 1.28);
    figBody.position.y = 0.18;

    // -------------------------------------------------------------------------
    // Lower body / levitation base
    // -------------------------------------------------------------------------

    const lowerBody = new THREE.Mesh(
      getCachedCone(0.22, 0.95, 14),
      fleshJointMat
    );
    lowerBody.position.set(0, 0.42, 0);
    lowerBody.rotation.x = -0.12;
    figBody.add(lowerBody);

    const lowerChitin = new THREE.Mesh(
      getCachedCone(0.28, 0.62, 14),
      trimMat
    );
    lowerChitin.position.set(0, 0.62, -0.02);
    lowerChitin.rotation.x = 0.08;
    figBody.add(lowerChitin);

    // -------------------------------------------------------------------------
    // Rear carapace plates
    // -------------------------------------------------------------------------

    const rearPlateGeo = getCachedCone(0.18, 0.72, 10);

    const rearPlateL = new THREE.Mesh(rearPlateGeo, trimMat);
    rearPlateL.position.set(-0.25, 0.86, -0.2);
    rearPlateL.rotation.set(-0.25, 0.25, 0.65);
    figBody.add(rearPlateL);

    const rearPlateR = new THREE.Mesh(rearPlateGeo, trimMat);
    rearPlateR.position.set(0.25, 0.86, -0.2);
    rearPlateR.rotation.set(-0.25, -0.25, -0.65);
    figBody.add(rearPlateR);

    const rearSpine = new THREE.Mesh(
      getCachedCone(0.1, 0.65, 10),
      boneMat
    );
    rearSpine.position.set(0, 1.0, -0.28);
    rearSpine.rotation.x = -0.35;
    figBody.add(rearSpine);

    // -------------------------------------------------------------------------
    // Vestigial arms
    // -------------------------------------------------------------------------

    const armGeo = getCachedCylinder(0.045, 0.025, 0.55, 10);

    const leftArm = new THREE.Mesh(armGeo, fleshJointMat);
    leftArm.position.set(-0.34, 0.76, 0.12);
    leftArm.rotation.set(0.15, 0, -0.9);
    figBody.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, fleshJointMat);
    rightArm.position.set(0.34, 0.76, 0.12);
    rightArm.rotation.set(0.15, 0, 0.9);
    figBody.add(rightArm);

    // -------------------------------------------------------------------------
    // Small claws
    // -------------------------------------------------------------------------

    const clawGeo = getCachedCone(0.045, 0.34, 8);

    const leftClaw = new THREE.Mesh(clawGeo, boneMat);
    leftClaw.position.set(-0.52, 0.58, 0.16);
    leftClaw.rotation.set(0.15, 0, -1.0);
    figBody.add(leftClaw);

    const rightClaw = new THREE.Mesh(clawGeo, boneMat);
    rightClaw.position.set(0.52, 0.58, 0.16);
    rightClaw.rotation.set(0.15, 0, 1.0);
    figBody.add(rightClaw);

    // -------------------------------------------------------------------------
    // Massive psychic cranium
    // -------------------------------------------------------------------------

    const skull = new THREE.Mesh(
      getCachedSphere(0.52, 18, 16),
      armorMat
    );
    skull.position.set(0, 1.24, 0.18);
    skull.scale.set(0.9, 0.82, 1.38);
    figBody.add(skull);

    // -------------------------------------------------------------------------
    // Lower jaw / facial plate
    // -------------------------------------------------------------------------

    const jaw = new THREE.Mesh(
      getCachedCone(0.22, 0.42, 12),
      fleshJointMat
    );
    jaw.position.set(0, 1.0, 0.52);
    jaw.rotation.x = 0.9;
    jaw.scale.set(0.8, 0.55, 0.7);
    figBody.add(jaw);

    // -------------------------------------------------------------------------
    // Cranial crown
    // -------------------------------------------------------------------------

    const crownCenter = new THREE.Mesh(
      getCachedCone(0.1, 0.62, 10),
      boneMat
    );
    crownCenter.position.set(0, 1.68, 0.08);
    crownCenter.rotation.x = -0.25;
    figBody.add(crownCenter);

    const crownL = new THREE.Mesh(
      getCachedCone(0.075, 0.5, 10),
      boneMat
    );
    crownL.position.set(-0.27, 1.62, 0.04);
    crownL.rotation.set(-0.3, 0, -0.3);
    figBody.add(crownL);

    const crownR = new THREE.Mesh(
      getCachedCone(0.075, 0.5, 10),
      boneMat
    );
    crownR.position.set(0.27, 1.62, 0.04);
    crownR.rotation.set(-0.3, 0, 0.3);
    figBody.add(crownR);

    // -------------------------------------------------------------------------
    // Psychic eyes
    // -------------------------------------------------------------------------

    const eyeL = new THREE.Mesh(
      getCachedSphere(0.075, 12, 12),
      eyeGlowMat
    );
    eyeL.position.set(-0.18, 1.22, 0.67);
    figBody.add(eyeL);

    const eyeR = new THREE.Mesh(
      getCachedSphere(0.075, 12, 12),
      eyeGlowMat
    );
    eyeR.position.set(0.18, 1.22, 0.67);
    figBody.add(eyeR);

    // -------------------------------------------------------------------------
    // Psychic energy around the head
    // -------------------------------------------------------------------------

    const psychicNodeL = new THREE.Mesh(
      getCachedSphere(0.11, 12, 12),
      bioWeaponMat
    );
    psychicNodeL.position.set(-0.48, 1.28, 0.32);
    figBody.add(psychicNodeL);

    const psychicNodeR = new THREE.Mesh(
      getCachedSphere(0.11, 12, 12),
      bioWeaponMat
    );
    psychicNodeR.position.set(0.48, 1.28, 0.32);
    figBody.add(psychicNodeR);

    const psychicCore = new THREE.Mesh(
      getCachedSphere(0.12, 12, 12),
      bioWeaponMat
    );
    psychicCore.position.set(0, 1.05, 0.58);
    figBody.add(psychicCore);

    // Psychic energy beneath the floating body.
    const warpNode = new THREE.Mesh(
      getCachedSphere(0.13, 12, 12),
      bioWeaponMat
    );
    warpNode.position.set(0, 0.08, 0);
    warpNode.scale.set(1.8, 0.45, 1.8);
    figBody.add(warpNode);

  // ===========================================================================
  // CARNIFEX
  // ===========================================================================

  } else if (uType === 'ty_carnifex') {
    figBody.scale.set(1.6, 1.6, 1.6);
    figBody.position.z = 0.1;

    // -------------------------------------------------------------------------
    // Legs
    // -------------------------------------------------------------------------

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

    // -------------------------------------------------------------------------
    // Shins
    // -------------------------------------------------------------------------

    const shinGeo = getCachedCylinder(0.16, 0.12, 0.55, 12);

    const leftShin = new THREE.Mesh(shinGeo, fleshJointMat);
    leftShin.position.set(-0.4, 0.18, 0.08);
    leftShin.rotation.x = 0.4;
    figBody.add(leftShin);

    const rightShin = new THREE.Mesh(shinGeo, fleshJointMat);
    rightShin.position.set(0.4, 0.18, 0.08);
    rightShin.rotation.x = 0.4;
    figBody.add(rightShin);

    // -------------------------------------------------------------------------
    // Tail
    // -------------------------------------------------------------------------

    const tail = new THREE.Mesh(
      getCachedCylinder(0.16, 0.06, 0.85, 12),
      armorMat
    );
    tail.position.set(0, 0.4, -0.55);
    tail.rotation.x = -0.8;
    figBody.add(tail);

    const tailClub = new THREE.Mesh(
      getCachedSphere(0.15, 12, 12),
      boneMat
    );
    tailClub.position.set(0, 0.18, -0.95);
    figBody.add(tailClub);

    // -------------------------------------------------------------------------
    // Carapace
    // -------------------------------------------------------------------------

    const carapace = new THREE.Mesh(
      getCachedSphere(0.55, 16, 16),
      trimMat
    );
    carapace.position.set(0, 0.95, 0.05);
    carapace.scale.set(1.2, 0.95, 1.35);
    figBody.add(carapace);

    // Three dorsal ridges.
    for (let r = -1; r <= 1; r++) {
      const ridge = new THREE.Mesh(
        getCachedCone(0.08, 0.35, 10),
        boneMat
      );
      ridge.position.set(r * 0.22, 1.45, -0.15);
      ridge.rotation.x = -0.5;
      figBody.add(ridge);
    }

    // -------------------------------------------------------------------------
    // Head
    // -------------------------------------------------------------------------

    const head = new THREE.Mesh(
      getCachedBox(0.48, 0.42, 0.55),
      armorMat
    );
    head.position.set(0, 1.05, 0.45);
    head.rotation.x = 0.2;
    figBody.add(head);

    const plasmaGlow = new THREE.Mesh(
      getCachedSphere(0.14, 14, 14),
      bioWeaponMat
    );
    plasmaGlow.position.set(0, 0.98, 0.72);
    figBody.add(plasmaGlow);

    // -------------------------------------------------------------------------
    // Tusks
    // -------------------------------------------------------------------------

    const leftTusk = new THREE.Mesh(
      getCachedCone(0.07, 0.45, 10),
      boneMat
    );
    leftTusk.position.set(-0.25, 0.92, 0.7);
    leftTusk.rotation.set(0.3, 0, -0.4);
    figBody.add(leftTusk);

    const rightTusk = new THREE.Mesh(
      getCachedCone(0.07, 0.45, 10),
      boneMat
    );
    rightTusk.position.set(0.25, 0.92, 0.7);
    rightTusk.rotation.set(0.3, 0, 0.4);
    figBody.add(rightTusk);

    // -------------------------------------------------------------------------
    // Large talons
    // -------------------------------------------------------------------------

    const bigTalonGeo = getCachedCone(0.12, 1.45, 10);

    const leftBigTalon = new THREE.Mesh(bigTalonGeo, boneMat);
    leftBigTalon.position.set(-0.75, 1.25, 0.45);
    leftBigTalon.rotation.set(-1.25, 0, 0.45);
    figBody.add(leftBigTalon);

    const rightBigTalon = new THREE.Mesh(bigTalonGeo, boneMat);
    rightBigTalon.position.set(0.75, 1.25, 0.45);
    rightBigTalon.rotation.set(-1.25, 0, -0.45);
    figBody.add(rightBigTalon);

    // -------------------------------------------------------------------------
    // Secondary talons
    // -------------------------------------------------------------------------

    const medTalonGeo = getCachedCone(0.09, 1.15, 10);

    const leftMediumTalon = new THREE.Mesh(medTalonGeo, boneMat);
    leftMediumTalon.position.set(-0.65, 0.75, 0.4);
    leftMediumTalon.rotation.set(-1.1, 0, 0.35);
    figBody.add(leftMediumTalon);

    const rightMediumTalon = new THREE.Mesh(medTalonGeo, boneMat);
    rightMediumTalon.position.set(0.65, 0.75, 0.4);
    rightMediumTalon.rotation.set(-1.1, 0, -0.35);
    figBody.add(rightMediumTalon);
  
  
  // ===========================================================================
  // LICTOR
  // ===========================================================================

  } else if (uType === 'ty_lictor') {
    figBody.scale.set(1.12, 1.12, 1.12);
    figBody.rotation.x = 0.12;
    figBody.position.z = 0.08;

    // -------------------------------------------------------------------------
    // Legs
    // -------------------------------------------------------------------------

    const thighGeo = getCachedCone(0.14, 0.62, 12);

    const leftLeg = new THREE.Mesh(thighGeo, armorMat);
    leftLeg.position.set(-0.25, 0.32, -0.14);
    leftLeg.rotation.set(-0.45, 0, 0.3);
    figBody.add(leftLeg);

    const rightLeg = new THREE.Mesh(thighGeo, armorMat);
    rightLeg.position.set(0.25, 0.32, -0.14);
    rightLeg.rotation.set(-0.45, 0, -0.3);
    figBody.add(rightLeg);

    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    // -------------------------------------------------------------------------
    // Tail
    // -------------------------------------------------------------------------

    const tail = new THREE.Mesh(
      getCachedCylinder(0.08, 0.025, 0.85, 12),
      fleshJointMat
    );
    tail.position.set(0, 0.4, -0.48);
    tail.rotation.x = -0.95;
    figBody.add(tail);

    // -------------------------------------------------------------------------
    // Torso and carapace
    // -------------------------------------------------------------------------

    const torso = new THREE.Mesh(
      getCachedCone(0.34, 0.9, 14),
      trimMat
    );
    torso.position.set(0, 0.82, 0);
    torso.rotation.x = 0.45;
    figBody.add(torso);

    const carapace = new THREE.Mesh(
      getCachedSphere(0.34, 14, 14),
      armorMat
    );
    carapace.position.set(0, 0.98, -0.16);
    carapace.scale.set(1.15, 0.85, 1.25);
    figBody.add(carapace);

    // -------------------------------------------------------------------------
    // Head
    // -------------------------------------------------------------------------

    const head = new THREE.Mesh(
      getCachedCone(0.26, 0.78, 14),
      armorMat
    );
    head.position.set(0, 1.32, 0.28);
    head.rotation.x = 0.95;
    figBody.add(head);

    const headBlade = new THREE.Mesh(
      getCachedCone(0.07, 0.55, 10),
      boneMat
    );
    headBlade.position.set(0, 1.62, 0.18);
    headBlade.rotation.x = 0.15;
    figBody.add(headBlade);

    // -------------------------------------------------------------------------
    // Eyes
    // -------------------------------------------------------------------------

    const eyeL = new THREE.Mesh(
      getCachedSphere(0.05, 10, 10),
      eyeGlowMat
    );
    eyeL.position.set(-0.1, 1.29, 0.48);
    figBody.add(eyeL);

    const eyeR = new THREE.Mesh(
      getCachedSphere(0.05, 10, 10),
      eyeGlowMat
    );
    eyeR.position.set(0.1, 1.29, 0.48);
    figBody.add(eyeR);

    // -------------------------------------------------------------------------
    // Lictor scything claws
    // -------------------------------------------------------------------------

    const clawGeo = getCachedCone(0.065, 1.25, 10);

    const leftClaw = new THREE.Mesh(clawGeo, boneMat);
    leftClaw.position.set(-0.58, 1.05, 0.34);
    leftClaw.rotation.set(-1.3, 0, 0.48);
    figBody.add(leftClaw);

    const rightClaw = new THREE.Mesh(clawGeo, boneMat);
    rightClaw.position.set(0.58, 1.05, 0.34);
    rightClaw.rotation.set(-1.3, 0, -0.48);
    figBody.add(rightClaw);

    // -------------------------------------------------------------------------
    // Flesh hooks
    // -------------------------------------------------------------------------

    const hookGeo = getCachedCone(0.045, 0.48, 10);

    const leftHook = new THREE.Mesh(hookGeo, boneMat);
    leftHook.position.set(-0.18, 1.0, 0.48);
    leftHook.rotation.set(-1.0, 0, 0.25);
    figBody.add(leftHook);

    const rightHook = new THREE.Mesh(hookGeo, boneMat);
    rightHook.position.set(0.18, 1.0, 0.48);
    rightHook.rotation.set(-1.0, 0, -0.25);
    figBody.add(rightHook);

  // ===========================================================================
  // HIVE GUARD
  // ===========================================================================

  } else if (uType === 'ty_hive_guard') {
    figBody.scale.set(1.28, 1.28, 1.28);
    figBody.position.z = -0.02;

    // -------------------------------------------------------------------------
    // Legs
    // -------------------------------------------------------------------------

    const legGeo = getCachedCone(0.16, 0.58, 12);

    const leftLeg = new THREE.Mesh(legGeo, armorMat);
    leftLeg.position.set(-0.3, 0.28, -0.12);
    leftLeg.rotation.set(-0.25, 0, 0.25);
    figBody.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, armorMat);
    rightLeg.position.set(0.3, 0.28, -0.12);
    rightLeg.rotation.set(-0.25, 0, -0.25);
    figBody.add(rightLeg);

    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    // -------------------------------------------------------------------------
    // Heavy body
    // -------------------------------------------------------------------------

    const body = new THREE.Mesh(
      getCachedSphere(0.46, 16, 16),
      armorMat
    );
    body.position.set(0, 0.7, 0);
    body.scale.set(1.05, 0.9, 1.1);
    figBody.add(body);

    const carapace = new THREE.Mesh(
      getCachedSphere(0.42, 14, 14),
      trimMat
    );
    carapace.position.set(0, 0.9, -0.16);
    carapace.scale.set(1.2, 0.8, 1.25);
    figBody.add(carapace);

    // -------------------------------------------------------------------------
    // Head
    // -------------------------------------------------------------------------

    const head = new THREE.Mesh(
      getCachedCone(0.27, 0.62, 12),
      armorMat
    );
    head.position.set(0, 1.15, 0.3);
    head.rotation.x = 0.8;
    figBody.add(head);

    const eye = new THREE.Mesh(
      getCachedSphere(0.055, 10, 10),
      eyeGlowMat
    );
    eye.position.set(0, 1.13, 0.48);
    figBody.add(eye);

    // -------------------------------------------------------------------------
    // Impaler cannon
    // -------------------------------------------------------------------------

    const cannonBody = new THREE.Mesh(
      getCachedCylinder(0.13, 0.16, 1.0, 14),
      fleshJointMat
    );
    cannonBody.position.set(0.28, 0.78, 0.38);
    cannonBody.rotation.x = Math.PI / 2;
    figBody.add(cannonBody);

    const cannonMuzzle = new THREE.Mesh(
      getCachedCone(0.15, 0.48, 12),
      bioWeaponMat
    );
    cannonMuzzle.position.set(0.28, 0.78, 0.92);
    cannonMuzzle.rotation.x = -Math.PI / 2;
    figBody.add(cannonMuzzle);

    // -------------------------------------------------------------------------
    // Guard claws
    // -------------------------------------------------------------------------

    const clawGeo = getCachedCone(0.075, 0.8, 10);

    const leftClaw = new THREE.Mesh(clawGeo, boneMat);
    leftClaw.position.set(-0.48, 0.88, 0.38);
    leftClaw.rotation.set(-1.2, 0, 0.4);
    figBody.add(leftClaw);

    const rightClaw = new THREE.Mesh(clawGeo, boneMat);
    rightClaw.position.set(0.48, 0.88, 0.38);
    rightClaw.rotation.set(-1.2, 0, -0.4);
    figBody.add(rightClaw);

  // ===========================================================================
  // RAVENERS
  // ===========================================================================

  } else if (uType === 'ty_raveners') {
    figBody.scale.set(1.08, 1.08, 1.08);
    figBody.rotation.x = 0.16;
    figBody.position.z = 0.05;

    // -------------------------------------------------------------------------
    // Serpentine lower body
    // -------------------------------------------------------------------------

    const lowerBody = new THREE.Mesh(
      getCachedCone(0.2, 0.9, 12),
      fleshJointMat
    );
    lowerBody.position.set(0, 0.42, -0.02);
    lowerBody.rotation.x = -0.15;
    figBody.add(lowerBody);

    const abdomen = new THREE.Mesh(
      getCachedCone(0.3, 0.78, 14),
      trimMat
    );
    abdomen.position.set(0, 0.78, 0.02);
    abdomen.rotation.x = 0.45;
    figBody.add(abdomen);

    // -------------------------------------------------------------------------
    // Tail
    // -------------------------------------------------------------------------

    const tail = new THREE.Mesh(
      getCachedCylinder(0.1, 0.025, 0.95, 12),
      armorMat
    );
    tail.position.set(0, 0.42, -0.5);
    tail.rotation.x = -0.9;
    figBody.add(tail);

    const tailTip = new THREE.Mesh(
      getCachedCone(0.07, 0.35, 10),
      boneMat
    );
    tailTip.position.set(0, 0.16, -0.95);
    tailTip.rotation.x = 1.1;
    figBody.add(tailTip);

    // -------------------------------------------------------------------------
    // Head
    // -------------------------------------------------------------------------

    const head = new THREE.Mesh(
      getCachedCone(0.25, 0.72, 14),
      armorMat
    );
    head.position.set(0, 1.2, 0.3);
    head.rotation.x = 0.9;
    figBody.add(head);

    const jaw = new THREE.Mesh(
      getCachedBox(0.18, 0.12, 0.24),
      boneMat
    );
    jaw.position.set(0, 0.99, 0.54);
    figBody.add(jaw);

    // -------------------------------------------------------------------------
    // Eyes
    // -------------------------------------------------------------------------

    const eyeL = new THREE.Mesh(
      getCachedSphere(0.045, 10, 10),
      eyeGlowMat
    );
    eyeL.position.set(-0.09, 1.17, 0.47);
    figBody.add(eyeL);

    const eyeR = new THREE.Mesh(
      getCachedSphere(0.045, 10, 10),
      eyeGlowMat
    );
    eyeR.position.set(0.09, 1.17, 0.47);
    figBody.add(eyeR);

    // -------------------------------------------------------------------------
    // Rending claws
    // -------------------------------------------------------------------------

    const clawGeo = getCachedCone(0.06, 1.0, 10);

    const leftClaw = new THREE.Mesh(clawGeo, boneMat);
    leftClaw.position.set(-0.48, 0.92, 0.45);
    leftClaw.rotation.set(-1.35, 0, 0.45);
    figBody.add(leftClaw);

    const rightClaw = new THREE.Mesh(clawGeo, boneMat);
    rightClaw.position.set(0.48, 0.92, 0.45);
    rightClaw.rotation.set(-1.35, 0, -0.45);
    figBody.add(rightClaw);

    // -------------------------------------------------------------------------
    // Secondary claws
    // -------------------------------------------------------------------------

    const secondaryClawGeo = getCachedCone(0.045, 0.7, 10);

    const leftSecondaryClaw = new THREE.Mesh(
      secondaryClawGeo,
      boneMat
    );
    leftSecondaryClaw.position.set(-0.34, 0.65, 0.42);
    leftSecondaryClaw.rotation.set(-1.15, 0, 0.5);
    figBody.add(leftSecondaryClaw);

    const rightSecondaryClaw = new THREE.Mesh(
      secondaryClawGeo,
      boneMat
    );
    rightSecondaryClaw.position.set(0.34, 0.65, 0.42);
    rightSecondaryClaw.rotation.set(-1.15, 0, -0.5);
    figBody.add(rightSecondaryClaw);

  // ===========================================================================
  // GARGOYLES
  // ===========================================================================

  } else if (uType === 'ty_gargoyles') {
    figBody.scale.set(0.82, 0.82, 0.82);
    figBody.position.y = 0.12;

    // -------------------------------------------------------------------------
    // Legs
    // -------------------------------------------------------------------------

    const legGeo = getCachedCone(0.09, 0.42, 10);

    const leftLeg = new THREE.Mesh(legGeo, armorMat);
    leftLeg.position.set(-0.18, 0.22, -0.08);
    leftLeg.rotation.set(-0.25, 0, 0.18);
    figBody.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, armorMat);
    rightLeg.position.set(0.18, 0.22, -0.08);
    rightLeg.rotation.set(-0.25, 0, -0.18);
    figBody.add(rightLeg);

    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    // -------------------------------------------------------------------------
    // Body
    // -------------------------------------------------------------------------

    const body = new THREE.Mesh(
      getCachedCone(0.24, 0.62, 12),
      trimMat
    );
    body.position.set(0, 0.62, 0);
    body.rotation.x = 0.35;
    figBody.add(body);

    // -------------------------------------------------------------------------
    // Wings
    // -------------------------------------------------------------------------

    const wingGeo = getCachedCone(0.055, 0.8, 8);

    const leftWing = new THREE.Mesh(wingGeo, armorMat);
    leftWing.position.set(-0.38, 0.82, -0.05);
    leftWing.rotation.set(0.15, 0, -1.0);
    figBody.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeo, armorMat);
    rightWing.position.set(0.38, 0.82, -0.05);
    rightWing.rotation.set(0.15, 0, 1.0);
    figBody.add(rightWing);

    const wingTipGeo = getCachedCone(0.035, 0.58, 8);

    const leftWingTip = new THREE.Mesh(wingTipGeo, trimMat);
    leftWingTip.position.set(-0.68, 1.02, -0.1);
    leftWingTip.rotation.set(0.2, 0, -1.15);
    figBody.add(leftWingTip);

    const rightWingTip = new THREE.Mesh(wingTipGeo, trimMat);
    rightWingTip.position.set(0.68, 1.02, -0.1);
    rightWingTip.rotation.set(0.2, 0, 1.15);
    figBody.add(rightWingTip);

    // -------------------------------------------------------------------------
    // Head
    // -------------------------------------------------------------------------

    const head = new THREE.Mesh(
      getCachedCone(0.19, 0.55, 12),
      armorMat
    );
    head.position.set(0, 0.98, 0.24);
    head.rotation.x = 0.85;
    figBody.add(head);

    const eye = new THREE.Mesh(
      getCachedSphere(0.045, 10, 10),
      eyeGlowMat
    );
    eye.position.set(0, 0.98, 0.4);
    figBody.add(eye);

    // -------------------------------------------------------------------------
    // Bio-weapon
    // -------------------------------------------------------------------------

    const bioWeapon = new THREE.Mesh(
      getCachedCylinder(0.06, 0.08, 0.5, 10),
      bioWeaponMat
    );
    bioWeapon.position.set(0.18, 0.62, 0.34);
    bioWeapon.rotation.x = Math.PI / 2;
    figBody.add(bioWeapon);

    // -------------------------------------------------------------------------
    // Claws
    // -------------------------------------------------------------------------

    const clawGeo = getCachedCone(0.045, 0.55, 8);

    const leftClaw = new THREE.Mesh(clawGeo, boneMat);
    leftClaw.position.set(-0.3, 0.55, 0.32);
    leftClaw.rotation.set(-1.0, 0, 0.4);
    figBody.add(leftClaw);

    const rightClaw = new THREE.Mesh(clawGeo, boneMat);
    rightClaw.position.set(0.3, 0.55, 0.32);
    rightClaw.rotation.set(-1.0, 0, -0.4);
    figBody.add(rightClaw);

  // ===========================================================================
  // TYRANNOFEX
  // ===========================================================================

  } else if (uType === 'ty_tyrannofex') {
    figBody.scale.set(1.82, 1.82, 1.82);
    figBody.position.z = 0.12;

    // -------------------------------------------------------------------------
    // Heavy legs
    // -------------------------------------------------------------------------

    const thighGeo = getCachedCone(0.28, 0.82, 14);

    const leftLeg = new THREE.Mesh(thighGeo, armorMat);
    leftLeg.position.set(-0.42, 0.46, -0.18);
    leftLeg.rotation.set(-0.35, 0, 0.25);
    figBody.add(leftLeg);

    const rightLeg = new THREE.Mesh(thighGeo, armorMat);
    rightLeg.position.set(0.42, 0.46, -0.18);
    rightLeg.rotation.set(-0.35, 0, -0.25);
    figBody.add(rightLeg);

    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    // -------------------------------------------------------------------------
    // Shins
    // -------------------------------------------------------------------------

    const shinGeo = getCachedCylinder(0.18, 0.13, 0.62, 12);

    const leftShin = new THREE.Mesh(shinGeo, fleshJointMat);
    leftShin.position.set(-0.48, 0.2, 0.06);
    leftShin.rotation.x = 0.35;
    figBody.add(leftShin);

    const rightShin = new THREE.Mesh(shinGeo, fleshJointMat);
    rightShin.position.set(0.48, 0.2, 0.06);
    rightShin.rotation.x = 0.35;
    figBody.add(rightShin);

    // -------------------------------------------------------------------------
    // Tail
    // -------------------------------------------------------------------------

    const tail = new THREE.Mesh(
      getCachedCylinder(0.2, 0.07, 1.0, 12),
      armorMat
    );
    tail.position.set(0, 0.45, -0.68);
    tail.rotation.x = -0.75;
    figBody.add(tail);

    const tailClub = new THREE.Mesh(
      getCachedSphere(0.2, 12, 12),
      boneMat
    );
    tailClub.position.set(0, 0.18, -1.15);
    figBody.add(tailClub);

    // -------------------------------------------------------------------------
    // Massive carapace
    // -------------------------------------------------------------------------

    const carapace = new THREE.Mesh(
      getCachedSphere(0.7, 18, 18),
      trimMat
    );
    carapace.position.set(0, 1.0, -0.02);
    carapace.scale.set(1.3, 0.95, 1.45);
    figBody.add(carapace);

    // Dorsal armor ridges.
    for (let r = -2; r <= 2; r++) {
      const ridge = new THREE.Mesh(
        getCachedCone(0.09, 0.48, 10),
        boneMat
      );
      ridge.position.set(r * 0.2, 1.55, -0.18);
      ridge.rotation.x = -0.45;
      figBody.add(ridge);
    }

    // -------------------------------------------------------------------------
    // Head
    // -------------------------------------------------------------------------

    const head = new THREE.Mesh(
      getCachedBox(0.58, 0.5, 0.68),
      armorMat
    );
    head.position.set(0, 1.08, 0.55);
    head.rotation.x = 0.18;
    figBody.add(head);

    const jaw = new THREE.Mesh(
      getCachedBox(0.34, 0.2, 0.28),
      fleshJointMat
    );
    jaw.position.set(0, 0.88, 0.76);
    figBody.add(jaw);

    // -------------------------------------------------------------------------
    // Bio-cannon
    // -------------------------------------------------------------------------

    const cannonBody = new THREE.Mesh(
      getCachedCylinder(0.2, 0.25, 1.35, 16),
      fleshJointMat
    );
    cannonBody.position.set(0.34, 0.98, 0.65);
    cannonBody.rotation.x = Math.PI / 2;
    figBody.add(cannonBody);

    const cannonMuzzle = new THREE.Mesh(
      getCachedCone(0.28, 0.58, 14),
      bioWeaponMat
    );
    cannonMuzzle.position.set(0.34, 0.98, 1.35);
    cannonMuzzle.rotation.x = -Math.PI / 2;
    figBody.add(cannonMuzzle);

    const bioCore = new THREE.Mesh(
      getCachedSphere(0.22, 14, 14),
      bioWeaponMat
    );
    bioCore.position.set(0.34, 0.83, 0.52);
    figBody.add(bioCore);

    // -------------------------------------------------------------------------
    // Eyes
    // -------------------------------------------------------------------------

    const eyeL = new THREE.Mesh(
      getCachedSphere(0.065, 10, 10),
      eyeGlowMat
    );
    eyeL.position.set(-0.17, 1.08, 0.82);
    figBody.add(eyeL);

    const eyeR = new THREE.Mesh(
      getCachedSphere(0.065, 10, 10),
      eyeGlowMat
    );
    eyeR.position.set(0.17, 1.08, 0.82);
    figBody.add(eyeR);

    // -------------------------------------------------------------------------
    // Crushing claws
    // -------------------------------------------------------------------------

    const clawGeo = getCachedCone(0.14, 1.55, 10);

    const leftClaw = new THREE.Mesh(clawGeo, boneMat);
    leftClaw.position.set(-0.82, 1.18, 0.5);
    leftClaw.rotation.set(-1.22, 0, 0.42);
    figBody.add(leftClaw);

    const rightClaw = new THREE.Mesh(clawGeo, boneMat);
    rightClaw.position.set(0.82, 1.18, 0.5);
    rightClaw.rotation.set(-1.22, 0, -0.42);
    figBody.add(rightClaw);

    // -------------------------------------------------------------------------
    // Secondary claws
    // -------------------------------------------------------------------------

    const secondaryClawGeo = getCachedCone(0.1, 1.2, 10);

    const leftSecondaryClaw = new THREE.Mesh(
      secondaryClawGeo,
      boneMat
    );
    leftSecondaryClaw.position.set(-0.7, 0.78, 0.48);
    leftSecondaryClaw.rotation.set(-1.05, 0, 0.35);
    figBody.add(leftSecondaryClaw);

    const rightSecondaryClaw = new THREE.Mesh(
      secondaryClawGeo,
      boneMat
    );
    rightSecondaryClaw.position.set(0.7, 0.78, 0.48);
    rightSecondaryClaw.rotation.set(-1.05, 0, -0.35);
    figBody.add(rightSecondaryClaw);

  // ===========================================================================
  // TERMAGANTS
  // ===========================================================================

  } else if (uType === 'ty_termagants') {
    figBody.scale.set(0.78, 0.78, 0.78);
    figBody.position.z = 0.04;

    // -------------------------------------------------------------------------
    // Legs
    // -------------------------------------------------------------------------

    const legGeo = getCachedCone(0.09, 0.44, 10);

    const leftLeg = new THREE.Mesh(legGeo, armorMat);
    leftLeg.position.set(-0.17, 0.22, -0.1);
    leftLeg.rotation.set(-0.3, 0, 0.18);
    figBody.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, armorMat);
    rightLeg.position.set(0.17, 0.22, -0.1);
    rightLeg.rotation.set(-0.3, 0, -0.18);
    figBody.add(rightLeg);

    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    // -------------------------------------------------------------------------
    // Body
    // -------------------------------------------------------------------------

    const abdomen = new THREE.Mesh(
      getCachedCone(0.23, 0.62, 12),
      trimMat
    );
    abdomen.position.set(0, 0.58, 0);
    abdomen.rotation.x = 0.35;
    figBody.add(abdomen);

    const carapace = new THREE.Mesh(
      getCachedSphere(0.24, 12, 12),
      armorMat
    );
    carapace.position.set(0, 0.76, -0.12);
    carapace.scale.set(1.05, 0.75, 1.15);
    figBody.add(carapace);

    // -------------------------------------------------------------------------
    // Head
    // -------------------------------------------------------------------------

    const head = new THREE.Mesh(
      getCachedCone(0.19, 0.52, 12),
      armorMat
    );
    head.position.set(0, 0.91, 0.23);
    head.rotation.x = 0.8;
    figBody.add(head);

    const jaw = new THREE.Mesh(
      getCachedBox(0.14, 0.1, 0.2),
      boneMat
    );
    jaw.position.set(0, 0.76, 0.42);
    figBody.add(jaw);

    // -------------------------------------------------------------------------
    // Eyes
    // -------------------------------------------------------------------------

    const eyeL = new THREE.Mesh(
      getCachedSphere(0.04, 10, 10),
      eyeGlowMat
    );
    eyeL.position.set(-0.075, 0.89, 0.39);
    figBody.add(eyeL);

    const eyeR = new THREE.Mesh(
      getCachedSphere(0.04, 10, 10),
      eyeGlowMat
    );
    eyeR.position.set(0.075, 0.89, 0.39);
    figBody.add(eyeR);

    // -------------------------------------------------------------------------
    // Fleshborer
    // -------------------------------------------------------------------------

    const fleshborerBody = new THREE.Mesh(
      getCachedCylinder(0.065, 0.08, 0.58, 10),
      fleshJointMat
    );
    fleshborerBody.position.set(0.23, 0.58, 0.34);
    fleshborerBody.rotation.x = Math.PI / 2;
    figBody.add(fleshborerBody);

    const fleshborerMuzzle = new THREE.Mesh(
      getCachedCone(0.075, 0.22, 10),
      bioWeaponMat
    );
    fleshborerMuzzle.position.set(0.23, 0.58, 0.68);
    fleshborerMuzzle.rotation.x = -Math.PI / 2;
    figBody.add(fleshborerMuzzle);

    // -------------------------------------------------------------------------
    // Small claws
    // -------------------------------------------------------------------------

    const clawGeo = getCachedCone(0.035, 0.42, 8);

    const leftClaw = new THREE.Mesh(clawGeo, boneMat);
    leftClaw.position.set(-0.25, 0.55, 0.3);
    leftClaw.rotation.set(-1.0, 0, 0.35);
    figBody.add(leftClaw);

    const rightClaw = new THREE.Mesh(clawGeo, boneMat);
    rightClaw.position.set(0.25, 0.55, 0.3);
    rightClaw.rotation.set(-1.0, 0, -0.35);
    figBody.add(rightClaw);

  // ===========================================================================
  // HORMAGAUNTS
  // ===========================================================================

  } else if (uType === 'ty_hormagaunts') {
    figBody.scale.set(0.82, 0.82, 0.82);
    figBody.rotation.x = 0.18;
    figBody.position.z = 0.06;

    // -------------------------------------------------------------------------
    // Legs
    // -------------------------------------------------------------------------

    const legGeo = getCachedCone(0.1, 0.52, 10);

    const leftLeg = new THREE.Mesh(legGeo, armorMat);
    leftLeg.position.set(-0.2, 0.25, -0.08);
    leftLeg.rotation.set(-0.5, 0, 0.28);
    figBody.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, armorMat);
    rightLeg.position.set(0.2, 0.25, -0.08);
    rightLeg.rotation.set(-0.5, 0, -0.28);
    figBody.add(rightLeg);

    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    // -------------------------------------------------------------------------
    // Body
    // -------------------------------------------------------------------------

    const abdomen = new THREE.Mesh(
      getCachedCone(0.24, 0.64, 12),
      trimMat
    );
    abdomen.position.set(0, 0.58, 0);
    abdomen.rotation.x = 0.55;
    figBody.add(abdomen);

    const carapace = new THREE.Mesh(
      getCachedSphere(0.25, 12, 12),
      armorMat
    );
    carapace.position.set(0, 0.74, -0.15);
    carapace.scale.set(1.05, 0.72, 1.2);
    figBody.add(carapace);

    // -------------------------------------------------------------------------
    // Head
    // -------------------------------------------------------------------------

    const head = new THREE.Mesh(
      getCachedCone(0.19, 0.55, 12),
      armorMat
    );
    head.position.set(0, 0.9, 0.3);
    head.rotation.x = 1.0;
    figBody.add(head);

    const jaw = new THREE.Mesh(
      getCachedBox(0.15, 0.1, 0.22),
      boneMat
    );
    jaw.position.set(0, 0.74, 0.48);
    figBody.add(jaw);

    // -------------------------------------------------------------------------
    // Eyes
    // -------------------------------------------------------------------------

    const eyeL = new THREE.Mesh(
      getCachedSphere(0.04, 10, 10),
      eyeGlowMat
    );
    eyeL.position.set(-0.075, 0.88, 0.45);
    figBody.add(eyeL);

    const eyeR = new THREE.Mesh(
      getCachedSphere(0.04, 10, 10),
      eyeGlowMat
    );
    eyeR.position.set(0.075, 0.88, 0.45);
    figBody.add(eyeR);

    // -------------------------------------------------------------------------
    // Oversized scything talons
    // -------------------------------------------------------------------------

    const clawGeo = getCachedCone(0.055, 0.82, 10);

    const leftClaw = new THREE.Mesh(clawGeo, boneMat);
    leftClaw.position.set(-0.38, 0.68, 0.38);
    leftClaw.rotation.set(-1.35, 0, 0.5);
    figBody.add(leftClaw);

    const rightClaw = new THREE.Mesh(clawGeo, boneMat);
    rightClaw.position.set(0.38, 0.68, 0.38);
    rightClaw.rotation.set(-1.35, 0, -0.5);
    figBody.add(rightClaw);

    // -------------------------------------------------------------------------
    // Secondary talons
    // -------------------------------------------------------------------------

    const secondaryClawGeo = getCachedCone(0.04, 0.55, 8);

    const leftSecondaryClaw = new THREE.Mesh(
      secondaryClawGeo,
      boneMat
    );
    leftSecondaryClaw.position.set(-0.25, 0.48, 0.32);
    leftSecondaryClaw.rotation.set(-1.15, 0, 0.45);
    figBody.add(leftSecondaryClaw);

    const rightSecondaryClaw = new THREE.Mesh(
      secondaryClawGeo,
      boneMat
    );
    rightSecondaryClaw.position.set(0.25, 0.48, 0.32);
    rightSecondaryClaw.rotation.set(-1.15, 0, -0.45);
    figBody.add(rightSecondaryClaw);

  // =======================================================================
  // RIPPER SWARMS
  // ===========================================================================

  } else if (uType === 'ty_ripper_swarms') {
    figBody.scale.set(0.72, 0.72, 0.72);
    figBody.position.y = 0.04;
    figBody.position.z = 0.02;

    // -------------------------------------------------------------------------
    // Swarm bodies
    // -------------------------------------------------------------------------

    const bodyPositions = [
      [-0.22, 0.18, 0.02],
      [0.22, 0.18, 0.04],
      [0, 0.16, -0.2],
    ];

    bodyPositions.forEach(([x, y, z], index) => {
      const body = new THREE.Mesh(
        getCachedSphere(0.2, 10, 10),
        trimMat
      );
      body.position.set(x, y, z);
      body.scale.set(1.15, 0.8, 1.35);
      figBody.add(body);

      // -----------------------------------------------------------------------
      // Head
      // -----------------------------------------------------------------------

      const head = new THREE.Mesh(
        getCachedSphere(0.14, 10, 10),
        armorMat
      );
      head.position.set(
        x,
        y + 0.02,
        z + (index === 2 ? -0.18 : 0.18)
      );
      head.scale.set(1, 0.8, 1.15);
      figBody.add(head);

      // -----------------------------------------------------------------------
      // Jaw
      // -----------------------------------------------------------------------

      const jaw = new THREE.Mesh(
        getCachedBox(0.11, 0.07, 0.16),
        boneMat
      );
      jaw.position.set(
        x,
        y - 0.02,
        z + (index === 2 ? -0.31 : 0.31)
      );
      figBody.add(jaw);

      // -----------------------------------------------------------------------
      // Eyes
      // -----------------------------------------------------------------------

      const eyeL = new THREE.Mesh(
        getCachedSphere(0.025, 8, 8),
        eyeGlowMat
      );
      eyeL.position.set(
        x - 0.055,
        y + 0.05,
        z + (index === 2 ? -0.27 : 0.27)
      );
      figBody.add(eyeL);

      const eyeR = new THREE.Mesh(
        getCachedSphere(0.025, 8, 8),
        eyeGlowMat
      );
      eyeR.position.set(
        x + 0.055,
        y + 0.05,
        z + (index === 2 ? -0.27 : 0.27)
      );
      figBody.add(eyeR);

      // -----------------------------------------------------------------------
      // Ripper claws
      // -----------------------------------------------------------------------

      const clawGeo = getCachedCone(0.025, 0.28, 8);

      const leftClaw = new THREE.Mesh(clawGeo, boneMat);
      leftClaw.position.set(
        x - 0.13,
        y + 0.01,
        z + (index === 2 ? -0.18 : 0.18)
      );
      leftClaw.rotation.set(-1.2, 0, 0.5);
      figBody.add(leftClaw);

      const rightClaw = new THREE.Mesh(clawGeo, boneMat);
      rightClaw.position.set(
        x + 0.13,
        y + 0.01,
        z + (index === 2 ? -0.18 : 0.18)
      );
      rightClaw.rotation.set(-1.2, 0, -0.5);
      figBody.add(rightClaw);

      // -----------------------------------------------------------------------
      // Short tail
      // -----------------------------------------------------------------------

      const tail = new THREE.Mesh(
        getCachedCylinder(0.07, 0.025, 0.35, 8),
        fleshJointMat
      );
      tail.position.set(
        x,
        y + 0.02,
        z + (index === 2 ? 0.18 : -0.18)
      );
      tail.rotation.x = index === 2 ? 0.7 : -0.7;
      figBody.add(tail);
    });
  
  // ===========================================================================
  // BARBGAUNTS
  // ===========================================================================

  } else if (uType === 'ty_barbgaunts') {
    figBody.scale.set(0.82, 0.82, 0.82);
    figBody.position.z = 0.04;

    // -------------------------------------------------------------------------
    // Legs
    // -------------------------------------------------------------------------

    const legGeo = getCachedCone(0.085, 0.46, 10);

    const leftLeg = new THREE.Mesh(legGeo, armorMat);
    leftLeg.position.set(-0.18, 0.24, -0.08);
    leftLeg.rotation.set(-0.35, 0, 0.2);
    figBody.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, armorMat);
    rightLeg.position.set(0.18, 0.24, -0.08);
    rightLeg.rotation.set(-0.35, 0, -0.2);
    figBody.add(rightLeg);

    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    // -------------------------------------------------------------------------
    // Body and carapace
    // -------------------------------------------------------------------------

    const abdomen = new THREE.Mesh(
      getCachedCone(0.22, 0.62, 12),
      trimMat
    );
    abdomen.position.set(0, 0.58, 0);
    abdomen.rotation.x = 0.38;
    figBody.add(abdomen);

    const carapace = new THREE.Mesh(
      getCachedSphere(0.25, 12, 12),
      armorMat
    );
    carapace.position.set(0, 0.78, -0.1);
    carapace.scale.set(1.1, 0.72, 1.2);
    figBody.add(carapace);

    // -------------------------------------------------------------------------
    // Head
    // -------------------------------------------------------------------------

    const head = new THREE.Mesh(
      getCachedCone(0.19, 0.5, 12),
      armorMat
    );
    head.position.set(0, 0.92, 0.24);
    head.rotation.x = 0.85;
    figBody.add(head);

    const jaw = new THREE.Mesh(
      getCachedBox(0.14, 0.1, 0.2),
      boneMat
    );
    jaw.position.set(0, 0.77, 0.42);
    figBody.add(jaw);

    // -------------------------------------------------------------------------
    // Eyes
    // -------------------------------------------------------------------------

    const eyeL = new THREE.Mesh(
      getCachedSphere(0.04, 10, 10),
      eyeGlowMat
    );
    eyeL.position.set(-0.075, 0.9, 0.39);
    figBody.add(eyeL);

    const eyeR = new THREE.Mesh(
      getCachedSphere(0.04, 10, 10),
      eyeGlowMat
    );
    eyeR.position.set(0.075, 0.9, 0.39);
    figBody.add(eyeR);

    // -------------------------------------------------------------------------
    // Barblauncher
    // -------------------------------------------------------------------------

    const launcherBody = new THREE.Mesh(
      getCachedCylinder(0.075, 0.09, 0.62, 10),
      fleshJointMat
    );
    launcherBody.position.set(0.25, 0.63, 0.24);
    launcherBody.rotation.x = Math.PI / 2;
    figBody.add(launcherBody);

    const launcherMuzzle = new THREE.Mesh(
      getCachedCone(0.1, 0.24, 10),
      bioWeaponMat
    );
    launcherMuzzle.position.set(0.25, 0.63, 0.58);
    launcherMuzzle.rotation.x = -Math.PI / 2;
    figBody.add(launcherMuzzle);

    // -------------------------------------------------------------------------
    // Barb clusters
    // -------------------------------------------------------------------------

    const barbGeo = getCachedCone(0.025, 0.32, 8);

    const barbL = new THREE.Mesh(barbGeo, boneMat);
    barbL.position.set(-0.16, 0.76, -0.22);
    barbL.rotation.set(-0.7, 0, 0.3);
    figBody.add(barbL);

    const barbR = new THREE.Mesh(barbGeo, boneMat);
    barbR.position.set(0.16, 0.76, -0.22);
    barbR.rotation.set(-0.7, 0, -0.3);
    figBody.add(barbR);


  // ===========================================================================
  // PYROVORES
  // ===========================================================================

  } else if (uType === 'ty_pyrovores') {
    figBody.scale.set(1.05, 1.05, 1.05);
    figBody.position.z = 0.03;

    // -------------------------------------------------------------------------
    // Heavy legs
    // -------------------------------------------------------------------------

    const legGeo = getCachedCone(0.12, 0.58, 10);

    const leftLeg = new THREE.Mesh(legGeo, armorMat);
    leftLeg.position.set(-0.25, 0.3, -0.1);
    leftLeg.rotation.set(-0.25, 0, 0.2);
    figBody.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, armorMat);
    rightLeg.position.set(0.25, 0.3, -0.1);
    rightLeg.rotation.set(-0.25, 0, -0.2);
    figBody.add(rightLeg);

    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    // -------------------------------------------------------------------------
    // Heavy body
    // -------------------------------------------------------------------------

    const abdomen = new THREE.Mesh(
      getCachedCone(0.34, 0.82, 12),
      trimMat
    );
    abdomen.position.set(0, 0.7, 0);
    abdomen.rotation.x = 0.25;
    figBody.add(abdomen);

    const carapace = new THREE.Mesh(
      getCachedSphere(0.36, 12, 12),
      armorMat
    );
    carapace.position.set(0, 0.94, -0.16);
    carapace.scale.set(1.1, 0.82, 1.25);
    figBody.add(carapace);

    // -------------------------------------------------------------------------
    // Head
    // -------------------------------------------------------------------------

    const head = new THREE.Mesh(
      getCachedCone(0.25, 0.62, 12),
      armorMat
    );
    head.position.set(0, 1.1, 0.28);
    head.rotation.x = 0.85;
    figBody.add(head);

    const jaw = new THREE.Mesh(
      getCachedBox(0.19, 0.12, 0.28),
      boneMat
    );
    jaw.position.set(0, 0.92, 0.52);
    figBody.add(jaw);

    // -------------------------------------------------------------------------
    // Eyes
    // -------------------------------------------------------------------------

    const eyeL = new THREE.Mesh(
      getCachedSphere(0.05, 10, 10),
      eyeGlowMat
    );
    eyeL.position.set(-0.09, 1.08, 0.47);
    figBody.add(eyeL);

    const eyeR = new THREE.Mesh(
      getCachedSphere(0.05, 10, 10),
      eyeGlowMat
    );
    eyeR.position.set(0.09, 1.08, 0.47);
    figBody.add(eyeR);

    // -------------------------------------------------------------------------
    // Bio-flame organ
    // -------------------------------------------------------------------------

    const flameBody = new THREE.Mesh(
      getCachedCylinder(0.13, 0.16, 0.72, 10),
      fleshJointMat
    );
    flameBody.position.set(0, 0.9, 0.46);
    flameBody.rotation.x = Math.PI / 2;
    figBody.add(flameBody);

    const flameMuzzle = new THREE.Mesh(
      getCachedCone(0.17, 0.38, 10),
      bioWeaponMat
    );
    flameMuzzle.position.set(0, 0.9, 0.87);
    flameMuzzle.rotation.x = -Math.PI / 2;
    figBody.add(flameMuzzle);

    // -------------------------------------------------------------------------
    // Claws
    // -------------------------------------------------------------------------

    const clawGeo = getCachedCone(0.05, 0.55, 8);

    const leftClaw = new THREE.Mesh(clawGeo, boneMat);
    leftClaw.position.set(-0.32, 0.68, 0.4);
    leftClaw.rotation.set(-1.05, 0, 0.35);
    figBody.add(leftClaw);

    const rightClaw = new THREE.Mesh(clawGeo, boneMat);
    rightClaw.position.set(0.32, 0.68, 0.4);
    rightClaw.rotation.set(-1.05, 0, -0.35);
    figBody.add(rightClaw);


  // ===========================================================================
  // VENOMTHROPES
  // ===========================================================================

  } else if (uType === 'ty_venomthropes') {
    figBody.scale.set(1.0, 1.0, 1.0);
    figBody.position.z = 0.02;

    // -------------------------------------------------------------------------
    // Legs
    // -------------------------------------------------------------------------

    const legGeo = getCachedCone(0.08, 0.5, 10);

    const leftLeg = new THREE.Mesh(legGeo, armorMat);
    leftLeg.position.set(-0.2, 0.27, -0.08);
    leftLeg.rotation.set(-0.35, 0, 0.2);
    figBody.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, armorMat);
    rightLeg.position.set(0.2, 0.27, -0.08);
    rightLeg.rotation.set(-0.35, 0, -0.2);
    figBody.add(rightLeg);

    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    // -------------------------------------------------------------------------
    // Body
    // -------------------------------------------------------------------------

    const body = new THREE.Mesh(
      getCachedCone(0.27, 0.72, 12),
      trimMat
    );
    body.position.set(0, 0.66, 0);
    body.rotation.x = 0.25;
    figBody.add(body);

    const carapace = new THREE.Mesh(
      getCachedSphere(0.3, 12, 12),
      armorMat
    );
    carapace.position.set(0, 0.92, -0.14);
    carapace.scale.set(1.05, 0.78, 1.25);
    figBody.add(carapace);

    // -------------------------------------------------------------------------
    // Toxic sac
    // -------------------------------------------------------------------------

    const sac = new THREE.Mesh(
      getCachedSphere(0.24, 12, 12),
      fleshJointMat
    );
    sac.position.set(0, 0.78, -0.28);
    sac.scale.set(1.25, 1.35, 0.9);
    figBody.add(sac);

    // -------------------------------------------------------------------------
    // Head
    // -------------------------------------------------------------------------

    const head = new THREE.Mesh(
      getCachedCone(0.2, 0.55, 12),
      armorMat
    );
    head.position.set(0, 1.08, 0.28);
    head.rotation.x = 0.9;
    figBody.add(head);

    const jaw = new THREE.Mesh(
      getCachedBox(0.16, 0.1, 0.23),
      boneMat
    );
    jaw.position.set(0, 0.92, 0.48);
    figBody.add(jaw);

    // -------------------------------------------------------------------------
    // Eyes
    // -------------------------------------------------------------------------

    const eyeL = new THREE.Mesh(
      getCachedSphere(0.045, 10, 10),
      eyeGlowMat
    );
    eyeL.position.set(-0.08, 1.05, 0.44);
    figBody.add(eyeL);

    const eyeR = new THREE.Mesh(
      getCachedSphere(0.045, 10, 10),
      eyeGlowMat
    );
    eyeR.position.set(0.08, 1.05, 0.44);
    figBody.add(eyeR);

    // -------------------------------------------------------------------------
    // Toxic tendrils
    // -------------------------------------------------------------------------

    const tendrilGeo = getCachedCylinder(0.055, 0.025, 0.75, 8);

    const leftTendril = new THREE.Mesh(tendrilGeo, fleshJointMat);
    leftTendril.position.set(-0.3, 0.72, 0.24);
    leftTendril.rotation.set(-0.8, 0, 0.45);
    figBody.add(leftTendril);

    const rightTendril = new THREE.Mesh(tendrilGeo, fleshJointMat);
    rightTendril.position.set(0.3, 0.72, 0.24);
    rightTendril.rotation.set(-0.8, 0, -0.45);
    figBody.add(rightTendril);

    const tentacleTipGeo = getCachedCone(0.045, 0.22, 8);

    const leftTip = new THREE.Mesh(tentacleTipGeo, bioWeaponMat);
    leftTip.position.set(-0.48, 0.43, 0.48);
    leftTip.rotation.set(-1.1, 0, 0.5);
    figBody.add(leftTip);

    const rightTip = new THREE.Mesh(tentacleTipGeo, bioWeaponMat);
    rightTip.position.set(0.48, 0.43, 0.48);
    rightTip.rotation.set(-1.1, 0, -0.5);
    figBody.add(rightTip);


  // ===========================================================================
  // EXOCRINE
  // ===========================================================================

  } else if (uType === 'ty_exocrine') {
    figBody.scale.set(1.45, 1.45, 1.45);
    figBody.position.z = 0.02;

    // -------------------------------------------------------------------------
    // Heavy legs
    // -------------------------------------------------------------------------

    const legGeo = getCachedCone(0.15, 0.62, 10);

    const leftLeg = new THREE.Mesh(legGeo, armorMat);
    leftLeg.position.set(-0.35, 0.3, -0.15);
    leftLeg.rotation.set(-0.25, 0, 0.18);
    figBody.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, armorMat);
    rightLeg.position.set(0.35, 0.3, -0.15);
    rightLeg.rotation.set(-0.25, 0, -0.18);
    figBody.add(rightLeg);

    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    // -------------------------------------------------------------------------
    // Massive body
    // -------------------------------------------------------------------------

    const body = new THREE.Mesh(
      getCachedSphere(0.42, 14, 14),
      trimMat
    );
    body.position.set(0, 0.72, 0);
    body.scale.set(1.25, 0.9, 1.35);
    figBody.add(body);

    const carapace = new THREE.Mesh(
      getCachedSphere(0.43, 14, 14),
      armorMat
    );
    carapace.position.set(0, 0.98, -0.2);
    carapace.scale.set(1.3, 0.65, 1.35);
    figBody.add(carapace);

    // -------------------------------------------------------------------------
    // Head
    // -------------------------------------------------------------------------

    const head = new THREE.Mesh(
      getCachedCone(0.27, 0.68, 12),
      armorMat
    );
    head.position.set(0, 1.12, 0.32);
    head.rotation.x = 0.85;
    figBody.add(head);

    const jaw = new THREE.Mesh(
      getCachedBox(0.22, 0.14, 0.32),
      boneMat
    );
    jaw.position.set(0, 0.94, 0.6);
    figBody.add(jaw);

    // -------------------------------------------------------------------------
    // Eyes
    // -------------------------------------------------------------------------

    const eyeL = new THREE.Mesh(
      getCachedSphere(0.055, 10, 10),
      eyeGlowMat
    );
    eyeL.position.set(-0.1, 1.1, 0.52);
    figBody.add(eyeL);

    const eyeR = new THREE.Mesh(
      getCachedSphere(0.055, 10, 10),
      eyeGlowMat
    );
    eyeR.position.set(0.1, 1.1, 0.52);
    figBody.add(eyeR);

    // -------------------------------------------------------------------------
    // Bio-plasmic cannon
    // -------------------------------------------------------------------------

    const cannonBody = new THREE.Mesh(
      getCachedCylinder(0.17, 0.22, 0.95, 12),
      fleshJointMat
    );
    cannonBody.position.set(0.38, 0.86, 0.42);
    cannonBody.rotation.x = Math.PI / 2;
    figBody.add(cannonBody);

    const cannonMuzzle = new THREE.Mesh(
      getCachedCone(0.23, 0.42, 12),
      bioWeaponMat
    );
    cannonMuzzle.position.set(0.38, 0.86, 0.94);
    cannonMuzzle.rotation.x = -Math.PI / 2;
    figBody.add(cannonMuzzle);

    // -------------------------------------------------------------------------
    // Dorsal armour
    // -------------------------------------------------------------------------

    const ridgeGeo = getCachedCone(0.07, 0.42, 8);

    for (let i = 0; i < 3; i++) {
      const ridge = new THREE.Mesh(ridgeGeo, armorMat);
      ridge.position.set(0, 1.12 + i * 0.04, -0.42 - i * 0.18);
      ridge.rotation.x = 0;
      figBody.add(ridge);
    }


  // ===========================================================================
  // HARUSPEX
  // ===========================================================================

  } else if (uType === 'ty_haruspex') {
    figBody.scale.set(1.55, 1.55, 1.55);
    figBody.position.z = 0.02;

    // -------------------------------------------------------------------------
    // Legs
    // -------------------------------------------------------------------------

    const legGeo = getCachedCone(0.16, 0.7, 10);

    const leftLeg = new THREE.Mesh(legGeo, armorMat);
    leftLeg.position.set(-0.38, 0.34, -0.12);
    leftLeg.rotation.set(-0.3, 0, 0.2);
    figBody.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, armorMat);
    rightLeg.position.set(0.38, 0.34, -0.12);
    rightLeg.rotation.set(-0.3, 0, -0.2);
    figBody.add(rightLeg);

    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    // -------------------------------------------------------------------------
    // Body
    // -------------------------------------------------------------------------

    const abdomen = new THREE.Mesh(
      getCachedSphere(0.48, 14, 14),
      trimMat
    );
    abdomen.position.set(0, 0.78, -0.02);
    abdomen.scale.set(1.25, 0.95, 1.4);
    figBody.add(abdomen);

    const carapace = new THREE.Mesh(
      getCachedSphere(0.48, 14, 14),
      armorMat
    );
    carapace.position.set(0, 1.05, -0.28);
    carapace.scale.set(1.3, 0.7, 1.35);
    figBody.add(carapace);

    // -------------------------------------------------------------------------
    // Feeding head
    // -------------------------------------------------------------------------

    const head = new THREE.Mesh(
      getCachedCone(0.34, 0.78, 12),
      armorMat
    );
    head.position.set(0, 1.18, 0.38);
    head.rotation.x = 0.95;
    figBody.add(head);

    const jaw = new THREE.Mesh(
      getCachedBox(0.3, 0.18, 0.45),
      boneMat
    );
    jaw.position.set(0, 0.9, 0.72);
    figBody.add(jaw);

    // -------------------------------------------------------------------------
    // Eyes
    // -------------------------------------------------------------------------

    const eyeL = new THREE.Mesh(
      getCachedSphere(0.065, 10, 10),
      eyeGlowMat
    );
    eyeL.position.set(-0.12, 1.15, 0.62);
    figBody.add(eyeL);

    const eyeR = new THREE.Mesh(
      getCachedSphere(0.065, 10, 10),
      eyeGlowMat
    );
    eyeR.position.set(0.12, 1.15, 0.62);
    figBody.add(eyeR);

    // -------------------------------------------------------------------------
    // Grasping tongue
    // -------------------------------------------------------------------------

    const tongue = new THREE.Mesh(
      getCachedCylinder(0.075, 0.035, 0.9, 10),
      fleshJointMat
    );
    tongue.position.set(0, 0.9, 0.94);
    tongue.rotation.x = Math.PI / 2;
    figBody.add(tongue);

    const tongueTip = new THREE.Mesh(
      getCachedCone(0.08, 0.25, 10),
      bioWeaponMat
    );
    tongueTip.position.set(0, 0.9, 1.38);
    tongueTip.rotation.x = -Math.PI / 2;
    figBody.add(tongueTip);

    // -------------------------------------------------------------------------
    // Ravenous maw
    // -------------------------------------------------------------------------

    const mawL = new THREE.Mesh(
      getCachedCone(0.1, 0.55, 8),
      boneMat
    );
    mawL.position.set(-0.2, 0.88, 0.8);
    mawL.rotation.set(-1.1, 0, 0.35);
    figBody.add(mawL);

    const mawR = new THREE.Mesh(
      getCachedCone(0.1, 0.55, 8),
      boneMat
    );
    mawR.position.set(0.2, 0.88, 0.8);
    mawR.rotation.set(-1.1, 0, -0.35);
    figBody.add(mawR);

    // -------------------------------------------------------------------------
    // Feeding claws
    // -------------------------------------------------------------------------

    const clawGeo = getCachedCone(0.07, 0.72, 8);

    const leftClaw = new THREE.Mesh(clawGeo, boneMat);
    leftClaw.position.set(-0.5, 0.7, 0.4);
    leftClaw.rotation.set(-1.0, 0, 0.45);
    figBody.add(leftClaw);

    const rightClaw = new THREE.Mesh(clawGeo, boneMat);
    rightClaw.position.set(0.5, 0.7, 0.4);
    rightClaw.rotation.set(-1.0, 0, -0.45);
    figBody.add(rightClaw);


  // ===========================================================================
  // SCREAMER-KILLER
  // ===========================================================================

  } else if (uType === 'ty_screamer_killer') {
    figBody.scale.set(1.42, 1.42, 1.42);
    figBody.position.z = 0.04;
    figBody.rotation.x = 0.12;

    // -------------------------------------------------------------------------
    // Legs
    // -------------------------------------------------------------------------

    const legGeo = getCachedCone(0.15, 0.68, 10);

    const leftLeg = new THREE.Mesh(legGeo, armorMat);
    leftLeg.position.set(-0.35, 0.32, -0.1);
    leftLeg.rotation.set(-0.45, 0, 0.22);
    figBody.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, armorMat);
    rightLeg.position.set(0.35, 0.32, -0.1);
    rightLeg.rotation.set(-0.45, 0, -0.22);
    figBody.add(rightLeg);

    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    // -------------------------------------------------------------------------
    // Carnifex body
    // -------------------------------------------------------------------------

    const abdomen = new THREE.Mesh(
      getCachedSphere(0.42, 14, 14),
      trimMat
    );
    abdomen.position.set(0, 0.78, 0);
    abdomen.scale.set(1.2, 0.9, 1.35);
    figBody.add(abdomen);

    const carapace = new THREE.Mesh(
      getCachedSphere(0.43, 14, 14),
      armorMat
    );
    carapace.position.set(0, 1.02, -0.2);
    carapace.scale.set(1.25, 0.72, 1.3);
    figBody.add(carapace);

    // -------------------------------------------------------------------------
    // Head
    // -------------------------------------------------------------------------

    const head = new THREE.Mesh(
      getCachedCone(0.28, 0.7, 12),
      armorMat
    );
    head.position.set(0, 1.18, 0.34);
    head.rotation.x = 0.9;
    figBody.add(head);

    const jaw = new THREE.Mesh(
      getCachedBox(0.24, 0.15, 0.34),
      boneMat
    );
    jaw.position.set(0, 0.98, 0.62);
    figBody.add(jaw);

    // -------------------------------------------------------------------------
    // Eyes
    // -------------------------------------------------------------------------

    const eyeL = new THREE.Mesh(
      getCachedSphere(0.055, 10, 10),
      eyeGlowMat
    );
    eyeL.position.set(-0.1, 1.15, 0.54);
    figBody.add(eyeL);

    const eyeR = new THREE.Mesh(
      getCachedSphere(0.055, 10, 10),
      eyeGlowMat
    );
    eyeR.position.set(0.1, 1.15, 0.54);
    figBody.add(eyeR);

    // -------------------------------------------------------------------------
    // Bio-plasmic scream organ
    // -------------------------------------------------------------------------

    const screamBody = new THREE.Mesh(
      getCachedCylinder(0.13, 0.18, 0.55, 10),
      fleshJointMat
    );
    screamBody.position.set(0, 0.98, 0.48);
    screamBody.rotation.x = Math.PI / 2;
    figBody.add(screamBody);

    const screamMuzzle = new THREE.Mesh(
      getCachedCone(0.18, 0.32, 10),
      bioWeaponMat
    );
    screamMuzzle.position.set(0, 0.98, 0.82);
    screamMuzzle.rotation.x = -Math.PI / 2;
    figBody.add(screamMuzzle);

    // -------------------------------------------------------------------------
    // Killing talons
    // -------------------------------------------------------------------------

    const clawGeo = getCachedCone(0.075, 0.82, 10);

    const leftClaw = new THREE.Mesh(clawGeo, boneMat);
    leftClaw.position.set(-0.52, 0.7, 0.42);
    leftClaw.rotation.set(-1.25, 0, 0.42);
    figBody.add(leftClaw);

    const rightClaw = new THREE.Mesh(clawGeo, boneMat);
    rightClaw.position.set(0.52, 0.7, 0.42);
    rightClaw.rotation.set(-1.25, 0, -0.42);
    figBody.add(rightClaw);


  // ===========================================================================
  // TRYGON
  // ===========================================================================

  } else if (uType === 'ty_trygon') {
    figBody.scale.set(1.75, 1.75, 1.75);
    figBody.position.z = 0.02;

    // -------------------------------------------------------------------------
    // Serpentine lower body
    // -------------------------------------------------------------------------

    const lowerBody = new THREE.Mesh(
      getCachedCone(0.38, 1.1, 14),
      trimMat
    );
    lowerBody.position.set(0, 0.72, -0.15);
    lowerBody.rotation.x = 0.25;
    figBody.add(lowerBody);

    const abdomen = new THREE.Mesh(
      getCachedSphere(0.45, 14, 14),
      trimMat
    );
    abdomen.position.set(0, 1.0, 0);
    abdomen.scale.set(1.15, 1.0, 1.35);
    figBody.add(abdomen);

    // -------------------------------------------------------------------------
    // Tail
    // -------------------------------------------------------------------------

    const tail = new THREE.Mesh(
      getCachedCone(0.32, 1.5, 12),
      armorMat
    );
    tail.position.set(0, 0.48, -0.95);
    tail.rotation.x = -0.15;
    figBody.add(tail);

    const tailTip = new THREE.Mesh(
      getCachedCone(0.16, 0.65, 10),
      boneMat
    );
    tailTip.position.set(0, 0.5, -1.9);
    tailTip.rotation.x = -0.1;
    figBody.add(tailTip);

    // -------------------------------------------------------------------------
    // Head
    // -------------------------------------------------------------------------

    const head = new THREE.Mesh(
      getCachedCone(0.38, 0.95, 14),
      armorMat
    );
    head.position.set(0, 1.28, 0.42);
    head.rotation.x = 0.95;
    figBody.add(head);

    const jaw = new THREE.Mesh(
      getCachedBox(0.34, 0.18, 0.5),
      boneMat
    );
    jaw.position.set(0, 1.0, 0.82);
    figBody.add(jaw);

    // -------------------------------------------------------------------------
    // Eyes
    // -------------------------------------------------------------------------

    const eyeL = new THREE.Mesh(
      getCachedSphere(0.065, 10, 10),
      eyeGlowMat
    );
    eyeL.position.set(-0.14, 1.27, 0.7);
    figBody.add(eyeL);

    const eyeR = new THREE.Mesh(
      getCachedSphere(0.065, 10, 10),
      eyeGlowMat
    );
    eyeR.position.set(0.14, 1.27, 0.7);
    figBody.add(eyeR);

    // -------------------------------------------------------------------------
    // Massive scything talons
    // -------------------------------------------------------------------------

    const clawGeo = getCachedCone(0.09, 1.15, 10);

    const leftClaw = new THREE.Mesh(clawGeo, boneMat);
    leftClaw.position.set(-0.62, 1.0, 0.55);
    leftClaw.rotation.set(-1.15, 0, 0.48);
    figBody.add(leftClaw);

    const rightClaw = new THREE.Mesh(clawGeo, boneMat);
    rightClaw.position.set(0.62, 1.0, 0.55);
    rightClaw.rotation.set(-1.15, 0, -0.48);
    figBody.add(rightClaw);

    // -------------------------------------------------------------------------
    // Dorsal spines
    // -------------------------------------------------------------------------

    const spineGeo = getCachedCone(0.09, 0.55, 8);

    for (let i = 0; i < 4; i++) {
      const spine = new THREE.Mesh(spineGeo, armorMat);
      spine.position.set(0, 1.42, 0.05 - i * 0.35);
      spine.rotation.x = 0;
      figBody.add(spine);
    }


  // ===========================================================================
  // MAWLOC
  // ===========================================================================

  } else if (uType === 'ty_mawloc') {
    figBody.scale.set(1.8, 1.8, 1.8);
    figBody.position.z = 0.02;

    // -------------------------------------------------------------------------
    // Massive body
    // -------------------------------------------------------------------------

    const body = new THREE.Mesh(
      getCachedSphere(0.55, 14, 14),
      trimMat
    );
    body.position.set(0, 0.82, -0.05);
    body.scale.set(1.3, 1.15, 1.45);
    figBody.add(body);

    const carapace = new THREE.Mesh(
      getCachedSphere(0.52, 14, 14),
      armorMat
    );
    carapace.position.set(0, 1.12, -0.3);
    carapace.scale.set(1.35, 0.72, 1.4);
    figBody.add(carapace);

    // -------------------------------------------------------------------------
    // Tail
    // -------------------------------------------------------------------------

    const tail = new THREE.Mesh(
      getCachedCone(0.38, 1.7, 12),
      armorMat
    );
    tail.position.set(0, 0.56, -1.0);
    tail.rotation.x = -0.1;
    figBody.add(tail);

    // -------------------------------------------------------------------------
    // Massive head and maw
    // -------------------------------------------------------------------------

    const head = new THREE.Mesh(
      getCachedCone(0.5, 1.1, 14),
      armorMat
    );
    head.position.set(0, 1.3, 0.48);
    head.rotation.x = 0.92;
    figBody.add(head);

    const upperMaw = new THREE.Mesh(
      getCachedBox(0.48, 0.2, 0.55),
      boneMat
    );
    upperMaw.position.set(0, 1.0, 0.94);
    figBody.add(upperMaw);

    const lowerMaw = new THREE.Mesh(
      getCachedBox(0.4, 0.16, 0.42),
      boneMat
    );
    lowerMaw.position.set(0, 0.87, 0.92);
    figBody.add(lowerMaw);

    // -------------------------------------------------------------------------
    // Eyes
    // -------------------------------------------------------------------------

    const eyeL = new THREE.Mesh(
      getCachedSphere(0.07, 10, 10),
      eyeGlowMat
    );
    eyeL.position.set(-0.16, 1.3, 0.78);
    figBody.add(eyeL);

    const eyeR = new THREE.Mesh(
      getCachedSphere(0.07, 10, 10),
      eyeGlowMat
    );
    eyeR.position.set(0.16, 1.3, 0.78);
    figBody.add(eyeR);

    // -------------------------------------------------------------------------
    // Massive scything talons
    // -------------------------------------------------------------------------

    const clawGeo = getCachedCone(0.1, 1.05, 10);

    const leftClaw = new THREE.Mesh(clawGeo, boneMat);
    leftClaw.position.set(-0.7, 0.95, 0.5);
    leftClaw.rotation.set(-1.15, 0, 0.5);
    figBody.add(leftClaw);

    const rightClaw = new THREE.Mesh(clawGeo, boneMat);
    rightClaw.position.set(0.7, 0.95, 0.5);
    rightClaw.rotation.set(-1.15, 0, -0.5);
    figBody.add(rightClaw);

    // -------------------------------------------------------------------------
    // Dorsal ridges
    // -------------------------------------------------------------------------

    const ridgeGeo = getCachedCone(0.1, 0.6, 8);

    for (let i = 0; i < 4; i++) {
      const ridge = new THREE.Mesh(ridgeGeo, armorMat);
      ridge.position.set(0, 1.45, -0.05 - i * 0.34);
      figBody.add(ridge);
    }


  // ===========================================================================
  // TOXICRENE
  // ===========================================================================

  } else if (uType === 'ty_toxicrene') {
    figBody.scale.set(1.55, 1.55, 1.55);
    figBody.position.z = 0.02;

    // -------------------------------------------------------------------------
    // Legs
    // -------------------------------------------------------------------------

    const legGeo = getCachedCone(0.14, 0.68, 10);

    const leftLeg = new THREE.Mesh(legGeo, armorMat);
    leftLeg.position.set(-0.36, 0.32, -0.1);
    leftLeg.rotation.set(-0.25, 0, 0.22);
    figBody.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, armorMat);
    rightLeg.position.set(0.36, 0.32, -0.1);
    rightLeg.rotation.set(-0.25, 0, -0.22);
    figBody.add(rightLeg);

    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    // -------------------------------------------------------------------------
    // Body
    // -------------------------------------------------------------------------

    const abdomen = new THREE.Mesh(
      getCachedSphere(0.46, 14, 14),
      trimMat
    );
    abdomen.position.set(0, 0.78, 0);
    abdomen.scale.set(1.2, 0.95, 1.35);
    figBody.add(abdomen);

    const carapace = new THREE.Mesh(
      getCachedSphere(0.45, 14, 14),
      armorMat
    );
    carapace.position.set(0, 1.02, -0.22);
    carapace.scale.set(1.28, 0.7, 1.3);
    figBody.add(carapace);

    // -------------------------------------------------------------------------
    // Toxic sac
    // -------------------------------------------------------------------------

    const sac = new THREE.Mesh(
      getCachedSphere(0.3, 12, 12),
      fleshJointMat
    );
    sac.position.set(0, 0.86, -0.3);
    sac.scale.set(1.3, 1.45, 0.9);
    figBody.add(sac);

    // -------------------------------------------------------------------------
    // Head
    // -------------------------------------------------------------------------

    const head = new THREE.Mesh(
      getCachedCone(0.3, 0.68, 12),
      armorMat
    );
    head.position.set(0, 1.2, 0.36);
    head.rotation.x = 0.92;
    figBody.add(head);

    const jaw = new THREE.Mesh(
      getCachedBox(0.24, 0.14, 0.32),
      boneMat
    );
    jaw.position.set(0, 1.0, 0.62);
    figBody.add(jaw);

    // -------------------------------------------------------------------------
    // Eyes
    // -------------------------------------------------------------------------

    const eyeL = new THREE.Mesh(
      getCachedSphere(0.055, 10, 10),
      eyeGlowMat
    );
    eyeL.position.set(-0.1, 1.17, 0.56);
    figBody.add(eyeL);

    const eyeR = new THREE.Mesh(
      getCachedSphere(0.055, 10, 10),
      eyeGlowMat
    );
    eyeR.position.set(0.1, 1.17, 0.56);
    figBody.add(eyeR);

    // -------------------------------------------------------------------------
    // Toxic lashes
    // -------------------------------------------------------------------------

    const lashGeo = getCachedCylinder(0.065, 0.025, 1.0, 8);

    const lashPositions = [
      [-0.48, 0.9, 0.35, -0.9, 0.55],
      [-0.52, 0.72, 0.15, -0.7, 0.8],
      [0.48, 0.9, 0.35, -0.9, -0.55],
      [0.52, 0.72, 0.15, -0.7, -0.8],
    ];

    lashPositions.forEach(([x, y, z, rotX, rotZ]) => {
      const lash = new THREE.Mesh(lashGeo, fleshJointMat);
      lash.position.set(x, y, z);
      lash.rotation.set(rotX, 0, rotZ);
      figBody.add(lash);
    });

    // -------------------------------------------------------------------------
    // Massive scything talons
    // -------------------------------------------------------------------------

    const clawGeo = getCachedCone(0.08, 0.9, 10);

    const leftClaw = new THREE.Mesh(clawGeo, boneMat);
    leftClaw.position.set(-0.58, 0.7, 0.4);
    leftClaw.rotation.set(-1.15, 0, 0.45);
    figBody.add(leftClaw);

    const rightClaw = new THREE.Mesh(clawGeo, boneMat);
    rightClaw.position.set(0.58, 0.7, 0.4);
    rightClaw.rotation.set(-1.15, 0, -0.45);
    figBody.add(rightClaw);


  // ===========================================================================
  // PSYCHOPHAGE
  // ===========================================================================

  } else if (uType === 'ty_psychophage') {
    figBody.scale.set(1.3, 1.3, 1.3);
    figBody.position.z = 0.03;

    // -------------------------------------------------------------------------
    // Legs
    // -------------------------------------------------------------------------

    const legGeo = getCachedCone(0.13, 0.62, 10);

    const leftLeg = new THREE.Mesh(legGeo, armorMat);
    leftLeg.position.set(-0.3, 0.3, -0.1);
    leftLeg.rotation.set(-0.3, 0, 0.2);
    figBody.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, armorMat);
    rightLeg.position.set(0.3, 0.3, -0.1);
    rightLeg.rotation.set(-0.3, 0, -0.2);
    figBody.add(rightLeg);

    root.userData.leftLeg = leftLeg;
    root.userData.rightLeg = rightLeg;

    // -------------------------------------------------------------------------
    // Body
    // -------------------------------------------------------------------------

    const abdomen = new THREE.Mesh(
      getCachedSphere(0.38, 14, 14),
      trimMat
    );
    abdomen.position.set(0, 0.7, 0);
    abdomen.scale.set(1.2, 0.95, 1.35);
    figBody.add(abdomen);

    const carapace = new THREE.Mesh(
      getCachedSphere(0.38, 14, 14),
      armorMat
    );
    carapace.position.set(0, 0.94, -0.18);
    carapace.scale.set(1.2, 0.72, 1.25);
    figBody.add(carapace);

    // -------------------------------------------------------------------------
    // Head
    // -------------------------------------------------------------------------

    const head = new THREE.Mesh(
      getCachedCone(0.27, 0.62, 12),
      armorMat
    );
    head.position.set(0, 1.1, 0.32);
    head.rotation.x = 0.9;
    figBody.add(head);

    const jaw = new THREE.Mesh(
      getCachedBox(0.22, 0.14, 0.3),
      boneMat
    );
    jaw.position.set(0, 0.91, 0.57);
    figBody.add(jaw);

    // -------------------------------------------------------------------------
    // Eyes
    // -------------------------------------------------------------------------

    const eyeL = new THREE.Mesh(
      getCachedSphere(0.05, 10, 10),
      eyeGlowMat
    );
    eyeL.position.set(-0.09, 1.07, 0.51);
    figBody.add(eyeL);

    const eyeR = new THREE.Mesh(
      getCachedSphere(0.05, 10, 10),
      eyeGlowMat
    );
    eyeR.position.set(0.09, 1.07, 0.51);
    figBody.add(eyeR);

    // -------------------------------------------------------------------------
    // Acid spray organ
    // -------------------------------------------------------------------------

    const acidBody = new THREE.Mesh(
      getCachedCylinder(0.12, 0.15, 0.62, 10),
      fleshJointMat
    );
    acidBody.position.set(0.25, 0.72, 0.34);
    acidBody.rotation.x = Math.PI / 2;
    figBody.add(acidBody);

    const acidMuzzle = new THREE.Mesh(
      getCachedCone(0.16, 0.32, 10),
      bioWeaponMat
    );
    acidMuzzle.position.set(0.25, 0.72, 0.7);
    acidMuzzle.rotation.x = -Math.PI / 2;
    figBody.add(acidMuzzle);

    // -------------------------------------------------------------------------
    // Feeding talons
    // -------------------------------------------------------------------------

    const clawGeo = getCachedCone(0.06, 0.68, 8);

    const leftClaw = new THREE.Mesh(clawGeo, boneMat);
    leftClaw.position.set(-0.42, 0.65, 0.38);
    leftClaw.rotation.set(-1.05, 0, 0.4);
    figBody.add(leftClaw);

    const rightClaw = new THREE.Mesh(clawGeo, boneMat);
    rightClaw.position.set(0.42, 0.65, 0.38);
    rightClaw.rotation.set(-1.05, 0, -0.4);
    figBody.add(rightClaw);

    // -------------------------------------------------------------------------
    // Feeding tendrils
    // -------------------------------------------------------------------------

    const tendrilGeo = getCachedCylinder(0.045, 0.02, 0.48, 8);

    const tendrilL = new THREE.Mesh(tendrilGeo, fleshJointMat);
    tendrilL.position.set(-0.18, 0.52, 0.5);
    tendrilL.rotation.set(-1.0, 0, 0.3);
    figBody.add(tendrilL);

    const tendrilR = new THREE.Mesh(tendrilGeo, fleshJointMat);
    tendrilR.position.set(0.18, 0.52, 0.5);
    tendrilR.rotation.set(-1.0, 0, -0.3);
    figBody.add(tendrilR);

  
  // ===========================================================================
  // NEUROGAUNTS
  // ===========================================================================
  } else if (uType === 'ty_neurogaunts') {
    const s = 0.65;
    figBody.scale.setScalar(s);

    bioPart([0, 0.85, 0], [0.32, 0.38, 0.4], armorMat);
    bioPart([0, 1.1, 0.32], [0.27, 0.22, 0.3], trimMat);
    bioPart([0, 1.24, 0.48], [0.19, 0.12, 0.16], boneMat);

    for (const side of [-1, 1]) {
      bioPart([side * 0.22, 0.72, 0], [0.13, 0.35, 0.15], armorMat).rotation.z = side * -0.4;
      bioPart([side * 0.3, 0.46, 0.16], [0.08, 0.27, 0.09], trimMat).rotation.z = side * -0.25;
      bioPart([side * 0.16, 1.17, 0.38], [0.055, 0.055, 0.045], eyeGlowMat);

      const leg = bioPart([side * 0.2, 0.27, 0], [0.09, 0.3, 0.1], fleshJointMat);
      leg.rotation.z = side * 0.25;

      bioPart([side * 0.29, 0.08, 0.12], [0.08, 0.16, 0.07], boneMat, 'cone').rotation.z = Math.PI;
      bioPart([side * 0.3, 0.82, 0.3], [0.07, 0.3, 0.07], trimMat, 'cone').rotation.z = side * -0.5;
    }

    bioPart([0, 0.65, -0.35], [0.14, 0.16, 0.38], armorMat);

  // ===========================================================================
  // VON RYAN'S LEAPERS
  // ===========================================================================
  } else if (uType === 'ty_von_ryans_leapers') {
    const s = 1.05;
    figBody.scale.setScalar(s);

    bioPart([0, 1.0, 0], [0.42, 0.36, 0.62], armorMat);
    bioPart([0, 1.28, -0.05], [0.4, 0.18, 0.52], trimMat);
    bioPart([0, 1.1, 0.55], [0.28, 0.25, 0.4], armorMat);
    bioPart([0, 1.14, 0.86], [0.2, 0.16, 0.25], boneMat);
    bioPart([0, 1.14, 1.03], [0.17, 0.08, 0.16], fleshJointMat);

    for (const side of [-1, 1]) {
      bioPart([side * 0.22, 1.18, 0.83], [0.055, 0.055, 0.045], eyeGlowMat);

      const arm = bioPart([side * 0.52, 1.0, 0.3], [0.15, 0.38, 0.16], fleshJointMat);
      arm.rotation.z = side * -0.55;

      const blade = bioPart([side * 0.68, 1.05, 0.67], [0.11, 0.55, 0.1], trimMat, 'cone');
      blade.rotation.x = -0.9;
      blade.rotation.z = side * -0.45;

      const hindLeg = bioPart([side * 0.28, 0.58, -0.25], [0.13, 0.48, 0.14], armorMat);
      hindLeg.rotation.z = side * 0.3;

      const shin = bioPart([side * 0.37, 0.25, 0.05], [0.09, 0.38, 0.1], fleshJointMat);
      shin.rotation.z = side * -0.35;

      bioPart([side * 0.38, 0.07, 0.23], [0.09, 0.28, 0.07], boneMat, 'cone').rotation.x = Math.PI;
      bioPart([side * 0.24, 1.48, -0.1], [0.08, 0.3, 0.08], trimMat, 'cone').rotation.z = side * 0.45;
    }

    bioPart([0, 0.75, -0.7], [0.14, 0.16, 0.48], armorMat);

  // ===========================================================================
  // TYRANT GUARD
  // ===========================================================================
  } else if (uType === 'ty_tyrant_guard') {
    const s = 1.28;
    figBody.scale.setScalar(s);

    bioPart([0, 1.0, 0], [0.53, 0.55, 0.55], armorMat);
    bioPart([0, 1.38, -0.05], [0.57, 0.3, 0.58], trimMat);
    bioPart([0, 1.22, 0.5], [0.33, 0.27, 0.35], armorMat);
    bioPart([0, 1.19, 0.77], [0.25, 0.2, 0.22], boneMat);
    bioPart([0, 1.12, 0.92], [0.18, 0.08, 0.14], fleshJointMat);

    for (const side of [-1, 1]) {
      bioPart([side * 0.2, 1.26, 0.65], [0.06, 0.06, 0.05], eyeGlowMat);

      const shoulder = bioPart([side * 0.55, 1.23, 0.05], [0.3, 0.35, 0.34], trimMat);
      shoulder.rotation.z = side * -0.2;

      const arm = bioPart([side * 0.62, 0.85, 0.35], [0.19, 0.4, 0.19], fleshJointMat);
      arm.rotation.z = side * -0.3;

      bioPart([side * 0.7, 0.5, 0.52], [0.22, 0.38, 0.2], armorMat);
      bioPart([side * 0.73, 0.22, 0.65], [0.12, 0.36, 0.12], boneMat, 'cone').rotation.z = side * -0.4;

      const thigh = bioPart([side * 0.34, 0.62, -0.1], [0.19, 0.43, 0.2], armorMat);
      thigh.rotation.z = side * 0.12;

      bioPart([side * 0.38, 0.27, 0.05], [0.13, 0.34, 0.13], fleshJointMat);
      bioPart([side * 0.4, 0.08, 0.18], [0.14, 0.2, 0.12], boneMat);
      bioPart([side * 0.65, 1.53, -0.05], [0.12, 0.32, 0.13], trimMat, 'cone').rotation.z = side * 0.5;
    }

    bioPart([0, 0.8, -0.5], [0.2, 0.18, 0.45], armorMat);

  // ===========================================================================
  // SPORE MINES
  // ===========================================================================
  } else if (uType === 'ty_spore_mines') {
    const s = 0.8;
    figBody.scale.setScalar(s);

    bioPart([0, 0.75, 0], [0.55, 0.52, 0.55], armorMat);
    bioPart([0, 0.78, 0.04], [0.4, 0.4, 0.42], fleshJointMat);
    bioPart([0, 1.12, 0], [0.3, 0.22, 0.3], trimMat);

    for (let i = 0; i < 8; i++) {
      const angle = i * Math.PI / 4;
      const x = Math.cos(angle) * 0.47;
      const z = Math.sin(angle) * 0.47;

      const spike = bioPart([x, 0.78, z], [0.12, 0.28, 0.12], boneMat, 'cone');
      spike.rotation.z = -Math.cos(angle) * 0.8;
      spike.rotation.x = Math.sin(angle) * 0.8;
    }

    for (const side of [-1, 1]) {
      bioPart([side * 0.25, 0.35, 0], [0.1, 0.25, 0.1], fleshJointMat);
      bioPart([side * 0.3, 0.18, 0.12], [0.1, 0.2, 0.1], trimMat, 'cone');
    }

    bioPart([0, 0.75, 0], [0.2, 0.2, 0.2], bioWeaponMat);

  // ===========================================================================
  // MUCOLID SPORES
  // ===========================================================================
  } else if (uType === 'ty_mucolid_spores') {
    const s = 1.0;
    figBody.scale.setScalar(s);

    bioPart([0, 0.9, 0], [0.7, 0.7, 0.7], armorMat);
    bioPart([0, 0.95, 0.02], [0.52, 0.55, 0.55], fleshJointMat);
    bioPart([0, 1.3, 0], [0.4, 0.32, 0.4], trimMat);

    for (let i = 0; i < 10; i++) {
      const angle = i * Math.PI * 2 / 10;
      const x = Math.cos(angle) * 0.58;
      const z = Math.sin(angle) * 0.58;

      const tentacle = bioPart([x, 0.78, z], [0.13, 0.42, 0.13], fleshJointMat);
      tentacle.rotation.z = -Math.cos(angle) * 0.7;
      tentacle.rotation.x = Math.sin(angle) * 0.7;

      bioPart([x * 1.25, 0.48, z * 1.25], [0.09, 0.2, 0.09], trimMat, 'cone');
    }

    bioPart([0, 1.58, 0], [0.3, 0.24, 0.3], bioWeaponMat);

    for (const side of [-1, 1]) {
      bioPart([side * 0.23, 1.62, 0.1], [0.1, 0.1, 0.1], eyeGlowMat);
    }

  // ===========================================================================
  // MALECEPTOR
  // ===========================================================================
  } else if (uType === 'ty_maleceptor') {
    const s = 1.65;
    figBody.scale.setScalar(s);

    bioPart([0, 1.05, 0], [0.55, 0.52, 0.72], armorMat);
    bioPart([0, 1.43, -0.08], [0.65, 0.3, 0.7], trimMat);
    bioPart([0, 1.27, 0.55], [0.38, 0.3, 0.4], armorMat);
    bioPart([0, 1.33, 0.84], [0.3, 0.23, 0.28], boneMat);

    for (const side of [-1, 1]) {
      bioPart([side * 0.23, 1.35, 0.85], [0.06, 0.06, 0.05], eyeGlowMat);

      const horn = bioPart([side * 0.35, 1.75, -0.1], [0.13, 0.45, 0.13], trimMat, 'cone');
      horn.rotation.z = side * 0.45;

      const arm = bioPart([side * 0.58, 1.0, 0.35], [0.2, 0.42, 0.2], fleshJointMat);
      arm.rotation.z = side * -0.45;

      const talon = bioPart([side * 0.68, 0.68, 0.65], [0.13, 0.52, 0.12], boneMat, 'cone');
      talon.rotation.z = side * -0.6;

      const leg = bioPart([side * 0.35, 0.6, -0.15], [0.19, 0.45, 0.2], armorMat);
      leg.rotation.z = side * 0.15;

      bioPart([side * 0.38, 0.25, 0.12], [0.12, 0.35, 0.13], fleshJointMat);
      bioPart([side * 0.4, 0.08, 0.28], [0.12, 0.2, 0.1], boneMat);
      bioPart([side * 0.52, 1.48, -0.3], [0.13, 0.3, 0.13], trimMat, 'cone').rotation.z = side * 0.55;
    }

    bioPart([0, 0.8, -0.7], [0.2, 0.2, 0.48], armorMat);
    bioPart([0, 1.05, 0.98], [0.22, 0.18, 0.16], bioWeaponMat);

  // ===========================================================================
  // TERVIGON
  // ===========================================================================
  } else if (uType === 'ty_tervigon') {
    const s = 1.65;
    figBody.scale.setScalar(s);

    bioPart([0, 1.05, -0.05], [0.7, 0.62, 0.78], armorMat);
    bioPart([0, 1.5, -0.08], [0.78, 0.32, 0.72], trimMat);
    bioPart([0, 1.22, 0.62], [0.42, 0.35, 0.42], armorMat);
    bioPart([0, 1.2, 0.96], [0.32, 0.22, 0.28], boneMat);

    bioPart([0, 0.82, -0.1], [0.48, 0.38, 0.52], fleshJointMat);
    bioPart([0, 0.82, -0.3], [0.38, 0.28, 0.38], bioWeaponMat);

    for (const side of [-1, 1]) {
      bioPart([side * 0.27, 1.27, 0.93], [0.06, 0.06, 0.05], eyeGlowMat);

      const shoulder = bioPart([side * 0.64, 1.12, 0.18], [0.3, 0.38, 0.32], trimMat);
      shoulder.rotation.z = side * -0.2;

      const arm = bioPart([side * 0.7, 0.83, 0.48], [0.2, 0.4, 0.2], fleshJointMat);
      arm.rotation.z = side * -0.35;

      bioPart([side * 0.75, 0.55, 0.72], [0.13, 0.42, 0.13], boneMat, 'cone').rotation.z = side * -0.4;

      const thigh = bioPart([side * 0.4, 0.65, -0.22], [0.2, 0.45, 0.22], armorMat);
      thigh.rotation.z = side * 0.15;

      bioPart([side * 0.45, 0.3, 0.02], [0.13, 0.35, 0.14], fleshJointMat);
      bioPart([side * 0.48, 0.08, 0.2], [0.14, 0.2, 0.12], boneMat);
      bioPart([side * 0.57, 1.62, -0.1], [0.14, 0.35, 0.14], trimMat, 'cone').rotation.z = side * 0.5;
    }

    bioPart([0, 0.9, -0.83], [0.22, 0.2, 0.48], armorMat);

  // ===========================================================================
  // HARPY
  // ===========================================================================
  } else if (uType === 'ty_harpy') {
    const s = 1.45;
    figBody.scale.setScalar(s);

    bioPart([0, 1.0, 0], [0.45, 0.42, 0.62], armorMat);
    bioPart([0, 1.35, -0.05], [0.48, 0.25, 0.58], trimMat);
    bioPart([0, 1.18, 0.52], [0.32, 0.24, 0.38], armorMat);
    bioPart([0, 1.15, 0.8], [0.23, 0.16, 0.24], boneMat);

    for (const side of [-1, 1]) {
      const wing = bioPart([side * 0.95, 1.25, -0.15], [0.85, 0.09, 0.48], armorMat);
      wing.rotation.y = side * -0.2;
      wing.rotation.z = side * -0.12;

      const wingTip = bioPart([side * 1.55, 1.2, -0.3], [0.45, 0.07, 0.28], trimMat);
      wingTip.rotation.z = side * -0.15;

      bioPart([side * 0.25, 1.18, 0.77], [0.055, 0.055, 0.05], eyeGlowMat);

      const arm = bioPart([side * 0.48, 0.93, 0.28], [0.16, 0.35, 0.15], fleshJointMat);
      arm.rotation.z = side * -0.5;

      bioPart([side * 0.63, 0.68, 0.55], [0.12, 0.35, 0.12], boneMat, 'cone').rotation.z = side * -0.45;

      const leg = bioPart([side * 0.27, 0.65, -0.05], [0.12, 0.36, 0.12], armorMat);
      leg.rotation.z = side * 0.2;

      bioPart([side * 0.3, 0.38, 0.18], [0.09, 0.3, 0.09], boneMat, 'cone');
      bioPart([side * 0.18, 1.55, -0.05], [0.09, 0.3, 0.09], trimMat, 'cone').rotation.z = side * 0.4;
    }

    bioPart([0, 0.78, -0.6], [0.14, 0.16, 0.38], armorMat);
    bioPart([0, 1.0, 0.95], [0.18, 0.12, 0.2], bioWeaponMat);

  // ===========================================================================
  // HIVE CRONE
  // ===========================================================================
  } else if (uType === 'ty_hive_crone') {
    const s = 1.5;
    figBody.scale.setScalar(s);

    bioPart([0, 1.0, 0], [0.4, 0.4, 0.65], armorMat);
    bioPart([0, 1.35, -0.05], [0.45, 0.22, 0.62], trimMat);
    bioPart([0, 1.18, 0.55], [0.28, 0.24, 0.36], armorMat);
    bioPart([0, 1.16, 0.84], [0.2, 0.15, 0.24], boneMat);

    for (const side of [-1, 1]) {
      const wing = bioPart([side * 0.9, 1.22, -0.1], [0.8, 0.08, 0.5], armorMat);
      wing.rotation.z = side * -0.12;

      const wingTip = bioPart([side * 1.48, 1.16, -0.38], [0.42, 0.07, 0.3], trimMat);
      wingTip.rotation.z = side * -0.25;

      bioPart([side * 0.22, 1.2, 0.8], [0.055, 0.055, 0.05], eyeGlowMat);

      const arm = bioPart([side * 0.45, 0.93, 0.3], [0.14, 0.35, 0.14], fleshJointMat);
      arm.rotation.z = side * -0.5;

      bioPart([side * 0.58, 0.67, 0.56], [0.1, 0.4, 0.1], boneMat, 'cone').rotation.z = side * -0.5;

      const leg = bioPart([side * 0.25, 0.65, -0.1], [0.12, 0.38, 0.12], armorMat);
      leg.rotation.z = side * 0.25;

      bioPart([side * 0.28, 0.35, 0.12], [0.09, 0.3, 0.09], boneMat, 'cone');
      bioPart([side * 0.15, 1.53, -0.05], [0.09, 0.32, 0.09], trimMat, 'cone').rotation.z = side * 0.4;

      const tentacle = bioPart([side * 0.38, 1.0, 0.88], [0.09, 0.4, 0.09], bioWeaponMat);
      tentacle.rotation.z = side * -0.45;
    }

    bioPart([0, 0.78, -0.65], [0.13, 0.16, 0.38], armorMat);

  // ===========================================================================
  // SPOROCYST
  // ===========================================================================
  } else if (uType === 'ty_sporocyst') {
    const s = 1.55;
    figBody.scale.setScalar(s);

    bioPart([0, 0.8, 0], [0.72, 0.8, 0.72], armorMat);
    bioPart([0, 1.12, -0.04], [0.68, 0.42, 0.66], trimMat);
    bioPart([0, 0.75, 0.02], [0.55, 0.55, 0.55], fleshJointMat);
    bioPart([0, 1.48, 0], [0.35, 0.35, 0.35], armorMat);

    for (let i = 0; i < 8; i++) {
      const angle = i * Math.PI / 4;
      const x = Math.cos(angle) * 0.55;
      const z = Math.sin(angle) * 0.55;

      const barrel = bioPart([x, 1.0, z], [0.18, 0.36, 0.18], bioWeaponMat);
      barrel.rotation.z = -Math.cos(angle) * 0.6;
      barrel.rotation.x = Math.sin(angle) * 0.6;

      bioPart([x * 1.2, 1.28, z * 1.2], [0.12, 0.28, 0.12], trimMat, 'cone');

      const root = bioPart([x * 1.2, 0.38, z * 1.2], [0.13, 0.4, 0.13], fleshJointMat);
      root.rotation.z = -Math.cos(angle) * 0.5;
    }

    for (let i = 0; i < 5; i++) {
      const angle = i * Math.PI * 2 / 5;
      const x = Math.cos(angle) * 0.38;
      const z = Math.sin(angle) * 0.38;

      bioPart([x, 1.62, z], [0.09, 0.35, 0.09], boneMat, 'cone').rotation.z = -Math.cos(angle) * 0.35;
    }

    bioPart([0, 1.65, 0], [0.22, 0.22, 0.22], eyeGlowMat);

  // ===========================================================================
  // NEUROTYRANT
  // ===========================================================================
  } else if (uType === 'ty_neurotyrant') {
    const s = 1.35;
    figBody.scale.setScalar(s);

    bioPart([0, 1.05, 0], [0.48, 0.5, 0.58], armorMat);
    bioPart([0, 1.4, -0.08], [0.55, 0.3, 0.6], trimMat);
    bioPart([0, 1.45, 0.42], [0.35, 0.32, 0.4], armorMat);
    bioPart([0, 1.53, 0.75], [0.3, 0.25, 0.28], bioWeaponMat);
    bioPart([0, 1.7, 0.78], [0.2, 0.15, 0.2], eyeGlowMat);

    for (const side of [-1, 1]) {
      bioPart([side * 0.24, 1.53, 0.72], [0.055, 0.055, 0.05], eyeGlowMat);

      const horn = bioPart([side * 0.4, 1.77, 0.05], [0.13, 0.43, 0.13], trimMat, 'cone');
      horn.rotation.z = side * 0.45;

      const tentacle = bioPart([side * 0.46, 1.12, 0.36], [0.11, 0.48, 0.11], bioWeaponMat);
      tentacle.rotation.z = side * -0.55;

      const arm = bioPart([side * 0.5, 0.84, 0.4], [0.14, 0.34, 0.14], fleshJointMat);
      arm.rotation.z = side * -0.35;

      bioPart([side * 0.55, 0.57, 0.62], [0.1, 0.3, 0.1], boneMat, 'cone').rotation.z = side * -0.5;

      const leg = bioPart([side * 0.28, 0.62, -0.12], [0.15, 0.4, 0.16], armorMat);
      leg.rotation.z = side * 0.15;

      bioPart([side * 0.3, 0.29, 0.04], [0.1, 0.32, 0.1], fleshJointMat);
      bioPart([side * 0.32, 0.08, 0.18], [0.1, 0.2, 0.1], boneMat);
    }

    bioPart([0, 0.8, -0.65], [0.15, 0.18, 0.4], armorMat);

    for (const side of [-1, 1]) {
      const node = bioPart([side * 0.42, 1.35, -0.35], [0.18, 0.22, 0.18], bioWeaponMat);
      node.rotation.z = side * 0.3;
    }

  // ===========================================================================
  // NORN EMISSARY
  // ===========================================================================
  } else if (uType === 'ty_norn_emissary') {
    const s = 1.9;
    figBody.scale.setScalar(s);

    bioPart([0, 1.2, -0.05], [0.65, 0.62, 0.75], armorMat);
    bioPart([0, 1.65, -0.08], [0.72, 0.34, 0.72], trimMat);
    bioPart([0, 1.45, 0.55], [0.4, 0.34, 0.4], armorMat);
    bioPart([0, 1.48, 0.88], [0.28, 0.23, 0.25], boneMat);

    for (const side of [-1, 1]) {
      bioPart([side * 0.24, 1.55, 0.9], [0.06, 0.06, 0.05], eyeGlowMat);

      const horn = bioPart([side * 0.38, 1.98, -0.1], [0.15, 0.48, 0.15], trimMat, 'cone');
      horn.rotation.z = side * 0.42;

      const arm = bioPart([side * 0.68, 1.2, 0.28], [0.2, 0.48, 0.2], fleshJointMat);
      arm.rotation.z = side * -0.4;

      const talon = bioPart([side * 0.76, 0.88, 0.56], [0.13, 0.5, 0.13], boneMat, 'cone');
      talon.rotation.z = side * -0.5;

      const thigh = bioPart([side * 0.42, 0.72, -0.2], [0.23, 0.48, 0.24], armorMat);
      thigh.rotation.z = side * 0.18;

      bioPart([side * 0.47, 0.35, 0.02], [0.14, 0.38, 0.14], fleshJointMat);
      bioPart([side * 0.49, 0.09, 0.2], [0.14, 0.23, 0.12], boneMat);

      const tendril = bioPart([side * 0.42, 1.22, 0.95], [0.1, 0.5, 0.1], bioWeaponMat);
      tendril.rotation.z = side * -0.55;
    }

    bioPart([0, 0.92, -0.88], [0.2, 0.2, 0.5], armorMat);
    bioPart([0, 1.05, 1.08], [0.22, 0.16, 0.18], bioWeaponMat);

  // ===========================================================================
  // NORN ASSIMILATOR
  // ===========================================================================
  } else if (uType === 'ty_norn_assimilator') {
    const s = 1.95;
    figBody.scale.setScalar(s);

    bioPart([0, 1.2, -0.05], [0.67, 0.6, 0.76], armorMat);
    bioPart([0, 1.65, -0.1], [0.74, 0.32, 0.72], trimMat);
    bioPart([0, 1.45, 0.55], [0.42, 0.34, 0.42], armorMat);
    bioPart([0, 1.43, 0.9], [0.3, 0.22, 0.28], boneMat);

    for (const side of [-1, 1]) {
      bioPart([side * 0.25, 1.55, 0.91], [0.06, 0.06, 0.05], eyeGlowMat);

      const horn = bioPart([side * 0.4, 1.98, -0.1], [0.15, 0.48, 0.15], trimMat, 'cone');
      horn.rotation.z = side * 0.42;

      const arm = bioPart([side * 0.68, 1.2, 0.32], [0.2, 0.46, 0.2], fleshJointMat);
      arm.rotation.z = side * -0.45;

      const talon = bioPart([side * 0.78, 0.87, 0.6], [0.14, 0.58, 0.13], boneMat, 'cone');
      talon.rotation.z = side * -0.52;

      const thigh = bioPart([side * 0.42, 0.72, -0.2], [0.23, 0.48, 0.24], armorMat);
      thigh.rotation.z = side * 0.18;

      bioPart([side * 0.47, 0.35, 0.02], [0.14, 0.38, 0.14], fleshJointMat);
      bioPart([side * 0.49, 0.09, 0.2], [0.14, 0.23, 0.12], boneMat);

      const harpoon = bioPart([side * 0.48, 1.2, 1.1], [0.12, 0.45, 0.12], bioWeaponMat, 'cone');
      harpoon.rotation.x = Math.PI / 2;
      harpoon.rotation.z = side * -0.15;
    }

    bioPart([0, 0.92, -0.88], [0.2, 0.2, 0.5], armorMat);
    bioPart([0, 1.05, 1.18], [0.22, 0.16, 0.2], bioWeaponMat);

  // ===========================================================================
  // GENERIC TYRANID FALLBACK
  // ===========================================================================

  } else {
    /*
     * Fallback model for Tyranid unit types that do not have a dedicated
     * procedural model yet.
     *
     * This intentionally remains simple. New Tyranid units should normally
     * receive their own branch above rather than relying on this silhouette.
     */

    figBody.scale.set(0.72, 0.72, 0.72);
    figBody.rotation.x = 0.22;

    // -------------------------------------------------------------------------
    // Legs
    // -------------------------------------------------------------------------

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

    // -------------------------------------------------------------------------
    // Tail
    // -------------------------------------------------------------------------

    const tail = new THREE.Mesh(
      getCachedCylinder(0.05, 0.015, 0.65, 12),
      fleshJointMat
    );
    tail.position.set(0, 0.28, -0.4);
    tail.rotation.x = -0.7;
    figBody.add(tail);

    // -------------------------------------------------------------------------
    // Abdomen
    // -------------------------------------------------------------------------

    const abdomen = new THREE.Mesh(
      getCachedCone(0.24, 0.65, 12),
      trimMat
    );
    abdomen.position.set(0, 0.65, 0);
    abdomen.rotation.x = 0.45;
    figBody.add(abdomen);

    // -------------------------------------------------------------------------
    // Head
    // -------------------------------------------------------------------------

    const head = new THREE.Mesh(
      getCachedCone(0.18, 0.55, 12),
      armorMat
    );
    head.position.set(0, 0.95, 0.2);
    head.rotation.x = 0.8;
    figBody.add(head);

    const eye = new THREE.Mesh(
      getCachedSphere(0.045, 10, 10),
      eyeGlowMat
    );
    eye.position.set(0, 0.95, 0.35);
    figBody.add(eye);

    // -------------------------------------------------------------------------
    // Generic bio-weapon
    // -------------------------------------------------------------------------

    const borer = new THREE.Mesh(
      getCachedCylinder(0.06, 0.08, 0.48, 12),
      bioWeaponMat
    );
    borer.position.set(0, 0.52, 0.32);
    borer.rotation.x = Math.PI / 2;
    figBody.add(borer);
  }
}