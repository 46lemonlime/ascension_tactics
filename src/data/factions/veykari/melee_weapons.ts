import type { WeaponProfileDetail } from '../../types';

export const veykariMeleeWeapons: Record<string, WeaponProfileDetail> = {
  de_huskblade: {
    id: 'de_huskblade',
    name: 'HUSKBLADE',
    type: 'melee',
    category: 'Moisture-Draining Blade',
    icon: '🗡️',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 4,
    penetration: 4,
    ap: 4,
    damage: 3,
    attacks: 3,
    damageType: 'Desiccation Field',
    effectiveAgainst: ['Living Flesh', 'Commanders'],
    weakAgainst: ['Synthetic Constructs'],
    special: 'Instant Desiccation: Instantly slays non-monster biological infantry on wound rolls of 6.',
    allowedFactions: ['veykari', 'dark_eldar']
  },

  de_demiklaive: {
    id: 'de_demiklaive',
    name: 'TEMPLE DEMIKLAIVES',
    type: 'melee',
    category: 'Cruel Executioner Blade',
    icon: '🗡️',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 5,
    penetration: 4,
    ap: 4,
    damage: 2,
    attacks: 3,
    damageType: 'Barbed Monomolecular',
    effectiveAgainst: ['Biological Organisms', 'Light Infantry'],
    weakAgainst: ['Synthetic Automata', 'Heavy Walkers'],
    special: 'Torment Edge: Slain enemies inflict panic check on nearby allies.',
    allowedFactions: ['veykari', 'dark_eldar']
  },

  de_harm_blades: {
    id: 'de_harm_blades',
    name: 'HARM BLADES',
    type: 'melee',
    category: 'Cruel Barbed Daggers',
    icon: '🔪',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 3,
    penetration: 3,
    ap: 3,
    damage: 2,
    attacks: 3,
    damageType: 'Barbed Monomolecular',
    effectiveAgainst: ['Biological Organisms', 'Light Infantry'],
    weakAgainst: ['Synthetic Automata'],
    special: 'Venomous Edge: Hits inflict extra pain tokens on biological targets.',
    allowedFactions: ['veykari', 'dark_eldar']
  },

  de_macro_scalpels: {
    id: 'de_macro_scalpels',
    name: 'MACRO-SCALPELS',
    type: 'melee',
    category: 'Surgical Dissection Tools',
    icon: '🔪',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 5,
    penetration: 4,
    ap: 4,
    damage: 3,
    attacks: 3,
    damageType: 'Surgical Monomolecular',
    effectiveAgainst: ['Living Organisms', 'Commanders'],
    weakAgainst: ['Energy Shields'],
    special: 'Anatomical Precision: Re-rolls all failed wound rolls against organic units.',
    allowedFactions: ['veykari', 'dark_eldar']
  }
};
