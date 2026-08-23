import React, { useState, useEffect, useRef, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Gift, 
  Coins, 
  Clock, 
  Volume2, 
  VolumeX, 
  Flame, 
  Trophy, 
  Zap, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  RotateCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAds } from '../../context/AdContext';
import { 
  SPIN_SECTORS, 
  SpinSector, 
  pickRandomSector, 
  calculateTargetRotation, 
  formatSpinCooldown 
} from '../../lib/spinConfig';
import { 
  playWheelTick, 
  playSpinStart, 
  playWinFanfare, 
  playJackpotFanfare, 
  setSpinAudioMuted, 
  getSpinAudioMuted 
} from '../../lib/spinAudio';
import { UniversalAdSlot } from '../ads/UniversalAdSlot';

interface SpinWheelProps {
  onSpinComplete?: (reward: SpinSector, isDouble?: boolean) => void;
  compact?: boolean;
}

export function SpinWheel({ onSpinComplete, compact = false }: SpinWheelProps) {
  const { 
    isAuthenticated, 
    credits, 
    isDailySpinAvailable, 
    remainingDailySpinMs, 
    spinStreak,
    extraSpinTickets,
    openAuthModal, 
    claimSpinReward,
    grantExtraSpinTicket,
    useSpinTicket
  } = useAuth();

  const { activeDirectLink } = useAds();

  // Animation & Rotation State
  const [rotationDeg, setRotationDeg] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [activeReward, setActiveReward] = useState<SpinSector | null>(null);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [isDoubleClaimed, setIsDoubleClaimed] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(getSpinAudioMuted());
  const [needleBounce, setNeedleBounce] = useState<boolean>(false);

  const wheelRef = useRef<HTMLDivElement>(null);
  const spinTimeoutRef = useRef<any>(null);
  const tickIntervalRef = useRef<any>(null);

  const numSectors = SPIN_SECTORS.length;
  const arcAngle = 360 / numSectors; // 45 deg

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    };
  }, []);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    setSpinAudioMuted(next);
  };

  const handleSpinClick = async () => {
    // 1. Authenticate Guard: prompt login modal if user is not signed in
    if (!isAuthenticated) {
      openAuthModal('signin');
      return;
    }

    // 2. Cooldown Guard: check if daily spin or extra ticket is available
    if (!isDailySpinAvailable && extraSpinTickets <= 0) {
      return;
    }

    if (isSpinning) return;

    // Use extra ticket if cooldown is active
    if (!isDailySpinAvailable && extraSpinTickets > 0) {
      await useSpinTicket();
    }

    setIsSpinning(true);
    setActiveReward(null);
    setShowCelebration(false);
    setIsDoubleClaimed(false);
    setCopiedCode(false);

    // Audio cue
    playSpinStart();

    // Pick weighted target sector
    const targetSectorIndex = pickRandomSector();
    const { finalRotation, landedSector } = calculateTargetRotation(rotationDeg, targetSectorIndex, 6);

    // Dynamic ticking sound effect during deceleration
    const spinDurationMs = 5200; // 5.2 seconds
    const startTime = Date.now();
    let lastPegIndex = -1;

    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);

    tickIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / spinDurationMs);
      
      // Approximate current rotation using ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentAngle = rotationDeg + (finalRotation - rotationDeg) * easeOut;
      const currentPeg = Math.floor(currentAngle / arcAngle);

      if (currentPeg !== lastPegIndex) {
        lastPegIndex = currentPeg;
        setNeedleBounce(true);
        setTimeout(() => setNeedleBounce(false), 60);

        // Pitch scale relative to speed
        const speedRatio = 1 - progress * 0.75;
        playWheelTick(speedRatio);
      }

      if (progress >= 1) {
        clearInterval(tickIntervalRef.current);
      }
    }, 25);

    setRotationDeg(finalRotation);

    // Spin completion trigger
    spinTimeoutRef.current = setTimeout(async () => {
      setIsSpinning(false);
      setActiveReward(landedSector);
      setShowCelebration(true);

      // Claim base reward in Auth & backend
      await claimSpinReward({
        amount: landedSector.amount,
        sectorId: landedSector.id,
        promoCode: landedSector.code,
        isDoubleBonus: false,
      });

      // Confetti & Celebration Fanfare
      if (landedSector.type === 'jackpot' || landedSector.type === 'multiplier') {
        playJackpotFanfare();
        triggerConfetti(true);
      } else {
        playWinFanfare();
        triggerConfetti(false);
      }

      if (onSpinComplete) {
        onSpinComplete(landedSector, false);
      }
    }, spinDurationMs + 200);
  };

  const triggerConfetti = (isJackpot = false) => {
    try {
      if (isJackpot) {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#38bdf8', '#0047ab', '#e11d48', '#10b981'],
        });
        setTimeout(() => {
          confetti({
            particleCount: 80,
            angle: 60,
            spread: 60,
            origin: { x: 0 },
            colors: ['#fbbf24', '#38bdf8', '#ec4899'],
          });
          confetti({
            particleCount: 80,
            angle: 120,
            spread: 60,
            origin: { x: 1 },
            colors: ['#fbbf24', '#38bdf8', '#ec4899'],
          });
        }, 300);
      } else {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#38bdf8', '#0047ab', '#10b981', '#fbbf24'],
        });
      }
    } catch {}
  };

  // Claim Double Bonus Action (Monetization: opens Adsterra Direct Link in new tab + awards 2X)
  const handleClaimDoubleBonus = async () => {
    if (!activeReward || isDoubleClaimed) return;

    // 1. Open Adsterra Direct Link in new tab
    if (activeDirectLink) {
      try {
        window.open(activeDirectLink, '_blank', 'noopener,noreferrer');
      } catch (err) {
        console.warn('Adsterra tab popup warning:', err);
      }
    }

    setIsDoubleClaimed(true);

    // 2. Grant 2X Bonus Credits in wallet
    await claimSpinReward({
      amount: activeReward.amount,
      sectorId: activeReward.id,
      promoCode: activeReward.code,
      isDoubleBonus: true,
    });

    playJackpotFanfare();
    triggerConfetti(true);

    if (onSpinComplete) {
      onSpinComplete(activeReward, true);
    }
  };

  // Get Free Extra Spin (Monetization: opens Adsterra Direct Link & grants free spin ticket)
  const handleGetExtraSpin = async () => {
    if (activeDirectLink) {
      try {
        window.open(activeDirectLink, '_blank', 'noopener,noreferrer');
      } catch (err) {}
    }

    await grantExtraSpinTicket();
    setShowCelebration(false);
    setActiveReward(null);
    playWinFanfare();
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      setCopiedCode(true);
    }
  };

  const cooldownData = formatSpinCooldown(remainingDailySpinMs);

  return (
    <div id="daily-spin-wheel-card" className="w-full flex flex-col items-center">
      {/* Top Header & Status Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-indigo-950 shadow-lg shadow-amber-500/25 border border-amber-300/40">
            <Trophy size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-black text-indigo-950 tracking-tight">
                Daily Lucky Spin Wheel
              </h2>
              <span className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-600 border border-amber-400/40 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
                <Flame size={11} className="stroke-[2.5]" /> 24H Drop
              </span>
            </div>
            <p className="text-xs md:text-sm font-medium text-slate-500">
              Spin once every 24 hours to win free Credits, VIP drop codes, and 2X multipliers!
            </p>
          </div>
        </div>

        {/* Audio Mute & Tickets Indicator */}
        <div className="flex items-center gap-2">
          {extraSpinTickets > 0 && (
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-300 px-3 py-1 rounded-xl text-xs font-bold shadow-xs">
              <Zap size={14} className="text-emerald-500" />
              <span>{extraSpinTickets} Extra {extraSpinTickets === 1 ? 'Spin' : 'Spins'}</span>
            </div>
          )}
          
          <button
            onClick={toggleMute}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors"
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>

      {/* Main Wheel Container Stage */}
      <div className="relative w-full max-w-lg mx-auto flex flex-col items-center justify-center py-4">
        
        {/* Glow & Backdrop Aura */}
        <div className="absolute inset-0 -m-6 rounded-full bg-gradient-to-tr from-sky-400/20 via-sapphire-500/15 to-amber-400/20 blur-3xl pointer-events-none" />

        {/* Top Pointer Needle Indicator */}
        <div className="relative z-30 flex flex-col items-center -mb-5">
          <motion.div 
            animate={needleBounce ? { rotate: [-16, 8, -4, 0], y: [-2, 0] } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.12 }}
            className="filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]"
          >
            <svg width="46" height="54" viewBox="0 0 46 54" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M23 52L8 14C5 7 10 0 17 0H29C36 0 41 7 38 14L23 52Z" 
                fill="url(#needleGrad)" 
                stroke="#ffffff" 
                strokeWidth="2.5" 
              />
              <circle cx="23" cy="14" r="5" fill="#ffffff" />
              <defs>
                <linearGradient id="needleGrad" x1="23" y1="0" x2="23" y2="52" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f59e0b" />
                  <stop offset="1" stopColor="#d97706" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </div>

        {/* Outer Wheel Rim with LED Bulbs */}
        <div className="relative p-3.5 md:p-4 rounded-full bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 shadow-[0_15px_45px_rgba(15,23,42,0.45)] border-4 border-amber-400/80">
          
          {/* LED Bulb Ring Lights */}
          <div className="absolute inset-0 rounded-full pointer-events-none">
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i * 360) / 16;
              const isEven = i % 2 === 0;
              return (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-2.5 h-2.5 -ml-1.25 -mt-1.25 rounded-full"
                  style={{
                    transform: `rotate(${angle}deg) translate(0, -${compact ? '145px' : '168px'})`,
                  }}
                >
                  <div className={`w-full h-full rounded-full transition-all duration-300 ${
                    isSpinning 
                      ? (isEven ? 'bg-amber-300 shadow-[0_0_8px_#fde047]' : 'bg-sky-300 shadow-[0_0_8px_#38bdf8]')
                      : 'bg-amber-200/80 shadow-[0_0_4px_#fde047]'
                  }`} />
                </div>
              );
            })}
          </div>

          {/* Rotating Wheel Core (SVG Sectors) */}
          <div
            ref={wheelRef}
            className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-88 md:h-88 rounded-full overflow-hidden shadow-inner"
            style={{
              transform: `rotate(${rotationDeg}deg)`,
              transition: isSpinning ? 'transform 5.2s cubic-bezier(0.12, 0.95, 0.18, 1.0)' : 'none',
            }}
          >
            <svg 
              viewBox="0 0 400 400" 
              className="w-full h-full transform -rotate-90 origin-center"
            >
              {SPIN_SECTORS.map((sector, idx) => {
                const startAngle = idx * arcAngle;
                const endAngle = startAngle + arcAngle;
                
                // SVG Arc Path Calculation
                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;
                const x1 = 200 + 195 * Math.cos(startRad);
                const y1 = 200 + 195 * Math.sin(startRad);
                const x2 = 200 + 195 * Math.cos(endRad);
                const y2 = 200 + 195 * Math.sin(endRad);

                const midAngle = startAngle + arcAngle / 2;
                const midRad = (midAngle * Math.PI) / 180;
                const textX = 200 + 130 * Math.cos(midRad);
                const textY = 200 + 130 * Math.sin(midRad);

                return (
                  <g key={sector.id}>
                    {/* Sector Slice */}
                    <path
                      d={`M 200 200 L ${x1} ${y1} A 195 195 0 0 1 ${x2} ${y2} Z`}
                      fill={sector.color}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    
                    {/* Sector Label Group */}
                    <g transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}>
                      <text
                        x={textX}
                        y={textY - 8}
                        fill={sector.textColor}
                        fontSize="15"
                        fontWeight="900"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] tracking-tight"
                      >
                        {sector.label}
                      </text>
                      <text
                        x={textX}
                        y={textY + 9}
                        fill="#ffffff"
                        opacity="0.9"
                        fontSize="9"
                        fontWeight="800"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="uppercase tracking-wider font-bold"
                      >
                        {sector.sublabel}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Decorative Inner Radial Spoke Pegs */}
              {SPIN_SECTORS.map((_, i) => {
                const angle = (i * arcAngle * Math.PI) / 180;
                const px = 200 + 185 * Math.cos(angle);
                const py = 200 + 185 * Math.sin(angle);
                return (
                  <circle
                    key={`peg-${i}`}
                    cx={px}
                    cy={py}
                    r="4"
                    fill="#ffffff"
                    stroke="#0f172a"
                    strokeWidth="1.5"
                  />
                );
              })}
            </svg>
          </div>

          {/* Golden Center Hub & SPIN Button */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <button
              id="spin-wheel-center-trigger-button"
              onClick={handleSpinClick}
              disabled={isSpinning || (!isDailySpinAvailable && extraSpinTickets <= 0 && isAuthenticated)}
              aria-label="Spin the daily lucky wheel"
              className={`relative flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 shadow-[0_8px_25px_rgba(0,0,0,0.5)] transition-all cursor-pointer select-none active:scale-95 ${
                isSpinning
                  ? 'bg-gradient-to-tr from-amber-600 to-amber-400 border-amber-200 opacity-90 scale-95'
                  : isDailySpinAvailable || !isAuthenticated || extraSpinTickets > 0
                  ? 'bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 border-white hover:scale-105 hover:shadow-[0_0_30px_rgba(245,158,11,0.8)]'
                  : 'bg-gradient-to-tr from-slate-700 to-slate-800 border-slate-600 cursor-not-allowed opacity-95'
              }`}
            >
              <div className="flex flex-col items-center justify-center text-center">
                {isSpinning ? (
                  <>
                    <RotateCw size={24} className="text-indigo-950 animate-spin stroke-[3]" />
                    <span className="text-[10px] font-black text-indigo-950 tracking-wider uppercase mt-1">
                      LUCK...
                    </span>
                  </>
                ) : isDailySpinAvailable || !isAuthenticated || extraSpinTickets > 0 ? (
                  <>
                    <Sparkles size={20} className="text-indigo-950 fill-indigo-950 animate-pulse" />
                    <span className="text-sm sm:text-base font-black text-indigo-950 tracking-tight leading-none">
                      SPIN
                    </span>
                    <span className="text-[9px] font-black text-indigo-950/80 tracking-widest uppercase mt-0.5">
                      {extraSpinTickets > 0 && !isDailySpinAvailable ? 'EXTRA' : 'FREE'}
                    </span>
                  </>
                ) : (
                  <>
                    <Clock size={18} className="text-amber-300 stroke-[2.5]" />
                    <span className="text-[10px] font-black text-white tracking-wider uppercase mt-0.5">
                      LOCKED
                    </span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Action / Cooldown Card */}
      <div className="w-full mt-4 flex flex-col items-center text-center">
        {!isAuthenticated ? (
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-indigo-950 border border-sky-400/20 text-white shadow-lg">
            <div className="text-center sm:text-left">
              <h3 className="text-base font-black text-white">Sign In to Spin the Daily Wheel</h3>
              <p className="text-xs text-sky-200/80 mt-0.5">
                Join thousands of gamers claiming daily rewards, Roblox drops, and credits!
              </p>
            </div>
            <button
              onClick={() => openAuthModal('signin')}
              className="flex items-center gap-2 bg-gradient-to-r from-sky-400 to-sapphire-500 hover:from-sky-300 hover:to-sapphire-400 text-indigo-950 font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-md transition-all hover:scale-105 shrink-0"
            >
              <ShieldCheck size={16} /> Sign In to Spin
            </button>
          </div>
        ) : isDailySpinAvailable || extraSpinTickets > 0 ? (
          <div className="flex flex-col items-center gap-2">
            <button
              id="spin-wheel-bottom-trigger-button"
              onClick={handleSpinClick}
              disabled={isSpinning}
              className="flex items-center gap-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-indigo-950 font-black text-sm md:text-base px-8 py-3.5 rounded-2xl shadow-[0_0_25px_rgba(245,158,11,0.4)] border border-amber-300/60 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Sparkles size={18} className="stroke-[2.5]" />
              <span>{isSpinning ? 'SPINNING THE WHEEL...' : extraSpinTickets > 0 && !isDailySpinAvailable ? 'USE EXTRA FREE SPIN' : 'SPIN THE WHEEL NOW'}</span>
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              ✨ 100% Free Daily Spin. Rewards deposit directly into your wallet balance.
            </p>
          </div>
        ) : (
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-md">
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start text-xs font-black uppercase text-sky-400">
                <Clock size={14} className="stroke-[2.5]" />
                <span>Next Free Daily Spin Unlocks In:</span>
              </div>
              <div className="font-mono text-xl sm:text-2xl font-black text-amber-300 mt-0.5 tracking-wider">
                {cooldownData.formatted}
              </div>
            </div>

            {/* Monetization Extra Spin Trigger */}
            <button
              id="get-free-extra-spin-cta-button"
              onClick={handleGetExtraSpin}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-md shadow-emerald-500/25 transition-all hover:scale-105 shrink-0 cursor-pointer"
            >
              <Zap size={16} /> Get Free Extra Spin <ExternalLink size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Integrated Adsterra Banner Slot */}
      <div className="w-full mt-6">
        <UniversalAdSlot slotId="spin_wheel_banner" />
      </div>

      {/* Victory Celebration Reveal Modal */}
      <AnimatePresence>
        {showCelebration && activeReward && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 border-2 border-amber-400/50 p-6 md:p-8 text-center text-white shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
            >
              {/* Background celebration radial beam */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 h-56 w-56 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-56 w-56 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />

              {/* Reward Badge Icon */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-indigo-950 shadow-xl shadow-amber-500/40 border border-white/50 mb-4"
              >
                {activeReward.type === 'jackpot' ? (
                  <Trophy size={42} className="stroke-[2.5]" />
                ) : activeReward.type === 'promo_code' ? (
                  <Gift size={42} className="stroke-[2.5]" />
                ) : (
                  <Coins size={42} className="stroke-[2.5]" />
                )}
              </motion.div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-black uppercase tracking-wider mb-2">
                <Sparkles size={12} /> {activeReward.badge}
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {activeReward.type === 'jackpot' ? '🎉 GRAND JACKPOT WINNER!' : '🎉 YOU WON!'}
              </h3>

              <div className="my-4 p-4 rounded-2xl bg-indigo-900/60 border border-sky-400/20">
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-sky-300 to-white">
                  {isDoubleClaimed ? `+${activeReward.amount * 2} CREDITS` : activeReward.label}
                </div>
                <p className="text-xs sm:text-sm font-medium text-azure-100/80 mt-1">
                  {activeReward.description}
                </p>

                {/* Promo code copy button if won */}
                {activeReward.code && (
                  <div className="mt-3 flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-indigo-500/30">
                    <span className="font-mono text-sm font-black text-amber-300 tracking-wider pl-2">
                      {activeReward.code}
                    </span>
                    <button
                      onClick={() => handleCopyCode(activeReward.code!)}
                      className="flex items-center gap-1.5 bg-sapphire-600 hover:bg-sapphire-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      {copiedCode ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                      <span>{copiedCode ? 'COPIED!' : 'COPY CODE'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons: Double Bonus & Close */}
              <div className="flex flex-col gap-3">
                {!isDoubleClaimed && (
                  <button
                    id="claim-double-spin-bonus-button"
                    onClick={handleClaimDoubleBonus}
                    className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-indigo-950 font-black text-sm uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all hover:scale-102 cursor-pointer"
                  >
                    <Zap size={18} className="stroke-[2.5]" />
                    <span>CLAIM 2X DOUBLE BONUS (+{activeReward.amount * 2})</span>
                    <ExternalLink size={16} />
                  </button>
                )}

                <button
                  onClick={() => setShowCelebration(false)}
                  className="w-full py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Close & View Wallet (+{isDoubleClaimed ? activeReward.amount * 2 : activeReward.amount} Credits Added)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
