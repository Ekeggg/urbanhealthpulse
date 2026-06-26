import { Router } from 'express';
import prisma from '../lib/db';
import { analyzePersonal, analyzeCity } from '../lib/claude';

const router = Router();

// For the hackathon, userId is hardcoded. Swap in Clerk later.
const USER_ID = 'demo-user';

// POST /api/log
router.post('/log', async (req, res) => {
  try {
    const { symptoms, severity, district, lat, lng, notes } = req.body;
    const log = await prisma.symptomLog.create({
      data: {
        userId: USER_ID,
        symptoms: JSON.stringify(symptoms),
        severity,
        district,
        lat,
        lng,
        notes,
      },
    });
    res.json({ ...log, symptoms });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create log' });
  }
});

// GET /api/my-logs
router.get('/my-logs', async (req, res) => {
  try {
    const logs = await prisma.symptomLog.findMany({
      where: { userId: USER_ID },
      orderBy: { date: 'desc' },
    });
    res.json(logs.map(l => ({ ...l, symptoms: JSON.parse(l.symptoms) })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// GET /api/city-summary — aggregate by district for the map
router.get('/city-summary', async (req, res) => {
  try {
    const logs = await prisma.symptomLog.findMany({ orderBy: { date: 'desc' } });

    const districtMap = new Map<string, { lat: number; lng: number; logs: any[] }>();
    for (const log of logs) {
      if (!districtMap.has(log.district)) {
        districtMap.set(log.district, { lat: log.lat, lng: log.lng, logs: [] });
      }
      districtMap.get(log.district)!.logs.push({ ...log, symptoms: JSON.parse(log.symptoms) });
    }

    const summaries = Array.from(districtMap.entries()).map(([district, data]) => {
      const allSymptoms = data.logs.flatMap(l => l.symptoms);
      const counts = allSymptoms.reduce((acc: Record<string, number>, s: string) => {
        acc[s] = (acc[s] || 0) + 1;
        return acc;
      }, {});
      const topSymptoms = Object.entries(counts)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 3)
        .map(([s]) => s);
      const avgSeverity =
        Math.round(
          (data.logs.reduce((sum, l) => sum + l.severity, 0) / data.logs.length) * 10
        ) / 10;

      return { district, lat: data.lat, lng: data.lng, count: data.logs.length, avgSeverity, topSymptoms };
    });

    res.json(summaries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch city summary' });
  }
});

// GET /api/insights/personal
router.get('/insights/personal', async (req, res) => {
  try {
    const logs = await prisma.symptomLog.findMany({
      where: { userId: USER_ID },
      orderBy: { date: 'asc' },
    });

    if (logs.length < 2) {
      return res.json({
        summary: 'Log at least 2 days of symptoms to see your personal analysis.',
        patterns: [],
        flags: [],
        advice: 'Keep logging daily for the best results.',
      });
    }

    const analysis = await analyzePersonal(
      logs.map(l => ({ ...l, symptoms: JSON.parse(l.symptoms) }))
    );
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze personal data' });
  }
});

// GET /api/insights/city
router.get('/insights/city', async (req, res) => {
  try {
    const logs = await prisma.symptomLog.findMany({ orderBy: { date: 'desc' } });

    if (logs.length < 5) {
      return res.json({
        alert_level: 'low',
        summary: 'Not enough city-wide data yet.',
        hotspots: [],
        trends: [],
        recommendations: ['Encourage more residents to log symptoms.'],
      });
    }

    const districtMap = new Map<string, { lat: number; lng: number; logs: any[] }>();
    for (const log of logs) {
      if (!districtMap.has(log.district)) {
        districtMap.set(log.district, { lat: log.lat, lng: log.lng, logs: [] });
      }
      districtMap.get(log.district)!.logs.push({ ...log, symptoms: JSON.parse(log.symptoms) });
    }

    const summaries = Array.from(districtMap.entries()).map(([district, data]) => {
      const allSymptoms = data.logs.flatMap(l => l.symptoms);
      const counts = allSymptoms.reduce((acc: Record<string, number>, s: string) => {
        acc[s] = (acc[s] || 0) + 1;
        return acc;
      }, {});
      const topSymptoms = Object.entries(counts)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 3)
        .map(([s]) => s);
      const avgSeverity =
        Math.round(
          (data.logs.reduce((sum, l) => sum + l.severity, 0) / data.logs.length) * 10
        ) / 10;
      return { district, lat: data.lat, lng: data.lng, count: data.logs.length, avgSeverity, topSymptoms };
    });

    const analysis = await analyzeCity(summaries);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze city data' });
  }
});

export default router;
