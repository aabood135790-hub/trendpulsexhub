import { Outlet, NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, LogOut, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-azure-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-indigo-950 text-white fixed inset-y-0 z-50">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <span className="font-black tracking-tight text-lg">TrendPulseX <span className="text-sky-400">Admin</span></span>
        </div>
        <div className="flex-1 py-6 px-4 space-y-2">
          <NavLink to="/admin" end className={({isActive}) => cn("flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors", isActive ? "bg-sapphire-600 text-white" : "text-white/60 hover:bg-white/5 hover:text-white")}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/admin/new" className={({isActive}) => cn("flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors", isActive ? "bg-sapphire-600 text-white" : "text-white/60 hover:bg-white/5 hover:text-white")}>
            <Plus size={20} /> New Post
          </NavLink>
        </div>
        <div className="p-4 border-t border-white/10">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-white/60 hover:bg-white/5 hover:text-white transition-colors">
            <LogOut size={20} /> Exit Admin
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 bg-indigo-950 text-white flex items-center justify-between px-4 h-16 shadow-md">
        <span className="font-black tracking-tight text-lg">TrendPulseX <span className="text-sky-400">Admin</span></span>
        <Link to="/" className="text-white/60 hover:text-white"><LogOut size={20} /></Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 w-full max-w-[100vw] overflow-x-hidden pb-24 md:pb-8">
        <Outlet />
      </main>

      {/* Mobile Bottom Admin Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-indigo-950 text-white flex items-center justify-around h-16 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.1)] border-t border-white/10">
        <NavLink to="/admin" end className={({isActive}) => cn("flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors", isActive ? "text-sky-400" : "text-white/50 hover:text-white")}>
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-bold">Dashboard</span>
        </NavLink>
        <NavLink to="/admin/new" className={({isActive}) => cn("flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors", isActive ? "text-sky-400" : "text-white/50 hover:text-white")}>
          <Plus size={20} />
          <span className="text-[10px] font-bold">New Post</span>
        </NavLink>
      </nav>
    </div>
  );
}
