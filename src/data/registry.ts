import type { UnitDef, FormationType, WeaponProfileDetail, ArmourProfileDetail, UtilityProfileDetail } from './types';

// Faction Units
import { ascendantUnits } from './factions/ascendants/units';
import { concordatUnits } from './factions/concordat/units';
import { directorateUnits } from './factions/directorate/units';
import { elyriUnits } from './factions/elyri/units';
import { forsakenUnits } from './factions/forsaken/units';
import { gharUnits } from './factions/ghar/units';
import { revenantUnits } from './factions/revenant/units';
import { riftbornUnits } from './factions/riftborn/units';
import { tyranidUnits } from './factions/tyranids/units';
import { veykariUnits } from './factions/veykari/units';
import { sharedUnits } from './shared/equipment';

// Faction Weapons
import { ascendantRangeWeapons } from './factions/ascendants/range_weapons';
import { ascendantMeleeWeapons } from './factions/ascendants/melee_weapons';
import { concordatRangeWeapons } from './factions/concordat/range_weapons';
import { concordatMeleeWeapons } from './factions/concordat/melee_weapons';
import { directorateRangeWeapons } from './factions/directorate/range_weapons';
import { directorateMeleeWeapons } from './factions/directorate/melee_weapons';
import { elyriRangeWeapons } from './factions/elyri/range_weapons';
import { elyriMeleeWeapons } from './factions/elyri/melee_weapons';
import { forsakenRangeWeapons } from './factions/forsaken/range_weapons';
import { forsakenMeleeWeapons } from './factions/forsaken/melee_weapons';
import { gharRangeWeapons } from './factions/ghar/range_weapons';
import { gharMeleeWeapons } from './factions/ghar/melee_weapons';
import { revenantRangeWeapons } from './factions/revenant/range_weapons';
import { revenantMeleeWeapons } from './factions/revenant/melee_weapons';
import { riftbornRangeWeapons } from './factions/riftborn/range_weapons';
import { riftbornMeleeWeapons } from './factions/riftborn/melee_weapons';
import { tyranidRangeWeapons } from './factions/tyranids/range_weapons';
import { tyranidMeleeWeapons } from './factions/tyranids/melee_weapons';
import { veykariRangeWeapons } from './factions/veykari/range_weapons';
import { veykariMeleeWeapons } from './factions/veykari/melee_weapons';
import { sharedWeapons } from './shared/equipment';

export const WEAPON_REGISTRY: Record<string, WeaponProfileDetail> = {
  ...ascendantRangeWeapons,
  ...ascendantMeleeWeapons,
  ...concordatRangeWeapons,
  ...concordatMeleeWeapons,
  ...directorateRangeWeapons,
  ...directorateMeleeWeapons,
  ...elyriRangeWeapons,
  ...elyriMeleeWeapons,
  ...forsakenRangeWeapons,
  ...forsakenMeleeWeapons,
  ...gharRangeWeapons,
  ...gharMeleeWeapons,
  ...revenantRangeWeapons,
  ...revenantMeleeWeapons,
  ...riftbornRangeWeapons,
  ...riftbornMeleeWeapons,
  ...tyranidRangeWeapons,
  ...tyranidMeleeWeapons,
  ...veykariRangeWeapons,
  ...veykariMeleeWeapons,
  ...sharedWeapons
};

/**
 * Normalizes any faction identifier alias to its canonical wargame faction key.
 */
export function normalizeEquipmentFaction(fId?: string): string {
  if (!fId) return 'ascendants';
  const f = fId.toLowerCase().trim();
  switch (f) {
    case 'ascendants':
    case 'space_marines':
    case 'marines':
      return 'ascendants';
    case 'directorate':
    case 'guard':
    case 'astra_militarum':
      return 'directorate';
    case 'elyri':
    case 'eldar':
    case 'aeldari':
      return 'elyri';
    case 'veykari':
    case 'dark_eldar':
    case 'drukhari':
      return 'veykari';
    case 'ghar':
    case 'orcs':
    case 'orks':
      return 'ghar';
    case 'devourers':
    case 'tyranids':
      return 'devourers';
    case 'revenant':
    case 'necrons':
    case 'necros':
      return 'revenant';
    case 'concordat':
    case 'tau':
      return 'concordat';
    case 'riftborn':
    case 'daemons':
    case 'chaos_daemons':
      return 'riftborn';
    case 'forsaken':
    case 'chaos':
    case 'csm':
      return 'forsaken';
    default:
      return f;
  }
}

/**
 * Resolves a single weapon definition by its unique ID.
 */
export function resolveWeapon(weaponId: string): WeaponProfileDetail | undefined {
  return WEAPON_REGISTRY[weaponId];
}

/**
 * Returns all distinct weapon profiles for a given unit definition.
 * Authoritative source: unitDef.weaponIds (or unitDef.weapons).
 */
export function getUnitWeaponProfiles(unitDef: UnitDef): WeaponProfileDetail[] {
  const profiles: WeaponProfileDetail[] = [];

  // 1. Authoritative: weaponIds specified on the unit definition
  if (unitDef.weaponIds && unitDef.weaponIds.length > 0) {
    for (const wId of unitDef.weaponIds) {
      const wep = resolveWeapon(wId);
      if (wep) {
        profiles.push(wep);
      } else {
        console.warn(`[Equipment Registry] Weapon ID "${wId}" not found in WEAPON_REGISTRY for unit "${unitDef.name || unitDef.type}".`);
      }
    }
    if (profiles.length > 0) return profiles;
  }

  // 2. Explicit WeaponProfile objects provided on unitDef.weapons
  if (unitDef.weapons && unitDef.weapons.length > 0) {
    for (const wp of unitDef.weapons) {
      if (wp.id && WEAPON_REGISTRY[wp.id]) {
        profiles.push(WEAPON_REGISTRY[wp.id]);
      } else {
        const isMelee = wp.type === 'melee' || wp.range === 0;
        profiles.push({
          id: wp.id || 'custom_weapon',
          name: wp.name.toUpperCase(),
          type: wp.type || (isMelee ? 'melee' : 'ranged'),
          category: wp.category || (isMelee ? 'Combat Melee Weapon' : 'Tactical Firearm'),
          icon: wp.icon || (isMelee ? '⚔️' : '🔫'),
          range: wp.range !== undefined ? wp.range : (isMelee ? 0 : unitDef.range || 18),
          rangeDisplay: wp.rangeDisplay || (isMelee ? 'Melee' : `${wp.range || unitDef.range || 18}"`),
          strength: wp.strength || unitDef.s || 4,
          penetration: wp.penetration ?? wp.ap ?? 2,
          ap: wp.ap ?? wp.penetration ?? 2,
          damage: wp.damage || (isMelee ? unitDef.meleeDmg : unitDef.dmg) || 2,
          attacks: wp.attacks || 2,
          damageType: wp.damageType || (isMelee ? 'Kinetic Slashing' : 'Kinetic Ballistic'),
          effectiveAgainst: wp.effectiveAgainst || (isMelee ? ['Infantry Formations', 'Light Armour'] : ['Standard Infantry', 'Unarmoured Units']),
          weakAgainst: wp.weakAgainst || ['Heavy Refractor Barriers'],
          special: wp.special || 'Standard military issue.',
          allowedFactions: wp.allowedFactions || ['all']
        });
      }
    }
    if (profiles.length > 0) return profiles;
  }

  // 3. Fallback generic profile
  const fallback = getUnitWeaponProfile(unitDef);
  if (fallback) profiles.push(fallback);
  return profiles;
}

/**
 * Resolves the unit's dedicated primary RANGED weapon profile.
 * Returns null if the unit has no ranged weapon capability.
 */
export function getUnitRangedWeaponProfile(unitDef: UnitDef): WeaponProfileDetail | null {
  const allWeapons = getUnitWeaponProfiles(unitDef);
  return allWeapons.find(w => w.type === 'ranged' || (w.range !== undefined && w.range > 2)) || null;
}

/**
 * Resolves the unit's dedicated primary MELEE weapon profile.
 * Returns null if the unit has no melee weapon capability.
 */
export function getUnitMeleeWeaponProfile(unitDef: UnitDef): WeaponProfileDetail | null {
  const allWeapons = getUnitWeaponProfiles(unitDef);
  return allWeapons.find(w => w.type === 'melee' || (w.range !== undefined && w.range <= 2)) || null;
}

/**
 * Backwards compatible primary weapon resolver.
 */
export function getUnitWeaponProfile(unitDef: UnitDef): WeaponProfileDetail {
  const allWeapons = getUnitWeaponProfiles(unitDef);
  if (allWeapons.length > 0) return allWeapons[0];

  const rangeVal = unitDef.range > 2 ? unitDef.range : 0;
  const isMelee = rangeVal === 0;
  return {
    id: 'default_armament',
    name: (unitDef.weapon || 'Standard Armament').toUpperCase(),
    type: isMelee ? 'melee' : 'ranged',
    category: 'Standard Tactical Armament',
    icon: isMelee ? '⚔️' : '🔫',
    range: rangeVal,
    rangeDisplay: rangeVal > 0 ? `${rangeVal}"` : 'Melee',
    strength: unitDef.s || 4,
    penetration: 2,
    ap: 2,
    damage: unitDef.dmg || 2,
    attacks: unitDef.squadSize > 1 ? 2 : 3,
    damageType: 'Kinetic Ballistic / Energy',
    effectiveAgainst: ['Infantry Cohorts', 'Light Units'],
    weakAgainst: ['Heavy Refractor Barriers'],
    special: 'Standard Field Issue: Reliable tactical fire.',
    allowedFactions: ['all']
  };
}

/**
 * Procedural/Specific armour database for all units
 */
export function getUnitArmourProfile(unitDef: UnitDef): ArmourProfileDetail {
  const faction = normalizeEquipmentFaction(unitDef.factionId);
  const sv = unitDef.armorSave || unitDef.sv || 3;
  const toughness = unitDef.toughness || unitDef.t || 4;
  const armourVal = 7 - sv; // 2+ save -> 5-6 armor score, 3+ save -> 4-5 armor score

  // 1. Ascendants (Space Marines)
  if (faction === 'ascendants') {
    return {
      name: 'ASCENDANT POWER ARMOUR MK-X',
      category: 'Powered Exoskeletal Ceramite',
      icon: '🛡️',
      armour: Math.max(5, armourVal + 2),
      toughness: toughness,
      resistance: 4,
      coverage: 3,
      protectionAgainst: ['Kinetic Shrapnel', 'Plasma Discharges', 'Standard Small Arms'],
      vulnerableTo: ['Corrosive Chemical Acid', 'Psionic Mind-Blasts'],
      special: 'Reinforced Ceramite: Reduces incoming high-penetration AP values by 1.'
    };
  }

  // 2. Directorate (Astra Militarum / Guard)
  if (faction === 'directorate') {
    return {
      name: 'COMPOSITE CARAPACE FLAK WEAVE',
      category: 'Layered Ballistic Carapace',
      icon: '🪖',
      armour: Math.max(3, armourVal),
      toughness: toughness,
      resistance: 3,
      coverage: 3,
      protectionAgainst: ['Indirect Shrapnel', 'Laser Beams', 'Explosive Shockwaves'],
      vulnerableTo: ['High-Calibre AP Rounds', 'Monomolecular Blades'],
      special: 'Ablative Padding: +1 Cover save bonus when entrenched behind barricades.'
    };
  }

  // 3. Elyri (Aeldari / Craftworld)
  if (faction === 'elyri') {
    return {
      name: 'WRAITHBONE SPIRIT-CARAPACE',
      category: 'Psychoreactive Material',
      icon: '✨',
      armour: Math.max(4, armourVal + 1),
      toughness: toughness,
      resistance: 5,
      coverage: 2,
      protectionAgainst: ['Psionic Attacks', 'Warp Distortions', 'Laser Fire'],
      vulnerableTo: ['High-Explosive Artillery', 'Crushing Mass Loads'],
      special: 'Phase Reflex: 5+ invulnerable dodge save against all ranged attacks.'
    };
  }

  // 4. Veykari (Drukhari / Dark Eldar)
  if (faction === 'veykari') {
    return {
      name: 'GHOSTPLATE SHADOW SUIT',
      category: 'Barbed Micro-Splinter Weave',
      icon: '🗡️',
      armour: Math.max(4, armourVal),
      toughness: toughness,
      resistance: 4,
      coverage: 2,
      protectionAgainst: ['Toxins & Venoms', 'Precision Ballistics'],
      vulnerableTo: ['Area-of-Effect Flamethrowers', 'Heavy Shock Artillery'],
      special: 'Shadow Flicker: Target suffers -1 Accuracy when targeting this unit past 18".'
    };
  }

  // 5. Ghar (Orks / Greenskins)
  if (faction === 'ghar') {
    return {
      name: "'EAVY SCRAP-IRON BATTLEPLATE",
      category: 'Crude Welded Armor Plates',
      icon: '🐗',
      armour: Math.max(4, armourVal + 1),
      toughness: toughness + 1,
      resistance: 3,
      coverage: 3,
      protectionAgainst: ['Blunt Trauma', 'Small Arms Volleys'],
      vulnerableTo: ['Precision Snipers', 'Plasma Piercing Guns'],
      special: "'Ere We Go: Toughness increases by +1 during turns in which unit charges."
    };
  }

  // 6. Devourers (Tyranids / Hive Fleet)
  if (faction === 'devourers') {
    return {
      name: 'HARDENED CHITIN EXOSKELETON',
      category: 'Bio-Organic Chitinous Carapace',
      icon: '👾',
      armour: Math.max(4, armourVal + 1),
      toughness: toughness,
      resistance: 4,
      coverage: 3,
      protectionAgainst: ['Kinetic Impact', 'Thermal Burns', 'Laser Beams'],
      vulnerableTo: ['Concentrated Flame Munitions', 'Cryo Freezing'],
      special: 'Rapid Regeneration: Regenerates 1 lost Wound at the start of each friendly turn.'
    };
  }

  // 7. Revenant (Necrons / Undying)
  if (faction === 'revenant') {
    return {
      name: 'LIVING METAL NECRODERMIS',
      category: 'Self-Repairing Nanometal',
      icon: '⚡',
      armour: Math.max(5, armourVal + 2),
      toughness: toughness + 1,
      resistance: 5,
      coverage: 3,
      protectionAgainst: ['Molecular Piercing', 'Gauss Fire', 'Kinetic Shrapnel'],
      vulnerableTo: ['Antimatter Disrupters', 'Super-Mass Graviton Weapons'],
      special: 'Reanimation Protocols: 5+ roll upon defeat to stand back up with 1 Wound.'
    };
  }

  // 8. Concordat (T\'au Empire)
  if (faction === 'concordat') {
    return {
      name: 'NANO-COMPOSITE BATTLESUIT ALLOY',
      category: 'Advanced Nano-Laminate Plating',
      icon: '💠',
      armour: Math.max(4, armourVal + 1),
      toughness: toughness,
      resistance: 4,
      coverage: 3,
      protectionAgainst: ['Energy Blasts', 'Plasma Discharges', 'Electronic Jammers'],
      vulnerableTo: ['Close Combat Power Weapons', 'Heavy Corrosives'],
      special: 'Energy Shield Matrix: Absorbs the first 2 points of damage taken per battle round.'
    };
  }

  // 9. Riftborn (Chaos Daemons)
  if (faction === 'riftborn') {
    return {
      name: 'WARP-DISPLACEMENT AURA',
      category: 'Ethereal Non-Euclidean Shield',
      icon: '🌀',
      armour: Math.max(5, armourVal + 2),
      toughness: toughness,
      resistance: 6,
      coverage: 2,
      protectionAgainst: ['Physical Projectiles', 'Kinetic Melee Blades'],
      vulnerableTo: ['Blessed / Sanctified Weapons', 'Null-Field Grenades'],
      special: 'Dimensional Incorporeal: 4+ invulnerable save against non-magical damage.'
    };
  }

  // 10. Forsaken (Chaos Space Marines)
  if (faction === 'forsaken') {
    return {
      name: 'WARP-FORGED FLESHMETAL PLATE',
      category: 'Possessed Daemon-Fused Ceramite',
      icon: '💀',
      armour: Math.max(5, armourVal + 2),
      toughness: toughness,
      resistance: 4,
      coverage: 3,
      protectionAgainst: ['Direct Ballistic Hits', 'Explosive Concussions'],
      vulnerableTo: ['Sanctified Laser Cannons', 'Psychic Null Fields'],
      special: 'Daemonic Resilience: Ignores the first point of damage inflicted by each attack.'
    };
  }

  // Generic / Auxiliary Fallback
  return {
    name: 'REINFORCED CARAPACE PLATING',
    category: 'Standard Armoured Weave',
    icon: '🛡️',
    armour: Math.max(3, armourVal),
    toughness: toughness,
    resistance: 3,
    coverage: 2,
    protectionAgainst: ['Shrapnel', 'Small Arms'],
    vulnerableTo: ['Heavy Anti-Tank Munitions'],
    special: 'Standard Armor: Baseline kinetic protection.'
  };
}

/**
 * Authoritative utility profile resolver for units
 */
export function getUnitUtilityProfile(unitDef: UnitDef): UtilityProfileDetail {
  const move = unitDef.movement || unitDef.m || 6;
  const rawAwareness = unitDef.awareness !== undefined ? unitDef.awareness : 14;
  const awareness = Math.min(9, Math.max(3, Math.floor(rawAwareness / 3)));
  const morale = unitDef.leadership || 7;

  // Resolve Movement Type
  let movementType: 'ground' | 'vehicle' | 'fly' | 'colossus' = 'ground';
  const nameLower = (unitDef.name || '').toLowerCase();
  const titleLower = (unitDef.title || '').toLowerCase();

  if (unitDef.movementType) {
    movementType = unitDef.movementType;
  } else if (
    unitDef.isLarge ||
    titleLower.includes('titan') ||
    titleLower.includes('dreadnought') ||
    titleLower.includes('carnifex') ||
    titleLower.includes('colossus') ||
    titleLower.includes('avatar')
  ) {
    movementType = 'colossus';
  } else if (
    titleLower.includes('jump') ||
    titleLower.includes('skimmer') ||
    titleLower.includes('aerial') ||
    titleLower.includes('skiff') ||
    titleLower.includes('flight') ||
    titleLower.includes('raptor') ||
    titleLower.includes('scourge') ||
    nameLower.includes('skiff')
  ) {
    movementType = 'fly';
  } else if (
    titleLower.includes('tank') ||
    titleLower.includes('sentinel') ||
    titleLower.includes('walker') ||
    titleLower.includes('wagon') ||
    titleLower.includes('basilisk') ||
    titleLower.includes('engine')
  ) {
    movementType = 'vehicle';
  } else {
    movementType = 'ground';
  }

  // Resolve Awareness Type
  let awarenessType: 'sensory' | 'vision' | 'psychic' = 'vision';
  const faction = normalizeEquipmentFaction(unitDef.factionId);

  if (unitDef.awarenessType) {
    awarenessType = unitDef.awarenessType;
  } else if (
    faction === 'riftborn' ||
    faction === 'elyri' ||
    titleLower.includes('farseer') ||
    titleLower.includes('psychic') ||
    titleLower.includes('herald') ||
    titleLower.includes('archon')
  ) {
    awarenessType = 'psychic';
  } else if (
    faction === 'devourers' ||
    faction === 'ghar' ||
    titleLower.includes('beast') ||
    titleLower.includes('swarm') ||
    titleLower.includes('stalker')
  ) {
    awarenessType = 'sensory';
  } else {
    awarenessType = 'vision';
  }

  // Tactical visual icon
  let icon = '🧭';
  if (movementType === 'fly') icon = '🚀';
  else if (movementType === 'vehicle') icon = '⚙️';
  else if (movementType === 'colossus') icon = '🏛️';
  else if (awarenessType === 'psychic') icon = '✨';
  else if (awarenessType === 'sensory') icon = '📡';

  return {
    movement: move,
    awareness,
    morale,
    movementType,
    awarenessType,
    movementTypeDisplay: movementType.toUpperCase(),
    awarenessTypeDisplay: awarenessType.toUpperCase(),
    icon
  };
}

/**
 * Data Integrity and Defensive Validation:
 * Validates that a unit definition's equipment, weapon profiles, armour profiles,
 * and utility attributes are complete and valid.
 */
export function validateUnitEquipment(unitDef: UnitDef): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!unitDef) {
    return { valid: false, errors: ['Unit definition is null or undefined.'] };
  }

  const unitFaction = normalizeEquipmentFaction(unitDef.factionId);

  // 1. Validate weapon IDs if declared
  if (unitDef.weaponIds) {
    if (!Array.isArray(unitDef.weaponIds) || unitDef.weaponIds.length === 0) {
      errors.push(`Unit "${unitDef.name || unitDef.type}" has an invalid/empty weaponIds array.`);
    } else {
      for (const wId of unitDef.weaponIds) {
        const weaponDef = resolveWeapon(wId);
        if (!weaponDef) {
          errors.push(`Unit "${unitDef.name}" references non-existent weapon ID: "${wId}"`);
        } else {
          // Defensive Faction Check
          if (
            weaponDef.allowedFactions &&
            !weaponDef.allowedFactions.includes('all') &&
            !weaponDef.allowedFactions.includes(unitFaction) &&
            !weaponDef.allowedFactions.includes(unitDef.factionId)
          ) {
            errors.push(
              `Unit "${unitDef.name}" (faction: ${unitFaction}) illegally equipped faction-restricted weapon "${weaponDef.name}" (${wId}). Allowed: [${weaponDef.allowedFactions.join(', ')}]`
            );
          }
        }
      }
    }
  }

  // 2. Validate resolved weapons
  const weapons = getUnitWeaponProfiles(unitDef);
  if (!weapons || weapons.length === 0) {
    errors.push(`Unit "${unitDef.name || unitDef.type}" has no resolved weapon profiles.`);
  } else {
    weapons.forEach((w, idx) => {
      if (!w.name || w.name.trim() === '') {
        errors.push(`Unit "${unitDef.name}" weapon #${idx + 1} is missing a name.`);
      }
      if (w.damage === undefined || w.damage <= 0) {
        errors.push(`Unit "${unitDef.name}" weapon "${w.name}" has invalid damage: ${w.damage}`);
      }
      if (w.strength === undefined || w.strength <= 0) {
        errors.push(`Unit "${unitDef.name}" weapon "${w.name}" has invalid strength: ${w.strength}`);
      }
      if (w.range === undefined || w.range < 0) {
        errors.push(`Unit "${unitDef.name}" weapon "${w.name}" has invalid range: ${w.range}`);
      }
    });
  }

  // 3. Validate armour
  const armour = getUnitArmourProfile(unitDef);
  if (!armour || !armour.name) {
    errors.push(`Unit "${unitDef.name || unitDef.type}" failed to resolve an armour profile.`);
  }

  // 4. Validate utility
  const utility = getUnitUtilityProfile(unitDef);
  if (!utility || !utility.movementType || !utility.awarenessType) {
    errors.push(`Unit "${unitDef.name || unitDef.type}" failed to resolve a utility profile.`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

const RAW_UNIT_DEFS: Record<string, UnitDef> = {
  ...ascendantUnits,
  ...concordatUnits,
  ...directorateUnits,
  ...elyriUnits,
  ...forsakenUnits,
  ...gharUnits,
  ...revenantUnits,
  ...riftbornUnits,
  ...tyranidUnits,
  ...veykariUnits,
  ...sharedUnits
};

// Enrich all UNIT_DEFS with physical profiles, dynamic formations, morale schemas, and combat profile fields
Object.values(RAW_UNIT_DEFS).forEach(def => {
  def.armorSave = def.armorSave !== undefined ? def.armorSave : def.sv;
  def.sv = def.armorSave;
  def.role = def.role || def.title || (def.isCharacter ? 'Commander' : def.isLarge ? 'Heavy Support' : 'Troops');
  def.size = def.size || (def.isLarge ? 2 : (def.baseRadius && def.baseRadius > 1.8 ? 2 : 1));
  def.tags = def.tags || [def.factionId, def.isCharacter ? 'character' : 'infantry', def.isLarge ? 'vehicle' : ''];

  // 1. Authoritatively resolve all equipped weapon profiles from equipment registry
  const resolvedWeapons = getUnitWeaponProfiles(def);
  def.weapons = resolvedWeapons;

  // 2. Derive legacy convenience accessors
  def.rangedWeapon = resolvedWeapons.find(w => w.type === 'ranged' || (w.range !== undefined && w.range > 2));
  def.meleeWeapon = resolvedWeapons.find(w => w.type === 'melee' || (w.range !== undefined && w.range <= 2));
  def.ranged = def.rangedWeapon !== undefined;
  def.hasMelee = def.meleeWeapon !== undefined;

  // 3. Fallback weapon summary string if missing
  if (!def.weapon) {
    def.weapon = resolvedWeapons.map(w => w.name).join(' & ');
  }

  const isLarge = !!def.isLarge;
  const isHeavy = (def.s >= 5 || def.t >= 5) && !isLarge;
  const isSwarm = def.squadSize >= 5;

  def.baseRadius =
    def.baseRadius ||
    (isLarge ? 2.35 : def.isCharacter ? 1.05 : def.squadSize === 1 ? 1.15 : isSwarm ? 0.58 : 0.75);

  let fType: FormationType = 'wedge';
  if (def.range >= 36 && def.squadSize >= 3) fType = 'line';
  else if (isSwarm) fType = 'loose';
  else if (def.squadSize === 3 && (def.hasMelee || def.m >= 10)) fType = 'wedge';
  else if (def.squadSize === 3) fType = 'wedge';
  else if (def.squadSize === 1) fType = 'block';

  def.physical = def.physical || {
    radius: isLarge ? 2.2 : isHeavy ? 0.95 : 0.65,
    sepRadius: isLarge ? 3.2 : isHeavy ? 1.55 : 1.25,
    mass: isLarge ? 8.0 : isHeavy ? 2.5 : 1.0,
    maxSpeed: (def.m || 6) * 2.2,
    accel: 30.0
  };

  def.formation = def.formation || {
    type: fType,
    spacing: isSwarm ? 1.85 : isHeavy ? 1.7 : 1.45,
    cohesionWeight: 1.0,
    separationWeight: 1.25,
    obstacleAvoidWeight: 2.2
  };

  def.moraleProfile = def.moraleProfile || {
    base: 100,
    brokenThreshold: 10,
    panickedThreshold: 20,
    distressedThreshold: 40,
    shakenThreshold: 60,
    recoverRate: 15,
    casualtyPenalty: 20
  };

  // Development-time validation of equipment integrity
  const validation = validateUnitEquipment(def);
  if (!validation.valid) {
    console.warn(`[Equipment Validation Error] Unit "${def.name}" (${def.type}):`, validation.errors);
  }
});

export const UNIT_DEFS: Record<string, UnitDef> = RAW_UNIT_DEFS;
export const UNIT_ROSTER = UNIT_DEFS;
