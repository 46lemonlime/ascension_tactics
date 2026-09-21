import { Faction } from './types';

export const FACTIONS: Record<string, Faction> = {
  marines: {
    id: 'marines',
    name: 'Space Marines',
    sub: 'Adeptus Astartes',
    icon: '🛡️',
    color: 0x1d4ed8,
    trim: 0xf59e0b,
    laserColor: 0x3b82f6,
    desc: 'Power-armored heroes with high 2+/3+ saves and heavy bolter support.'
  },
  chaos: {
    id: 'chaos',
    name: 'Chaos Marines',
    sub: 'Heretic Astartes',
    icon: '💀',
    color: 0x991b1b,
    trim: 0xb45309,
    laserColor: 0xef4444,
    desc: 'Vengeful traitor legionnaires with daemon axes and cultist horde.'
  },
  orcs: {
    id: 'orcs',
    name: 'Space Orcs',
    sub: 'Goff WAAAGH!',
    icon: '🐗',
    color: 0x15803d,
    trim: 0xd97706,
    laserColor: 0xf97316,
    desc: 'Brutal greenskin horde with high toughness (T5), savage Power Klaws, and heavy Dakka.'
  },
  necros: {
    id: 'necros',
    name: 'Necrons',
    sub: 'Sautekh Dynasty',
    icon: '⚡',
    color: 0x334155,
    trim: 0x22c55e,
    laserColor: 0x22c55e,
    desc: 'Ancient metallic immortals wielding armor-shredding Gauss weaponry and hyperphase blades.'
  },
  eldar: {
    id: 'eldar',
    name: 'Aeldari',
    sub: 'Craftworld Ulthwé',
    icon: '✨',
    color: 0x0f172a,
    trim: 0xfde68a,
    laserColor: 0x38bdf8,
    desc: 'Graceful psychic warriors with high agility (M8), shuriken volleys, and Aspect shrines.'
  },
  dark_eldar: {
    id: 'dark_eldar',
    name: 'Dark Eldar',
    sub: 'Drukhari Kabal',
    icon: '🗡️',
    color: 0x042f2e,
    trim: 0x10b981,
    laserColor: 0x10b981,
    desc: 'Sadistic raiders with toxic splinter shard volleys, lethal Incubi, and winged Scourges.'
  },
  tyranids: {
    id: 'tyranids',
    name: 'Tyranids',
    sub: 'Hive Fleet Leviathan',
    icon: '👾',
    color: 0x581c87,
    trim: 0xe9d5ff,
    laserColor: 0xa855f7,
    desc: 'Alien hive organism with venom cannons, rending claws, and gaunt broods.'
  },
  tau: {
    id: 'tau',
    name: "T'au Empire",
    sub: 'Hunter Cadre',
    icon: '💠',
    color: 0xc2410c,
    trim: 0x06b6d4,
    laserColor: 0x06b6d4,
    desc: 'Advanced caste with 24" pulse volleys, 28" rail rifles, and battlesuits.'
  },
  neutral: {
    id: 'neutral',
    name: 'Adeptus Mechanicus',
    sub: 'Tech-Priesthood Envoy',
    icon: '⚙️',
    color: 0xd97706,
    trim: 0x38bdf8,
    laserColor: 0x38bdf8,
    desc: 'Keepers of ancient archeotech relics and sacred cybernetic machinery.'
  }
};
