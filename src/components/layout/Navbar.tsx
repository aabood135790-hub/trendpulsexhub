import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Gamepad2, Users, Coins, Sparkles, User, Play } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { WalletModal } from '../wallet/WalletModal';

const navItems = [
  { name: 'Game', path: '/game', icon: Gamepad2, badge: 'Live 2D' },
  { name: 'Community', path: '/community', icon: Users, badge: 'Players' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { profile, isAuthenticated, credits, openEditProfile, openWalletModal, openAuthModal } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#160B2E] bg-[#090514]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#A855F7] text-white shadow-lg shadow-[#A855F7]/30 group-hover:bg-[#C084FC] transition-all border border-[#C084FC]/30">
                <Gamepad2 size={20} className="stroke-[2.5]" />
              </div>
              <span className="text-xl font-black tracking-tight text-white flex items-center">
                Trend<span className="text-[#C084FC]">Pulse</span><span className="text-[#FBBF24] font-extrabold ml-0.5">X</span>
              </span>
            </Link>

            {/* Main Navigation (Desktop) - Only Game & Community */}
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "text-sm font-bold transition-all px-3.5 py-2 rounded-xl flex items-center gap-2 relative",
                        isActive
                          ? "text-white bg-[#160B2E] border border-[#A855F7]/40 shadow-inner"
                          : "text-slate-300 hover:text-white hover:bg-[#0E0720]"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon size={16} className={isActive ? 'text-[#C084FC]' : 'text-slate-400'} />
                        <span>{item.name}</span>
                        {item.badge && (
                          <span className={cn(
                            "inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider",
                            item.name === 'Game'
                              ? "bg-[#A855F7]/20 text-[#C084FC] border border-[#A855F7]/30"
                              : "bg-[#160B2E] text-slate-300 border border-slate-700/50"
                          )}>
                            {item.badge}
                          </span>
                        )}
                        {isActive && (
                          <motion.div
                            layoutId="navbar-indicator"
                            className="absolute -bottom-2 left-3 right-3 h-0.5 bg-gradient-to-r from-[#A855F7] to-[#FBBF24] rounded-full"
                            initial={false}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Quick Play CTA */}
            <Link
              to="/game/play"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#A855F7] to-[#9333EA] hover:from-[#C084FC] hover:to-[#A855F7] text-white text-xs font-black shadow-md shadow-[#A855F7]/25 transition-all hover:scale-105 active:scale-95 border border-[#C084FC]/30"
            >
              <Play size={12} className="fill-white" />
              <span>PLAY NOW</span>
            </Link>

            {/* Gold Currency Pill */}
            <button
              onClick={() => isAuthenticated ? openWalletModal() : openAuthModal("signin")}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#160B2E] hover:bg-[#1F0F3D] text-white shadow-xs border border-[#A855F7]/30 transition-all hover:scale-105 active:scale-95 cursor-pointer group"
              title="Gold & Gamer Credits"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FBBF24] text-[#090514] shadow-xs">
                <Coins size={12} className="stroke-[3]" />
              </div>
              <div className="flex items-baseline gap-1 font-mono font-black text-xs sm:text-sm">
                <span className="text-[#FBBF24]">{credits}</span>
                <span className="text-[10px] font-sans font-bold text-slate-300 hidden xs:inline">Gold</span>
              </div>
            </button>

            {/* Profile Avatar Button */}
            <button
              onClick={() => isAuthenticated ? openEditProfile() : openAuthModal('signin')}
              className="flex items-center gap-2 p-1 pl-1.5 sm:pr-3 rounded-full bg-[#160B2E] hover:bg-[#1F0F3D] border border-[#A855F7]/30 shadow-xs transition-all cursor-pointer group"
              title={isAuthenticated ? "Edit Player Profile" : "Sign In to Account"}
            >
              <div className="h-7 w-7 rounded-full overflow-hidden border border-[#A855F7]/50 bg-[#0E0720] shrink-0">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.username}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-[#0E0720] text-[#C084FC] font-black text-xs">
                    {isAuthenticated ? (profile?.display_name?.charAt(0) || 'P') : <User size={13} />}
                  </div>
                )}
              </div>
              <div className="hidden sm:flex flex-col items-start leading-tight text-left">
                <span className="text-[11px] font-black text-white max-w-[100px] truncate group-hover:text-[#C084FC] transition-colors">
                  {isAuthenticated ? (profile?.username ? `@${profile.username}` : 'Player') : 'Guest'}
                </span>
                <span className="text-[9px] font-semibold text-slate-400">
                  {isAuthenticated ? 'Account' : 'Sign In'}
                </span>
              </div>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              className="md:hidden flex items-center justify-center h-10 w-10 text-slate-200 hover:text-white"
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
            className="fixed inset-x-0 top-16 z-40 bg-[#0E0720]/95 backdrop-blur-xl border-b border-[#160B2E] shadow-2xl md:hidden"
          >
            <div className="flex flex-col p-4 space-y-2.5">
              
              {/* Play Now Banner */}
              <Link
                to="/game/play"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-[#A855F7] to-[#7C3AED] text-white shadow-lg border border-[#C084FC]/40 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center font-black">
                    <Play size={20} className="fill-white" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-purple-200 block uppercase tracking-wider">
                      Online Multiplayer
                    </span>
                    <span className="text-base font-black text-white font-mono">
                      ENTER THE WORLD
                    </span>
                  </div>
                </div>
                <span className="text-xs font-black text-[#090514] bg-[#FBBF24] px-3 py-1.5 rounded-xl shadow-xs">
                  PLAY NOW
                </span>
              </Link>

              {/* Navigation Items */}
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all",
                        isActive ? "bg-[#160B2E] text-white border border-[#A855F7]/40" : "text-slate-300 hover:bg-[#160B2E]/60"
                      )
                    }
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={18} className="text-[#C084FC]" />
                      <span>{item.name}</span>
                    </span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#090514] text-[#C084FC] border border-[#160B2E]">
                      {item.badge}
                    </span>
                  </NavLink>
                );
              })}

              {/* Account Controls in Mobile Menu */}
              <div 
                onClick={() => {
                  setMobileMenuOpen(false);
                  isAuthenticated ? openEditProfile() : openAuthModal("signin");
                }}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#160B2E] border border-[#1F0F3D] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden border border-[#A855F7]/50 bg-[#0E0720] shrink-0 flex items-center justify-center">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt={profile.username} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="font-bold text-[#C084FC]">
                        {profile?.display_name?.charAt(0) || 'P'}
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-black text-white block leading-tight">
                      {profile?.display_name || 'Player Account'}
                    </span>
                    <span className="text-xs font-bold text-[#C084FC]">
                      {isAuthenticated ? `@${profile?.username || 'user'}` : 'Click to Sign In'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-200 bg-[#090514] px-2.5 py-1 rounded-lg border border-[#160B2E]">
                  {isAuthenticated ? 'Manage' : 'Sign In'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Wallet Modal */}
      <WalletModal />
    </>
  );
}


