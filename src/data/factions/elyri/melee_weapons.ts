import type { WeaponProfileDetail } from '../../types';

export const elyriMeleeWeapons: Record<string, WeaponProfileDetail> = {
  eld_singing_spear: {
    id: 'eld_singing_spear',
    name: 'SINGING PSYCHIC SPEAR',
    type: 'melee',
    category: 'Psionic Rune Weapon',
    icon: '🔱',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 5,
    penetration: 4,
    ap: 4,
    damage: 3,
    attacks: 3,
    damageType: 'Psychoreactive Force',
    effectiveAgainst: ['Monsters', 'Armoured Hulls', 'Elite Units'],
    weakAgainst: ['Anti-Psionic Wards'],
    special: 'Witchblade: Always wounds on a 2+ in melee against non-vehicles.',
    allowedFactions: ['elyri', 'eldar']
  },

  eld_power_sword: {
    id: 'eld_power_sword',
    name: 'WRAITHBONE POWER BLADE',
    type: 'melee',
    category: 'Acrobatic Aspect Blade',
    icon: '⚔️',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 4,
    penetration: 3,
    ap: 3,
    damage: 2,
    attacks: 3,
    damageType: 'Monomolecular Edge',
    effectiveAgainst: ['Armoured Infantry', 'Living Flesh'],
    weakAgainst: ['Energy Forcefields'],
    special: 'Acrobatic Strike: Strikes first in melee combat when charging.',
    allowedFactions: ['elyri', 'eldar']
  },

  eld_ghostglaive: {
    id: 'eld_ghostglaive',
    name: 'SPIRIT GHOSTGLAIVE',
    type: 'melee',
    category: 'Titanic Wraith Blade',
    icon: '🗡️',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 6,
    penetration: 4,
    ap: 4,
    damage: 4,
    attacks: 3,
    damageType: 'Psychic Plasma Edge',
    effectiveAgainst: ['Monsters', 'Walkers', 'Commanders'],
    weakAgainst: ['Psychic Nulls'],
    special: 'Spirit Cleave: Sweeping blows cleave through multiple foes.',
    allowedFactions: ['elyri', 'eldar']
  }
};
