import type { WeaponProfileDetail } from '../../types';

export const directorateMeleeWeapons: Record<string, WeaponProfileDetail> = {
  dir_power_sabre: {
    id: 'dir_power_sabre',
    name: 'REGIMENTAL POWER SABRE',
    type: 'melee',
    category: 'Officer Melee Weapon',
    icon: '🗡️',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 4,
    penetration: 3,
    ap: 3,
    damage: 2,
    attacks: 3,
    damageType: 'Power Field Edge',
    effectiveAgainst: ['Enemy Officers', 'Light Infantry'],
    weakAgainst: ['Heavy Monsters'],
    special: 'High Command Duelist: +1 WS in close-quarters duels.',
    allowedFactions: ['directorate', 'guard']
  },

  dir_trench_knife: {
    id: 'dir_trench_knife',
    name: 'TRENCH COMBAT KNIFE',
    type: 'melee',
    category: 'Close-Quarters Combat Blade',
    icon: '🔪',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 3,
    penetration: 1,
    ap: 1,
    damage: 1,
    attacks: 2,
    damageType: 'Steel Blade Piercing',
    effectiveAgainst: ['Unarmoured Infantry'],
    weakAgainst: ['Heavy Power Armour'],
    special: 'Trench Charge: Re-rolls 1s to hit on the turn unit enters melee.',
    allowedFactions: ['directorate', 'guard']
  },

  dir_stomp_melee: {
    id: 'dir_stomp_melee',
    name: 'WALKER STOMP MELEE',
    type: 'melee',
    category: 'Mechanical Kinetic Stomp',
    icon: '⚙️',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 5,
    penetration: 2,
    ap: 2,
    damage: 2,
    attacks: 2,
    damageType: 'Crushing Mechanical Mass',
    effectiveAgainst: ['Infantry Formations'],
    weakAgainst: ['Heavy Walkers'],
    special: 'Trample: Deals extra impact damage against swarms.',
    allowedFactions: ['directorate', 'guard']
  }
};
