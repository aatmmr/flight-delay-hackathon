import { Router, Request, Response } from 'express';
import {
  getAllFlights,
  searchFlights,
  getUniqueAirportNames,
  getUniqueCarriers,
} from '../services/dataService.js';
import { Flight, PaginatedResponse } from '../types.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 500);

    const allFlights = getAllFlights();
    const total = allFlights.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = allFlights.slice(start, start + limit);

    const response: PaginatedResponse<Flight> = {
      data,
      page,
      limit,
      total,
      totalPages,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
});

router.get('/search', (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 500);

    const results = searchFlights({
      origin: req.query.origin as string,
      destination: req.query.destination as string,
      carrier: req.query.carrier as string,
      minDelay: req.query.minDelay ? parseInt(req.query.minDelay as string) : undefined,
      maxDelay: req.query.maxDelay ? parseInt(req.query.maxDelay as string) : undefined,
      year: req.query.year ? parseInt(req.query.year as string) : undefined,
      month: req.query.month ? parseInt(req.query.month as string) : undefined,
    });

    const total = results.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = results.slice(start, start + limit);

    const response: PaginatedResponse<Flight> = {
      data,
      page,
      limit,
      total,
      totalPages,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search flights' });
  }
});

router.get('/airports', (req: Request, res: Response) => {
  try {
    const airports = getUniqueAirportNames();
    res.json({ airports });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch airports' });
  }
});

router.get('/carriers', (req: Request, res: Response) => {
  try {
    const carriers = getUniqueCarriers();
    res.json({ carriers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch carriers' });
  }
});

export default router;
