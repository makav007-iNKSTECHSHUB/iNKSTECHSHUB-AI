import React, { useState, useEffect } from 'react';
import { Cpu, Lock, Globe, Shield, Clock, Sparkles, Key, Check } from 'lucide-react';
import { LanguageCode, EngineMode } from '../types';
import { translations } from '../data/initialData';
import { Logo } from './Logo';

interface HeaderProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  activeEngine: EngineMode;
  onEngineChange: (engine: EngineMode) => void;
  onOpenShareModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  activeEngine,
  onEngineChange,
  onOpenShareModal,
}) => {
  const [time, setTime] = useState<string>('');
  const [zurichTime, setZurichTime] = useState<string>('');

  const t = translations[currentLanguage];

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setTime(now.toISOString().substring(11, 19) + ' UTC');
      setZurichTime(
        now.toLocaleTimeString('de-CH', {
          timeZone: 'Europe/Zurich',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' CET'
      );
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const languages: { code: LanguageCode; label: string; flag: string }[] = [
    { code: 'en', label: 'English (US/UK)', flag: '🇬🇧' },
    { code: 'de', label: 'Deutsch (Zürich/Berlin)', flag: '🇨🇭' },
    { code: 'fr', label: 'Français (Paris)', flag: '🇫🇷' },
    { code: 'es', label: 'Español (Madrid)', flag: '🇪🇸' },
    { code: 'ru', label: 'Русский (YandexAI)', flag: '🇷🇺' },
    { code: 'ja', label: '日本語 (Tokyo)', flag: '🇯🇵' },
    { code: 'ar', label: 'العربية (Dubai)', flag: '🇦🇪' },
    { code: 'nl', label: 'Nederlands (Amsterdam)', flag: '🇳🇱' },
  ];

  return (
    <header className="border-b border-[#1a1a1a] bg-[#020202]/95 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3 text-zinc-100">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Creator Identification */}
        <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-white border border-[#222222] p-0.5 rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-md">
              <Logo size={36} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-light tracking-[0.2em] uppercase text-white flex items-center gap-1.5">
                  iNKSTECHSHUB <span className="font-bold text-white">AI</span>
                </h1>
                <span className="text-[9px] uppercase font-mono px-2 py-0.5 bg-[#111111] text-zinc-400 border border-[#222222] font-semibold tracking-widest">
                  v4.2 Enterprise
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase flex items-center gap-1 mt-0.5">
                <span>{t.creatorTag}</span>
              </p>
            </div>
          </div>

          {/* Clock indicator for mobile */}
          <div className="md:hidden text-right font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
            <div className="text-emerald-400 font-semibold">{zurichTime}</div>
            <div>{time}</div>
          </div>
        </div>

        {/* Global Live Clocks & Engine Selector */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* UTC & Zurich Clocks */}
          <div className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-[#080808] border border-[#1a1a1a] text-[11px] font-mono">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-zinc-600">ZH:</span>
              <span className="text-emerald-400 font-semibold">{zurichTime}</span>
            </div>
            <span className="text-zinc-800">|</span>
            <div className="text-zinc-400">
              <span className="text-zinc-600">UTC:</span> {time}
            </div>
          </div>

          {/* Engine Persona Switcher Pill */}
          <div className="flex items-center bg-[#080808] border border-[#1a1a1a] p-1 text-xs">
            <span className="px-2 text-[10px] uppercase tracking-widest font-mono text-zinc-500 hidden sm:inline-block">
              {t.aiEngineMode}:
            </span>
            <select
              value={activeEngine}
              onChange={(e) => onEngineChange(e.target.value as EngineMode)}
              className="bg-[#020202] text-zinc-200 border border-[#222222] px-2 py-1 text-xs font-mono outline-none cursor-pointer focus:border-white/40"
            >
              <option value="inkstechshub">iNKSTECHSHUB European Architect</option>
              <option value="grok">Grok Logic Engine</option>
              <option value="alisa">Alisa YandexAI Engine</option>
              <option value="gemini">Gemini 3.6 Flash</option>
              <option value="claude">Claude 3.7 Synthesis</option>
            </select>
          </div>

          {/* Multi-Language Sync Dropdown */}
          <div className="relative flex items-center bg-[#080808] border border-[#1a1a1a] p-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-zinc-400 ml-1.5 mr-1" />
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="bg-[#020202] text-zinc-200 border border-[#222222] px-2 py-1 text-xs font-mono outline-none cursor-pointer focus:border-white/40"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Share Encrypted Link Trigger */}
          <button
            onClick={onOpenShareModal}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-white hover:bg-zinc-200 text-black font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer active:scale-95"
          >
            <Lock className="w-3 h-3 text-black" />
            <span>{t.shareEncryptedLink}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
