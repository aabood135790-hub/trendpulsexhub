export interface SpinSector {
  id: number;
  label: string;
  sublabel: string;
  type: 'credits' | 'promo_code' | 'jackpot' | 'multiplier';
  amount: number;
  code?: string;
  color: string;
  textColor: string;
  badge: string;
  weight: number; // Probability weighting
  description: string;
}

export const SPIN_SECTORS: SpinSector[] = [
  {
    id: 0,
    label: '+50',
    sublabel: 'Credits',
    type: 'credits',
    amount: 50,
    color: '#0284c7', // Sky Blue
    textColor: '#ffffff',
    badge: 'Standard',
    weight: 30,
    description: '+50 Gamer Credits added directly to your wallet balance.',
  },
  {
    id: 1,
    label: '+150',
    sublabel: 'Credits',
    type: 'credits',
    amount: 150,
    color: '#0047ab', // Sapphire Blue
    textColor: '#ffffff',
    badge: 'Lucky',
    weight: 20,
    description: '+150 Gamer Credits unlocked for active community drops.',
  },
  {
    id: 2,
    label: 'VIP CODE',
    sublabel: 'Promo Drop',
    type: 'promo_code',
    amount: 250,
    code: 'SPIN-LUCKY-250',
    color: '#7c3aed', // Purple Violet
    textColor: '#fdf4ff',
    badge: 'Secret Drop',
    weight: 15,
    description: 'Exclusive redeemable promo code "SPIN-LUCKY-250" worth +250 Credits!',
  },
  {
    id: 3,
    label: '+100',
    sublabel: 'Credits',
    type: 'credits',
    amount: 100,
    color: '#0891b2', // Cyan
    textColor: '#ffffff',
    badge: 'Standard',
    weight: 25,
    description: '+100 Gamer Credits added to your account instantly.',
  },
  {
    id: 4,
    label: '500 JACKPOT',
    sublabel: 'Grand Prize',
    type: 'jackpot',
    amount: 500,
    code: 'JACKPOT-500',
    color: '#d97706', // Gold / Amber
    textColor: '#ffffff',
    badge: 'Grand Jackpot',
    weight: 10,
    description: '🔥 MEGA JACKPOT! +500 Gamer Credits granted to your wallet!',
  },
  {
    id: 5,
    label: '+75',
    sublabel: 'Credits',
    type: 'credits',
    amount: 75,
    color: '#2563eb', // Royal Blue
    textColor: '#ffffff',
    badge: 'Standard',
    weight: 25,
    description: '+75 Gamer Credits added to your daily wallet.',
  },
  {
    id: 6,
    label: '2X BOOST',
    sublabel: 'Multiplier',
    type: 'multiplier',
    amount: 200,
    color: '#e11d48', // Rose / Ruby
    textColor: '#ffffff',
    badge: 'Double Multiplier',
    weight: 12,
    description: '⚡ 2X MULTIPLIER! +200 Credits bonus reward applied!',
  },
  {
    id: 7,
    label: '+250',
    sublabel: 'Credits',
    type: 'credits',
    amount: 250,
    color: '#059669', // Emerald
    textColor: '#ffffff',
    badge: 'Big Win',
    weight: 16,
    description: '🎉 BIG WIN! +250 Gamer Credits unlocked immediately.',
  },
];

export const DAILY_SPIN_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 Hours in milliseconds

/**
 * Pick a weighted random sector index
 */
export function pickRandomSector(): number {
  const totalWeight = SPIN_SECTORS.reduce((acc, s) => acc + s.weight, 0);
  let randomVal = Math.random() * totalWeight;

  for (let i = 0; i < SPIN_SECTORS.length; i++) {
    if (randomVal < SPIN_SECTORS[i].weight) {
      return i;
    }
    randomVal -= SPIN_SECTORS[i].weight;
  }
  return 0;
}

/**
 * Calculate the rotation degrees required so that the top needle (pointing straight down at top center, angle = 0 / 360)
 * lands squarely on the chosen sector index.
 * 
 * Slices are arranged in 360 / 8 = 45 degrees segments.
 * Slice 0 spans [0°, 45°], with center at 22.5°.
 * In SVG coordinates where top is 0° / 270°, if wheel rotates clockwise by R degrees:
 * The slice at top needle corresponds to: ((360 - (R % 360)) / 45) % 8.
 * 
 * To land on sectorIndex with random offset inside the sector (padding 8° away from edges):
 */
export function calculateTargetRotation(
  currentRotation: number,
  targetSectorIndex: number,
  minFullTurns = 6
): { finalRotation: number; landedSector: SpinSector } {
  const numSectors = SPIN_SECTORS.length;
  const arcPerSector = 360 / numSectors; // 45 deg

  // Center of sector in standard wheel coordinates (0 to 360 clockwise)
  const sectorCenter = (targetSectorIndex * arcPerSector) + (arcPerSector / 2);
  
  // Safe random variance inside the slice (-12 deg to +12 deg)
  const variance = (Math.random() * 24) - 12;

  // The angle on the unrotated wheel that needs to align with the top indicator (0 deg)
  const targetAngleOnWheel = (sectorCenter + variance + 360) % 360;

  // To bring `targetAngleOnWheel` to the top (0 deg / 360 deg) via clockwise rotation:
  // Rotation offset = 360 - targetAngleOnWheel
  const baseClockwiseOffset = (360 - targetAngleOnWheel + 360) % 360;

  // Current normalized rotation
  const currentNormalized = currentRotation % 360;
  
  // Extra degrees to reach base offset from current position
  let deltaToTarget = baseClockwiseOffset - currentNormalized;
  if (deltaToTarget < 0) {
    deltaToTarget += 360;
  }

  // Add multiple full spins (minFullTurns * 360)
  const totalDelta = (minFullTurns * 360) + deltaToTarget;
  const finalRotation = currentRotation + totalDelta;

  return {
    finalRotation,
    landedSector: SPIN_SECTORS[targetSectorIndex],
  };
}

/**
 * Format milliseconds cooldown into { hours, minutes, seconds, progressPct }
 */
export function formatSpinCooldown(ms: number): {
  formatted: string;
  hours: number;
  minutes: number;
  seconds: number;
  progressPct: number;
} {
  if (ms <= 0) {
    return { formatted: '00:00:00', hours: 0, minutes: 0, seconds: 0, progressPct: 100 };
  }

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');

  const elapsedMs = Math.max(0, DAILY_SPIN_COOLDOWN_MS - ms);
  const progressPct = Math.min(100, Math.round((elapsedMs / DAILY_SPIN_COOLDOWN_MS) * 100));

  return {
    formatted: `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`,
    hours,
    minutes,
    seconds,
    progressPct,
  };
}
