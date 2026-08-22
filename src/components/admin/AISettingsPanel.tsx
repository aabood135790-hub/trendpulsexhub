import { useState, useEffect } from 'react';
import { Bot, Key, Sparkles, CheckCircle2, AlertCircle, RefreshCw, ShieldCheck, Zap, Activity, Eye, EyeOff, Check, Cpu } from 'lucide-react';

export interface AIServiceConfig {
  geminiApiKey: string;
  deepseekApiKey: string;
  primaryProvider: 'gemini' | 'deepseek';
  fallbackEnabled: boolean;
  geminiModel: string;
  deepseekModel: string;
  hasGeminiKey?: boolean;
  hasDeepseekKey?: boolean;
  geminiKeySource?: string;
  deepseekKeySource?: string;
  updatedAt?: string;
}

export function AISettingsPanel() {
  const [config, setConfig] = useState<AIServiceConfig>({
    geminiApiKey: '',
    deepseekApiKey: '',
    primaryProvider: 'gemini',
    fallbackEnabled: true,
    geminiModel: 'gemini-3.7-flash',
    deepseekModel: 'deepseek-chat',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);

  // Show / Hide API Keys state
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showDeepseekKey, setShowDeepseekKey] = useState(false);

  // Live Testing States
  const [testingGemini, setTestingGemini] = useState(false);
  const [geminiTestResult, setGeminiTestResult] = useState<{ success: boolean; message?: string; error?: string; latencyMs?: number } | null>(null);

  const [testingDeepseek, setTestingDeepseek] = useState(false);
  const [deepseekTestResult, setDeepseekTestResult] = useState<{ success: boolean; message?: string; error?: string; latencyMs?: number } | null>(null);

  // Load config on mount
  const loadConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/ai-config');
      if (res.ok) {
        const data = await res.json();
        setConfig({
          geminiApiKey: data.geminiApiKey || '',
          deepseekApiKey: data.deepseekApiKey || '',
          primaryProvider: data.primaryProvider || 'gemini',
          fallbackEnabled: data.fallbackEnabled !== false,
          geminiModel: data.geminiModel || 'gemini-3.7-flash',
          deepseekModel: data.deepseekModel || 'deepseek-chat',
          hasGeminiKey: data.hasGeminiKey,
          hasDeepseekKey: data.hasDeepseekKey,
          geminiKeySource: data.geminiKeySource,
          deepseekKeySource: data.deepseekKeySource,
          updatedAt: data.updatedAt,
        });
      }
    } catch (err: any) {
      console.error('Failed to load AI config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccessMsg(null);
    setSaveErrorMsg(null);

    try {
      const res = await fetch('/api/admin/ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccessMsg('AI Service & API Keys configuration saved and persisted to database!');
        setConfig(prev => ({
          ...prev,
          hasGeminiKey: data.config?.hasGeminiKey,
          hasDeepseekKey: data.config?.hasDeepseekKey,
          updatedAt: data.config?.updatedAt || new Date().toISOString(),
        }));
        setTimeout(() => setSaveSuccessMsg(null), 4500);
      } else {
        setSaveErrorMsg(data.error || 'Failed to save configuration');
      }
    } catch (err: any) {
      setSaveErrorMsg(err?.message || 'Network error saving configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleTestGemini = async () => {
    setTestingGemini(true);
    setGeminiTestResult(null);
    try {
      const res = await fetch('/api/admin/test-ai-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'gemini',
          apiKey: config.geminiApiKey,
          model: config.geminiModel,
        }),
      });
      const data = await res.json();
      setGeminiTestResult(data);
    } catch (err: any) {
      setGeminiTestResult({
        success: false,
        error: err?.message || 'Network error during connection test',
      });
    } finally {
      setTestingGemini(false);
    }
  };

  const handleTestDeepseek = async () => {
    setTestingDeepseek(true);
    setDeepseekTestResult(null);
    try {
      const res = await fetch('/api/admin/test-ai-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'deepseek',
          apiKey: config.deepseekApiKey,
          model: config.deepseekModel,
        }),
      });
      const data = await res.json();
      setDeepseekTestResult(data);
    } catch (err: any) {
      setDeepseekTestResult({
        success: false,
        error: err?.message || 'Network error during connection test',
      });
    } finally {
      setTestingDeepseek(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-indigo-950/10 shadow-sm">
        <RefreshCw size={28} className="animate-spin text-sapphire-600 mx-auto mb-3" />
        <p className="text-sm font-bold text-indigo-950">Loading AI Service Configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-indigo-950/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sapphire-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <Bot size={20} />
            </div>
            <h2 className="text-xl font-black text-indigo-950">AI Service & API Keys Management</h2>
          </div>
          <p className="text-xs text-indigo-900/60 font-medium mt-1 max-w-2xl">
            Configure dynamic API keys, select your Primary AI Provider (Gemini vs. DeepSeek), and enable automatic fallback for reliable 12-hour automated background scraping and trending news generation.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sapphire-700 to-indigo-900 hover:from-sapphire-600 hover:to-indigo-800 text-white px-6 py-3 rounded-2xl font-black text-xs shadow-lg shadow-sapphire-600/25 transition-all active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
        >
          {saving ? <RefreshCw size={15} className="animate-spin" /> : <ShieldCheck size={16} />}
          <span>{saving ? 'Saving Settings...' : 'Save AI Configuration'}</span>
        </button>
      </div>

      {/* Notifications */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {saveErrorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800 flex items-center gap-2.5 animate-fadeIn">
          <AlertCircle size={18} className="text-rose-600 shrink-0" />
          <span>{saveErrorMsg}</span>
        </div>
      )}

      {/* Primary AI Provider & Automatic Fallback Engine */}
      <div className="bg-gradient-to-br from-indigo-950 via-sapphire-950 to-indigo-900 rounded-3xl p-6 text-white shadow-xl border border-sapphire-500/20 relative overflow-hidden">
        <div className="relative z-10 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles size={20} className="text-sky-400" />
              <h3 className="text-base font-black text-white">Primary AI Routing & Failover Architecture</h3>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-[11px] font-bold text-sky-200">
              <Activity size={12} /> Active Primary: <span className="uppercase text-white font-black">{config.primaryProvider}</span>
            </span>
          </div>

          <p className="text-xs text-azure-100/70 max-w-2xl leading-relaxed">
            The scraping engine and viral trends generator use your selected <strong>Primary AI Model</strong> for all generation tasks. If rate limits (HTTP 429 quota exhaustion) or network downtime occur, the system automatically falls back to the secondary AI model seamlessly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Primary Provider Selector Option: Gemini */}
            <div
              onClick={() => setConfig(prev => ({ ...prev, primaryProvider: 'gemini' }))}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                config.primaryProvider === 'gemini'
                  ? 'bg-sapphire-500/25 border-sky-400 ring-2 ring-sky-400/50 shadow-lg'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                config.primaryProvider === 'gemini' ? 'border-sky-400 bg-sky-400' : 'border-white/40'
              }`}>
                {config.primaryProvider === 'gemini' && <div className="w-2 h-2 rounded-full bg-slate-950" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-white">Google Gemini AI</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-azure-500/30 text-azure-200 font-bold">Fast & Structured</span>
                </div>
                <p className="text-xs text-azure-100/60 leading-relaxed">
                  Default primary model with JSON schemas. Uses Gemini 3.7 Flash / 3.6 Flash.
                </p>
              </div>
            </div>

            {/* Primary Provider Selector Option: DeepSeek */}
            <div
              onClick={() => setConfig(prev => ({ ...prev, primaryProvider: 'deepseek' }))}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                config.primaryProvider === 'deepseek'
                  ? 'bg-sapphire-500/25 border-sky-400 ring-2 ring-sky-400/50 shadow-lg'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                config.primaryProvider === 'deepseek' ? 'border-sky-400 bg-sky-400' : 'border-white/40'
              }`}>
                {config.primaryProvider === 'deepseek' && <div className="w-2 h-2 rounded-full bg-slate-950" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-white">DeepSeek AI</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/30 text-sky-200 font-bold">High Accuracy & High Limits</span>
                </div>
                <p className="text-xs text-azure-100/60 leading-relaxed">
                  DeepSeek-Chat API. Excellent fallback or primary model for high-volume scrapers.
                </p>
              </div>
            </div>
          </div>

          {/* Fallback Toggle Switch */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="text-xs font-bold text-white block">Automatic Failover & Quota Protection</span>
              <span className="text-[11px] text-azure-100/60">
                If primary provider returns error 429 / resource exhausted, automatically retry request using secondary provider.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.fallbackEnabled}
                onChange={(e) => setConfig(prev => ({ ...prev, fallbackEnabled: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Grid: Gemini & DeepSeek API Keys Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CARD 1: GOOGLE GEMINI API KEY */}
        <div className="bg-white p-6 rounded-3xl border border-indigo-950/10 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-indigo-950/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                <Zap size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black text-indigo-950">Google Gemini API Key</h3>
                <span className="text-[10px] text-indigo-900/50 font-medium">GEMINI_API_KEY</span>
              </div>
            </div>

            {config.hasGeminiKey ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 size={12} /> Key Configured
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                <AlertCircle size={12} /> Key Missing
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-indigo-950 block mb-1.5 flex items-center justify-between">
                <span>API Secret Key</span>
                <span className="text-[10px] text-indigo-900/40 font-normal">Stored securely in database</span>
              </label>
              <div className="relative">
                <input
                  type={showGeminiKey ? 'text' : 'password'}
                  value={config.geminiApiKey}
                  onChange={(e) => setConfig(prev => ({ ...prev, geminiApiKey: e.target.value }))}
                  placeholder="AIzaSy..."
                  className="w-full bg-azure-50/70 border border-indigo-950/15 rounded-xl px-3.5 py-2.5 text-xs font-mono text-indigo-950 focus:outline-none focus:border-sapphire-600 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-900/40 hover:text-indigo-950"
                >
                  {showGeminiKey ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-indigo-950 block mb-1.5">Model Alias / Identifier</label>
              <select
                value={config.geminiModel}
                onChange={(e) => setConfig(prev => ({ ...prev, geminiModel: e.target.value }))}
                className="w-full bg-azure-50/70 border border-indigo-950/15 rounded-xl px-3.5 py-2.5 text-xs font-bold text-indigo-950 focus:outline-none focus:border-sapphire-600 cursor-pointer"
              >
                <option value="gemini-3.7-flash">gemini-3.7-flash (Recommended, Default)</option>
                <option value="gemini-3.6-flash">gemini-3.6-flash</option>
                <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                <option value="gemini-2.5-pro">gemini-2.5-pro</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleTestGemini}
                disabled={testingGemini}
                className="w-full inline-flex items-center justify-center gap-2 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 px-4 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {testingGemini ? <RefreshCw size={14} className="animate-spin" /> : <Activity size={14} />}
                <span>{testingGemini ? 'Testing Gemini Connection...' : 'Test Gemini API Connection'}</span>
              </button>
            </div>

            {geminiTestResult && (
              <div className={`p-3 rounded-xl border text-xs font-bold flex items-start gap-2 ${
                geminiTestResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                {geminiTestResult.success ? (
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p>{geminiTestResult.message || geminiTestResult.error}</p>
                  {geminiTestResult.latencyMs !== undefined && (
                    <span className="text-[10px] font-normal opacity-80 block mt-0.5">
                      Response Latency: {geminiTestResult.latencyMs}ms
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CARD 2: DEEPSEEK API KEY */}
        <div className="bg-white p-6 rounded-3xl border border-indigo-950/10 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-indigo-950/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Cpu size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black text-indigo-950">DeepSeek API Key</h3>
                <span className="text-[10px] text-indigo-900/50 font-medium">DEEPSEEK_API_KEY</span>
              </div>
            </div>

            {config.hasDeepseekKey ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 size={12} /> Key Configured
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                <AlertCircle size={12} /> Key Missing
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-indigo-950 block mb-1.5 flex items-center justify-between">
                <span>API Secret Key</span>
                <span className="text-[10px] text-indigo-900/40 font-normal">Stored securely in database</span>
              </label>
              <div className="relative">
                <input
                  type={showDeepseekKey ? 'text' : 'password'}
                  value={config.deepseekApiKey}
                  onChange={(e) => setConfig(prev => ({ ...prev, deepseekApiKey: e.target.value }))}
                  placeholder="sk-..."
                  className="w-full bg-azure-50/70 border border-indigo-950/15 rounded-xl px-3.5 py-2.5 text-xs font-mono text-indigo-950 focus:outline-none focus:border-sapphire-600 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowDeepseekKey(!showDeepseekKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-900/40 hover:text-indigo-950"
                >
                  {showDeepseekKey ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-indigo-950 block mb-1.5">Model Identifier</label>
              <select
                value={config.deepseekModel}
                onChange={(e) => setConfig(prev => ({ ...prev, deepseekModel: e.target.value }))}
                className="w-full bg-azure-50/70 border border-indigo-950/15 rounded-xl px-3.5 py-2.5 text-xs font-bold text-indigo-950 focus:outline-none focus:border-sapphire-600 cursor-pointer"
              >
                <option value="deepseek-chat">deepseek-chat (V3 - Standard & Fast)</option>
                <option value="deepseek-reasoner">deepseek-reasoner (R1 - Deep Thinking)</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleTestDeepseek}
                disabled={testingDeepseek}
                className="w-full inline-flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 px-4 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {testingDeepseek ? <RefreshCw size={14} className="animate-spin" /> : <Activity size={14} />}
                <span>{testingDeepseek ? 'Testing DeepSeek Connection...' : 'Test DeepSeek API Connection'}</span>
              </button>
            </div>

            {deepseekTestResult && (
              <div className={`p-3 rounded-xl border text-xs font-bold flex items-start gap-2 ${
                deepseekTestResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                {deepseekTestResult.success ? (
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p>{deepseekTestResult.message || deepseekTestResult.error}</p>
                  {deepseekTestResult.latencyMs !== undefined && (
                    <span className="text-[10px] font-normal opacity-80 block mt-0.5">
                      Response Latency: {deepseekTestResult.latencyMs}ms
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
