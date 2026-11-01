import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ThingSpeakFeed, ThingSpeakChannel, CombinedTelemetry, SensorFieldKey, SensorMetadata } from '../types';

export const SENSOR_METADATA: Record<SensorFieldKey, SensorMetadata> = {
  // Canal 1: Clima, Viento, Lluvia, PM2.5 y CO2
  c1_field1: {
    key: 'c1_field1',
    channelNum: 1,
    fieldNum: 1,
    label: 'Temperatura',
    unit: '°C',
    sensorModel: 'BME280',
    iconName: 'Thermometer',
    color: '#F97316',
    colorDark: '#FB923C',
    badgeBg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    description: 'Temperatura ambiental exterior en el predio escolar',
    normalRange: '15°C - 35°C',
    category: 'Clima'
  },
  c1_field2: {
    key: 'c1_field2',
    channelNum: 1,
    fieldNum: 2,
    label: 'Humedad Relativa',
    unit: '%',
    sensorModel: 'BME280',
    iconName: 'Droplets',
    color: '#0EA5E9',
    colorDark: '#38BDF8',
    badgeBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    description: 'Humedad del aire en superficie en la cuenca sur tucumana',
    normalRange: '40% - 85%',
    category: 'Clima'
  },
  c1_field3: {
    key: 'c1_field3',
    channelNum: 1,
    fieldNum: 3,
    label: 'Presión Barométrica',
    unit: 'hPa',
    sensorModel: 'BME280',
    iconName: 'Gauge',
    color: '#8B5CF6',
    colorDark: '#A78BFA',
    badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    description: 'Presión atmosférica relativa a La Cocha (~440 msnm)',
    normalRange: '960 - 1020 hPa',
    category: 'Clima'
  },
  c1_field4: {
    key: 'c1_field4',
    channelNum: 1,
    fieldNum: 4,
    label: 'Velocidad del Viento',
    unit: 'km/h',
    sensorModel: 'Anemómetro',
    iconName: 'Compass',
    color: '#06B6D4',
    colorDark: '#22D3EE',
    badgeBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    description: 'Intensidad de corrientes procedentes del Aconquija',
    normalRange: '0 - 45 km/h',
    category: 'Cinemáticos'
  },
  c1_field5: {
    key: 'c1_field5',
    channelNum: 1,
    fieldNum: 5,
    label: 'Dirección del Viento',
    unit: '°',
    sensorModel: 'AS5600 Magnético',
    iconName: 'Navigation',
    color: '#6366F1',
    colorDark: '#818CF8',
    badgeBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    description: 'Orientación de la veleta según la rosa de los vientos',
    normalRange: '0° - 360°',
    category: 'Cinemáticos'
  },
  c1_field6: {
    key: 'c1_field6',
    channelNum: 1,
    fieldNum: 6,
    label: 'Precipitación Pluviométrica',
    unit: 'mm',
    sensorModel: 'Pluviómetro de Balancín',
    iconName: 'CloudRain',
    color: '#3B82F6',
    colorDark: '#60A5FA',
    badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    description: 'Lluvia acumulada en La Cocha (alerta de crecida en ríos)',
    normalRange: '0 - 50 mm/día',
    category: 'Cinemáticos'
  },
  c1_field7: {
    key: 'c1_field7',
    channelNum: 1,
    fieldNum: 7,
    label: 'Material Particulado PM2.5',
    unit: 'µg/m³',
    sensorModel: 'PMS5003 Láser',
    iconName: 'Wind',
    color: '#10B981',
    colorDark: '#34D399',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    description: 'Partículas finas respirables (alerta de humo por zafra)',
    normalRange: '< 25 µg/m³ (OMS)',
    category: 'Polvo y Calidad de Aire'
  },
  c1_field8: {
    key: 'c1_field8',
    channelNum: 1,
    fieldNum: 8,
    label: 'Dióxido de Carbono CO2',
    unit: 'ppm',
    sensorModel: 'MH-Z19C NDIR',
    iconName: 'Activity',
    color: '#EC4899',
    colorDark: '#F472B6',
    badgeBg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
    description: 'Concentración de CO2 ambiental por sensor infrarrojo',
    normalRange: '400 - 800 ppm',
    category: 'Gases'
  },

  // Canal 2: Gases CO, Ópticos UV y Heliofanía
  c2_field1: {
    key: 'c2_field1',
    channelNum: 2,
    fieldNum: 1,
    label: 'Monóxido de Carbono CO',
    unit: 'ppm',
    sensorModel: 'MQ-7 Electroquímico',
    iconName: 'Flame',
    color: '#F59E0B',
    colorDark: '#FBBF24',
    badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    description: 'Gas de combustión incompleta en cañaverales y pastizales',
    normalRange: '< 9 ppm (OMS)',
    category: 'Gases'
  },
  c2_field2: {
    key: 'c2_field2',
    channelNum: 2,
    fieldNum: 2,
    label: 'Índice UV Global',
    unit: 'UVI',
    sensorModel: 'ML8511 Fotodiodo',
    iconName: 'Sun',
    color: '#8B5CF6',
    colorDark: '#A78BFA',
    badgeBg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
    description: 'Intensidad de radiación ultravioleta del sol en superficie',
    normalRange: '0 - 11+ UVI',
    category: 'Ópticos'
  },
  c2_field3: {
    key: 'c2_field3',
    channelNum: 2,
    fieldNum: 3,
    label: 'Heliofanía Diaria',
    unit: 'min',
    sensorModel: 'LDR Fotocélula Solar',
    iconName: 'Sun',
    color: '#EAB308',
    colorDark: '#FACC15',
    badgeBg: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
    description: 'Minutos de brillo solar efectivo acumulados en el día',
    normalRange: '0 - 720 min',
    category: 'Ópticos'
  }
};

const defaultCombined: CombinedTelemetry = {
  temp: null,
  humidity: null,
  pressure: null,
  windSpeed: null,
  windDirection: null,
  rain: null,
  pm25: null,
  co2: null,
  co: null,
  uv: null,
  heliofania: null,
  gpsLat: -27.7667,
  gpsLng: -65.5833,
  hasLiveGps: false,
  created_at: null
};

interface AppContextType {
  // Theme
  themeMode: 'auto' | 'light' | 'dark';
  isDarkMode: boolean;
  setThemeMode: (mode: 'auto' | 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Navigation
  activeTab: number;
  setActiveTab: (tab: number) => void;
  selectedSensorField: SensorFieldKey;
  navigateToField: (fieldKey: SensorFieldKey) => void;
  activeCommunitySection: 'guestbook' | 'institution';
  setActiveCommunitySection: (sec: 'guestbook' | 'institution') => void;

  // Admin state
  isAdmin: boolean;
  loginAdmin: (pass: string) => boolean;
  logoutAdmin: () => void;

  // ThingSpeak Config (Channels 1 and 2, ZERO default to 9)
  channelId: string;
  readKey: string;
  channelId2: string;
  readKey2: string;
  setChannelsConfig: (c1: string, k1: string, c2: string, k2: string) => void;
  channelInfo1: ThingSpeakChannel | null;
  channelInfo2: ThingSpeakChannel | null;

  // Telemetry feeds & combined data
  feeds1: ThingSpeakFeed[];
  feeds2: ThingSpeakFeed[];
  latestFeed1: ThingSpeakFeed | null;
  latestFeed2: ThingSpeakFeed | null;
  combined: CombinedTelemetry;
  isConfigured: boolean;

  loading: boolean;
  error: string | null;
  lastFetchTime: Date | null;
  fetchFeeds: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Theme detection
  const [themeMode, setThemeMode] = useState<'auto' | 'light' | 'dark'>('auto');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = () => {
      const isDark = themeMode === 'auto' ? mediaQuery.matches : themeMode === 'dark';
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    applyTheme();
    const listener = () => {
      if (themeMode === 'auto') applyTheme();
    };
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // 2. Navigation & Global activeCommunitySection
  const [activeTab, setActiveTab] = useState<number>(1);
  const [activeCommunitySection, setActiveCommunitySection] = useState<'guestbook' | 'institution'>('guestbook');
  const [selectedSensorField, setSelectedSensorField] = useState<SensorFieldKey>('c1_field1');

  const navigateToField = (fieldKey: SensorFieldKey) => {
    setSelectedSensorField(fieldKey);
    setActiveTab(3); // Navigate to Pantalla 3 (Gráficos)
  };

  // 3. Admin State
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const loginAdmin = (pass: string): boolean => {
    if (pass.trim().toLowerCase() === 'tecnica1' || pass.trim() === 'lacochafc2026' || pass.trim() === 'admin') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };
  const logoutAdmin = () => setIsAdmin(false);

  // 4. ThingSpeak 2 Channels Config (CERO CANAL 9 / VACÍO POR DEFECTO)
  const [channelId, setChannelId] = useState<string>('');
  const [readKey, setReadKey] = useState<string>('');
  const [channelId2, setChannelId2] = useState<string>('');
  const [readKey2, setReadKey2] = useState<string>('');

  const [channelInfo1, setChannelInfo1] = useState<ThingSpeakChannel | null>(null);
  const [channelInfo2, setChannelInfo2] = useState<ThingSpeakChannel | null>(null);
  const [feeds1, setFeeds1] = useState<ThingSpeakFeed[]>([]);
  const [feeds2, setFeeds2] = useState<ThingSpeakFeed[]>([]);
  const [latestFeed1, setLatestFeed1] = useState<ThingSpeakFeed | null>(null);
  const [latestFeed2, setLatestFeed2] = useState<ThingSpeakFeed | null>(null);
  const [combined, setCombined] = useState<CombinedTelemetry>(defaultCombined);
  const [isConfigured, setIsConfigured] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);

  // Load server-side initial config
  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.channelId) setChannelId(String(data.channelId));
        if (data.channelId2) setChannelId2(String(data.channelId2));
      })
      .catch(err => console.warn('Could not load server config:', err));
  }, []);

  const setChannelsConfig = (c1: string, k1: string, c2: string, k2: string) => {
    setChannelId(c1.trim());
    setReadKey(k1.trim());
    setChannelId2(c2.trim());
    setReadKey2(k2.trim());
  };

  const fetchFeeds = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (channelId) queryParams.set('channelId', channelId);
      if (readKey) queryParams.set('readKey', readKey);
      if (channelId2) queryParams.set('channelId2', channelId2);
      if (readKey2) queryParams.set('readKey2', readKey2);
      queryParams.set('results', '100');

      const res = await fetch(`/api/thingspeak/feeds?${queryParams.toString()}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Error HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setIsConfigured(Boolean(data.configured));
      setChannelInfo1(data.channel1 || null);
      setChannelInfo2(data.channel2 || null);
      setFeeds1(Array.isArray(data.feeds1) ? data.feeds1 : []);
      setFeeds2(Array.isArray(data.feeds2) ? data.feeds2 : []);
      setLatestFeed1(data.latest1 || null);
      setLatestFeed2(data.latest2 || null);
      setCombined(data.combined || defaultCombined);
      setLastFetchTime(new Date());
    } catch (err: any) {
      console.error('Error fetching ThingSpeak feeds:', err);
      setError(err.message || 'No se pudo conectar a los canales de ThingSpeak.');
      setFeeds1([]);
      setFeeds2([]);
      setLatestFeed1(null);
      setLatestFeed2(null);
      setCombined(defaultCombined);
    } finally {
      setLoading(false);
    }
  }, [channelId, readKey, channelId2, readKey2]);

  useEffect(() => {
    fetchFeeds();
    const interval = setInterval(fetchFeeds, 30000);
    return () => clearInterval(interval);
  }, [fetchFeeds]);

  return (
    <AppContext.Provider
      value={{
        themeMode,
        isDarkMode,
        setThemeMode,
        toggleTheme,
        activeTab,
        setActiveTab,
        selectedSensorField,
        navigateToField,
        activeCommunitySection,
        setActiveCommunitySection,
        isAdmin,
        loginAdmin,
        logoutAdmin,
        channelId,
        readKey,
        channelId2,
        readKey2,
        setChannelsConfig,
        channelInfo1,
        channelInfo2,
        feeds1,
        feeds2,
        latestFeed1,
        latestFeed2,
        combined,
        isConfigured,
        loading,
        error,
        lastFetchTime,
        fetchFeeds
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
