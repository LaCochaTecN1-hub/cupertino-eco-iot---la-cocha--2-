import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { GuestEntry, InstitutionInfo } from '../../types';
import { formatTucumanDateTime } from '../../utils/date';
import { 
  BookOpen, 
  Send, 
  Trash2, 
  Reply, 
  ShieldCheck, 
  Check, 
  Loader2, 
  GraduationCap, 
  MapPin, 
  Cpu, 
  MessageSquare
} from 'lucide-react';

export const Screen6Guestbook: React.FC = () => {
  const { 
    isAdmin, 
    setActiveTab, 
    activeCommunitySection, 
    setActiveCommunitySection 
  } = useApp();

  // Guestbook state (starts completely empty)
  const [entries, setEntries] = useState<GuestEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [silentSuccess, setSilentSuccess] = useState<boolean>(false);
  const [guestError, setGuestError] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  // Admin reply inline form state
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [submittingReply, setSubmittingReply] = useState<boolean>(false);

  // Institution info state
  const [institution, setInstitution] = useState<InstitutionInfo | null>(null);
  const [loadingInst, setLoadingInst] = useState<boolean>(true);

  // Fetch Guestbook entries
  const fetchEntries = async () => {
    setLoadingEntries(true);
    setGuestError(null);
    try {
      const res = await fetch('/api/guestbook');
      if (!res.ok) throw new Error('No se pudo cargar el libro de visitas.');
      const data = await res.json();
      setEntries(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching guestbook:', err);
      setGuestError(err.message || 'Error al conectar con el backend.');
    } finally {
      setLoadingEntries(false);
    }
  };

  // Fetch Institution Info
  const fetchInstitution = async () => {
    setLoadingInst(true);
    try {
      const res = await fetch('/api/institution');
      if (res.ok) {
        const data = await res.json();
        setInstitution(data);
      }
    } catch (err) {
      console.warn('Error fetching institution:', err);
    } finally {
      setLoadingInst(false);
    }
  };

  useEffect(() => {
    fetchEntries();
    fetchInstitution();
  }, []);

  // Silent submission as requested: "El envío de visitas debe ser silencioso."
  const handleSubmitEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setSubmitting(true);
    setSilentSuccess(false);

    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          location: location.trim() || 'La Cocha, Tucumán',
          message: message.trim()
        })
      });

      if (!res.ok) throw new Error('Fallo al guardar la firma.');

      const newEntry = await res.json();
      setEntries(prev => [newEntry, ...prev]);

      // Reset form and show gentle silent indicator
      setName('');
      setLocation('');
      setMessage('');
      setSilentSuccess(true);
      setTimeout(() => setSilentSuccess(false), 3500);
    } catch (err: any) {
      console.error('Silent submission error:', err);
      setGuestError(err.message || 'No se pudo registrar la visita.');
    } finally {
      setSubmitting(false);
    }
  };

  // Admin delete entry
  const handleDeleteEntry = async (id: string) => {
    if (!isAdmin) return;
    try {
      const res = await fetch(`/api/guestbook/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEntries(prev => prev.filter(e => e.id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Admin reply entry
  const handleSendReply = async (id: string) => {
    if (!isAdmin || !replyText.trim()) return;
    setSubmittingReply(true);
    try {
      const res = await fetch(`/api/guestbook/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyText.trim() })
      });
      if (res.ok) {
        const updated = await res.json();
        setEntries(prev => prev.map(e => (e.id === id ? updated : e)));
        setReplyingToId(null);
        setReplyText('');
      }
    } catch (err) {
      console.error('Reply error:', err);
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Cupertino Segmented Navigation (No ampersand) */}
      <div className="p-1 rounded-xl bg-slate-200/60 dark:bg-slate-800/80 flex gap-1">
        <button
          onClick={() => setActiveCommunitySection('guestbook')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-98 flex items-center justify-center gap-1.5 ${
            activeCommunitySection === 'guestbook'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Libro de Visitas</span>
        </button>

        <button
          onClick={() => setActiveCommunitySection('institution')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-98 flex items-center justify-center gap-1.5 ${
            activeCommunitySection === 'institution'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Quiénes Somos</span>
        </button>
      </div>

      {/* Admin Mode Badge Notice */}
      {isAdmin && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Modo Administrador Activo: Iconos de borrar y responder habilitados.</span>
          </div>
          <button
            onClick={() => setActiveTab(7)}
            className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 underline hover:no-underline"
          >
            Panel Admin
          </button>
        </div>
      )}

      {/* SECCIÓN 1: LIBRO DE VISITAS */}
      {activeCommunitySection === 'guestbook' && (
        <div className="space-y-4">
          {/* Silent Sign Guestbook Card */}
          <div className="cupertino-card rounded-2xl p-4 border border-slate-200/60 dark:border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                  Firma el Libro de Visitas
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Déjanos tus observaciones, consultas sobre la estación o saludos a la escuela.
                </p>
              </div>

              {silentSuccess && (
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-in fade-in duration-300">
                  <Check className="w-4 h-4" />
                  <span>Enviado</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmitEntry} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Tu Nombre o Institución *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Ing. Ramos / Vecino de La Cocha"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-white/5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#236391]/30"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Localidad
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ej: La Cocha / San Miguel de Tucumán"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-white/5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#236391]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Mensaje *
                </label>
                <textarea
                  required
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escribe tu mensaje para la comunidad educativa..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-white/5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#236391]/30 resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">
                  Envío silencioso a la base de datos
                </span>

                <button
                  type="submit"
                  disabled={submitting || !name.trim() || !message.trim()}
                  className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-[#236391] hover:bg-[#1a4a6d] text-white text-xs font-semibold shadow-sm active:scale-95 transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Registrar Visita</span>
                </button>
              </div>
            </form>
          </div>

          {/* Entries List (Initially completely empty as requested) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Firmas y Mensajes Recibidos ({entries.length})
              </span>
            </div>

            {loadingEntries && (
              <div className="cupertino-card rounded-2xl p-6 text-center space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#236391] mx-auto" />
                <p className="text-xs text-slate-500">Cargando libro de visitas...</p>
              </div>
            )}

            {!loadingEntries && entries.length === 0 && (
              <div className="cupertino-card rounded-2xl p-8 text-center space-y-2 text-slate-400">
                <MessageSquare className="w-8 h-8 mx-auto" />
                <p className="text-xs">El libro de visitas está vacío. ¡Sé el primero en firmar!</p>
              </div>
            )}

            {!loadingEntries && entries.map((entry) => {
              const formattedDate = formatTucumanDateTime(entry.createdAt);
              const isReplying = replyingToId === entry.id;

              return (
                <div
                  key={entry.id}
                  className="cupertino-card rounded-2xl p-4 border border-slate-200/60 dark:border-white/10 space-y-2.5 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {entry.name}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                          {entry.location}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                        {formattedDate}
                      </span>
                    </div>

                    {/* Admin Action Icons (Only enabled if isAdmin == true) */}
                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setReplyingToId(isReplying ? null : entry.id);
                            setReplyText(entry.reply || '');
                          }}
                          className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                            isReplying
                              ? 'bg-[#236391] text-white'
                              : 'text-slate-500 hover:text-[#236391] hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                          title="Responder mensaje como administrador"
                        >
                          <Reply className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-500/10 transition-all"
                          title="Eliminar mensaje"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {entry.message}
                  </p>

                  {/* Official Reply Box */}
                  {entry.reply && !isReplying && (
                    <div className="mt-2.5 p-3 rounded-xl bg-[#236391]/10 dark:bg-[#74ACDF]/10 border border-[#236391]/20 space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#236391] dark:text-[#74ACDF]">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Respuesta Oficial • E.T. N° 1 La Cocha</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-200">
                        {entry.reply}
                      </p>
                    </div>
                  )}

                  {/* Inline Reply Form for Admin */}
                  {isAdmin && isReplying && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-white/10 space-y-2">
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-200">
                        Responder como E.T. N° 1 La Cocha:
                      </label>
                      <textarea
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Escribe la respuesta oficial para el visitante..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-700 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#236391]/30 resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setReplyingToId(null)}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleSendReply(entry.id)}
                          disabled={submittingReply || !replyText.trim()}
                          className="px-3 py-1 rounded-lg bg-[#236391] text-white text-xs font-semibold shadow-sm hover:bg-[#1a4a6d] disabled:opacity-50 flex items-center gap-1"
                        >
                          {submittingReply && <Loader2 className="w-3 h-3 animate-spin" />}
                          <span>Publicar Respuesta</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECCIÓN 2: QUIÉNES SOMOS */}
      {activeCommunitySection === 'institution' && (
        <div className="space-y-4">
          <div className="cupertino-card rounded-2xl p-5 border border-slate-200/60 dark:border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#236391]/10 text-[#236391] dark:text-[#74ACDF] flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                  {institution?.title || 'Escuela Técnica N° 1 La Cocha'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {institution?.subtitle || 'Estación Meteorológica y Calidad del Aire IoT'}
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-2 bg-slate-50/60 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200/40 dark:border-white/5">
              <p>{institution?.description}</p>
            </div>

            {/* Objetivos del Proyecto */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                Objetivos Institucionales y STEM
              </span>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {(institution?.objectives || [
                  'Medición continua de temperatura, humedad, presión barométrica y precipitaciones con sensor BME280 y pluviómetro.',
                  'Monitoreo de material particulado PM2.5 con sensor láser PMS5003 durante la época de zafra y quema de cañaverales.',
                  'Medición de gases con sensores MH-Z19C (CO2) y MQ-7 (CO), y radiación UV con sensor ML8511.',
                  'Monitoreo cinemático de viento con anemómetro y sensor magnético AS5600 para dirección.',
                  'Alertas tempranas agro-climáticas y de riesgo de anegamiento en la cuenca sur de Tucumán.'
                ]).map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#236391] dark:bg-[#74ACDF] mt-1.5 shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hardware Specification Card */}
            <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/50 dark:border-white/5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Cpu className="w-4 h-4 text-[#236391] dark:text-[#74ACDF]" />
                <span>Arquitectura de Hardware IoT</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                {institution?.stationHardware || 'ESP32 • BME280 • PMS5003 • MH-Z19C • MQ-7 • ML8511 • LDR • AS5600 • Pluviómetro • ThingSpeak IoT'}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-500" />
                La Cocha, Tucumán, Argentina
              </span>
              <span>{institution?.team || 'Departamento Técnico E.T. N° 1'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
