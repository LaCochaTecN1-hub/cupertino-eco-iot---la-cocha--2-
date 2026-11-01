import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  LogOut, 
  Settings, 
  Check, 
  AlertTriangle, 
  Loader2, 
  Radio, 
  ExternalLink,
  BookOpen,
  Server,
  Satellite
} from 'lucide-react';

export const Screen7Admin: React.FC = () => {
  const { 
    isAdmin, 
    loginAdmin, 
    logoutAdmin, 
    channelId, 
    readKey, 
    channelId2,
    readKey2,
    setChannelsConfig, 
    fetchFeeds,
    setActiveTab,
    loading,
    combined
  } = useApp();

  const [password, setPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Configuration edit state for both channels
  const [inputChannelId1, setInputChannelId1] = useState<string>(channelId);
  const [inputReadKey1, setInputReadKey1] = useState<string>(readKey);
  const [inputChannelId2, setInputChannelId2] = useState<string>(channelId2);
  const [inputReadKey2, setInputReadKey2] = useState<string>(readKey2);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsVerifying(true);

    setTimeout(() => {
      try {
        const success = loginAdmin(password);
        if (success) {
          setPassword('');
          setAuthError(null);
        } else {
          setAuthError('Contraseña incorrecta. Utiliza "tecnica1", "lacochafc2026" o "admin".');
        }
      } catch (err: any) {
        setAuthError(err.message || 'Error de autenticación.');
      } finally {
        setIsVerifying(false);
      }
    }, 400);
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setChannelsConfig(
      inputChannelId1.trim(), 
      inputReadKey1.trim(),
      inputChannelId2.trim(),
      inputReadKey2.trim()
    );
    setSaveSuccess(true);
    await fetchFeeds();
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Header Card */}
      <div className="cupertino-card rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center">
            <Lock className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
              Panel de Administración
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Escuela Técnica N° 1 La Cocha • Gestión y Moderación
            </p>
          </div>
        </div>
      </div>

      {/* LOGIN STATE (When isAdmin is false) */}
      {!isAdmin ? (
        <div className="cupertino-card rounded-2xl p-5 border border-slate-200/60 dark:border-white/10 space-y-4">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-full bg-[#236391]/10 text-[#236391] dark:text-[#74ACDF] mx-auto flex items-center justify-center mb-2">
              <KeyRound className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
              Acceso Restringido a Administradores
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Ingresa la clave técnica para habilitar herramientas de moderación, borrado y respuesta en el Libro de Visitas.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3 max-w-sm mx-auto">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Contraseña de Administrador
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu clave (ej: tecnica1)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-white/5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#236391]/30"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Claves autorizadas: <code className="bg-slate-200/50 dark:bg-slate-800 px-1 py-0.5 rounded">tecnica1</code> o <code className="bg-slate-200/50 dark:bg-slate-800 px-1 py-0.5 rounded">lacochafc2026</code>
              </span>
            </div>

            {authError && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-1.5 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying || !password.trim()}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#236391] hover:bg-[#1a4a6d] text-white font-semibold text-xs shadow-md active:scale-98 transition-all disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Validando credenciales...</span>
                </>
              ) : (
                <span>Iniciar Sesión como Admin</span>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* LOGGED IN STATE (When isAdmin is true) */
        <div className="space-y-4">
          {/* Active Admin Banner */}
          <div className="cupertino-card rounded-2xl p-4 bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 font-heading block">
                  Modo Administrador Activo (isAdmin = true)
                </span>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  Permisos de moderación, borrado y respuesta activados en Comunidad.
                </p>
              </div>
            </div>

            <button
              onClick={logoutAdmin}
              className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-white dark:bg-slate-800 text-rose-600 border border-rose-500/20 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-semibold active:scale-95 transition-all shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>

          {/* Quick link to Pantalla 6 for Moderation */}
          <div 
            onClick={() => setActiveTab(6)}
            className="cupertino-card rounded-2xl p-4 border border-slate-200/60 dark:border-white/10 cursor-pointer hover:border-[#74ACDF]/50 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#236391]/10 text-[#236391] dark:text-[#74ACDF] flex items-center justify-center group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                  Ir al Libro de Visitas (Pantalla 6)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Verás habilitados los iconos de borrar y responder en cada firma.
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#236391] transition-colors" />
          </div>

          {/* ThingSpeak 2 Channels Configuration Form */}
          <div className="cupertino-card rounded-2xl p-4 border border-slate-200/60 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#236391] dark:text-[#74ACDF]" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                  Configuración de Canales ThingSpeak
                </h3>
              </div>

              {saveSuccess && (
                <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold animate-in fade-in">
                  <Check className="w-3.5 h-3.5" />
                  <span>Configuración Guardada</span>
                </span>
              )}
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              {/* Canal 1 Settings */}
              <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 space-y-2 border border-slate-200/40 dark:border-white/5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Canal 1 (Clima, Viento, Lluvia, PM2.5 y CO2)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      THINGSPEAK_CHANNEL_ID
                    </label>
                    <input
                      type="text"
                      value={inputChannelId1}
                      onChange={(e) => setInputChannelId1(e.target.value)}
                      placeholder="ID Canal 1 de la escuela"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-700/80 border border-slate-200/50 dark:border-white/5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-[#236391]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      THINGSPEAK_READ_KEY (Opcional)
                    </label>
                    <input
                      type="text"
                      value={inputReadKey1}
                      onChange={(e) => setInputReadKey1(e.target.value)}
                      placeholder="Clave de lectura privada"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-700/80 border border-slate-200/50 dark:border-white/5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-[#236391]/30"
                    />
                  </div>
                </div>
              </div>

              {/* Canal 2 Settings */}
              <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 space-y-2 border border-slate-200/40 dark:border-white/5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Canal 2 (CO, Indice UV, Heliofania y GPS NEO-6M)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      THINGSPEAK_CHANNEL_ID_2
                    </label>
                    <input
                      type="text"
                      value={inputChannelId2}
                      onChange={(e) => setInputChannelId2(e.target.value)}
                      placeholder="ID Canal 2 de la escuela"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-700/80 border border-slate-200/50 dark:border-white/5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-[#236391]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      THINGSPEAK_READ_KEY_2 (Opcional)
                    </label>
                    <input
                      type="text"
                      value={inputReadKey2}
                      onChange={(e) => setInputReadKey2(e.target.value)}
                      placeholder="Clave de lectura Canal 2"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-700/80 border border-slate-200/50 dark:border-white/5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-[#236391]/30"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-[#236391] hover:bg-[#1a4a6d] text-white text-xs font-semibold shadow-sm active:scale-95 transition-all"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Radio className="w-3.5 h-3.5" />}
                  <span>Guardar y Sincronizar Ambos Canales</span>
                </button>
              </div>
            </form>
          </div>

          {/* System Diagnostics */}
          <div className="cupertino-card rounded-2xl p-4 border border-slate-200/60 dark:border-white/10 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 font-heading">
              <Server className="w-4 h-4 text-slate-500" />
              <span>Diagnóstico del Sistema IoT</span>
            </div>

            <div className="space-y-1.5 text-slate-600 dark:text-slate-400 pt-1 font-mono text-[11px]">
              <div className="flex justify-between">
                <span>Zona Horaria Estación:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">America/Argentina/Tucuman (UTC-3)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Coordenadas Geográficas:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  {combined.hasLiveGps && <Satellite className="w-3 h-3 text-emerald-500" />}
                  {combined.gpsLat.toFixed(4)}, {combined.gpsLng.toFixed(4)} {combined.hasLiveGps ? '(GPS NEO-6M)' : '(La Cocha)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Motor de Alerta Temprana:</span>
                <span className="font-semibold text-purple-600 dark:text-purple-400">Gemini Flash (Server-Side Auto)</span>
              </div>
              <div className="flex justify-between">
                <span>Canales Activos:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  C1: #{channelId || 'sin configurar'} • C2: #{channelId2 || 'sin configurar'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
