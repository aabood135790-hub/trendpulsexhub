import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Gamepad2, Play, Users, Zap, Shield, Sparkles, Trophy, 
  Coins, Smartphone, Monitor, ChevronRight, Activity, ArrowRight,
  Flame, Globe, CheckCircle2, Star, User, Swords, Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePageSEO } from '../lib/seo';
import { GameServerConfig } from '../components/admin/GameConfigPanel';

export function GameLanding() {
  const { profile, isAuthenticated, credits, openAuthModal, openWalletModal } = useAuth();
  
  const [serverConfig, setServerConfig] = useState<GameServerConfig>(() => {
    if (typeof window === 'undefined') return {
      serverStatus: 'online',
      serverRegion: 'Global Multi-Region (US-East / EU-Central / AP-East)',
      motdText: 'Welcome to TrendPulseX: 2D Online Realm. Select your Race and explore the Crystal Safe Zones.',
      featuredMode: '2D Open World Realm',
      maxRoomCapacity: 32,
      clientVersion: 'v1.0.0-live',
      tickRate: 60,
      creditsMultiplier: 1.0,
    };
    const cached = localStorage.getItem('trendpulse_game_config');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
    return {
      serverStatus: 'online',
      serverRegion: 'Global Multi-Region (US-East / EU-Central / AP-East)',
      motdText: 'Welcome to TrendPulseX: 2D Online Realm. Select your Race and explore the Crystal Safe Zones.',
      featuredMode: '2D Open World Realm',
      maxRoomCapacity: 32,
      clientVersion: 'v1.0.0-live',
      tickRate: 60,
      creditsMultiplier: 1.0,
    };
  });

  const [simulatedPlayers, setSimulatedPlayers] = useState(154);
  const [pingMs, setPingMs] = useState(24);

  usePageSEO({
    title: 'TrendPulseX | 2D Online Realm - Play Instant Browser Multiplayer',
    description: 'Play TrendPulseX: 2D Online Realm directly in your browser. Real-time multiplayer, 4 elemental races, safe zones, and open wilderness combat.',
    keywords: 'online browser game, 2d multiplayer game, trendpulsex game, html5 arena, instant online rpg',
  });

  useEffect(() => {
    const handleConfigChange = (e: any) => {
      if (e.detail) setServerConfig(e.detail);
    };
    window.addEventListener('trendpulse_game_config_updated', handleConfigChange);

    const interval = setInterval(() => {
      setSimulatedPlayers(prev => prev + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3));
      setPingMs(prev => Math.max(16, Math.min(38, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 4000);

    return () => {
      window.removeEventListener('trendpulse_game_config_updated', handleConfigChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div translate="no" lang="en" className="notranslate w-full pb-20 md:pb-12 bg-[#F8F7FA] text-[#090514] min-h-screen">
      
      {/* 1. HERO SECTION: GAME SPOTLIGHT (Deep Dark Purple Focal Section) */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-24 px-4 sm:px-6 lg:px-8 bg-[#090514] text-white border-b border-[#160B2E]">
        
        {/* Subtle Purple Backdrop Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#A855F7]/10 rounded-full blur-[140px]" />
          <div className="absolute top-10 right-10 w-80 h-80 bg-[#FBBF24]/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          
          {/* Top Live Ticker */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${
                serverConfig.serverStatus === 'online'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
              }`}>
                <span className={`h-2 w-2 rounded-full ${
                  serverConfig.serverStatus === 'online' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                }`} />
                {serverConfig.serverStatus === 'online' ? 'SERVERS ONLINE • 60 FPS ENGINE' : 'MAINTENANCE MODE'}
              </span>

              <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#160B2E] text-[#C084FC] text-xs font-bold border border-[#A855F7]/30">
                <Globe size={13} className="text-[#C084FC]" /> {serverConfig.serverRegion}
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#160B2E] text-[#FBBF24] text-xs font-mono font-bold border border-[#A855F7]/30">
                <Activity size={13} /> {pingMs}ms
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 bg-[#160B2E] px-3 py-1 rounded-full border border-[#A855F7]/30">
              <Users size={14} className="text-emerald-400" />
              <span><strong className="text-emerald-300">{simulatedPlayers.toLocaleString()}</strong> Players In Realm</span>
            </div>
          </div>

          {/* MOTD Banner */}
          {serverConfig.motdText && (
            <div className="mb-8 p-3.5 rounded-2xl bg-[#0E0720] border border-[#A855F7]/30 text-xs font-semibold text-slate-200 flex items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#FBBF24] shrink-0" />
                <span><strong>Announcement:</strong> {serverConfig.motdText}</span>
              </div>
              <span className="text-[10px] font-mono text-[#C084FC] shrink-0 hidden md:inline">
                Build {serverConfig.clientVersion}
              </span>
            </div>
          )}

          {/* Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Title, Description & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#A855F7]/40 bg-[#160B2E] px-4 py-1.5 backdrop-blur-md">
                <Flame size={16} className="text-[#FBBF24]" />
                <span className="text-xs font-black uppercase tracking-wider text-[#FBBF24] font-mono">
                  TrendPulseX 2D Online Game
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
                Enter The 2D Realm: <br />
                <span className="text-[#C084FC]">
                  Real-Time World & Battles
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Step into the high-speed 2D browser multiplayer arena. Smooth 60 FPS physics, four elemental races, crystal safe zone sanctums, and open-world battles.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/game/play"
                  id="game-landing-play-btn"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#A855F7] hover:bg-[#9333EA] text-white px-8 py-4 rounded-2xl font-black text-base shadow-xl shadow-[#A855F7]/30 border border-[#C084FC]/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Play size={20} className="fill-white" />
                  <span>PLAY NOW (INSTANT BROWSER)</span>
                  <ChevronRight size={18} strokeWidth={3} />
                </Link>

                <Link
                  to="/community"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#160B2E] hover:bg-[#1F0F3D] border border-[#A855F7]/40 text-white px-6 py-4 rounded-2xl font-bold text-sm transition-all cursor-pointer"
                >
                  <Users size={16} className="text-[#C084FC]" />
                  <span>Community Feed</span>
                </Link>
              </div>

              {/* Feature Highlights Pills */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
                <div className="p-3.5 rounded-xl bg-[#160B2E] border border-[#A855F7]/20 flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-[#0E0720] text-[#C084FC] flex items-center justify-center shrink-0">
                    <Zap size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white">Instant Launch</div>
                    <div className="text-[10px] text-slate-400">Zero Download</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#160B2E] border border-[#A855F7]/20 flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-[#0E0720] text-[#FBBF24] flex items-center justify-center shrink-0">
                    <Shield size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white">4 Crystal Sanctuaries</div>
                    <div className="text-[10px] text-slate-400">Safe Zones & Regen</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#160B2E] border border-[#A855F7]/20 flex items-center gap-2.5 col-span-2 sm:col-span-1">
                  <div className="h-8 w-8 rounded-lg bg-[#0E0720] text-[#C084FC] flex items-center justify-center shrink-0">
                    <Swords size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white">Wilderness Combat</div>
                    <div className="text-[10px] text-slate-400">Gold & Ranks</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right: Live Interactive Visual Card */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className="relative rounded-3xl overflow-hidden border border-[#A855F7]/30 shadow-2xl bg-[#0E0720] p-6 group">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 h-40 w-40 rounded-full bg-[#A855F7]/20 blur-2xl pointer-events-none" />
                
                {/* 2D Canvas Mock Preview */}
                <div className="h-60 w-full rounded-2xl bg-[#090514] border border-[#160B2E] flex flex-col items-center justify-center relative overflow-hidden text-center p-4">
                  {/* Glowing Character Center */}
                  <div className="relative z-10 flex flex-col items-center space-y-3">
                    <div className="relative">
                      <div className="h-16 w-16 rounded-2xl bg-[#A855F7] flex items-center justify-center shadow-lg shadow-[#A855F7]/50 border-2 border-[#C084FC] animate-pulse">
                        <Gamepad2 size={32} className="text-white" />
                      </div>
                      <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-[#090514] flex items-center justify-center text-[9px] font-black text-white">
                        1
                      </span>
                    </div>

                    <div>
                      <span className="text-sm font-black text-white block">
                        {isAuthenticated ? (profile?.display_name || profile?.username) : 'Guest Player'}
                      </span>
                      <span className="text-[11px] font-mono text-[#C084FC] font-semibold">
                        Rank 1 • Ready to Enter
                      </span>
                    </div>
                  </div>

                  {/* Controls Preview Pill */}
                  <div className="absolute bottom-3 left-3 right-3 z-10 bg-[#090514]/90 backdrop-blur-md rounded-xl p-2 border border-[#160B2E] flex items-center justify-between text-[11px] font-mono text-slate-300">
                    <span>🎮 WASD / Touch Joystick</span>
                    <span className="text-emerald-400 font-bold">60 FPS Ready</span>
                  </div>
                </div>

                {/* Account Linked Box */}
                <div className="mt-4 pt-4 border-t border-[#160B2E] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-[#160B2E] border border-[#A855F7]/30 overflow-hidden flex items-center justify-center">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <User size={18} className="text-[#C084FC]" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-black text-white">
                        {isAuthenticated ? (profile?.username ? `@${profile.username}` : 'Player Account') : 'Guest Mode'}
                      </div>
                      <div className="text-[10px] text-[#FBBF24] font-bold font-mono">
                        Progress Syncs Across Devices
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/game/play"
                    className="inline-flex items-center gap-1 text-xs font-black text-[#FBBF24] hover:text-[#FDE68A] transition-colors"
                  >
                    <span>Launch</span> <ArrowRight size={14} />
                  </Link>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 2. CORE FEATURES & ARCHITECTURE OVERVIEW (Clean White/Light Section) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 border border-purple-200 text-[#A855F7] text-xs font-black uppercase tracking-wider font-mono">
            <Sparkles size={14} /> High-Performance 2D Browser Engine
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#090514] tracking-tight">
            Seamless Non-Grid Movement & Multiplayer
          </h2>
          <p className="text-sm md:text-base text-slate-600 font-medium">
            Engineered with lightweight HTML5 canvas rendering for ultra-responsive controls on desktop browsers and mobile smartphones alike.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white rounded-3xl border border-[#E5E2EC] p-7 shadow-sm space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-purple-50 text-[#A855F7] flex items-center justify-center border border-purple-200">
              <Zap size={24} />
            </div>
            <h3 className="text-lg font-black text-[#090514]">Sub-Second Launch</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              No installers, launchers, or large downloads. Click "Play Now" and you are instantly exploring the realm in under one second.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl border border-[#E5E2EC] p-7 shadow-sm space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <Shield size={24} />
            </div>
            <h3 className="text-lg font-black text-[#090514]">4 Elemental Races</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Choose between Human, Elf, Dwarf, and Demon. Each spawned safely inside their racial Crystal Sanctuary.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl border border-[#E5E2EC] p-7 shadow-sm space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-purple-50 text-[#A855F7] flex items-center justify-center border border-purple-200">
              <Smartphone size={24} />
            </div>
            <h3 className="text-lg font-black text-[#090514]">Universal Touch & WASD</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Plays smoothly on mobile phones with virtual analog joystick and action pads, or on desktop with keyboard WASD navigation.
            </p>
          </div>

        </div>

        {/* Quick Launch Callout Banner */}
        <div className="rounded-3xl bg-[#090514] text-white p-8 sm:p-10 shadow-2xl border border-[#160B2E] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black text-white">Ready to Enter the Realm?</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Servers are running 24/7. Jump in now to explore the sanctuary crystals and test your combat skills.
            </p>
          </div>

          <Link
            to="/game/play"
            className="inline-flex items-center gap-2.5 bg-[#A855F7] hover:bg-[#9333EA] text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-[#A855F7]/30 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0 border border-[#C084FC]/30"
          >
            <Play size={18} className="fill-white" />
            <span>Launch Game Engine</span>
          </Link>
        </div>

      </section>

    </div>
  );
}
