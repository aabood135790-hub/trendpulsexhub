import { Gamepad2, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="w-full border-t border-indigo-950/10 bg-white pt-16 pb-24 md:pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 group mb-4 inline-flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sapphire-600 text-white shadow-md shadow-sapphire-600/20">
                <Gamepad2 size={20} className="stroke-[2.5]" />
              </div>
              <span className="text-xl font-black tracking-tight text-indigo-950 flex items-center">
                Trend<span className="text-sapphire-600">Pulse</span><span className="text-sky-500">X</span><span className="text-emerald-600 font-extrabold ml-0.5">hub</span>
              </span>
            </Link>
            <p className="text-indigo-900/60 max-w-xs text-sm font-medium leading-relaxed">
              Your daily verified source for gaming promo codes, rewards, news, and curated mods on <strong>TrendPulseXhub.com</strong>.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-indigo-950 mb-4">Explore</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-sm font-medium text-indigo-900/70 hover:text-sapphire-600 transition-colors">Home</Link></li>
              <li><Link to="/codes" className="text-sm font-medium text-indigo-900/70 hover:text-sapphire-600 transition-colors">Active Codes</Link></li>
              <li><Link to="/news" className="text-sm font-medium text-indigo-900/70 hover:text-sapphire-600 transition-colors">Gaming News</Link></li>
              <li><Link to="/mods" className="text-sm font-medium text-indigo-900/70 hover:text-sapphire-600 transition-colors">Mods & Downloads</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-indigo-950 mb-4">Legal & Support</h4>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-sm font-medium text-indigo-900/70 hover:text-sapphire-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm font-medium text-indigo-900/70 hover:text-sapphire-600 transition-colors">Terms of Service</Link></li>
              <li><Link to="/contact" className="text-sm font-medium text-indigo-900/70 hover:text-sapphire-600 transition-colors">Contact Us</Link></li>
              <li><Link to="/admin" className="text-sm font-medium text-indigo-900/40 hover:text-indigo-900 transition-colors">Admin Area</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-indigo-950/5 pt-8">
          <p className="text-xs font-semibold text-indigo-900/50 mb-4 md:mb-0">
            © {new Date().getFullYear()} TrendPulseXhub.com. All rights reserved.
          </p>
          <p className="text-xs font-semibold text-indigo-900/50 flex items-center gap-1">
            Built with <Heart size={14} className="text-sapphire-600" /> for gamers
          </p>
        </div>
      </div>
    </footer>
  );
}
