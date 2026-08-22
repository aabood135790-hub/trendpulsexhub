import { Gamepad2, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NewsletterForm } from '../newsletter/NewsletterForm';

export function Footer() {
  return (
    <footer className="w-full border-t border-indigo-950/10 bg-white pt-12 pb-24 md:pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 'Stay Updated' Newsletter Signup Section */}
        <div className="mb-14 relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 p-6 sm:p-10 text-white shadow-2xl border border-white/10">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-64 w-64 rounded-full bg-sapphire-600/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-sky-300 text-xs font-black uppercase tracking-wider font-mono">
                <Sparkles size={13} className="text-yellow-400" /> Free Daily Game Code Drops
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Stay Ahead of The Meta. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sapphire-300">
                  Never Miss a Secret Code.
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed font-medium">
                Subscribe to our newsletter to receive instantaneous alerts for newly released Roblox promo codes, Genshin Primogems, tier list updates, and verified speedrun glitches.
              </p>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-slate-950/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/10 shadow-inner">
                <NewsletterForm variant="footer" />
              </div>
            </div>
          </div>
        </div>

        {/* Directory Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 group mb-4 inline-flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sapphire-600 text-white shadow-md shadow-sapphire-600/20">
                <Gamepad2 size={20} className="stroke-[2.5]" />
              </div>
              <span className="text-xl font-black tracking-tight text-indigo-950 flex items-center">
                Trend<span className="text-sapphire-600">Pulse</span><span className="text-sky-500">X</span><span className="text-emerald-600 font-extrabold ml-0.5">hub</span>
              </span>
            </Link>
            <p className="text-indigo-900/60 text-xs sm:text-sm font-medium leading-relaxed">
              Your daily verified source for gaming promo codes, rewards, community strategies, and curated guides on <strong>TrendPulseXhub.com</strong>.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-950 mb-4 font-mono">Explore Hub</h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-xs sm:text-sm font-medium text-indigo-900/70 hover:text-sapphire-600 transition-colors">Home & Trending</Link></li>
              <li><Link to="/codes" className="text-xs sm:text-sm font-medium text-indigo-900/70 hover:text-sapphire-600 transition-colors">Active Promo Codes</Link></li>
              <li><Link to="/community" className="text-xs sm:text-sm font-medium text-indigo-900/70 hover:text-sapphire-600 transition-colors">Community Feed</Link></li>
              <li><Link to="/news" className="text-xs sm:text-sm font-medium text-indigo-900/70 hover:text-sapphire-600 transition-colors">Gaming News & Updates</Link></li>
              <li><Link to="/mods" className="text-xs sm:text-sm font-medium text-indigo-900/70 hover:text-sapphire-600 transition-colors">Mods & Downloads</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-950 mb-4 font-mono">Game Categories</h4>
            <ul className="space-y-2.5">
              <li><Link to="/codes?game=Roblox" className="text-xs sm:text-sm font-medium text-indigo-900/70 hover:text-sapphire-600 transition-colors">Roblox Codes</Link></li>
              <li><Link to="/codes?game=Genshin+Impact" className="text-xs sm:text-sm font-medium text-indigo-900/70 hover:text-sapphire-600 transition-colors">Genshin Impact</Link></li>
              <li><Link to="/codes?game=Blox+Fruits" className="text-xs sm:text-sm font-medium text-indigo-900/70 hover:text-sapphire-600 transition-colors">Blox Fruits Awakenings</Link></li>
              <li><Link to="/codes?game=Minecraft" className="text-xs sm:text-sm font-medium text-indigo-900/70 hover:text-sapphire-600 transition-colors">Minecraft Seeds & Mods</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-950 mb-4 font-mono">Legal & Support</h4>
            <ul className="space-y-2.5">
              <li><Link to="/privacy" className="text-xs sm:text-sm font-medium text-indigo-900/70 hover:text-sapphire-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-xs sm:text-sm font-medium text-indigo-900/70 hover:text-sapphire-600 transition-colors">Terms of Service</Link></li>
              <li><Link to="/contact" className="text-xs sm:text-sm font-medium text-indigo-900/70 hover:text-sapphire-600 transition-colors">Contact Support</Link></li>
              <li><Link to="/admin" className="text-xs sm:text-sm font-medium text-indigo-900/40 hover:text-indigo-900 transition-colors">Admin Gateway</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-indigo-950/5 pt-8">
          <p className="text-xs font-semibold text-indigo-900/50 mb-4 md:mb-0">
            © {new Date().getFullYear()} TrendPulseXhub.com. All rights reserved.
          </p>
          <p className="text-xs font-semibold text-indigo-900/50 flex items-center gap-1">
            Built with <Heart size={14} className="text-sapphire-600" /> for gamers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
