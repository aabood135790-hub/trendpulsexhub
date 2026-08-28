import React, { useState } from 'react';
import { X, Shield, Coins, UserPlus, Users, MessageSquare, Award, Sparkles, Check, AlertCircle } from 'lucide-react';
import { GameCharacter } from '../../types';
import { transferGameGold } from '../../lib/supabase';

interface PlayerInteractionModalProps {
  player: GameCharacter;
  currentUser: GameCharacter;
  onClose: () => void;
  onGoldTransferred?: (newGold: number) => void;
  onSendDirectChat?: (targetUsername: string) => void;
}

export function PlayerInteractionModal({
  player,
  currentUser,
  onClose,
  onGoldTransferred,
  onSendDirectChat,
}: PlayerInteractionModalProps) {
  const [goldAmount, setGoldAmount] = useState<number>(50);
  const [isTransferring, setIsTransferring] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [friendAdded, setFriendAdded] = useState(false);
  const [teamInvited, setTeamInvited] = useState(false);

  const getRankBadge = (rank: string) => {
    switch (rank) {
      case 'SS': return 'bg-rose-500/30 text-rose-300 border-rose-500/50 shadow-rose-500/20';
      case 'S': return 'bg-amber-500/30 text-amber-300 border-amber-500/50 shadow-amber-500/20';
      case 'A': return 'bg-purple-500/30 text-purple-300 border-purple-500/50';
      case 'B': return 'bg-blue-500/30 text-blue-300 border-blue-500/50';
      case 'C': return 'bg-emerald-500/30 text-emerald-300 border-emerald-500/50';
      case 'D': return 'bg-cyan-500/30 text-cyan-300 border-cyan-500/50';
      case 'E': return 'bg-slate-500/30 text-slate-300 border-slate-500/50';
      default: return 'bg-gray-500/30 text-gray-300 border-gray-500/50';
    }
  };

  const getRaceBadge = (race: string) => {
    switch (race) {
      case 'Human': return { icon: '🛡️', color: 'text-sky-400' };
      case 'Elf': return { icon: '🌿', color: 'text-emerald-400' };
      case 'Dwarf': return { icon: '⚒️', color: 'text-amber-400' };
      case 'Demon': return { icon: '🔮', color: 'text-rose-400' };
      default: return { icon: '👤', color: 'text-azure-200' };
    }
  };

  const raceInfo = getRaceBadge(player.race);

  const handleGiveGold = async (e: React.FormEvent) => {
    e.preventDefault();
    if (goldAmount <= 0) return;

    if (currentUser.gold < goldAmount) {
      setStatusMessage({
        type: 'error',
        text: `Insufficient Gold! You have ${currentUser.gold} Gold, but tried to send ${goldAmount}.`,
      });
      return;
    }

    setIsTransferring(true);
    setStatusMessage(null);

    try {
      const res = await transferGameGold(currentUser.user_id, player.user_id, goldAmount);
      if (res.success) {
        const newGold = currentUser.gold - goldAmount;
        if (onGoldTransferred) onGoldTransferred(newGold);
        setStatusMessage({
          type: 'success',
          text: `Successfully transferred 🪙 ${goldAmount} Gold to ${player.username}!`,
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: res.error || 'Failed to transfer Gold.',
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Connection error while transferring Gold.',
      });
    } finally {
      setIsTransferring(false);
    }
  };

  const handleAddFriend = () => {
    setFriendAdded(true);
    setStatusMessage({
      type: 'success',
      text: `Friend request sent to ${player.username}!`,
    });
  };

  const handleInviteTeam = () => {
    setTeamInvited(true);
    setStatusMessage({
      type: 'success',
      text: `Team invitation dispatched to ${player.username}!`,
    });
  };

  return (
    <div translate="no" lang="en" className="notranslate fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-indigo-900/60 rounded-3xl shadow-2xl overflow-hidden text-white animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/10 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{raceInfo.icon}</span>
            <div>
              <h3 className="font-black text-base text-white flex items-center gap-2">
                {player.username} · {player.age || 18}
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getRankBadge(player.rank)}`}>
                  RANK {player.rank}
                </span>
              </h3>
              <p className="text-[11px] text-azure-200/70 font-mono">
                {player.race} Warrior • Level {player.level || 1}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-azure-200 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Player Stats Grid */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-indigo-900/40 text-center">
              <div className="text-[10px] font-mono uppercase text-azure-200/60">HP</div>
              <div className="text-sm font-bold text-emerald-400">{player.hp || 100} / {player.max_hp || 100}</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-indigo-900/40 text-center">
              <div className="text-[10px] font-mono uppercase text-azure-200/60">MP</div>
              <div className="text-sm font-bold text-sky-400">{player.mp || 50} / {player.max_mp || 50}</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-indigo-900/40 text-center">
              <div className="text-[10px] font-mono uppercase text-azure-200/60">Gold</div>
              <div className="text-sm font-bold text-amber-300">🪙 {player.gold || 0}</div>
            </div>
          </div>

          {/* House info */}
          <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-900/40 text-xs flex items-center justify-between text-azure-200">
            <span className="flex items-center gap-1.5">
              🏠 <strong>House:</strong> {player.house_name || `${player.username}'s House`}
            </span>
            <span className="text-emerald-400 font-mono text-[11px] font-bold">
              Protected in Safe Zone
            </span>
          </div>

          {/* Quick Actions (Add Friend, Invite Team, Whisper) */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleAddFriend}
              disabled={friendAdded}
              className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-50 text-xs font-bold text-azure-100 border border-white/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <UserPlus size={14} className="text-sky-400" />
              {friendAdded ? 'Request Sent' : 'Add Friend'}
            </button>
            <button
              onClick={handleInviteTeam}
              disabled={teamInvited}
              className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-50 text-xs font-bold text-azure-100 border border-white/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Users size={14} className="text-emerald-400" />
              {teamInvited ? 'Invite Dispatched' : 'Invite to Team'}
            </button>
          </div>

          {/* Give Gold Form */}
          <form onSubmit={handleGiveGold} className="p-4 rounded-2xl bg-slate-950/90 border border-amber-400/30 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-amber-300 flex items-center gap-1.5">
                <Coins size={14} /> Give Gold to {player.username}
              </label>
              <span className="text-[11px] font-mono text-azure-200/70">
                Your Balance: <strong className="text-amber-300">{currentUser.gold}</strong>
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="number"
                min={1}
                max={currentUser.gold || 1}
                value={goldAmount}
                onChange={(e) => setGoldAmount(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-indigo-900/60 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={isTransferring || currentUser.gold < goldAmount}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-50 text-slate-950 font-black text-xs uppercase shadow transition-all cursor-pointer shrink-0"
              >
                {isTransferring ? 'Sending...' : 'Send Gold'}
              </button>
            </div>
          </form>

          {/* Status Message Alert */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <Check size={15} className="shrink-0" />
              ) : (
                <AlertCircle size={15} className="shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
