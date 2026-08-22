import { NavLink } from 'react-router-dom';
import { Home, Tags, Users, Newspaper, Download, Search } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Codes', path: '/codes', icon: Tags },
  { name: 'Community', path: '/community', icon: Users },
  { name: 'News', path: '/news', icon: Newspaper },
  { name: 'Mods', path: '/mods', icon: Download },
];


export function MobileBottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-indigo-950/10 pb-safe">
      <div className="flex items-center justify-around px-2 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                  isActive ? "text-sapphire-600" : "text-indigo-900/50 hover:text-indigo-900"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className={cn("flex items-center justify-center p-1 rounded-full transition-all", isActive ? "bg-sapphire-50" : "")}>
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className="text-[10px] font-semibold tracking-wide">
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
