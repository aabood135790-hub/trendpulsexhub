import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { 
  AdSettingsState, 
  AdSlotId, 
  AdSlotConfig, 
  DEFAULT_AD_SETTINGS, 
  getLocalAdSettings, 
  saveLocalAdSettings,
  getActiveDirectLink 
} from '../lib/adConfig';

interface AdContextType {
  adSettings: AdSettingsState;
  activeDirectLink: string;
  getSlotConfig: (slotId: AdSlotId) => AdSlotConfig;
  updateSlotConfig: (slotId: AdSlotId, partial: Partial<AdSlotConfig>) => void;
  updateGlobalSettings: (partial: Partial<AdSettingsState>) => void;
  resetToDefaults: () => void;
  applyPreset: (presetType: 'adsterra_high_cpm' | 'adsterra_native_banners' | 'clean_monetization') => void;
}

const AdContext = createContext<AdContextType | undefined>(undefined);

export function AdProvider({ children }: { children: ReactNode }) {
  const [adSettings, setAdSettings] = useState<AdSettingsState>(() => getLocalAdSettings());

  useEffect(() => {
    // Attempt to sync from backend on initial mount
    async function syncAdSettings() {
      try {
        const res = await fetch('/api/admin/ad-config');
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setAdSettings((prev) => {
              const merged: AdSettingsState = {
                ...prev,
                ...data,
                adsterra_direct_link: data.adsterra_direct_link !== undefined ? data.adsterra_direct_link : prev.adsterra_direct_link,
                vite_adsterra_direct_link: data.vite_adsterra_direct_link !== undefined ? data.vite_adsterra_direct_link : prev.vite_adsterra_direct_link,
                adsterra_banner_script: data.adsterra_banner_script !== undefined ? data.adsterra_banner_script : prev.adsterra_banner_script,
                adsterra_popunder_script: data.adsterra_popunder_script !== undefined ? data.adsterra_popunder_script : prev.adsterra_popunder_script,
                adsterra_social_bar_script: data.adsterra_social_bar_script !== undefined ? data.adsterra_social_bar_script : prev.adsterra_social_bar_script,
                slots: {
                  ...prev.slots,
                  ...(data.slots || {}),
                },
              };
              saveLocalAdSettings(merged);
              return merged;
            });
          }
        }
      } catch {
        // Fallback to local storage
      }
    }
    syncAdSettings();
  }, []);

  const activeDirectLink = useMemo(() => {
    return getActiveDirectLink(adSettings);
  }, [adSettings.adsterra_direct_link, adSettings.vite_adsterra_direct_link]);

  const getSlotConfig = (slotId: AdSlotId): AdSlotConfig => {
    return adSettings.slots[slotId] || DEFAULT_AD_SETTINGS.slots[slotId];
  };

  const updateSlotConfig = (slotId: AdSlotId, partial: Partial<AdSlotConfig>) => {
    setAdSettings((prev) => {
      const updatedSlot: AdSlotConfig = {
        ...(prev.slots[slotId] || DEFAULT_AD_SETTINGS.slots[slotId]),
        ...partial,
      };
      const updated: AdSettingsState = {
        ...prev,
        slots: {
          ...prev.slots,
          [slotId]: updatedSlot,
        },
      };
      saveLocalAdSettings(updated);

      // Async persist to server
      fetch('/api/admin/ad-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      }).catch(() => {});

      return updated;
    });
  };

  const updateGlobalSettings = (partial: Partial<AdSettingsState>) => {
    setAdSettings((prev) => {
      const updated: AdSettingsState = {
        ...prev,
        ...partial,
      };
      saveLocalAdSettings(updated);

      fetch('/api/admin/ad-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      }).catch(() => {});

      return updated;
    });
  };

  const resetToDefaults = () => {
    setAdSettings(DEFAULT_AD_SETTINGS);
    saveLocalAdSettings(DEFAULT_AD_SETTINGS);
    fetch('/api/admin/ad-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(DEFAULT_AD_SETTINGS),
    }).catch(() => {});
  };

  const applyPreset = (presetType: 'adsterra_high_cpm' | 'adsterra_native_banners' | 'clean_monetization') => {
    const directLink = getActiveDirectLink(adSettings);
    let newSlots = { ...adSettings.slots };

    if (presetType === 'adsterra_high_cpm') {
      for (const key of Object.keys(newSlots) as AdSlotId[]) {
        newSlots[key] = {
          ...newSlots[key],
          enabled: true,
          network_type: 'Adsterra',
          target_url: directLink,
        };
      }
    } else if (presetType === 'adsterra_native_banners') {
      for (const key of Object.keys(newSlots) as AdSlotId[]) {
        newSlots[key] = {
          ...newSlots[key],
          enabled: true,
          network_type: 'Adsterra',
          target_url: directLink,
          banner_image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
        };
      }
    } else if (presetType === 'clean_monetization') {
      for (const key of Object.keys(newSlots) as AdSlotId[]) {
        newSlots[key] = {
          ...newSlots[key],
          enabled: ['header_banner', 'codes_directory_top', 'in_article_mid', 'sidebar_article', 'footer_banner'].includes(key),
          target_url: directLink,
        };
      }
    }

    const updated: AdSettingsState = {
      ...adSettings,
      global_ads_enabled: true,
      slots: newSlots,
    };
    setAdSettings(updated);
    saveLocalAdSettings(updated);
    fetch('/api/admin/ad-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(() => {});
  };

  return (
    <AdContext.Provider
      value={{
        adSettings,
        activeDirectLink,
        getSlotConfig,
        updateSlotConfig,
        updateGlobalSettings,
        resetToDefaults,
        applyPreset,
      }}
    >
      {children}
    </AdContext.Provider>
  );
}

export function useAds() {
  const context = useContext(AdContext);
  if (!context) {
    throw new Error('useAds must be used within an AdProvider');
  }
  return context;
}
