import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, User, Check, AlertCircle, RefreshCw, Zap, Crown, Flame, Gem } from 'lucide-react';
import { GameRace, GameRank } from '../../types';
import { checkGameUsername, createGameCharacter } from '../../lib/supabase';

interface CharacterCreationModalProps {
  userId: string;
  defaultDisplayName?: string;
  avatarUrl?: string | null;
  defaultAge?: number;
  onCharacterCreated: (character: any) => void;
}

const RACES: Array<{
  id: GameRace;
  name: string;
  territory: string;
  crystal: string;
  color: string;
  gradient: string;
  badgeBg: string;
  borderColor: string;
  description: string;
  perk: string;
  icon: string;
}> = [
  {
    id: 'Human',
    name: 'Human',
    territory: 'Kingdom of Valoria',
    crystal: 'Sanctum Crystal',
    color: '#38bdf8',
    gradient: 'from-sky-500 to-blue-700',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-400/30',
    borderColor: 'border-sky-500/50',
    description: 'Versatile and resolute guardians blessed by the celestial Sanctum Crystal.',
    perk: 'Balanced physical and magical affinity with safe harbor in Valoria.',
    icon: '🛡️',
  },
  {
    id: 'Elf',
    name: 'Elf',
    territory: 'Sylvaen Glade',
    crystal: 'Eldertree Crystal',
    color: '#34d399',
    gradient: 'from-emerald-400 to-teal-700',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    borderColor: 'border-emerald-500/50',
    description: 'Swift, graceful beings deeply attuned to ancient forest mana and nature spirits.',
    perk: 'Nature spirit blessings and swift traversal in Sylvaen Glade.',
    icon: '🌿',
  },
  {
    id: 'Dwarf',
    name: 'Dwarf',
    territory: 'Ironhold Peaks',
    crystal: 'Forgefire Crystal',
    color: '#fbbf24',
    gradient: 'from-amber-400 to-orange-700',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
    borderColor: 'border-amber-500/50',
    description: 'Master smiths and sturdy warriors forged in subterranean magma and iron peaks.',
    perk: 'High resilience and indestructible stonework crafted in Ironhold.',
    icon: '⚒️',
  },
  {
    id: 'Demon',
    name: 'Demon',
    territory: 'Nether Abyss',
    crystal: 'Abyssal Crystal',
    color: '#f43f5e',
    gradient: 'from-rose-500 to-purple-800',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
    borderColor: 'border-rose-500/50',
    description: 'Fierce, untamed warlords who command violet abyssal flame and dark energy.',
    perk: 'Intimidating presence and powerful dark flame in the Nether Abyss.',
    icon: '🔮',
  },
];

export function CharacterCreationModal({
  userId,
  defaultDisplayName = '',
  avatarUrl = null,
  defaultAge = 18,
  onCharacterCreated,
}: CharacterCreationModalProps) {
  const [username, setUsername] = useState(defaultDisplayName.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 14) || '');
  const [age, setAge] = useState<number>(defaultAge || 18);
  const [selectedRace, setSelectedRace] = useState<GameRace>('Human');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounced username availability check
  useEffect(() => {
    const clean = username.trim();
    if (!clean) {
      setIsUsernameAvailable(null);
      setUsernameError(null);
      return;
    }

    if (clean.length < 3) {
      setIsUsernameAvailable(false);
      setUsernameError('Username must be at least 3 characters.');
      return;
    }

    if (clean.length > 16) {
      setIsUsernameAvailable(false);
      setUsernameError('Username cannot exceed 16 characters.');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(clean)) {
      setIsUsernameAvailable(false);
      setUsernameError('Only letters, numbers, and underscores are allowed.');
      return;
    }

    setUsernameError(null);
    setIsCheckingUsername(true);

    const timer = setTimeout(async () => {
      const available = await checkGameUsername(clean);
      setIsUsernameAvailable(available);
      if (!available) {
        setUsernameError('This username is already taken. Please choose another.');
      }
      setIsCheckingUsername(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || isUsernameAvailable === false || usernameError) return;

    setIsSubmitting(true);
    try {
      const res = await createGameCharacter({
        userId,
        username: username.trim(),
        displayName: username.trim(),
        race: selectedRace,
        age: Number(age) || 18,
        avatar_url: avatarUrl,
      });

      if (res.success && res.character) {
        onCharacterCreated(res.character);
      } else {
        setUsernameError(res.error || 'Failed to create character. Please try again.');
      }
    } catch (err: any) {
      setUsernameError(err?.message || 'Server connection error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedRaceInfo = RACES.find((r) => r.id === selectedRace) || RACES[0];

  return (
    <div translate="no" lang="en" className="notranslate fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-indigo-900/60 rounded-3xl shadow-2xl overflow-hidden text-white my-8">
        
        {/* Top Header Banner */}
        <div className="relative px-6 pt-6 pb-5 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-indigo-900/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-2xl shadow-inner">
              ✨
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                Create Your Character
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  Alpha 2D
                </span>
              </h2>
              <p className="text-xs text-azure-200/80">
                Choose your race, claim a unique username and age, and awaken inside your Crystal territory.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Step 1: Unique Username & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-azure-200">
                1. Unique Username <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-azure-200/50">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. ShadowBlade, Valkyrie"
                  maxLength={16}
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-950 border border-indigo-900/60 text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
                />
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                  {isCheckingUsername && (
                    <RefreshCw size={16} className="text-sky-400 animate-spin" />
                  )}
                  {!isCheckingUsername && isUsernameAvailable === true && (
                    <Check size={18} className="text-emerald-400" />
                  )}
                  {!isCheckingUsername && isUsernameAvailable === false && (
                    <AlertCircle size={18} className="text-rose-400" />
                  )}
                </div>
              </div>

              {usernameError && (
                <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-1 font-medium">
                  <AlertCircle size={13} className="shrink-0" />
                  {usernameError}
                </p>
              )}
              {!usernameError && isUsernameAvailable === true && (
                <p className="text-xs text-emerald-400 flex items-center gap-1.5 mt-1 font-medium">
                  <Check size={13} className="shrink-0" />
                  Username is available and permanently linked.
                </p>
              )}
            </div>

            {/* Age Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-azure-200">
                Age <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min={13}
                max={99}
                value={age}
                onChange={(e) => setAge(Math.max(13, Math.min(99, parseInt(e.target.value) || 18)))}
                required
                className="w-full px-3.5 py-3 rounded-2xl bg-slate-950 border border-indigo-900/60 text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 text-center"
              />
              <p className="text-[11px] text-azure-200/60 font-mono text-center">
                Display: <span className="text-sky-300 font-bold">{username || 'Warrior'} · {age}</span>
              </p>
            </div>
          </div>

          {/* Step 2: Race Selection (4 Races) */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-azure-200">
              2. Select Your Race & Starting Territory
            </label>
            
            <div className="grid grid-cols-2 gap-3">
              {RACES.map((race) => {
                const isSelected = selectedRace === race.id;
                return (
                  <button
                    key={race.id}
                    type="button"
                    onClick={() => setSelectedRace(race.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? `${race.borderColor} bg-slate-800/90 shadow-lg ring-2 ring-sky-500/30`
                        : 'border-indigo-950/60 bg-slate-950/60 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{race.icon}</span>
                        <span className="font-black text-sm text-white">{race.name}</span>
                      </div>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                    
                    <div className="text-[11px] font-mono text-azure-200/70">
                      Safe Zone: <strong className="text-white">{race.territory}</strong>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Race Territory Info Card */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${selectedRaceInfo.badgeBg}`}>
                {selectedRaceInfo.icon} {selectedRaceInfo.name} Territory
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                <Shield size={12} /> {selectedRaceInfo.crystal} Protected
              </span>
            </div>
            <p className="text-xs text-azure-100/80 leading-relaxed">
              {selectedRaceInfo.description}
            </p>
            <div className="text-[11px] text-azure-200/60 font-mono pt-1 border-t border-white/5 flex items-center justify-between">
              <span>Spawn: {selectedRaceInfo.territory}</span>
              <span>Personal House: Auto-Assigned Inside Barrier</span>
            </div>
          </div>

          {/* Starting Rank Roll Notice */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-950/40 border border-indigo-800/30 text-xs text-azure-200">
            <Crown size={18} className="text-amber-400 shrink-0" />
            <div>
              <strong className="text-white">Starting Rank:</strong> A random power tier (Rank F to Rank SS) will be permanently bestowed upon character creation.
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !username.trim() || isUsernameAvailable === false || !!usernameError}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-50 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Awakening Warrior in PulseWorld...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Awaken As {selectedRace} & Enter World
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}
