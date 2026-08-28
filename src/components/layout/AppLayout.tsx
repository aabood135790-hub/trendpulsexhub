import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';
import { EditProfileModal } from '../profile/EditProfileModal';
import { AuthModal } from '../auth/AuthModal';
import { UniversalAdSlot } from '../ads/UniversalAdSlot';
import { AdsterraScriptManager } from '../ads/AdsterraScriptManager';
import { trackPageView } from '../../lib/analytics';

export function AppLayout() {
  const location = useLocation();
  const isGameplay = location.pathname.startsWith('/game/play');

  useEffect(() => {
    trackPageView(location.pathname + location.search, document.title);
  }, [location.pathname, location.search]);

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F7FA] text-slate-900 selection:bg-[#A855F7] selection:text-white">
      {/* Global Ad Manager (Non-intrusive) */}
      <AdsterraScriptManager />

      {/* Main Navbar (Deep Dark Purple) */}
      <Navbar />
      
      {/* Top Banner (hidden on live gameplay screen) */}
      {!isGameplay && (
        <div className="w-full bg-[#F1EFF5] border-b border-[#E5E2EC]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <UniversalAdSlot slotId="header_banner" />
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col relative w-full overflow-x-hidden">
        <Outlet />
      </main>

      {/* Footer Banner (hidden on live gameplay screen) */}
      {!isGameplay && (
        <div className="w-full bg-[#F1EFF5] border-t border-[#E5E2EC]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <UniversalAdSlot slotId="footer_banner" />
          </div>
        </div>
      )}

      {!isGameplay && <Footer />}
      <MobileBottomNav />
      <EditProfileModal />
      <AuthModal />
    </div>
  );
}

