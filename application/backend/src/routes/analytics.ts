import { Router, Request, Response } from 'express';
import {
  calculateDelayStats,
  calculateRouteStats,
  calculateDelayStatsByDayOfWeek,
  calculateDelayStatsByMonth,
  getAllAirports,
} from '../services/dataService.js';
import { AnalyticsResponse } from '../types.js';

const router = Router();

router.get('/delays', (req: Request, res: Response) => {
  try {
    const byCarrier = calculateDelayStats();
    const byDayOfWeek = calculateDelayStatsByDayOfWeek();
    const byMonth = calculateDelayStatsByMonth();

    const response: AnalyticsResponse = {
      delaysByCarrier: Object.values(byCarrier).sort(
        (a, b) => b.delayedFlights - a.delayedFlights
      ),
      delaysByDayOfWeek: byDayOfWeek,
      delaysByMonth: byMonth,
      topRoutes: calculateRouteStats().slice(0, 20),
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate delay statistics' });
  }
});

router.get('/routes', (req: Request, res: Response) => {
  try {
    const topRoutes = calculateRouteStats();
    const limit = parseInt(req.query.limit as string) || 100;

    res.json({
      routes: topRoutes.slice(0, Math.min(limit, topRoutes.length)),
      total: topRoutes.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch route statistics' });
  }
});

router.get('/airports', (req: Request, res: Response) => {
  try {
    const airports = getAllAirports();
    res.json({ airports });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch airport information' });
  }
});

export default router;
