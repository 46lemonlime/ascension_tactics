import type { Faction } from './types';
import { UNIT_DEFS } from './units';

const allUnits = Object.values(UNIT_DEFS);

function getFactionRoster(fId: string) {
  return allUnits.filter(u => u.factionId === fId);
}

export const FACTIONS: Record<string, Faction> = {
  space_marines: {
    id: 'space_marines',
    name: 'Space Marines',
    sub: 'Adeptus Astartes',
    icon: '🛡️',
    color: 0x1d4ed8,
    colorHex: 0x1d4ed8,
    trim: 0xf59e0b,
    trimHex: 0xf59e0b,
    laserColor: 0x3b82f6,
    desc: 'Power-armored heroes with high 2+/3+ saves and heavy bolter support.',
    roster: getFactionRoster('marines')
  },
  chaos_marines: {
    id: 'chaos_marines',
    name: 'Chaos Marines',
    sub: 'Heretic Astartes',
    icon: '💀',
    color: 0x991b1b,
    colorHex: 0x991b1b,
    trim: 0xb45309,
    trimHex: 0xb45309,
    laserColor: 0xef4444,
    desc: 'Vengeful traitor legionnaires with daemon axes and cultist horde.',
    roster: getFactionRoster('chaos')
  },
  orcs: {
    id: 'orcs',
    name: 'Space Orcs',
    sub: 'Goff WAAAGH!',
    icon: '🐗',
    color: 0x15803d,
    colorHex: 0x15803d,
    trim: 0xd97706,
    trimHex: 0xd97706,
    laserColor: 0xf97316,
    desc: 'Brutal greenskin horde with high toughness (T5), savage Power Klaws, and heavy Dakka.',
    roster: getFactionRoster('orcs')
  },
  necrons: {
    id: 'necrons',
    name: 'Necrons',
    sub: 'Sautekh Dynasty',
    icon: '⚡',
    color: 0x334155,
    colorHex: 0x334155,
    trim: 0x22c55e,
    trimHex: 0x22c55e,
    laserColor: 0x22c55e,
    desc: 'Ancient metallic immortals wielding armor-shredding Gauss weaponry and hyperphase blades.',
    roster: getFactionRoster('necros')
  },
  eldar: {
    id: 'eldar',
    name: 'Aeldari',
    sub: 'Craftworld Ulthwé',
    icon: '✨',
    color: 0x0f172a,
    colorHex: 0x0f172a,
    trim: 0xfde68a,
    trimHex: 0xfde68a,
    laserColor: 0x38bdf8,
    desc: 'Graceful psychic warriors with high agility (M8), shuriken volleys, and Aspect shrines.',
    roster: getFactionRoster('eldar')
  },
  dark_eldar: {
    id: 'dark_eldar',
    name: 'Dark Eldar',
    sub: 'Drukhari Kabal',
    icon: '🗡️',
    color: 0x042f2e,
    colorHex: 0x042f2e,
    trim: 0x10b981,
    trimHex: 0x10b981,
    laserColor: 0x10b981,
    desc: 'Sadistic raiders with toxic splinter shard volleys, lethal Incubi, and winged Scourges.',
    roster: getFactionRoster('dark_eldar')
  },
  tyranids: {
    id: 'tyranids',
    name: 'Tyranids',
    sub: 'Hive Fleet Leviathan',
    icon: '👾',
    color: 0x581c87,
    colorHex: 0x581c87,
    trim: 0xe9d5ff,
    trimHex: 0xe9d5ff,
    laserColor: 0xa855f7,
    desc: 'Alien hive organism with venom cannons, rending claws, and gaunt broods.',
    roster: getFactionRoster('tyranids')
  },
  tau: {
    id: 'tau',
    name: "T'au Empire",
    sub: 'Hunter Cadre',
    icon: '💠',
    color: 0xc2410c,
    colorHex: 0xc2410c,
    trim: 0x06b6d4,
    trimHex: 0x06b6d4,
    laserColor: 0x06b6d4,
    desc: 'Advanced caste with 24" pulse volleys, 28" rail rifles, and battlesuits.',
    roster: getFactionRoster('tau')
  },
  neutral: {
    id: 'neutral',
    name: 'Adeptus Mechanicus',
    sub: 'Tech-Priesthood Envoy',
    icon: '⚙️',
    color: 0xd97706,
    colorHex: 0xd97706,
    trim: 0x38bdf8,
    trimHex: 0x38bdf8,
    laserColor: 0x38bdf8,
    desc: 'Keepers of ancient archeotech relics and sacred cybernetic machinery.',
    roster: getFactionRoster('neutral')
  }
};

// Aliases for backwards compatibility
FACTIONS.marines = FACTIONS.space_marines;
FACTIONS.chaos = FACTIONS.chaos_marines;
FACTIONS.necros = FACTIONS.necrons;
