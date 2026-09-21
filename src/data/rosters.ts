import type { DeploymentCard, EnemyRosterItem } from './types';

export interface FactionSquadConfig {
  key: string;
  type: string;
  name: string;
  isCharacter?: boolean;
}

export const FACTION_SQUADS: Record<string, FactionSquadConfig[]> = {
  // 1. THE ASCENDANTS (Space Marines)
  ascendants: [
    { key: 'p_hero', type: 'sm_captain', name: 'Castellan Vorn', isCharacter: true },
    { key: 'p_sq1', type: 'sm_tactical', name: 'Ascendant Vanguard Alpha' },
    { key: 'p_sq2', type: 'sm_tactical', name: 'Ascendant Vanguard Beta' },
    { key: 'p_sq3', type: 'sm_assault', name: 'Aerial Interceptors' },
    { key: 'p_sq4', type: 'sm_centurion', name: 'Centurion Breakers' },
    { key: 'p_sq5', type: 'sm_dreadnought', name: 'Aegis Dreadnought' }
  ],

  // 2. THE DIRECTORATE (Astra Militarum / Guard)
  directorate: [
    { key: 'p_hero', type: 'dir_marshal', name: 'Field Marshal Vance', isCharacter: true },
    { key: 'p_sq1', type: 'dir_shock_troops', name: 'Shock Troopers Alpha' },
    { key: 'p_sq2', type: 'dir_shock_troops', name: 'Shock Troopers Beta' },
    { key: 'p_sq3', type: 'dir_heavy_ordnance', name: 'Heavy Ordnance Battery' },
    { key: 'p_sq4', type: 'dir_sentinel', name: 'Armored Scout Sentinel' },
    { key: 'p_sq5', type: 'dir_battle_tank', name: 'Directorate Battle Tank' }
  ],

  // 3. THE ELYRI (Aeldari)
  elyri: [
    { key: 'p_hero', type: 'eld_farseer', name: 'Farseer Psionic Seer', isCharacter: true },
    { key: 'p_sq1', type: 'eld_banshees', name: 'Elyri Blade Dancers' },
    { key: 'p_sq2', type: 'eld_guardians', name: 'Citizen Defenders Alpha' },
    { key: 'p_sq3', type: 'eld_guardians', name: 'Citizen Defenders Beta' },
    { key: 'p_sq4', type: 'eld_support_weapon', name: 'Support Weapon Battery' },
    { key: 'p_sq5', type: 'eld_wraithlord', name: 'Spirit Titan Construct' }
  ],

  // 4. THE VEYKARI (Drukhari / Dark Eldar)
  veykari: [
    { key: 'p_hero', type: 'de_archon', name: 'Archon Malix', isCharacter: true },
    { key: 'p_sq1', type: 'de_incubi', name: 'Klaive Executioners' },
    { key: 'p_sq2', type: 'de_kabalites', name: 'Veykari Raiders Alpha' },
    { key: 'p_sq3', type: 'de_kabalites', name: 'Veykari Raiders Beta' },
    { key: 'p_sq4', type: 'de_talos', name: 'Pain Engine Construct' },
    { key: 'p_sq5', type: 'de_ravager', name: 'High-Speed Void Skiff' }
  ],

  // 5. THE GHAR (Orks / Space Orcs)
  ghar: [
    { key: 'p_hero', type: 'ork_warboss', name: 'Warboss Grukk', isCharacter: true },
    { key: 'p_sq1', type: 'ork_nobz', name: 'Ghar Heavy Brawlers' },
    { key: 'p_sq2', type: 'ork_boyz', name: 'Ghar Swarm Alpha' },
    { key: 'p_sq3', type: 'ork_boyz', name: 'Ghar Swarm Beta' },
    { key: 'p_sq4', type: 'ork_mek_gunz', name: 'Scrap Heavy Artillery' },
    { key: 'p_sq5', type: 'ork_deff_dread', name: 'Scrap-Behemoth Walker' }
  ],

  // 6. THE DEVOURERS (Tyranids)
  devourers: [
    { key: 'p_hero', type: 'ty_tyrant', name: 'Apex Hive Tyrant', isCharacter: true },
    { key: 'p_sq1', type: 'ty_warriors', name: 'Synapse Bio-Warriors Alpha' },
    { key: 'p_sq2', type: 'ty_warriors', name: 'Synapse Bio-Warriors Beta' },
    { key: 'p_sq3', type: 'ty_stealers', name: 'Apex Stalker Pack' },
    { key: 'p_sq4', type: 'ty_biovore', name: 'Living Spore Mortar' },
    { key: 'p_sq5', type: 'ty_carnifex', name: 'Screamer Carnifex' }
  ],

  // 7. THE REVENANT (Necrons)
  revenant: [
    { key: 'p_hero', type: 'nec_overlord', name: 'Overlord Amonhotek', isCharacter: true },
    { key: 'p_sq1', type: 'nec_immortals', name: 'Immortal Vanguard Alpha' },
    { key: 'p_sq2', type: 'nec_immortals', name: 'Immortal Vanguard Beta' },
    { key: 'p_sq3', type: 'nec_destroyers', name: 'Hyperphase Blade Constructs' },
    { key: 'p_sq4', type: 'nec_heavy_destroyer', name: 'Lokhust Heavy Destroyer' },
    { key: 'p_sq5', type: 'nec_doomstalker', name: 'Canoptek Behemoth Walker' }
  ],

  // 8. THE CONCORDAT (T'au Empire)
  concordat: [
    { key: 'p_hero', type: 'tau_commander', name: "Commander Shas'O", isCharacter: true },
    { key: 'p_sq1', type: 'tau_strike', name: 'Fire Cadre Alpha' },
    { key: 'p_sq2', type: 'tau_strike', name: 'Fire Cadre Beta' },
    { key: 'p_sq3', type: 'tau_stealth', name: 'Stealth Infiltrators' },
    { key: 'p_sq4', type: 'tau_broadside', name: 'XV88 Heavy Battlesuit' },
    { key: 'p_sq5', type: 'tau_hammerhead', name: 'TX7 Repulsor Tank' }
  ],

  // 9. THE RIFTBORN (Chaos Daemons)
  riftborn: [
    { key: 'p_hero', type: 'rb_herald', name: 'Rift Herald', isCharacter: true },
    { key: 'p_sq1', type: 'rb_bloodletters', name: 'Rift Stalkers Alpha' },
    { key: 'p_sq2', type: 'rb_bloodletters', name: 'Rift Stalkers Beta' },
    { key: 'p_sq3', type: 'rb_screamers', name: 'Warp Skimmers' },
    { key: 'p_sq4', type: 'rb_crusher', name: 'Behemoth Juggernaut' },
    { key: 'p_sq5', type: 'rb_greater_daemon', name: 'Avatar of the Void' }
  ],

  // 10. THE FORSAKEN (Chaos Space Marines)
  forsaken: [
    { key: 'p_hero', type: 'c_lord', name: 'Lord Malakar', isCharacter: true },
    { key: 'p_sq1', type: 'c_legion', name: 'Forsaken Legion Alpha' },
    { key: 'p_sq2', type: 'c_legion', name: 'Forsaken Legion Beta' },
    { key: 'p_sq3', type: 'c_raptors', name: 'Warp Raptors' },
    { key: 'p_sq4', type: 'c_obliterators', name: 'Obliterator Cult' },
    { key: 'p_sq5', type: 'c_defiler', name: 'Defiler War Walker' }
  ]
};

// Aliases for cross-system backwards compatibility
FACTION_SQUADS.marines = FACTION_SQUADS.ascendants;
FACTION_SQUADS.space_marines = FACTION_SQUADS.ascendants;

FACTION_SQUADS.guard = FACTION_SQUADS.directorate;
FACTION_SQUADS.astra_militarum = FACTION_SQUADS.directorate;

FACTION_SQUADS.eldar = FACTION_SQUADS.elyri;
FACTION_SQUADS.aeldari = FACTION_SQUADS.elyri;

FACTION_SQUADS.dark_eldar = FACTION_SQUADS.veykari;
FACTION_SQUADS.drukhari = FACTION_SQUADS.veykari;

FACTION_SQUADS.orcs = FACTION_SQUADS.ghar;
FACTION_SQUADS.orks = FACTION_SQUADS.ghar;

FACTION_SQUADS.tyranids = FACTION_SQUADS.devourers;

FACTION_SQUADS.necros = FACTION_SQUADS.revenant;
FACTION_SQUADS.necrons = FACTION_SQUADS.revenant;

FACTION_SQUADS.tau = FACTION_SQUADS.concordat;

FACTION_SQUADS.daemons = FACTION_SQUADS.riftborn;
FACTION_SQUADS.chaos_daemons = FACTION_SQUADS.riftborn;

FACTION_SQUADS.chaos = FACTION_SQUADS.forsaken;
FACTION_SQUADS.chaos_marines = FACTION_SQUADS.forsaken;

export function buildFactionRosters(pFactId: string, eFactId: string): {
  rosterPlayer: DeploymentCard[];
  rosterEnemy: EnemyRosterItem[];
} {
  const pKey = pFactId in FACTION_SQUADS ? pFactId : 'ascendants';
  const eKey = eFactId in FACTION_SQUADS ? eFactId : 'forsaken';

  const pSquads = FACTION_SQUADS[pKey] || FACTION_SQUADS.ascendants;
  const eSquads = FACTION_SQUADS[eKey] || FACTION_SQUADS.forsaken;

  const rosterPlayer: DeploymentCard[] = pSquads.map(s => ({
    key: s.key,
    type: s.type,
    name: s.name,
    isVip: false,
    placed: false,
    x: null,
    z: null,
    unitRef: null
  }));

  const enemyPositions = [
    { x: 20, z: 2 },
    { x: 12, z: 4 },
    { x: 28, z: 4 },
    { x: 6, z: 5 },
    { x: 34, z: 5 },
    { x: 20, z: 6 }
  ];

  const rosterEnemy: EnemyRosterItem[] = eSquads.map((s, idx) => ({
    key: `e_sq_${idx}`,
    type: s.type,
    name: s.name,
    isVip: false,
    x: enemyPositions[idx]?.x ?? (10 + idx * 4),
    z: enemyPositions[idx]?.z ?? 3,
    unitRef: null
  }));

  return { rosterPlayer, rosterEnemy };
}
