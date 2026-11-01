import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowRight, 
  GraduationCap, 
  ExternalLink,
  Users
} from 'lucide-react';

export const Screen1Intro: React.FC = () => {
  const { setActiveTab, setActiveCommunitySection } = useApp();

  const openFacebook = () => {
    // Official Facebook page for Escuela Técnica N° 1 La Cocha as requested
    window.open(
      'https://www.facebook.com/escuelatecnicalacocha', 
      '_blank', 
      'noopener,noreferrer'
    );
  };

  const handleOpenQuienesSomos = () => {
    setActiveCommunitySection('institution');
    setActiveTab(6);
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center py-4 px-2">
      {/* Centered Clean Cupertino Glass Panel */}
      <div className="w-full cupertino-card rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden flex flex-col items-center">
        {/* Subtle decorative atmospheric glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#74ACDF]/20 dark:bg-[#236391]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Institution Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#236391]/10 text-[#236391] dark:bg-[#74ACDF]/15 dark:text-[#74ACDF] border border-[#236391]/20 mb-4">
          <GraduationCap className="w-4 h-4" />
          <span>E.T. N° 1 La Cocha • Tucumán</span>
        </div>

        {/* Main Clean Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading leading-tight max-w-sm">
          La Cocha Respira Ciencia y Tecnología
        </h1>

        {/* Descriptive Text */}
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed max-w-md">
          Nodo ambiental IoT de la Escuela Técnica N° 1. Monitoreo en tiempo real del clima, calidad del aire y parámetros agroecológicos para la comunidad de La Cocha y el sur de Tucumán.
        </p>

        {/* Live micro status badge */}
        <div className="mt-4 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-white/5 inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Estación Meteorológica y Calidad del Aire Activa</span>
        </div>

        {/* Exactly 3 Requested Buttons */}
        <div className="mt-6 w-full max-w-xs space-y-2.5">
          {/* Button 1: Ir al Dashboard IoT */}
          <button
            onClick={() => setActiveTab(2)}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-[#236391] hover:bg-[#1a4a6d] text-white font-semibold text-sm shadow-md active:scale-98 transition-all"
          >
            <span>Ir al Dashboard IoT</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Button 2: Facebook Escolar (con enlace oficial) */}
          <button
            onClick={openFacebook}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold text-sm shadow-sm active:scale-98 transition-all"
          >
            <svg 
              className="w-4 h-4 fill-current" 
              viewBox="0 0 24 24"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>Facebook Escolar</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </button>

          {/* Button 3: Quiénes Somos (Setea section institution y navega a tab 6) */}
          <button
            onClick={handleOpenQuienesSomos}
            className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-white/80 hover:bg-white text-slate-800 dark:bg-slate-800/80 dark:hover:bg-slate-800 dark:text-slate-200 font-semibold text-sm border border-slate-200/80 dark:border-white/10 active:scale-98 transition-all"
          >
            <Users className="w-4 h-4 text-[#236391] dark:text-[#74ACDF]" />
            <span>Quiénes Somos</span>
          </button>
        </div>
      </div>
    </div>
  );
};
