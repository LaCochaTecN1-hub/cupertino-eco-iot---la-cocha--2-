import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatTucumanDateTime, getRelativeTimeString } from '../../utils/date';
import { calculateICAFromPM25, degreesToCardinal } from '../../utils/aqi';
import { 
  Thermometer, 
  Droplets, 
  Gauge, 
  Wind, 
  CloudRain, 
  Compass, 
  Navigation, 
  Activity, 
  AlertTriangle, 
  ChevronRight, 
  Loader2, 
  RotateCw, 
  Sparkles, 
  MapPin, 
  ExternalLink, 
  Sun, 
  Flame, 
  ShieldAlert, 
  HeartPulse,
  Radio,
  Satellite
} from 'lucide-react';

export const Screen2Dashboard: React.FC = () => {
  const { 
    combined, 
    loading, 
    error, 
    fetchFeeds, 
    navigateToField, 
    channelInfo1, 
    channelInfo2, 
    channelId, 
    channelId2,
    isConfigured,
    setActiveTab 
  } = useApp();

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
    heliofania,
    gpsLat,
    gpsLng,
    hasLiveGps,
    created_at
  } = combined;

  // Time conversion for "Datos en Vivo" in Tucumán, Argentina
  const tucumanDateTime = created_at ? formatTucumanDateTime(created_at) : '--';
  const relativeTime = created_at ? getRelativeTimeString(created_at) : '--';

  // Mathematical Calculation of Air Quality Index (ICA) from Canal 1 field7 (PMS5003 PM2.5)
  const icaData = calculateICAFromPM25(pm25);

  // Wind direction calculation from Canal 1 field5 (AS5600 encoder)
  const windCardinal = degreesToCardinal(windDirection);

  // Dynamic OpenStreetMap coordinates
  const openGoogleMaps = () => {
    window.open(`https://maps.google.com/?q=${gpsLat},${gpsLng}`, '_blank', 'noopener,noreferrer');
  };

  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${(gpsLng - 0.03).toFixed(4)}%2C${(gpsLat - 0.03).toFixed(4)}%2C${(gpsLng + 0.03).toFixed(4)}%2C${(gpsLat + 0.03).toFixed(4)}&amp;layer=mapnik&amp;marker=${gpsLat.toFixed(4)}%2C${gpsLng.toFixed(4)}`;

  return (
    <div className="space-y-4 pb-24">
      {/* "Datos en Vivo" Live Status Indicator Banner */}
      <div className="cupertino-card rounded-2xl p-4 border border-slate-200/60 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${created_at ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${created_at ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-heading">
              Datos en Vivo • 2 Canales IoT
            </span>
          </div>

          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {relativeTime}
          </span>
        </div>

        <div className="mt-2.5 pt-2.5 border-t border-slate-200/50 dark:border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs text-slate-600 dark:text-slate-400">
          <div>
            <span className="font-medium text-slate-500 dark:text-slate-400">Hora local (Tucumán, Argentina): </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
              {tucumanDateTime}
            </span>
          </div>

          <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            {channelId && <span>Canal 1: #{channelId}</span>}
            {channelId2 && <span>• Canal 2: #{channelId2}</span>}
            {!channelId && !channelId2 && <span className="text-amber-500">Sin canales configurados</span>}
          </div>
        </div>
      </div>

      {/* Unconfigured State (Cero Canal Fantasma) */}
      {!channelId && !channelId2 && (
        <div className="cupertino-card rounded-2xl p-4 bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Radio className="w-4 h-4 text-amber-600" />
            <span>Canales de ThingSpeak Pendientes</span>
          </div>
          <p className="leading-relaxed opacity-90">
            No hay ningún canal configurado. La aplicación no carga datos de canales ajenos. Configura los IDs de los canales 1 y 2 en la pestaña de Administración o en las variables de entorno.
          </p>
          <button
            onClick={() => setActiveTab(7)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 text-white font-semibold text-xs active:scale-95 transition-all shadow-sm"
          >
            <span>Configurar Canales en Admin</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Loading Circular Indicator */}
      {loading && !created_at && (
        <div className="cupertino-card rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#236391] dark:text-[#74ACDF] animate-spin" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Sincronizando canales 1 y 2 de ThingSpeak...
          </p>
          <span className="text-xs text-slate-400">Recibiendo telemetría en tiempo real</span>
        </div>
      )}

      {/* Connection Error Message with zero mock values */}
      {error && !loading && (
        <div className="rounded-2xl p-4 bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Aviso de Conexión ThingSpeak</span>
          </div>
          <p className="text-xs leading-relaxed opacity-90">
            {error}. Se muestran los indicadores en &quot;--&quot; (cero simulación).
          </p>
          <button
            onClick={() => fetchFeeds()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 active:scale-95 transition-all shadow-sm"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Reintentar Conexión</span>
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* TARJETA DESTACADA: VECTOR DE SALUD (ICA MATEMÁTICO PM2.5)       */}
      {/* ============================================================== */}
      <div className="cupertino-card rounded-2xl p-5 border-2 border-emerald-500/30 dark:border-emerald-500/20 relative overflow-hidden bg-gradient-to-br from-white/95 to-slate-50/90 dark:from-slate-800/90 dark:to-slate-900/90">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
              <HeartPulse className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-heading">
                  Vector de Salud • ICA
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-700 font-semibold text-slate-600 dark:text-slate-300">
                  EPA / OMS
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Índice de Calidad del Aire calculado localmente desde PM2.5 (Canal 1 field7)
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-3xl font-extrabold font-heading tracking-tight" style={{ color: icaData?.color || '#94A3B8' }}>
              {icaData ? icaData.ica : '--'}
            </span>
            <span className="text-xs text-slate-400 block font-medium">
              Puntos ICA
            </span>
          </div>
        </div>

        {/* Dynamic Category and Risk Info */}
        {icaData ? (
          <div className="mt-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-500 dark:text-slate-400">Condición Atmosférica:</span>
              <span className={`px-2.5 py-1 rounded-full font-bold border ${icaData.badgeBg} ${icaData.textColor} ${icaData.borderColor}`}>
                {icaData.category}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/50 dark:border-white/5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Recomendación Sanitaria:</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {icaData.healthRecommendation}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/40 dark:border-white/5">
                <Flame className="w-3 h-3 text-amber-500" />
                <span>{icaData.zafraRisk}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-3 p-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/40 text-xs text-slate-400 text-center">
            Esperando telemetría del sensor PMS5003 (Canal 1 field7) para computar el Índice de Calidad del Aire.
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* GRUPO 1: CLIMA (BME280) - CANAL 1: field1, field2, field3      */}
      {/* ============================================================== */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Clima (Sensor BME280 • Canal 1)
          </span>
          <span className="text-[11px] text-[#236391] dark:text-[#74ACDF] font-medium">
            Toca para ver gráfico
          </span>
        </div>

        {/* Temperatura: Canal 1 field1 */}
        <div
          onClick={() => navigateToField('c1_field1')}
          className="cupertino-card rounded-2xl p-4 cursor-pointer hover:border-orange-500/40 active:scale-[0.99] transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Thermometer className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Temperatura (C1 field1)
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  BME280 • Exterior
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                  {temp ?? '--'}
                </span>
                <span className="text-sm font-semibold text-slate-500 ml-1">°C</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Humedad: Canal 1 field2 */}
        <div
          onClick={() => navigateToField('c1_field2')}
          className="cupertino-card rounded-2xl p-4 cursor-pointer hover:border-sky-500/40 active:scale-[0.99] transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Droplets className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Humedad Relativa (C1 field2)
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  BME280 • Cuenca sur
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                  {humidity ?? '--'}
                </span>
                <span className="text-sm font-semibold text-slate-500 ml-1">%</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Presión: Canal 1 field3 */}
        <div
          onClick={() => navigateToField('c1_field3')}
          className="cupertino-card rounded-2xl p-4 cursor-pointer hover:border-purple-500/40 active:scale-[0.99] transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Gauge className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Presión Barométrica (C1 field3)
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  BME280 • ~440 msnm La Cocha
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                  {pressure ?? '--'}
                </span>
                <span className="text-sm font-semibold text-slate-500 ml-1">hPa</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* GRUPO 2: CINEMÁTICOS - CANAL 1: field4, field5, field6          */}
      {/* ============================================================== */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Cinemáticos (Viento y Lluvia • Canal 1)
          </span>
        </div>

        {/* Velocidad del Viento: Canal 1 field4 */}
        <div
          onClick={() => navigateToField('c1_field4')}
          className="cupertino-card rounded-2xl p-4 cursor-pointer hover:border-cyan-500/40 active:scale-[0.99] transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Velocidad del Viento (C1 field4)
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  Anemómetro óptico de cazoletas
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                  {windSpeed ?? '--'}
                </span>
                <span className="text-sm font-semibold text-slate-500 ml-1">km/h</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Dirección del Viento: Canal 1 field5 (AS5600) */}
        <div
          onClick={() => navigateToField('c1_field5')}
          className="cupertino-card rounded-2xl p-4 cursor-pointer hover:border-indigo-500/40 active:scale-[0.99] transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Navigation 
                  className="w-5 h-5 stroke-[2] transition-transform"
                  style={{ transform: windCardinal ? `rotate(${windCardinal.deg}deg)` : 'none' }}
                />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Dirección del Viento (C1 field5)
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  Encoder magnético AS5600
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                  {windCardinal ? `${windCardinal.deg}°` : (windDirection ?? '--')}
                </span>
                <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 ml-1">
                  {windCardinal ? windCardinal.cardinal : ''}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
          {windCardinal && (
            <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-400">
              <span>Orientación cardinal:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{windCardinal.label}</span>
            </div>
          )}
        </div>

        {/* Lluvia: Canal 1 field6 */}
        <div
          onClick={() => navigateToField('c1_field6')}
          className="cupertino-card rounded-2xl p-4 cursor-pointer hover:border-blue-500/40 active:scale-[0.99] transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <CloudRain className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Precipitación / Lluvia (C1 field6)
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  Pluviómetro de balancín
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                  {rain ?? '--'}
                </span>
                <span className="text-sm font-semibold text-slate-500 ml-1">mm</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* GRUPO 3: POLVO Y CALIDAD DE AIRE - CANAL 1: field7 (PMS5003)    */}
      {/* ============================================================== */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Polvo y Calidad de Aire (PMS5003 • Canal 1)
          </span>
        </div>

        {/* PM2.5: Canal 1 field7 */}
        <div
          onClick={() => navigateToField('c1_field7')}
          className="cupertino-card rounded-2xl p-4 cursor-pointer hover:border-emerald-500/40 active:scale-[0.99] transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Wind className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Material Particulado PM2.5 (C1 field7)
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  PMS5003 Láser • Quema y zafra
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                  {pm25 ?? '--'}
                </span>
                <span className="text-sm font-semibold text-slate-500 ml-1">µg/m³</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* GRUPO 4: GASES - CANAL 1: field8 (CO2) y CANAL 2: field1 (CO)  */}
      {/* ============================================================== */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Gases (MH-Z19C y MQ-7)
          </span>
        </div>

        {/* CO2: Canal 1 field8 (MH-Z19C) */}
        <div
          onClick={() => navigateToField('c1_field8')}
          className="cupertino-card rounded-2xl p-4 cursor-pointer hover:border-pink-500/40 active:scale-[0.99] transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Dióxido de Carbono CO2 (C1 field8)
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  MH-Z19C NDIR • Infrarrojo
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                  {co2 ?? '--'}
                </span>
                <span className="text-sm font-semibold text-slate-500 ml-1">ppm</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* CO: Canal 2 field1 (MQ-7) */}
        <div
          onClick={() => navigateToField('c2_field1')}
          className="cupertino-card rounded-2xl p-4 cursor-pointer hover:border-amber-500/40 active:scale-[0.99] transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Flame className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Monóxido de Carbono CO (C2 field1)
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  MQ-7 • Gases de combustión
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                  {co ?? '--'}
                </span>
                <span className="text-sm font-semibold text-slate-500 ml-1">ppm</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* GRUPO 5: ÓPTICOS - CANAL 2: field2 (UV) y field3 (Heliofanía)  */}
      {/* ============================================================== */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Ópticos (ML8511 y LDR • Canal 2)
          </span>
        </div>

        {/* Índice UV: Canal 2 field2 */}
        <div
          onClick={() => navigateToField('c2_field2')}
          className="cupertino-card rounded-2xl p-4 cursor-pointer hover:border-violet-500/40 active:scale-[0.99] transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Sun className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Índice UV Global (C2 field2)
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  ML8511 • Fotodiodo UV
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                  {uv ?? '--'}
                </span>
                <span className="text-sm font-semibold text-slate-500 ml-1">UVI</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Heliofanía: Canal 2 field3 */}
        <div
          onClick={() => navigateToField('c2_field3')}
          className="cupertino-card rounded-2xl p-4 cursor-pointer hover:border-yellow-500/40 active:scale-[0.99] transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Sun className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Heliofanía Diaria (C2 field3)
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  LDR • Minutos de sol efectivo
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                  {heliofania ?? '--'}
                </span>
                <span className="text-sm font-semibold text-slate-500 ml-1">min</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation Quick Action */}
      <div 
        onClick={() => setActiveTab(4)}
        className="cupertino-card rounded-2xl p-4 bg-gradient-to-r from-[#236391]/10 via-[#74ACDF]/10 to-emerald-500/10 border border-[#74ACDF]/30 cursor-pointer hover:border-[#74ACDF]/60 transition-all active:scale-[0.99] flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#236391] text-white flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#236391] dark:text-[#74ACDF] uppercase tracking-wide block">
              Gemini 3.1 Intelligence
            </span>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Ver Alerta Temprana Automatizada
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-400" />
      </div>

      {/* ============================================================== */}
      {/* MAPA EN VIVO (GPS NEO-6M): CANAL 2 field4 (Lat) y field5 (Lng)  */}
      {/* ============================================================== */}
      <div className="cupertino-card rounded-2xl p-4 border border-slate-200/60 dark:border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                  Ubicación de la Estación
                </h3>
                {hasLiveGps ? (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    <Satellite className="w-2.5 h-2.5" />
                    GPS NEO-6M
                  </span>
                ) : (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/60 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    Predeterminadas
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                La Cocha • {gpsLat.toFixed(4)}, {gpsLng.toFixed(4)}
              </p>
            </div>
          </div>

          <button
            onClick={openGoogleMaps}
            className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-[#236391] hover:bg-[#1a4a6d] text-white text-xs font-semibold shadow-sm active:scale-95 transition-all"
            title="Abrir en Google Maps"
          >
            <span>Ver en mapa</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Embedded Interactive Map Preview dynamically using GPS coordinates */}
        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200/60 dark:border-white/10 shadow-inner">
          <iframe
            key={`${gpsLat}-${gpsLng}`}
            title="Mapa Estacion La Cocha"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            src={mapEmbedUrl}
            loading="lazy"
          />
          <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg cupertino-glass text-[11px] font-mono font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>{gpsLat.toFixed(4)}, {gpsLng.toFixed(4)}</span>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {hasLiveGps 
            ? 'Coordenadas transmitidas en vivo por el módulo GPS NEO-6M (Canal 2 fields 4 y 5).'
            : 'Coordenadas de referencia en el predio de la Escuela Técnica N° 1 La Cocha, sur tucumano.'}
        </p>
      </div>
    </div>
  );
};
