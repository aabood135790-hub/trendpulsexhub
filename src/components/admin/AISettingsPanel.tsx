import { useState, useEffect } from 'react';
import { 
  Bot, Sparkles, CheckCircle2, AlertCircle, RefreshCw, ShieldCheck, 
  Zap, Activity, Eye, EyeOff, Cpu, Layers, Server, Clock, 
  HelpCircle, ChevronRight, Check
} from 'lucide-react';

export interface DiscoveredModel {
  id: string;
  name: string;
  displayName: string;
  description: string;
  provider: 'gemini' | 'deepseek';
  isRecommended?: boolean;
  contextWindow?: string;
  status: 'available' | 'verified' | 'unverified';
}

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

export interface DiagnosticLogEntry {
  id: string;
  timestamp: string;
  provider: 'gemini' | 'deepseek';
  modelId: string;
  action: string;
  httpStatus: number;
  success: boolean;
  latencyMs: number;
  errorCategory?: string;
  errorMessage?: string;
  details?: string;
}

export function AISettingsPanel() {
  const [config, setConfig] = useState<AIServiceConfig>({
    geminiApiKey: '',
    deepseekApiKey: '',
    primaryProvider: 'gemini',
    fallbackEnabled: true,
    geminiModel: 'gemini-3.6-flash',
    deepseekModel: 'deepseek-chat',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);

  // Show / Hide API Keys state
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showDeepseekKey, setShowDeepseekKey] = useState(false);

  // Dynamic Discovered Models
  const [discoveringModels, setDiscoveringModels] = useState(false);
  const [geminiModels, setGeminiModels] = useState<DiscoveredModel[]>([]);
  const [deepseekModels, setDeepseekModels] = useState<DiscoveredModel[]>([]);
  const [discoveryError, setDiscoveryError] = useState<{ gemini?: string; deepseek?: string }>({});

  // Live Testing States
  const [testingGemini, setTestingGemini] = useState(false);
  const [geminiTestResult, setGeminiTestResult] = useState<{ 
    success: boolean; 
    message?: string; 
    error?: string; 
    errorCategory?: string;
    latencyMs?: number;
    modelId?: string;
    sampleResponse?: string;
  } | null>(null);

  const [testingDeepseek, setTestingDeepseek] = useState(false);
  const [deepseekTestResult, setDeepseekTestResult] = useState<{ 
    success: boolean; 
    message?: string; 
    error?: string; 
    errorCategory?: string;
    latencyMs?: number;
    modelId?: string;
    sampleResponse?: string;
  } | null>(null);

  // Diagnostics Activity History
  const [diagnosticsLogs, setDiagnosticsLogs] = useState<DiagnosticLogEntry[]>([]);
  const [loadingDiagnostics, setLoadingDiagnostics] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

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
          geminiModel: data.geminiModel || 'gemini-3.6-flash',
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

  // Discover dynamic available models from provider APIs
  const discoverModels = async () => {
    setDiscoveringModels(true);
    setDiscoveryError({});
    try {
      const res = await fetch('/api/admin/models');
      if (res.ok) {
        const data = await res.json();
        
        if (data.gemini?.success && Array.isArray(data.gemini.models)) {
          setGeminiModels(data.gemini.models);
          // If current model is not set or empty, set to activeModel or first recommended
          if (!config.geminiModel && data.gemini.activeModel) {
            setConfig(prev => ({ ...prev, geminiModel: data.gemini.activeModel }));
          }
        } else if (data.gemini?.error) {
          setDiscoveryError(prev => ({ ...prev, gemini: data.gemini.error }));
        }

        if (data.deepseek?.success && Array.isArray(data.deepseek.models)) {
          setDeepseekModels(data.deepseek.models);
        } else if (data.deepseek?.error) {
          setDiscoveryError(prev => ({ ...prev, deepseek: data.deepseek.error }));
        }
      }
    } catch (err: any) {
      console.error('Failed to discover models:', err);
    } finally {
      setDiscoveringModels(false);
    }
  };

  // Fetch recent diagnostic activity logs
  const loadDiagnostics = async () => {
    setLoadingDiagnostics(true);
    try {
      const res = await fetch('/api/admin/ai-diagnostics');
      if (res.ok) {
        const data = await res.json();
        setDiagnosticsLogs(data.logs || []);
      }
    } catch (err: any) {
      console.error('Failed to load diagnostics logs:', err);
    } finally {
      setLoadingDiagnostics(false);
    }
  };

  useEffect(() => {
    loadConfig();
    discoverModels();
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
        // Re-discover models after key save
        discoverModels();
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
          model: config.geminiModel || 'gemini-3.6-flash',
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
          model: config.deepseekModel || 'deepseek-chat',
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

  // Fallback lists if API hasn't returned yet
  const displayGeminiModels = geminiModels.length > 0 ? geminiModels : [
    { id: 'gemini-3.6-flash', name: 'gemini-3.6-flash', displayName: 'Gemini 3.6 Flash', description: 'Flagship high-speed model with structured JSON support', provider: 'gemini' as const, isRecommended: true, contextWindow: '1M tokens', status: 'available' as const },
    { id: 'gemini-3.1-flash-lite', name: 'gemini-3.1-flash-lite', displayName: 'Gemini 3.1 Flash Lite', description: 'Ultra-low latency model for high-frequency queries', provider: 'gemini' as const, isRecommended: true, contextWindow: '1M tokens', status: 'available' as const },
    { id: 'gemini-flash-latest', name: 'gemini-flash-latest', displayName: 'Gemini Flash Latest', description: 'Always points to the latest stable Flash release', provider: 'gemini' as const, isRecommended: true, contextWindow: '1M tokens', status: 'available' as const },
  ];

  const displayDeepseekModels = deepseekModels.length > 0 ? deepseekModels : [
    { id: 'deepseek-chat', name: 'deepseek-chat', displayName: 'DeepSeek-V3 (Chat)', description: 'High-speed general conversation and structured code extraction', provider: 'deepseek' as const, isRecommended: true, contextWindow: '64k tokens', status: 'available' as const },
    { id: 'deepseek-reasoner', name: 'deepseek-reasoner', displayName: 'DeepSeek-R1 (Reasoner)', description: 'Deep reasoning model with native chain-of-thought analysis', provider: 'deepseek' as const, isRecommended: false, contextWindow: '64k tokens', status: 'available' as const },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-indigo-950/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sapphire-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <Bot size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-indigo-950">AI Service & Multi-Model Architecture</h2>
              <p className="text-xs text-indigo-900/60 font-medium mt-0.5">
                Dynamic server-side model validation for Google Gemini & DeepSeek. Live testing, verified model discovery, and non-destructive failover.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={discoverModels}
            disabled={discoveringModels}
            className="inline-flex items-center justify-center gap-2 bg-azure-50 hover:bg-azure-100 text-indigo-950 px-4 py-2.5 rounded-2xl font-bold text-xs border border-indigo-950/10 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={14} className={discoveringModels ? 'animate-spin text-sapphire-600' : 'text-indigo-900/60'} />
            <span>{discoveringModels ? 'Discovering Models...' : 'Validate & Refresh Models'}</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sapphire-700 to-indigo-900 hover:from-sapphire-600 hover:to-indigo-800 text-white px-5 py-2.5 rounded-2xl font-black text-xs shadow-md shadow-sapphire-600/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <ShieldCheck size={15} />}
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
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
            The platform executes code scraping, automated trends generation, and AI Copilot queries using your selected <strong>Primary AI Provider</strong>. If rate limits (HTTP 429 quota exhaustion) occur, the server automatically fails over to the secondary provider without breaking frontend execution.
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
                  Default primary model with JSON schemas. Uses high-speed Gemini 3.6 Flash / Flash Lite.
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
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/30 text-sky-200 font-bold">V3 Chat & R1 Reasoner</span>
                </div>
                <p className="text-xs text-azure-100/60 leading-relaxed">
                  DeepSeek-Chat API. Excellent fallback or primary model for high-volume scrapers and deep analysis.
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

      {/* Grid: Gemini & DeepSeek API Keys & Model Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CARD 1: GOOGLE GEMINI API KEY & MODEL SELECTOR */}
        <div className="bg-white p-6 rounded-3xl border border-indigo-950/10 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-indigo-950/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                <Zap size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black text-indigo-950">Google Gemini Engine</h3>
                <span className="text-[10px] text-indigo-900/50 font-medium">Provider: Google DeepMind</span>
              </div>
            </div>

            {config.hasGeminiKey ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 size={12} /> Key Configured ({config.geminiKeySource || 'active'})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                <AlertCircle size={12} /> Key Missing
              </span>
            )}
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-indigo-950 block mb-1.5 flex items-center justify-between">
                <span>Gemini API Secret Key</span>
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-900/40 hover:text-indigo-950 cursor-pointer"
                >
                  {showGeminiKey ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Dynamic Model Dropdown */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-indigo-950">Active Model Identifier</label>
                <span className="text-[10px] font-bold text-sapphire-600 bg-sapphire-50 px-2 py-0.5 rounded-md">
                  {geminiModels.length > 0 ? `${geminiModels.length} models verified` : '3 verified models'}
                </span>
              </div>
              
              <select
                value={config.geminiModel}
                onChange={(e) => setConfig(prev => ({ ...prev, geminiModel: e.target.value }))}
                className="w-full bg-azure-50/70 border border-indigo-950/15 rounded-xl px-3.5 py-2.5 text-xs font-bold text-indigo-950 focus:outline-none focus:border-sapphire-600 cursor-pointer"
              >
                {displayGeminiModels.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.displayName} {m.isRecommended ? '⭐ (Recommended)' : ''}
                  </option>
                ))}
              </select>

              {/* Model Description info */}
              {(() => {
                const selected = displayGeminiModels.find(m => m.id === config.geminiModel) || displayGeminiModels[0];
                return selected ? (
                  <div className="mt-1.5 p-2 rounded-lg bg-azure-50/50 border border-indigo-950/5 text-[11px] text-indigo-900/70 flex items-start gap-1.5">
                    <Server size={12} className="text-sapphire-600 shrink-0 mt-0.5" />
                    <span>{selected.description} {selected.contextWindow ? `(${selected.contextWindow})` : ''}</span>
                  </div>
                ) : null;
              })()}
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
              <div className={`p-3.5 rounded-xl border text-xs font-bold flex items-start gap-2.5 ${
                geminiTestResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                {geminiTestResult.success ? (
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black">
                      {geminiTestResult.success ? 'Connected & Verified' : (geminiTestResult.errorCategory || 'Connection Failed')}
                    </span>
                    {geminiTestResult.latencyMs !== undefined && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/60">
                        {geminiTestResult.latencyMs}ms
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-normal text-indigo-950/80 leading-relaxed">
                    {geminiTestResult.message || geminiTestResult.error}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CARD 2: DEEPSEEK API KEY & MODEL SELECTOR */}
        <div className="bg-white p-6 rounded-3xl border border-indigo-950/10 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-indigo-950/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Cpu size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black text-indigo-950">DeepSeek Engine</h3>
                <span className="text-[10px] text-indigo-900/50 font-medium">Provider: DeepSeek AI</span>
              </div>
            </div>

            {config.hasDeepseekKey ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 size={12} /> Key Configured ({config.deepseekKeySource || 'active'})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                <AlertCircle size={12} /> Key Missing
              </span>
            )}
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-indigo-950 block mb-1.5 flex items-center justify-between">
                <span>DeepSeek API Secret Key</span>
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-900/40 hover:text-indigo-950 cursor-pointer"
                >
                  {showDeepseekKey ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Dynamic Model Dropdown */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-indigo-950">Active Model Identifier</label>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {deepseekModels.length > 0 ? `${deepseekModels.length} models verified` : '2 models verified'}
                </span>
              </div>
              
              <select
                value={config.deepseekModel}
                onChange={(e) => setConfig(prev => ({ ...prev, deepseekModel: e.target.value }))}
                className="w-full bg-azure-50/70 border border-indigo-950/15 rounded-xl px-3.5 py-2.5 text-xs font-bold text-indigo-950 focus:outline-none focus:border-sapphire-600 cursor-pointer"
              >
                {displayDeepseekModels.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.displayName} {m.isRecommended ? '⭐ (Recommended)' : ''}
                  </option>
                ))}
              </select>

              {/* Model Description info */}
              {(() => {
                const selected = displayDeepseekModels.find(m => m.id === config.deepseekModel) || displayDeepseekModels[0];
                return selected ? (
                  <div className="mt-1.5 p-2 rounded-lg bg-azure-50/50 border border-indigo-950/5 text-[11px] text-indigo-900/70 flex items-start gap-1.5">
                    <Server size={12} className="text-indigo-600 shrink-0 mt-0.5" />
                    <span>{selected.description} {selected.contextWindow ? `(${selected.contextWindow})` : ''}</span>
                  </div>
                ) : null;
              })()}
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
              <div className={`p-3.5 rounded-xl border text-xs font-bold flex items-start gap-2.5 ${
                deepseekTestResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                {deepseekTestResult.success ? (
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black">
                      {deepseekTestResult.success ? 'Connected & Verified' : (deepseekTestResult.errorCategory || 'Connection Failed')}
                    </span>
                    {deepseekTestResult.latencyMs !== undefined && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/60">
                        {deepseekTestResult.latencyMs}ms
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-normal text-indigo-950/80 leading-relaxed">
                    {deepseekTestResult.message || deepseekTestResult.error}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Diagnostics Activity History Drawer */}
      <div className="bg-white rounded-3xl border border-indigo-950/10 shadow-sm overflow-hidden">
        <div 
          onClick={() => {
            const next = !showDiagnostics;
            setShowDiagnostics(next);
            if (next) loadDiagnostics();
          }}
          className="p-5 flex items-center justify-between cursor-pointer hover:bg-azure-50/50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Layers size={16} />
            </div>
            <div>
              <h4 className="text-sm font-black text-indigo-950">AI Operations & Diagnostics Feed</h4>
              <p className="text-[11px] text-indigo-900/60 font-medium">Real-time latency metrics and execution status without revealing secret keys</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-sapphire-600">
            <span>{showDiagnostics ? 'Hide Feed' : 'View Feed'}</span>
            <ChevronRight size={16} className={`transform transition-transform ${showDiagnostics ? 'rotate-90' : ''}`} />
          </div>
        </div>

        {showDiagnostics && (
          <div className="p-5 pt-0 border-t border-indigo-950/5 space-y-3">
            <div className="flex items-center justify-between pt-3 pb-1">
              <span className="text-xs font-bold text-indigo-950">Recent 30 Requests</span>
              <button
                onClick={loadDiagnostics}
                disabled={loadingDiagnostics}
                className="text-[11px] font-bold text-sapphire-600 hover:text-sapphire-800 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw size={11} className={loadingDiagnostics ? 'animate-spin' : ''} />
                <span>Refresh Log</span>
              </button>
            </div>

            {diagnosticsLogs.length === 0 ? (
              <div className="p-6 text-center text-xs text-indigo-900/50 bg-azure-50/30 rounded-2xl">
                No recent diagnostic logs recorded yet. Test a connection or run a query in AI Copilot to see live telemetry.
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {diagnosticsLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-azure-50/40 border border-indigo-950/5 flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${log.success ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span className="font-black text-indigo-950 uppercase text-[10px] tracking-wider shrink-0">{log.provider}</span>
                      <span className="font-mono text-[11px] text-indigo-900/70 truncate">{log.modelId}</span>
                      <span className="text-[10px] text-indigo-900/50 shrink-0">({log.action})</span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-right">
                      <span className="font-mono text-[11px] font-bold text-indigo-950">{log.latencyMs}ms</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        log.success ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        HTTP {log.httpStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
