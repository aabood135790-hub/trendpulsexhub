import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Search, Menu, X, Gamepad2, User, Users, Coins, Sparkles, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { WalletModal } from '../wallet/WalletModal';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Codes', path: '/codes' },
  { name: 'Community', path: '/community' },
  { name: 'News', path: '/news' },
  { name: 'Mods', path: '/mods' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { profile, isAuthenticated, credits, openEditProfile, openWalletModal, openAuthModal } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-indigo-950/10 bg-azure-50/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sapphire-600 text-white shadow-md shadow-sapphire-600/20 group-hover:bg-sapphire-500 transition-all">
                <Gamepad2 size={20} className="stroke-[2.5]" />
              </div>
              <span className="text-xl font-black tracking-tight text-indigo-950 flex items-center">
                Trend<span className="text-sapphire-600">Pulse</span><span className="text-sky-500">X</span><span className="text-emerald-600 font-extrabold ml-0.5">hub</span>
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-7">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-bold transition-colors hover:text-sapphire-600 relative py-1 flex items-center gap-1.5",
                    isActive ? "text-sapphire-600" : "text-indigo-900/70"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {item.name === 'Community' && <Users size={14} className={isActive ? 'text-sapphire-600' : 'text-indigo-900/50'} />}
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-sapphire-600 rounded-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link to="/search" className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-xs border border-indigo-950/10 text-indigo-950 hover:bg-azure-100 transition-colors">
              <Search size={18} />
            </Link>

            {/* User Wallet / Credits Button */}
            <button
              onClick={() => isAuthenticated ? openWalletModal() : openAuthModal("signin")}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-gradient-to-r from-sapphire-900 to-indigo-950 text-white hover:from-sapphire-800 hover:to-indigo-900 shadow-sm border border-sapphire-400/30 transition-all hover:scale-105 active:scale-95 cursor-pointer group"
              title="Open Credits Wallet & Daily Claim"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-indigo-950 shadow-xs">
                <Coins size={12} className="stroke-[3]" />
              </div>
              <div className="flex items-baseline gap-1 font-mono font-black text-xs sm:text-sm">
                <span className="text-amber-300">{credits}</span>
                <span className="text-[10px] font-sans font-bold text-azure-200 hidden xs:inline">Credits</span>
              </div>
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-sapphire-600 group-hover:bg-sky-400 group-hover:text-indigo-950 transition-colors text-[10px] font-bold ml-0.5">
                <Plus size={10} strokeWidth={3} />
              </span>
            </button>

            {/* Profile Avatar Button */}
            <button
              onClick={() => isAuthenticated ? openEditProfile() : openAuthModal('signin')}
              className="flex items-center gap-2 p-1 pl-1.5 sm:pr-3 rounded-full bg-white hover:bg-azure-100 border border-indigo-950/10 shadow-xs transition-all cursor-pointer group"
              title={isAuthenticated ? "Edit Gamer Profile & Avatar" : "Log In to Profile"}
            >
              <div className="h-7 w-7 rounded-full overflow-hidden border border-sapphire-600 bg-sapphire-50 shrink-0">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.username}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-sapphire-100 text-sapphire-700 font-black text-xs">
                    {isAuthenticated ? (profile?.display_name?.charAt(0) || 'U') : '?'}
                  </div>
                )}
              </div>
              <div className="hidden sm:flex flex-col items-start leading-tight text-left">
                <span className="text-[11px] font-black text-indigo-950 max-w-[100px] truncate group-hover:text-sapphire-600 transition-colors">
                  {isAuthenticated ? (profile?.username ? `@${profile.username}` : 'Profile') : 'Guest'}
                </span>
                <span className="text-[9px] font-semibold text-sapphire-700">
                  {isAuthenticated ? 'Edit Profile' : 'Log In'}
                </span>
              </div>
            </button>

            {/* Quick Register / Sign Up Button */}
            {(!isAuthenticated) && (
              <button
                onClick={() => openAuthModal('signup')}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sapphire-600 hover:bg-sapphire-500 text-white text-xs font-black shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>Sign Up</span>
              </button>
            )}

            <button
              className="md:hidden flex items-center justify-center h-10 w-10 text-indigo-950"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-16 z-40 bg-white/95 backdrop-blur-xl border-b border-indigo-950/10 shadow-lg md:hidden"
          >
            <div className="flex flex-col p-4 space-y-2">
              {/* Wallet Card in Mobile Menu */}
              <div
                onClick={() => {
                  setMobileMenuOpen(false);
                  isAuthenticated ? openWalletModal() : openAuthModal("signin");
                }}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-sapphire-900 to-indigo-950 text-white shadow-md border border-sapphire-500/30 mb-2 cursor-pointer hover:opacity-95 transition-opacity"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-400 text-indigo-950 flex items-center justify-center font-black shadow-xs">
                    <Coins size={22} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-azure-200 block uppercase tracking-wider">
                      Credits Wallet
                    </span>
                    <span className="text-base font-black text-amber-300 font-mono">
                      {credits} Credits
                    </span>
                  </div>
                </div>
                <span className="text-xs font-black text-indigo-950 bg-sky-400 hover:bg-sky-300 px-3 py-1.5 rounded-xl shadow-xs transition-colors">
                  + Refill / Claim
                </span>
              </div>

              {/* Profile Card in Mobile Menu */}
              <div 
                onClick={() => {
                  setMobileMenuOpen(false);
                  isAuthenticated ? openEditProfile() : openAuthModal("signin");
                }}
                className="flex items-center justify-between p-3 rounded-2xl bg-azure-50 border border-indigo-950/10 mb-2 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-sapphire-600 bg-white shrink-0">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt={profile.username} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center font-bold text-sapphire-700">
                        {profile?.display_name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-black text-indigo-950 block leading-tight">
                      {profile?.display_name || 'Gamer'}
                    </span>
                    <span className="text-xs font-bold text-sapphire-600">
                      @{profile?.username || 'user'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-sapphire-700 bg-white px-2.5 py-1 rounded-lg border border-indigo-950/10">
                  Edit
                </span>
              </div>

              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all",
                      isActive ? "bg-sapphire-50 text-sapphire-700" : "text-indigo-900 hover:bg-azure-50"
                    )
                  }
                >
                  <span className="flex items-center gap-2.5">
                    {item.name === 'Community' && <Users size={18} className="text-sapphire-600" />}
                    {item.name}
                  </span>
                  {item.name === 'Community' && (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-sapphire-600 text-white">
                      Hub
                    </span>
                  )}
                </NavLink>
              ))}
              <Link 
                to="/search"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-4 py-3 rounded-xl font-bold text-indigo-900 hover:bg-azure-50 transition-all gap-3"
              >
                <Search size={20} className="text-sapphire-600" />
                Search
              </Link>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('signup');
                }}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sapphire-600 text-white font-black text-xs shadow-md shadow-sapphire-600/20 cursor-pointer"
              >
                <span>Create Account / Sign Up</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Wallet Modal */}
      <WalletModal />
    </>
  );
}


