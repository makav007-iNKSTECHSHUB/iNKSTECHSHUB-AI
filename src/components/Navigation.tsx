import React from 'react';
import { Terminal, ListTodo, Server, Globe2, ShieldCheck } from 'lucide-react';
import { ActiveTab, LanguageCode } from '../types';
import { translations } from '../data/initialData';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  currentLanguage: LanguageCode;
  taskCountP0: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  currentLanguage,
  taskCountP0,
}) => {
  const t = translations[currentLanguage];

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'console',
      label: t.navConsole,
      icon: <Terminal className="w-4 h-4" />,
    },
    {
      id: 'task-matrix',
      label: t.navTasks,
      icon: <ListTodo className="w-4 h-4" />,
      badge: taskCountP0 > 0 ? taskCountP0 : undefined,
    },
    {
      id: 'sourcing-blueprint',
      label: t.navSourcing,
      icon: <Server className="w-4 h-4" />,
    },
    {
      id: 'timezones',
      label: t.navTimezones,
      icon: <Globe2 className="w-4 h-4" />,
    },
    {
      id: 'encrypted-vault',
      label: t.navEncryptedVault,
      icon: <ShieldCheck className="w-4 h-4" />,
    },
  ];

  return (
    <nav className="bg-[#020202] border-b border-[#1a1a1a] px-4 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-2 px-4 py-2 text-[11px] uppercase tracking-widest font-mono font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#121212] text-white border border-[#2a2a2a]'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-[#080808]'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-zinc-600'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className="ml-1 px-1.5 py-0.5 bg-[#1f0a0a] text-rose-400 border border-rose-900/60 font-mono text-[9px] font-bold tracking-normal">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
