import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize Gemini AI SDK (server-side only, per security standards)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Guestbook y Institution Storage (persisted to data/ directory)
const DATA_DIR = path.resolve(process.cwd(), 'data');
const GUESTBOOK_FILE = path.join(DATA_DIR, 'guestbook.json');
const INSTITUTION_FILE = path.join(DATA_DIR, 'institution.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial institution profile for Escuela Técnica N° 1 La Cocha
const defaultInstitution = {
  title: "Escuela Técnica N° 1 La Cocha",
  subtitle: "Proyecto de Estación Meteorológica y Calidad del Aire IoT",
  location: "La Cocha, Tucumán, Argentina (-27.7667, -65.5833)",
  description: "Nodo ambiental IoT de la Escuela Técnica N° 1. Monitoreo en tiempo real de variables climáticas, calidad del aire y parámetros agroecológicos para la comunidad de La Cocha y el sur de Tucumán.",
  objectives: [
    "Medición continua de temperatura, humedad y presión barométrica con sensor BME280.",
    "Medición cinemática de viento (anemómetro y sensor magnético AS5600) y lluvia con pluviómetro.",
    "Monitoreo de material particulado PM2.5 con sensor láser PMS5003 durante la época de zafra.",
    "Medición de gases con sensores MH-Z19C (CO2) y MQ-7 (CO), y radiación UV con sensor ML8511.",
    "Geolocalización en tiempo real mediante GPS NEO-6M.",
    "Alertas tempranas agro-climáticas y de riesgo de anegamiento en la cuenca sur de Tucumán."
  ],
  team: "Departamento de Educación Técnico Profesional - E.T. N° 1 La Cocha",
  stationHardware: "Nodo IoT ESP32 / BME280 / PMS5003 / MH-Z19C / MQ-7 / ML8511 / LDR / AS5600 / GPS NEO-6M / Pluviómetro",
  updatedAt: new Date().toISOString()
};

// Initial Guestbook starts completely empty (cero datos simulados)
const defaultGuestbook: any[] = [];

function readGuestbook() {
  try {
    if (fs.existsSync(GUESTBOOK_FILE)) {
      return JSON.parse(fs.readFileSync(GUESTBOOK_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error("Error reading guestbook:", e);
  }
  return defaultGuestbook;
}

function writeGuestbook(data: any) {
  try {
    fs.writeFileSync(GUESTBOOK_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error("Error writing guestbook:", e);
  }
}

function readInstitution() {
  try {
    if (fs.existsSync(INSTITUTION_FILE)) {
      return JSON.parse(fs.readFileSync(INSTITUTION_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error("Error reading institution:", e);
  }
  return defaultInstitution;
}

function writeInstitution(data: any) {
  try {
    fs.writeFileSync(INSTITUTION_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error("Error writing institution:", e);
  }
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// System configuration info (no channel 9, empty if unconfigured)
app.get('/api/config', (_req, res) => {
  res.json({
    channelId: process.env.THINGSPEAK_CHANNEL_ID || '',
    channelId2: process.env.THINGSPEAK_CHANNEL_ID_2 || '',
    hasReadKey: Boolean(process.env.THINGSPEAK_READ_KEY),
    hasReadKey2: Boolean(process.env.THINGSPEAK_READ_KEY_2),
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    coordinates: {
      lat: -27.7667,
      lng: -65.5833,
      city: "La Cocha",
      province: "Tucumán",
      country: "Argentina"
    }
  });
});

// Helper to fetch a single ThingSpeak channel
async function fetchChannel(channelId: string, readKey: string, results: number) {
  if (!channelId || !channelId.trim()) {
    return { channel: null, feeds: [] };
  }
  let url = `https://api.thingspeak.com/channels/${channelId.trim()}/feeds.json?results=${results}`;
  if (readKey && readKey.trim()) {
    url += `&api_key=${readKey.trim()}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);

  try {
    const tsRes = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!tsRes.ok) {
      console.warn(`ThingSpeak channel ${channelId} error: HTTP ${tsRes.status}`);
      return { channel: null, feeds: [], error: `HTTP ${tsRes.status}` };
    }
    const data = await tsRes.json();
    return {
      channel: data.channel || null,
      feeds: Array.isArray(data.feeds) ? data.feeds : []
    };
  } catch (err: any) {
    clearTimeout(timeout);
    console.warn(`ThingSpeak channel ${channelId} fetch failed:`, err.message);
    return { channel: null, feeds: [], error: err.message };
  }
}

// Simultaneous fetch of BOTH channels with combined data payload
app.get('/api/thingspeak/feeds', async (req, res) => {
  const channelId = (req.query.channelId as string) ?? process.env.THINGSPEAK_CHANNEL_ID ?? '';
  const readKey = (req.query.readKey as string) ?? process.env.THINGSPEAK_READ_KEY ?? '';
  const channelId2 = (req.query.channelId2 as string) ?? process.env.THINGSPEAK_CHANNEL_ID_2 ?? '';
  const readKey2 = (req.query.readKey2 as string) ?? process.env.THINGSPEAK_READ_KEY_2 ?? '';
  const results = parseInt((req.query.results as string) || '100', 10);

  // If no channel is configured at all, return empty state (cero canal fantasma)
  if (!channelId && !channelId2) {
    return res.json({
      configured: false,
      channel1: null,
      channel2: null,
      feeds1: [],
      feeds2: [],
      combined: {
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
      }
    });
  }

  try {
    // Simultaneous fetch to BOTH channels
    const [res1, res2] = await Promise.all([
      fetchChannel(channelId, readKey, results),
      fetchChannel(channelId2, readKey2, results)
    ]);

    const feeds1 = res1.feeds || [];
    const feeds2 = res2.feeds || [];
    const latest1 = feeds1.length > 0 ? feeds1[feeds1.length - 1] : null;
    const latest2 = feeds2.length > 0 ? feeds2[feeds2.length - 1] : null;

    // Parse GPS from Channel 2 field4 (Latitud) y field5 (Longitud)
    let parsedLat = -27.7667;
    let parsedLng = -65.5833;
    let hasLiveGps = false;

    if (latest2?.field4 && latest2?.field5) {
      const latNum = parseFloat(latest2.field4);
      const lngNum = parseFloat(latest2.field5);
      if (!isNaN(latNum) && !isNaN(lngNum) && latNum !== 0 && lngNum !== 0) {
        parsedLat = latNum;
        parsedLng = lngNum;
        hasLiveGps = true;
      }
    }

    // Combined object with exact requested mapping
    const combined = {
      // Canal 1:
      temp: latest1?.field1 ?? null,
      humidity: latest1?.field2 ?? null,
      pressure: latest1?.field3 ?? null,
      windSpeed: latest1?.field4 ?? null,
      windDirection: latest1?.field5 ?? null,
      rain: latest1?.field6 ?? null,
      pm25: latest1?.field7 ?? null,
      co2: latest1?.field8 ?? null,

      // Canal 2:
      co: latest2?.field1 ?? null,
      uv: latest2?.field2 ?? null,
      heliofania: latest2?.field3 ?? null,
      gpsLat: parsedLat,
      gpsLng: parsedLng,
      hasLiveGps,

      created_at: latest1?.created_at || latest2?.created_at || null
    };

    return res.json({
      configured: true,
      channel1: res1.channel,
      channel2: res2.channel,
      feeds1,
      feeds2,
      latest1,
      latest2,
      combined
    });
  } catch (error: any) {
    return res.status(500).json({
      error: `Error al conectar con ThingSpeak: ${error.message || 'Error desconocido'}`,
      configured: true,
      feeds1: [],
      feeds2: [],
      combined: null
    });
  }
});

// Gemini Early Warning Generation with resilient multi-model fallback to prevent 503
app.post('/api/gemini/alert', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({
        error: 'GEMINI_API_KEY no está configurada en las variables de entorno del servidor.'
      });
    }

    const { temp, humidity, pressure, windSpeed, windDirection, rain, pm25, co2, co, uv, timestamp } = req.body;

    const telemetrySummary = `Temperatura: ${temp ?? '--'}°C, Humedad: ${humidity ?? '--'}%, Presión: ${pressure ?? '--'} hPa, Velocidad del Viento: ${windSpeed ?? '--'} km/h, Dirección del Viento: ${windDirection ?? '--'}°, Lluvia: ${rain ?? '--'} mm, PM2.5: ${pm25 ?? '--'} µg/m³ (Calidad de Aire), CO2: ${co2 ?? '--'} ppm, CO: ${co ?? '--'} ppm, Radiación UV: ${uv ?? '--'} UVI, Fecha/Hora (Tucumán): ${timestamp || 'Reciente'}`;

    // Prompt as requested (objective AI technical report, no first person)
    const prompt = `Analiza los siguientes datos ambientales de La Cocha, Tucumán: ${telemetrySummary}. Redacta un reporte técnico de alerta temprana sobre riesgos de tormenta/inundación o salud por zafra. No uses primera persona ni te presentes como humano.`;

    // Resilient model selection to prevent 503 high-demand spike
    const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-2.5-flash'];
    let lastError: any = null;
    let alertText: string | null = null;

    for (const modelCandidate of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelCandidate,
          contents: prompt,
          config: {
            systemInstruction: "Eres un motor de Inteligencia Artificial de análisis ambiental. Analiza los datos de La Cocha (Tucumán) y genera un reporte técnico de riesgos. No te presentes como humano ni uses primera persona.",
            temperature: 0.2,
          }
        });
        if (response.text) {
          alertText = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${modelCandidate} failed:`, err.message);
        lastError = err;
      }
    }

    if (!alertText) {
      throw lastError || new Error('No se pudo obtener respuesta de ningún modelo de Gemini.');
    }

    return res.json({
      alertText,
      generatedAt: new Date().toISOString(),
      telemetryUsed: { temp, humidity, pressure, pm25, rain, timestamp }
    });
  } catch (error: any) {
    console.error('Error generating Gemini alert:', error);
    return res.status(500).json({
      error: `Error al generar alerta con Gemini: ${error.message || 'Fallo de procesamiento'}`
    });
  }
});

// Guestbook APIs (Silent post y Admin delete/reply)
app.get('/api/guestbook', (_req, res) => {
  res.json(readGuestbook());
});

app.post('/api/guestbook', (req, res) => {
  const { name, location, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: 'Nombre y mensaje son requeridos.' });
  }

  const entries = readGuestbook();
  const newEntry = {
    id: `visit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: String(name).trim().slice(0, 80),
    location: location ? String(location).trim().slice(0, 100) : 'La Cocha, Tucumán',
    message: String(message).trim().slice(0, 500),
    createdAt: new Date().toISOString(),
    reply: null
  };

  entries.unshift(newEntry);
  writeGuestbook(entries);
  return res.status(201).json(newEntry);
});

app.delete('/api/guestbook/:id', (req, res) => {
  const { id } = req.params;
  const entries = readGuestbook();
  const filtered = entries.filter((e: any) => e.id !== id);
  if (filtered.length === entries.length) {
    return res.status(404).json({ error: 'Entrada no encontrada.' });
  }
  writeGuestbook(filtered);
  return res.json({ success: true, id });
});

app.post('/api/guestbook/:id/reply', (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;
  const entries = readGuestbook();
  const entry = entries.find((e: any) => e.id === id);
  if (!entry) {
    return res.status(404).json({ error: 'Entrada no encontrada.' });
  }
  entry.reply = reply ? String(reply).trim().slice(0, 300) : null;
  writeGuestbook(entries);
  return res.json(entry);
});

// Institution API ("Quiénes Somos")
app.get('/api/institution', (_req, res) => {
  res.json(readInstitution());
});

app.put('/api/institution', (req, res) => {
  const current = readInstitution();
  const updated = {
    ...current,
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  writeInstitution(updated);
  return res.json(updated);
});

// -------------------------------------------------------------
// Serve Application
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cupertino Eco-IoT Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
