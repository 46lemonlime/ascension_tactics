import type { UnitDef } from './types';

export interface WeaponProfileDetail {
  name: string;
  category: string;
  icon: string;
  image?: string;
  range: string;
  strength: number;
  penetration: number;
  damage: number;
  attacks: number;
  damageType: string;
  effectiveAgainst: string[];
  weakAgainst: string[];
  special: string;
}

export interface ArmourProfileDetail {
  name: string;
  category: string;
  icon: string;
  image?: string;
  armour: number;
  toughness: number;
  resistance: number;
  coverage: number;
  protectionAgainst: string[];
  vulnerableTo: string[];
  special: string;
}

/**
 * Procedural/Specific weapon database for all units
 */
export function getUnitWeaponProfile(unitDef: UnitDef): WeaponProfileDetail {
  const faction = unitDef.factionId || 'ascendants';
  const name = unitDef.weapon || 'Standard Armament';
  const dmg = unitDef.dmg || 2;
  const str = unitDef.s || 4;
  const attacks = (unitDef.weapons && unitDef.weapons[0]?.attacks) || (unitDef.squadSize > 1 ? 2 : 3);
  const rangeStr = unitDef.range > 2 ? `${unitDef.range}"` : 'Melee';

  // Faction-specific tailored weapon profiles
  if (faction.includes('marine') || faction === 'ascendants') {
    if (name.toLowerCase().includes('plasma')) {
      return {
        name: 'MK-VII PLASMA PISTOL & RELIC BLADE',
        category: 'Plasma / Melee Hybrid',
        icon: '⚡',
        range: '16"',
        strength: str + 1,
        penetration: 4,
        damage: dmg + 1,
        attacks: 3,
        damageType: 'Superheated Plasma',
        effectiveAgainst: ['Heavy Armour', 'Mechanical Walkers', 'Elite Commanders'],
        weakAgainst: ['Energy Shields', 'Heat-Resistant Chitin'],
        special: 'Overcharge: Critical rolls yield +1 Damage. Relic Blade grants parry response in melee.'
      };
    }
    if (name.toLowerCase().includes('assault cannon') || name.toLowerCase().includes('dreadnought')) {
      return {
        name: 'ROTARY ASSAULT CANNON & POWER FIST',
        category: 'Heavy Rotary Ballistic',
        icon: '💥',
        range: '30"',
        strength: 6,
        penetration: 3,
        damage: 4,
        attacks: 4,
        damageType: 'Kinetic High-Velocity',
        effectiveAgainst: ['Infantry Cohorts', 'Light Vehicles', 'Fortifications'],
        weakAgainst: ['Deflective Energy Screens', 'Displacement Fields'],
        special: 'Devastating Fire: Re-rolls wound rolls of 1 against non-shielded targets.'
      };
    }
    if (name.toLowerCase().includes('battery') || name.toLowerCase().includes('heavy')) {
      return {
        name: 'HEAVY BOLTER SUPPRESSION BATTERY',
        category: 'Sustained Heavy Ballistic',
        icon: '💥',
        range: '38"',
        strength: 5,
        penetration: 3,
        damage: 3,
        attacks: 3,
        damageType: 'Mass-Reactive Explosive',
        effectiveAgainst: ['Medium Armour', 'Squad Formations', 'Light Cover'],
        weakAgainst: ['Reinforced Titanium Bunkers', 'Phase Shields'],
        special: 'Suppression: Hits apply -1 Movement penalty to targets until next round.'
      };
    }
    return {
      name: 'GODWYN-PATTERN BOLTER',
      category: 'Standard Issue Tactical Ballistic',
      icon: '🔫',
      range: rangeStr,
      strength: str,
      penetration: 2,
      damage: dmg,
      attacks: attacks,
      damageType: 'Kinetic Micro-Missile',
      effectiveAgainst: ['Standard Infantry', 'Unarmoured Swarms'],
      weakAgainst: ['Heavy Chitin Plates', 'Power Field Barriers'],
      special: 'Rapid Fire: Gain +1 Attack when firing at targets within half maximum range.'
    };
  }

  if (faction === 'directorate') {
    if (name.toLowerCase().includes('autocannon') || name.toLowerCase().includes('ordnance')) {
      return {
        name: 'TWIN-LINKED AUTOCANNON BATTERY',
        category: 'Heavy Kinetic Artillery',
        icon: '💥',
        range: '40"',
        strength: 5,
        penetration: 3,
        damage: 3,
        attacks: 3,
        damageType: 'High-Explosive Kinetic',
        effectiveAgainst: ['Light Armour', 'Hover Skimmers', 'Exosuits'],
        weakAgainst: ['Heavy Refractor Shields', 'Subterranean Targets'],
        special: 'Long-Range Calibration: Target receives no cover bonuses beyond 24".'
      };
    }
    return {
      name: 'CANTRIC-PATTERN LAS-RIFLE',
      category: 'Directed Energy Carbine',
      icon: '⚡',
      range: rangeStr,
      strength: str,
      penetration: 1,
      damage: dmg,
      attacks: attacks,
      damageType: 'Coherent Laser Beam',
      effectiveAgainst: ['Light Infantry', 'Unarmoured Flesh'],
      weakAgainst: ['Heavy Power Armour', 'Ablative Ceramic Plating'],
      special: 'First Rank Fire: Cohorts with 3+ surviving models gain +1 volley attack.'
    };
  }

  if (faction === 'elyri') {
    return {
      name: 'MONOFILAMENT SHURIKEN CATAPULT',
      category: 'Exotic Monomolecular',
      icon: '✨',
      range: rangeStr,
      strength: str,
      penetration: 4,
      damage: dmg,
      attacks: attacks,
      damageType: 'Monomolecular Shuriken',
      effectiveAgainst: ['Heavy Infantry', 'Exoskeletons', 'Living Flesh'],
      weakAgainst: ['Energy Forcefields', 'Reinforced Armoured Hulls'],
      special: 'Bladestorm: Natural wound rolls of 6 automatically pierce all armor saves.'
    };
  }

  if (faction === 'veykari') {
    return {
      name: 'SPLINTER CANNON & KLAIVE',
      category: 'Toxic Crystal Projectile',
      icon: '🗡️',
      range: rangeStr,
      strength: str,
      penetration: 3,
      damage: dmg,
      attacks: attacks,
      damageType: 'Virulent Splinter / Neurotoxin',
      effectiveAgainst: ['Biological Organisms', 'Light Infantry'],
      weakAgainst: ['Synthetic Automata', 'Armoured Vehicles'],
      special: 'Poisoned Crystals: Wounds on fixed 4+ regardless of enemy Toughness.'
    };
  }

  if (faction === 'ghar') {
    return {
      name: 'BIG SHOOTA & POWER KLAW',
      category: 'Brutal Scrap Ballistics',
      icon: '🐗',
      range: rangeStr,
      strength: str + 1,
      penetration: 2,
      damage: dmg + 1,
      attacks: attacks + 1,
      damageType: 'Heavy Ballistic Lead',
      effectiveAgainst: ['Light Vehicles', 'Unprotected Infantry', 'Close Combat'],
      weakAgainst: ['Precision Snipers', 'Long-Range Fortifications'],
      special: 'Dakka Volley: Extra hit generated on natural 6s during attack roll.'
    };
  }

  if (faction === 'devourers') {
    return {
      name: 'BIO-ACID CANNON & SCYTHING TALONS',
      category: 'Living Bio-Munition',
      icon: '👾',
      range: rangeStr,
      strength: str,
      penetration: 3,
      damage: dmg,
      attacks: attacks,
      damageType: 'Corrosive Bio-Acid',
      effectiveAgainst: ['Metallic Armour', 'Fortifications', 'Organic Units'],
      weakAgainst: ['Energy Shields', 'Cryo-Coated Hulls'],
      special: 'Flesh Corrosive: Melts 1 point of enemy Armour save permanently per hit.'
    };
  }

  if (faction === 'revenant') {
    return {
      name: 'GAUSS DISINTEGRATOR FLAYER',
      category: 'Molecular Disintegration',
      icon: '⚡',
      range: rangeStr,
      strength: str,
      penetration: 4,
      damage: dmg + 1,
      attacks: attacks,
      damageType: 'Gauss Molecular Field',
      effectiveAgainst: ['Heavy Armour', 'Tanks & Engines', 'Mechanical Plating'],
      weakAgainst: ['Psychic Dispersal Barriers', 'Phase Shifters'],
      special: 'Gauss Disruption: Automatically damages vehicles and heavy armor on hit rolls of 6.'
    };
  }

  if (faction === 'concordat') {
    return {
      name: 'PULSE RIFLE & RAIL ACCELERATOR',
      category: 'Advanced Plasma Induction',
      icon: '💠',
      range: rangeStr,
      strength: str + 1,
      penetration: 3,
      damage: dmg + 1,
      attacks: attacks,
      damageType: 'Induction Plasma / Rail Sub-Munition',
      effectiveAgainst: ['Heavy Armour', 'Mechanical Walkers', 'Long-Range Targets'],
      weakAgainst: ['Energy Shields', 'Heat-Resistant Targets'],
      special: 'Target Lock: Markerlight coordination grants +1 Accuracy at extreme ranges.'
    };
  }

  if (faction === 'riftborn') {
    return {
      name: 'WARP BLADE & HELLFIRE NEXUS',
      category: 'Dimensional Warpfire',
      icon: '🌀',
      range: rangeStr,
      strength: str + 1,
      penetration: 4,
      damage: dmg + 1,
      attacks: attacks,
      damageType: 'Dimensional Warpfire',
      effectiveAgainst: ['Mortal Armies', 'Standard Armor', 'Sanity/Morale'],
      weakAgainst: ['Sanctified Aegis Fields', 'Anti-Psionic Wards'],
      special: 'Reality Tear: Ignores non-magical physical cover and shields.'
    };
  }

  // Forsaken
  return {
    name: 'CORRUPTED BOLTER & DAEMON AXE',
    category: 'Infernal Chaos Munition',
    icon: '💀',
    range: rangeStr,
    strength: str + 1,
    penetration: 3,
    damage: dmg + 1,
    attacks: attacks,
    damageType: 'Unholy Warp-Tainted Shot',
    effectiveAgainst: ['Armoured Infantry', 'Light Fortifications'],
    weakAgainst: ['Consecrated Armor', 'Aura Shields'],
    special: 'Malicious Volley: Hits trigger an immediate morale roll on the targeted squad.'
  };
}

/**
 * Procedural/Specific armour database for all units
 */
export function getUnitArmourProfile(unitDef: UnitDef): ArmourProfileDetail {
  const faction = unitDef.factionId || 'ascendants';
  const sv = unitDef.armorSave || unitDef.sv || 3;
  const toughness = unitDef.toughness || unitDef.t || 4;
  const armourVal = 7 - sv; // 2+ save -> 5-6 armor score, 3+ save -> 4-5 armor score

  if (faction.includes('marine') || faction === 'ascendants') {
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

  // Forsaken
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

export interface UtilityProfileDetail {
  movement: number;
  awareness: number;
  morale: number;
  movementType: 'ground' | 'vehicle' | 'fly' | 'colossus';
  awarenessType: 'sensory' | 'vision' | 'psychic';
  movementTypeDisplay: string;
  awarenessTypeDisplay: string;
  icon: string;
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
  const faction = (unitDef.factionId || '').toLowerCase();

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

