import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatTucumanDateTime } from '../../utils/date';
import { 
  Table2, 
  Search, 
  ArrowUpDown, 
  RotateCw, 
  Loader2, 
  AlertTriangle, 
  FileSpreadsheet
} from 'lucide-react';

export const Screen5DataTable: React.FC = () => {
  const { 
    feeds1, 
    feeds2, 
    loading, 
    error, 
    fetchFeeds, 
    channelId, 
    channelId2,
    isConfigured 
  } = useApp();

  const [activeChannelTab, setActiveChannelTab] = useState<1 | 2>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const currentFeeds = activeChannelTab === 1 ? feeds1 : feeds2;
  const currentChannelId = activeChannelTab === 1 ? channelId : channelId2;

  // Filter and sort feeds
  const processedFeeds = useMemo(() => {
    let list = [...currentFeeds];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(feed => {
        const dateStr = formatTucumanDateTime(feed.created_at).toLowerCase();
        const f1 = (feed.field1 || '').toLowerCase();
        const f2 = (feed.field2 || '').toLowerCase();
        const f3 = (feed.field3 || '').toLowerCase();
        const f4 = (feed.field4 || '').toLowerCase();
        const f5 = (feed.field5 || '').toLowerCase();
        const f6 = (feed.field6 || '').toLowerCase();
        const f7 = (feed.field7 || '').toLowerCase();
        const f8 = (feed.field8 || '').toLowerCase();
        return (
          dateStr.includes(q) ||
          f1.includes(q) ||
          f2.includes(q) ||
          f3.includes(q) ||
          f4.includes(q) ||
          f5.includes(q) ||
          f6.includes(q) ||
          f7.includes(q) ||
          f8.includes(q)
        );
      });
    }

    list.sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

    return list;
  }, [currentFeeds, searchQuery, sortOrder]);

  // Export feeds to CSV file
  const exportToCSV = () => {
    if (currentFeeds.length === 0) return;

    let headers: string[] = [];
    if (activeChannelTab === 1) {
      headers = [
        'ID_Entrada',
        'Fecha_Hora_Tucuman',
        'Temp_C',
        'Hum_Pct',
        'Presion_hPa',
        'VientoVel_kmh',
        'VientoDir_deg',
        'Lluvia_mm',
        'PM25_ugm3',
        'CO2_ppm'
      ];
    } else {
      headers = [
        'ID_Entrada',
        'Fecha_Hora_Tucuman',
        'CO_ppm',
        'Indice_UV',
        'Heliofania_min',
        'GPS_Latitud',
        'GPS_Longitud'
      ];
    }

    const rows = currentFeeds.map(feed => {
      if (activeChannelTab === 1) {
        return [
          feed.entry_id,
          `"${formatTucumanDateTime(feed.created_at)}"`,
          feed.field1 ?? '',
          feed.field2 ?? '',
          feed.field3 ?? '',
          feed.field4 ?? '',
          feed.field5 ?? '',
          feed.field6 ?? '',
          feed.field7 ?? '',
          feed.field8 ?? ''
        ];
      } else {
        return [
          feed.entry_id,
          `"${formatTucumanDateTime(feed.created_at)}"`,
          feed.field1 ?? '',
          feed.field2 ?? '',
          feed.field3 ?? '',
          feed.field4 ?? '',
          feed.field5 ?? ''
        ];
      }
    });

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `telemetria_la_cocha_canal_${activeChannelTab}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Header and Controls */}
      <div className="cupertino-card rounded-2xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Table2 className="w-5 h-5 text-[#236391] dark:text-[#74ACDF]" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                DataTable Histórico
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Registros recibidos desde ThingSpeak ({currentChannelId ? `Canal #${currentChannelId}` : 'Sin ID'})
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'))}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all"
              title="Alternar orden cronológico"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{sortOrder === 'desc' ? 'Más recientes' : 'Más antiguas'}</span>
            </button>

            <button
              onClick={exportToCSV}
              disabled={currentFeeds.length === 0}
              className="py-2 px-3 rounded-xl bg-[#236391] hover:bg-[#1a4a6d] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all disabled:opacity-50"
              title="Descargar archivo CSV con todos los registros"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* Channel Selector Toggle */}
        <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex gap-1">
          <button
            onClick={() => setActiveChannelTab(1)}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
              activeChannelTab === 1
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            Canal 1 (Clima, Viento, Lluvia, PM2.5 y CO2)
          </button>
          <button
            onClick={() => setActiveChannelTab(2)}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
              activeChannelTab === 2
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            Canal 2 (CO, UV, Heliofanía y GPS)
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrar por fecha, hora o valor de sensor..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-white/5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#236391]/30 transition-all"
          />
        </div>
      </div>

      {/* Loading state with CircularProgressIndicator */}
      {loading && currentFeeds.length === 0 && (
        <div className="cupertino-card rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#236391] dark:text-[#74ACDF] animate-spin" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Descargando registros de ThingSpeak...
          </p>
          <span className="text-xs text-slate-400">Poblando tabla de telemetría</span>
        </div>
      )}

      {/* Error Banner */}
      {error && !loading && (
        <div className="rounded-2xl p-4 bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Error al cargar historial</span>
          </div>
          <p className="text-xs leading-relaxed opacity-90">{error}</p>
          <button
            onClick={() => fetchFeeds()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 active:scale-95 transition-all shadow-sm"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Reintentar</span>
          </button>
        </div>
      )}

      {/* DataTable Container */}
      {!loading && processedFeeds.length > 0 && (
        <div className="cupertino-card rounded-2xl overflow-hidden border border-slate-200/60 dark:border-white/10">
          <div className="px-4 py-2.5 bg-slate-100/60 dark:bg-slate-800/50 border-b border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs text-slate-500">
            <span>Canal {activeChannelTab}: {processedFeeds.length} lecturas</span>
            <span>Hora Oficial Tucumán (UTC-3)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200/60 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 font-semibold">
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">Fecha y Hora (Tucumán)</th>
                  {activeChannelTab === 1 ? (
                    <>
                      <th className="py-3 px-3 text-right">Temp (°C)</th>
                      <th className="py-3 px-3 text-right">Hum (%)</th>
                      <th className="py-3 px-3 text-right">Pres (hPa)</th>
                      <th className="py-3 px-3 text-right">Viento (km/h)</th>
                      <th className="py-3 px-3 text-right">Dir (°)</th>
                      <th className="py-3 px-3 text-right">Lluvia (mm)</th>
                      <th className="py-3 px-3 text-right">PM2.5 (µg/m³)</th>
                      <th className="py-3 px-3 text-right">CO2 (ppm)</th>
                    </>
                  ) : (
                    <>
                      <th className="py-3 px-3 text-right">CO (ppm)</th>
                      <th className="py-3 px-3 text-right">UV (UVI)</th>
                      <th className="py-3 px-3 text-right">Sol (min)</th>
                      <th className="py-3 px-3 text-right">GPS Lat</th>
                      <th className="py-3 px-3 text-right">GPS Lng</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-white/5 text-slate-800 dark:text-slate-200">
                {processedFeeds.map((feed, index) => {
                  const tucumanTime = formatTucumanDateTime(feed.created_at);
                  const isLatest = index === 0 && sortOrder === 'desc';

                  return (
                    <tr
                      key={feed.entry_id || index}
                      className={`hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors ${
                        isLatest ? 'bg-[#74ACDF]/5 font-medium' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">
                        {feed.entry_id}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                          {isLatest && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          )}
                          <span>{tucumanTime}</span>
                        </div>
                      </td>
                      {activeChannelTab === 1 ? (
                        <>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-orange-600 dark:text-orange-400">
                            {feed.field1 ?? '--'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-sky-600 dark:text-sky-400">
                            {feed.field2 ?? '--'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-purple-600 dark:text-purple-400">
                            {feed.field3 ?? '--'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-cyan-600 dark:text-cyan-400">
                            {feed.field4 ?? '--'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                            {feed.field5 ?? '--'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-blue-600 dark:text-blue-400">
                            {feed.field6 ?? '--'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                            {feed.field7 ?? '--'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-pink-600 dark:text-pink-400">
                            {feed.field8 ?? '--'}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-amber-600 dark:text-amber-400">
                            {feed.field1 ?? '--'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-violet-600 dark:text-violet-400">
                            {feed.field2 ?? '--'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-yellow-600 dark:text-yellow-400">
                            {feed.field3 ?? '--'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-300">
                            {feed.field4 ?? '--'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-300">
                            {feed.field5 ?? '--'}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && processedFeeds.length === 0 && (
        <div className="cupertino-card rounded-2xl p-8 text-center space-y-2">
          <Table2 className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Sin registros en el Canal {activeChannelTab}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? 'No se encontraron registros que coincidan con la búsqueda.'
              : !currentChannelId
                ? `El Canal ${activeChannelTab} no está configurado. Ingresa el ID del canal en la pestaña de Administración.`
                : 'No se encontraron feeds para este canal de ThingSpeak.'}
          </p>
        </div>
      )}
    </div>
  );
};
