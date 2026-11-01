import React from 'react';
import { useApp } from '../context/AppContext';
import { formatTucumanTimeOnly } from '../utils/date';
import { 
  Wifi, 
  Battery, 
  RotateCw, 
  Sun, 
  Moon, 
  ShieldCheck, 
  MapPin, 
  Radio
} from 'lucide-react';

interface CupertinoHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const CupertinoHeader: React.FC<CupertinoHeaderProps> = ({
  title,
  subtitle,
  showBack,
  onBack
}) => {
  const { 
    isDarkMode, 
    toggleTheme, 
    loading, 
    fetchFeeds, 
    combined, 
    isAdmin 
  } = useApp();

  const currentTimeStr = new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Tucuman',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date());

  const lastUpdateTucuman = combined?.created_at 
    ? formatTucumanTimeOnly(combined.created_at)
    : null;

  return (
    <header className="sticky top-0 z-40 w-full cupertino-glass border-b border-slate-200/60 dark:border-white/10 transition-colors duration-200">
      {/* iOS Top Status Bar y Dynamic Island */}
      <div className="flex items-center justify-between px-6 pt-2 pb-1 text-xs font-semibold tracking-tight text-slate-800 dark:text-slate-200">
        <span className="w-16">{currentTimeStr}</span>
        
        {/* Dynamic Island Capsule */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white text-[10px] font-medium shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="tracking-wide">Eco-IoT • La Cocha</span>
        </div>

        {/* Battery y Signals */}
        <div className="flex items-center justify-end gap-1.5 w-16 text-slate-700 dark:text-slate-300">
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-4 h-4" />
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={onBack}
              className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-[#236391] dark:text-[#74ACDF] transition-transform active:scale-95"
              aria-label="Volver"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">
                {title}
              </h1>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" />
                  Admin
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#236391] dark:text-[#74ACDF]" />
                {subtitle || "La Cocha, Tucumán"}
              </span>

              {lastUpdateTucuman && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <Radio className="w-3 h-3 animate-pulse" />
                    {lastUpdateTucuman}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => fetchFeeds()}
            disabled={loading}
            className={`p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 active:scale-95 transition-all ${
              loading ? 'animate-spin text-[#236391]' : ''
            }`}
            title="Sincronizar telemetría de ThingSpeak"
            aria-label="Recargar telemetría"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 active:scale-95 transition-all"
            title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            aria-label="Alternar tema"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};
