import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';
import { EditProfileModal } from '../profile/EditProfileModal';
import { AuthModal } from '../auth/AuthModal';
import { UniversalAdSlot } from '../ads/UniversalAdSlot';

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-azure-50/20">
      <Navbar />
      
      {/* Top Header / Navigation Leaderboard Ad Banner (All Pages) */}
      <div className="w-full bg-white/60 border-b border-indigo-950/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <UniversalAdSlot slotId="header_banner" />
        </div>
      </div>

      <main className="flex-1 flex flex-col relative w-full overflow-x-hidden">
        <Outlet />
      </main>

      {/* Persistent Footer Ad Slot */}
      <div className="w-full bg-white/40 border-t border-indigo-950/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <UniversalAdSlot slotId="footer_banner" />
        </div>
      </div>

      <Footer />
      <MobileBottomNav />
      <EditProfileModal />
      <AuthModal />
    </div>
  );
}

