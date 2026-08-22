import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  UserPlus, 
  LogIn, 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ExternalLink,
  Eye,
  EyeOff,
  Coins
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function AuthModal() {
  const { 
    isAuthModalOpen, 
    authModalMode, 
    closeAuthModal, 
    openAuthModal,
    signUpWithEmail, 
    signInWithEmail, 
    signInWithGoogle,
    isSupabaseLive
  } = useAuth();

  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  
  // Sign-Up fields
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Mandatory Agreement Checkbox state
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Status & Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync mode whenever opened from context
  useEffect(() => {
    if (authModalMode) {
      setMode(authModalMode);
    }
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [authModalMode, isAuthModalOpen]);

  const resetForm = () => {
    setDisplayName('');
    setUsername('');
    setEmail('');
    setPassword('');
    setAgreedToTerms(false);
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    closeAuthModal();
  };

  const handleModeChange = (newMode: 'signup' | 'signin') => {
    setMode(newMode);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleSignUpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // 1. Strict Validation: Mandatory Agreement Checkbox
    if (!agreedToTerms) {
      setErrorMsg('Please agree to the Terms of Service and Privacy Policy to create your account.');
      return;
    }

    // 2. Field Validations
    const cleanUsername = username.trim().replace(/^@/, '');
    if (!cleanUsername || cleanUsername.length < 3) {
      setErrorMsg('Username must be at least 3 characters long.');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      setErrorMsg('Username can only contain letters, numbers, and underscores.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await signUpWithEmail(
        email.trim(),
        password,
        cleanUsername,
        displayName.trim() || cleanUsername,
        agreedToTerms
      );

      if (res.success) {
        setSuccessMsg('🎉 Account created successfully! Welcome to TrendPulseX.');
        setTimeout(() => {
          handleClose();
        }, 1200);
      } else {
        setErrorMsg(res.error || 'Failed to create account. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'An unexpected error occurred during sign up.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignInSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg('Please enter your email or username.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await signInWithEmail(email.trim(), password);
      if (res.success) {
        setSuccessMsg('Welcome back! Logging you in...');
        setTimeout(() => {
          handleClose();
        }, 1000);
      } else {
        setErrorMsg(res.error || 'Invalid login credentials. Please check and try again.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'An unexpected error occurred during sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[130] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-indigo-950/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-indigo-950/10 overflow-hidden my-4 max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-indigo-950/10 bg-azure-50/70">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sapphire-600 text-white shadow-sm">
                {mode === 'signup' ? <UserPlus size={18} /> : <LogIn size={18} />}
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-indigo-950">
                  {mode === 'signup' ? 'Create Gamer Account' : 'Welcome Back Gamer'}
                </h2>
                <p className="text-xs font-semibold text-indigo-900/60">
                  {mode === 'signup' ? 'Join TrendPulseX to post codes & claim rewards' : 'Log in to access your wallet and saved codes'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-xl text-indigo-900/60 hover:text-indigo-950 hover:bg-white transition-colors cursor-pointer"
              aria-label="Close auth modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="px-6 pt-4 pb-1">
            <div className="grid grid-cols-2 p-1 bg-azure-100/70 rounded-2xl border border-indigo-950/10">
              <button
                type="button"
                onClick={() => handleModeChange('signup')}
                className={`py-2 px-3 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'signup'
                    ? 'bg-white text-sapphire-700 shadow-xs border border-indigo-950/5'
                    : 'text-indigo-900/70 hover:text-indigo-950'
                }`}
              >
                <UserPlus size={14} />
                <span>Sign Up / Register</span>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange('signin')}
                className={`py-2 px-3 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'signin'
                    ? 'bg-white text-sapphire-700 shadow-xs border border-indigo-950/5'
                    : 'text-indigo-900/70 hover:text-indigo-950'
                }`}
              >
                <LogIn size={14} />
                <span>Log In</span>
              </button>
            </div>
          </div>

          {/* Modal Body / Form Area */}
          <div className="p-6 overflow-y-auto space-y-4 flex-1">
            {/* Feedback Alerts */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-start gap-2.5 shadow-xs"
              >
                <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 shadow-xs"
              >
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {/* Quick Google Sign-In */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  signInWithGoogle();
                }}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white hover:bg-azure-50 text-indigo-950 border border-indigo-950/15 rounded-xl font-bold text-xs shadow-xs hover:border-indigo-950/30 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-3 my-3">
                <div className="h-px bg-indigo-950/10 flex-1" />
                <span className="text-[10px] font-black uppercase text-indigo-900/40 tracking-wider">
                  or with email
                </span>
                <div className="h-px bg-indigo-950/10 flex-1" />
              </div>
            </div>

            {/* SIGN-UP FORM */}
            {mode === 'signup' ? (
              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                {/* Full / Display Name & Username */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-black text-indigo-950 uppercase tracking-wider mb-1">
                      Display Name
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-900/40">
                        <User size={14} />
                      </span>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="e.g. Apex Raider"
                        maxLength={30}
                        className="w-full pl-8 pr-3 py-2 bg-azure-50/70 border border-indigo-950/15 rounded-xl font-bold text-indigo-950 text-xs focus:border-sapphire-600 focus:bg-white focus:ring-2 focus:ring-sapphire-600/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-indigo-950 uppercase tracking-wider mb-1">
                      Username *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-indigo-900/40">@</span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.replace(/\s+/g, '_'))}
                        placeholder="ApexRaider_X"
                        maxLength={20}
                        required
                        className="w-full pl-7 pr-3 py-2 bg-azure-50/70 border border-indigo-950/15 rounded-xl font-bold text-indigo-950 text-xs focus:border-sapphire-600 focus:bg-white focus:ring-2 focus:ring-sapphire-600/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-[11px] font-black text-indigo-950 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-900/40">
                      <Mail size={14} />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="gamer@example.com"
                      required
                      className="w-full pl-8 pr-3 py-2 bg-azure-50/70 border border-indigo-950/15 rounded-xl font-bold text-indigo-950 text-xs focus:border-sapphire-600 focus:bg-white focus:ring-2 focus:ring-sapphire-600/20"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[11px] font-black text-indigo-950 uppercase tracking-wider mb-1">
                    Password (6+ Characters) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-900/40">
                      <Lock size={14} />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      minLength={6}
                      required
                      className="w-full pl-8 pr-9 py-2 bg-azure-50/70 border border-indigo-950/15 rounded-xl font-bold text-indigo-950 text-xs focus:border-sapphire-600 focus:bg-white focus:ring-2 focus:ring-sapphire-600/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-indigo-900/40 hover:text-indigo-950 p-1 rounded"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* MANDATORY LEGAL AGREEMENT CHECKBOX */}
                <div className={`p-3.5 rounded-2xl border transition-all ${
                  agreedToTerms 
                    ? 'bg-sapphire-50/80 border-sapphire-300' 
                    : 'bg-azure-50/60 border-indigo-950/15 hover:border-sapphire-400'
                }`}>
                  <label 
                    htmlFor="legal-terms-agreement"
                    className="flex items-start gap-3 cursor-pointer select-none group"
                  >
                    <div className="pt-0.5 shrink-0">
                      <input
                        type="checkbox"
                        id="legal-terms-agreement"
                        checked={agreedToTerms}
                        onChange={(e) => {
                          setAgreedToTerms(e.target.checked);
                          if (e.target.checked && errorMsg) {
                            setErrorMsg(null);
                          }
                        }}
                        required
                        className="h-4 w-4 rounded text-sapphire-600 border-indigo-950/20 focus:ring-sapphire-500 cursor-pointer accent-sapphire-600"
                      />
                    </div>
                    <div className="text-xs text-indigo-950 leading-snug">
                      <span className="font-semibold">
                        I agree to the{' '}
                        <Link
                          to="/terms"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-sapphire-600 hover:text-sapphire-700 underline inline-flex items-center gap-0.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Terms of Service
                          <ExternalLink size={10} className="stroke-[2.5]" />
                        </Link>{' '}
                        and{' '}
                        <Link
                          to="/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-sapphire-600 hover:text-sapphire-700 underline inline-flex items-center gap-0.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Privacy Policy
                          <ExternalLink size={10} className="stroke-[2.5]" />
                        </Link>
                        .
                      </span>
                      <p className="text-[11px] text-indigo-900/60 font-medium mt-1">
                        Includes compliance with GDPR, CCPA, and fair-play community standards.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Validation Note when Checkbox is Unchecked */}
                {!agreedToTerms && (
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-900/60 px-1">
                    <ShieldCheck size={13} className="text-sapphire-600 shrink-0" />
                    <span>Please accept the policies above to activate account creation.</span>
                  </div>
                )}

                {/* Create Account / Submit Button */}
                <button
                  type="submit"
                  disabled={!agreedToTerms || isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sapphire-600 hover:bg-sapphire-500 active:scale-[0.99] text-white font-black text-xs shadow-md shadow-sapphire-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-sapphire-600 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      <span>Create Account & Join</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* SIGN-IN FORM */
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-black text-indigo-950 uppercase tracking-wider mb-1">
                    Email or Username *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-900/40">
                      <Mail size={14} />
                    </span>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="gamer@example.com or @ApexRaider"
                      required
                      className="w-full pl-8 pr-3 py-2.5 bg-azure-50/70 border border-indigo-950/15 rounded-xl font-bold text-indigo-950 text-xs focus:border-sapphire-600 focus:bg-white focus:ring-2 focus:ring-sapphire-600/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-indigo-950 uppercase tracking-wider mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-900/40">
                      <Lock size={14} />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-8 pr-9 py-2.5 bg-azure-50/70 border border-indigo-950/15 rounded-xl font-bold text-indigo-950 text-xs focus:border-sapphire-600 focus:bg-white focus:ring-2 focus:ring-sapphire-600/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-indigo-900/40 hover:text-indigo-950 p-1 rounded"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sapphire-600 hover:bg-sapphire-500 text-white font-black text-xs shadow-md shadow-sapphire-600/25 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={16} />
                      <span>Log In to TrendPulseX</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Switch Mode Prompt */}
            <div className="text-center pt-2 border-t border-indigo-950/10">
              {mode === 'signup' ? (
                <p className="text-xs font-semibold text-indigo-900/70">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleModeChange('signin')}
                    className="font-bold text-sapphire-600 hover:underline cursor-pointer"
                  >
                    Log in here
                  </button>
                </p>
              ) : (
                <p className="text-xs font-semibold text-indigo-900/70">
                  New to TrendPulseX?{' '}
                  <button
                    type="button"
                    onClick={() => handleModeChange('signup')}
                    className="font-bold text-sapphire-600 hover:underline cursor-pointer"
                  >
                    Create a free gamer account
                  </button>
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
