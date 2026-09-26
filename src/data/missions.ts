import type { MissionType } from './types';

export interface MissionDef {
  id: MissionType;
  name: string;
  subtitle: string;
  icon: string;
  desc: string;
  params: string;
  features: string;
  hasEscortConfig?: boolean;
}

export const MISSIONS: Record<string, MissionDef> = {
  extermination: {
    id: 'extermination',
    name: 'Extermination',
    subtitle: 'Annihilation • Tactical Survival',
    icon: '⚔️',
    desc: 'Engage and annihilate all hostile warbands to claim absolute battlefield supremacy over the sector. If the 8-round limit expires, victory is awarded to the force with superior surviving unit strength.',
    params: '8 Combat Rounds • Victory by Complete Annihilation or Squad Superiority',
    features: 'Full-spectrum engagement • Free tactical maneuver • No perimeter restrictions'
  },
  escort: {
    id: 'escort',
    name: 'VIP Escort',
    subtitle: 'Extraction vs Interception',
    icon: '🛡️',
    desc: 'Safely transport and protect your Sacred Relic Courier to the extraction zone in the opposing sector, or deploy as a fast-response interceptor force to eliminate the enemy courier before they extract.',
    params: 'Designated Courier Squad • Extraction Landing Zone • 8 Rounds Limit',
    features: 'Asymmetric tactical objectives • Escort formation protection • Interception tactics',
    hasEscortConfig: true
  },
  domination: {
    id: 'domination',
    name: 'Domination',
    subtitle: 'Strategic Node Control • Victory Points',
    icon: '🚩',
    desc: 'Capture and secure 3 strategic tactical beacons (Alpha, Bravo, Charlie) situated across the central frontline. Hold nodes at round end to accumulate Victory Points. First to 100 VP or highest score at Round 8 wins.',
    params: '3 Strategic Beacons (Nodes 1, 2, 3) • Target: 100 VP • 8 Rounds Limit',
    features: 'Area zone control • Multi-front engagement • Dynamic VP accumulation'
  }
};

export const MISSION_CYCLE: MissionType[] = Object.keys(MISSIONS) as MissionType[];

export const DOMINATION_WIN_POINTS_OPTIONS = [50, 75, 100, 150, 200] as const;
export const DEFAULT_DOMINATION_WIN_POINTS = 100;

export function getDefaultMissionSettings(missionType: MissionType) {
  if (missionType === 'domination') {
    return { type: 'domination' as const, dominationWinPoints: DEFAULT_DOMINATION_WIN_POINTS };
  }
  if (missionType === 'escort') {
    return { type: 'vip_escort' as const, vipOwner: 'player' as const };
  }
  return { type: 'extermination' as const };
}
