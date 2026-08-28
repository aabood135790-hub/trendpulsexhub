import { NavLink } from 'react-router-dom';
import { Gamepad2, Play, Users, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

export function MobileBottomNav() {
  const { isAuthenticated, openEditProfile, openAuthModal } = useAuth();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#090514]/95 backdrop-blur-xl border-t border-[#160B2E] pb-safe shadow-2xl">
      <div className="flex items-center justify-around px-2 h-16 max-w-md mx-auto">
        
        {/* Game Landing */}
        <NavLink
          to="/game"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
              isActive ? "text-[#C084FC] font-bold" : "text-slate-400 hover:text-slate-200"
            )
          }
        >
          {({ isActive }) => (
            <>
              <div className={cn("flex items-center justify-center p-1 rounded-xl transition-all", isActive ? "bg-[#160B2E] text-[#C084FC] border border-[#A855F7]/40" : "")}>
                <Gamepad2 size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-bold tracking-wide">
                Game
              </span>
            </>
          )}
        </NavLink>

        {/* Play Now Center CTA */}
        <NavLink
          to="/game/play"
          className="flex flex-col items-center justify-center -mt-5 group"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#A855F7] to-[#7C3AED] text-white shadow-lg shadow-[#A855F7]/40 border-2 border-[#C084FC]/40 group-active:scale-95 transition-transform">
            <Play size={22} className="fill-white ml-0.5" />
          </div>
          <span className="text-[10px] font-black text-[#FBBF24] uppercase tracking-wider mt-1">
            Play
          </span>
        </NavLink>

        {/* Community */}
        <NavLink
          to="/community"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
              isActive ? "text-[#C084FC] font-bold" : "text-slate-400 hover:text-slate-200"
            )
          }
        >
          {({ isActive }) => (
            <>
              <div className={cn("flex items-center justify-center p-1 rounded-xl transition-all", isActive ? "bg-[#160B2E] text-[#C084FC] border border-[#A855F7]/40" : "")}>
                <Users size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-bold tracking-wide">
                Community
              </span>
            </>
          )}
        </NavLink>

        {/* Account Profile */}
        <button
          type="button"
          onClick={() => isAuthenticated ? openEditProfile() : openAuthModal("signin")}
          className="flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-400 hover:text-slate-200 cursor-pointer"
        >
          <div className="flex items-center justify-center p-1 rounded-xl">
            <User size={20} />
          </div>
          <span className="text-[10px] font-bold tracking-wide">
            {isAuthenticated ? 'Account' : 'Sign In'}
          </span>
        </button>

      </div>
    </nav>
  );
}

