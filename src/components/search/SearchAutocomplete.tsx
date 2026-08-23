import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, X, Flame, Sparkles, Gamepad2, Tag, ArrowRight, 
  Copy, Check, Zap, ChevronRight, TrendingUp, ExternalLink,
  Clock, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Post, CodeEntry } from '../../types';
import { getLivePosts } from '../../lib/supabase';
import { getGameRepresentativeImage, getGameIconUrl } from '../../lib/gameImages';

interface SearchResultGame {
  type: 'game';
  id: string;
  title: string;
  slug: string;
  category: string;
  activeCodesCount: number;
  image_url: string;
  icon_url: string;
  version?: string | null;
}

interface SearchResultCode {
  type: 'code';
  id: string;
  game: string;
  code: string;
  reward: string;
  status: 'Active' | 'Expired';
  postSlug: string;
  postTitle: string;
}

interface SearchResultTrend {
  type: 'trend';
  id: string;
  title: string;
  description: string;
  path: string;
  badge: string;
  icon: 'flame' | 'sparkles' | 'zap' | 'tag';
}

type AutocompleteItem = SearchResultGame | SearchResultCode | SearchResultTrend;

const VIRAL_TREND_CATEGORIES: SearchResultTrend[] = [
  {
    type: 'trend',
    id: 'trend_blox_fruits',
    title: 'Blox Fruits Update 22 & Stat Resets',
    description: 'Active 2x EXP boosts, stat resets & Fruit awakenings',
    path: '/codes?game=Blox+Fruits',
    badge: 'Trending Game',
    icon: 'flame',
  },
  {
    type: 'trend',
    id: 'trend_fisch_rods',
    title: 'Roblox Fisch Mutations & Secret Rods',
    description: 'Mythical sea enchant codes, carbon rods & free cash',
    path: '/codes?game=Fisch',
    badge: 'Hot Meta',
    icon: 'sparkles',
  },
  {
    type: 'trend',
    id: 'trend_anime_vanguards',
    title: 'Anime Vanguards Free Gems & Crystals',
    description: 'Summon top mythic units with verified redeem codes',
    path: '/codes?game=Anime+Vanguards',
    badge: 'Popular',
    icon: 'zap',
  },
  {
    type: 'trend',
    id: 'trend_all_codes',
    title: 'All Verified Roblox Active Codes',
    description: 'Browse complete database of tested and working codes',
    path: '/codes',
    badge: 'Vault',
    icon: 'tag',
  },
  {
    type: 'trend',
    id: 'trend_gaming_news',
    title: 'Breaking Game News & Patch Leaks',
    description: 'Daily meta tier lists, leaks and game updates',
    path: '/news',
    badge: 'News',
    icon: 'flame',
  },
];

const POPULAR_QUICK_SEARCHES = [
  'Blox Fruits',
  'Fisch',
  'Blade Ball',
  'Anime Vanguards',
  'Anime Defenders',
  'King Legacy',
  'Genshin Impact',
  'Stat Reset',
  '2x EXP Boost',
];

interface SearchAutocompleteProps {
  initialQuery?: string;
  onQueryChange?: (q: string) => void;
  onSelectPost?: (post: Post) => void;
  autoFocus?: boolean;
  placeholder?: string;
  className?: string;
  variant?: 'page' | 'nav' | 'compact';
  onClose?: () => void;
}

export function SearchAutocomplete({
  initialQuery = '',
  onQueryChange,
  onSelectPost,
  autoFocus = false,
  placeholder = 'Search games, active promo codes, rewards or trends...',
  className = '',
  variant = 'page',
  onClose,
}: SearchAutocompleteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync initial query
  useEffect(() => {
    if (initialQuery !== query && initialQuery !== '') {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  // Load all posts & codes on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const livePosts = await getLivePosts();
        if (isMounted) {
          setPosts(livePosts);
        }
      } catch (err) {
        console.warn('Failed to load posts for search autocomplete:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute autocomplete suggestions dynamically
  const { games, codes, trends, totalMatches } = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) {
      return {
        games: [],
        codes: [],
        trends: VIRAL_TREND_CATEGORIES.slice(0, 4),
        totalMatches: 0,
      };
    }

    // 1. Matching Games
    const matchedGames: SearchResultGame[] = [];
    const seenSlugs = new Set<string>();

    posts.forEach((p) => {
      const titleMatch = p.title.toLowerCase().includes(q);
      const gameMatch = p.codes_data?.some(c => c.game.toLowerCase().includes(q));
      const contentMatch = p.content_text?.toLowerCase().includes(q);

      if ((titleMatch || gameMatch || contentMatch) && !seenSlugs.has(p.slug)) {
        seenSlugs.add(p.slug);
        const activeCount = (p.codes_data || []).filter(c => c.status === 'Active').length;
        matchedGames.push({
          type: 'game',
          id: p.id,
          title: p.title,
          slug: p.slug,
          category: p.category,
          activeCodesCount: activeCount,
          image_url: getGameRepresentativeImage(p.title, p.image_url),
          icon_url: getGameIconUrl(p.title),
          version: p.version,
        });
      }
    });

    // 2. Matching Active Promo Codes
    const matchedCodes: SearchResultCode[] = [];
    posts.forEach((p) => {
      if (p.codes_data && Array.isArray(p.codes_data)) {
        p.codes_data.forEach((c) => {
          const codeMatch = c.code.toLowerCase().includes(q);
          const rewardMatch = (c.reward || '').toLowerCase().includes(q);
          const gameMatch = (c.game || '').toLowerCase().includes(q);

          if (codeMatch || rewardMatch || (gameMatch && q.length > 2)) {
            matchedCodes.push({
              type: 'code',
              id: c.id,
              game: c.game || p.title.split(' ')[0] || 'Game',
              code: c.code,
              reward: c.reward || 'Free in-game reward',
              status: c.status,
              postSlug: p.slug,
              postTitle: p.title,
            });
          }
        });
      }
    });

    // 3. Matching Viral Trend Categories
    const matchedTrends = VIRAL_TREND_CATEGORIES.filter(t => 
      t.title.toLowerCase().includes(q) || 
      t.description.toLowerCase().includes(q) ||
      t.badge.toLowerCase().includes(q)
    );

    return {
      games: matchedGames.slice(0, 5),
      codes: matchedCodes.slice(0, 6),
      trends: matchedTrends.slice(0, 3),
      totalMatches: matchedGames.length + matchedCodes.length + matchedTrends.length,
    };
  }, [query, posts]);

  // Flatten items for keyboard navigation
  const flatItems: AutocompleteItem[] = useMemo(() => {
    return [...games, ...codes, ...trends];
  }, [games, codes, trends]);

  // Reset active keyboard index when query changes
  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  // Handle Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(true);
    if (onQueryChange) {
      onQueryChange(val);
    }
  };

  // Handle Item Selection / Fast Navigation
  const handleSelectItem = (item: AutocompleteItem) => {
    setIsOpen(false);
    if (onClose) onClose();

    if (item.type === 'game') {
      navigate(`/post/${item.slug}`);
    } else if (item.type === 'code') {
      // Direct navigate to post
      navigate(`/post/${item.postSlug}`);
    } else if (item.type === 'trend') {
      navigate(item.path);
    }
  };

  // Handle Fast Code Copy directly in autocomplete
  const handleCopyCode = (e: React.MouseEvent, codeId: string, codeText: string) => {
    e.stopPropagation();
    e.preventDefault();
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(codeId);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1 < flatItems.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 >= 0 ? prev - 1 : flatItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < flatItems.length) {
        handleSelectItem(flatItems[activeIndex]);
      } else if (query.trim()) {
        setIsOpen(false);
        if (onClose) onClose();
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
      if (onClose) onClose();
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onQueryChange) onQueryChange('');
    inputRef.current?.focus();
  };

  const handleQuickTagClick = (tag: string) => {
    setQuery(tag);
    setIsOpen(true);
    if (onQueryChange) onQueryChange(tag);
    inputRef.current?.focus();
  };

  const isPageVariant = variant === 'page';

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-4 md:pl-5 flex items-center pointer-events-none text-sapphire-600">
          <Search size={isPageVariant ? 22 : 18} className="stroke-[2.5]" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className={`w-full bg-white border-2 border-indigo-950/10 text-indigo-950 placeholder-indigo-900/35 focus:outline-none focus:border-sapphire-600 transition-all font-bold shadow-sm ${
            isPageVariant 
              ? 'pl-12 md:pl-14 pr-24 py-4 md:py-4.5 rounded-2xl text-base md:text-lg' 
              : 'pl-10 pr-20 py-2.5 rounded-xl text-sm'
          } ${isOpen ? 'ring-4 ring-sapphire-500/10 border-sapphire-600' : ''}`}
        />

        {/* Right side controls (Clear button & Keyboard Badge) */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-lg text-indigo-900/40 hover:text-indigo-950 hover:bg-azure-100 transition-colors cursor-pointer"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}

          {isPageVariant && (
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-azure-100 border border-indigo-950/10 text-[10px] font-mono font-bold text-indigo-900/50">
              <span>ESC to close</span>
            </div>
          )}
        </div>
      </div>

      {/* Autocomplete Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: 8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.99 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-full mt-2 z-50 bg-white/95 backdrop-blur-xl rounded-2xl border border-indigo-950/15 shadow-2xl overflow-hidden max-h-[80vh] sm:max-h-[520px] overflow-y-auto flex flex-col divide-y divide-indigo-950/5 animate-fadeIn"
          >
            {/* 1. Header with Match Count & Quick Filter status */}
            <div className="px-4 py-2.5 bg-azure-50/80 flex items-center justify-between text-[11px] font-bold text-indigo-900/70 border-b border-indigo-950/5">
              <span className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-sapphire-600" />
                {query.trim() ? (
                  <>
                    <span>Dynamic Suggestions for</span>
                    <strong className="text-sapphire-700 font-black">"{query}"</strong>
                    <span className="px-1.5 py-0.5 rounded-full bg-sapphire-100 text-sapphire-800 text-[10px] font-mono">
                      {totalMatches} matches
                    </span>
                  </>
                ) : (
                  <span>Trending Roblox Experiences & Hot Code Vaults</span>
                )}
              </span>

              <span className="hidden sm:inline text-[10px] text-indigo-900/40 font-mono">
                Use ↑ ↓ to navigate • ↵ select
              </span>
            </div>

            {/* 2. When Query is Empty -> Show Hot Games & Popular Search Chips */}
            {!query.trim() && (
              <div className="p-4 space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-indigo-900/60 mb-2.5 font-mono">
                    <Flame size={14} className="text-amber-500" /> Popular Quick Searches
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_QUICK_SEARCHES.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleQuickTagClick(tag)}
                        className="px-3 py-1.5 rounded-xl bg-azure-50 hover:bg-sapphire-50 border border-indigo-950/10 hover:border-sapphire-600/30 text-xs font-bold text-indigo-950 hover:text-sapphire-700 transition-all cursor-pointer flex items-center gap-1 group"
                      >
                        <span>{tag}</span>
                        <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity text-sapphire-600" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-indigo-900/60 mb-2 font-mono">
                    <TrendingUp size={14} className="text-sky-600" /> Viral Categories & Guides
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {VIRAL_TREND_CATEGORIES.map((trend) => (
                      <div
                        key={trend.id}
                        onClick={() => handleSelectItem(trend)}
                        className="p-2.5 rounded-xl bg-white hover:bg-azure-50/80 border border-indigo-950/10 hover:border-sapphire-600/30 transition-all cursor-pointer group flex items-start gap-2.5"
                      >
                        <div className="p-2 rounded-lg bg-sapphire-50 text-sapphire-600 group-hover:bg-sapphire-600 group-hover:text-white transition-colors shrink-0 mt-0.5">
                          <Flame size={14} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-xs text-indigo-950 group-hover:text-sapphire-600 transition-colors truncate">
                              {trend.title}
                            </span>
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-mono shrink-0">
                              {trend.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-indigo-900/60 line-clamp-1 mt-0.5">
                            {trend.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. When Query Has Results */}
            {query.trim() && (
              <div className="divide-y divide-indigo-950/5">
                
                {/* 3A. Matching Games Section */}
                {games.length > 0 && (
                  <div className="p-3">
                    <div className="flex items-center justify-between px-2 pb-2 text-[11px] font-black uppercase tracking-wider text-indigo-900/50 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Gamepad2 size={13} className="text-sapphire-600" /> Matching Experiences & Games ({games.length})
                      </span>
                      <span className="text-[10px] text-sapphire-600 font-sans font-bold">Fast Navigate</span>
                    </div>

                    <div className="space-y-1">
                      {games.map((g) => {
                        const itemIdx = flatItems.findIndex(fi => fi.type === 'game' && fi.id === g.id);
                        const isSelected = activeIndex === itemIdx;

                        return (
                          <div
                            key={g.id}
                            onClick={() => handleSelectItem(g)}
                            onMouseEnter={() => setActiveIndex(itemIdx)}
                            className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              isSelected 
                                ? 'bg-sapphire-50 border border-sapphire-500/30 shadow-xs translate-x-1' 
                                : 'hover:bg-azure-50/80 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={g.icon_url || g.image_url}
                                alt={g.title}
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 rounded-xl object-cover shrink-0 border border-indigo-950/10 shadow-xs"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-xs sm:text-sm text-indigo-950 truncate">
                                    {g.title}
                                  </h4>
                                  {g.version && (
                                    <span className="hidden sm:inline text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-azure-100 text-indigo-900 font-mono">
                                      {g.version}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-indigo-900/60">
                                  <span className="font-semibold text-sapphire-700 bg-sapphire-50 px-1.5 py-0.2 rounded">
                                    {g.category}
                                  </span>
                                  {g.activeCodesCount > 0 && (
                                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                                      <ShieldCheck size={12} /> {g.activeCodesCount} Active Codes
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="hidden xs:inline-flex items-center gap-1 text-[11px] font-bold text-sapphire-600 hover:text-sapphire-700">
                                View Game <ChevronRight size={13} />
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3B. Matching Active Promo Codes Section */}
                {codes.length > 0 && (
                  <div className="p-3 bg-azure-50/30">
                    <div className="flex items-center justify-between px-2 pb-2 text-[11px] font-black uppercase tracking-wider text-indigo-900/50 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Zap size={13} className="text-amber-500" /> Active Promo Codes ({codes.length})
                      </span>
                      <span className="text-[10px] text-amber-600 font-sans font-bold">1-Click Copy Ready</span>
                    </div>

                    <div className="space-y-1.5">
                      {codes.map((c) => {
                        const itemIdx = flatItems.findIndex(fi => fi.type === 'code' && fi.id === c.id);
                        const isSelected = activeIndex === itemIdx;
                        const isCopied = copiedCodeId === c.id;

                        return (
                          <div
                            key={c.id}
                            onClick={() => handleSelectItem(c)}
                            onMouseEnter={() => setActiveIndex(itemIdx)}
                            className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              isSelected 
                                ? 'bg-amber-50/80 border border-amber-500/30 shadow-xs' 
                                : 'bg-white hover:bg-amber-50/40 border border-indigo-950/5'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="px-2.5 py-1 rounded-lg bg-indigo-950 text-amber-300 font-mono font-black text-xs tracking-wider border border-amber-400/30 shrink-0 shadow-xs">
                                {c.code}
                              </div>
                              <div className="min-w-0">
                                <span className="font-bold text-xs text-indigo-950 block truncate">
                                  {c.reward}
                                </span>
                                <span className="text-[10px] font-semibold text-indigo-900/50 block truncate">
                                  for <strong className="text-indigo-900">{c.game}</strong>
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={(e) => handleCopyCode(e, c.id, c.code)}
                                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                                  isCopied
                                    ? 'bg-emerald-500 text-white shadow-emerald-500/30 scale-105'
                                    : 'bg-azure-100 hover:bg-sapphire-600 hover:text-white text-indigo-950'
                                }`}
                                title="Copy code to clipboard"
                              >
                                {isCopied ? (
                                  <>
                                    <Check size={12} className="stroke-[3]" />
                                    <span>COPIED</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy size={12} />
                                    <span>COPY</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3C. Matching Trends & Guides */}
                {trends.length > 0 && (
                  <div className="p-3">
                    <div className="px-2 pb-2 text-[11px] font-black uppercase tracking-wider text-indigo-900/50 font-mono flex items-center gap-1.5">
                      <Flame size={13} className="text-rose-500" /> Viral Trends & Topics
                    </div>
                    <div className="space-y-1">
                      {trends.map((t) => {
                        const itemIdx = flatItems.findIndex(fi => fi.type === 'trend' && fi.id === t.id);
                        const isSelected = activeIndex === itemIdx;

                        return (
                          <div
                            key={t.id}
                            onClick={() => handleSelectItem(t)}
                            onMouseEnter={() => setActiveIndex(itemIdx)}
                            className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-2 ${
                              isSelected ? 'bg-sapphire-50 border border-sapphire-500/30' : 'hover:bg-azure-50/70 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 shrink-0">
                                <Flame size={13} />
                              </div>
                              <span className="text-xs font-bold text-indigo-950 truncate">{t.title}</span>
                            </div>
                            <span className="text-[10px] font-bold text-sapphire-600 shrink-0">Explore →</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3D. No Matches State */}
                {totalMatches === 0 && (
                  <div className="p-8 text-center space-y-2">
                    <div className="h-10 w-10 mx-auto rounded-full bg-azure-100 flex items-center justify-center text-indigo-900/40">
                      <Search size={20} />
                    </div>
                    <h4 className="font-bold text-sm text-indigo-950">No exact matches found for "{query}"</h4>
                    <p className="text-xs text-indigo-900/60 max-w-xs mx-auto">
                      Try searching for popular titles like <strong>Blox Fruits</strong>, <strong>Fisch</strong>, or <strong>Blade Ball</strong>.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 4. Footer CTA within dropdown */}
            <div className="p-2.5 bg-indigo-950 text-white flex items-center justify-between text-xs px-4">
              <span className="text-[11px] text-azure-200/80 font-medium">
                Want complete code archives?
              </span>
              <Link
                to={query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : '/codes'}
                onClick={() => {
                  setIsOpen(false);
                  if (onClose) onClose();
                }}
                className="text-[11px] font-black text-sky-300 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>View Full Results</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
