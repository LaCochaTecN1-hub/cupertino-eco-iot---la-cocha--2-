import React, { useState } from 'react';
import { useApp, SENSOR_METADATA } from '../../context/AppContext';
import { SensorFieldKey } from '../../types';
import { formatTucumanTimeOnly } from '../../utils/date';
import { 
  ExternalLink, 
  Info,
  LineChart,
  Radio
} from 'lucide-react';

export const Screen3ChartsMap: React.FC = () => {
  const { 
    channelId, 
    channelId2,
    selectedSensorField, 
    navigateToField, 
    isDarkMode, 
    feeds1, 
    feeds2
  } = useApp();

  const [chartMode, setChartMode] = useState<'webview' | 'native'>('webview');

  const fields = Object.keys(SENSOR_METADATA) as SensorFieldKey[];
  const currentMeta = SENSOR_METADATA[selectedSensorField] || SENSOR_METADATA.c1_field1;

  // Determine active channel ID based on the sensor's channel assignment
  const activeChannelId = currentMeta.channelNum === 1 ? channelId : channelId2;
  const fieldNum = currentMeta.fieldNum;

  // URL of ThingSpeak chart:
  const bgColorHex = isDarkMode ? '1e293b' : 'ffffff';
  const chartColorHex = currentMeta.color.replace('#', '');
  const thingSpeakChartUrl = activeChannelId
    ? `https://thingspeak.com/channels/${activeChannelId}/charts/${fieldNum}?bgcolor=%23${bgColorHex}&color=%23${chartColorHex}&dynamic=true&results=60&type=line&update=15`
    : '';

  // Get relevant feed list for native vector fallback
  const activeFeeds = currentMeta.channelNum === 1 ? feeds1 : feeds2;
  const fieldKey = `field${fieldNum}` as keyof typeof activeFeeds[0];

  const validPoints = activeFeeds
    .map(f => {
      const raw = f[fieldKey];
      const val = raw !== undefined && raw !== null && raw !== '' ? parseFloat(String(raw)) : null;
      return {
        time: f.created_at,
        val: val !== null && !isNaN(val) ? val : null
      };
    })
    .filter((p): p is { time: string; val: number } => p.val !== null);

  const minVal = validPoints.length > 0 ? Math.min(...validPoints.map(p => p.val)) : 0;
  const maxVal = validPoints.length > 0 ? Math.max(...validPoints.map(p => p.val)) : 100;
  const range = maxVal - minVal || 1;

  return (
    <div className="space-y-4 pb-24">
      {/* Header Info Banner */}
      <div className="cupertino-card rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Gráficos de Telemetría • ThingSpeak
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading mt-0.5">
              {currentMeta.label}
            </h2>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Canal {currentMeta.channelNum} (field{currentMeta.fieldNum}) • {currentMeta.sensorModel}
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {activeChannelId ? `Canal #${activeChannelId}` : 'Sin ID'}
            </span>
            <span className="text-xs text-slate-400 block mt-1 font-mono">
              Unidad: {currentMeta.unit}
            </span>
          </div>
        </div>

        {/* Cupertino Segmented Control for Field Selection across both channels */}
        <div className="mt-4 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex gap-1 overflow-x-auto no-scrollbar">
          {fields.map(fKey => {
            const meta = SENSOR_METADATA[fKey];
            const isSelected = selectedSensorField === fKey;
            return (
              <button
                key={fKey}
                onClick={() => navigateToField(fKey)}
                className={`flex-1 min-w-[78px] py-1.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 text-center truncate ${
                  isSelected
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {meta.label.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* ThingSpeak Chart WebView Container */}
      <div className="cupertino-card rounded-2xl p-3 overflow-hidden border border-slate-200/60 dark:border-white/10">
        <div className="flex items-center justify-between px-2 pb-2.5 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200/50 dark:border-white/5">
          <div className="flex items-center gap-1.5 font-medium">
            <LineChart className="w-4 h-4 text-[#236391] dark:text-[#74ACDF]" />
            <span>Visualizador WebView ThingSpeak</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setChartMode('webview')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                chartMode === 'webview'
                  ? 'bg-[#236391] text-white dark:bg-[#74ACDF] dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              WebView Oficial
            </button>
            <button
              onClick={() => setChartMode('native')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                chartMode === 'native'
                  ? 'bg-[#236391] text-white dark:bg-[#74ACDF] dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Modo Vectorial
            </button>
          </div>
        </div>

        {/* WebView Iframe or Unconfigured Message */}
        {!activeChannelId ? (
          <div className="w-full h-[320px] rounded-xl mt-2 p-6 bg-slate-50 dark:bg-slate-900/60 flex flex-col items-center justify-center text-center space-y-2 text-slate-500">
            <Radio className="w-8 h-8 text-amber-500" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Canal {currentMeta.channelNum} no configurado
            </p>
            <span className="text-xs text-slate-400 max-w-xs">
              Ingresa el ID del Canal {currentMeta.channelNum} en la pestaña de Administración para cargar este gráfico.
            </span>
          </div>
        ) : chartMode === 'webview' ? (
          <div className="relative w-full h-[320px] rounded-xl overflow-hidden mt-2 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-center">
            <iframe
              key={`${activeChannelId}-${fieldNum}-${isDarkMode}`}
              title={`ThingSpeak Chart Canal ${currentMeta.channelNum} Field ${fieldNum}`}
              width="100%"
              height="320"
              style={{ border: 'none' }}
              src={thingSpeakChartUrl}
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          </div>
        ) : (
          /* Native Vector Chart calculated from feeds */
          <div className="w-full h-[320px] rounded-xl overflow-hidden mt-2 p-3 bg-slate-50 dark:bg-slate-900/60 flex flex-col justify-between">
            {validPoints.length > 1 ? (
              <>
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Máx: {maxVal.toFixed(1)} {currentMeta.unit}</span>
                  <span>Mín: {minVal.toFixed(1)} {currentMeta.unit}</span>
                </div>
                
                <div className="relative h-48 w-full flex items-end">
                  <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${validPoints.length - 1} 100`} preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={currentMeta.color} stopOpacity="0.4" />
                        <stop offset="100%" stopColor={currentMeta.color} stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <polygon
                      fill="url(#chartGradient)"
                      points={`0,100 ${validPoints
                        .map((p, i) => `${i},${100 - ((p.val - minVal) / range) * 85}`)
                        .join(' ')} ${validPoints.length - 1},100`}
                    />
                    <polyline
                      fill="none"
                      stroke={currentMeta.color}
                      strokeWidth="2.5"
                      points={validPoints
                        .map((p, i) => `${i},${100 - ((p.val - minVal) / range) * 85}`)
                        .join(' ')}
                    />
                  </svg>
                </div>

                <div className="flex justify-between text-[10px] font-mono text-slate-400 border-t border-slate-200/50 dark:border-white/5 pt-1.5">
                  <span>{formatTucumanTimeOnly(validPoints[0].time)}</span>
                  <span>{validPoints.length} lecturas</span>
                  <span>{formatTucumanTimeOnly(validPoints[validPoints.length - 1].time)}</span>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 text-xs">
                <Info className="w-6 h-6 mb-1 text-slate-400" />
                <span>No hay suficientes lecturas registradas para trazar curva vectorial.</span>
                <span className="text-[10px] text-slate-500 mt-1">Usa la pestaña &quot;WebView Oficial&quot; arriba.</span>
              </div>
            )}
          </div>
        )}

        {activeChannelId && (
          <div className="flex items-center justify-between px-2 pt-2.5 text-[11px] text-slate-400">
            <span>Canal {currentMeta.channelNum} • field{fieldNum}</span>
            <a
              href={thingSpeakChartUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#236391] dark:text-[#74ACDF] hover:underline"
            >
              <span>Abrir en ventana externa</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      {/* Sensor Range and Hardware Details */}
      <div className="cupertino-card rounded-2xl p-4 border border-slate-200/60 dark:border-white/10 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-700 dark:text-slate-200">Rango Operativo Típico:</span>
          <span className="font-mono text-slate-800 dark:text-slate-100 font-bold">{currentMeta.normalRange}</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
          {currentMeta.description}. Transmisión vía microcontrolador ESP32 a la nube IoT de ThingSpeak.
        </p>
      </div>
    </div>
  );
};
