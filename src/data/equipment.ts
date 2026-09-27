import type { UnitDef, WeaponProfile } from './types';

export interface WeaponProfileDetail extends WeaponProfile {
  id: string;
  name: string;
  type: 'ranged' | 'melee';
  category: string;
  icon: string;
  image?: string;
  range: number;
  rangeDisplay: string;
  strength: number;
  penetration: number;
  ap: number;
  damage: number;
  attacks: number;
  damageType: string;
  effectiveAgainst: string[];
  weakAgainst: string[];
  special: string;
  allowedFactions: string[];
}

export interface ArmourProfileDetail {
  name: string;
  category: string;
  icon: string;
  image?: string;
  armour: number;
  toughness: number;
  resistance: number;
  coverage: number;
  protectionAgainst: string[];
  vulnerableTo: string[];
  special: string;
}

/**
 * Normalizes any faction identifier alias to its canonical wargame faction key.
 */
export function normalizeEquipmentFaction(fId?: string): string {
  if (!fId) return 'ascendants';
  const f = fId.toLowerCase().trim();
  switch (f) {
    case 'ascendants':
    case 'space_marines':
    case 'marines':
      return 'ascendants';
    case 'directorate':
    case 'guard':
    case 'astra_militarum':
      return 'directorate';
    case 'elyri':
    case 'eldar':
    case 'aeldari':
      return 'elyri';
    case 'veykari':
    case 'dark_eldar':
    case 'drukhari':
      return 'veykari';
    case 'ghar':
    case 'orcs':
    case 'orks':
      return 'ghar';
    case 'devourers':
    case 'tyranids':
      return 'devourers';
    case 'revenant':
    case 'necrons':
    case 'necros':
      return 'revenant';
    case 'concordat':
    case 'tau':
      return 'concordat';
    case 'riftborn':
    case 'daemons':
    case 'chaos_daemons':
      return 'riftborn';
    case 'forsaken':
    case 'chaos':
    case 'chaos_marines':
      return 'forsaken';
    case 'neutral':
      return 'neutral';
    default:
      return f;
  }
}

/**
 * AUTHORITATIVE WEAPON REGISTRY
 * All weapon definitions in the game are defined here once.
 * Units declare weapon IDs to reference these immutable definitions.
 */
export const WEAPON_REGISTRY: Record<string, WeaponProfileDetail> = {
  // ==========================================
  // 1. THE ASCENDANTS (Space Marines)
  // ==========================================
  sm_plasma_pistol: {
    id: 'sm_plasma_pistol',
    name: 'MK-VII PLASMA PISTOL',
    type: 'ranged',
    category: 'Superheated Plasma Projector',
    icon: '⚡',
    range: 16,
    rangeDisplay: '16"',
    strength: 5,
    penetration: 4,
    ap: 4,
    damage: 3,
    attacks: 3,
    damageType: 'Superheated Plasma',
    effectiveAgainst: ['Heavy Armour', 'Mechanical Walkers', 'Elite Commanders'],
    weakAgainst: ['Energy Shields', 'Heat-Resistant Chitin'],
    special: 'Overcharge: Critical rolls yield +1 Damage.',
    allowedFactions: ['ascendants', 'marines']
  },
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
  sm_godwyn_bolter: {
    id: 'sm_godwyn_bolter',
    name: 'GODWYN-PATTERN BOLTER',
    type: 'ranged',
    category: 'Standard Issue Tactical Ballistic',
    icon: '🔫',
    range: 26,
    rangeDisplay: '26"',
    strength: 4,
    penetration: 2,
    ap: 2,
    damage: 2,
    attacks: 2,
    damageType: 'Kinetic Micro-Missile',
    effectiveAgainst: ['Standard Infantry', 'Unarmoured Swarms'],
    weakAgainst: ['Heavy Chitin Plates', 'Power Field Barriers'],
    special: 'Rapid Fire: Gain +1 Attack when firing at targets within half maximum range.',
    allowedFactions: ['ascendants', 'marines']
  },
  sm_bolt_pistol: {
    id: 'sm_bolt_pistol',
    name: 'BOLT PISTOL',
    type: 'ranged',
    category: 'Sidearm Ballistic',
    icon: '🔫',
    range: 14,
    rangeDisplay: '14"',
    strength: 4,
    penetration: 2,
    ap: 2,
    damage: 2,
    attacks: 2,
    damageType: 'Kinetic Micro-Missile',
    effectiveAgainst: ['Standard Infantry'],
    weakAgainst: ['Heavy Chitin Plates'],
    special: 'Point-Blank Fire: Usable when engaged in close quarters.',
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
  sm_heavy_bolter_battery: {
    id: 'sm_heavy_bolter_battery',
    name: 'HEAVY BOLTER SUPPRESSION BATTERY',
    type: 'ranged',
    category: 'Sustained Heavy Ballistic',
    icon: '💥',
    range: 38,
    rangeDisplay: '38"',
    strength: 5,
    penetration: 3,
    ap: 3,
    damage: 3,
    attacks: 3,
    damageType: 'Mass-Reactive Explosive',
    effectiveAgainst: ['Medium Armour', 'Squad Formations', 'Light Cover'],
    weakAgainst: ['Reinforced Titanium Bunkers', 'Phase Shields'],
    special: 'Suppression: Hits apply -1 Movement penalty to targets until next round.',
    allowedFactions: ['ascendants', 'marines']
  },
  sm_centurion_missiles: {
    id: 'sm_centurion_missiles',
    name: 'CHEST MISSILE BATTERY',
    type: 'ranged',
    category: 'Heavy Missile Barrage',
    icon: '💥',
    range: 38,
    rangeDisplay: '38"',
    strength: 5,
    penetration: 3,
    ap: 3,
    damage: 4,
    attacks: 3,
    damageType: 'High-Explosive Micro-Missiles',
    effectiveAgainst: ['Fortifications', 'Heavy Infantry'],
    weakAgainst: ['Point-Defense Shields'],
    special: 'Concussion Barrage: Ignores light cover bonuses.',
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
  sm_assault_cannon: {
    id: 'sm_assault_cannon',
    name: 'ROTARY ASSAULT CANNON',
    type: 'ranged',
    category: 'Heavy Rotary Ballistic',
    icon: '💥',
    range: 30,
    rangeDisplay: '30"',
    strength: 6,
    penetration: 3,
    ap: 3,
    damage: 3,
    attacks: 4,
    damageType: 'Kinetic High-Velocity',
    effectiveAgainst: ['Infantry Cohorts', 'Light Vehicles', 'Fortifications'],
    weakAgainst: ['Deflective Energy Screens', 'Displacement Fields'],
    special: 'Devastating Fire: Re-rolls wound rolls of 1 against non-shielded targets.',
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
  },

  // ==========================================
  // 2. THE DIRECTORATE (Astra Militarum / Guard)
  // ==========================================
  dir_bolt_pistol: {
    id: 'dir_bolt_pistol',
    name: 'MASTER-CRAFTED BOLT PISTOL',
    type: 'ranged',
    category: 'Officer Sidearm',
    icon: '🔫',
    range: 20,
    rangeDisplay: '20"',
    strength: 4,
    penetration: 2,
    ap: 2,
    damage: 2,
    attacks: 2,
    damageType: 'Kinetic Micro-Missile',
    effectiveAgainst: ['Infantry Officers', 'Light Targets'],
    weakAgainst: ['Heavy Power Armor'],
    special: 'Officer Precision: +1 to hit against enemy Characters.',
    allowedFactions: ['directorate', 'guard']
  },
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
  dir_las_rifle: {
    id: 'dir_las_rifle',
    name: 'CANTRIC-PATTERN LAS-RIFLE',
    type: 'ranged',
    category: 'Directed Energy Carbine',
    icon: '⚡',
    range: 24,
    rangeDisplay: '24"',
    strength: 3,
    penetration: 1,
    ap: 1,
    damage: 1,
    attacks: 2,
    damageType: 'Coherent Laser Beam',
    effectiveAgainst: ['Light Infantry', 'Unarmoured Flesh'],
    weakAgainst: ['Heavy Power Armour', 'Ablative Ceramic Plating'],
    special: 'First Rank Fire: Cohorts with 3+ surviving models gain +1 volley attack.',
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
  dir_autocannon_battery: {
    id: 'dir_autocannon_battery',
    name: 'TWIN-LINKED AUTOCANNON BATTERY',
    type: 'ranged',
    category: 'Heavy Kinetic Artillery',
    icon: '💥',
    range: 40,
    rangeDisplay: '40"',
    strength: 5,
    penetration: 3,
    ap: 3,
    damage: 3,
    attacks: 3,
    damageType: 'High-Explosive Kinetic',
    effectiveAgainst: ['Light Armour', 'Hover Skimmers', 'Exosuits'],
    weakAgainst: ['Heavy Refractor Shields', 'Subterranean Targets'],
    special: 'Long-Range Calibration: Target receives no cover bonuses beyond 24".',
    allowedFactions: ['directorate', 'guard']
  },
  dir_heavy_plasma_cannon: {
    id: 'dir_heavy_plasma_cannon',
    name: 'HEAVY PLASMA CANNON',
    type: 'ranged',
    category: 'Vehicle Plasma Ordnance',
    icon: '⚡',
    range: 32,
    rangeDisplay: '32"',
    strength: 6,
    penetration: 4,
    ap: 4,
    damage: 3,
    attacks: 3,
    damageType: 'Superheated Plasma Arc',
    effectiveAgainst: ['Exosuits', 'Armoured Vehicles'],
    weakAgainst: ['Phase Displacement Shields'],
    special: 'Thermal Blast: Generates high-damage blast radius.',
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
  },
  dir_earthshaker_cannon: {
    id: 'dir_earthshaker_cannon',
    name: 'EARTHSHAKER SIEGE CANNON',
    type: 'ranged',
    category: 'Long-Range Ordnance',
    icon: '🎯',
    range: 50,
    rangeDisplay: '50"',
    strength: 6,
    penetration: 4,
    ap: 4,
    damage: 5,
    attacks: 2,
    damageType: 'High-Explosive Heavy Shell',
    effectiveAgainst: ['Heavy Fortifications', 'Massed Battalions'],
    weakAgainst: ['Agile Skimmers', 'Subterranean Tunnels'],
    special: 'Seismic Impact: Shatters cover and disrupts enemy infantry morale.',
    allowedFactions: ['directorate', 'guard']
  },
  dir_battle_cannon: {
    id: 'dir_battle_cannon',
    name: 'HEAVY BATTLE CANNON',
    type: 'ranged',
    category: 'Main Battle Tank Ordnance',
    icon: '💥',
    range: 42,
    rangeDisplay: '42"',
    strength: 7,
    penetration: 4,
    ap: 4,
    damage: 5,
    attacks: 2,
    damageType: 'High-Velocity Anti-Tank Shell',
    effectiveAgainst: ['Tanks', 'Monstrous Creatures'],
    weakAgainst: ['Energy Shields'],
    special: 'Armor Piercer: High impact kinetic shell.',
    allowedFactions: ['directorate', 'guard']
  },
  dir_sponson_bolters: {
    id: 'dir_sponson_bolters',
    name: 'SPONSON HEAVY BOLTERS',
    type: 'ranged',
    category: 'Secondary Defensive Ballistics',
    icon: '🔫',
    range: 24,
    rangeDisplay: '24"',
    strength: 4,
    penetration: 2,
    ap: 2,
    damage: 2,
    attacks: 3,
    damageType: 'Mass-Reactive Explosive',
    effectiveAgainst: ['Infantry Cohorts'],
    weakAgainst: ['Heavy Tanks'],
    special: 'Point-Defense Suppression: Fires defensive volleys.',
    allowedFactions: ['directorate', 'guard']
  },

  // ==========================================
  // 3. ELYRI (Aeldari / Craftworld)
  // ==========================================
  eld_mind_war: {
    id: 'eld_mind_war',
    name: 'MIND WAR PSIONIC VOLLEY',
    type: 'ranged',
    category: 'Psychic Projection',
    icon: '🔮',
    range: 24,
    rangeDisplay: '24"',
    strength: 4,
    penetration: 4,
    ap: 4,
    damage: 3,
    attacks: 2,
    damageType: 'Psionic Brain-Rend',
    effectiveAgainst: ['Commanders', 'Biological Organisms'],
    weakAgainst: ['Synthetic Automata', 'Null Fields'],
    special: 'Mind Rend: Directly attacks target leadership morale.',
    allowedFactions: ['elyri', 'eldar']
  },
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
  eld_shuriken_pistol: {
    id: 'eld_shuriken_pistol',
    name: 'SHURIKEN PISTOL',
    type: 'ranged',
    category: 'Monomolecular Sidearm',
    icon: '✨',
    range: 14,
    rangeDisplay: '14"',
    strength: 4,
    penetration: 3,
    ap: 3,
    damage: 2,
    attacks: 2,
    damageType: 'Monomolecular Shuriken',
    effectiveAgainst: ['Light Infantry'],
    weakAgainst: ['Heavy Tanks'],
    special: 'Bladestorm: Natural wound rolls of 6 automatically pierce all armor saves.',
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
  eld_reaper_launcher: {
    id: 'eld_reaper_launcher',
    name: 'REAPER MISSILE LAUNCHER',
    type: 'ranged',
    category: 'Aspect Heavy Missile',
    icon: '💥',
    range: 40,
    rangeDisplay: '40"',
    strength: 5,
    penetration: 4,
    ap: 4,
    damage: 3,
    attacks: 3,
    damageType: 'Starshot High-Explosive',
    effectiveAgainst: ['Armoured Vehicles', 'Heavy Infantry'],
    weakAgainst: ['Displacement Barriers'],
    special: 'Inescapable Death: Re-rolls all failed hit rolls against exposed units.',
    allowedFactions: ['elyri', 'eldar']
  },
  eld_shuriken_catapult: {
    id: 'eld_shuriken_catapult',
    name: 'MONOFILAMENT SHURIKEN CATAPULT',
    type: 'ranged',
    category: 'Exotic Monomolecular',
    icon: '✨',
    range: 24,
    rangeDisplay: '24"',
    strength: 4,
    penetration: 4,
    ap: 4,
    damage: 2,
    attacks: 2,
    damageType: 'Monomolecular Shuriken',
    effectiveAgainst: ['Heavy Infantry', 'Exoskeletons', 'Living Flesh'],
    weakAgainst: ['Energy Forcefields', 'Reinforced Armoured Hulls'],
    special: 'Bladestorm: Natural wound rolls of 6 automatically pierce all armor saves.',
    allowedFactions: ['elyri', 'eldar']
  },
  eld_distortion_cannon: {
    id: 'eld_distortion_cannon',
    name: 'DISTORTION CANNON',
    type: 'ranged',
    category: 'Gravitic Warp Rift Weapon',
    icon: '🌀',
    range: 42,
    rangeDisplay: '42"',
    strength: 6,
    penetration: 5,
    ap: 5,
    damage: 4,
    attacks: 2,
    damageType: 'Warp Distortion',
    effectiveAgainst: ['Heavy Fortifications', 'Super-Heavies'],
    weakAgainst: ['Phase Shifters'],
    special: 'Rift Collapse: Ignores all non-invulnerable armor saves.',
    allowedFactions: ['elyri', 'eldar']
  },
  eld_bright_lance: {
    id: 'eld_bright_lance',
    name: 'BRIGHT LANCE',
    type: 'ranged',
    category: 'Anti-Armor Laser Lance',
    icon: '⚡',
    range: 36,
    rangeDisplay: '36"',
    strength: 6,
    penetration: 4,
    ap: 4,
    damage: 4,
    attacks: 2,
    damageType: 'Coherent High-Energy Beam',
    effectiveAgainst: ['Heavy Tanks', 'Colossal Constructs'],
    weakAgainst: ['Refractor Fields'],
    special: 'Armor Lance: Heavy armor counts as maximum 3+ against this weapon.',
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
  },

  // ==========================================
  // 4. VEYKARI (Drukhari / Dark Eldar)
  // ==========================================
  de_splinter_pistol: {
    id: 'de_splinter_pistol',
    name: 'SPLINTER PISTOL',
    type: 'ranged',
    category: 'Toxic Crystal Sidearm',
    icon: '🔫',
    range: 20,
    rangeDisplay: '20"',
    strength: 3,
    penetration: 3,
    ap: 3,
    damage: 2,
    attacks: 2,
    damageType: 'Virulent Splinter / Neurotoxin',
    effectiveAgainst: ['Biological Organisms', 'Light Infantry'],
    weakAgainst: ['Synthetic Automata', 'Armoured Vehicles'],
    special: 'Poisoned Crystals: Wounds on fixed 4+ regardless of enemy Toughness.',
    allowedFactions: ['veykari', 'dark_eldar']
  },
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
  de_tormentor: {
    id: 'de_tormentor',
    name: 'TORMENTOR PHANTASM GRENADES',
    type: 'ranged',
    category: 'Psychotropic Disorientation Projector',
    icon: '🔮',
    range: 14,
    rangeDisplay: '14"',
    strength: 3,
    penetration: 2,
    ap: 2,
    damage: 2,
    attacks: 2,
    damageType: 'Psychotropic Neurotoxin',
    effectiveAgainst: ['Infantry Cohorts'],
    weakAgainst: ['Vehicles'],
    special: 'Terror Shock: Hits force immediate morale check.',
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
  de_dark_lance: {
    id: 'de_dark_lance',
    name: 'DARK LANCE',
    type: 'ranged',
    category: 'Dark Matter Beam',
    icon: '⚡',
    range: 36,
    rangeDisplay: '36"',
    strength: 6,
    penetration: 4,
    ap: 4,
    damage: 4,
    attacks: 2,
    damageType: 'Dark Matter Antimatter',
    effectiveAgainst: ['Tanks', 'Heavy Walkers'],
    weakAgainst: ['Phase Displacement'],
    special: 'Antimatter Lance: Bypasses non-energy armor plating.',
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
  de_splinter_rifle: {
    id: 'de_splinter_rifle',
    name: 'SPLINTER RIFLE',
    type: 'ranged',
    category: 'Toxic Crystal Projectile',
    icon: '🔫',
    range: 26,
    rangeDisplay: '26"',
    strength: 3,
    penetration: 3,
    ap: 3,
    damage: 1,
    attacks: 2,
    damageType: 'Virulent Splinter / Neurotoxin',
    effectiveAgainst: ['Biological Organisms', 'Light Infantry'],
    weakAgainst: ['Synthetic Automata', 'Armoured Vehicles'],
    special: 'Poisoned Crystals: Wounds on fixed 4+ regardless of enemy Toughness.',
    allowedFactions: ['veykari', 'dark_eldar']
  },
  de_heat_lance: {
    id: 'de_heat_lance',
    name: 'HEAT LANCE',
    type: 'ranged',
    category: 'Thermal Fusion Beam',
    icon: '🔥',
    range: 28,
    rangeDisplay: '28"',
    strength: 6,
    penetration: 4,
    ap: 4,
    damage: 4,
    attacks: 2,
    damageType: 'Thermal Fusion',
    effectiveAgainst: ['Armored Hulls', 'Monsters'],
    weakAgainst: ['Thermal Shields'],
    special: 'Melta Arc: Deals +2 Damage at half range.',
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
  },
  de_triple_dark_lances: {
    id: 'de_triple_dark_lances',
    name: 'TRIPLE DARK LANCE BATTERY',
    type: 'ranged',
    category: 'Dark Matter Battery',
    icon: '⚡',
    range: 42,
    rangeDisplay: '42"',
    strength: 6,
    penetration: 4,
    ap: 4,
    damage: 4,
    attacks: 3,
    damageType: 'Dark Matter Antimatter',
    effectiveAgainst: ['Heavy Tanks', 'Fortifications'],
    weakAgainst: ['Displacement Barriers'],
    special: 'Antimatter Volley: Heavy firepower from high-speed firing platform.',
    allowedFactions: ['veykari', 'dark_eldar']
  },

  // ==========================================
  // 5. GHAR (Orks / Greenskins)
  // ==========================================
  ork_kombi_shoota: {
    id: 'ork_kombi_shoota',
    name: 'KOMBI-SHOOTA',
    type: 'ranged',
    category: 'Brutal Scrap Ballistics',
    icon: '🔫',
    range: 18,
    rangeDisplay: '18"',
    strength: 5,
    penetration: 2,
    ap: 2,
    damage: 2,
    attacks: 3,
    damageType: 'Heavy Ballistic Lead',
    effectiveAgainst: ['Light Vehicles', 'Unprotected Infantry'],
    weakAgainst: ['Precision Snipers'],
    special: 'Dakka Volley: Extra hit generated on natural 6s during attack roll.',
    allowedFactions: ['ghar', 'orcs']
  },
  ork_power_klaw: {
    id: 'ork_power_klaw',
    name: 'HYDRAULIC POWER KLAW',
    type: 'melee',
    category: 'Crushing Industrial Pincer',
    icon: '🦞',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 7,
    penetration: 4,
    ap: 4,
    damage: 4,
    attacks: 3,
    damageType: 'Pneumatic Shearing Metal',
    effectiveAgainst: ['Tanks', 'Heavy Walkers', 'Fortifications'],
    weakAgainst: ['Agile Skimmers'],
    special: 'Armor Snip: Deals double damage against mechanical and armored targets.',
    allowedFactions: ['ghar', 'orcs']
  },
  ork_slugga: {
    id: 'ork_slugga',
    name: 'SLUGGA',
    type: 'ranged',
    category: 'Heavy Calibre Scrap Pistol',
    icon: '🔫',
    range: 14,
    rangeDisplay: '14"',
    strength: 4,
    penetration: 1,
    ap: 1,
    damage: 2,
    attacks: 2,
    damageType: 'Heavy Ballistic Lead',
    effectiveAgainst: ['Infantry'],
    weakAgainst: ['Power Armor'],
    special: 'Point-Blank Dakka: Usable in close range.',
    allowedFactions: ['ghar', 'orcs']
  },
  ork_big_choppa: {
    id: 'ork_big_choppa',
    name: "HEAVY 'EAVY CHOPPA",
    type: 'melee',
    category: 'Brutal Serrated Axe',
    icon: '🪓',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 5,
    penetration: 2,
    ap: 2,
    damage: 2,
    attacks: 3,
    damageType: 'Brutal Slashing',
    effectiveAgainst: ['Infantry Cohorts', 'Scrap Metal'],
    weakAgainst: ['Energy Shields'],
    special: 'Waaagh Frenzy: +1 Strength when fighting multiple models.',
    allowedFactions: ['ghar', 'orcs']
  },
  ork_deffgun: {
    id: 'ork_deffgun',
    name: 'SCRAP DEFFGUNS',
    type: 'ranged',
    category: 'Randomized Heavy Ballistics',
    icon: '💥',
    range: 34,
    rangeDisplay: '34"',
    strength: 6,
    penetration: 3,
    ap: 3,
    damage: 3,
    attacks: 3,
    damageType: 'Randomized Heavy Calibre',
    effectiveAgainst: ['Squad Formations', 'Light Armor'],
    weakAgainst: ['Refractor Barriers'],
    special: 'Random Rate of Fire: Hits pack immense stopping power.',
    allowedFactions: ['ghar', 'orcs']
  },
  ork_dakka_shoota: {
    id: 'ork_dakka_shoota',
    name: 'DAKKA SHOOTA',
    type: 'ranged',
    category: 'High-Volume Scrap Firearm',
    icon: '🔫',
    range: 20,
    rangeDisplay: '20"',
    strength: 4,
    penetration: 1,
    ap: 1,
    damage: 1,
    attacks: 3,
    damageType: 'Lead Slug Spray',
    effectiveAgainst: ['Swarms', 'Light Infantry'],
    weakAgainst: ['Heavy Carapace'],
    special: 'More Dakka: Extra attack when firing within 10".',
    allowedFactions: ['ghar', 'orcs']
  },
  ork_choppa: {
    id: 'ork_choppa',
    name: 'SCRAP CHOPPA',
    type: 'melee',
    category: 'Heavy Cleaving Blade',
    icon: '🪓',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 4,
    penetration: 1,
    ap: 1,
    damage: 1,
    attacks: 3,
    damageType: 'Brutal Cleaving',
    effectiveAgainst: ['Light Infantry'],
    weakAgainst: ['Heavy Armor'],
    special: 'Choppa Fury: Grants +1 attack in melee.',
    allowedFactions: ['ghar', 'orcs']
  },
  ork_traktor_kannon: {
    id: 'ork_traktor_kannon',
    name: 'TRAKTOR KANNON',
    type: 'ranged',
    category: 'Gravitic Scrap Weapon',
    icon: '💥',
    range: 40,
    rangeDisplay: '40"',
    strength: 7,
    penetration: 3,
    ap: 3,
    damage: 4,
    attacks: 2,
    damageType: 'Gravitic Crush',
    effectiveAgainst: ['Flyers', 'Vehicles'],
    weakAgainst: ['Displacement Fields'],
    special: 'Gravitic Snare: Automatically grounds flying targets.',
    allowedFactions: ['ghar', 'orcs']
  },
  ork_rokkit_launcha: {
    id: 'ork_rokkit_launcha',
    name: 'TWIN ROKKIT LAUNCHAS',
    type: 'ranged',
    category: 'Unguided Scrap Rockets',
    icon: '🚀',
    range: 24,
    rangeDisplay: '24"',
    strength: 6,
    penetration: 3,
    ap: 3,
    damage: 3,
    attacks: 2,
    damageType: 'High Explosive Scrap',
    effectiveAgainst: ['Vehicles', 'Bunkers'],
    weakAgainst: ['Energy Shields'],
    special: 'Tankbusta Rocket: High explosive yield against vehicles.',
    allowedFactions: ['ghar', 'orcs']
  },
  ork_buzz_saws: {
    id: 'ork_buzz_saws',
    name: 'DUAL BUZZ SAWS',
    type: 'melee',
    category: 'Industrial Motorized Saws',
    icon: '⚙️',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 6,
    penetration: 4,
    ap: 4,
    damage: 4,
    attacks: 3,
    damageType: 'Rotary Steel Teeth',
    effectiveAgainst: ['Walkers', 'Fortifications'],
    weakAgainst: ['Agile Skimmers'],
    special: 'Dismantle: Deals bonus damage against mechanical targets.',
    allowedFactions: ['ghar', 'orcs']
  },

  // ==========================================
  // 6. THE DEVOURERS (Tyranids / Hive Fleet)
  // ==========================================
  ty_stranglethorn_cannon: {
    id: 'ty_stranglethorn_cannon',
    name: 'STRANGLETHORN CANNON',
    type: 'ranged',
    category: 'Bio-Organic Siege Spore Launcher',
    icon: '🌿',
    range: 24,
    rangeDisplay: '24"',
    strength: 7,
    penetration: 3,
    ap: 3,
    damage: 4,
    attacks: 3,
    damageType: 'Barbed Bio-Seed Blast',
    effectiveAgainst: ['Infantry Formations', 'Light Vehicles', 'Concentrated Squads'],
    weakAgainst: ['Heavy Refractor Barriers', 'Void Shields'],
    special: 'Barbed Seed Blast: Entangles targets, reducing target Movement by 2 on hit.',
    allowedFactions: ['devourers', 'tyranids']
  },
  ty_crushing_claws: {
    id: 'ty_crushing_claws',
    name: 'CRUSHING CLAWS',
    type: 'melee',
    category: 'Diamond-Hard Pincer Claws',
    icon: '🦀',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 6,
    penetration: 4,
    ap: 4,
    damage: 6,
    attacks: 2,
    damageType: 'Bio-Organic Rending',
    effectiveAgainst: ['Heavy Armour', 'Tanks', 'Fortified Exoskeletons'],
    weakAgainst: ['Displacement Phase Fields'],
    special: 'Rending Strike: Wound rolls of 6 inflict critical armor penetration.',
    allowedFactions: ['devourers', 'tyranids']
  },
  ty_scything_talons: {
    id: 'ty_scything_talons',
    name: 'SCYTHING TALONS',
    type: 'melee',
    category: 'Bio-Organic Monomolecular Scythes',
    icon: '🦞',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 5,
    penetration: 3,
    ap: 3,
    damage: 5,
    attacks: 4,
    damageType: 'Bio-Organic Slicing',
    effectiveAgainst: ['Infantry Formations', 'Light Armour', 'Swarm Units'],
    weakAgainst: ['Reinforced Ceramite Bunkers'],
    special: 'Scything Sweep: Re-rolls wound rolls of 1 in melee combat.',
    allowedFactions: ['devourers', 'tyranids']
  },
  ty_heavy_venom_cannon: {
    id: 'ty_heavy_venom_cannon',
    name: 'HEAVY VENOM CANNON',
    type: 'ranged',
    category: 'Bio-Organic Acid Slag Projector',
    icon: '👾',
    range: 28,
    rangeDisplay: '28"',
    strength: 6,
    penetration: 3,
    ap: 3,
    damage: 4,
    attacks: 3,
    damageType: 'Corrosive Bio-Acid Crystals',
    effectiveAgainst: ['Armored Constructs', 'Elite Infantry'],
    weakAgainst: ['Energy Shields'],
    special: 'Corrosive Slag: Melts enemy armor saves on impact.',
    allowedFactions: ['devourers', 'tyranids']
  },
  ty_deathspitter: {
    id: 'ty_deathspitter',
    name: 'DEATHSPITTER',
    type: 'ranged',
    category: 'Corrosive Parasite Projector',
    icon: '👾',
    range: 26,
    rangeDisplay: '26"',
    strength: 5,
    penetration: 2,
    ap: 2,
    damage: 2,
    attacks: 3,
    damageType: 'Corrosive Parasitic Maggots',
    effectiveAgainst: ['Medium Infantry', 'Organic Cohorts'],
    weakAgainst: ['Vehicle Armor'],
    special: 'Flesh Maggots: Ongoing corrosive damage.',
    allowedFactions: ['devourers', 'tyranids']
  },
  ty_flesh_hooks: {
    id: 'ty_flesh_hooks',
    name: 'FLESH HOOKS',
    type: 'ranged',
    category: 'Bio-Organic Harpoon Organs',
    icon: '🪝',
    range: 14,
    rangeDisplay: '14"',
    strength: 4,
    penetration: 2,
    ap: 2,
    damage: 2,
    attacks: 2,
    damageType: 'Chitinous Harpoon Barb',
    effectiveAgainst: ['Light Infantry'],
    weakAgainst: ['Vehicles'],
    special: 'Bio-Grapple: Pulls user towards target or target towards user.',
    allowedFactions: ['devourers', 'tyranids']
  },
  ty_rending_claws: {
    id: 'ty_rending_claws',
    name: 'RENDING CLAWS',
    type: 'melee',
    category: 'Diamond-Hard Pincer Claws',
    icon: '🦀',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 4,
    penetration: 4,
    ap: 4,
    damage: 2,
    attacks: 3,
    damageType: 'Bio-Organic Rending',
    effectiveAgainst: ['Organic Targets', 'Armoured Infantry'],
    weakAgainst: ['Energy Barriers'],
    special: 'Rending Flurry: Penetrates all non-invulnerable armour on wound rolls of 6.',
    allowedFactions: ['devourers', 'tyranids']
  },
  ty_fleshborer: {
    id: 'ty_fleshborer',
    name: 'FLESHBORER SWARM',
    type: 'ranged',
    category: 'Bio-Munition Beetle Colony',
    icon: '🐛',
    range: 20,
    rangeDisplay: '20"',
    strength: 3,
    penetration: 1,
    ap: 1,
    damage: 1,
    attacks: 2,
    damageType: 'Boring Beetle Organisms',
    effectiveAgainst: ['Unarmored Swarms', 'Light Infantry'],
    weakAgainst: ['Heavy Carapace'],
    special: 'Chittering Swarm: Large attack volumes overwhelm unarmoured foes.',
    allowedFactions: ['devourers', 'tyranids']
  },
  ty_spore_mine_cannon: {
    id: 'ty_spore_mine_cannon',
    name: 'SPORE MINE CANNON',
    type: 'ranged',
    category: 'Biological Mortar Organ',
    icon: '🍄',
    range: 44,
    rangeDisplay: '44"',
    strength: 5,
    penetration: 3,
    ap: 3,
    damage: 3,
    attacks: 2,
    damageType: 'Volatile Spore Detonation',
    effectiveAgainst: ['Massed Battalions', 'Cover Targets'],
    weakAgainst: ['Dispersal Fields'],
    special: 'Spore Burst: Bypasses line of sight and cover.',
    allowedFactions: ['devourers', 'tyranids']
  },

  // ==========================================
  // 7. THE REVENANT (Necrons / Undying)
  // ==========================================
  nec_staff_of_light: {
    id: 'nec_staff_of_light',
    name: 'STAFF OF LIGHT',
    type: 'ranged',
    category: 'Solar Energy Scepter',
    icon: '⚡',
    range: 20,
    rangeDisplay: '20"',
    strength: 5,
    penetration: 3,
    ap: 3,
    damage: 3,
    attacks: 3,
    damageType: 'High-Energy Solar Beams',
    effectiveAgainst: ['Commanders', 'Heavy Infantry'],
    weakAgainst: ['Phase Displacement'],
    special: 'Solar Lance: Directed energy discharge.',
    allowedFactions: ['revenant', 'necros']
  },
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
  nec_gauss_blaster: {
    id: 'nec_gauss_blaster',
    name: 'TWIN GAUSS BLASTERS',
    type: 'ranged',
    category: 'Gauss Molecular Disruptor',
    icon: '⚡',
    range: 28,
    rangeDisplay: '28"',
    strength: 5,
    penetration: 3,
    ap: 3,
    damage: 2,
    attacks: 2,
    damageType: 'Gauss Molecular Field',
    effectiveAgainst: ['Armored Infantry', 'Walkers'],
    weakAgainst: ['Psychic Dispersal Barriers'],
    special: 'Gauss Disruption: Disintegrates armor layers on hit rolls of 6.',
    allowedFactions: ['revenant', 'necros']
  },
  nec_plasmacyte_darts: {
    id: 'nec_plasmacyte_darts',
    name: 'PLASMACYTE ENERGY DARTS',
    type: 'ranged',
    category: 'Nanite Bio-Disruption Darts',
    icon: '✨',
    range: 14,
    rangeDisplay: '14"',
    strength: 4,
    penetration: 2,
    ap: 2,
    damage: 2,
    attacks: 2,
    damageType: 'Nanite Molecular Siphon',
    effectiveAgainst: ['Light Infantry'],
    weakAgainst: ['Heavy Armor'],
    special: 'Viral Nanites: Siphons target energy.',
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
  },
  nec_gauss_flayer: {
    id: 'nec_gauss_flayer',
    name: 'GAUSS FLAYER',
    type: 'ranged',
    category: 'Molecular Disintegration',
    icon: '⚡',
    range: 24,
    rangeDisplay: '24"',
    strength: 4,
    penetration: 3,
    ap: 3,
    damage: 2,
    attacks: 2,
    damageType: 'Gauss Molecular Field',
    effectiveAgainst: ['Heavy Armour', 'Tanks & Engines', 'Mechanical Plating'],
    weakAgainst: ['Psychic Dispersal Barriers', 'Phase Shifters'],
    special: 'Gauss Disruption: Automatically damages vehicles and heavy armor on hit rolls of 6.',
    allowedFactions: ['revenant', 'necros']
  },
  nec_enmitic_exterminator: {
    id: 'nec_enmitic_exterminator',
    name: 'ENMITIC EXTERMINATOR',
    type: 'ranged',
    category: 'Annihilation Beam Battery',
    icon: '💥',
    range: 44,
    rangeDisplay: '44"',
    strength: 6,
    penetration: 4,
    ap: 4,
    damage: 4,
    attacks: 3,
    damageType: 'Molecular Annihilation Beam',
    effectiveAgainst: ['Heavy Armor', 'Monoliths'],
    weakAgainst: ['Phase Shields'],
    special: 'Annihilation: Re-rolls all failed wound rolls.',
    allowedFactions: ['revenant', 'necros']
  },
  nec_doomsday_blaster: {
    id: 'nec_doomsday_blaster',
    name: 'DOOMSDAY BLASTER',
    type: 'ranged',
    category: 'Titanic Molecular Beam',
    icon: '🎯',
    range: 40,
    rangeDisplay: '40"',
    strength: 7,
    penetration: 5,
    ap: 5,
    damage: 5,
    attacks: 2,
    damageType: 'Doomsday Super-Disintegration',
    effectiveAgainst: ['Titanic Walkers', 'Fortifications'],
    weakAgainst: ['Phase Disrupters'],
    special: 'Doomsday Blast: Inflicts devastating structural ruin.',
    allowedFactions: ['revenant', 'necros']
  },

  // ==========================================
  // 8. THE CONCORDAT (T'au Empire)
  // ==========================================
  tau_burst_cannon: {
    id: 'tau_burst_cannon',
    name: 'TWIN BURST CANNONS',
    type: 'ranged',
    category: 'Plasma Pulse Rotary Gun',
    icon: '💠',
    range: 26,
    rangeDisplay: '26"',
    strength: 5,
    penetration: 2,
    ap: 2,
    damage: 2,
    attacks: 4,
    damageType: 'Induction Plasma',
    effectiveAgainst: ['Infantry Cohorts', 'Light Vehicles'],
    weakAgainst: ['Heavy Energy Fields'],
    special: 'High Output: Generates saturated fire volleys.',
    allowedFactions: ['concordat', 'tau']
  },
  tau_fusion_blaster: {
    id: 'tau_fusion_blaster',
    name: 'FUSION BLASTER',
    type: 'ranged',
    category: 'Thermal Sub-Atomic Beam',
    icon: '🔥',
    range: 16,
    rangeDisplay: '16"',
    strength: 7,
    penetration: 4,
    ap: 4,
    damage: 4,
    attacks: 2,
    damageType: 'Sub-Atomic Fusion',
    effectiveAgainst: ['Heavy Tanks', 'Exosuits'],
    weakAgainst: ['Phase Displacement'],
    special: 'Melta Resonance: Deals maximum damage at short ranges.',
    allowedFactions: ['concordat', 'tau']
  },
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
  tau_long_pulse_rifle: {
    id: 'tau_long_pulse_rifle',
    name: 'LONG-BARREL PULSE RIFLE',
    type: 'ranged',
    category: 'Advanced Plasma Induction',
    icon: '💠',
    range: 34,
    rangeDisplay: '34"',
    strength: 4,
    penetration: 2,
    ap: 2,
    damage: 2,
    attacks: 2,
    damageType: 'Induction Plasma',
    effectiveAgainst: ['Medium Armour', 'Infantry Cohorts', 'Long-Range Targets'],
    weakAgainst: ['Energy Shields', 'Heat-Resistant Targets'],
    special: 'Target Lock: Markerlight coordination grants +1 Accuracy at extreme ranges.',
    allowedFactions: ['concordat', 'tau']
  },
  tau_stealth_burst_cannon: {
    id: 'tau_stealth_burst_cannon',
    name: 'STEALTH BURST CANNON',
    type: 'ranged',
    category: 'Suppressed Pulse Rotary',
    icon: '💠',
    range: 22,
    rangeDisplay: '22"',
    strength: 4,
    penetration: 2,
    ap: 2,
    damage: 2,
    attacks: 3,
    damageType: 'Induction Plasma',
    effectiveAgainst: ['Infantry Formations'],
    weakAgainst: ['Heavy Armor'],
    special: 'Ambush Protocol: +1 to hit when firing from concealment.',
    allowedFactions: ['concordat', 'tau']
  },
  tau_rail_rifle: {
    id: 'tau_rail_rifle',
    name: 'HYPER-VELOCITY RAIL RIFLE',
    type: 'ranged',
    category: 'Electromagnetic Kinetic Rail',
    icon: '💠',
    range: 42,
    rangeDisplay: '42"',
    strength: 6,
    penetration: 4,
    ap: 4,
    damage: 3,
    attacks: 2,
    damageType: 'Hypervelocity Slug',
    effectiveAgainst: ['Heavy Armour', 'Mechanical Walkers', 'Bunkers'],
    weakAgainst: ['Phase Displacement Screens'],
    special: 'Sub-Munition Penetration: Hits ignore all cover bonuses.',
    allowedFactions: ['concordat', 'tau']
  },
  tau_twin_heavy_rail_rifle: {
    id: 'tau_twin_heavy_rail_rifle',
    name: 'TWIN HEAVY RAIL RIFLES',
    type: 'ranged',
    category: 'Heavy Electromagnetic Rail Platform',
    icon: '💠',
    range: 44,
    rangeDisplay: '44"',
    strength: 7,
    penetration: 4,
    ap: 4,
    damage: 4,
    attacks: 2,
    damageType: 'Heavy Hypervelocity Slug',
    effectiveAgainst: ['Super-Heavy Walkers', 'Main Battle Tanks'],
    weakAgainst: ['Phase Disrupters'],
    special: 'Solid Core Impact: Kinetic impact bypasses non-energy defenses.',
    allowedFactions: ['concordat', 'tau']
  },
  tau_missile_pod: {
    id: 'tau_missile_pod',
    name: 'SMART MISSILE POD',
    type: 'ranged',
    category: 'Indirect Seeker Missiles',
    icon: '🚀',
    range: 36,
    rangeDisplay: '36"',
    strength: 5,
    penetration: 2,
    ap: 2,
    damage: 3,
    attacks: 2,
    damageType: 'Smart Micro-Missiles',
    effectiveAgainst: ['Hidden Targets', 'Light Infantry'],
    weakAgainst: ['Active Jammers'],
    special: 'Indirect Targeting: Can fire at targets obscured by terrain.',
    allowedFactions: ['concordat', 'tau']
  },
  tau_long_railgun: {
    id: 'tau_long_railgun',
    name: 'LONG-BARREL RAILGUN',
    type: 'ranged',
    category: 'Titanic Kinetic Accelerator',
    icon: '💠',
    range: 48,
    rangeDisplay: '48"',
    strength: 8,
    penetration: 5,
    ap: 5,
    damage: 5,
    attacks: 1,
    damageType: 'Sub-Relativistic Solid Slug',
    effectiveAgainst: ['Titanic Constructs', 'Heavy Fortresses'],
    weakAgainst: ['Quantum Phase Shields'],
    special: 'Titanic Kinetic Piercer: Critical hits deal catastrophic bonus damage.',
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
  },

  // ==========================================
  // 9. THE RIFTBORN (Chaos Daemons)
  // ==========================================
  rb_warp_flux: {
    id: 'rb_warp_flux',
    name: 'WARP FLUX BLAST',
    type: 'ranged',
    category: 'Dimensional Warpfire',
    icon: '🌀',
    range: 20,
    rangeDisplay: '20"',
    strength: 5,
    penetration: 4,
    ap: 4,
    damage: 3,
    attacks: 2,
    damageType: 'Dimensional Warpfire',
    effectiveAgainst: ['Mortal Armies', 'Standard Armor', 'Sanity/Morale'],
    weakAgainst: ['Sanctified Aegis Fields', 'Anti-Psionic Wards'],
    special: 'Reality Tear: Ignores non-magical physical cover and shields.',
    allowedFactions: ['riftborn', 'daemons']
  },
  rb_dimensional_blade: {
    id: 'rb_dimensional_blade',
    name: 'DIMENSIONAL BLADE',
    type: 'melee',
    category: 'Corrupted Hellforged Blade',
    icon: '🗡️',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 5,
    penetration: 4,
    ap: 4,
    damage: 3,
    attacks: 3,
    damageType: 'Daemonic Fire Cleave',
    effectiveAgainst: ['Mortal Armies', 'Standard Armor'],
    weakAgainst: ['Sanctified Aegis Fields'],
    special: 'Hellfire Cleave: Critical hits in melee inflict permanent burning.',
    allowedFactions: ['riftborn', 'daemons']
  },
  rb_rift_darts: {
    id: 'rb_rift_darts',
    name: 'RIFT DARTS',
    type: 'ranged',
    category: 'Daemonic Needle Shards',
    icon: '🔥',
    range: 14,
    rangeDisplay: '14"',
    strength: 4,
    penetration: 3,
    ap: 3,
    damage: 2,
    attacks: 2,
    damageType: 'Warp Energy Shards',
    effectiveAgainst: ['Light Troops'],
    weakAgainst: ['Sanctified Armor'],
    special: 'Warp Splinter: Spreads psychic horror on hit.',
    allowedFactions: ['riftborn', 'daemons']
  },
  rb_hellblade: {
    id: 'rb_hellblade',
    name: 'WARP-FORGED HELLBLADE',
    type: 'melee',
    category: 'Daemonic Broadsword',
    icon: '🗡️',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 5,
    penetration: 4,
    ap: 4,
    damage: 2,
    attacks: 3,
    damageType: 'Unholy Warp Edge',
    effectiveAgainst: ['Standard Infantry', 'Armored Troops'],
    weakAgainst: ['Sanctified Wards'],
    special: 'Soul Cleaver: Rends armor on wound rolls of 6.',
    allowedFactions: ['riftborn', 'daemons']
  },
  rb_tail_spikes: {
    id: 'rb_tail_spikes',
    name: 'WARP TAIL SPIKES',
    type: 'ranged',
    category: 'Bio-Ethereal Spikes',
    icon: '🌀',
    range: 16,
    rangeDisplay: '16"',
    strength: 4,
    penetration: 3,
    ap: 3,
    damage: 2,
    attacks: 2,
    damageType: 'Ethereal Bio-Spike',
    effectiveAgainst: ['Light Troops'],
    weakAgainst: ['Shields'],
    special: 'Skimming Volley: Usable while moving at high speeds.',
    allowedFactions: ['riftborn', 'daemons']
  },
  rb_lamprey_bite: {
    id: 'rb_lamprey_bite',
    name: 'LAMPREY BITES',
    type: 'melee',
    category: 'Vicious Daemonic Maw',
    icon: '🦷',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 4,
    penetration: 3,
    ap: 3,
    damage: 2,
    attacks: 3,
    damageType: 'Daemonic Slashing',
    effectiveAgainst: ['Flesh', 'Infantry'],
    weakAgainst: ['Heavy Plating'],
    special: 'Flesh Gouge: Recovers vitality upon slaying enemy models.',
    allowedFactions: ['riftborn', 'daemons']
  },
  rb_coruscating_warpfire: {
    id: 'rb_coruscating_warpfire',
    name: 'CORUSCATING WARPFIRE',
    type: 'ranged',
    category: 'Shifting Chaos Flame',
    icon: '🔥',
    range: 24,
    rangeDisplay: '24"',
    strength: 4,
    penetration: 3,
    ap: 3,
    damage: 2,
    attacks: 3,
    damageType: 'Shifting Warp Flame',
    effectiveAgainst: ['Squads', 'Light Infantry'],
    weakAgainst: ['Consecrated Armor'],
    special: 'Mutating Flames: Ignores physical armor saves on wound rolls of 6.',
    allowedFactions: ['riftborn', 'daemons']
  },
  rb_warp_claws: {
    id: 'rb_warp_claws',
    name: 'ETHEREAL WARP CLAWS',
    type: 'melee',
    category: 'Non-Euclidean Claws',
    icon: '🦀',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 4,
    penetration: 3,
    ap: 3,
    damage: 2,
    attacks: 3,
    damageType: 'Ethereal Tearing',
    effectiveAgainst: ['Infantry'],
    weakAgainst: ['Sanctified Wards'],
    special: 'Phantasmal Rending: Bypasses non-magical shields.',
    allowedFactions: ['riftborn', 'daemons']
  },
  rb_rift_shockwave: {
    id: 'rb_rift_shockwave',
    name: 'RIFT SHOCKWAVE',
    type: 'ranged',
    category: 'Dimensional Shock Blast',
    icon: '💥',
    range: 20,
    rangeDisplay: '20"',
    strength: 6,
    penetration: 3,
    ap: 3,
    damage: 3,
    attacks: 2,
    damageType: 'Concussive Warp Distortion',
    effectiveAgainst: ['Formations', 'Exosuits'],
    weakAgainst: ['Energy Fields'],
    special: 'Reality Rupture: Disorients affected enemies.',
    allowedFactions: ['riftborn', 'daemons']
  },
  rb_brass_horns: {
    id: 'rb_brass_horns',
    name: 'BRASS HORNS',
    type: 'melee',
    category: 'Demonic Juggernaut Horns',
    icon: '🐂',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 6,
    penetration: 4,
    ap: 4,
    damage: 4,
    attacks: 3,
    damageType: 'Crushing Brass Impact',
    effectiveAgainst: ['Vehicles', 'Fortified Positions'],
    weakAgainst: ['Phase Disrupters'],
    special: 'Unstoppable Momentum: Deals double damage on turns unit charged.',
    allowedFactions: ['riftborn', 'daemons']
  },
  rb_void_rift_beam: {
    id: 'rb_void_rift_beam',
    name: 'VOID RIFT BEAM',
    type: 'ranged',
    category: 'Avatar Dimensional Rift',
    icon: '🌀',
    range: 30,
    rangeDisplay: '30"',
    strength: 7,
    penetration: 5,
    ap: 5,
    damage: 4,
    attacks: 3,
    damageType: 'Pure Void Annihilation',
    effectiveAgainst: ['Titanic Walkers', 'Heavy Formations'],
    weakAgainst: ['Sanctified Aegis Fields'],
    special: 'Void Annihilation: Tears through matter and energy barriers.',
    allowedFactions: ['riftborn', 'daemons']
  },
  rb_great_cleaver: {
    id: 'rb_great_cleaver',
    name: 'GREAT CLEAVER OF THE VOID',
    type: 'melee',
    category: 'Titanic Hell-Forged Blade',
    icon: '🪓',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 7,
    penetration: 5,
    ap: 5,
    damage: 5,
    attacks: 4,
    damageType: 'Unholy Cleave',
    effectiveAgainst: ['Commanders', 'Tanks', 'Monsters'],
    weakAgainst: ['Consecrated Shields'],
    special: 'Cataclysmic Strike: Cleaves through all enemy defensive saves.',
    allowedFactions: ['riftborn', 'daemons']
  },

  // ==========================================
  // 10. THE FORSAKEN (Chaos Space Marines)
  // ==========================================
  c_warp_pistol: {
    id: 'c_warp_pistol',
    name: 'WARP PISTOL',
    type: 'ranged',
    category: 'Corrupted Plasma Pistol',
    icon: '🔥',
    range: 16,
    rangeDisplay: '16"',
    strength: 5,
    penetration: 3,
    ap: 3,
    damage: 2,
    attacks: 2,
    damageType: 'Unholy Plasma Flame',
    effectiveAgainst: ['Close Assault Cohorts', 'Armoured Infantry'],
    weakAgainst: ['Aura Shields'],
    special: 'Hellfire Blast: Ignores cover within 8".',
    allowedFactions: ['forsaken', 'chaos']
  },
  c_daemon_axe: {
    id: 'c_daemon_axe',
    name: 'WARP-FORGED DAEMON AXE',
    type: 'melee',
    category: 'Demonic Melee Cleaver',
    icon: '🪓',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 6,
    penetration: 4,
    ap: 4,
    damage: 3,
    attacks: 3,
    damageType: 'Warp-Infused Cleave',
    effectiveAgainst: ['Armoured Infantry', 'Commanders', 'Monster Hulls'],
    weakAgainst: ['Consecrated Shields'],
    special: 'Soul Cleaver: Brutal close-combat cleave that rends heavy armour.',
    allowedFactions: ['forsaken', 'chaos']
  },
  c_corrupted_bolter: {
    id: 'c_corrupted_bolter',
    name: 'CORRUPTED BOLTER',
    type: 'ranged',
    category: 'Infernal Chaos Ballistics',
    icon: '💀',
    range: 26,
    rangeDisplay: '26"',
    strength: 4,
    penetration: 3,
    ap: 3,
    damage: 2,
    attacks: 2,
    damageType: 'Unholy Warp-Tainted Shot',
    effectiveAgainst: ['Armoured Infantry', 'Light Fortifications'],
    weakAgainst: ['Consecrated Armor', 'Aura Shields'],
    special: 'Malicious Volley: Hits trigger an immediate morale roll on the targeted squad.',
    allowedFactions: ['forsaken', 'chaos']
  },
  c_corrupted_chainsword: {
    id: 'c_corrupted_chainsword',
    name: 'CORRUPTED CHAINSWORD',
    type: 'melee',
    category: 'Barbed Motorized Blade',
    icon: '🗡️',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 4,
    penetration: 2,
    ap: 2,
    damage: 2,
    attacks: 3,
    damageType: 'Serrated Rotary Teeth',
    effectiveAgainst: ['Infantry Cohorts', 'Flesh'],
    weakAgainst: ['Heavy Exo-Plating'],
    special: 'Blood Tithe: Generates +1 attack when eliminating enemy models in melee.',
    allowedFactions: ['forsaken', 'chaos']
  },
  c_chainaxe: {
    id: 'c_chainaxe',
    name: 'CORRUPTED CHAINAXE',
    type: 'melee',
    category: 'Barbed Motorized Axe',
    icon: '🪓',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 5,
    penetration: 3,
    ap: 3,
    damage: 2,
    attacks: 3,
    damageType: 'Serrated Rotary Teeth',
    effectiveAgainst: ['Armored Troops', 'Flesh'],
    weakAgainst: ['Power Shields'],
    special: 'Berserker Cleave: Grants +1 Strength on charging turns.',
    allowedFactions: ['forsaken', 'chaos']
  },
  c_scavenged_autogun: {
    id: 'c_scavenged_autogun',
    name: 'SCAVENGED AUTOGUN',
    type: 'ranged',
    category: 'Improvised Rapid Ballistics',
    icon: '🔫',
    range: 20,
    rangeDisplay: '20"',
    strength: 3,
    penetration: 1,
    ap: 1,
    damage: 1,
    attacks: 2,
    damageType: 'Crude Kinetic Lead',
    effectiveAgainst: ['Unarmored Targets'],
    weakAgainst: ['Ceramite Plating'],
    special: 'Frenzied Burst: Inaccurate high-volume fire.',
    allowedFactions: ['forsaken', 'chaos']
  },
  c_cultist_blade: {
    id: 'c_cultist_blade',
    name: 'RITUAL SACRIFICE BLADE',
    type: 'melee',
    category: 'Jagged Cultist Dagger',
    icon: '🔪',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 3,
    penetration: 1,
    ap: 1,
    damage: 1,
    attacks: 2,
    damageType: 'Corrupted Steel',
    effectiveAgainst: ['Unarmored Flesh'],
    weakAgainst: ['Power Armor'],
    special: 'Dark Sacrifice: Grants bonus zeal upon slaying an enemy.',
    allowedFactions: ['forsaken', 'chaos']
  },
  c_fleshmetal_heavy_cannon: {
    id: 'c_fleshmetal_heavy_cannon',
    name: 'FLESHMETAL HEAVY CANNON',
    type: 'ranged',
    category: 'Bio-Mechanical Mutating Cannon',
    icon: '💥',
    range: 36,
    rangeDisplay: '36"',
    strength: 6,
    penetration: 4,
    ap: 4,
    damage: 4,
    attacks: 3,
    damageType: 'Mutating Plasma / Solid Shot',
    effectiveAgainst: ['Heavy Tanks', 'Walkers', 'Fortifications'],
    weakAgainst: ['Sanctified Fields'],
    special: 'Fleshmetal Mutation: Randomizes between high AP and high damage each volley.',
    allowedFactions: ['forsaken', 'chaos']
  },
  c_fleshmetal_drill: {
    id: 'c_fleshmetal_drill',
    name: 'FLESHMETAL SIEGE DRILL',
    type: 'melee',
    category: 'Bio-Mechanical Breaching Arm',
    icon: '🥊',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 6,
    penetration: 4,
    ap: 4,
    damage: 4,
    attacks: 3,
    damageType: 'Crushing Fleshmetal Impact',
    effectiveAgainst: ['Bunkers', 'Heavy Walkers'],
    weakAgainst: ['Phase Disrupters'],
    special: 'Fleshmetal Rend: Bypasses non-energy armor.',
    allowedFactions: ['forsaken', 'chaos']
  },
  c_defiler_battle_cannon: {
    id: 'c_defiler_battle_cannon',
    name: 'DEFILER BATTLE CANNON',
    type: 'ranged',
    category: 'Daemon Engine Ordnance',
    icon: '💥',
    range: 36,
    rangeDisplay: '36"',
    strength: 7,
    penetration: 4,
    ap: 4,
    damage: 4,
    attacks: 2,
    damageType: 'Corrupted High Explosive',
    effectiveAgainst: ['Mass Formations', 'Vehicles'],
    weakAgainst: ['Sanctified Barriers'],
    special: 'Daemon Fire Burst: Shatters morale and infantry cover.',
    allowedFactions: ['forsaken', 'chaos']
  },
  c_spiked_claws: {
    id: 'c_spiked_claws',
    name: 'DEFILER SPIKED CLAWS',
    type: 'melee',
    category: 'Titanic Daemon Engine Pincers',
    icon: '🦞',
    range: 0,
    rangeDisplay: 'Melee',
    strength: 7,
    penetration: 4,
    ap: 4,
    damage: 5,
    attacks: 3,
    damageType: 'Crushing Daemon Fleshmetal',
    effectiveAgainst: ['Tanks', 'Monsters', 'Walkers'],
    weakAgainst: ['Displacement Fields'],
    special: 'Crushing Vice: Crushes vehicle armor.',
    allowedFactions: ['forsaken', 'chaos']
  },

  // ==========================================
  // 11. NEUTRAL & SHARED AUXILIARY
  // ==========================================
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

/**
 * Resolves a single weapon definition by its unique ID.
 */
export function resolveWeapon(weaponId: string): WeaponProfileDetail | undefined {
  return WEAPON_REGISTRY[weaponId];
}

/**
 * Returns all distinct weapon profiles for a given unit definition.
 * Authoritative source: unitDef.weaponIds (or unitDef.weapons).
 */
export function getUnitWeaponProfiles(unitDef: UnitDef): WeaponProfileDetail[] {
  const profiles: WeaponProfileDetail[] = [];

  // 1. Authoritative: weaponIds specified on the unit definition
  if (unitDef.weaponIds && unitDef.weaponIds.length > 0) {
    for (const wId of unitDef.weaponIds) {
      const wep = resolveWeapon(wId);
      if (wep) {
        profiles.push(wep);
      } else {
        console.warn(`[Equipment Registry] Weapon ID "${wId}" not found in WEAPON_REGISTRY for unit "${unitDef.name || unitDef.type}".`);
      }
    }
    if (profiles.length > 0) return profiles;
  }

  // 2. Explicit WeaponProfile objects provided on unitDef.weapons
  if (unitDef.weapons && unitDef.weapons.length > 0) {
    for (const wp of unitDef.weapons) {
      if (wp.id && WEAPON_REGISTRY[wp.id]) {
        profiles.push(WEAPON_REGISTRY[wp.id]);
      } else {
        const isMelee = wp.type === 'melee' || wp.range === 0;
        profiles.push({
          id: wp.id || 'custom_weapon',
          name: wp.name.toUpperCase(),
          type: wp.type || (isMelee ? 'melee' : 'ranged'),
          category: wp.category || (isMelee ? 'Combat Melee Weapon' : 'Tactical Firearm'),
          icon: wp.icon || (isMelee ? '⚔️' : '🔫'),
          range: wp.range !== undefined ? wp.range : (isMelee ? 0 : unitDef.range || 18),
          rangeDisplay: wp.rangeDisplay || (isMelee ? 'Melee' : `${wp.range || unitDef.range || 18}"`),
          strength: wp.strength || unitDef.s || 4,
          penetration: wp.penetration ?? wp.ap ?? 2,
          ap: wp.ap ?? wp.penetration ?? 2,
          damage: wp.damage || (isMelee ? unitDef.meleeDmg : unitDef.dmg) || 2,
          attacks: wp.attacks || 2,
          damageType: wp.damageType || (isMelee ? 'Kinetic Slashing' : 'Kinetic Ballistic'),
          effectiveAgainst: wp.effectiveAgainst || (isMelee ? ['Infantry Formations', 'Light Armour'] : ['Standard Infantry', 'Unarmoured Units']),
          weakAgainst: wp.weakAgainst || ['Heavy Refractor Barriers'],
          special: wp.special || 'Standard military issue.',
          allowedFactions: wp.allowedFactions || ['all']
        });
      }
    }
    if (profiles.length > 0) return profiles;
  }

  // 3. Fallback generic profile
  const fallback = getUnitWeaponProfile(unitDef);
  if (fallback) profiles.push(fallback);
  return profiles;
}

/**
 * Resolves the unit's dedicated primary RANGED weapon profile.
 * Returns null if the unit has no ranged weapon capability.
 */
export function getUnitRangedWeaponProfile(unitDef: UnitDef): WeaponProfileDetail | null {
  const allWeapons = getUnitWeaponProfiles(unitDef);
  return allWeapons.find(w => w.type === 'ranged' || w.range > 2) || null;
}

/**
 * Resolves the unit's dedicated primary MELEE weapon profile.
 * Returns null if the unit has no melee weapon capability.
 */
export function getUnitMeleeWeaponProfile(unitDef: UnitDef): WeaponProfileDetail | null {
  const allWeapons = getUnitWeaponProfiles(unitDef);
  return allWeapons.find(w => w.type === 'melee' || w.range <= 2) || null;
}

/**
 * Backwards compatible primary weapon resolver.
 */
export function getUnitWeaponProfile(unitDef: UnitDef): WeaponProfileDetail {
  const allWeapons = getUnitWeaponProfiles(unitDef);
  if (allWeapons.length > 0) return allWeapons[0];

  const rangeVal = unitDef.range > 2 ? unitDef.range : 0;
  const isMelee = rangeVal === 0;
  return {
    id: 'default_armament',
    name: (unitDef.weapon || 'Standard Armament').toUpperCase(),
    type: isMelee ? 'melee' : 'ranged',
    category: 'Standard Tactical Armament',
    icon: isMelee ? '⚔️' : '🔫',
    range: rangeVal,
    rangeDisplay: rangeVal > 0 ? `${rangeVal}"` : 'Melee',
    strength: unitDef.s || 4,
    penetration: 2,
    ap: 2,
    damage: unitDef.dmg || 2,
    attacks: unitDef.squadSize > 1 ? 2 : 3,
    damageType: 'Kinetic Ballistic / Energy',
    effectiveAgainst: ['Infantry Cohorts', 'Light Units'],
    weakAgainst: ['Heavy Refractor Barriers'],
    special: 'Standard Field Issue: Reliable tactical fire.',
    allowedFactions: ['all']
  };
}

/**
 * Procedural/Specific armour database for all units
 */
export function getUnitArmourProfile(unitDef: UnitDef): ArmourProfileDetail {
  const faction = normalizeEquipmentFaction(unitDef.factionId);
  const sv = unitDef.armorSave || unitDef.sv || 3;
  const toughness = unitDef.toughness || unitDef.t || 4;
  const armourVal = 7 - sv; // 2+ save -> 5-6 armor score, 3+ save -> 4-5 armor score

  // 1. Ascendants (Space Marines)
  if (faction === 'ascendants') {
    return {
      name: 'ASCENDANT POWER ARMOUR MK-X',
      category: 'Powered Exoskeletal Ceramite',
      icon: '🛡️',
      armour: Math.max(5, armourVal + 2),
      toughness: toughness,
      resistance: 4,
      coverage: 3,
      protectionAgainst: ['Kinetic Shrapnel', 'Plasma Discharges', 'Standard Small Arms'],
      vulnerableTo: ['Corrosive Chemical Acid', 'Psionic Mind-Blasts'],
      special: 'Reinforced Ceramite: Reduces incoming high-penetration AP values by 1.'
    };
  }

  // 2. Directorate (Astra Militarum / Guard)
  if (faction === 'directorate') {
    return {
      name: 'COMPOSITE CARAPACE FLAK WEAVE',
      category: 'Layered Ballistic Carapace',
      icon: '🪖',
      armour: Math.max(3, armourVal),
      toughness: toughness,
      resistance: 3,
      coverage: 3,
      protectionAgainst: ['Indirect Shrapnel', 'Laser Beams', 'Explosive Shockwaves'],
      vulnerableTo: ['High-Calibre AP Rounds', 'Monomolecular Blades'],
      special: 'Ablative Padding: +1 Cover save bonus when entrenched behind barricades.'
    };
  }

  // 3. Elyri (Aeldari / Craftworld)
  if (faction === 'elyri') {
    return {
      name: 'WRAITHBONE SPIRIT-CARAPACE',
      category: 'Psychoreactive Material',
      icon: '✨',
      armour: Math.max(4, armourVal + 1),
      toughness: toughness,
      resistance: 5,
      coverage: 2,
      protectionAgainst: ['Psionic Attacks', 'Warp Distortions', 'Laser Fire'],
      vulnerableTo: ['High-Explosive Artillery', 'Crushing Mass Loads'],
      special: 'Phase Reflex: 5+ invulnerable dodge save against all ranged attacks.'
    };
  }

  // 4. Veykari (Drukhari / Dark Eldar)
  if (faction === 'veykari') {
    return {
      name: 'GHOSTPLATE SHADOW SUIT',
      category: 'Barbed Micro-Splinter Weave',
      icon: '🗡️',
      armour: Math.max(4, armourVal),
      toughness: toughness,
      resistance: 4,
      coverage: 2,
      protectionAgainst: ['Toxins & Venoms', 'Precision Ballistics'],
      vulnerableTo: ['Area-of-Effect Flamethrowers', 'Heavy Shock Artillery'],
      special: 'Shadow Flicker: Target suffers -1 Accuracy when targeting this unit past 18".'
    };
  }

  // 5. Ghar (Orks / Greenskins)
  if (faction === 'ghar') {
    return {
      name: "'EAVY SCRAP-IRON BATTLEPLATE",
      category: 'Crude Welded Armor Plates',
      icon: '🐗',
      armour: Math.max(4, armourVal + 1),
      toughness: toughness + 1,
      resistance: 3,
      coverage: 3,
      protectionAgainst: ['Blunt Trauma', 'Small Arms Volleys'],
      vulnerableTo: ['Precision Snipers', 'Plasma Piercing Guns'],
      special: "'Ere We Go: Toughness increases by +1 during turns in which unit charges."
    };
  }

  // 6. Devourers (Tyranids / Hive Fleet)
  if (faction === 'devourers') {
    return {
      name: 'HARDENED CHITIN EXOSKELETON',
      category: 'Bio-Organic Chitinous Carapace',
      icon: '👾',
      armour: Math.max(4, armourVal + 1),
      toughness: toughness,
      resistance: 4,
      coverage: 3,
      protectionAgainst: ['Kinetic Impact', 'Thermal Burns', 'Laser Beams'],
      vulnerableTo: ['Concentrated Flame Munitions', 'Cryo Freezing'],
      special: 'Rapid Regeneration: Regenerates 1 lost Wound at the start of each friendly turn.'
    };
  }

  // 7. Revenant (Necrons / Undying)
  if (faction === 'revenant') {
    return {
      name: 'LIVING METAL NECRODERMIS',
      category: 'Self-Repairing Nanometal',
      icon: '⚡',
      armour: Math.max(5, armourVal + 2),
      toughness: toughness + 1,
      resistance: 5,
      coverage: 3,
      protectionAgainst: ['Molecular Piercing', 'Gauss Fire', 'Kinetic Shrapnel'],
      vulnerableTo: ['Antimatter Disrupters', 'Super-Mass Graviton Weapons'],
      special: 'Reanimation Protocols: 5+ roll upon defeat to stand back up with 1 Wound.'
    };
  }

  // 8. Concordat (T\'au Empire)
  if (faction === 'concordat') {
    return {
      name: 'NANO-COMPOSITE BATTLESUIT ALLOY',
      category: 'Advanced Nano-Laminate Plating',
      icon: '💠',
      armour: Math.max(4, armourVal + 1),
      toughness: toughness,
      resistance: 4,
      coverage: 3,
      protectionAgainst: ['Energy Blasts', 'Plasma Discharges', 'Electronic Jammers'],
      vulnerableTo: ['Close Combat Power Weapons', 'Heavy Corrosives'],
      special: 'Energy Shield Matrix: Absorbs the first 2 points of damage taken per battle round.'
    };
  }

  // 9. Riftborn (Chaos Daemons)
  if (faction === 'riftborn') {
    return {
      name: 'WARP-DISPLACEMENT AURA',
      category: 'Ethereal Non-Euclidean Shield',
      icon: '🌀',
      armour: Math.max(5, armourVal + 2),
      toughness: toughness,
      resistance: 6,
      coverage: 2,
      protectionAgainst: ['Physical Projectiles', 'Kinetic Melee Blades'],
      vulnerableTo: ['Blessed / Sanctified Weapons', 'Null-Field Grenades'],
      special: 'Dimensional Incorporeal: 4+ invulnerable save against non-magical damage.'
    };
  }

  // 10. Forsaken (Chaos Space Marines)
  if (faction === 'forsaken') {
    return {
      name: 'WARP-FORGED FLESHMETAL PLATE',
      category: 'Possessed Daemon-Fused Ceramite',
      icon: '💀',
      armour: Math.max(5, armourVal + 2),
      toughness: toughness,
      resistance: 4,
      coverage: 3,
      protectionAgainst: ['Direct Ballistic Hits', 'Explosive Concussions'],
      vulnerableTo: ['Sanctified Laser Cannons', 'Psychic Null Fields'],
      special: 'Daemonic Resilience: Ignores the first point of damage inflicted by each attack.'
    };
  }

  // Generic / Auxiliary Fallback
  return {
    name: 'REINFORCED CARAPACE PLATING',
    category: 'Standard Armoured Weave',
    icon: '🛡️',
    armour: Math.max(3, armourVal),
    toughness: toughness,
    resistance: 3,
    coverage: 2,
    protectionAgainst: ['Shrapnel', 'Small Arms'],
    vulnerableTo: ['Heavy Anti-Tank Munitions'],
    special: 'Standard Armor: Baseline kinetic protection.'
  };
}

export interface UtilityProfileDetail {
  movement: number;
  awareness: number;
  morale: number;
  movementType: 'ground' | 'vehicle' | 'fly' | 'colossus';
  awarenessType: 'sensory' | 'vision' | 'psychic';
  movementTypeDisplay: string;
  awarenessTypeDisplay: string;
  icon: string;
}

/**
 * Authoritative utility profile resolver for units
 */
export function getUnitUtilityProfile(unitDef: UnitDef): UtilityProfileDetail {
  const move = unitDef.movement || unitDef.m || 6;
  const rawAwareness = unitDef.awareness !== undefined ? unitDef.awareness : 14;
  const awareness = Math.min(9, Math.max(3, Math.floor(rawAwareness / 3)));
  const morale = unitDef.leadership || 7;

  // Resolve Movement Type
  let movementType: 'ground' | 'vehicle' | 'fly' | 'colossus' = 'ground';
  const nameLower = (unitDef.name || '').toLowerCase();
  const titleLower = (unitDef.title || '').toLowerCase();

  if (unitDef.movementType) {
    movementType = unitDef.movementType;
  } else if (
    unitDef.isLarge ||
    titleLower.includes('titan') ||
    titleLower.includes('dreadnought') ||
    titleLower.includes('carnifex') ||
    titleLower.includes('colossus') ||
    titleLower.includes('avatar')
  ) {
    movementType = 'colossus';
  } else if (
    titleLower.includes('jump') ||
    titleLower.includes('skimmer') ||
    titleLower.includes('aerial') ||
    titleLower.includes('skiff') ||
    titleLower.includes('flight') ||
    titleLower.includes('raptor') ||
    titleLower.includes('scourge') ||
    nameLower.includes('skiff')
  ) {
    movementType = 'fly';
  } else if (
    titleLower.includes('tank') ||
    titleLower.includes('sentinel') ||
    titleLower.includes('walker') ||
    titleLower.includes('wagon') ||
    titleLower.includes('basilisk') ||
    titleLower.includes('engine')
  ) {
    movementType = 'vehicle';
  } else {
    movementType = 'ground';
  }

  // Resolve Awareness Type
  let awarenessType: 'sensory' | 'vision' | 'psychic' = 'vision';
  const faction = normalizeEquipmentFaction(unitDef.factionId);

  if (unitDef.awarenessType) {
    awarenessType = unitDef.awarenessType;
  } else if (
    faction === 'riftborn' ||
    faction === 'elyri' ||
    titleLower.includes('farseer') ||
    titleLower.includes('psychic') ||
    titleLower.includes('herald') ||
    titleLower.includes('archon')
  ) {
    awarenessType = 'psychic';
  } else if (
    faction === 'devourers' ||
    faction === 'ghar' ||
    titleLower.includes('beast') ||
    titleLower.includes('swarm') ||
    titleLower.includes('stalker')
  ) {
    awarenessType = 'sensory';
  } else {
    awarenessType = 'vision';
  }

  // Tactical visual icon
  let icon = '🧭';
  if (movementType === 'fly') icon = '🚀';
  else if (movementType === 'vehicle') icon = '⚙️';
  else if (movementType === 'colossus') icon = '🏛️';
  else if (awarenessType === 'psychic') icon = '✨';
  else if (awarenessType === 'sensory') icon = '📡';

  return {
    movement: move,
    awareness,
    morale,
    movementType,
    awarenessType,
    movementTypeDisplay: movementType.toUpperCase(),
    awarenessTypeDisplay: awarenessType.toUpperCase(),
    icon
  };
}

/**
 * Data Integrity and Defensive Validation:
 * Validates that a unit definition's equipment, weapon profiles, armour profiles,
 * and utility attributes are complete and valid.
 */
export function validateUnitEquipment(unitDef: UnitDef): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!unitDef) {
    return { valid: false, errors: ['Unit definition is null or undefined.'] };
  }

  const unitFaction = normalizeEquipmentFaction(unitDef.factionId);

  // 1. Validate weapon IDs if declared
  if (unitDef.weaponIds) {
    if (!Array.isArray(unitDef.weaponIds) || unitDef.weaponIds.length === 0) {
      errors.push(`Unit "${unitDef.name || unitDef.type}" has an invalid/empty weaponIds array.`);
    } else {
      for (const wId of unitDef.weaponIds) {
        const weaponDef = resolveWeapon(wId);
        if (!weaponDef) {
          errors.push(`Unit "${unitDef.name}" references non-existent weapon ID: "${wId}"`);
        } else {
          // Defensive Faction Check
          if (
            weaponDef.allowedFactions &&
            !weaponDef.allowedFactions.includes('all') &&
            !weaponDef.allowedFactions.includes(unitFaction) &&
            !weaponDef.allowedFactions.includes(unitDef.factionId)
          ) {
            errors.push(
              `Unit "${unitDef.name}" (faction: ${unitFaction}) illegally equipped faction-restricted weapon "${weaponDef.name}" (${wId}). Allowed: [${weaponDef.allowedFactions.join(', ')}]`
            );
          }
        }
      }
    }
  }

  // 2. Validate resolved weapons
  const weapons = getUnitWeaponProfiles(unitDef);
  if (!weapons || weapons.length === 0) {
    errors.push(`Unit "${unitDef.name || unitDef.type}" has no resolved weapon profiles.`);
  } else {
    weapons.forEach((w, idx) => {
      if (!w.name || w.name.trim() === '') {
        errors.push(`Unit "${unitDef.name}" weapon #${idx + 1} is missing a name.`);
      }
      if (w.damage === undefined || w.damage <= 0) {
        errors.push(`Unit "${unitDef.name}" weapon "${w.name}" has invalid damage: ${w.damage}`);
      }
      if (w.strength === undefined || w.strength <= 0) {
        errors.push(`Unit "${unitDef.name}" weapon "${w.name}" has invalid strength: ${w.strength}`);
      }
      if (w.range === undefined || w.range < 0) {
        errors.push(`Unit "${unitDef.name}" weapon "${w.name}" has invalid range: ${w.range}`);
      }
    });
  }

  // 3. Validate armour
  const armour = getUnitArmourProfile(unitDef);
  if (!armour || !armour.name) {
    errors.push(`Unit "${unitDef.name || unitDef.type}" failed to resolve an armour profile.`);
  }

  // 4. Validate utility
  const utility = getUnitUtilityProfile(unitDef);
  if (!utility || !utility.movementType || !utility.awarenessType) {
    errors.push(`Unit "${unitDef.name || unitDef.type}" failed to resolve a utility profile.`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

