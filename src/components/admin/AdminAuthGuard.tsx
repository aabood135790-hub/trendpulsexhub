import { useState, useEffect, ReactNode, FormEvent } from 'react';
import { ShieldCheck, Lock, User, Eye, EyeOff, KeyRound, AlertCircle, ArrowRight, CheckCircle2, Sparkles, Gamepad2 } from 'lucide-react';
import { isAdminAuthenticated, verifyAdminLogin, setAdminAuthenticated } from '../../lib/adminAuth';

interface AdminAuthGuardProps {
  children: ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  // Login Form States
  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Check session storage on mount
    const auth = isAdminAuthenticated();
    setIsAuthenticated(auth);
    setIsChecking(false);
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await verifyAdminLogin(username, password);
      if (result.success) {
        setIsAuthenticated(true);
      } else {
        setError(result.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError('An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDefaults = () => {
    setUsername('admin');
    setPassword('admin123');
    setError(null);
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-sky-400 font-bold font-mono text-sm">
          <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
          Verifying Admin Security Clearance...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center p-4 sm:p-6 selection:bg-sky-500 selection:text-white relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sapphire-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Card Container */}
          <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60 space-y-6">
            
            {/* Header / Brand */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-gradient-to-tr from-sapphire-600 to-sky-500 text-white shadow-lg shadow-sapphire-500/30 ring-4 ring-white/5">
                <ShieldCheck size={32} className="stroke-[2.5]" />
              </div>

              <div>
                <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-widest text-sky-400 font-mono">
                  <Gamepad2 size={13} /> TrendPulseX Admin Control
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight mt-1">
                  Admin Authentication Guard
                </h1>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  Restricted access. Please sign in with your administrator credentials to proceed.
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-start gap-2.5 animate-shake">
                <AlertCircle size={16} className="shrink-0 text-rose-400 mt-0.5" />
                <div className="flex-1 leading-snug">{error}</div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex items-center justify-between">
                  <span>Username</span>
                  <span className="text-[10px] text-slate-500 font-mono">default: admin</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    className="w-full bg-slate-950/80 border border-white/10 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex items-center justify-between">
                  <span>Password</span>
                  <span className="text-[10px] text-slate-500 font-mono">default: admin123</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950/80 border border-white/10 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-all font-medium font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title={showPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sapphire-600 to-sky-500 hover:from-sapphire-500 hover:to-sky-400 text-white py-3.5 px-4 rounded-xl font-black text-sm shadow-lg shadow-sapphire-600/30 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <KeyRound size={16} />
                    <span>Enter Admin Control Center</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Helper */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-slate-400">
                <span className="font-bold text-slate-300">Default Auth:</span> <code className="bg-slate-950 px-1.5 py-0.5 rounded text-sky-400 font-mono">admin / admin123</code>
              </div>
              <button
                type="button"
                onClick={handleFillDefaults}
                className="text-sky-400 hover:text-sky-300 font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Sparkles size={13} /> Auto-fill Default
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
