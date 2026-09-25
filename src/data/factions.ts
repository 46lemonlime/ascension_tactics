import type { Faction } from './types';
import { UNIT_DEFS } from './units';

const allUnits = Object.values(UNIT_DEFS);

function getFactionRoster(fId: string) {
  return allUnits.filter(u => u.factionId === fId);
}

export const FACTIONS: Record<string, Faction> = {
  // 1. THE ASCENDANTS (Space Marines)
  ascendants: {
    id: 'ascendants',
    name: 'The Ascendants',
    sub: 'Elite Super-Soldier Formations',
    icon: '🛡️',
    color: 0x1d4ed8,
    colorHex: 0x1d4ed8,
    trim: 0xf59e0b,
    trimHex: 0xf59e0b,
    laserColor: 0x3b82f6,
    quote: 'To become more than human, something human must be sacrificed.',
    desc: 'Humanity discovered a process called Ascension that rebuilds the human body at the cellular level into 2–3× larger, heavily armoured super-warriors. However, the longer an Ascendant lives, the further they drift from their original humanity.',
    battlefieldIdentity: 'Elite Human Warriors (Small armies with incredibly powerful individual units, heavy armour, devastating weapons, and highly capable commanders)',
    doctrine: 'Elite shock warfare: 2+/3+ heavy saves, versatile 26" Rapid Fire Bolters, Jump Assault shock troops, and heavy Devastator support.',
    strengths: [
      'Extremely powerful infantry',
      'Heavy armour & 2+/3+ saves',
      'Strong commanders',
      'Excellent survivability',
      'Powerful elite units'
    ],
    weaknesses: [
      'Small army sizes',
      'Expensive units',
      'Difficult to replace casualties',
      'Vulnerable to being surrounded'
    ],
    image: '/assets/factions/ascendants.jpg',
    emblem: '/assets/emblems/ascendants.jpg',
    roster: getFactionRoster('marines')
  },

  // 2. THE DIRECTORATE (Astra Militarum / Imperial Guard)
  directorate: {
    id: 'directorate',
    name: 'The Directorate',
    sub: 'Conventional Mass Combined Arms',
    icon: '🎖️',
    color: 0x3f6212,
    colorHex: 0x3f6212,
    trim: 0xd97706,
    trimHex: 0xd97706,
    laserColor: 0xeab308,
    quote: 'One soldier can die. A million more are waiting.',
    desc: 'The Directorate represents the conventional military power of humanity across thousands of worlds. Relying on mass infantry, tanks, heavy artillery, and logistics, they overwhelm threats through combined arms industrial warfare.',
    battlefieldIdentity: 'Mass Combined Arms (Infantry holds the battlefield while tanks advance, artillery destroys enemy positions, and heavy firepower dominates)',
    doctrine: 'Mass combined arms: Large infantry formations, fortified firing lines, bipedal sentinels, and crushing long-range siege howitzers.',
    strengths: [
      'Large armies & unit counts',
      'Excellent battle tanks',
      'Powerful siege artillery',
      'Flexible unit selection',
      'Strong defensive formations',
      'Excellent battlefield control'
    ],
    weaknesses: [
      'Individual units are relatively weak',
      'Requires careful positioning',
      'Vulnerable when isolated',
      'Command structure can be disrupted'
    ],
    image: '/assets/factions/directorate.jpg',
    emblem: '/assets/emblems/directorate.jpg',
    roster: getFactionRoster('directorate')
  },

  // 3. THE ELYRI (Aeldari)
  elyri: {
    id: 'elyri',
    name: 'The Elyri',
    sub: 'Ancient Speed & Precision Vanguard',
    icon: '✨',
    color: 0x0f172a,
    colorHex: 0x0f172a,
    trim: 0xfde68a,
    trimHex: 0xfde68a,
    laserColor: 0x38bdf8,
    quote: 'How do we make sure the battle never becomes a fair fight?',
    desc: 'One of the oldest civilizations in the galaxy, the Elyri mastered psychic energy and science-defying technology. With their population dwindling, they refuse wars of attrition and fight with unmatched speed, stealth, and precision.',
    battlefieldIdentity: 'Speed & Precision (Fast, highly specialized, and difficult to pin down)',
    doctrine: 'Fluid maneuver warfare: Extreme agility (M8-M12), psychic Mind War snipes, monofilament shuriken storms, and spirit constructs.',
    strengths: [
      'Extremely mobile (M8–M12)',
      'Powerful ranged precision',
      'Psychic seer abilities',
      'Strong specialist units',
      'Excellent battlefield repositioning'
    ],
    weaknesses: [
      'Fragile units (T3 / lower wounds)',
      'Expensive specialists',
      'Poor prolonged engagements',
      'Mistakes are heavily punished'
    ],
    image: '/assets/factions/elyri.jpg',
    emblem: '/assets/emblems/elyri.jpg',
    roster: getFactionRoster('eldar')
  },

  // 4. THE VEYKARI (Drukhari / Dark Eldar)
  veykari: {
    id: 'veykari',
    name: 'The Veykari',
    sub: 'Predatory Raiding Warbands',
    icon: '🗡️',
    color: 0x042f2e,
    colorHex: 0x042f2e,
    trim: 0x10b981,
    trimHex: 0x10b981,
    laserColor: 0x10b981,
    quote: 'The strong feed upon the weak; reality is our hunting ground.',
    desc: 'Distant relatives of the Elyri inhabiting enormous mobile cities in unstable space. The Veykari rarely conquer worlds—they raid them at breakneck speed to harvest resources and Vital Essence before conventional armies can react.',
    battlefieldIdentity: 'Fast Raiders (Extremely fast and lethal but comparatively fragile, choosing when and where combat happens)',
    doctrine: 'Predatory raiding: Lethal poison shard volleys, executioner Incubi Klaives, winged Dark Lance Scourges, and objective looting.',
    strengths: [
      'Exceptional mobility & flanking',
      'Strong melee executioners',
      'Powerful assassins & poison',
      'Hit-and-run attacks',
      'Strong objective control'
    ],
    weaknesses: [
      'Fragile units',
      'Poor sustained attrition',
      'Vulnerable to concentrated fire',
      'Requires aggressive positioning'
    ],
    uniqueMechanic: {
      name: 'Raiding',
      desc: 'Veykari armies capture and loot battlefield objectives for combat buffs, temporary upgrades, and tactical advantages.'
    },
    image: '/assets/factions/veykari.jpg',
    emblem: '/assets/emblems/veykari.jpg',
    roster: getFactionRoster('dark_eldar')
  },

  // 5. THE GHAR (Orks / Space Orcs)
  ghar: {
    id: 'ghar',
    name: 'The Ghar',
    sub: 'Aggressive Conflict Horde',
    icon: '🐗',
    color: 0x15803d,
    colorHex: 0x15803d,
    trim: 0xd97706,
    trimHex: 0xd97706,
    laserColor: 0xf97316,
    quote: 'It worked last time.',
    desc: 'A brutal alien species whose civilization revolves entirely around conflict. Led by roaring warlords, their scrap-built weapons and ferocious mobs overwhelm enemies through pure violence and momentum.',
    battlefieldIdentity: 'Aggressive Horde (Overwhelm enemies through numbers, aggression, and brutal close combat)',
    doctrine: 'Close combat savagery: Toughness 5 (T5) resilience, devastating Power Klaws, scrap artillery, and deafening Dakka barrages.',
    strengths: [
      'Large armies & horde numbers',
      'Brutal close combat melee',
      'Cheap units & reinforcements',
      'Powerful warlords',
      'High morale when attacking'
    ],
    weaknesses: [
      'Poor ballistic discipline (BS5+)',
      'Limited ranged precision',
      'Unpredictable technology',
      'Vulnerable to organized gunlines'
    ],
    uniqueMechanic: {
      name: 'War Momentum',
      desc: 'Winning engagements generates War Momentum, unlocking powerful combat surges and aggressive battle buffs.'
    },
    image: '/assets/factions/ghar.jpg',
    emblem: '/assets/emblems/ghar.jpg',
    roster: getFactionRoster('orcs')
  },

  // 6. THE DEVOURERS (Tyranids)
  devourers: {
    id: 'devourers',
    name: 'The Devourers',
    sub: 'Adaptive Biological Swarm',
    icon: '👾',
    color: 0x581c87,
    colorHex: 0x581c87,
    trim: 0xe9d5ff,
    trimHex: 0xe9d5ff,
    laserColor: 0xa855f7,
    quote: 'Consume. Adapt. Overcome.',
    desc: 'A single distributed biological intelligence across countless predatory organisms. They consume entire planetary biospheres to rapidly evolve specialized organisms capable of overcoming any defense.',
    battlefieldIdentity: 'Biological Swarm (Large numbers of organisms supported by massive bio-monsters)',
    doctrine: 'Swarm biomass: Chittering Gaunt swarms, synapse command beasts, living spore artillery, and unstoppable Carnifex battering rams.',
    strengths: [
      'Huge swarms & numbers',
      'Devastating melee bio-weapons',
      'Monstrous resilient creatures',
      'Adaptive unit phenotypes',
      'Exceptional board control'
    ],
    weaknesses: [
      'Individual lesser organisms are fragile',
      'Command synapse can be targeted',
      'Difficult to maintain formation',
      'Heavy counter-fire disrupts strategy'
    ],
    uniqueMechanic: {
      name: 'Evolution',
      desc: 'Devourers adapt bio-traits based on enemy composition, mutating defenses against heavy armor or anti-infantry.'
    },
    image: '/assets/factions/devourers.jpg',
    emblem: '/assets/emblems/devourers.jpg',
    roster: getFactionRoster('tyranids')
  },

  // 7. THE REVENANT (Necrons)
  revenant: {
    id: 'revenant',
    name: 'The Revenant',
    sub: 'Immortal Synthetic Dynasties',
    icon: '⚡',
    color: 0x334155,
    colorHex: 0x334155,
    trim: 0x22c55e,
    trimHex: 0x22c55e,
    laserColor: 0x22c55e,
    quote: 'Time is our ally. Flesh was merely a fleeting error.',
    desc: 'An ancient civilization that abandoned biology to transfer consciousness into living metal bodies. Awakening from millions of years in subterranean tomb-cities, they march with armor-shredding Gauss weaponry and self-repairing hulls.',
    battlefieldIdentity: 'Slow, Durable & Relentless (Difficult to destroy, wielding devastating phase weapons and field self-repair)',
    doctrine: 'Relentless advance: Armor-disintegrating Gauss fire, 2+/3+ saves, hyperphase blades, and towering Canoptek war walkers.',
    strengths: [
      'Extremely durable (T5-T7 / 2+ saves)',
      'Self-repair & reassembly',
      'Armor-shredding Gauss weapons',
      'Strong defensive abilities',
      'Excellent elite units'
    ],
    weaknesses: [
      'Slow movement speed',
      'Expensive units',
      'Limited tactical agility',
      'Vulnerable to rapid flanking'
    ],
    uniqueMechanic: {
      name: 'Reconstitution',
      desc: 'Destroyed synthetic units have a chance to reassemble their metallic frames and resume battle.'
    },
    image: '/assets/factions/revenant.jpg',
    emblem: '/assets/emblems/revenant.jpg',
    roster: getFactionRoster('necros')
  },

  // 8. THE CONCORDAT (T\'au Empire)
  concordat: {
    id: 'concordat',
    name: 'The Concordat',
    sub: 'Multi-Species High-Tech Federation',
    icon: '💠',
    color: 0xc2410c,
    colorHex: 0xc2410c,
    trim: 0x06b6d4,
    trimHex: 0x06b6d4,
    laserColor: 0x06b6d4,
    quote: 'In unity and coordination, victory is mathematically assured.',
    desc: 'A young and rapidly expanding federation uniting diverse species. Combining advanced pulse rifles, sensor markerlights, combat drones, powered battlesuits, and repulsor tanks, their greatest strength is coordinated long-range fire.',
    battlefieldIdentity: 'Combined Ranged Warfare (Overlapping fields of fire and coordinated high-tech marksmanship)',
    doctrine: 'Overlapping fire superiority: Long-range 34" Pulse Rifles, 42"-48" hyper-velocity Railguns, and mobile Crisis Battlesuits.',
    strengths: [
      'Supreme ranged combat & accuracy',
      'Extreme weapon ranges (34"–48")',
      'Advanced battlesuits & drones',
      'Excellent tactical coordination',
      'Flexible combined fire'
    ],
    weaknesses: [
      'Weaker in prolonged close melee',
      'Requires strict formation discipline',
      'Individual infantry are vulnerable',
      'Less effective when isolated'
    ],
    uniqueMechanic: {
      name: 'Networked Warfare',
      desc: 'Units gain accuracy and fire-support bonuses when operating within sensor and communication ranges of friendly squads.'
    },
    image: '/assets/factions/concordat.jpg',
    emblem: '/assets/emblems/concordat.jpg',
    roster: getFactionRoster('tau')
  },

  // 9. THE RIFTBORN (Chaos Daemons)
  riftborn: {
    id: 'riftborn',
    name: 'The Riftborn',
    sub: 'Extra-Dimensional Reality Shifters',
    icon: '🌀',
    color: 0x4c1d95,
    colorHex: 0x4c1d95,
    trim: 0xf43f5e,
    trimHex: 0xf43f5e,
    laserColor: 0xec4899,
    quote: 'Reality is a brittle glass waiting to shatter.',
    desc: 'Entities from beyond normal physical space entering our dimension through violent fractures known as Rifts. They manipulate space and matter, phase through solid obstacles, and corrupt the battlefield itself.',
    battlefieldIdentity: 'Reality Manipulation (Manipulating the battlefield itself through phase shifts, summons, and dimensional terror)',
    doctrine: 'Spatial disruption: Dimensional phase-shifting, terror in close combat, reality warping, and portal strikes.',
    strengths: [
      'Teleportation & phase movement',
      'Summoning reinforcements',
      'Powerful spatial abilities',
      'Battlefield terrain distortion',
      'High psychological pressure'
    ],
    weaknesses: [
      'Unstable manifestation in reality',
      'Limited conventional long-range weapons',
      'Can struggle against disciplined gunlines',
      'Requires careful resource timing'
    ],
    uniqueMechanic: {
      name: 'The Rift',
      desc: 'Can open dimensional portals across the battlefield to teleport squads, summon warp creatures, and distort terrain.'
    },
    image: '/assets/factions/riftborn.jpg',
    emblem: '/assets/emblems/riftborn.jpg',
    roster: getFactionRoster('riftborn')
  },

  // 10. THE FORSAKEN (Chaos Space Marines)
  forsaken: {
    id: 'forsaken',
    name: 'The Forsaken',
    sub: 'Corrupted Elite Ascendants',
    icon: '💀',
    color: 0x991b1b,
    colorHex: 0x991b1b,
    trim: 0xb45309,
    trimHex: 0xb45309,
    laserColor: 0xef4444,
    quote: 'Power now — or survival later.',
    desc: 'Former Ascendants who rejected limits and pursued forbidden forms of Ascension involving alien genetics and dark dimensional energy. They combine elite warrior prowess with mutations, daemon engines, and ruthless aggression.',
    battlefieldIdentity: 'Elite Aggression (Powerful elite warriors infused with dangerous mutations and experimental technology)',
    doctrine: 'Vicious close-quarters assault: Corrupted bolters, daemon axes, fleshmetal siege weapons, and Defiler war engines.',
    strengths: [
      'Powerful heavy infantry',
      'Devastating close combat',
      'Powerful corrupted warlords',
      'Dangerous mutations',
      'Elite daemon war machines'
    ],
    weaknesses: [
      'Expensive units',
      'Limited numbers',
      'Risk/reward volatility',
      'Can become unstable'
    ],
    uniqueMechanic: {
      name: 'Corruption',
      desc: 'Units can push weapons and bodies beyond normal limits for immense temporary power, accumulating risk of corruption.'
    },
    image: '/assets/factions/forsaken.jpg',
    emblem: '/assets/emblems/forsaken.jpg',
    roster: getFactionRoster('chaos')
  },

  // NEUTRAL / AUXILIARY
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
    quote: 'Knowledge is the true armor of the soul.',
    desc: 'Keepers of ancient archeotech relics and sacred cybernetic machinery.',
    battlefieldIdentity: 'Technological Custodians',
    doctrine: 'Relic defense and archeotech transport.',
    strengths: ['Relic shields', 'High resilience'],
    weaknesses: ['Single objective escort unit'],
    roster: getFactionRoster('neutral')
  }
};

// Aliases for backwards compatibility across all systems
FACTIONS.space_marines = FACTIONS.ascendants;
FACTIONS.marines = FACTIONS.ascendants;

FACTIONS.guard = FACTIONS.directorate;
FACTIONS.astra_militarum = FACTIONS.directorate;

FACTIONS.eldar = FACTIONS.elyri;
FACTIONS.aeldari = FACTIONS.elyri;

FACTIONS.dark_eldar = FACTIONS.veykari;
FACTIONS.drukhari = FACTIONS.veykari;

FACTIONS.orcs = FACTIONS.ghar;
FACTIONS.orks = FACTIONS.ghar;

FACTIONS.tyranids = FACTIONS.devourers;

FACTIONS.necrons = FACTIONS.revenant;
FACTIONS.necros = FACTIONS.revenant;

FACTIONS.tau = FACTIONS.concordat;

FACTIONS.daemons = FACTIONS.riftborn;
FACTIONS.chaos_daemons = FACTIONS.riftborn;

FACTIONS.chaos_marines = FACTIONS.forsaken;
FACTIONS.chaos = FACTIONS.forsaken;
