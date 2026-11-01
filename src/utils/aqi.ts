/**
 * Mathematical Calculation of Air Quality Index (ICA / AQI)
 * Based on EPA Standard Linear Piecewise Interpolation for PM2.5 concentration.
 */

export interface ICAResult {
  ica: number;
  category: string;
  level: 'buena' | 'moderada' | 'sensible' | 'insalubre' | 'muy_insalubre' | 'peligrosa';
  color: string;
  badgeBg: string;
  textColor: string;
  borderColor: string;
  healthRecommendation: string;
  zafraRisk: string;
}

interface Breakpoint {
  cLow: number;
  cHigh: number;
  iLow: number;
  iHigh: number;
  category: string;
  level: ICAResult['level'];
  color: string;
  badgeBg: string;
  textColor: string;
  borderColor: string;
  healthRecommendation: string;
  zafraRisk: string;
}

const BREAKPOINTS: Breakpoint[] = [
  {
    cLow: 0.0,
    cHigh: 12.0,
    iLow: 0,
    iHigh: 50,
    category: 'Buena',
    level: 'buena',
    color: '#10B981',
    badgeBg: 'bg-emerald-500/15',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    borderColor: 'border-emerald-500/30',
    healthRecommendation: 'Calidad del aire óptima en La Cocha. Ideal para actividades deportivas y escolares al aire libre.',
    zafraRisk: 'Sin impacto detectable por humo de zafra o quema de biomasa.'
  },
  {
    cLow: 12.1,
    cHigh: 35.4,
    iLow: 51,
    iHigh: 100,
    category: 'Moderada',
    level: 'moderada',
    color: '#F59E0B',
    badgeBg: 'bg-amber-500/15',
    textColor: 'text-amber-700 dark:text-amber-300',
    borderColor: 'border-amber-500/30',
    healthRecommendation: 'Aceptable. Personas con asma o afecciones pulmonares crónicas deben prestar atención a síntomas.',
    zafraRisk: 'Presencia leve de partículas en suspensión en la cuenca sur de Tucumán.'
  },
  {
    cLow: 35.5,
    cHigh: 55.4,
    iLow: 101,
    iHigh: 150,
    category: 'Insalubre para Grupos Sensibles',
    level: 'sensible',
    color: '#F97316',
    badgeBg: 'bg-orange-500/15',
    textColor: 'text-orange-700 dark:text-orange-300',
    borderColor: 'border-orange-500/30',
    healthRecommendation: 'Niños, adultos mayores y personas alérgicas deben reducir el esfuerzo prolongado al aire libre.',
    zafraRisk: 'Emisiones activas de zafra o quemas de rastrojo cercanas a la zona urbana.'
  },
  {
    cLow: 55.5,
    cHigh: 150.4,
    iLow: 151,
    iHigh: 200,
    category: 'Insalubre',
    level: 'insalubre',
    color: '#EF4444',
    badgeBg: 'bg-rose-500/15',
    textColor: 'text-rose-700 dark:text-rose-300',
    borderColor: 'border-rose-500/30',
    healthRecommendation: 'Toda la población escolar y urbana puede comenzar a experimentar irritación ocular y respiratoria. Evitar ejercicios intensos al aire libre.',
    zafraRisk: 'Alerta por humo denso de zafra y cenizas de cañaverales precipitándose en La Cocha.'
  },
  {
    cLow: 150.5,
    cHigh: 250.4,
    iLow: 201,
    iHigh: 300,
    category: 'Muy Insalubre',
    level: 'muy_insalubre',
    color: '#8B5CF6',
    badgeBg: 'bg-purple-500/15',
    textColor: 'text-purple-700 dark:text-purple-300',
    borderColor: 'border-purple-500/30',
    healthRecommendation: 'Condición de emergencia sanitaria ambiental. Permanecer en interiores y mantener ventanas cerradas.',
    zafraRisk: 'Foco severo de quema con estancamiento atmosférico por inversión térmica pedemontana.'
  },
  {
    cLow: 250.5,
    cHigh: 500.4,
    iLow: 301,
    iHigh: 500,
    category: 'Peligrosa',
    level: 'peligrosa',
    color: '#7F1D1D',
    badgeBg: 'bg-red-950/25',
    textColor: 'text-red-700 dark:text-red-300',
    borderColor: 'border-red-700/40',
    healthRecommendation: 'Alerta sanitaria máxima. Suspensión de actividades públicas y uso de protección respiratoria.',
    zafraRisk: 'Incendio forestal o quema masiva descontrolada en el sur provincial.'
  }
];

/**
 * Calculates mathematical ICA (Índice de Calidad del Aire) from PM2.5 concentration in µg/m³.
 * Uses EPA formula: I = ((I_high - I_low) / (C_high - C_low)) * (C - C_low) + I_low
 */
export function calculateICAFromPM25(pm25Raw?: string | number | null): ICAResult | null {
  if (pm25Raw === undefined || pm25Raw === null || pm25Raw === '') return null;
  const c = typeof pm25Raw === 'number' ? pm25Raw : parseFloat(pm25Raw);
  if (isNaN(c) || c < 0) return null;

  // Round concentration to 1 decimal place as specified by standard
  const cTrunc = Math.round(c * 10) / 10;

  for (const bp of BREAKPOINTS) {
    if (cTrunc >= bp.cLow && cTrunc <= bp.cHigh) {
      const icaVal = Math.round(
        ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (cTrunc - bp.cLow) + bp.iLow
      );
      return {
        ica: Math.min(500, Math.max(0, icaVal)),
        category: bp.category,
        level: bp.level,
        color: bp.color,
        badgeBg: bp.badgeBg,
        textColor: bp.textColor,
        borderColor: bp.borderColor,
        healthRecommendation: bp.healthRecommendation,
        zafraRisk: bp.zafraRisk
      };
    }
  }

  // Extreme case above 500.4 µg/m³
  return {
    ica: 500,
    category: 'Peligrosa (Extrema)',
    level: 'peligrosa',
    color: '#7F1D1D',
    badgeBg: 'bg-red-950/25',
    textColor: 'text-red-700 dark:text-red-300',
    borderColor: 'border-red-700/40',
    healthRecommendation: 'Alerta sanitaria máxima. Evitar cualquier exposición.',
    zafraRisk: 'Situación crítica de contaminación ambiental extrema.'
  };
}

/**
 * Calculates Cardinal direction from Degrees (AS5600 Magnetic Encoder: 0 - 360°)
 */
export function degreesToCardinal(degRaw?: string | number | null): { deg: number; cardinal: string; label: string } | null {
  if (degRaw === undefined || degRaw === null || degRaw === '') return null;
  const num = typeof degRaw === 'number' ? degRaw : parseFloat(degRaw);
  if (isNaN(num)) return null;

  const normalized = ((num % 360) + 360) % 360;
  const directions = [
    { card: 'N', label: 'Norte' },
    { card: 'NNE', label: 'Nor-Noreste' },
    { card: 'NE', label: 'Noreste' },
    { card: 'ENE', label: 'Este-Noreste' },
    { card: 'E', label: 'Este' },
    { card: 'ESE', label: 'Este-Sureste' },
    { card: 'SE', label: 'Sureste' },
    { card: 'SSE', label: 'Sur-Sureste' },
    { card: 'S', label: 'Sur' },
    { card: 'SSO', label: 'Sur-Suroeste' },
    { card: 'SO', label: 'Suroeste' },
    { card: 'OSO', label: 'Oeste-Suroeste' },
    { card: 'O', label: 'Oeste' },
    { card: 'ONO', label: 'Oeste-Noroeste' },
    { card: 'NO', label: 'Noroeste' },
    { card: 'NNO', label: 'Nor-Noroeste' }
  ];

  const index = Math.round(normalized / 22.5) % 16;
  return {
    deg: Math.round(normalized),
    cardinal: directions[index].card,
    label: directions[index].label
  };
}
