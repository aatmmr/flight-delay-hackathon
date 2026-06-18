import { Router } from 'express';
import { getAllFlights, searchFlights, getUniqueAirportNames, getUniqueCarriers, } from '../services/dataService.js';
const router = Router();
router.get('/', (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 100, 500);
        const allFlights = getAllFlights();
        const total = allFlights.length;
        const totalPages = Math.ceil(total / limit);
        const start = (page - 1) * limit;
        const data = allFlights.slice(start, start + limit);
        const response = {
            data,
            page,
            limit,
            total,
            totalPages,
        };
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch flights' });
    }
});
router.get('/search', (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 100, 500);
        const results = searchFlights({
            origin: req.query.origin,
            destination: req.query.destination,
            carrier: req.query.carrier,
            minDelay: req.query.minDelay ? parseInt(req.query.minDelay) : undefined,
            maxDelay: req.query.maxDelay ? parseInt(req.query.maxDelay) : undefined,
            year: req.query.year ? parseInt(req.query.year) : undefined,
            month: req.query.month ? parseInt(req.query.month) : undefined,
        });
        const total = results.length;
        const totalPages = Math.ceil(total / limit);
        const start = (page - 1) * limit;
        const data = results.slice(start, start + limit);
        const response = {
            data,
            page,
            limit,
            total,
            totalPages,
        };
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to search flights' });
    }
});
router.get('/airports', (req, res) => {
    try {
        const airports = getUniqueAirportNames();
        res.json({ airports });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch airports' });
    }
});
router.get('/carriers', (req, res) => {
    try {
        const carriers = getUniqueCarriers();
        res.json({ carriers });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch carriers' });
    }
});
export default router;
//# sourceMappingURL=flights.js.map