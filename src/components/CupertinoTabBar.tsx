import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  Activity, 
  LineChart, 
  BrainCircuit, 
  Table2, 
  BookOpen, 
  ShieldCheck 
} from 'lucide-react';

interface TabItem {
  id: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const CupertinoTabBar: React.FC = () => {
  const { activeTab, setActiveTab, isAdmin } = useApp();

  const tabs: TabItem[] = [
    { id: 1, label: 'Inicio', icon: Home },
    { id: 2, label: 'Telemetría', icon: Activity },
    { id: 3, label: 'Gráficos', icon: LineChart },
    { id: 4, label: 'Alerta IA', icon: BrainCircuit, badge: 'Gemini' },
    { id: 5, label: 'Historial', icon: Table2 },
    { id: 6, label: 'Comunidad', icon: BookOpen },
    { id: 7, label: 'Admin', icon: ShieldCheck, badge: isAdmin ? 'ON' : undefined }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 w-full cupertino-glass border-t border-slate-200/60 dark:border-white/10 safe-area-bottom pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-md mx-auto flex items-center overflow-x-auto no-scrollbar justify-start gap-3 px-4 py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 min-w-[56px] relative flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all duration-200 active:scale-90 ${
                isActive
                  ? 'text-[#236391] dark:text-[#74ACDF] font-semibold'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badge && (
                  <span
                    className={`absolute -top-1.5 -right-3 text-[9px] font-bold px-1 py-0.2 rounded-full leading-tight ${
                      tab.badge === 'ON'
                        ? 'bg-emerald-500 text-white animate-pulse'
                        : 'bg-[#236391] text-white dark:bg-[#74ACDF] dark:text-slate-900'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight truncate max-w-[54px]">
                {tab.label}
              </span>

              {/* Active pill indicator */}
              {isActive && (
                <span className="absolute -bottom-0.5 w-4 h-0.5 rounded-full bg-[#236391] dark:bg-[#74ACDF]" />
              )}
            </button>
          );
        })}
      </div>

      {/* iOS Home Indicator Bar */}
      <div className="w-full flex justify-center pb-1">
        <div className="w-32 h-1 bg-slate-300 dark:bg-slate-700 rounded-full opacity-60" />
      </div>
    </nav>
  );
};
