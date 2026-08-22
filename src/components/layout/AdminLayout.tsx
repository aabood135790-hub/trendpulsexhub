import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Plus, ShieldCheck, User, Sparkles, KeyRound, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';
import { AdminAuthGuard } from '../admin/AdminAuthGuard';
import { setAdminAuthenticated } from '../../lib/adminAuth';

export function AdminLayout() {
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    setAdminAuthenticated(false);
    window.location.reload();
  };

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-azure-50 flex flex-col md:flex-row">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 flex-col bg-indigo-950 text-white fixed inset-y-0 z-50 shadow-2xl">
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
            <span className="font-black tracking-tight text-lg">
              TrendPulseX <span className="text-sky-400">Admin</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-mono font-bold">
              LIVE
            </span>
          </div>

          <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
            <NavLink 
              to="/admin" 
              end 
              className={({isActive}) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-xs", 
                isActive ? "bg-sapphire-600 text-white shadow-md shadow-sapphire-600/30" : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <LayoutDashboard size={18} /> Control Center
            </NavLink>

            <NavLink 
              to="/admin/new" 
              className={({isActive}) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-xs", 
                isActive ? "bg-sapphire-600 text-white shadow-md shadow-sapphire-600/30" : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <Plus size={18} /> New Code / Post
            </NavLink>

            <div className="pt-4 pb-2 px-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-white/40">Quick Navigation</span>
            </div>

            <Link
              to="/codes"
              target="_blank"
              className="flex items-center justify-between px-4 py-2.5 rounded-xl font-medium text-xs text-white/60 hover:bg-white/5 hover:text-white transition-colors"
            >
              <span>Codes Directory</span>
              <ExternalLink size={14} className="opacity-50" />
            </Link>

            <Link
              to="/community"
              target="_blank"
              className="flex items-center justify-between px-4 py-2.5 rounded-xl font-medium text-xs text-white/60 hover:bg-white/5 hover:text-white transition-colors"
            >
              <span>Community Feed</span>
              <ExternalLink size={14} className="opacity-50" />
            </Link>
          </div>

          {/* Sidebar Footer with Logout & Exit */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <button 
              onClick={handleAdminLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-xs text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 transition-all cursor-pointer"
            >
              <LogOut size={16} /> Logout Admin Session
            </button>

            <Link 
              to="/" 
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium text-[11px] text-white/50 hover:bg-white/5 hover:text-white transition-colors"
            >
              Return to Website
            </Link>
          </div>
        </aside>

        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-50 bg-indigo-950 text-white flex items-center justify-between px-4 h-16 shadow-md border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-sky-400" />
            <span className="font-black tracking-tight text-base">TrendPulseX <span className="text-sky-400">Admin</span></span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleAdminLogout}
              className="p-2 text-rose-300 hover:text-rose-100 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              title="Logout Admin Session"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-4 md:p-8 w-full max-w-[100vw] overflow-x-hidden pb-24 md:pb-8">
          <Outlet />
        </main>

        {/* Mobile Bottom Admin Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-indigo-950 text-white flex items-center justify-around h-16 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.1)] border-t border-white/10">
          <NavLink to="/admin" end className={({isActive}) => cn("flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors", isActive ? "text-sky-400" : "text-white/50 hover:text-white")}>
            <LayoutDashboard size={18} />
            <span className="text-[10px] font-bold">Dashboard</span>
          </NavLink>
          <NavLink to="/admin/new" className={({isActive}) => cn("flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors", isActive ? "text-sky-400" : "text-white/50 hover:text-white")}>
            <Plus size={18} />
            <span className="text-[10px] font-bold">New Post</span>
          </NavLink>
          <button 
            onClick={handleAdminLogout}
            className="flex flex-col items-center justify-center w-full h-full space-y-1 text-rose-400 hover:text-rose-200 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-[10px] font-bold">Logout</span>
          </button>
        </nav>
      </div>
    </AdminAuthGuard>
  );
}
