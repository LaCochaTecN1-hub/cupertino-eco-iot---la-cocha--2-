import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { formatTucumanDateTime } from '../../utils/date';
import { 
  BrainCircuit, 
  Loader2, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  RotateCw, 
  Flame, 
  CloudLightning, 
  ShieldAlert,
  Info
} from 'lucide-react';

/**
 * Native lightweight Markdown parser without external dependencies.
 * Correctly transforms **bold** into <strong>, ### into headers,
 * lists and paragraphs cleanly.
 */
function renderInlineFormatting(text: string) {
  // Split by **bold** tokens
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={idx} className="font-bold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function parseMarkdownContent(markdown: string) {
  const lines = markdown.split('\n');
  return lines.map((line, idx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      return <div key={idx} className="h-2" />;
    }

    // Dividers (--- or ***)
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      return <hr key={idx} className="my-2.5 border-slate-200/80 dark:border-white/10" />;
    }

    // Level 4 Header: ####
    if (trimmed.startsWith('#### ')) {
      return (
        <h4 key={idx} className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mt-3 mb-1 font-heading">
          {renderInlineFormatting(trimmed.replace(/^####\s+/, ''))}
        </h4>
      );
    }

    // Level 3 Header: ###
    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={idx} className="text-sm font-bold text-slate-900 dark:text-white mt-3.5 mb-1.5 flex items-center gap-1.5 font-heading">
          {renderInlineFormatting(trimmed.replace(/^###\s+/, ''))}
        </h3>
      );
    }

    // Level 2 Header: ##
    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={idx} className="text-base font-bold text-slate-900 dark:text-white mt-4 mb-2 font-heading">
          {renderInlineFormatting(trimmed.replace(/^##\s+/, ''))}
        </h2>
      );
    }

    // Bullet points: * or -
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      return (
        <div key={idx} className="flex items-start gap-2 ml-1 my-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#236391] dark:bg-[#74ACDF] mt-1.5 shrink-0" />
          <span className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
            {renderInlineFormatting(trimmed.substring(2))}
          </span>
        </div>
      );
    }

    // Numbered list: 1. , 2. , etc.
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (numberedMatch) {
      return (
        <div key={idx} className="flex items-start gap-2 ml-1 my-1">
          <span className="text-[11px] font-bold text-[#236391] dark:text-[#74ACDF] mt-0.5 shrink-0">
            {numberedMatch[1]}.
          </span>
          <span className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
            {renderInlineFormatting(numberedMatch[2])}
          </span>
        </div>
      );
    }

    // Regular paragraph
    return (
      <p key={idx} className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 my-1">
        {renderInlineFormatting(trimmed)}
      </p>
    );
  });
}

export const Screen4GeminiAlert: React.FC = () => {
  const { combined, loading: feedsLoading } = useApp();

  const [generating, setGenerating] = useState<boolean>(false);
  const [alertResult, setAlertResult] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Track if we already auto-generated for current data
  const hasTriggeredRef = useRef<boolean>(false);

  const {
    temp,
    humidity,
    pressure,
    windSpeed,
    windDirection,
    rain,
    pm25,
    co2,
    co,
    uv,
    created_at
  } = combined;

  const timestamp = created_at ? formatTucumanDateTime(created_at) : 'Sin registro reciente';
  const hasData = Boolean(temp || humidity || pressure || pm25 || rain || co2);

  const generateAlert = async () => {
    setGenerating(true);
    setError(null);
    try {
      const response = await fetch('https://cupertino-eco-iot-la-cocha-2.onrender.com/api/gemini/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temp,
          humidity,
          pressure,
          windSpeed,
          windDirection,
          rain,
          pm25,
          co2,
          co,
          uv,
          timestamp
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setAlertResult(data.alertText);
      setGeneratedAt(data.generatedAt);
    } catch (err: any) {
      console.error('Error in Gemini Alert:', err);
      setError(err.message || 'No se pudo generar la alerta con Inteligencia Artificial.');
    } finally {
      setGenerating(false);
    }
  };

  // Automate AI evaluation on mount via useEffect when telemetry is available
  useEffect(() => {
    if (!hasTriggeredRef.current && !feedsLoading && hasData) {
      hasTriggeredRef.current = true;
      generateAlert();
    }
  }, [feedsLoading, hasData]);

  const handleCopy = () => {
    if (!alertResult) return;
    navigator.clipboard.writeText(alertResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    if (!alertResult) return;

    window.speechSynthesis.cancel();
    // Strip markdown characters before reading speech
    const cleanSpeechText = alertResult.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
    utterance.lang = 'es-AR';
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const isHighRisk = alertResult && (
    alertResult.toLowerCase().includes('alto') ||
    alertResult.toLowerCase().includes('crítico') ||
    alertResult.toLowerCase().includes('alerta roja')
  );

  const isModerateRisk = alertResult && (
    alertResult.toLowerCase().includes('moderado') ||
    alertResult.toLowerCase().includes('precaución') ||
    alertResult.toLowerCase().includes('alerta amarilla')
  );

  return (
    <div className="space-y-4 pb-24">
      {/* Informacion del Modelo de IA */}
      <div className="cupertino-card rounded-2xl p-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                Alerta Temprana con IA
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Google Generative AI • Evaluación Automática
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {alertResult && (
              <button
                onClick={generateAlert}
                disabled={generating}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 active:scale-95 transition-all"
                title="Reevaluar con datos actuales"
              >
                <RotateCw className={`w-4 h-4 ${generating ? 'animate-spin text-[#236391]' : ''}`} />
              </button>
            )}
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              Análisis Ambiental
            </span>
          </div>
        </div>

        {/* Input Telemetry Pill Box */}
        <div className="mt-3.5 p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/50 dark:border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span>Telemetría Analizada (2 Canales):</span>
            <span className="font-mono text-[11px] text-[#236391] dark:text-[#74ACDF]">
              {timestamp}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-700/50 border border-slate-200/40 dark:border-white/5">
              <span className="text-slate-400 block text-[10px]">Temp</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">{temp ? `${temp}°C` : '--'}</span>
            </div>
            <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-700/50 border border-slate-200/40 dark:border-white/5">
              <span className="text-slate-400 block text-[10px]">Humedad</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">{humidity ? `${humidity}%` : '--'}</span>
            </div>
            <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-700/50 border border-slate-200/40 dark:border-white/5">
              <span className="text-slate-400 block text-[10px]">PM2.5 (Zafra)</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{pm25 ? `${pm25} µg/m³` : '--'}</span>
            </div>
            <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-700/50 border border-slate-200/40 dark:border-white/5">
              <span className="text-slate-400 block text-[10px]">Lluvia</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">{rain ? `${rain} mm` : '--'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loader2 while evaluating */}
      {generating && (
        <div className="cupertino-card rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#236391] dark:text-[#74ACDF] animate-spin" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 font-heading">
              Evaluando riesgos ambientales en La Cocha...
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              Analizando parámetros de zafra (humo y PM2.5) y frentes de tormenta en la cuenca pedemontana.
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !generating && (
        <div className="rounded-2xl p-4 bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Fallo al conectar con IA Gemini</span>
          </div>
          <p className="text-xs leading-relaxed opacity-90">{error}</p>
          <button
            onClick={generateAlert}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 active:scale-95 transition-all shadow-sm"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Reintentar Evaluación</span>
          </button>
        </div>
      )}

      {/* Alert Result Display Card with Markdown Formatting */}
      {!generating && alertResult && (
        <div className="cupertino-card rounded-2xl p-5 border border-slate-200/60 dark:border-white/10 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-white/10">
            <div className="flex items-center gap-2">
              <ShieldAlert className={`w-5 h-5 ${isHighRisk ? 'text-rose-500' : isModerateRisk ? 'text-amber-500' : 'text-emerald-500'}`} />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-heading">
                Reporte Técnico de Riesgo
              </span>
            </div>

            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
              isHighRisk 
                ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' 
                : isModerateRisk 
                  ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' 
                  : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
            }`}>
              {isHighRisk ? 'Riesgo Alto' : isModerateRisk ? 'Riesgo Moderado' : 'Riesgo Bajo / Óptimo'}
            </span>
          </div>

          {/* Quick Context Badges */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-700 dark:text-orange-400 font-medium">
              <Flame className="w-3.5 h-3.5" />
              Impacto de Zafra y PM2.5
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-400 font-medium">
              <CloudLightning className="w-3.5 h-3.5" />
              Crecidas Cuenca Aconquija
            </span>
          </div>

          {/* Alert Body Text Rendered with Native Markdown Support */}
          <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50/70 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200/40 dark:border-white/5 font-sans space-y-1">
            {parseMarkdownContent(alertResult)}
          </div>

          {/* Required Legal Disclaimer */}
          <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/50 dark:border-white/5 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic leading-relaxed">
              Nota: Este es un análisis automatizado generado por Inteligencia Artificial basado en telemetría en tiempo real. Los dictámenes pueden contener imprecisiones y no reemplazan el criterio de protección civil.
            </p>
          </div>

          {/* Action Toolbar (Audio TTS, Copy) */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-white/5 text-xs text-slate-500">
            <span>Evaluación generada automáticamente</span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSpeak}
                className={`p-2 rounded-xl transition-all active:scale-95 flex items-center gap-1.5 font-medium ${
                  isSpeaking 
                    ? 'bg-rose-500 text-white' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
                title={isSpeaking ? "Detener audio" : "Escuchar alerta por voz"}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="text-[11px]">{isSpeaking ? 'Detener' : 'Escuchar'}</span>
              </button>

              <button
                onClick={handleCopy}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-all active:scale-95 flex items-center gap-1.5 font-medium"
                title="Copiar texto de alerta"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span className="text-[11px]">{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* When no telemetry is present yet */}
      {!generating && !alertResult && !error && (
        <div className="cupertino-card rounded-2xl p-6 text-center space-y-2 text-slate-500">
          <BrainCircuit className="w-7 h-7 text-slate-400 mx-auto" />
          <p className="text-xs">
            {hasData 
              ? 'Iniciando diagnóstico ambiental con IA...' 
              : 'Esperando datos de telemetría de los canales ThingSpeak para evaluar la alerta automática.'}
          </p>
        </div>
      )}
    </div>
  );
};
