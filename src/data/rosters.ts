import type { DeploymentCard, EnemyRosterItem } from './types';

export interface FactionSquadConfig {
  key: string;
  type: string;
  name: string;
  isCharacter?: boolean;
}

export const FACTION_SQUADS: Record<string, FactionSquadConfig[]> = {
  marines: [
    { key: 'p_hero', type: 'sm_captain', name: 'Castellan Vorn', isCharacter: true },
    { key: 'p_sq1', type: 'sm_tactical', name: 'Tactical Squad Alpha' },
    { key: 'p_sq2', type: 'sm_tactical', name: 'Tactical Squad Beta' },
    { key: 'p_sq3', type: 'sm_assault', name: 'Assault Squad' },
    { key: 'p_sq4', type: 'sm_centurion', name: 'Centurion Breakers' },
    { key: 'p_sq5', type: 'sm_dreadnought', name: 'Castraferrum Dreadnought' }
  ],
  chaos: [
    { key: 'p_hero', type: 'c_lord', name: 'Lord Malakar', isCharacter: true },
    { key: 'p_sq1', type: 'c_legion', name: 'Chaos Legionaries Alpha' },
    { key: 'p_sq2', type: 'c_legion', name: 'Chaos Legionaries Beta' },
    { key: 'p_sq3', type: 'c_raptors', name: 'Raptor Squad' },
    { key: 'p_sq4', type: 'c_obliterators', name: 'Obliterator Cult' },
    { key: 'p_sq5', type: 'c_defiler', name: 'Defiler Daemon Engine' }
  ],
  orcs: [
    { key: 'p_hero', type: 'ork_warboss', name: 'Warboss Grukk', isCharacter: true },
    { key: 'p_sq1', type: 'ork_nobz', name: 'Goff Nobz Mob' },
    { key: 'p_sq2', type: 'ork_boyz', name: 'Skarboyz Mob Alpha' },
    { key: 'p_sq3', type: 'ork_boyz', name: 'Shoota Boyz Beta' },
    { key: 'p_sq4', type: 'ork_mek_gunz', name: 'Mek Gunz Battery' },
    { key: 'p_sq5', type: 'ork_deff_dread', name: 'Deff Dread Walker' }
  ],
  necros: [
    { key: 'p_hero', type: 'nec_overlord', name: 'Overlord Amonhotek', isCharacter: true },
    { key: 'p_sq1', type: 'nec_immortals', name: 'Immortal Phalanx Alpha' },
    { key: 'p_sq2', type: 'nec_immortals', name: 'Immortal Phalanx Beta' },
    { key: 'p_sq3', type: 'nec_destroyers', name: 'Skorpekh Destroyers' },
    { key: 'p_sq4', type: 'nec_heavy_destroyer', name: 'Lokhust Heavy Destroyer' },
    { key: 'p_sq5', type: 'nec_doomstalker', name: 'Canoptek Doomstalker' }
  ],
  eldar: [
    { key: 'p_hero', type: 'eld_farseer', name: 'Farseer Emissary', isCharacter: true },
    { key: 'p_sq1', type: 'eld_banshees', name: 'Howling Banshee Shrine' },
    { key: 'p_sq2', type: 'eld_guardians', name: 'Guardian Defenders Alpha' },
    { key: 'p_sq3', type: 'eld_guardians', name: 'Guardian Defenders Beta' },
    { key: 'p_sq4', type: 'eld_support_weapon', name: 'Support Weapon Battery' },
    { key: 'p_sq5', type: 'eld_wraithlord', name: 'Wraithlord Construct' }
  ],
  dark_eldar: [
    { key: 'p_hero', type: 'de_archon', name: 'Archon Malix', isCharacter: true },
    { key: 'p_sq1', type: 'de_incubi', name: 'Incubi Klaive Vanguard' },
    { key: 'p_sq2', type: 'de_kabalites', name: 'Kabalite Trueborn Alpha' },
    { key: 'p_sq3', type: 'de_kabalites', name: 'Kabalite Raiders Beta' },
    { key: 'p_sq4', type: 'de_talos', name: 'Talos Pain Engine' },
    { key: 'p_sq5', type: 'de_ravager', name: 'Ravager Gunship' }
  ],
  tyranids: [
    { key: 'p_hero', type: 'ty_tyrant', name: 'Hive Tyrant', isCharacter: true },
    { key: 'p_sq1', type: 'ty_warriors', name: 'Warrior Brood Alpha' },
    { key: 'p_sq2', type: 'ty_warriors', name: 'Warrior Brood Beta' },
    { key: 'p_sq3', type: 'ty_stealers', name: 'Genestealer Pack' },
    { key: 'p_sq4', type: 'ty_biovore', name: 'Biovore Spore Mortar' },
    { key: 'p_sq5', type: 'ty_carnifex', name: 'Screamer Carnifex' }
  ],
  tau: [
    { key: 'p_hero', type: 'tau_commander', name: "Commander Shas'O", isCharacter: true },
    { key: 'p_sq1', type: 'tau_strike', name: 'Fire Warriors Alpha' },
    { key: 'p_sq2', type: 'tau_strike', name: 'Fire Warriors Beta' },
    { key: 'p_sq3', type: 'tau_stealth', name: 'Stealth Battlesuits' },
    { key: 'p_sq4', type: 'tau_broadside', name: 'XV88 Broadside' },
    { key: 'p_sq5', type: 'tau_hammerhead', name: 'TX7 Hammerhead' }
  ]
};

// Aliases
FACTION_SQUADS.space_marines = FACTION_SQUADS.marines;
FACTION_SQUADS.chaos_marines = FACTION_SQUADS.chaos;
FACTION_SQUADS.necrons = FACTION_SQUADS.necros;

export function buildFactionRosters(pFactId: string, eFactId: string): {
  rosterPlayer: DeploymentCard[];
  rosterEnemy: EnemyRosterItem[];
} {
  const pKey = pFactId in FACTION_SQUADS ? pFactId : 'marines';
  const eKey = eFactId in FACTION_SQUADS ? eFactId : 'chaos';

  const pSquads = FACTION_SQUADS[pKey] || FACTION_SQUADS.marines;
  const eSquads = FACTION_SQUADS[eKey] || FACTION_SQUADS.chaos;

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
