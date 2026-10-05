import type { WeaponProfileDetail } from '../../types';

export const revenantMeleeWeapons: Record<string, WeaponProfileDetail> = {
  nec_warscythe: {
    id: 'nec_warscythe',
    name: 'HYPERPHASE WARSCYTHE',
    type: 'melee',
    category: 'Dimensional Phase Heavy Scythe',
    icon: '🪓',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 6,
    penetration: 4,
    ap: 4,
    damage: 4,
    attacks: 3,
    damageType: 'Dimensional Phase Shift',
    effectiveAgainst: ['Heavy Tanks', 'Shielded Walkers', 'Elite Commanders'],
    weakAgainst: ['Phase Disrupters'],
    special: 'Phase Cleave: Phase strikes bypass all energy shielding.',
    allowedFactions: ['revenant', 'necros']
  },

  nec_hyperphase_threshers: {
    id: 'nec_hyperphase_threshers',
    name: 'HYPERPHASE THRESHERS',
    type: 'melee',
    category: 'Dimensional Phase Dual Blades',
    icon: '⚔️',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 5,
    penetration: 4,
    ap: 4,
    damage: 3,
    attacks: 4,
    damageType: 'Dimensional Phase Cleave',
    effectiveAgainst: ['Elite Infantry', 'Constructs'],
    weakAgainst: ['Null Wards'],
    special: 'Whirlwind of Blades: +1 Attack on charges.',
    allowedFactions: ['revenant', 'necros']
  },

  nec_hyperphase_blade: {
    id: 'nec_hyperphase_blade',
    name: 'HYPERPHASE BLADE',
    type: 'melee',
    category: 'Dimensional Phase Blade',
    icon: '⚔️',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 5,
    penetration: 4,
    ap: 4,
    damage: 3,
    attacks: 3,
    damageType: 'Dimensional Phase Shift',
    effectiveAgainst: ['Heavy Tanks', 'Shielded Walkers', 'Elite Commanders'],
    weakAgainst: ['Phase Disrupters'],
    special: 'Phase Cleave: Phase strikes bypass all energy shielding.',
    allowedFactions: ['revenant', 'necros']
  }
};
