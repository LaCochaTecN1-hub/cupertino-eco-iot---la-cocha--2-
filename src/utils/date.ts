/**
 * Date and Time utilities for La Cocha, Tucumán, Argentina
 * Timezone: America/Argentina/Tucuman (UTC-3)
 */

export const TUCUMAN_TIMEZONE = 'America/Argentina/Tucuman';

export function formatTucumanDateTime(isoString?: string | null): string {
  if (!isoString) return '--';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '--';
    
    return new Intl.DateTimeFormat('es-AR', {
      timeZone: TUCUMAN_TIMEZONE,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date) + ' hs';
  } catch {
    return '--';
  }
}

export function formatTucumanTimeOnly(isoString?: string | null): string {
  if (!isoString) return '--';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '--';
    
    return new Intl.DateTimeFormat('es-AR', {
      timeZone: TUCUMAN_TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date) + ' hs';
  } catch {
    return '--';
  }
}

export function formatTucumanDateOnly(isoString?: string | null): string {
  if (!isoString) return '--';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '--';
    
    return new Intl.DateTimeFormat('es-AR', {
      timeZone: TUCUMAN_TIMEZONE,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  } catch {
    return '--';
  }
}

/**
 * Returns human-readable relative time (e.g. "hace 3 min")
 */
export function getRelativeTimeString(isoString?: string | null): string {
  if (!isoString) return '--';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '--';
    
    const diffMs = Date.now() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    
    if (diffSeconds < 45) return 'justo ahora';
    if (diffSeconds < 90) return 'hace 1 min';
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `hace ${diffMinutes} min`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `hace ${diffHours} h`;
    const diffDays = Math.floor(diffHours / 24);
    return `hace ${diffDays} d`;
  } catch {
    return '--';
  }
}
