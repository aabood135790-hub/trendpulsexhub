import React, { useEffect, useRef } from 'react';
import { ExternalLink, Sparkles, Megaphone, ShieldCheck, Zap } from 'lucide-react';
import { useAds } from '../../context/AdContext';
import { AdSlotId } from '../../lib/adConfig';
import { useRewardModal } from '../../context/RewardModalContext';

interface UniversalAdSlotProps {
  slotId: AdSlotId;
  className?: string;
  customTitle?: string;
  dense?: boolean;
}

export function UniversalAdSlot({
  slotId,
  className = '',
  customTitle,
  dense = false,
}: UniversalAdSlotProps) {
  const { adSettings, getSlotConfig, activeDirectLink } = useAds();
  const { triggerRewardFlow } = useRewardModal();
  const scriptContainerRef = useRef<HTMLDivElement>(null);

  const slot = getSlotConfig(slotId);

  // Global toggle or slot toggle disabled
  if (!adSettings.global_ads_enabled || !slot || !slot.enabled) {
    return null;
  }

  const destinationUrl = (slot.target_url && slot.target_url.trim() !== '') 
    ? slot.target_url 
    : activeDirectLink;

  // Derive effective Adsterra banner script (from slot specific or global 4-format Adsterra banner field)
  const effectiveScript = (slot.html_script && slot.html_script.trim() !== '') 
    ? slot.html_script 
    : (adSettings.adsterra_banner_script && adSettings.adsterra_banner_script.trim() !== '') 
      ? adSettings.adsterra_banner_script 
      : '';

  // Handle dynamic Adsterra / custom HTML/JS scripts execution
  useEffect(() => {
    if (!effectiveScript || effectiveScript.trim() === '' || !scriptContainerRef.current) return;

    const container = scriptContainerRef.current;
    container.innerHTML = '';

    // Create an iframe to safely and completely isolate ad network scripts and document.write calls
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.scrolling = 'no';
    
    // Set initial minimum height based on size label
    let minH = '90px';
    if (slot.size_label.includes('250') || slot.size_label.includes('280') || slot.size_label.includes('600')) {
      minH = '250px';
    } else if (slot.size_label.includes('50')) {
      minH = '60px';
    }
    iframe.style.minHeight = minH;

    container.appendChild(iframe);

    try {
      const doc = iframe.contentWindow?.document || iframe.contentDocument;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <base target="_blank" />
              <style>
                body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; font-family: system-ui, sans-serif; }
              </style>
            </head>
            <body>
              ${effectiveScript}
            </body>
          </html>
        `);
        doc.close();

        // Auto-adjust iframe height after content loads
        iframe.onload = () => {
          try {
            const h = doc.body?.scrollHeight || doc.documentElement?.scrollHeight;
            if (h && h > 30) {
              iframe.style.height = `${h + 10}px`;
            }
          } catch {}
        };
      }
    } catch (err) {
      console.warn('Ad script sandbox render notice:', err);
    }

    return () => {
      if (container) container.innerHTML = '';
    };
  }, [effectiveScript, slot.size_label]);

  const handleBannerClick = (e: React.MouseEvent) => {
    if (destinationUrl && destinationUrl !== '#') {
      e.preventDefault();
      triggerRewardFlow({
        adUrl: destinationUrl,
        rewardTitle: slot.alt_text || 'Sponsored Partner Reward',
        creditBonus: 25,
      });
    }
  };

  // Case 1: Custom HTML / JS Script Ad (Adsterra Banner Code Tag)
  if (effectiveScript && effectiveScript.trim().length > 0) {
    return (
      <div 
        id={`ad-slot-${slotId}`}
        className={`w-full my-4 flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-white/80 border border-indigo-950/10 p-2.5 shadow-2xs ${className}`}
      >
        <div className="flex items-center justify-between w-full px-2 mb-1.5 text-[10px] font-black uppercase tracking-wider text-indigo-950/40">
          <span className="flex items-center gap-1">
            <Megaphone size={10} className="text-sapphire-600" />
            <span>Adsterra Banner Placement</span>
          </span>
          <span className="font-mono text-[9px] bg-slate-100 px-1.5 py-0.5 rounded">{slot.size_label}</span>
        </div>
        <div ref={scriptContainerRef} className="w-full flex justify-center items-center" />
      </div>
    );
  }

  // Case 2: Custom Banner Image URL with Destination Direct Link
  if (slot.banner_image_url && slot.banner_image_url.trim().length > 0) {
    return (
      <div 
        id={`ad-slot-${slotId}`}
        className={`w-full my-4 flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-white border border-indigo-950/10 shadow-sm group ${className}`}
      >
        <div className="flex items-center justify-between w-full px-3 py-1.5 bg-azure-50/80 border-b border-indigo-950/5 text-[10px] font-black uppercase tracking-wider text-indigo-950/40">
          <span className="flex items-center gap-1">
            <Megaphone size={10} className="text-sapphire-600" />
            <span>Sponsored Link</span>
          </span>
          <span className="text-sapphire-600 flex items-center gap-0.5 font-bold">
            Visit Partner <ExternalLink size={9} />
          </span>
        </div>
        <a
          href={destinationUrl || '#'}
          onClick={handleBannerClick}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="relative block w-full overflow-hidden transition-transform duration-300 group-hover:scale-[1.005]"
        >
          <img
            src={slot.banner_image_url}
            alt={slot.alt_text || 'Sponsored advertisement'}
            referrerPolicy="no-referrer"
            className="w-full h-auto object-cover max-h-72"
          />
        </a>
      </div>
    );
  }

  // Case 3: Dynamic High-CTR Adsterra Bonus & Reward Banner Placement
  const isHeader = slotId === 'header_banner';
  const isSidebar = slotId.startsWith('sidebar');
  const isFooter = slotId === 'footer_banner';
  const isDirectoryTop = slotId === 'codes_directory_top' || slotId === 'news_feed_banner' || slotId === 'search_page_banner';

  return (
    <div
      id={`ad-slot-${slotId}`}
      onClick={handleBannerClick}
      className={`relative w-full overflow-hidden rounded-2xl border transition-all cursor-pointer group select-none ${
        isHeader 
          ? 'my-2 bg-gradient-to-r from-sapphire-900 via-indigo-950 to-sapphire-900 border-sapphire-400/20 text-white shadow-md' 
          : isDirectoryTop
          ? 'my-4 bg-gradient-to-r from-indigo-950 via-sapphire-950 to-indigo-950 border-sapphire-400/30 text-white shadow-lg'
          : isSidebar
          ? 'my-3 bg-gradient-to-br from-azure-50 via-white to-azure-100/60 border-sapphire-300/40 text-indigo-950 shadow-2xs hover:border-sapphire-500'
          : isFooter
          ? 'my-4 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-indigo-900/60 text-white shadow-lg'
          : 'my-4 bg-gradient-to-r from-azure-50/90 via-white to-azure-50/90 border-indigo-950/10 text-indigo-950 shadow-xs hover:border-sapphire-400'
      } ${className}`}
    >
      {/* Decorative ambient background */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 h-32 w-32 rounded-full bg-sky-400/10 blur-2xl pointer-events-none" />

      {/* Top micro badge */}
      <div className="flex items-center justify-between px-3.5 pt-2 text-[10px] font-black uppercase tracking-wider opacity-60">
        <span className="flex items-center gap-1">
          <Megaphone size={10} />
          <span>Sponsored Advertisement</span>
        </span>
        <span className="font-mono text-[9px] bg-black/10 px-1.5 py-0.5 rounded">
          {slot.network_type} • {slot.size_label.split(' ')[0]}
        </span>
      </div>

      {/* Main Content Area */}
      <div className={`p-3.5 sm:p-4 flex ${isSidebar ? 'flex-col items-center text-center' : 'flex-col sm:flex-row items-center justify-between'} gap-3`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black shadow-xs ${
            isHeader || isFooter || isDirectoryTop
              ? 'bg-sky-400 text-indigo-950' 
              : 'bg-gradient-to-tr from-sapphire-600 to-sky-400 text-white'
          }`}>
            <Zap size={20} className="stroke-[2.5]" />
          </div>

          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-black truncate tracking-tight">
              {customTitle || slot.alt_text || 'Unlock Exclusive Gaming Bonuses & Reward Drops'}
            </h4>
            <p className={`text-[11px] font-medium truncate ${isHeader || isFooter || isDirectoryTop ? 'text-azure-100/70' : 'text-indigo-900/60'}`}>
              {isSidebar ? 'Claim free diamonds, primogems & verified codes' : 'Click to visit sponsor & claim +25 bonus wallet credits'}
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="shrink-0 w-full sm:w-auto">
          <div className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black shadow-sm transition-transform group-hover:scale-105 ${
            isHeader || isFooter || isDirectoryTop
              ? 'bg-sky-400 hover:bg-sky-300 text-indigo-950'
              : 'bg-sapphire-600 hover:bg-sapphire-500 text-white'
          }`}>
            <span>CLAIM REWARD</span>
            <ExternalLink size={12} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </div>
  );
}
