import type { WeaponProfileDetail } from '../../types';

export const concordatMeleeWeapons: Record<string, WeaponProfileDetail> = {
  tau_pulse_gauntlet: {
    id: 'tau_pulse_gauntlet',
    name: 'PULSE COMBAT GAUNTLET',
    type: 'melee',
    category: 'Defensive Shock Gauntlet',
    icon: '🥊',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 4,
    penetration: 2,
    ap: 2,
    damage: 2,
    attacks: 2,
    damageType: 'Shockwave Impact',
    effectiveAgainst: ['Light Raiders'],
    weakAgainst: ['Heavy Exosuits'],
    special: 'Kinetic Repulsion: Shoves enemy infantry backwards upon melee impact.',
    allowedFactions: ['concordat', 'tau']
  },

  tau_honor_blade: {
    id: 'tau_honor_blade',
    name: 'HONOR BLADE',
    type: 'melee',
    category: 'Ethereal Ceremonial Blade',
    icon: '🗡️',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 4,
    penetration: 2,
    ap: 2,
    damage: 2,
    attacks: 3,
    damageType: 'Defensive Pulse Edge',
    effectiveAgainst: ['Light Raiders'],
    weakAgainst: ['Heavy Exosuits'],
    special: 'Defensive Parry: Grants +1 Evasion when engaged in melee.',
    allowedFactions: ['concordat', 'tau']
  }
};
