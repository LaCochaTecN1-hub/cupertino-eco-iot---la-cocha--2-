export interface ThingSpeakChannel {
  id: number;
  name: string;
  description?: string;
  latitude?: string;
  longitude?: string;
  field1?: string;
  field2?: string;
  field3?: string;
  field4?: string;
  field5?: string;
  field6?: string;
  field7?: string;
  field8?: string;
  created_at?: string;
  updated_at?: string;
  last_entry_id?: number;
}

export interface ThingSpeakFeed {
  created_at: string;
  entry_id: number;
  field1?: string | null;
  field2?: string | null;
  field3?: string | null;
  field4?: string | null;
  field5?: string | null;
  field6?: string | null;
  field7?: string | null;
  field8?: string | null;
}

export interface CombinedTelemetry {
  // Canal 1: BME280, Cinemáticos, PMS5003 y MH-Z19C
  temp: string | null;          // field1: Temperatura (°C)
  humidity: string | null;      // field2: Humedad (%)
  pressure: string | null;      // field3: Presión (hPa)
  windSpeed: string | null;     // field4: Velocidad del Viento (km/h)
  windDirection: string | null; // field5: Dirección del Viento (AS5600, °)
  rain: string | null;          // field6: Lluvia (mm)
  pm25: string | null;          // field7: PM2.5 (µg/m³) -> Calcula ICA
  co2: string | null;           // field8: CO2 (ppm)

  // Canal 2: MQ-7, ML8511, LDR y GPS NEO-6M
  co: string | null;            // field1: CO (ppm / Riesgo)
  uv: string | null;            // field2: Índice UV (UVI)
  heliofania: string | null;    // field3: Heliofanía (min)
  gpsLat: number;               // field4: Latitud GPS
  gpsLng: number;               // field5: Longitud GPS
  hasLiveGps: boolean;          // true si provino del sensor GPS NEO-6M

  // Metadata
  created_at: string | null;
}

export interface GuestEntry {
  id: string;
  name: string;
  location: string;
  message: string;
  createdAt: string;
  reply?: string | null;
}

export interface InstitutionInfo {
  title: string;
  subtitle: string;
  location: string;
  description: string;
  objectives: string[];
  team: string;
  stationHardware: string;
  updatedAt?: string;
}

export type SensorFieldKey = 
  | 'c1_field1' 
  | 'c1_field2' 
  | 'c1_field3' 
  | 'c1_field4' 
  | 'c1_field5' 
  | 'c1_field6' 
  | 'c1_field7' 
  | 'c1_field8'
  | 'c2_field1'
  | 'c2_field2'
  | 'c2_field3';

export interface SensorMetadata {
  key: SensorFieldKey;
  channelNum: 1 | 2;
  fieldNum: number;
  label: string;
  unit: string;
  sensorModel: string;
  iconName: string;
  color: string;
  colorDark: string;
  badgeBg: string;
  description: string;
  normalRange: string;
  category: 'Clima' | 'Polvo y Calidad de Aire' | 'Gases' | 'Cinemáticos' | 'Ópticos';
}
