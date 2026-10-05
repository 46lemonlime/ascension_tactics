import type { WeaponProfileDetail } from '../../types';

export const ascendantMeleeWeapons: Record<string, WeaponProfileDetail> = {
  sm_relic_blade: {
    id: 'sm_relic_blade',
    name: 'RELIC POWER BLADE',
    type: 'melee',
    category: 'Master-Crafted Power Blade',
    icon: '⚔️',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 5,
    penetration: 4,
    ap: 4,
    damage: 4,
    attacks: 3,
    damageType: 'Disruption Energy Edge',
    effectiveAgainst: ['Heavy Infantry', 'Enemy Commanders', 'Monster Hulls'],
    weakAgainst: ['Phase Displacement Fields'],
    special: 'Relic Edge: Ignores enemy parry and deals heavy structural damage in close combat.',
    allowedFactions: ['ascendants', 'marines']
  },

  sm_chainsword: {
    id: 'sm_chainsword',
    name: 'AUSTERE CHAINSWORD',
    type: 'melee',
    category: 'Motorized Monomolecular Blade',
    icon: '🗡️',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 4,
    penetration: 2,
    ap: 2,
    damage: 2,
    attacks: 3,
    damageType: 'Serrated Rotary Teeth',
    effectiveAgainst: ['Light Infantry', 'Unarmoured Flesh'],
    weakAgainst: ['Heavy Exo-Plating'],
    special: 'Rip & Tear: Additional attack generated on natural 6s in melee.',
    allowedFactions: ['ascendants', 'marines']
  },

  sm_siege_drills: {
    id: 'sm_siege_drills',
    name: 'SIEGE DRILLS',
    type: 'melee',
    category: 'Hydraulic Breaching Drill',
    icon: '🥊',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 6,
    penetration: 4,
    ap: 4,
    damage: 4,
    attacks: 3,
    damageType: 'Rotary Breaching Impact',
    effectiveAgainst: ['Bunkers', 'Armoured Vehicles'],
    weakAgainst: ['Agile Swarms'],
    special: 'Structural Breaker: Re-rolls wound rolls against vehicles and structures.',
    allowedFactions: ['ascendants', 'marines']
  },

  sm_power_fist: {
    id: 'sm_power_fist',
    name: 'HYDRAULIC POWER FIST',
    type: 'melee',
    category: 'Crushing Exo-Melee',
    icon: '🥊',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 7,
    penetration: 4,
    ap: 4,
    damage: 5,
    attacks: 3,
    damageType: 'Crushing Kinetic / Disruption',
    effectiveAgainst: ['Armoured Tanks', 'Walkers', 'Fortifications'],
    weakAgainst: ['Agile Swarms'],
    special: 'Concussive Smite: Crushing strikes bypass heavy vehicle plating.',
    allowedFactions: ['ascendants', 'marines']
  }
};
