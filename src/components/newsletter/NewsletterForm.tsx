import { useState, FormEvent } from 'react';
import { 
  Mail, Send, CheckCircle2, AlertCircle, Sparkles, Bell, 
  RefreshCw, Check, ShieldCheck, Database, Copy, ChevronDown, ChevronUp 
} from 'lucide-react';
import { subscribeToNewsletter, validateEmail, isLocallySubscribed, NEWSLETTER_SQL_SNIPPET } from '../../lib/newsletter';

interface NewsletterFormProps {
  variant?: 'footer' | 'card' | 'compact';
  className?: string;
}

export function NewsletterForm({ variant = 'footer', className = '' }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [showSqlGuide, setShowSqlGuide] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const clean = email.trim().toLowerCase();

    // 1. Client-side validation
    const validation = validateEmail(clean);
    if (!validation.valid) {
      setStatus('error');
      setFeedbackMessage(validation.error || 'Please enter a valid email address.');
      return;
    }

    // 2. Client-side duplicate check
    if (isLocallySubscribed(clean)) {
      setStatus('error');
      setFeedbackMessage('This email is already subscribed to TrendPulseX code drops!');
      return;
    }

    setStatus('loading');
    setFeedbackMessage('');

    try {
      const result = await subscribeToNewsletter(clean);

      if (result.success) {
        setStatus('success');
        setFeedbackMessage(result.message || 'Thanks for subscribing! You will receive daily code alerts.');
        setEmail('');
      } else {
        setStatus('error');
        setFeedbackMessage(result.message || 'Unable to subscribe at this time. Please try again.');
      }
    } catch (err: any) {
      setStatus('error');
      setFeedbackMessage('An unexpected error occurred. Please check your connection.');
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(NEWSLETTER_SQL_SNIPPET);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleReset = () => {
    setStatus('idle');
    setEmail('');
    setFeedbackMessage('');
  };

  return (
    <div className={`w-full ${className}`}>
      {status === 'success' ? (
        <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-emerald-900/30 to-indigo-950/40 border border-emerald-500/30 p-5 sm:p-6 text-white space-y-3 shadow-lg shadow-emerald-950/30 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-400/30">
              <CheckCircle2 size={24} className="stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-black text-white text-base flex items-center gap-1.5">
                <span>You're On The VIP List!</span>
                <Sparkles size={16} className="text-yellow-400" />
              </h4>
              <p className="text-xs text-emerald-300/90 font-medium mt-0.5">
                {feedbackMessage}
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-4 text-[11px] text-emerald-200/70 border-t border-emerald-500/20">
            <span className="flex items-center gap-1">
              <ShieldCheck size={13} className="text-emerald-400" /> Verified daily drops only
            </span>
            <button
              onClick={handleReset}
              className="text-white hover:text-emerald-300 font-bold underline transition-colors cursor-pointer"
            >
              Subscribe another email
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Header */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sapphire-500/10 border border-sapphire-400/20 text-sapphire-400 text-[10px] font-black uppercase tracking-wider font-mono">
              <Bell size={11} className="text-sky-400" /> Stay Updated
            </div>
            <h4 className="text-base sm:text-lg font-black text-white tracking-tight">
              Get Daily Secret Codes & Patch Drops
            </h4>
            <p className="text-xs text-slate-300/80 font-medium leading-relaxed">
              Never miss a limited-time Roblox code, Genshin Primogem drop, or speedrun strategy.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') {
                      setStatus('idle');
                      setFeedbackMessage('');
                    }
                  }}
                  disabled={status === 'loading'}
                  placeholder="Enter your gamer email..."
                  className={`w-full bg-slate-900/90 border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-medium ${
                    status === 'error'
                      ? 'border-rose-500/60 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-white/15 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-sapphire-600 to-sky-500 hover:from-sapphire-500 hover:to-sky-400 text-white px-4 py-2.5 rounded-xl font-black text-xs shadow-md shadow-sapphire-600/30 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer shrink-0"
              >
                {status === 'loading' ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <Send size={13} />
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {status === 'error' && (
              <div className="flex items-center gap-1.5 text-rose-400 text-xs font-semibold animate-shake">
                <AlertCircle size={14} className="shrink-0" />
                <span>{feedbackMessage}</span>
              </div>
            )}
          </form>

          {/* Privacy & Guarantees */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-emerald-400" /> No spam • Cancel anytime
            </span>
            <button
              type="button"
              onClick={() => setShowSqlGuide(!showSqlGuide)}
              className="text-[10px] text-slate-500 hover:text-sky-400 font-mono transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <Database size={10} /> Supabase Schema {showSqlGuide ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
            </button>
          </div>

          {/* SQL Setup Drawer for Admins / Developers */}
          {showSqlGuide && (
            <div className="mt-3 p-3.5 rounded-xl bg-slate-950 border border-white/10 text-left space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-300 font-mono">
                  <Database size={12} /> Supabase SQL (`newsletter_subscribers`)
                </div>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold font-mono inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedSql ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                  {copiedSql ? 'Copied!' : 'Copy SQL'}
                </button>
              </div>
              <pre className="text-[10px] text-slate-300 font-mono bg-slate-900/90 p-2.5 rounded-lg overflow-x-auto border border-white/5 leading-relaxed">
                {NEWSLETTER_SQL_SNIPPET}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
