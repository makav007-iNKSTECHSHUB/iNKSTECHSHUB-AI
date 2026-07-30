import React, { useState } from 'react';
import { Terminal, Send, Sparkles, Cpu, Copy, Check, RefreshCw, Zap, Server, Code2, ShieldAlert } from 'lucide-react';
import { EngineMode, LanguageCode } from '../types';
import { translations } from '../data/initialData';
import { Logo } from './Logo';

interface AIAssistantViewProps {
  currentLanguage: LanguageCode;
  activeEngine: EngineMode;
  onEngineChange: (engine: EngineMode) => void;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  currentLanguage,
  activeEngine,
  onEngineChange,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<{ prompt: string; response: string; engine: EngineMode; timestamp: string }[]>([]);

  const t = translations[currentLanguage];

  const presets = [
    {
      title: 'Commercial GPU Infrastructure & Bare-Metal Sourcing',
      prompt: 'Formulate a commercial sourcing blueprint for 4x NVIDIA H100 SXM5 GPU nodes interfaced with 16x Hetzner AX102 bare-metal servers. Include Swiss FADP/EU GDPR compliance, power efficiency, and cost optimization.'
    },
    {
      title: 'Minimalist Audio Architecture & Spatial DSP Synthesis',
      prompt: 'Design an ultra-low-latency WebAudio spatial synthesis engine with zero-jitter buffer management, minimalist acoustic feedback loops, and multi-channel frequency alignment.'
    },
    {
      title: 'High-End Creative Direction & Precision Design System',
      prompt: 'Specify precision design protocols for an executive dark UI with monospaced typographic hierarchy, strict geometric grid alignment, and anti-slop visual standards.'
    }
  ];

  const handleAnalyze = async (overridePrompt?: string) => {
    const query = overridePrompt || prompt;
    if (!query.trim()) return;

    setIsLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          engineMode: activeEngine,
          language: currentLanguage,
        }),
      });

      const data = await res.json();
      if (res.ok && data.response) {
        setResponse(data.response);
        setHistory((prev) => [
          {
            prompt: query,
            response: data.response,
            engine: activeEngine,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          ...prev,
        ]);
      } else {
        setResponse(`Error: ${data.error || 'Failed to fetch response from AI server.'}`);
      }
    } catch (err: any) {
      setResponse(`Network connection error: ${err?.message || String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const engineDescriptions: Record<EngineMode, { name: string; desc: string; icon: string }> = {
    inkstechshub: {
      name: 'iNKSTECHSHUB European Master Architect',
      desc: 'Mahmood\'s bespoke architecture engine. Precise European operational logic, minimalist framing, and high-end technical sourcing.',
      icon: '🏛️'
    },
    grok: {
      name: 'Grok Operational Logic Mode',
      desc: 'Hyper-direct, witty, unfiltered technical analysis focusing on maximum execution velocity.',
      icon: '⚡'
    },
    alisa: {
      name: 'Alisa YandexAI Mode',
      desc: 'Eurasian structural precision, resilient infrastructure topology, and high-density algorithmic rigor.',
      icon: '🌐'
    },
    gemini: {
      name: 'Gemini 3.6 Flash Multimodal',
      desc: 'Google GenAI live server engine. Multimodal reasoning, real-time code synthesis, and cloud infrastructure expertise.',
      icon: '✨'
    },
    claude: {
      name: 'Claude 3.7 Synthesis',
      desc: 'Deliberate code synthesis, safety-first architecture, and immaculate technical trade-off evaluation.',
      icon: '🎯'
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Engine Mode Selector */}
      <div className="bg-[#080808] border border-[#1a1a1a] p-5 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-white border border-[#222222] p-0.5 rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-md">
              <Logo size={36} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-light uppercase tracking-[0.2em] text-white">
                  {engineDescriptions[activeEngine].name}
                </h2>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono mt-1 max-w-2xl">
                {engineDescriptions[activeEngine].desc}
              </p>
            </div>
          </div>

          {/* Engine Selector Pills */}
          <div className="flex flex-wrap gap-1 bg-[#020202] p-1 border border-[#1a1a1a]">
            {(['inkstechshub', 'grok', 'alisa', 'gemini', 'claude'] as EngineMode[]).map((e) => (
              <button
                key={e}
                onClick={() => onEngineChange(e)}
                className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest transition-all cursor-pointer ${
                  activeEngine === e
                    ? 'bg-white text-black'
                    : 'text-zinc-500 hover:text-white hover:bg-[#121212]'
                }`}
              >
                {e === 'inkstechshub' ? 'iNKSTECHSHUB' : e}
              </button>
            ))}
          </div>
        </div>

        {/* Preset Prompt Suggestions */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] font-semibold">
            Architectural Action Directives
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(preset.prompt);
                  handleAnalyze(preset.prompt);
                }}
                className="p-3 bg-[#0c0c0c] hover:bg-[#121212] border border-[#1a1a1a] hover:border-[#333333] text-left transition-all group cursor-pointer"
              >
                <div className="text-[11px] font-mono uppercase tracking-wider font-semibold text-zinc-300 group-hover:text-white flex items-center justify-between">
                  <span className="truncate">{preset.title}</span>
                  <Zap className="w-3 h-3 text-zinc-600 group-hover:text-white shrink-0 ml-1" />
                </div>
                <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1 font-mono">
                  {preset.prompt}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Prompt Box */}
      <div className="bg-[#080808] border border-[#1a1a1a] p-4 shadow-2xl">
        <div className="relative">
          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t.promptPlaceholder}
            className="w-full bg-[#020202] border border-[#1a1a1a] p-4 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-[#444444] font-mono resize-none"
          />
          <div className="flex items-center justify-between mt-3">
            <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="uppercase tracking-widest text-[10px]">Server `@google/genai` Engine Active</span>
            </div>
            <button
              onClick={() => handleAnalyze()}
              disabled={isLoading || !prompt.trim()}
              className="px-6 py-2.5 bg-white hover:bg-zinc-200 disabled:opacity-40 text-black font-bold uppercase text-[11px] tracking-[0.2em] flex items-center gap-2 transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                  <span>{t.generating}</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-black" />
                  <span>{t.runAnalysis}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Response Box */}
      {response && (
        <div className="bg-[#080808] border border-[#1a1a1a] p-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1a1a1a]">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-white" />
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white font-bold">
                iNKSTECHSHUB Operational Synthesis Output
              </h3>
            </div>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-[#121212] hover:bg-[#1a1a1a] text-zinc-300 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 border border-[#262626] cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Analysis</span>
                </>
              )}
            </button>
          </div>

          <div className="text-xs leading-relaxed font-mono whitespace-pre-wrap text-zinc-200 bg-[#020202] p-5 border border-[#1a1a1a]">
            {response}
          </div>
        </div>
      )}

      {/* Previous Analysis History */}
      {history.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-[#1a1a1a]">
          <h4 className="text-[10px] font-mono uppercase text-zinc-500 tracking-[0.2em] font-semibold">
            Recent Architectural Queries ({history.length})
          </h4>
          <div className="space-y-3">
            {history.slice(0, 3).map((item, index) => (
              <div key={index} className="p-4 bg-[#080808] border border-[#1a1a1a] space-y-2 font-mono">
                <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase tracking-widest">
                  <span className="text-white font-bold">[{item.engine}]</span>
                  <span>{item.timestamp}</span>
                </div>
                <p className="text-xs text-zinc-300 font-medium">
                  Q: "{item.prompt}"
                </p>
                <p className="text-[11px] text-zinc-500 line-clamp-2">
                  {item.response}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
