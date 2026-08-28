import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Gamepad2, Play, Users, Sparkles, Shield, Flame, 
  Wind, Droplets, Mountain, ArrowRight, UserCheck, MessageSquare, 
  ChevronRight, Swords, Compass, Award, Activity
} from 'lucide-react';
import { usePageSEO } from '../lib/seo';
import { useAuth } from '../context/AuthContext';

export function Home() {
  const { isAuthenticated, openAuthModal, profile } = useAuth();
  const [onlineCount, setOnlineCount] = useState(148);

  usePageSEO({
    title: 'TrendPulseX | Enter The World - Original 2D Online Game & Community',
    description: 'Enter the world of TrendPulseX: Play the original 2D online multiplayer game with real-time combat, four elemental races, safe zones, and connect with the player community.',
    keywords: 'trendpulsex, online 2d game, pulseworld, multiplayer browser game, player community, dark fantasy rpg',
  });

  useEffect(() => {
    // Dynamic simulated active player counter
    const interval = setInterval(() => {
      setOnlineCount(prev => Math.max(120, prev + Math.floor(Math.random() * 5) - 2));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const RACES = [
    {
      name: 'Dragonkin',
      element: 'Infernal Fire',
      icon: Flame,
      color: 'bg-white border-[#E5E2EC] hover:border-amber-400/80',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      badge: 'Aggressive / High DPS',
      desc: 'Forged in volcanic depths with enhanced attack speed and searing burst damage.',
    },
    {
      name: 'Starborne',
      element: 'Celestial Arcane',
      icon: Sparkles,
      color: 'bg-white border-[#E5E2EC] hover:border-purple-400/80',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      badge: 'High Mana / Teleport',
      desc: 'Channels cosmic starlight with expansive mana pools and mystic mobility.',
    },
    {
      name: 'Shadowveil',
      element: 'Abyssal Umbra',
      icon: Wind,
      color: 'bg-white border-[#E5E2EC] hover:border-indigo-400/80',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      badge: 'Stealth / Critical',
      desc: 'Masters of the dark wilderness with lightning agility and evasive maneuvers.',
    },
    {
      name: 'Frostborn',
      element: 'Glacial Ice',
      icon: Droplets,
      color: 'bg-white border-[#E5E2EC] hover:border-cyan-400/80',
      badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      badge: 'High HP / Defense',
      desc: 'Armored in crystalline permafrost with maximum health reserves and resilience.',
    },
  ];

  return (
    <div className="w-full bg-[#F8F7FA] text-slate-900 min-h-screen">
      
      {/* 1. HERO SECTION: GAME-FIRST FOCUSED PRESENTATION */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 lg:px-8 border-b border-[#E5E2EC] bg-[#F8F7FA]">
        
        {/* Subtle geometric dot pattern */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-200/30 rounded-full blur-[140px]" />
          <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-center space-y-8">
          
          {/* Top Brand Pill & Live Status */}
          <div className="inline-flex items-center gap-3 rounded-full border border-[#E5E2EC] bg-white px-4 py-1.5 shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-[#090514] font-mono">
              TrendPulseX Realm Live
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-bold text-purple-700 font-mono flex items-center gap-1">
              <Activity size={12} className="text-[#A855F7]" />
              {onlineCount} Online Players
            </span>
          </div>

          {/* Main Title & Slogan */}
          <div className="space-y-4">
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-[#A855F7] font-mono">
              TREND PULSEX
            </h2>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#090514] leading-tight">
              ENTER THE WORLD
            </h1>
            <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
              An original 2D online multiplayer browser game. Real-time exploration, smooth non-grid movement, four elemental races, safe zones, and open wilderness combat.
            </p>
          </div>

          {/* Hero CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              to="/game/play"
              id="hero-play-now-btn"
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#A855F7] hover:bg-[#9333EA] text-white font-black text-base sm:text-lg shadow-xl shadow-[#A855F7]/30 transition-all hover:scale-105 active:scale-95 border border-[#C084FC]/30 cursor-pointer"
            >
              <Play size={20} className="fill-white" />
              <span>PLAY NOW</span>
            </Link>

            <Link
              to="/community"
              id="hero-community-btn"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-white hover:bg-[#F1EFF5] text-[#090514] font-bold text-base border border-[#E5E2EC] shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Users size={18} className="text-[#A855F7]" />
              <span>COMMUNITY</span>
            </Link>
          </div>

          {/* Core Feature Badges */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
            <div className="p-3.5 rounded-2xl bg-white border border-[#E5E2EC] shadow-xs">
              <span className="text-[10px] font-bold text-[#A855F7] block uppercase font-mono">Movement</span>
              <span className="text-xs sm:text-sm font-black text-[#090514]">Smooth 2D Controls</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[#E5E2EC] shadow-xs">
              <span className="text-[10px] font-bold text-amber-600 block uppercase font-mono">Territories</span>
              <span className="text-xs sm:text-sm font-black text-[#090514]">4 Crystal Safe Zones</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[#E5E2EC] shadow-xs">
              <span className="text-[10px] font-bold text-[#A855F7] block uppercase font-mono">Multiplayer</span>
              <span className="text-xs sm:text-sm font-black text-[#090514]">Real-Time Sync</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[#E5E2EC] shadow-xs">
              <span className="text-[10px] font-bold text-amber-600 block uppercase font-mono">Accounts</span>
              <span className="text-xs sm:text-sm font-black text-[#090514]">Persistent Gold & Rank</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. SHORT EXPLANATION OF THE GAME & 4 RACES */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#E5E2EC] bg-white">
        <div className="mx-auto max-w-6xl space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#A855F7] font-mono">
              THE WORLD OF TRENDPULSEX
            </h2>
            <h3 className="text-2xl sm:text-4xl font-black text-[#090514] tracking-tight">
              Choose Your Race & Conquer The Realm
            </h3>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              Step into an expansive open world featuring four elemental sanctuary crystals, player houses, real-time proximity chat, and dangerous wilderness territories.
            </p>
          </div>

          {/* 4 Races Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {RACES.map((race) => {
              const Icon = race.icon;
              return (
                <div
                  key={race.name}
                  className={`p-5 rounded-2xl ${race.color} border shadow-sm flex flex-col justify-between space-y-4 transition-all hover:-translate-y-1 hover:shadow-md`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-xl bg-[#F8F7FA] border border-[#E5E2EC] flex items-center justify-center text-[#A855F7]">
                        <Icon size={20} />
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${race.badgeBg}`}>
                        {race.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-black text-[#090514]">{race.name}</h4>
                      <span className="text-xs font-bold text-slate-500 font-mono">{race.element}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {race.desc}
                    </p>
                  </div>

                  <Link
                    to="/game/play"
                    className="pt-2 flex items-center gap-1.5 text-xs font-bold text-[#A855F7] hover:text-[#9333EA] transition-colors"
                  >
                    <span>Play as {race.name}</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Game Pillar Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-[#F8F7FA] border border-[#E5E2EC] space-y-3 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-purple-100 text-[#A855F7] flex items-center justify-center">
                <Shield size={20} />
              </div>
              <h4 className="text-base font-black text-[#090514]">4 Crystal Safe Zones</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Regenerate HP & MP instantly inside sanctified crystal rings. Rest, customize your appearance, chat with allies, and trade peacefully.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8F7FA] border border-[#E5E2EC] space-y-3 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Swords size={20} />
              </div>
              <h4 className="text-base font-black text-[#090514]">Wilderness & Combat</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Venture past the crystal boundaries into uncharted open wilderness. Engage monsters, defeat opponents, earn Gold, and climb the Leaderboards.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8F7FA] border border-[#E5E2EC] space-y-3 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-purple-100 text-[#A855F7] flex items-center justify-center">
                <Compass size={20} />
              </div>
              <h4 className="text-base font-black text-[#090514]">Player Houses & Progression</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Own personal player houses across the map. Level up your character, upgrade ranks, and unlock exclusive titles and combat auras.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. COMMUNITY PILLAR SECTION (High-Contrast Anchor Card) */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#E5E2EC] bg-[#F8F7FA]">
        <div className="mx-auto max-w-5xl">
          
          <div className="rounded-3xl bg-[#0E0720] p-8 sm:p-12 border border-[#160B2E] shadow-2xl relative overflow-hidden text-white">
            
            {/* Ambient Purple Glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-[#A855F7]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-[#FBBF24]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#160B2E] border border-[#A855F7]/30 text-[#C084FC] text-xs font-bold uppercase tracking-wider font-mono">
                  <Users size={13} className="text-[#C084FC]" /> The Player Community
                </div>
                
                <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  Connect With Fellow Players & Share Strategies
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  Join discussions, recruit clan members, share boss fight discoveries, post gameplay clips, and build your reputation across the TrendPulseX community.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
                  <Link
                    to="/community"
                    id="community-feed-cta"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#A855F7] hover:bg-[#9333EA] text-white font-bold text-sm shadow-md shadow-[#A855F7]/30 transition-all hover:scale-105 active:scale-95 border border-[#C084FC]/30"
                  >
                    <span>EXPLORE COMMUNITY</span>
                    <ArrowRight size={16} />
                  </Link>

                  {!isAuthenticated && (
                    <button
                      onClick={() => openAuthModal('signup')}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#160B2E] hover:bg-[#1F0F3D] text-[#C084FC] hover:text-white font-bold text-sm border border-[#A855F7]/30 transition-all cursor-pointer"
                    >
                      <UserCheck size={16} className="text-[#FBBF24]" />
                      <span>Create Account</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Community Preview Card */}
              <div className="lg:col-span-5 space-y-3">
                <div className="p-4 rounded-2xl bg-[#160B2E]/90 border border-[#1F0F3D] space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-[#A855F7] text-white flex items-center justify-center text-xs font-black">
                      S
                    </div>
                    <div>
                      <span className="text-xs font-black text-white block leading-tight">Starborne_Mage</span>
                      <span className="text-[10px] font-bold text-[#C084FC] font-mono">Rank 4 • Celestial</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    "Discovered a hidden loot chest near the North-East Glacial safe zone border. Watch out for wilderness patrol!"
                  </p>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 pt-1 border-t border-[#1F0F3D]">
                    <span>❤️ 24 Likes</span>
                    <span>💬 9 Replies</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#160B2E]/60 border border-[#1F0F3D] space-y-2.5 opacity-80">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-black">
                      D
                    </div>
                    <div>
                      <span className="text-xs font-black text-white block leading-tight">DragonSlayer_99</span>
                      <span className="text-[10px] font-bold text-[#FBBF24] font-mono">Rank 6 • Dragonkin</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    "Recruiting 3 active warriors for tonight's wilderness raid. Drop a comment below to join the squad."
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 4. PERSISTENT ACCOUNT BANNER */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#E5E2EC]">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-[#A855F7] font-mono">
            ONE UNIFIED ACCOUNT
          </h4>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-medium">
            Your Google or email account syncs across both <strong>🎮 The Game</strong> and <strong>👥 The Community</strong>. Keep your character level, gold, rank, and posts permanently.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              to="/game/play"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#A855F7] hover:bg-[#9333EA] text-white text-xs sm:text-sm font-black shadow-lg shadow-[#A855F7]/30 border border-[#C084FC]/30 transition-all hover:scale-105"
            >
              <Play size={14} className="fill-white" />
              <span>LAUNCH GAME NOW</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
