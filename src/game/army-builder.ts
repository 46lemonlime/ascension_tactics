import { UNIT_DEFS } from '../data/units';
import type { ArmyComposition, ArmyUnitSelection, DeploymentCard, EnemyRosterItem, PointLimit, UnitDef } from '../data/types';

/**
 * Normalizes faction identifiers to match internal unit definition factionIds.
 */
export function normalizeFactionId(fId: string): string {
  switch (fId) {
    case 'ascendants':
    case 'space_marines':
    case 'marines':
      return 'marines';
    case 'directorate':
    case 'guard':
    case 'astra_militarum':
      return 'directorate';
    case 'elyri':
    case 'eldar':
    case 'aeldari':
      return 'eldar';
    case 'veykari':
    case 'dark_eldar':
    case 'drukhari':
      return 'dark_eldar';
    case 'ghar':
    case 'orcs':
    case 'orks':
      return 'orcs';
    case 'devourers':
    case 'tyranids':
      return 'tyranids';
    case 'revenant':
    case 'necrons':
    case 'necros':
      return 'necros';
    case 'concordat':
    case 'tau':
      return 'tau';
    case 'riftborn':
    case 'daemons':
    case 'chaos_daemons':
      return 'riftborn';
    case 'forsaken':
    case 'chaos':
    case 'chaos_marines':
      return 'chaos';
    default:
      return fId;
  }
}

/**
 * Returns all available unit definitions for a given faction.
 */
export function getFactionUnits(factionId: string): UnitDef[] {
  const normId = normalizeFactionId(factionId);
  return Object.values(UNIT_DEFS).filter(u => u.factionId === normId && !u.isVip);
}

/**
 * Deterministically and strategically builds an AI Army within the specified point limit.
 */
export function buildAIArmy(factionId: string, pointLimit: PointLimit): ArmyComposition {
  const availableUnits = getFactionUnits(factionId);
  if (availableUnits.length === 0) {
    // Fallback to marines if unknown
    const fallback = getFactionUnits('marines');
    return buildAIArmyFromRoster(factionId, fallback, pointLimit);
  }
  return buildAIArmyFromRoster(factionId, availableUnits, pointLimit);
}

function buildAIArmyFromRoster(factionId: string, roster: UnitDef[], pointLimit: number): ArmyComposition {
  const selectedCounts: Record<string, number> = {};
  roster.forEach(u => { selectedCounts[u.type] = 0; });

  let currentPoints = 0;

  // 1. Pick 1 Commander/Hero unit if available & affordable
  const hero = roster.find(u => u.isCharacter);
  if (hero && hero.points <= pointLimit) {
    selectedCounts[hero.type] = 1;
    currentPoints += hero.points;
  }

  // 2. Pick at least 1 Core/Infantry squad
  const coreInfantry = roster.find(u => !u.isCharacter && !u.isLarge && u.squadSize >= 3);
  if (coreInfantry && (currentPoints + coreInfantry.points <= pointLimit)) {
    selectedCounts[coreInfantry.type] = (selectedCounts[coreInfantry.type] || 0) + 1;
    currentPoints += coreInfantry.points;
  }

  // 3. Iteratively fill remaining points with a balanced mix of available units
  const nonHeroUnits = roster.filter(u => !u.isCharacter);
  const purchasable = nonHeroUnits.length > 0 ? nonHeroUnits : roster;

  let iterations = 0;
  const maxIterations = 50;

  while (currentPoints < pointLimit && iterations < maxIterations) {
    iterations++;

    // Find all units that can affordably fit
    const affordable = purchasable.filter(u => currentPoints + u.points <= pointLimit);
    if (affordable.length === 0) {
      break;
    }

    // Sort by fewest recruited so far to promote army variety
    affordable.sort((a, b) => {
      const countA = selectedCounts[a.type] || 0;
      const countB = selectedCounts[b.type] || 0;
      if (countA !== countB) return countA - countB;
      return b.points - a.points; // Secondary: spend efficiently
    });

    const chosen = affordable[0];
    selectedCounts[chosen.type] = (selectedCounts[chosen.type] || 0) + 1;
    currentPoints += chosen.points;
  }

  const units: ArmyUnitSelection[] = Object.entries(selectedCounts)
    .filter(([_, qty]) => qty > 0)
    .map(([unitId, quantity]) => ({ unitId, quantity }));

  return {
    factionId,
    units,
    totalPoints: currentPoints
  };
}

/**
 * Returns a default recommended army composition for the player upon entering the Army Composition stage.
 */
export function getDefaultArmyComposition(factionId: string, pointLimit: PointLimit): ArmyComposition {
  return buildAIArmy(factionId, pointLimit);
}

/**
 * Converts an authoritative ArmyComposition into player DeploymentCards.
 */
export function convertArmyToPlayerRoster(army: ArmyComposition): DeploymentCard[] {
  const cards: DeploymentCard[] = [];
  let cardIdx = 0;

  army.units.forEach(sel => {
    const uDef = UNIT_DEFS[sel.unitId];
    if (!uDef) return;

    for (let i = 0; i < sel.quantity; i++) {
      const isMulti = sel.quantity > 1;
      const suffix = isMulti ? (i === 0 ? ' Alpha' : i === 1 ? ' Beta' : ` Squad ${i + 1}`) : '';
      const name = `${uDef.name}${suffix}`;

      cards.push({
        key: `p_sq_${sel.unitId}_${cardIdx++}`,
        type: sel.unitId,
        name,
        isVip: false,
        placed: false,
        x: null,
        z: null,
        unitRef: null
      });
    }
  });

  return cards;
}

/**
 * Converts an authoritative ArmyComposition into enemy AI roster items with tactical deployment coordinates.
 */
export function convertArmyToEnemyRoster(army: ArmyComposition): EnemyRosterItem[] {
  const items: EnemyRosterItem[] = [];
  let itemIdx = 0;

  // Strategic positions spread across Northern Sector (Rows 2 to 8, Cols 6 to 34)
  const defaultPositions = [
    { x: 20, z: 2 },
    { x: 12, z: 4 },
    { x: 28, z: 4 },
    { x: 6, z: 5 },
    { x: 34, z: 5 },
    { x: 16, z: 6 },
    { x: 24, z: 6 },
    { x: 10, z: 7 },
    { x: 30, z: 7 },
    { x: 20, z: 8 },
    { x: 8, z: 3 },
    { x: 32, z: 3 },
    { x: 14, z: 2 },
    { x: 26, z: 2 }
  ];

  army.units.forEach(sel => {
    const uDef = UNIT_DEFS[sel.unitId];
    if (!uDef) return;

    for (let i = 0; i < sel.quantity; i++) {
      const pos = defaultPositions[itemIdx] || {
        x: 6 + ((itemIdx * 6) % 28),
        z: 2 + Math.floor(itemIdx / 5) * 2
      };

      const isMulti = sel.quantity > 1;
      const suffix = isMulti ? (i === 0 ? ' Alpha' : i === 1 ? ' Beta' : ` ${i + 1}`) : '';

      items.push({
        key: `e_sq_${sel.unitId}_${itemIdx++}`,
        type: sel.unitId,
        name: `${uDef.name}${suffix}`,
        isVip: false,
        x: pos.x,
        z: pos.z,
        unitRef: null
      });
    }
  });

  return items;
}
