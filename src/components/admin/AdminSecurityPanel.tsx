import { useState, FormEvent } from 'react';
import { 
  ShieldCheck, Lock, KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle, 
  RefreshCw, LogOut, ShieldAlert, Sparkles, Check, Key
} from 'lucide-react';
import { 
  changeAdminPassword, 
  resetAdminPasswordToDefault, 
  setAdminAuthenticated, 
  getStoredAdminPassword 
} from '../../lib/adminAuth';

export function AdminSecurityPanel() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isCustomPasswordActive = getStoredAdminPassword() !== 'admin123';

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!currentPassword.trim()) {
      setErrorMessage('Please enter your current admin password.');
      return;
    }

    if (!newPassword.trim() || newPassword.length < 4) {
      setErrorMessage('New password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirmation do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await changeAdminPassword(currentPassword, newPassword);
      if (res.success) {
        setSuccessMessage(res.message || 'Admin password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        setErrorMessage(res.error || 'Failed to update password.');
      }
    } catch (err: any) {
      setErrorMessage('An unexpected error occurred while updating the password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetToDefault = async () => {
    if (!window.confirm('Are you sure you want to reset the admin password back to the default "admin123"?')) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetAdminPasswordToDefault();
      setSuccessMessage(res.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setErrorMessage('Failed to reset admin password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setAdminAuthenticated(false);
    window.location.reload();
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-3xl border border-indigo-950/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black uppercase tracking-wider mb-2">
            <ShieldCheck size={13} /> Admin Guard & Credentials
          </div>
          <h2 className="text-xl md:text-2xl font-black text-indigo-950">Admin Password & Security Settings</h2>
          <p className="text-xs text-indigo-900/60 font-medium mt-1 max-w-2xl">
            Update your admin login password to secure the Control Center. Changes persist in local and server storage for future logins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-black transition-colors cursor-pointer"
          >
            <LogOut size={14} /> End Admin Session
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" /> {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 shadow-xs animate-fadeIn">
          <AlertCircle size={16} className="text-rose-600 shrink-0" /> {errorMessage}
        </div>
      )}

      {/* Main Security Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Security Status Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 rounded-2xl">
                <ShieldCheck size={26} />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Active Session Guard</h3>
                <p className="text-xs text-slate-400">Scoped to this browser tab (sessionStorage)</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                <span className="text-slate-400 font-medium">Username:</span>
                <span className="font-mono font-bold text-white">admin</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                <span className="text-slate-400 font-medium">Password State:</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  isCustomPasswordActive 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                }`}>
                  {isCustomPasswordActive ? 'Custom Password Set' : 'Default (admin123)'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                <span className="text-slate-400 font-medium">Session Storage:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Authenticated
                </span>
              </div>
            </div>

            {isCustomPasswordActive && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  disabled={isLoading}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all cursor-pointer text-center"
                >
                  Reset Password to Default ("admin123")
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Password Change Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-indigo-950/10 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-black text-indigo-950 flex items-center gap-2">
                <KeyRound size={20} className="text-sapphire-600" />
                Change Administrator Password
              </h3>
              <p className="text-xs text-indigo-900/60 font-medium mt-1">
                Enter your current password followed by your new password. Future logins across any tab will require this updated password.
              </p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              
              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-indigo-950 block">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-indigo-900/40">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current admin password"
                    className="w-full bg-azure-50/60 border border-indigo-950/15 focus:border-sapphire-600 focus:ring-2 focus:ring-sapphire-600/20 rounded-xl pl-10 pr-11 py-2.5 text-xs text-indigo-950 placeholder-indigo-900/40 focus:outline-none transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-indigo-900/40 hover:text-indigo-950 transition-colors cursor-pointer"
                  >
                    {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-indigo-950 block">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-indigo-900/40">
                    <Key size={16} />
                  </div>
                  <input
                    type={showNew ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 4 characters)"
                    className="w-full bg-azure-50/60 border border-indigo-950/15 focus:border-sapphire-600 focus:ring-2 focus:ring-sapphire-600/20 rounded-xl pl-10 pr-11 py-2.5 text-xs text-indigo-950 placeholder-indigo-900/40 focus:outline-none transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-indigo-900/40 hover:text-indigo-950 transition-colors cursor-pointer"
                  >
                    {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-indigo-950 block">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-indigo-900/40">
                    <Check size={16} />
                  </div>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password to confirm"
                    className="w-full bg-azure-50/60 border border-indigo-950/15 focus:border-sapphire-600 focus:ring-2 focus:ring-sapphire-600/20 rounded-xl pl-10 pr-11 py-2.5 text-xs text-indigo-950 placeholder-indigo-900/40 focus:outline-none transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-indigo-900/40 hover:text-indigo-950 transition-colors cursor-pointer"
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sapphire-600 to-indigo-700 hover:from-sapphire-500 hover:to-indigo-600 text-white py-3 px-4 rounded-xl font-black text-xs shadow-lg shadow-sapphire-600/25 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      <span>Save & Activate New Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
