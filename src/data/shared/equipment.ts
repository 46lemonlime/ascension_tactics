import type { UnitDef, WeaponProfileDetail } from '../types';

export const sharedUnits: Record<string, UnitDef> = {
  vip_courier: {
    type: 'vip_courier',
    factionId: 'neutral',
    name: 'VIP Relic Courier',
    title: 'High Tech-Priest Envoy',
    icon: '📦',
    points: 0,
    isCharacter: true,
    squadSize: 1,
    isVip: true,
    hp: 10,
    m: 8,
    awareness: 16,
    range: 16,
    dmg: 2,
    meleeDmg: 2,
    ranged: true,
    hasMelee: true,
    bs: 3,
    ws: 3,
    s: 3,
    t: 4,
    sv: 2,
    color: 0xf59e0b,
    weaponIds: ['neutral_arc_pistol','neutral_deflector_field'],
    trim: 0x38bdf8,
    weapon: 'Personal Deflector Field & Arc Pistol (16")'
  }
};

export const sharedWeapons: Record<string, WeaponProfileDetail> = {
  neutral_arc_pistol: {
    id: 'neutral_arc_pistol',
    name: 'PERSONAL ARC PISTOL',
    type: 'ranged',
    category: 'Compact Arc Weapon',
    icon: '⚡',
    range: 16,
    rangeDisplay: '16"',
    strength: 3,
    penetration: 2,
    ap: 2,
    damage: 1,
    attacks: 2,
    damageType: 'Electromagnetic Arc',
    effectiveAgainst: ['Light Raiders'],
    weakAgainst: ['Heavy Armor'],
    special: 'Defensive Shock: Self-defense firearm.',
    allowedFactions: ['all', 'neutral']
  },

  neutral_deflector_field: {
    id: 'neutral_deflector_field',
    name: 'PERSONAL DEFLECTOR FIELD',
    type: 'melee',
    category: 'Defensive Force Barrier',
    icon: '🛡️',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 3,
    penetration: 1,
    ap: 1,
    damage: 1,
    attacks: 1,
    damageType: 'Kinetic Deflection',
    effectiveAgainst: ['Melee Attackers'],
    weakAgainst: ['Power Weapons'],
    special: 'Deflector Stun: Stuns attackers in close combat.',
    allowedFactions: ['all', 'neutral']
  }
};
