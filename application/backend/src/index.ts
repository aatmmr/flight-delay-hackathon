import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { loadFlightData } from './services/dataService.js';
import flightsRouter from './routes/flights.js';
import analyticsRouter from './routes/analytics.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:8001';
const CSV_PATH = process.env.CSV_PATH || '../../../data/flights.csv';

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/api/flights', flightsRouter);
app.use('/api/analytics', analyticsRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`[ERROR] ${err.message}`);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    status: err.status || 500,
  });
});

async function start() {
  try {
    console.log('Loading flight data...');
    const actualCsvPath = CSV_PATH.startsWith('/') 
      ? CSV_PATH 
      : path.resolve(__dirname, CSV_PATH);
    
    await loadFlightData(actualCsvPath);
    
    app.listen(PORT, () => {
      console.log(`✓ Server running at http://localhost:${PORT}`);
      console.log(`✓ CORS enabled for ${CORS_ORIGIN}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

export default app;
