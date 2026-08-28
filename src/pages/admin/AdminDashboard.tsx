import { useEffect, useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Edit, Trash2, Plus, ExternalLink, 
  Gamepad2, Sliders, DollarSign, Mail, Sparkles, Check, Globe
} from 'lucide-react';
import { Post } from '../../types';
import { getPosts, addPostToStore } from '../../lib/mock-data';
import { formatDistanceToNow, format } from 'date-fns';
import { useAds } from '../../context/AdContext';
import { GameConfigPanel } from '../../components/admin/GameConfigPanel';

type AdminTab = 'game-config' | 'posts' | 'ads' | 'inquiries';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('game-config');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Ad & Direct Link Management from AdContext
  const { 
    adSettings, 
    updateSlotConfig, 
    updateGlobalSettings, 
    resetToDefaults, 
    applyPreset 
  } = useAds();

  const [adSuccessMsg, setAdSuccessMsg] = useState<string | null>(null);

  // Local form inputs for Adsterra integration
  const [adsterraDirectLink, setAdsterraDirectLink] = useState(adSettings.adsterra_direct_link || '');
  const [viteAdsterraDirectLink, setViteAdsterraDirectLink] = useState(adSettings.vite_adsterra_direct_link || '');
  const [adsterraBannerScript, setAdsterraBannerScript] = useState(adSettings.adsterra_banner_script || '');
  const [adsterraPopunderScript, setAdsterraPopunderScript] = useState(adSettings.adsterra_popunder_script || '');
  const [adsterraSocialBarScript, setAdsterraSocialBarScript] = useState(adSettings.adsterra_social_bar_script || '');

  useEffect(() => {
    setAdsterraDirectLink(adSettings.adsterra_direct_link || '');
    setViteAdsterraDirectLink(adSettings.vite_adsterra_direct_link || '');
    setAdsterraBannerScript(adSettings.adsterra_banner_script || '');
    setAdsterraPopunderScript(adSettings.adsterra_popunder_script || '');
    setAdsterraSocialBarScript(adSettings.adsterra_social_bar_script || '');
  }, [
    adSettings.adsterra_direct_link, 
    adSettings.vite_adsterra_direct_link,
    adSettings.adsterra_banner_script,
    adSettings.adsterra_popunder_script,
    adSettings.adsterra_social_bar_script
  ]);

  const loadDashboard = async () => {
    const data = await getPosts();
    setPosts(data);
    setLoading(false);
  };

  const loadContactMessages = async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch('/api/admin/contact-messages');
      if (res.ok) {
        const data = await res.json();
        setContactMessages(data.messages || []);
      }
    } catch (err) {
      console.warn('Failed to load contact inquiries:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (activeTab === 'inquiries') {
      loadContactMessages();
    }
  }, [activeTab]);

  const handleSaveAdSettings = (e: FormEvent) => {
    e.preventDefault();
    updateGlobalSettings({
      adsterra_direct_link: adsterraDirectLink.trim() || undefined,
      vite_adsterra_direct_link: viteAdsterraDirectLink.trim() || undefined,
      adsterra_banner_script: adsterraBannerScript.trim() || undefined,
      adsterra_popunder_script: adsterraPopunderScript.trim() || undefined,
      adsterra_social_bar_script: adsterraSocialBarScript.trim() || undefined,
    });
    setAdSuccessMsg('Ad settings successfully saved and applied!');
    setTimeout(() => setAdSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6 text-slate-100">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0e0720] p-6 rounded-3xl border border-purple-800/40 shadow-xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            TrendPulseX <span className="text-purple-400">Admin Gateway</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage game server parameters, platform announcements, and advertising settings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/game/play"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-all"
          >
            <Gamepad2 size={16} />
            <span>Launch Live Game</span>
            <ExternalLink size={12} />
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-purple-800/40">
        <button
          onClick={() => setActiveTab('game-config')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'game-config'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'bg-[#0e0720] hover:bg-purple-950 text-slate-400 border border-purple-800/40'
          }`}
        >
          <Gamepad2 size={16} />
          <span>Game Server & Controls</span>
        </button>

        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'posts'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'bg-[#0e0720] hover:bg-purple-950 text-slate-400 border border-purple-800/40'
          }`}
        >
          <FileText size={16} />
          <span>Platform Posts ({posts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ads')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'ads'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'bg-[#0e0720] hover:bg-purple-950 text-slate-400 border border-purple-800/40'
          }`}
        >
          <DollarSign size={16} />
          <span>Adsterra & Monetization</span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'inquiries'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'bg-[#0e0720] hover:bg-purple-950 text-slate-400 border border-purple-800/40'
          }`}
        >
          <Mail size={16} />
          <span>Inquiries ({contactMessages.length})</span>
        </button>
      </div>

      {/* Tab 1: Game Server Configuration */}
      {activeTab === 'game-config' && (
        <div className="space-y-6">
          <GameConfigPanel />
        </div>
      )}

      {/* Tab 2: Platform Posts */}
      {activeTab === 'posts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white">Platform Content & Announcements</h3>
            <Link
              to="/admin/new"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md"
            >
              <Plus size={16} />
              <span>Create Post</span>
            </Link>
          </div>

          <div className="bg-[#0e0720] rounded-3xl border border-purple-800/40 overflow-hidden">
            <div className="divide-y divide-purple-900/30">
              {loading ? (
                <div className="p-8 text-center text-slate-400">Loading posts...</div>
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post.id} className="p-4 flex items-center justify-between gap-4 hover:bg-purple-950/30 transition-colors">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">{post.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="text-purple-400 font-mono">{post.category}</span>
                        <span>•</span>
                        <span>{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/edit/${post.id}`}
                        className="p-2 rounded-lg bg-purple-950 text-purple-300 hover:bg-purple-900 transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 text-sm">No posts currently in database.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Ads Management */}
      {activeTab === 'ads' && (
        <div className="bg-[#0e0720] p-6 sm:p-8 rounded-3xl border border-purple-800/40 shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-black text-white">Adsterra Global Configuration</h3>
            <p className="text-xs text-slate-400 mt-1">
              Configure your network IDs, banners, and direct links. These are served non-intrusively outside the main gameplay canvas.
            </p>
          </div>

          {adSuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <Check size={16} /> {adSuccessMsg}
            </div>
          )}

          <form onSubmit={handleSaveAdSettings} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Direct Link URL</label>
              <input
                type="text"
                value={adsterraDirectLink}
                onChange={(e) => setAdsterraDirectLink(e.target.value)}
                placeholder="https://www.highrevenuegate.com/..."
                className="w-full bg-purple-950/60 border border-purple-800/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Banner Script Code</label>
              <textarea
                rows={3}
                value={adsterraBannerScript}
                onChange={(e) => setAdsterraBannerScript(e.target.value)}
                placeholder="<script type='text/javascript' src='//...'>"
                className="w-full bg-purple-950/60 border border-purple-800/50 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Popunder Script Code</label>
              <textarea
                rows={3}
                value={adsterraPopunderScript}
                onChange={(e) => setAdsterraPopunderScript(e.target.value)}
                placeholder="<script type='text/javascript' src='//...'>"
                className="w-full bg-purple-950/60 border border-purple-800/50 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-black text-xs shadow-md shadow-purple-600/30 transition-all cursor-pointer"
              >
                Save Ad Configuration
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 4: Inquiries */}
      {activeTab === 'inquiries' && (
        <div className="bg-[#0e0720] rounded-3xl border border-purple-800/40 p-6 space-y-4">
          <h3 className="text-lg font-black text-white">Player Support & Inquiries</h3>
          {loadingMessages ? (
            <div className="text-slate-400 text-xs">Loading inquiries...</div>
          ) : contactMessages.length > 0 ? (
            <div className="space-y-3">
              {contactMessages.map((msg, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-purple-950/50 border border-purple-800/40 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{msg.name} ({msg.email})</span>
                    <span className="text-slate-400 text-[10px] font-mono">{msg.created_at || 'Recent'}</span>
                  </div>
                  <p className="text-xs text-slate-300">{msg.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-500 text-xs py-4 text-center">No contact inquiries recorded yet.</div>
          )}
        </div>
      )}

    </div>
  );
}
