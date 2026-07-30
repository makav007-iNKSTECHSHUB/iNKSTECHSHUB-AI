import React, { useState, useEffect } from 'react';
import { Globe2, Clock, User, CheckCircle2, MessageSquare, AlertCircle, Sun, Moon, Zap } from 'lucide-react';
import { TeamMember, LanguageCode } from '../types';
import { translations } from '../data/initialData';

interface TimezoneMatrixViewProps {
  teamMembers: TeamMember[];
  currentLanguage: LanguageCode;
}

interface CityTime {
  city: string;
  country: string;
  timezone: string;
  flag: string;
  timeStr: string;
  dateStr: string;
  isDaytime: boolean;
}

export const TimezoneMatrixView: React.FC<TimezoneMatrixViewProps> = ({
  teamMembers,
  currentLanguage,
}) => {
  const [cityTimes, setCityTimes] = useState<CityTime[]>([]);

  const t = translations[currentLanguage];

  const cities = [
    { city: 'Zurich', country: 'Switzerland', timezone: 'Europe/Zurich', flag: '🇨🇭' },
    { city: 'London', country: 'United Kingdom', timezone: 'Europe/London', flag: '🇬🇧' },
    { city: 'Tallinn', country: 'Estonia', timezone: 'Europe/Tallinn', flag: '🇪🇪' },
    { city: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai', flag: '🇦🇪' },
    { city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
    { city: 'New York', country: 'USA', timezone: 'America/New_York', flag: '🇺🇸' },
    { city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', flag: '🇸🇬' },
    { city: 'Amsterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam', flag: '🇳🇱' },
  ];

  useEffect(() => {
    const updateCityClocks = () => {
      const now = new Date();
      const updated = cities.map((c) => {
        const timeStr = now.toLocaleTimeString('en-US', {
          timeZone: c.timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });

        const hour = parseInt(timeStr.split(':')[0], 10);
        const isDaytime = hour >= 7 && hour < 20;

        const dateStr = now.toLocaleDateString('en-US', {
          timeZone: c.timezone,
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });

        return {
          ...c,
          timeStr,
          dateStr,
          isDaytime,
        };
      });

      setCityTimes(updated);
    };

    updateCityClocks();
    const interval = setInterval(updateCityClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#080808] border border-[#1a1a1a] p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#121212] text-white border border-[#2a2a2a]">
              <Globe2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-light uppercase tracking-[0.2em] text-white">
                {t.timezoneTitle}
              </h2>
              <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                {t.timezoneSubtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="px-3.5 py-2 bg-[#020202] border border-[#1a1a1a] text-[10px] font-mono uppercase tracking-widest text-zinc-300 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sync Window: 11:00 - 15:00 CET</span>
        </div>
      </div>

      {/* Global City Clocks Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cityTimes.map((c) => (
          <div
            key={c.city}
            className={`p-4 border transition-all ${
              c.isDaytime
                ? 'bg-[#080808] border-[#1a1a1a] hover:border-[#333333]'
                : 'bg-[#020202] border-[#121212] hover:border-[#222222]'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
              <span className="flex items-center gap-1.5 font-semibold text-zinc-200">
                <span>{c.flag}</span>
                <span>{c.city}</span>
              </span>
              {c.isDaytime ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
              )}
            </div>

            <div className="mt-2 text-base font-extrabold font-mono text-white tracking-widest">
              {c.timeStr || '--:--:--'}
            </div>

            <div className="text-[10px] font-mono text-zinc-500 mt-0.5 uppercase tracking-wider">
              {c.dateStr}
            </div>
          </div>
        ))}
      </div>

      {/* Global Team Roster with Working Status and Timezone Alignments */}
      <div className="bg-[#080808] border border-[#1a1a1a] p-6 shadow-2xl space-y-4">
        <h3 className="text-[10px] font-mono uppercase text-zinc-400 tracking-[0.2em] font-semibold flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-white" />
          Global Team Roster & Operational Synchronicity
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teamMembers.map((member) => {
            const memberCityTime = cityTimes.find((ct) => ct.city === member.city);

            const statusBadge =
              member.status === 'Online'
                ? 'bg-[#081a10] text-emerald-400 border-emerald-900/60'
                : member.status === 'In Deep Work'
                ? 'bg-[#150a1c] text-purple-300 border-purple-900/60'
                : member.status === 'In Sync'
                ? 'bg-[#0a121c] text-blue-400 border-blue-900/60'
                : 'bg-[#080808] text-zinc-500 border-[#1a1a1a]';

            return (
              <div
                key={member.id}
                className="p-4 bg-[#020202] border border-[#1a1a1a] space-y-3 hover:border-[#2a2a2a] transition-all font-mono"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-mono font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                      {member.name}
                      <span className={`text-[9px] font-mono px-2 py-0.5 border font-bold uppercase tracking-wider ${statusBadge}`}>
                        {member.status}
                      </span>
                    </h4>
                    <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                      {member.role}
                    </p>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-xs font-bold text-emerald-400 tracking-wider">
                      {memberCityTime?.timeStr || '--:--'}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      📍 {member.city}, {member.country}
                    </div>
                  </div>
                </div>

                {member.currentTask && (
                  <div className="p-2.5 bg-[#080808] border border-[#1a1a1a] text-[11px] font-mono text-zinc-300 leading-tight">
                    <span className="text-zinc-500 font-semibold uppercase text-[9px] tracking-wider">Active Mandate: </span>
                    {member.currentTask}
                  </div>
                )}

                <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono text-zinc-400">
                  <span className="text-zinc-500 uppercase tracking-wider text-[9px]">Langs:</span>
                  {member.languages.map((lang, i) => (
                    <span key={i} className="bg-[#080808] px-2 py-0.5 border border-[#1a1a1a] text-zinc-300">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
