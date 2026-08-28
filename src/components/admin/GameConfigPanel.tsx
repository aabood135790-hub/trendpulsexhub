import React, { useState } from 'react';
import { 
  Gamepad2, Server, Shield, Activity, RefreshCw, Save, CheckCircle2, 
  AlertTriangle, Users, Flame, Globe, Sparkles, Layers, Sliders
} from 'lucide-react';

export interface GameServerConfig {
  serverStatus: 'online' | 'maintenance' | 'offline';
  serverRegion: string;
  motdText: string;
  featuredMode: string;
  maxRoomCapacity: number;
  clientVersion: string;
  tickRate: number;
  creditsMultiplier: number;
}

const DEFAULT_GAME_CONFIG: GameServerConfig = {
  serverStatus: 'online',
  serverRegion: 'Global Multi-Region (US-East / EU-Central / AP-East)',
  motdText: 'Welcome to PulseWorld Arena Alpha! Earn free Gamer Credits and test your skills.',
  featuredMode: '2D Free-For-All Arena',
  maxRoomCapacity: 32,
  clientVersion: 'v0.8.5-alpha',
  tickRate: 60,
  creditsMultiplier: 1.0,
};

export function GameConfigPanel() {
  const [config, setConfig] = useState<GameServerConfig>(() => {
    if (typeof window === 'undefined') return DEFAULT_GAME_CONFIG;
    const cached = localStorage.getItem('trendpulse_game_config');
    if (cached) {
      try {
        return { ...DEFAULT_GAME_CONFIG, ...JSON.parse(cached) };
      } catch {}
    }
    return DEFAULT_GAME_CONFIG;
  });

  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const handleSave = () => {
    localStorage.setItem('trendpulse_game_config', JSON.stringify(config));
    // Dispatch custom event for real-time update in any open game tabs
    window.dispatchEvent(new CustomEvent('trendpulse_game_config_updated', { detail: config }));
    setSavedMsg('✓ Game Server settings and live configuration saved successfully!');
    setTimeout(() => setSavedMsg(null), 3500);
  };

  const handleReset = () => {
    setConfig(DEFAULT_GAME_CONFIG);
    localStorage.setItem('trendpulse_game_config', JSON.stringify(DEFAULT_GAME_CONFIG));
    setSavedMsg('✓ Restored default game server settings.');
    setTimeout(() => setSavedMsg(null), 3500);
  };

  return (
    <div translate="no" lang="en" className="notranslate space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-sapphire-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-sapphire-400/25 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-sky-400/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-400/20 text-sky-400 border border-sky-400/30">
              <Gamepad2 size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-black uppercase ${
                  config.serverStatus === 'online' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' 
                    : config.serverStatus === 'maintenance'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    config.serverStatus === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`} />
                  SERVER {config.serverStatus.toUpperCase()}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-azure-500/20 border border-azure-400/30 px-2.5 py-0.5 text-[11px] font-bold text-azure-200">
                  <Activity size={11} /> {config.tickRate} Hz Tickrate
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-800/80 border border-indigo-600/40 px-2.5 py-0.5 text-[11px] font-bold text-azure-100">
                  <Layers size={11} /> Build {config.clientVersion}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white">Original Online Game Configuration</h2>
              <p className="text-xs font-medium text-azure-100/70 mt-1 max-w-2xl">
                Configure server deployment status, MOTD banner, room limits, and client version for the browser game engine.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-xs font-bold text-azure-100 transition-colors cursor-pointer"
            >
              Reset Defaults
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-400 to-azure-300 hover:from-sky-300 hover:to-azure-200 text-indigo-950 px-6 py-2.5 rounded-xl font-black text-xs shadow-lg shadow-sky-400/25 transition-all active:scale-95 cursor-pointer"
            >
              <Save size={15} /> Save Server Config
            </button>
          </div>
        </div>

        {savedMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-xs font-bold text-emerald-200 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 size={15} /> {savedMsg}
          </div>
        )}
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: Server Status & Access */}
        <div className="bg-white rounded-2xl border border-indigo-950/10 p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-indigo-950/5">
            <Server size={18} className="text-sapphire-600" />
            <h3 className="font-black text-indigo-950 text-base">Server Availability & State</h3>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-indigo-950 uppercase tracking-wider">
              Live Server State
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['online', 'maintenance', 'offline'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setConfig(prev => ({ ...prev, serverStatus: status }))}
                  className={`py-2.5 px-3 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                    config.serverStatus === status
                      ? status === 'online'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                        : status === 'maintenance'
                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
                        : 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                      : 'bg-azure-50 text-indigo-900/70 border border-indigo-950/10 hover:bg-azure-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-indigo-900/60 leading-relaxed font-medium">
              Setting to <strong>Maintenance</strong> will display a notice to players attempting to connect to <code>/game/play</code> while allowing admins to test.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-indigo-950 uppercase tracking-wider">
              Server Region Cluster
            </label>
            <input
              type="text"
              value={config.serverRegion}
              onChange={(e) => setConfig(prev => ({ ...prev, serverRegion: e.target.value }))}
              placeholder="e.g. US-East / EU-Central / AP-East"
              className="w-full bg-azure-50 border border-indigo-950/10 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-indigo-950 focus:outline-none focus:border-sapphire-600"
            />
          </div>
        </div>

        {/* Card 2: Matchmaking & Mode */}
        <div className="bg-white rounded-2xl border border-indigo-950/10 p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-indigo-950/5">
            <Sliders size={18} className="text-sapphire-600" />
            <h3 className="font-black text-indigo-950 text-base">Game Mode & Room Settings</h3>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-indigo-950 uppercase tracking-wider">
              Featured Active Mode
            </label>
            <select
              value={config.featuredMode}
              onChange={(e) => setConfig(prev => ({ ...prev, featuredMode: e.target.value }))}
              className="w-full bg-azure-50 border border-indigo-950/10 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-indigo-950 focus:outline-none focus:border-sapphire-600 cursor-pointer"
            >
              <option value="2D Free-For-All Arena">2D Free-For-All Arena</option>
              <option value="Battle Royale (2D Top-Down)">Battle Royale (2D Top-Down)</option>
              <option value="Speedrun Obstacle Course">Speedrun Obstacle Course</option>
              <option value="Team Deathmatch 4v4">Team Deathmatch 4v4</option>
              <option value="Boss Raid Dungeon">Boss Raid Dungeon</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-indigo-950 uppercase tracking-wider">
                Max Players / Room
              </label>
              <input
                type="number"
                min="4"
                max="128"
                value={config.maxRoomCapacity}
                onChange={(e) => setConfig(prev => ({ ...prev, maxRoomCapacity: parseInt(e.target.value) || 32 }))}
                className="w-full bg-azure-50 border border-indigo-950/10 rounded-xl px-3.5 py-2 text-xs font-semibold text-indigo-950 focus:outline-none focus:border-sapphire-600"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-indigo-950 uppercase tracking-wider">
                Simulation Tick Rate
              </label>
              <select
                value={config.tickRate}
                onChange={(e) => setConfig(prev => ({ ...prev, tickRate: parseInt(e.target.value) || 60 }))}
                className="w-full bg-azure-50 border border-indigo-950/10 rounded-xl px-3.5 py-2 text-xs font-semibold text-indigo-950 focus:outline-none focus:border-sapphire-600"
              >
                <option value={30}>30 Hz (Eco)</option>
                <option value={60}>60 Hz (Standard)</option>
                <option value={120}>120 Hz (High Performance)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 3: Announcement / MOTD Banner */}
        <div className="bg-white rounded-2xl border border-indigo-950/10 p-6 space-y-4 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between pb-2 border-b border-indigo-950/5">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" />
              <h3 className="font-black text-indigo-950 text-base">In-Game MOTD (Message of the Day) &amp; Client Version</h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-indigo-900/50 bg-azure-50 px-2 py-0.5 rounded">
              Displayed in /game and /game/play
            </span>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-indigo-950 uppercase tracking-wider">
              Server Announcement (MOTD)
            </label>
            <textarea
              rows={2}
              value={config.motdText}
              onChange={(e) => setConfig(prev => ({ ...prev, motdText: e.target.value }))}
              placeholder="Enter announcement banner for active players..."
              className="w-full bg-azure-50 border border-indigo-950/10 rounded-xl px-3.5 py-2.5 text-xs font-medium text-indigo-950 focus:outline-none focus:border-sapphire-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-indigo-950 uppercase tracking-wider">
                Client Build Version
              </label>
              <input
                type="text"
                value={config.clientVersion}
                onChange={(e) => setConfig(prev => ({ ...prev, clientVersion: e.target.value }))}
                placeholder="v0.8.5-alpha"
                className="w-full bg-azure-50 border border-indigo-950/10 rounded-xl px-3.5 py-2 text-xs font-mono font-semibold text-indigo-950 focus:outline-none focus:border-sapphire-600"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-indigo-950 uppercase tracking-wider">
                Gamer Credits In-Game Bonus Multiplier
              </label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                value={config.creditsMultiplier}
                onChange={(e) => setConfig(prev => ({ ...prev, creditsMultiplier: parseFloat(e.target.value) || 1.0 }))}
                className="w-full bg-azure-50 border border-indigo-950/10 rounded-xl px-3.5 py-2 text-xs font-mono font-semibold text-indigo-950 focus:outline-none focus:border-sapphire-600"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
