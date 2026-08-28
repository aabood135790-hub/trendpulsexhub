import { Gamepad2, Users, Shield, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="w-full border-t border-[#160B2E] bg-[#090514] pt-12 pb-24 md:pb-10 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="flex items-center gap-2.5 group inline-flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#A855F7] text-white shadow-lg shadow-[#A855F7]/30 border border-[#C084FC]/30">
                <Gamepad2 size={20} className="stroke-[2.5]" />
              </div>
              <span className="text-xl font-black tracking-tight text-white flex items-center">
                Trend<span className="text-[#C084FC]">Pulse</span><span className="text-[#FBBF24] font-extrabold ml-0.5">X</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed max-w-md">
              The premier 2D online multiplayer browser game & player community. Real-time exploration, elemental races, safe zones, character progression, and open-world battles.
            </p>
          </div>
          
          {/* Platform Sections */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-4 font-mono flex items-center gap-1.5">
              <span>Platform</span>
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/game" className="text-slate-300 hover:text-[#C084FC] transition-colors flex items-center gap-1.5">
                  <Gamepad2 size={14} className="text-[#C084FC]" />
                  <span>Game Overview</span>
                </Link>
              </li>
              <li>
                <Link to="/game/play" className="text-[#FBBF24] hover:text-amber-300 font-bold transition-colors flex items-center gap-1.5">
                  <span>⚡ Play Online (2D)</span>
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-slate-300 hover:text-[#C084FC] transition-colors flex items-center gap-1.5">
                  <Users size={14} className="text-[#C084FC]" />
                  <span>Player Community</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Admin */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-4 font-mono">
              Information & Support
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/privacy" className="text-slate-400 hover:text-slate-200 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-400 hover:text-slate-200 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-slate-200 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-slate-600 hover:text-[#C084FC] transition-colors flex items-center gap-1">
                  <Shield size={12} />
                  <span>Admin Gateway</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-[#160B2E] pt-6 text-xs text-slate-500">
          <p className="mb-3 md:mb-0">
            © {new Date().getFullYear()} TrendPulseX. All rights reserved. English interface edition.
          </p>
          <p className="flex items-center gap-1.5">
            Crafted for online players worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
