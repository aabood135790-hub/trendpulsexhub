import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wrench, Trophy, Sparkles, Coins, Gift, CheckCircle2, 
  XCircle, Clock, ShieldCheck, Search, Flame, ArrowRight, Zap, Copy, Check
} from 'lucide-react';
import { useAuth, PROMO_CODES_REGISTRY } from '../context/AuthContext';
import { usePageSEO } from '../lib/seo';

export function Tools() {
  const { credits, isDailyGiftAvailable, isDailySpinAvailable, remainingDailyClaimMs, remainingDailySpinMs, openWalletModal, openAuthModal, isAuthenticated } = useAuth();
  
  const [testCodeInput, setTestCodeInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    tested: boolean;
    valid?: boolean;
    title?: string;
    description?: string;
    credits?: number;
    error?: string;
  } | null>(null);

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  usePageSEO({
    title: 'Gaming Tools & Utilities Hub | TrendPulseXhub',
    description: 'Free gaming tools for Roblox players and gamers: Daily Spin Wheel, Gamer Credits Wallet, Promo Code Verification Tool, and Daily Reward Cooldown Trackers.',
    keywords: 'gaming tools, roblox tools, promo code checker, daily spin tracker, gamer credits calculator',
  });

  const formatCooldown = (ms: number) => {
    if (ms <= 0) return 'Ready Now!';
    const totalSec = Math.floor(ms / 1000);
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hours.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  };

  const handleTestCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = testCodeInput.trim().toUpperCase();
    if (!clean) return;

    const promo = PROMO_CODES_REGISTRY[clean];
    if (promo) {
      setVerificationResult({
        tested: true,
        valid: true,
        title: promo.title,
        description: promo.description,
        credits: promo.credits,
      });
    } else {
      setVerificationResult({
        tested: true,
        valid: false,
        error: `Code "${clean}" is not in the active TrendPulseX registry. Check Roblox game codes directory for in-game codes.`,
      });
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-24">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-sapphire-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-sapphire-400/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-black uppercase tracking-wider">
            <Wrench size={14} /> Gaming Utilities Suite
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Gamer Tools &amp; Claim Hub
          </h1>
          <p className="text-sm sm:text-base text-azure-100/80 font-medium leading-relaxed">
            Boost your gameplay with instant reward tools, promo code validators, and synchronized cooldown monitors for TrendPulseXhub.
          </p>
        </div>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Tool 1: Daily Lucky Spin Wheel */}
        <div className="bg-white rounded-3xl border border-indigo-950/10 p-6 sm:p-7 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow">
          <div className="space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Trophy size={24} />
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-indigo-950">Daily Spin Wheel</h2>
              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                isDailySpinAvailable 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {isDailySpinAvailable ? 'Ready' : 'Cooldown'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-indigo-900/70 leading-relaxed">
              Spin once every 24 hours to score free Gamer Credits, exclusive VIP promo codes, and 2X double bonus drops.
            </p>

            <div className="p-3 bg-azure-50 rounded-2xl border border-indigo-950/5 text-xs flex items-center justify-between font-mono">
              <span className="text-indigo-900/60 flex items-center gap-1.5 font-sans font-bold">
                <Clock size={14} className="text-amber-500" /> Next Spin:
              </span>
              <span className="font-bold text-indigo-950">
                {formatCooldown(remainingDailySpinMs)}
              </span>
            </div>
          </div>

          <Link
            to="/spin"
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-indigo-950 py-3 px-4 rounded-xl font-black text-xs shadow-md shadow-amber-500/20 transition-all active:scale-95"
          >
            <Sparkles size={15} />
            <span>Launch Spin Wheel</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Tool 2: 12-Hour Daily Gift Box */}
        <div className="bg-white rounded-3xl border border-indigo-950/10 p-6 sm:p-7 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow">
          <div className="space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <Gift size={24} />
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-indigo-950">12H Reward Box</h2>
              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                isDailyGiftAvailable 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-sky-100 text-sky-800'
              }`}>
                {isDailyGiftAvailable ? '+100 Ready' : 'Cooldown'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-indigo-900/70 leading-relaxed">
              Claim 100 free Gamer Credits twice daily. Use your balance for custom avatar badges and in-game shop items.
            </p>

            <div className="p-3 bg-azure-50 rounded-2xl border border-indigo-950/5 text-xs flex items-center justify-between font-mono">
              <span className="text-indigo-900/60 flex items-center gap-1.5 font-sans font-bold">
                <Clock size={14} className="text-sky-500" /> Next Claim:
              </span>
              <span className="font-bold text-indigo-950">
                {formatCooldown(remainingDailyClaimMs)}
              </span>
            </div>
          </div>

          <button
            onClick={() => isAuthenticated ? openWalletModal() : openAuthModal('signin')}
            className="w-full inline-flex items-center justify-center gap-2 bg-sapphire-600 hover:bg-sapphire-500 text-white py-3 px-4 rounded-xl font-black text-xs shadow-md shadow-sapphire-600/20 transition-all cursor-pointer"
          >
            <Coins size={15} />
            <span>Open Credits Wallet ({credits})</span>
          </button>
        </div>

        {/* Tool 3: Verified Promo Codes Tester */}
        <div className="bg-white rounded-3xl border border-indigo-950/10 p-6 sm:p-7 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow">
          <div className="space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <h2 className="text-xl font-black text-indigo-950">Code Registry Tester</h2>
            <p className="text-xs sm:text-sm text-indigo-900/70 leading-relaxed">
              Verify TrendPulseXhub VIP promo codes before redeeming to see rewards value and status.
            </p>

            <form onSubmit={handleTestCode} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={testCodeInput}
                  onChange={(e) => setTestCodeInput(e.target.value)}
                  placeholder="e.g. SPECIAL10K"
                  className="flex-1 bg-azure-50 border border-indigo-950/10 rounded-xl px-3 py-2 text-xs font-mono font-bold text-indigo-950 focus:outline-none focus:border-sapphire-600 uppercase"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Verify
                </button>
              </div>
            </form>

            {verificationResult && verificationResult.tested && (
              <div className={`p-3 rounded-xl text-xs ${
                verificationResult.valid ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-rose-50 border border-rose-200 text-rose-900'
              }`}>
                {verificationResult.valid ? (
                  <div className="space-y-1">
                    <div className="font-black flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle2 size={14} /> {verificationResult.title} (+{verificationResult.credits?.toLocaleString()} Credits)
                    </div>
                    <div className="text-[11px] text-emerald-800">{verificationResult.description}</div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-rose-700 font-medium">
                    <XCircle size={14} /> {verificationResult.error}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-indigo-950/5 flex items-center justify-between text-xs text-indigo-900/60">
            <span>VIP Code: <strong>SPECIAL10K</strong></span>
            <button
              onClick={() => handleCopy('SPECIAL10K')}
              className="text-sapphire-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              {copiedCode === 'SPECIAL10K' ? <Check size={12} /> : <Copy size={12} />}
              <span>{copiedCode === 'SPECIAL10K' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Directory Links Footer */}
      <div className="bg-azure-50 rounded-3xl p-6 sm:p-8 border border-indigo-950/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-black text-indigo-950 text-lg">Looking for In-Game Promo Codes?</h3>
          <p className="text-xs sm:text-sm text-indigo-900/60">Explore verified working codes for Roblox Blox Fruits, Fisch, and more.</p>
        </div>
        <Link
          to="/codes"
          className="inline-flex items-center gap-2 bg-sapphire-600 hover:bg-sapphire-500 text-white px-6 py-3 rounded-xl font-black text-xs shadow-md shadow-sapphire-600/20 transition-all shrink-0"
        >
          <span>Explore All Codes Vault</span>
          <ArrowRight size={15} />
        </Link>
      </div>

    </div>
  );
}
