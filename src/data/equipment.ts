import type { UnitDef } from './types';

export interface WeaponProfileDetail {
  name: string;
  type?: 'ranged' | 'melee';
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
 * Normalizes any faction identifier alias (e.g. necros, eldar, tau, dark_eldar, orcs, tyranids, chaos, marines)
 * to its canonical wargame faction key.
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
    case 'chaos_marines':
      return 'forsaken';
    default:
      return f;
  }
}

/**
 * Resolves the unit's dedicated RANGED weapon profile.
 * Returns null if the unit has no ranged weapon capability.
 */
export function getUnitRangedWeaponProfile(unitDef: UnitDef): WeaponProfileDetail | null {
  const isRanged = unitDef.ranged ?? (unitDef.range !== undefined && unitDef.range > 2);
  if (!isRanged) return null;

  const faction = normalizeEquipmentFaction(unitDef.factionId);
  const name = unitDef.weapon || 'Standard Armament';
  const dmg = unitDef.dmg || 2;
  const str = unitDef.s || 4;
  const attacks = (unitDef.weapons && unitDef.weapons[0]?.attacks) || (unitDef.squadSize > 1 ? 2 : 3);
  const rangeStr = unitDef.range > 2 ? `${unitDef.range}"` : '24"';

  // 1. Ascendants
  if (faction === 'ascendants') {
    if (name.toLowerCase().includes('plasma')) {
      return {
        name: 'MK-VII PLASMA PISTOL',
        type: 'ranged',
        category: 'Superheated Plasma Projector',
        icon: '⚡',
        range: '16"',
        strength: str + 1,
        penetration: 4,
        damage: dmg + 1,
        attacks: 3,
        damageType: 'Superheated Plasma',
        effectiveAgainst: ['Heavy Armour', 'Mechanical Walkers', 'Elite Commanders'],
        weakAgainst: ['Energy Shields', 'Heat-Resistant Chitin'],
        special: 'Overcharge: Critical rolls yield +1 Damage.'
      };
    }
    if (name.toLowerCase().includes('assault cannon') || name.toLowerCase().includes('dreadnought')) {
      return {
        name: 'ROTARY ASSAULT CANNON',
        type: 'ranged',
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
    if (name.toLowerCase().includes('battery') || name.toLowerCase().includes('heavy') || name.toLowerCase().includes('centurion')) {
      return {
        name: 'HEAVY BOLTER SUPPRESSION BATTERY',
        type: 'ranged',
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
      type: 'ranged',
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

  // 2. Directorate
  if (faction === 'directorate') {
    if (name.toLowerCase().includes('autocannon') || name.toLowerCase().includes('ordnance')) {
      return {
        name: 'TWIN-LINKED AUTOCANNON BATTERY',
        type: 'ranged',
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
    if (name.toLowerCase().includes('earthshaker') || name.toLowerCase().includes('basilisk')) {
      return {
        name: 'EARTHSHAKER SIEGE CANNON',
        type: 'ranged',
        category: 'Long-Range Ordnance',
        icon: '🎯',
        range: '50"',
        strength: 6,
        penetration: 4,
        damage: 5,
        attacks: 2,
        damageType: 'High-Explosive Heavy Shell',
        effectiveAgainst: ['Heavy Fortifications', 'Massed Battalions'],
        weakAgainst: ['Agile Skimmers', 'Subterranean Tunnels'],
        special: 'Seismic Impact: Shatters cover and disrupts enemy infantry morale.'
      };
    }
    return {
      name: 'CANTRIC-PATTERN LAS-RIFLE',
      type: 'ranged',
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

  // 3. Elyri
  if (faction === 'elyri') {
    if (name.toLowerCase().includes('reaper') || name.toLowerCase().includes('missile')) {
      return {
        name: 'REAPER MISSILE LAUNCHER',
        type: 'ranged',
        category: 'Aspect Heavy Missile',
        icon: '💥',
        range: '40"',
        strength: 5,
        penetration: 4,
        damage: 3,
        attacks: 3,
        damageType: 'Starshot High-Explosive',
        effectiveAgainst: ['Armoured Vehicles', 'Heavy Infantry'],
        weakAgainst: ['Displacement Barriers'],
        special: 'Inescapable Death: Re-rolls all failed hit rolls against exposed units.'
      };
    }
    if (name.toLowerCase().includes('mind war') || name.toLowerCase().includes('psychic')) {
      return {
        name: 'MIND WAR PSIONIC VOLLEY',
        type: 'ranged',
        category: 'Psychic Projection',
        icon: '🔮',
        range: '24"',
        strength: 4,
        penetration: 4,
        damage: 3,
        attacks: 2,
        damageType: 'Psionic Brain-Rend',
        effectiveAgainst: ['Commanders', 'Biological Organisms'],
        weakAgainst: ['Synthetic Automata', 'Null Fields'],
        special: 'Mind Rend: Directly attacks target leadership morale.'
      };
    }
    return {
      name: 'MONOFILAMENT SHURIKEN CATAPULT',
      type: 'ranged',
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

  // 4. Veykari
  if (faction === 'veykari') {
    return {
      name: 'SPLINTER CANNON',
      type: 'ranged',
      category: 'Toxic Crystal Projectile',
      icon: '🔫',
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

  // 5. Ghar
  if (faction === 'ghar') {
    return {
      name: 'BIG SHOOTA & DAKKA GUN',
      type: 'ranged',
      category: 'Brutal Scrap Ballistics',
      icon: '🐗',
      range: rangeStr,
      strength: str + 1,
      penetration: 2,
      damage: dmg,
      attacks: attacks + 1,
      damageType: 'Heavy Ballistic Lead',
      effectiveAgainst: ['Light Vehicles', 'Unprotected Infantry', 'Close Formations'],
      weakAgainst: ['Precision Snipers', 'Long-Range Fortifications'],
      special: 'Dakka Volley: Extra hit generated on natural 6s during attack roll.'
    };
  }

  // 6. Devourers
  if (faction === 'devourers') {
    return {
      name: 'BIO-ACID CANNON',
      type: 'ranged',
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

  // 7. Revenant
  if (faction === 'revenant') {
    return {
      name: 'GAUSS DISINTEGRATOR FLAYER',
      type: 'ranged',
      category: 'Molecular Disintegration',
      icon: '⚡',
      range: rangeStr,
      strength: str,
      penetration: 4,
      damage: dmg,
      attacks: attacks,
      damageType: 'Gauss Molecular Field',
      effectiveAgainst: ['Heavy Armour', 'Tanks & Engines', 'Mechanical Plating'],
      weakAgainst: ['Psychic Dispersal Barriers', 'Phase Shifters'],
      special: 'Gauss Disruption: Automatically damages vehicles and heavy armor on hit rolls of 6.'
    };
  }

  // 8. Concordat
  if (faction === 'concordat') {
    if (name.toLowerCase().includes('rail') || name.toLowerCase().includes('accelerator')) {
      return {
        name: 'RAIL ACCELERATOR SUB-MUNITION',
        type: 'ranged',
        category: 'Electromagnetic Kinetic Rail',
        icon: '💠',
        range: '36"',
        strength: 6,
        penetration: 4,
        damage: 4,
        attacks: 2,
        damageType: 'Hypervelocity Slug',
        effectiveAgainst: ['Heavy Armour', 'Mechanical Walkers', 'Bunkers'],
        weakAgainst: ['Phase Displacement Screens'],
        special: 'Sub-Munition Penetration: Hits ignore all cover bonuses.'
      };
    }
    return {
      name: 'PULSE RIFLE',
      type: 'ranged',
      category: 'Advanced Plasma Induction',
      icon: '💠',
      range: rangeStr,
      strength: str,
      penetration: 3,
      damage: dmg,
      attacks: attacks,
      damageType: 'Induction Plasma',
      effectiveAgainst: ['Medium Armour', 'Infantry Cohorts', 'Long-Range Targets'],
      weakAgainst: ['Energy Shields', 'Heat-Resistant Targets'],
      special: 'Target Lock: Markerlight coordination grants +1 Accuracy at extreme ranges.'
    };
  }

  // 9. Riftborn
  if (faction === 'riftborn') {
    return {
      name: 'HELLFIRE WARP NEXUS',
      type: 'ranged',
      category: 'Dimensional Warpfire',
      icon: '🌀',
      range: rangeStr,
      strength: str + 1,
      penetration: 4,
      damage: dmg,
      attacks: attacks,
      damageType: 'Dimensional Warpfire',
      effectiveAgainst: ['Mortal Armies', 'Standard Armor', 'Sanity/Morale'],
      weakAgainst: ['Sanctified Aegis Fields', 'Anti-Psionic Wards'],
      special: 'Reality Tear: Ignores non-magical physical cover and shields.'
    };
  }

  // 10. Forsaken
  if (faction === 'forsaken') {
    if (name.toLowerCase().includes('pistol') || name.toLowerCase().includes('warp pistol')) {
      return {
        name: 'WARP PISTOL',
        type: 'ranged',
        category: 'Corrupted Plasma Pistol',
        icon: '🔥',
        range: '16"',
        strength: str + 1,
        penetration: 3,
        damage: dmg,
        attacks: 2,
        damageType: 'Unholy Plasma Flame',
        effectiveAgainst: ['Close Assault Cohorts', 'Armoured Infantry'],
        weakAgainst: ['Aura Shields'],
        special: 'Hellfire Blast: Ignores cover within 8".'
      };
    }
    return {
      name: 'CORRUPTED BOLTER',
      type: 'ranged',
      category: 'Infernal Chaos Ballistics',
      icon: '💀',
      range: rangeStr,
      strength: str + 1,
      penetration: 3,
      damage: dmg,
      attacks: attacks,
      damageType: 'Unholy Warp-Tainted Shot',
      effectiveAgainst: ['Armoured Infantry', 'Light Fortifications'],
      weakAgainst: ['Consecrated Armor', 'Aura Shields'],
      special: 'Malicious Volley: Hits trigger an immediate morale roll on the targeted squad.'
    };
  }

  // Generic / Auxiliary Fallback Ranged
  return {
    name: name.replace(/\(.*?\)/g, '').split('&')[0].trim().toUpperCase() || 'TACTICAL FIREARM',
    type: 'ranged',
    category: 'Standard Tactical Ballistics',
    icon: '🔫',
    range: rangeStr,
    strength: str,
    penetration: 2,
    damage: dmg,
    attacks: attacks,
    damageType: 'Kinetic Ballistics',
    effectiveAgainst: ['Infantry Cohorts', 'Light Targets'],
    weakAgainst: ['Heavy Refractor Barriers'],
    special: 'Standard Field Issue: Reliable tactical fire.'
  };
}

/**
 * Resolves the unit's dedicated MELEE weapon profile.
 * Returns null if the unit has no melee weapon capability.
 */
export function getUnitMeleeWeaponProfile(unitDef: UnitDef): WeaponProfileDetail | null {
  const hasMelee = unitDef.hasMelee ?? (unitDef.meleeDmg !== undefined && unitDef.meleeDmg > 0);
  if (!hasMelee) return null;

  const faction = normalizeEquipmentFaction(unitDef.factionId);
  const name = unitDef.weapon || 'Melee Weapon';
  const meleeDmg = unitDef.meleeDmg || 2;
  const str = (unitDef.s || 4) + (unitDef.isLarge ? 1 : 0);
  const attacks = (unitDef.weapons && unitDef.weapons[1]?.attacks) || (unitDef.isCharacter ? 3 : unitDef.squadSize > 1 ? 2 : 3);

  // 1. Ascendants
  if (faction === 'ascendants') {
    if (name.toLowerCase().includes('blade') || name.toLowerCase().includes('captain') || name.toLowerCase().includes('relic')) {
      return {
        name: 'RELIC POWER BLADE',
        type: 'melee',
        category: 'Master-Crafted Power Blade',
        icon: '⚔️',
        range: 'Melee',
        strength: str + 1,
        penetration: 4,
        damage: meleeDmg + 1,
        attacks: 3,
        damageType: 'Disruption Energy Edge',
        effectiveAgainst: ['Heavy Infantry', 'Enemy Commanders', 'Monster Hulls'],
        weakAgainst: ['Phase Displacement Fields'],
        special: 'Relic Edge: Ignores enemy parry and deals heavy structural damage in close combat.'
      };
    }
    if (name.toLowerCase().includes('fist') || name.toLowerCase().includes('dreadnought') || name.toLowerCase().includes('drill') || name.toLowerCase().includes('centurion')) {
      return {
        name: 'HYDRAULIC POWER FIST',
        type: 'melee',
        category: 'Crushing Exo-Melee',
        icon: '🥊',
        range: 'Melee',
        strength: str + 2,
        penetration: 4,
        damage: meleeDmg + 2,
        attacks: 3,
        damageType: 'Crushing Kinetic / Disruption',
        effectiveAgainst: ['Armoured Tanks', 'Walkers', 'Fortifications'],
        weakAgainst: ['Agile Swarms'],
        special: 'Concussive Smite: Crushing strikes bypass heavy vehicle plating.'
      };
    }
    return {
      name: 'AUSTERE CHAINSWORD',
      type: 'melee',
      category: 'Motorized Monomolecular Blade',
      icon: '🗡️',
      range: 'Melee',
      strength: str,
      penetration: 2,
      damage: meleeDmg,
      attacks: attacks,
      damageType: 'Serrated Rotary Teeth',
      effectiveAgainst: ['Light Infantry', 'Unarmoured Flesh'],
      weakAgainst: ['Heavy Exo-Plating'],
      special: 'Rip & Tear: Additional attack generated on natural 6s in melee.'
    };
  }

  // 2. Directorate
  if (faction === 'directorate') {
    if (name.toLowerCase().includes('sabre') || name.toLowerCase().includes('marshal')) {
      return {
        name: 'REGIMENTAL POWER SABRE',
        type: 'melee',
        category: 'Officer Melee Weapon',
        icon: '🗡️',
        range: 'Melee',
        strength: str,
        penetration: 3,
        damage: meleeDmg,
        attacks: 3,
        damageType: 'Power Field Edge',
        effectiveAgainst: ['Enemy Officers', 'Light Infantry'],
        weakAgainst: ['Heavy Monsters'],
        special: 'High Command Duelist: +1 WS in close-quarters duels.'
      };
    }
    return {
      name: 'BAYONET & TRENCH KNIFE',
      type: 'melee',
      category: 'Close-Quarters Combat Blade',
      icon: '🔪',
      range: 'Melee',
      strength: str,
      penetration: 1,
      damage: meleeDmg,
      attacks: attacks,
      damageType: 'Steel Blade Piercing',
      effectiveAgainst: ['Unarmoured Infantry'],
      weakAgainst: ['Heavy Power Armour'],
      special: 'Trench Charge: Re-rolls 1s to hit on the turn unit enters melee.'
    };
  }

  // 3. Elyri
  if (faction === 'elyri') {
    if (name.toLowerCase().includes('spear') || name.toLowerCase().includes('singing')) {
      return {
        name: 'SINGING PSYCHIC SPEAR',
        type: 'melee',
        category: 'Psionic Rune Weapon',
        icon: '🔱',
        range: 'Melee',
        strength: str + 1,
        penetration: 4,
        damage: meleeDmg + 1,
        attacks: 3,
        damageType: 'Psychoreactive Force',
        effectiveAgainst: ['Monsters', 'Armoured Hulls', 'Elite Units'],
        weakAgainst: ['Anti-Psionic Wards'],
        special: 'Witchblade: Always wounds on a 2+ in melee against non-vehicles.'
      };
    }
    return {
      name: 'WRAITHBONE POWER BLADE',
      type: 'melee',
      category: 'Acrobatic Aspect Blade',
      icon: '⚔️',
      range: 'Melee',
      strength: str,
      penetration: 3,
      damage: meleeDmg,
      attacks: attacks + 1,
      damageType: 'Monomolecular Edge',
      effectiveAgainst: ['Armoured Infantry', 'Living Flesh'],
      weakAgainst: ['Energy Forcefields'],
      special: 'Acrobatic Strike: Strikes first in melee combat when charging.'
    };
  }

  // 4. Veykari
  if (faction === 'veykari') {
    return {
      name: 'TEMPLE KLAIVE & HARM BLADES',
      type: 'melee',
      category: 'Cruel Executioner Blade',
      icon: '🗡️',
      range: 'Melee',
      strength: str + 1,
      penetration: 4,
      damage: meleeDmg,
      attacks: attacks,
      damageType: 'Barbed Monomolecular',
      effectiveAgainst: ['Biological Organisms', 'Light Infantry'],
      weakAgainst: ['Synthetic Automata', 'Heavy Walkers'],
      special: 'Torment Edge: Slain enemies inflict panic check on nearby allies.'
    };
  }

  // 5. Ghar
  if (faction === 'ghar') {
    if (name.toLowerCase().includes('klaw') || name.toLowerCase().includes('power')) {
      return {
        name: 'HYDRAULIC POWER KLAW',
        type: 'melee',
        category: 'Crushing Industrial Pincer',
        icon: '🦞',
        range: 'Melee',
        strength: str + 2,
        penetration: 4,
        damage: meleeDmg + 2,
        attacks: attacks,
        damageType: 'Pneumatic Shearing Metal',
        effectiveAgainst: ['Tanks', 'Heavy Walkers', 'Fortifications'],
        weakAgainst: ['Agile Skimmers'],
        special: 'Armor Snip: Deals double damage against mechanical and armored targets.'
      };
    }
    return {
      name: "HEAVY 'EAVY CHOPPA",
      type: 'melee',
      category: 'Brutal Serrated Axe',
      icon: '🪓',
      range: 'Melee',
      strength: str + 1,
      penetration: 2,
      damage: meleeDmg,
      attacks: attacks,
      damageType: 'Brutal Slashing',
      effectiveAgainst: ['Infantry Cohorts', 'Scrap Metal'],
      weakAgainst: ['Energy Shields'],
      special: 'Waaagh Frenzy: +1 Strength when fighting multiple models.'
    };
  }

  // 6. Devourers
  if (faction === 'devourers') {
    return {
      name: 'SCYTHING TALONS & RENDING CLAWS',
      type: 'melee',
      category: 'Bio-Organic Monomolecular Scythes',
      icon: '🦀',
      range: 'Melee',
      strength: str,
      penetration: 4,
      damage: meleeDmg,
      attacks: attacks + 1,
      damageType: 'Bio-Organic Rending',
      effectiveAgainst: ['Organic Targets', 'Armoured Infantry'],
      weakAgainst: ['Energy Barriers'],
      special: 'Rending Flurry: Penetrates all non-invulnerable armour on wound rolls of 6.'
    };
  }

  // 7. Revenant
  if (faction === 'revenant') {
    return {
      name: 'HYPERPHASE BLADE & WARSCYTHE',
      type: 'melee',
      category: 'Dimensional Phase Blade',
      icon: '⚔️',
      range: 'Melee',
      strength: str + 1,
      penetration: 4,
      damage: meleeDmg,
      attacks: attacks,
      damageType: 'Dimensional Phase Shift',
      effectiveAgainst: ['Heavy Tanks', 'Shielded Walkers', 'Elite Commanders'],
      weakAgainst: ['Phase Disrupters'],
      special: 'Phase Cleave: Phase strikes bypass all energy shielding.'
    };
  }

  // 8. Concordat
  if (faction === 'concordat') {
    return {
      name: 'HONOR BLADE & COMBAT GAUNTLET',
      type: 'melee',
      category: 'Ethereal Defensive Melee',
      icon: '🗡️',
      range: 'Melee',
      strength: str,
      penetration: 2,
      damage: meleeDmg,
      attacks: attacks,
      damageType: 'Defensive Pulse Edge',
      effectiveAgainst: ['Light Raiders'],
      weakAgainst: ['Heavy Exosuits'],
      special: 'Defensive Parry: Grants +1 Evasion when engaged in melee.'
    };
  }

  // 9. Riftborn
  if (faction === 'riftborn') {
    return {
      name: 'WARP-FORGED HELLBLADE',
      type: 'melee',
      category: 'Corrupted Hellforged Blade',
      icon: '🗡️',
      range: 'Melee',
      strength: str + 1,
      penetration: 4,
      damage: meleeDmg + 1,
      attacks: attacks + 1,
      damageType: 'Daemonic Fire Cleave',
      effectiveAgainst: ['Mortal Armies', 'Standard Armor'],
      weakAgainst: ['Sanctified Aegis Fields'],
      special: 'Hellfire Cleave: Critical hits in melee inflict permanent burning.'
    };
  }

  // 10. Forsaken
  if (faction === 'forsaken') {
    if (name.toLowerCase().includes('axe') || name.toLowerCase().includes('daemon axe') || name.toLowerCase().includes('lord') || name.toLowerCase().includes('chainaxe')) {
      return {
        name: 'WARP-FORGED DAEMON AXE',
        type: 'melee',
        category: 'Demonic Melee Cleaver',
        icon: '🪓',
        range: 'Melee',
        strength: str + 1,
        penetration: 4,
        damage: meleeDmg + 1,
        attacks: 3,
        damageType: 'Warp-Infused Cleave',
        effectiveAgainst: ['Armoured Infantry', 'Commanders', 'Monster Hulls'],
        weakAgainst: ['Consecrated Shields'],
        special: 'Soul Cleaver: Brutal close-combat cleave that rends heavy armour.'
      };
    }
    return {
      name: 'CORRUPTED CHAINSWORD',
      type: 'melee',
      category: 'Barbed Motorized Blade',
      icon: '🗡️',
      range: 'Melee',
      strength: str,
      penetration: 2,
      damage: meleeDmg,
      attacks: attacks,
      damageType: 'Serrated Rotary Teeth',
      effectiveAgainst: ['Infantry Cohorts', 'Flesh'],
      weakAgainst: ['Heavy Exo-Plating'],
      special: 'Blood Tithe: Generates +1 attack when eliminating enemy models in melee.'
    };
  }

  // Generic Melee Fallback
  return {
    name: name.replace(/\(.*?\)/g, '').split('&').pop()?.trim().toUpperCase() || 'COMBAT BLADES',
    type: 'melee',
    category: 'Standard Close Combat Arms',
    icon: '⚔️',
    range: 'Melee',
    strength: str,
    penetration: 2,
    damage: meleeDmg,
    attacks: attacks,
    damageType: 'Kinetic Edge',
    effectiveAgainst: ['Light Units', 'Infantry Cohorts'],
    weakAgainst: ['Heavy Armor Plating'],
    special: 'Standard Close Quarters: Reliable melee response.'
  };
}

/**
 * Returns all distinct weapon profiles (both ranged and melee if applicable) for a given unit.
 */
export function getUnitWeaponProfiles(unitDef: UnitDef): WeaponProfileDetail[] {
  const profiles: WeaponProfileDetail[] = [];
  const ranged = getUnitRangedWeaponProfile(unitDef);
  if (ranged) profiles.push(ranged);
  const melee = getUnitMeleeWeaponProfile(unitDef);
  if (melee) profiles.push(melee);

  if (profiles.length === 0) {
    const fallback = getUnitWeaponProfile(unitDef);
    if (fallback) profiles.push(fallback);
  }
  return profiles;
}

/**
 * Procedural/Specific primary weapon database for all units (backwards compatible).
 * Returns the primary weapon (ranged weapon if available, otherwise melee weapon).
 */
export function getUnitWeaponProfile(unitDef: UnitDef): WeaponProfileDetail {
  return (
    getUnitRangedWeaponProfile(unitDef) ||
    getUnitMeleeWeaponProfile(unitDef) || {
      name: (unitDef.weapon || 'Standard Armament').toUpperCase(),
      type: 'ranged',
      category: 'Standard Tactical Armament',
      icon: '⚔️',
      range: unitDef.range > 2 ? `${unitDef.range}"` : 'Melee',
      strength: unitDef.s || 4,
      penetration: 2,
      damage: unitDef.dmg || 2,
      attacks: unitDef.squadSize > 1 ? 2 : 3,
      damageType: 'Kinetic Ballistic / Energy',
      effectiveAgainst: ['Infantry Cohorts', 'Light Units'],
      weakAgainst: ['Heavy Refractor Barriers'],
      special: 'Standard Field Issue: Reliable tactical fire.'
    }
  );
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

