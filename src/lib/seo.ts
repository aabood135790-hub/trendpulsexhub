import { useEffect } from 'react';
import { Post, PostSEO, GlobalSEOSettings } from '../types';
import { getGameRepresentativeImage } from './gameImages';
import { format } from 'date-fns';

export const DEFAULT_SEO_SETTINGS: GlobalSEOSettings = {
  siteName: 'TrendPulseXhub',
  titleSeparator: '|',
  defaultTitleTemplate: '{title} | TrendPulseXhub',
  defaultMetaDescription: 'Discover daily verified working promo codes, free rewards, game updates, and news for Roblox Blox Fruits, Fisch, Blade Ball, and more at TrendPulseXhub.com.',
  defaultKeywords: 'roblox codes, promo codes 2026, working game codes, free rewards, blox fruits codes, fisch codes, blade ball codes, anime defenders codes',
  defaultOgImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&h=630&q=80',
  twitterHandle: '@TrendPulseXhub',
  robotsIndexing: true,
  autoStructuredData: true,
  enableRichSnippets: true,
};

const SEO_STORAGE_KEY = 'trendpulse_global_seo_settings';

export function getStoredSEOSettings(): GlobalSEOSettings {
  try {
    const local = localStorage.getItem(SEO_STORAGE_KEY);
    if (local) {
      return { ...DEFAULT_SEO_SETTINGS, ...JSON.parse(local) };
    }
  } catch {}
  return DEFAULT_SEO_SETTINGS;
}

export function saveStoredSEOSettings(settings: GlobalSEOSettings) {
  try {
    localStorage.setItem(SEO_STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}

/**
 * Automatically generates CTR-optimized meta titles, meta descriptions, and keywords.
 */
export function generateAutomatedPostSEO(post: Partial<Post>): PostSEO {
  const currentMonthYear = format(new Date(), 'MMMM yyyy');
  const gameName = post.codes_data?.[0]?.game || post.title?.split(' ')[0] || 'Roblox';
  const activeCodes = (post.codes_data || []).filter((c) => c.status === 'Active');
  const repImage = getGameRepresentativeImage(post.title || gameName, post.image_url);

  if (post.category === 'Codes') {
    const countText = activeCodes.length > 0 ? `${activeCodes.length} Active Codes` : 'Working Codes';
    
    // Top reward summary
    const rewardHighlights = activeCodes
      .slice(0, 3)
      .map((c) => c.reward.replace(/free|exclusive|\+/gi, '').trim())
      .filter(Boolean)
      .join(', ');
    
    const rewardSnippet = rewardHighlights ? `Claim free ${rewardHighlights}` : 'Claim free gems, EXP boosts, spins & coins';

    const meta_title = `${gameName} Codes (${currentMonthYear}) - ${countText} & Secret Rewards`;
    const meta_description = `Redeem all verified working ${gameName} promo codes for ${currentMonthYear}! ${rewardSnippet} with our 100% tested daily list on TrendPulseXhub.`;
    const meta_keywords = `${gameName.toLowerCase()} codes, ${gameName.toLowerCase()} promo codes ${currentMonthYear.toLowerCase()}, working ${gameName.toLowerCase()} codes, ${gameName.toLowerCase()} free rewards, how to redeem codes in ${gameName.toLowerCase()}`;

    return {
      meta_title,
      meta_description,
      meta_keywords,
      og_image: repImage,
      og_type: 'article',
      no_index: false,
    };
  }

  if (post.category === 'News') {
    const rawContent = post.content_text ? post.content_text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
    const excerpt = rawContent.length > 155 ? `${rawContent.slice(0, 152)}...` : rawContent;
    const meta_description = excerpt || `Get breaking news, secret update leaks, and event reward codes for ${gameName} on TrendPulseXhub.`;
    const meta_title = `${post.title || `${gameName} Update Leak`} | TrendPulseXhub Gaming News`;
    const meta_keywords = `${gameName.toLowerCase()} leak, ${gameName.toLowerCase()} update, roblox gaming news, secret code drops, ${gameName.toLowerCase()} event`;

    return {
      meta_title,
      meta_description,
      meta_keywords,
      og_image: repImage,
      og_type: 'article',
      no_index: false,
    };
  }

  // Mods / Default
  return {
    meta_title: `${post.title || 'Gaming Guide'} | TrendPulseXhub`,
    meta_description: `Download and explore ${post.title || 'the latest gaming mod & guide'} with full step-by-step instructions.`,
    meta_keywords: `${gameName.toLowerCase()} mod, ${gameName.toLowerCase()} download, gaming guides`,
    og_image: repImage,
    og_type: 'website',
    no_index: false,
  };
}

/**
 * Builds Schema.org JSON-LD structured data for rich search results.
 */
export function generateStructuredData(post: Post, siteUrl: string = 'https://trendpulsexhub.com'): object {
  const postUrl = `${siteUrl}/${post.category === 'Codes' ? 'codes' : post.category === 'News' ? 'news' : 'mods'}/${post.slug}`;
  const gameName = post.codes_data?.[0]?.game || post.title.split(' ')[0] || 'Roblox Game';
  const activeCodes = (post.codes_data || []).filter((c) => c.status === 'Active');
  const ogImg = post.seo?.og_image || post.image_url || getGameRepresentativeImage(post.title || gameName);
  const datePublished = post.created_at || new Date().toISOString();
  const dateModified = post.updated_at || post.created_at || new Date().toISOString();

  const graph: any[] = [
    // 1. Article / WebPage Schema
    {
      '@type': 'Article',
      '@id': `${postUrl}#article`,
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        name: 'TrendPulseXhub',
        url: siteUrl,
      },
      headline: post.seo?.meta_title || post.title,
      description: post.seo?.meta_description || `Latest ${gameName} verified codes and gaming updates.`,
      image: ogImg,
      datePublished: datePublished,
      dateModified: dateModified,
      mainEntityOfPage: postUrl,
      author: {
        '@type': 'Organization',
        name: 'TrendPulseXhub Editorial Team',
        url: siteUrl,
      },
      publisher: {
        '@type': 'Organization',
        name: 'TrendPulseXhub',
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/logo.png`,
        },
      },
    },

    // 2. Breadcrumbs Schema
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: siteUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: post.category,
          item: `${siteUrl}/${post.category.toLowerCase()}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.title,
          item: postUrl,
        },
      ],
    },
  ];

  // 3. If Game Codes, add HowTo and ItemList schema so Google can show rich code snippets!
  if (post.category === 'Codes' && activeCodes.length > 0) {
    // HowTo Redeem Schema
    graph.push({
      '@type': 'HowTo',
      name: `How to Redeem Promo Codes in ${gameName}`,
      description: `Step-by-step guide to redeeming active working promotional codes in ${gameName} to claim free rewards.`,
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: `Launch ${gameName}`,
          text: `Open ${gameName} in Roblox on your PC, mobile, or console device.`,
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Open Codes Menu',
          text: 'Find and click the Codes button or Twitter icon on the screen.',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Enter Code & Claim',
          text: 'Paste an active code from our verified list and click Redeem to receive your rewards.',
        },
      ],
    });

    // ItemList for Active Codes
    graph.push({
      '@type': 'ItemList',
      name: `Active ${gameName} Promo Codes`,
      description: `List of verified working redemption codes for ${gameName}`,
      numberOfItems: activeCodes.length,
      itemListElement: activeCodes.slice(0, 10).map((c, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: c.code,
        description: `Reward: ${c.reward}`,
      })),
    });

    // FAQ Schema
    graph.push({
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `What is the latest active code for ${gameName}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `The newest active code is "${activeCodes[0].code}", which rewards players with ${activeCodes[0].reward}.`,
          },
        },
        {
          '@type': 'Question',
          name: `How often are ${gameName} codes updated?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Our automated engine tests and updates ${gameName} promo codes every 12 hours with fresh developer releases.`,
          },
        },
      ],
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export interface UsePageSEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  noIndex?: boolean;
  structuredData?: object | null;
}

/**
 * React hook to dynamically manage document head meta tags, OpenGraph, Twitter, and JSON-LD structured data.
 */
export function usePageSEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  noIndex = false,
  structuredData = null,
}: UsePageSEOProps) {
  useEffect(() => {
    const globalSettings = getStoredSEOSettings();
    const finalTitle = title
      ? globalSettings.defaultTitleTemplate.replace('{title}', title)
      : globalSettings.siteName;
    const finalDesc = description || globalSettings.defaultMetaDescription;
    const finalKeywords = keywords || globalSettings.defaultKeywords;
    const finalImage = image || globalSettings.defaultOgImage;
    const finalUrl = url || window.location.href;

    // 1. Document Title
    document.title = finalTitle;

    // 2. Helper to set or create meta tag
    const setMetaTag = (selector: string, attrName: string, attrValue: string, content: string) => {
      let meta = document.querySelector(selector) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attrName, attrValue);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // 3. Standard Meta
    setMetaTag('meta[name="description"]', 'name', 'description', finalDesc);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', finalKeywords);
    setMetaTag(
      'meta[name="robots"]',
      'name',
      'robots',
      noIndex || !globalSettings.robotsIndexing ? 'noindex, nofollow' : 'index, follow'
    );

    // 4. Open Graph Meta Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', finalTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', finalDesc);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', finalImage);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', finalUrl);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', type);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', globalSettings.siteName);

    // 5. Twitter Card Meta Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', finalTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', finalDesc);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', finalImage);
    if (globalSettings.twitterHandle) {
      setMetaTag('meta[name="twitter:site"]', 'name', 'twitter:site', globalSettings.twitterHandle);
    }

    // 6. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', finalUrl);

    // 7. Structured Data (JSON-LD)
    const SCRIPT_ID = 'schema-org-jsonld';
    let scriptTag = document.getElementById(SCRIPT_ID) as HTMLScriptElement;

    if (globalSettings.autoStructuredData && structuredData) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = SCRIPT_ID;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(structuredData, null, 2);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Cleanup on unmount if needed
    };
  }, [title, description, keywords, image, url, type, noIndex, structuredData]);
}
