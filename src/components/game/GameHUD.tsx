import React, { useState } from 'react';
import { 
  Shield, Zap, Coins, Users, Activity, MessageSquare, 
  Send, Sparkles, Maximize2, Minimize2, Map, Flame, HelpCircle
} from 'lucide-react';
import { GameCharacter, GameRace, GameRank } from '../../types';

interface GameHUDProps {
  player: GameCharacter;
  currentZone: { isSafe: boolean; territoryName: string; crystalName?: string };
  onlineCount: number;
  fps: number;
  ping: number;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  showMinimap: boolean;
  onToggleMinimap: () => void;
  onSendChat: (msg: string) => void;
  onToggleAura: () => void;
  auraActive: boolean;
}

export function GameHUD({
  player,
  currentZone,
  onlineCount,
  fps,
  ping,
  isFullscreen,
  onToggleFullscreen,
  showMinimap,
  onToggleMinimap,
  onSendChat,
  onToggleAura,
  auraActive,
}: GameHUDProps) {
  const [chatInput, setChatInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const getRankColor = (rank: GameRank) => {
    switch (rank) {
      case 'SS': return 'bg-gradient-to-r from-rose-500 to-purple-600 text-white border-rose-400';
      case 'S': return 'bg-amber-400 text-slate-950 font-black border-amber-300';
      case 'A': return 'bg-purple-600 text-white border-purple-400';
      case 'B': return 'bg-blue-600 text-white border-blue-400';
      case 'C': return 'bg-emerald-600 text-white border-emerald-400';
      case 'D': return 'bg-cyan-600 text-white border-cyan-400';
      case 'E': return 'bg-slate-600 text-white border-slate-400';
      default: return 'bg-gray-600 text-white border-gray-400';
    }
  };

  const getRaceIcon = (race: GameRace) => {
    switch (race) {
      case 'Human': return '🛡️';
      case 'Elf': return '🌿';
      case 'Dwarf': return '⚒️';
      case 'Demon': return '🔮';
      default: return '👤';
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendChat(chatInput.trim());
    setChatInput('');
  };

  return (
    <>
      {/* Top Header / Bar HUD */}
      <div translate="no" lang="en" className="notranslate absolute top-3 left-3 right-3 flex items-start justify-between gap-3 pointer-events-none z-30 select-none">
        
        {/* Top-Left: Player Stats Card */}
        <div className="pointer-events-auto bg-slate-950/85 backdrop-blur-md p-3 rounded-2xl border border-indigo-900/60 shadow-xl text-white flex items-center gap-3">
          
          {/* Race Avatar Disc */}
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-slate-900 border-2 border-sky-400/40 flex items-center justify-center text-xl shadow-inner">
              {getRaceIcon(player.race)}
            </div>
            <span className={`absolute -bottom-1 -right-1 text-[9px] px-1.5 py-0.2 rounded font-mono font-bold border shadow ${getRankColor(player.rank)}`}>
              {player.rank}
            </span>
          </div>

          {/* Name & HP/MP Bars */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-black text-xs text-white leading-none">{player.username} · {player.age || 18}</span>
              <span className="text-[10px] font-mono text-sky-400 font-bold px-1.5 py-0.2 bg-sky-500/10 rounded">
                LVL {player.level || 1}
              </span>
            </div>

            {/* HP Bar */}
            <div className="w-28 sm:w-36 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, ((player.hp || 100) / (player.max_hp || 100)) * 100))}%` }}
              />
            </div>

            {/* MP & Gold info */}
            <div className="flex items-center justify-between text-[10px] font-mono text-azure-200/80">
              <span className="text-sky-300">MP {player.mp || 50}/{player.max_mp || 50}</span>
              <span className="text-amber-300 font-bold flex items-center gap-0.5">🪙 {player.gold || 0}</span>
            </div>
          </div>

        </div>

        {/* Top-Center: Zone Barrier Status Pill */}
        <div className="pointer-events-auto">
          {currentZone.isSafe ? (
            <div className="px-3.5 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-400/60 shadow-lg shadow-emerald-500/10 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2 backdrop-blur-md animate-pulse">
              <Shield size={14} className="text-emerald-400" />
              <span>SAFE ZONE: {currentZone.territoryName}</span>
            </div>
          ) : (
            <div className="px-3.5 py-1.5 rounded-full bg-rose-950/90 border border-rose-500/60 shadow-lg shadow-rose-500/10 text-rose-300 text-xs font-mono font-bold flex items-center gap-2 backdrop-blur-md">
              <Zap size={14} className="text-amber-400" />
              <span>WILDERNESS: PvP ENABLED</span>
            </div>
          )}
        </div>

        {/* Top-Right: Stats & Quick Toggles */}
        <div className="pointer-events-auto flex items-center gap-2">
          
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-indigo-900/60 text-[11px] font-mono text-white">
            <span className="flex items-center gap-1 text-emerald-400">
              <Users size={13} /> {onlineCount} Online
            </span>
            <span className="text-azure-200/40">|</span>
            <span className="flex items-center gap-1 text-sky-300">
              <Activity size={13} /> {ping}ms
            </span>
            <span className="text-azure-200/40">|</span>
            <span className="text-amber-300 font-bold">{fps} FPS</span>
          </div>

          <button
            onClick={onToggleMinimap}
            className={`p-2.5 rounded-2xl border backdrop-blur-md transition-all cursor-pointer ${
              showMinimap
                ? 'bg-sky-500/30 border-sky-400 text-white'
                : 'bg-slate-950/85 border-indigo-900/60 text-azure-200 hover:text-white'
            }`}
            title="Toggle Minimap"
          >
            <Map size={16} />
          </button>

          <button
            onClick={onToggleFullscreen}
            className="p-2.5 rounded-2xl bg-slate-950/85 hover:bg-slate-900 border border-indigo-900/60 text-azure-200 hover:text-white backdrop-blur-md transition-all cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

        </div>

      </div>

      {/* Bottom-Right Controls: Aura Button & Chat */}
      <div className="absolute bottom-4 right-4 flex flex-col items-end gap-3 z-30 select-none">
        
        {/* Aura Button */}
        <button
          onClick={onToggleAura}
          className={`relative p-3.5 sm:p-4 rounded-3xl border shadow-xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
            auraActive
              ? 'bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 border-white text-white ring-4 ring-sky-400/40 shadow-sky-500/40 scale-105'
              : 'bg-slate-950/90 hover:bg-slate-900 border-indigo-900/80 text-azure-200 hover:text-white backdrop-blur-md'
          }`}
          title="Toggle Aura Energy"
        >
          <Sparkles size={18} className={auraActive ? 'text-amber-300 animate-spin' : 'text-sky-400'} />
          <span className="font-mono">{auraActive ? 'AURA CHARGED' : 'AURA'}</span>
          {auraActive && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
            </span>
          )}
        </button>

        {/* Chat Drawer / Bubble Input */}
        <div className="flex items-center gap-2">
          {isChatOpen ? (
            <form onSubmit={handleChatSubmit} className="flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-2xl border border-indigo-900/60 shadow-xl">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Chat above player head..."
                maxLength={90}
                autoFocus
                className="w-48 sm:w-64 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-sky-400"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-colors cursor-pointer"
              >
                <Send size={14} />
              </button>
              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                className="px-2 py-1 text-xs text-azure-200 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsChatOpen(true)}
              className="p-3 rounded-2xl bg-slate-950/90 hover:bg-slate-900 border border-indigo-900/60 text-azure-200 hover:text-white backdrop-blur-md shadow-xl flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer"
            >
              <MessageSquare size={16} className="text-sky-400" />
              <span>Chat</span>
            </button>
          )}
        </div>

      </div>
    </>
  );
}
