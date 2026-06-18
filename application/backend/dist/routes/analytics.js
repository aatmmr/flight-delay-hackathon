import { Router } from 'express';
import { calculateDelayStats, calculateRouteStats, calculateDelayStatsByDayOfWeek, calculateDelayStatsByMonth, getAllAirports, } from '../services/dataService.js';
const router = Router();
router.get('/delays', (req, res) => {
    try {
        const byCarrier = calculateDelayStats();
        const byDayOfWeek = calculateDelayStatsByDayOfWeek();
        const byMonth = calculateDelayStatsByMonth();
        const response = {
            delaysByCarrier: Object.values(byCarrier).sort((a, b) => b.delayedFlights - a.delayedFlights),
            delaysByDayOfWeek: byDayOfWeek,
            delaysByMonth: byMonth,
            topRoutes: calculateRouteStats().slice(0, 20),
        };
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to calculate delay statistics' });
    }
});
router.get('/routes', (req, res) => {
    try {
        const topRoutes = calculateRouteStats();
        const limit = parseInt(req.query.limit) || 100;
        res.json({
            routes: topRoutes.slice(0, Math.min(limit, topRoutes.length)),
            total: topRoutes.length,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch route statistics' });
    }
});
router.get('/airports', (req, res) => {
    try {
        const airports = getAllAirports();
        res.json({ airports });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch airport information' });
    }
});
export default router;
//# sourceMappingURL=analytics.js.map