import { useState, useEffect, useRef } from 'react';
import { 
  Bot, Sparkles, Send, RefreshCw, CheckCircle2, AlertCircle, Trash2, 
  Copy, Check, Flame, Tags, FileText, ArrowRight, ExternalLink, 
  Zap, Cpu, ShieldAlert, CheckSquare, X, Code, Globe, HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { addPostToStore } from '../../lib/mock-data';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  provider?: 'gemini' | 'deepseek';
  model?: string;
  latencyMs?: number;
  isError?: boolean;
  proposedAction?: {
    type: 'create_post' | 'batch_codes' | 'seo_update' | 'custom_action';
    title?: string;
    game?: string;
    category?: 'Codes' | 'News';
    slug?: string;
    version?: string;
    content_text?: string;
    codes?: Array<{ code: string; reward: string; status: string }>;
    applied?: boolean;
  };
}

export function AIAssistantPanel() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('trendpulsex_admin_ai_chat');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 'welcome-1',
        sender: 'assistant',
        text: '👋 **Hello Admin! I am your TrendPulseX AI Copilot**, powered by server-side Google Gemini & DeepSeek.\n\nI can help you:\n• **Research & synthesize active game codes** (Roblox Blox Fruits, Fisch, Blade Ball, etc.)\n• **Draft high-impact viral gaming news** & leak articles\n• **Propose structured actions safely** (you always review & approve before saving to the database)\n• **Analyze traffic trends, SEO keywords, & gaming meta**\n\nHow can I assist your platform operations today?',
        timestamp: new Date().toISOString(),
        provider: 'gemini',
        model: 'gemini-3.6-flash',
      }
    ];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeProvider, setActiveProvider] = useState<'gemini' | 'deepseek'>('gemini');
  const [activeModel, setActiveModel] = useState<string>('gemini-3.6-flash');
  const [actionProcessing, setActionProcessing] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Persist chat history in local storage
  useEffect(() => {
    localStorage.setItem('trendpulsex_admin_ai_chat', JSON.stringify(messages));
  }, [messages]);

  // Load server AI config to sync default provider & model
  useEffect(() => {
    fetch('/api/admin/ai-config')
      .then(res => res.json())
      .then(data => {
        if (data.primaryProvider) {
          setActiveProvider(data.primaryProvider);
          if (data.primaryProvider === 'deepseek') {
            setActiveModel(data.deepseekModel || 'deepseek-chat');
          } else {
            setActiveModel(data.geminiModel || 'gemini-3.6-flash');
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleProviderChange = (provider: 'gemini' | 'deepseek') => {
    setActiveProvider(provider);
    if (provider === 'deepseek') {
      setActiveModel('deepseek-chat');
    } else {
      setActiveModel('gemini-3.6-flash');
    }
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setLoading(true);
    setActionSuccessMsg(null);

    const historyPayload = messages.slice(-8).map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

    try {
      const res = await fetch('/api/admin/ai-assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
          provider: activeProvider,
          model: activeModel,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const assistantMsg: ChatMessage = {
          id: `ast_${Date.now()}`,
          sender: 'assistant',
          text: data.reply || 'Analysis completed successfully.',
          timestamp: new Date().toISOString(),
          provider: data.provider || activeProvider,
          model: data.model || activeModel,
          latencyMs: data.latencyMs,
          proposedAction: data.proposedAction || undefined,
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        const errorMsg: ChatMessage = {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ **AI Service Error (${data.provider || activeProvider}):** ${data.error || 'Unable to complete AI request.'}\n\n*Troubleshooting Tip:* Please verify your API Key and active connection in the **AI Service & API Keys** tab.`,
          timestamp: new Date().toISOString(),
          provider: activeProvider,
          isError: true,
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: `⚠️ **Network / Connection Error:** ${err?.message || 'Server did not respond.'}\n\nPlease check server connectivity and verify your backend environment keys.`,
        timestamp: new Date().toISOString(),
        provider: activeProvider,
        isError: true,
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Clear AI Assistant conversation history?')) {
      const initialWelcome: ChatMessage = {
        id: `welcome_${Date.now()}`,
        sender: 'assistant',
        text: '🧹 Chat cleared. Ready for your next query or content generation task!',
        timestamp: new Date().toISOString(),
        provider: activeProvider,
        model: activeModel,
      };
      setMessages([initialWelcome]);
      localStorage.removeItem('trendpulsex_admin_ai_chat');
    }
  };

  // Safe Execution of Proposed Database Actions
  const handleApproveAction = async (msgId: string, action: NonNullable<ChatMessage['proposedAction']>) => {
    setActionProcessing(msgId);
    setActionSuccessMsg(null);

    try {
      const res = await fetch('/api/admin/ai-assistant/execute-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Also update local mock data cache to ensure instant UI reactivity
        if (data.post) {
          await addPostToStore(data.post);
        }

        // Mark action as applied in chat history
        setMessages(prev =>
          prev.map(m => {
            if (m.id === msgId && m.proposedAction) {
              return {
                ...m,
                proposedAction: { ...m.proposedAction, applied: true },
              };
            }
            return m;
          })
        );

        setActionSuccessMsg(`✓ Successfully executed and saved: "${action.title || action.game || 'New Item'}" to live database!`);
        setTimeout(() => setActionSuccessMsg(null), 5000);
      } else {
        alert(`Failed to execute action: ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      alert(`Execution failed: ${err?.message || 'Network error'}`);
    } finally {
      setActionProcessing(null);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Quick Prompt Chips
  const QUICK_PROMPTS = [
    { label: '🔥 Generate Viral Roblox Leak', prompt: 'Generate a high-impact viral leak and news article for Roblox Blox Fruits Dragon Rework with working promo codes and HTML content.' },
    { label: '🎮 Curate Fisch Active Codes', prompt: 'Research and curate all verified active promo codes for Roblox Fisch including carbon rods, cash, and mutation luck.' },
    { label: '⚔️ Blade Ball Code Drop', prompt: 'Provide all working reward codes for Roblox Blade Ball with spin tickets and sword skins formatted for publishing.' },
    { label: '📈 SEO & Title Optimizer', prompt: 'Suggest 5 high-CTR gaming article title variations and meta descriptions optimized for gaming search intent in 2026.' },
    { label: '🧹 Expired Codes Audit', prompt: 'Help me review active game codes and explain how to maintain high credibility and CTR on our promo codes directory.' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-indigo-950/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sapphire-600 via-sky-500 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-sapphire-600/20">
              <Bot size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-indigo-950">AI Copilot & Operations Assistant</h2>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Server Mode
                </span>
              </div>
              <p className="text-xs text-indigo-900/60 font-medium mt-0.5">
                Multi-model intelligence powered by Google Gemini &amp; DeepSeek. Safely drafts articles, codes, and data with non-destructive admin approval.
              </p>
            </div>
          </div>
        </div>

        {/* Top Controls: Provider Toggle & Clear History */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {/* Provider Selector Switch */}
          <div className="flex items-center bg-azure-50 p-1 rounded-2xl border border-indigo-950/10">
            <button
              onClick={() => handleProviderChange('gemini')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeProvider === 'gemini'
                  ? 'bg-sapphire-600 text-white shadow-sm'
                  : 'text-indigo-950/70 hover:text-indigo-950'
              }`}
            >
              <Zap size={13} className={activeProvider === 'gemini' ? 'text-sky-300' : 'text-sky-600'} />
              <span>Google Gemini</span>
            </button>
            <button
              onClick={() => handleProviderChange('deepseek')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeProvider === 'deepseek'
                  ? 'bg-indigo-900 text-white shadow-sm'
                  : 'text-indigo-950/70 hover:text-indigo-950'
              }`}
            >
              <Cpu size={13} className={activeProvider === 'deepseek' ? 'text-sky-300' : 'text-indigo-600'} />
              <span>DeepSeek</span>
            </button>
          </div>

          <button
            onClick={handleClearChat}
            title="Clear Chat History"
            className="p-2 text-indigo-900/50 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-indigo-950/10 transition-colors cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Global Success Notification */}
      {actionSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2.5 shadow-xs animate-fadeIn">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Quick Action Suggestion Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-black uppercase tracking-wide text-indigo-900/50 shrink-0 flex items-center gap-1">
          <Sparkles size={12} className="text-sapphire-600" /> Quick Prompts:
        </span>
        {QUICK_PROMPTS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q.prompt)}
            disabled={loading}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-sapphire-50 border border-indigo-950/10 text-xs font-bold text-indigo-950 transition-all cursor-pointer shrink-0 disabled:opacity-50 hover:border-sapphire-300 active:scale-95 shadow-2xs"
          >
            <span>{q.label}</span>
          </button>
        ))}
      </div>

      {/* Main Conversation Stream Window */}
      <div className="bg-white rounded-3xl border border-indigo-950/10 shadow-sm flex flex-col h-[580px] overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-azure-50/30">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                    msg.isError
                      ? 'bg-rose-100 text-rose-700 border border-rose-300'
                      : msg.provider === 'deepseek'
                      ? 'bg-indigo-900 text-sky-300'
                      : 'bg-gradient-to-tr from-sapphire-600 to-sky-500 text-white'
                  }`}>
                    {msg.isError ? <AlertCircle size={16} /> : <Bot size={16} />}
                  </div>
                )}

                <div className={`max-w-[88%] md:max-w-[78%] space-y-2`}>
                  {/* Message Bubble */}
                  <div className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    isUser
                      ? 'bg-gradient-to-r from-sapphire-600 to-indigo-700 text-white rounded-tr-none font-medium'
                      : msg.isError
                      ? 'bg-rose-50 border border-rose-200 text-rose-950 rounded-tl-none font-medium'
                      : 'bg-white border border-indigo-950/10 text-indigo-950 rounded-tl-none'
                  }`}>
                    
                    {/* Header info for assistant replies */}
                    {!isUser && !msg.isError && (
                      <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-indigo-950/5 text-[11px] font-bold text-indigo-900/50">
                        <div className="flex items-center gap-1.5">
                          <span className="capitalize font-black text-sapphire-700">
                            {msg.provider || 'gemini'}
                          </span>
                          <span>•</span>
                          <span className="font-mono text-[10px]">{msg.model || 'model'}</span>
                        </div>
                        {msg.latencyMs !== undefined && (
                          <span className="text-[10px] text-indigo-900/40">
                            {msg.latencyMs}ms
                          </span>
                        )}
                      </div>
                    )}

                    {/* Formatted Content */}
                    <div className="whitespace-pre-wrap font-sans break-words space-y-2">
                      {msg.text}
                    </div>

                    {/* Copy Button */}
                    {!isUser && (
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => handleCopyText(msg.id, msg.text)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-900/40 hover:text-sapphire-600 transition-colors cursor-pointer"
                        >
                          {copiedId === msg.id ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* NON-DESTRUCTIVE SAFE PROPOSED ACTION CARD */}
                  {msg.proposedAction && (
                    <div className={`p-4 rounded-2xl border transition-all ${
                      msg.proposedAction.applied
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                        : 'bg-gradient-to-br from-indigo-950 via-sapphire-950 to-slate-900 text-white border-sky-400/30 shadow-md'
                    }`}>
                      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <ShieldAlert size={16} className={msg.proposedAction.applied ? 'text-emerald-600' : 'text-sky-400'} />
                          <span className="text-xs font-black uppercase tracking-wider">
                            {msg.proposedAction.applied ? 'Action Executed & Saved' : 'Proposed Database Action (Requires Confirmation)'}
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-md font-bold uppercase bg-white/10 text-azure-200">
                          {msg.proposedAction.category || 'Content Post'}
                        </span>
                      </div>

                      <div className="pt-3 space-y-2 text-xs">
                        {msg.proposedAction.title && (
                          <div>
                            <span className="text-[10px] font-bold text-azure-200/60 block">Proposed Title:</span>
                            <span className="font-black text-sm text-white block">{msg.proposedAction.title}</span>
                          </div>
                        )}

                        {msg.proposedAction.codes && msg.proposedAction.codes.length > 0 && (
                          <div className="pt-1">
                            <span className="text-[10px] font-bold text-azure-200/60 block mb-1">
                              Included Promo Codes ({msg.proposedAction.codes.length}):
                            </span>
                            <div className="space-y-1">
                              {msg.proposedAction.codes.slice(0, 4).map((c, i) => (
                                <div key={i} className="flex items-center justify-between bg-black/40 px-2.5 py-1.5 rounded-lg font-mono text-[11px]">
                                  <span className="font-black text-sky-300">{c.code}</span>
                                  <span className="text-azure-100/70 text-[10px]">{c.reward}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons for Admin Confirmation */}
                        <div className="pt-3 flex items-center justify-between gap-2 flex-wrap border-t border-white/10">
                          <span className="text-[10px] text-azure-100/60">
                            {msg.proposedAction.applied ? '✓ Already saved to database' : 'Review details before approving'}
                          </span>

                          {!msg.proposedAction.applied ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleApproveAction(msg.id, msg.proposedAction!)}
                                disabled={actionProcessing === msg.id}
                                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-md shadow-emerald-500/25 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                              >
                                {actionProcessing === msg.id ? (
                                  <RefreshCw size={13} className="animate-spin" />
                                ) : (
                                  <CheckSquare size={13} />
                                )}
                                <span>{actionProcessing === msg.id ? 'Saving...' : 'Approve & Save to Database'}</span>
                              </button>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1 text-emerald-400 text-xs font-black">
                              <CheckCircle2 size={15} /> Published to Live Feed
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sapphire-600 to-sky-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot size={16} />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-none bg-white border border-indigo-950/10 text-xs font-bold text-indigo-950 flex items-center gap-2.5 shadow-2xs">
                <RefreshCw size={14} className="animate-spin text-sapphire-600" />
                <span>Generating response with {activeProvider === 'deepseek' ? 'DeepSeek' : 'Google Gemini'}...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-indigo-950/10 space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={`Ask ${activeProvider === 'deepseek' ? 'DeepSeek' : 'Google Gemini'} to research codes, draft articles, analyze SEO... (Enter to send)`}
                className="w-full bg-azure-50/70 border border-indigo-950/15 rounded-2xl px-4 py-3 text-xs sm:text-sm text-indigo-950 placeholder-indigo-900/40 focus:outline-none focus:border-sapphire-600 focus:ring-2 focus:ring-sapphire-600/20 resize-none max-h-32"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-r from-sapphire-600 to-indigo-700 hover:from-sapphire-500 hover:to-indigo-600 text-white transition-all cursor-pointer shadow-md shadow-sapphire-600/25 active:scale-95 disabled:opacity-50 shrink-0"
            >
              {loading ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </form>

          <div className="flex items-center justify-between text-[11px] text-indigo-900/50 font-medium px-1">
            <span className="flex items-center gap-1">
              <ShieldAlert size={12} className="text-emerald-600" />
              Non-destructive sandbox: all database updates require manual click confirmation.
            </span>
            <span className="hidden sm:inline font-mono text-[10px]">
              Active: {activeProvider} ({activeModel})
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
