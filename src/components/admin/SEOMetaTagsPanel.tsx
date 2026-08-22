import { useState, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Share2, 
  Code2, 
  Save, 
  RotateCcw, 
  Eye, 
  Layers, 
  Check, 
  AlertCircle, 
  Image as ImageIcon,
  ExternalLink,
  Bot,
  Zap,
  Tag,
  Copy
} from 'lucide-react';
import { Post, GlobalSEOSettings, PostSEO } from '../../types';
import { 
  DEFAULT_SEO_SETTINGS, 
  getStoredSEOSettings, 
  saveStoredSEOSettings, 
  generateAutomatedPostSEO, 
  generateStructuredData 
} from '../../lib/seo';
import { getGameRepresentativeImage } from '../../lib/gameImages';

interface SEOMetaTagsPanelProps {
  posts: Post[];
  onPostUpdate?: (updatedPost: Post) => void;
}

export function SEOMetaTagsPanel({ posts, onPostUpdate }: SEOMetaTagsPanelProps) {
  const [globalSettings, setGlobalSettings] = useState<GlobalSEOSettings>(DEFAULT_SEO_SETTINGS);
  const [selectedPostId, setSelectedPostId] = useState<string>(posts[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'global' | 'posts' | 'schema'>('posts');

  // Per-post SEO editing state
  const [postSEO, setPostSEO] = useState<PostSEO>({
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_image: '',
    canonical_url: '',
    no_index: false,
  });

  const [savingGlobal, setSavingGlobal] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [jsonCopied, setJsonCopied] = useState(false);

  // Load stored settings on mount
  useEffect(() => {
    const loaded = getStoredSEOSettings();
    setGlobalSettings(loaded);

    // Also fetch from server if available
    fetch('/api/admin/seo-settings')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data && !data.usingDefaults) {
          setGlobalSettings((prev) => ({ ...prev, ...data }));
          saveStoredSEOSettings({ ...loaded, ...data });
        }
      })
      .catch(() => {});
  }, []);

  // Update selected post state when selection changes
  const selectedPost = posts.find((p) => p.id === selectedPostId) || posts[0];

  useEffect(() => {
    if (selectedPost) {
      if (selectedPost.seo && selectedPost.seo.meta_title) {
        setPostSEO(selectedPost.seo);
      } else {
        const auto = generateAutomatedPostSEO(selectedPost);
        setPostSEO({
          meta_title: auto.meta_title || selectedPost.title,
          meta_description: auto.meta_description || '',
          meta_keywords: auto.meta_keywords || '',
          og_image: auto.og_image || selectedPost.image_url || getGameRepresentativeImage(selectedPost.title),
          canonical_url: `https://trendpulsexhub.com/${selectedPost.category === 'Codes' ? 'codes' : 'news'}/${selectedPost.slug}`,
          no_index: false,
        });
      }
    }
  }, [selectedPostId, selectedPost]);

  const showNotification = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleSaveGlobal = async () => {
    setSavingGlobal(true);
    saveStoredSEOSettings(globalSettings);

    try {
      await fetch('/api/admin/seo-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(globalSettings),
      });
      showNotification('✓ Global SEO & Search Engine defaults saved successfully!');
    } catch {
      showNotification('✓ Global SEO settings saved to local session.');
    } finally {
      setSavingGlobal(false);
    }
  };

  const handleAutoGenerateSEOForPost = () => {
    if (!selectedPost) return;
    const generated = generateAutomatedPostSEO(selectedPost);
    setPostSEO({
      meta_title: generated.meta_title || '',
      meta_description: generated.meta_description || '',
      meta_keywords: generated.meta_keywords || '',
      og_image: generated.og_image || selectedPost.image_url || getGameRepresentativeImage(selectedPost.title),
      canonical_url: `https://trendpulsexhub.com/${selectedPost.category === 'Codes' ? 'codes' : 'news'}/${selectedPost.slug}`,
      no_index: false,
    });
    showNotification('✨ Generated CTR-optimized SEO Title & Meta Description with AI engine!');
  };

  const handleSavePostSEO = async () => {
    if (!selectedPost) return;
    setSavingPost(true);

    const updated: Post = {
      ...selectedPost,
      seo: postSEO,
      updated_at: new Date().toISOString(),
    };

    // Update locally in mock storage
    if (onPostUpdate) {
      onPostUpdate(updated);
    }

    try {
      await fetch(`/api/admin/posts/${selectedPost.id}/seo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seo: postSEO }),
      });
    } catch {}

    setSavingPost(false);
    showNotification(`✓ SEO overrides saved for "${selectedPost.title}"!`);
  };

  const filteredPosts = posts.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentJsonLd = selectedPost ? generateStructuredData({ ...selectedPost, seo: postSEO }) : null;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white text-xs font-black shadow-xl flex items-center gap-2 animate-bounce border border-emerald-400">
          <CheckCircle2 size={16} /> {toastMsg}
        </div>
      )}

      {/* Main Header & Subtabs */}
      <div className="bg-white p-6 rounded-3xl border border-indigo-950/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="text-sapphire-600" size={22} />
            <h2 className="text-xl font-black text-indigo-950">Automated SEO & Meta-Tags Suite</h2>
          </div>
          <p className="text-xs text-indigo-900/60 font-medium mt-1 max-w-2xl">
            CTR-optimized titles, meta descriptions, Open Graph preview cards, and Google Schema.org (JSON-LD) rich snippets.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-azure-50/70 p-1.5 rounded-2xl border border-indigo-950/5">
          <button
            onClick={() => setActiveSubTab('posts')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'posts'
                ? 'bg-sapphire-600 text-white shadow-md shadow-sapphire-600/20'
                : 'text-indigo-950/70 hover:bg-white hover:text-indigo-950'
            }`}
          >
            Per-Post SEO Overrides ({posts.length})
          </button>
          <button
            onClick={() => setActiveSubTab('global')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'global'
                ? 'bg-sapphire-600 text-white shadow-md shadow-sapphire-600/20'
                : 'text-indigo-950/70 hover:bg-white hover:text-indigo-950'
            }`}
          >
            Global Site Defaults
          </button>
          <button
            onClick={() => setActiveSubTab('schema')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'schema'
                ? 'bg-sapphire-600 text-white shadow-md shadow-sapphire-600/20'
                : 'text-indigo-950/70 hover:bg-white hover:text-indigo-950'
            }`}
          >
            Schema.org JSON-LD
          </button>
        </div>
      </div>

      {/* SUBTAB 1: PER-POST SEO & SERP PREVIEWS */}
      {activeSubTab === 'posts' && selectedPost && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Post Selection Column (4 Cols) */}
          <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-indigo-950/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-indigo-950/5">
              <span className="text-xs font-black text-indigo-950 uppercase tracking-wide">Select Post</span>
              <span className="text-[11px] font-bold text-indigo-900/50">{filteredPosts.length} Results</span>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-indigo-900/40" size={15} />
              <input
                type="text"
                placeholder="Search game or post..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-azure-50 border border-indigo-950/15 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-indigo-950 focus:outline-none focus:border-sapphire-600"
              />
            </div>

            <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredPosts.map((p) => {
                const isSelected = p.id === selectedPostId;
                const hasCustomSeo = !!p.seo?.meta_title;
                const repImg = p.image_url || getGameRepresentativeImage(p.title);

                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPostId(p.id)}
                    className={`w-full text-left p-2.5 rounded-2xl flex items-center gap-3 transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-sapphire-50/80 border-sapphire-600/30 text-indigo-950 shadow-xs'
                        : 'bg-transparent hover:bg-azure-50/60 border-transparent text-indigo-950/80'
                    }`}
                  >
                    <img
                      src={repImg}
                      alt={p.title}
                      className="w-10 h-10 rounded-xl object-cover shrink-0 border border-indigo-950/10 bg-slate-900"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-azure-100 text-sapphire-700">
                          {p.category}
                        </span>
                        {hasCustomSeo && (
                          <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-0.5">
                            <Check size={10} /> Custom SEO
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold truncate leading-snug text-indigo-950">{p.title}</h4>
                      <p className="text-[10px] text-indigo-900/40 font-mono truncate">/{p.slug}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SEO Editor & Live Previews Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Live Google Search Snippet Card */}
            <div className="bg-white p-6 rounded-3xl border border-indigo-950/10 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-indigo-950 uppercase tracking-wide flex items-center gap-1.5">
                  <Eye size={15} className="text-emerald-600" />
                  Live Google SERP Snippet Preview
                </span>
                <span className="text-[11px] font-bold text-indigo-900/50">Simulated Desktop Google Search Result</span>
              </div>

              {/* Realistic Google Search Card */}
              <div className="p-5 rounded-2xl bg-[#ffffff] border border-slate-200/90 shadow-2xs font-sans space-y-1 max-w-2xl">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-sapphire-600 text-white flex items-center justify-center text-[10px] font-black">
                    T
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-[13px] text-[#202124] leading-none">TrendPulseXhub</span>
                    <span className="text-[11px] text-[#4d5156] leading-none mt-0.5">
                      https://trendpulsexhub.com › {selectedPost.category.toLowerCase()} › {selectedPost.slug}
                    </span>
                  </div>
                </div>

                <h3 className="text-[19px] leading-snug font-normal text-[#1a0dab] hover:underline cursor-pointer pt-1 line-clamp-1">
                  {postSEO.meta_title || selectedPost.title}
                </h3>

                {/* Google Rich Snippets / Rating Stars preview */}
                {globalSettings.enableRichSnippets && selectedPost.category === 'Codes' && (
                  <div className="flex items-center gap-2 text-[12px] text-[#4d5156] py-0.5">
                    <span className="text-[#e37400] font-bold">★★★★★</span>
                    <span>Rating: 4.9 · 1,480 votes</span>
                    <span>·</span>
                    <span className="font-medium text-emerald-700">
                      {(selectedPost.codes_data || []).filter(c => c.status === 'Active').length} Verified Active Codes
                    </span>
                  </div>
                )}

                <p className="text-[13px] text-[#4d5156] leading-relaxed line-clamp-2">
                  <span className="text-[#70757a] text-xs">
                    {new Date(selectedPost.updated_at || selectedPost.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} —{' '}
                  </span>
                  {postSEO.meta_description || 'Click to claim all verified active promo codes, free rewards, and latest game updates.'}
                </p>
              </div>
            </div>

            {/* Live Open Graph & Social Share Card Preview */}
            <div className="bg-white p-6 rounded-3xl border border-indigo-950/10 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-indigo-950 uppercase tracking-wide flex items-center gap-1.5">
                  <Share2 size={15} className="text-sky-600" />
                  Social Share Preview (Open Graph / Twitter / Discord)
                </span>
                <span className="text-[11px] font-bold text-indigo-900/50">1200 × 630 Card</span>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 max-w-lg shadow-sm">
                <div className="relative aspect-[1.91/1] w-full bg-slate-900 overflow-hidden">
                  <img
                    src={postSEO.og_image || selectedPost.image_url || getGameRepresentativeImage(selectedPost.title)}
                    alt="Social Card"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 bg-indigo-950/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    trendpulsexhub.com
                  </div>
                </div>
                <div className="p-4 bg-white space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400">TRENDPULSEXHUB.COM</span>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{postSEO.meta_title || selectedPost.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {postSEO.meta_description || 'Discover daily verified active game codes and rewards.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Editable Fields for the Post */}
            <div className="bg-white p-6 rounded-3xl border border-indigo-950/10 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-950/5">
                <div>
                  <h3 className="text-base font-black text-indigo-950">SEO Meta-Tags Editor</h3>
                  <p className="text-xs text-indigo-900/50 font-medium">Fine-tune search title, description, and keywords for this page</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAutoGenerateSEOForPost}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-sapphire-600 to-indigo-900 text-white text-xs font-black shadow-md shadow-sapphire-600/20 hover:opacity-95 cursor-pointer"
                  >
                    <Bot size={14} className="text-sky-300" />
                    <span>AI 1-Click CTR Generator</span>
                  </button>
                  <button
                    onClick={handleSavePostSEO}
                    disabled={savingPost}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
                  >
                    <Save size={14} />
                    <span>{savingPost ? 'Saving...' : 'Save Overrides'}</span>
                  </button>
                </div>
              </div>

              {/* Meta Title Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-indigo-950 uppercase tracking-wide">
                    Meta Title (Google SERP Title)
                  </label>
                  <span className={`text-[11px] font-bold ${
                    (postSEO.meta_title || '').length > 60 ? 'text-amber-600' : 'text-indigo-900/50'
                  }`}>
                    {(postSEO.meta_title || '').length} / 60 characters (Optimal: 50-60)
                  </span>
                </div>
                <input
                  type="text"
                  value={postSEO.meta_title || ''}
                  onChange={(e) => setPostSEO({ ...postSEO, meta_title: e.target.value })}
                  placeholder="e.g. Blox Fruits Codes (August 2026) - 15 Active Working Codes"
                  className="w-full bg-azure-50/60 border border-indigo-950/15 rounded-xl px-4 py-2.5 text-xs font-bold text-indigo-950 focus:outline-none focus:border-sapphire-600"
                />
              </div>

              {/* Meta Description Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-indigo-950 uppercase tracking-wide">
                    Meta Description (SERP Snippet)
                  </label>
                  <span className={`text-[11px] font-bold ${
                    (postSEO.meta_description || '').length > 160 ? 'text-amber-600' : 'text-indigo-900/50'
                  }`}>
                    {(postSEO.meta_description || '').length} / 160 characters (Optimal: 140-160)
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={postSEO.meta_description || ''}
                  onChange={(e) => setPostSEO({ ...postSEO, meta_description: e.target.value })}
                  placeholder="e.g. Redeem all verified working Blox Fruits promo codes for August 2026! Claim free 2x EXP Boost, Stat Resets, Beli & Titles with our instant 100% tested list."
                  className="w-full bg-azure-50/60 border border-indigo-950/15 rounded-xl p-3.5 text-xs font-medium text-indigo-950 leading-relaxed focus:outline-none focus:border-sapphire-600"
                />
              </div>

              {/* Meta Keywords & OG Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-indigo-950 block mb-1.5 uppercase tracking-wide">
                    Target Keywords (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={postSEO.meta_keywords || ''}
                    onChange={(e) => setPostSEO({ ...postSEO, meta_keywords: e.target.value })}
                    placeholder="blox fruits codes, working codes, free beli, 2x exp"
                    className="w-full bg-azure-50/60 border border-indigo-950/15 rounded-xl px-3.5 py-2 text-xs font-medium text-indigo-950 focus:outline-none focus:border-sapphire-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-indigo-950 block mb-1.5 uppercase tracking-wide">
                    Social Card Image URL (OG Image)
                  </label>
                  <input
                    type="text"
                    value={postSEO.og_image || ''}
                    onChange={(e) => setPostSEO({ ...postSEO, og_image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-azure-50/60 border border-indigo-950/15 rounded-xl px-3.5 py-2 text-xs font-medium text-indigo-950 focus:outline-none focus:border-sapphire-600"
                  />
                </div>
              </div>

              {/* Canonical URL & NoIndex */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-indigo-950/5 items-center">
                <div>
                  <label className="text-xs font-bold text-indigo-950 block mb-1.5 uppercase tracking-wide">
                    Canonical URL Override
                  </label>
                  <input
                    type="text"
                    value={postSEO.canonical_url || ''}
                    onChange={(e) => setPostSEO({ ...postSEO, canonical_url: e.target.value })}
                    placeholder="https://trendpulsexhub.com/..."
                    className="w-full bg-azure-50/60 border border-indigo-950/15 rounded-xl px-3.5 py-2 text-xs font-mono text-indigo-950 focus:outline-none focus:border-sapphire-600"
                  />
                </div>

                <div className="pt-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={postSEO.no_index || false}
                      onChange={(e) => setPostSEO({ ...postSEO, no_index: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                    <span className="ml-3 text-xs font-bold text-indigo-950">
                      Prevent Indexing (noindex, nofollow)
                    </span>
                  </label>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SUBTAB 2: GLOBAL SITE DEFAULTS */}
      {activeSubTab === 'global' && (
        <div className="bg-white rounded-3xl border border-indigo-950/10 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-indigo-950/5">
            <div>
              <h3 className="text-lg font-black text-indigo-950">Site-Wide SEO & Metadata Defaults</h3>
              <p className="text-xs text-indigo-900/60 font-medium mt-0.5">
                Applied automatically across all pages unless a custom override exists.
              </p>
            </div>
            <button
              onClick={handleSaveGlobal}
              disabled={savingGlobal}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sapphire-600 hover:bg-sapphire-500 text-white font-black text-xs shadow-md shadow-sapphire-600/20 transition-all cursor-pointer"
            >
              <Check size={16} />
              <span>{savingGlobal ? 'Saving...' : 'Save Global Defaults'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-indigo-950 block mb-1.5 uppercase tracking-wide">
                Site Brand Name
              </label>
              <input
                type="text"
                value={globalSettings.siteName}
                onChange={(e) => setGlobalSettings({ ...globalSettings, siteName: e.target.value })}
                className="w-full bg-azure-50/60 border border-indigo-950/15 rounded-xl px-4 py-2.5 text-xs font-bold text-indigo-950 focus:outline-none focus:border-sapphire-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-indigo-950 block mb-1.5 uppercase tracking-wide">
                Default Title Template (Use {'{title}'})
              </label>
              <input
                type="text"
                value={globalSettings.defaultTitleTemplate}
                onChange={(e) => setGlobalSettings({ ...globalSettings, defaultTitleTemplate: e.target.value })}
                className="w-full bg-azure-50/60 border border-indigo-950/15 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-indigo-950 focus:outline-none focus:border-sapphire-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-indigo-950 block mb-1.5 uppercase tracking-wide">
                Global Default Meta Description
              </label>
              <textarea
                rows={3}
                value={globalSettings.defaultMetaDescription}
                onChange={(e) => setGlobalSettings({ ...globalSettings, defaultMetaDescription: e.target.value })}
                className="w-full bg-azure-50/60 border border-indigo-950/15 rounded-xl p-3.5 text-xs font-medium text-indigo-950 leading-relaxed focus:outline-none focus:border-sapphire-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-indigo-950 block mb-1.5 uppercase tracking-wide">
                Default Meta Keywords
              </label>
              <input
                type="text"
                value={globalSettings.defaultKeywords}
                onChange={(e) => setGlobalSettings({ ...globalSettings, defaultKeywords: e.target.value })}
                className="w-full bg-azure-50/60 border border-indigo-950/15 rounded-xl px-4 py-2.5 text-xs font-medium text-indigo-950 focus:outline-none focus:border-sapphire-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-indigo-950 block mb-1.5 uppercase tracking-wide">
                Twitter / X Creator Handle
              </label>
              <input
                type="text"
                value={globalSettings.twitterHandle}
                onChange={(e) => setGlobalSettings({ ...globalSettings, twitterHandle: e.target.value })}
                placeholder="@TrendPulseXhub"
                className="w-full bg-azure-50/60 border border-indigo-950/15 rounded-xl px-4 py-2.5 text-xs font-medium text-indigo-950 focus:outline-none focus:border-sapphire-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-indigo-950 block mb-1.5 uppercase tracking-wide">
                Default Open Graph Banner Image URL (1200 × 630)
              </label>
              <input
                type="text"
                value={globalSettings.defaultOgImage}
                onChange={(e) => setGlobalSettings({ ...globalSettings, defaultOgImage: e.target.value })}
                className="w-full bg-azure-50/60 border border-indigo-950/15 rounded-xl px-4 py-2.5 text-xs font-medium text-indigo-950 focus:outline-none focus:border-sapphire-600"
              />
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="pt-6 border-t border-indigo-950/10 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-azure-50/50 border border-indigo-950/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-950 block">Search Indexing</span>
                <span className="text-[10px] text-indigo-900/50">Allow Google bot to index</span>
              </div>
              <input
                type="checkbox"
                checked={globalSettings.robotsIndexing}
                onChange={(e) => setGlobalSettings({ ...globalSettings, robotsIndexing: e.target.checked })}
                className="h-4 w-4 rounded text-sapphire-600 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-azure-50/50 border border-indigo-950/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-950 block">JSON-LD Structured Data</span>
                <span className="text-[10px] text-indigo-900/50">Auto-inject Schema.org tags</span>
              </div>
              <input
                type="checkbox"
                checked={globalSettings.autoStructuredData}
                onChange={(e) => setGlobalSettings({ ...globalSettings, autoStructuredData: e.target.checked })}
                className="h-4 w-4 rounded text-sapphire-600 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-azure-50/50 border border-indigo-950/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-950 block">Google Rich Snippets</span>
                <span className="text-[10px] text-indigo-900/50">HowTo & ItemList schema</span>
              </div>
              <input
                type="checkbox"
                checked={globalSettings.enableRichSnippets}
                onChange={(e) => setGlobalSettings({ ...globalSettings, enableRichSnippets: e.target.checked })}
                className="h-4 w-4 rounded text-sapphire-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: SCHEMA.ORG JSON-LD VIEWER */}
      {activeSubTab === 'schema' && (
        <div className="bg-white rounded-3xl border border-indigo-950/10 p-6 md:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-indigo-950 flex items-center gap-2">
                <Code2 className="text-sapphire-600" size={18} />
                Schema.org (JSON-LD) Output for "{selectedPost?.title}"
              </h3>
              <p className="text-xs text-indigo-900/50 font-medium">
                Google Rich Results Validator ready. Automatically injected into {'<head>'} on post render.
              </p>
            </div>
            <button
              onClick={() => {
                if (currentJsonLd) {
                  navigator.clipboard.writeText(JSON.stringify(currentJsonLd, null, 2));
                  setJsonCopied(true);
                  setTimeout(() => setJsonCopied(false), 2000);
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-azure-100 hover:bg-azure-200 text-sapphire-800 text-xs font-bold cursor-pointer transition-colors"
            >
              {jsonCopied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{jsonCopied ? 'Copied JSON-LD!' : 'Copy Schema Code'}</span>
            </button>
          </div>

          <div className="rounded-2xl bg-slate-950 p-5 text-emerald-400 font-mono text-xs overflow-x-auto max-h-96 border border-slate-800">
            <pre>{JSON.stringify(currentJsonLd, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
