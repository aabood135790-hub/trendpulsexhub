import { useEffect, useRef } from 'react';
import { useAds } from '../../context/AdContext';

/**
 * AdsterraScriptManager
 * 
 * Manages the global background Adsterra ad scripts:
 * 3. Popunder Script -> dynamically injected into document.head to trigger across all routes.
 * 4. Social Bar Script -> dynamically embedded into the AppLayout container / body for floating notification ads site-wide.
 */
export function AdsterraScriptManager() {
  const { adSettings } = useAds();
  const popunderCleanupsRef = useRef<(() => void)[]>([]);
  const socialBarCleanupsRef = useRef<(() => void)[]>([]);

  // Helper to inject arbitrary script HTML/tags safely into a target DOM node
  const injectScriptSnippet = (
    snippet: string | undefined, 
    targetContainer: HTMLElement, 
    sourceId: string
  ): (() => void) => {
    if (!snippet || !snippet.trim() || !adSettings.global_ads_enabled) {
      return () => {};
    }

    const cleanups: (() => void)[] = [];
    const container = document.createElement('div');
    container.id = `adsterra-container-${sourceId}`;
    container.style.display = 'none';
    targetContainer.appendChild(container);
    cleanups.push(() => {
      try {
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
      } catch {}
    });

    // Check if snippet contains <script> tags or is raw JS / URL
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = snippet.trim();
    const scriptElements = tempDiv.querySelectorAll('script');

    if (scriptElements.length > 0) {
      // It has <script> tags
      scriptElements.forEach((originalScript, index) => {
        const newScript = document.createElement('script');
        newScript.id = `${sourceId}-script-${index}`;
        newScript.type = originalScript.type || 'text/javascript';

        // Copy all attributes (src, async, defer, data-*, etc.)
        Array.from(originalScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });

        // Copy inline JS code if any
        if (originalScript.innerHTML) {
          newScript.textContent = originalScript.innerHTML;
        }

        try {
          container.appendChild(newScript);
          cleanups.push(() => {
            try {
              if (newScript.parentNode) {
                newScript.parentNode.removeChild(newScript);
              }
            } catch {}
          });
        } catch (err) {
          console.warn(`[Adsterra ${sourceId}] script injection notice:`, err);
        }
      });
    } else {
      // Raw JS code or script URL
      const trimmed = snippet.trim();
      const newScript = document.createElement('script');
      newScript.id = `${sourceId}-script-raw`;
      newScript.type = 'text/javascript';

      if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('//')) {
        newScript.src = trimmed;
        newScript.async = true;
      } else {
        newScript.textContent = trimmed;
      }

      try {
        container.appendChild(newScript);
        cleanups.push(() => {
          try {
            if (newScript.parentNode) {
              newScript.parentNode.removeChild(newScript);
            }
          } catch {}
        });
      } catch (err) {
        console.warn(`[Adsterra ${sourceId}] raw script injection notice:`, err);
      }
    }

    return () => {
      cleanups.forEach((fn) => {
        try { fn(); } catch {}
      });
    };
  };

  // 3. Popunder Script: Embed globally in root layout / HTML <head> to trigger across all routes
  useEffect(() => {
    // Cleanup previous popunder scripts
    popunderCleanupsRef.current.forEach((fn) => fn());
    popunderCleanupsRef.current = [];

    if (adSettings.global_ads_enabled && adSettings.adsterra_popunder_script) {
      const cleanup = injectScriptSnippet(
        adSettings.adsterra_popunder_script, 
        document.head, 
        'popunder'
      );
      popunderCleanupsRef.current.push(cleanup);
    }

    return () => {
      popunderCleanupsRef.current.forEach((fn) => fn());
      popunderCleanupsRef.current = [];
    };
  }, [adSettings.global_ads_enabled, adSettings.adsterra_popunder_script]);

  // 4. Social Bar Script: Embed into AppLayout container / body for floating/interactive notification ads site-wide
  useEffect(() => {
    // Cleanup previous social bar scripts
    socialBarCleanupsRef.current.forEach((fn) => fn());
    socialBarCleanupsRef.current = [];

    if (adSettings.global_ads_enabled && adSettings.adsterra_social_bar_script) {
      const appContainer = document.getElementById('root') || document.body;
      const cleanup = injectScriptSnippet(
        adSettings.adsterra_social_bar_script, 
        appContainer, 
        'social-bar'
      );
      socialBarCleanupsRef.current.push(cleanup);
    }

    return () => {
      socialBarCleanupsRef.current.forEach((fn) => fn());
      socialBarCleanupsRef.current = [];
    };
  }, [adSettings.global_ads_enabled, adSettings.adsterra_social_bar_script]);

  return null;
}
