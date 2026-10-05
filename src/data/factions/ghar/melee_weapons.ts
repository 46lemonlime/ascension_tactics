import type { WeaponProfileDetail } from '../../types';

export const gharMeleeWeapons: Record<string, WeaponProfileDetail> = {
  ork_power_klaw: {
    id: 'ork_power_klaw',
    name: 'HYDRAULIC POWER KLAW',
    type: 'melee',
    category: 'Crushing Industrial Pincer',
    icon: '🦞',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 7,
    penetration: 4,
    ap: 4,
    damage: 4,
    attacks: 3,
    damageType: 'Pneumatic Shearing Metal',
    effectiveAgainst: ['Tanks', 'Heavy Walkers', 'Fortifications'],
    weakAgainst: ['Agile Skimmers'],
    special: 'Armor Snip: Deals double damage against mechanical and armored targets.',
    allowedFactions: ['ghar', 'orcs']
  },

  ork_big_choppa: {
    id: 'ork_big_choppa',
    name: "HEAVY 'EAVY CHOPPA",
    type: 'melee',
    category: 'Brutal Serrated Axe',
    icon: '🪓',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 5,
    penetration: 2,
    ap: 2,
    damage: 2,
    attacks: 3,
    damageType: 'Brutal Slashing',
    effectiveAgainst: ['Infantry Cohorts', 'Scrap Metal'],
    weakAgainst: ['Energy Shields'],
    special: 'Waaagh Frenzy: +1 Strength when fighting multiple models.',
    allowedFactions: ['ghar', 'orcs']
  },

  ork_choppa: {
    id: 'ork_choppa',
    name: 'SCRAP CHOPPA',
    type: 'melee',
    category: 'Heavy Cleaving Blade',
    icon: '🪓',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 4,
    penetration: 1,
    ap: 1,
    damage: 1,
    attacks: 3,
    damageType: 'Brutal Cleaving',
    effectiveAgainst: ['Light Infantry'],
    weakAgainst: ['Heavy Armor'],
    special: 'Choppa Fury: Grants +1 attack in melee.',
    allowedFactions: ['ghar', 'orcs']
  },

  ork_buzz_saws: {
    id: 'ork_buzz_saws',
    name: 'DUAL BUZZ SAWS',
    type: 'melee',
    category: 'Industrial Motorized Saws',
    icon: '⚙️',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 6,
    penetration: 4,
    ap: 4,
    damage: 4,
    attacks: 3,
    damageType: 'Rotary Steel Teeth',
    effectiveAgainst: ['Walkers', 'Fortifications'],
    weakAgainst: ['Agile Skimmers'],
    special: 'Dismantle: Deals bonus damage against mechanical targets.',
    allowedFactions: ['ghar', 'orcs']
  }
};
