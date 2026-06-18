# Copilot Instructions for Flight Delay Hackathon

This document describes the architecture, build process, and key conventions for effective Copilot assistance in this repository.

## Architecture Overview

**Full-stack application** for analyzing US flight delay data (2013 dataset, ~272K flights):
- **Backend**: Express.js + TypeScript on port 8000, loads flight data from CSV into memory at startup
- **Frontend**: React + Vite + TypeScript on port 8001, consumes backend API via Axios proxy
- **Routing**: Custom client-side Router component (not React Router)
- **Styling**: Tailwind CSS for frontend

**Critical constraint**: Both services MUST run simultaneously. Frontend proxy requests fail if backend is unavailable.

### Data Flow
1. Backend loads `data/flights.csv` on startup → indexes flights, airports, routes in memory
2. Frontend calls `/api/flights/*` and `/api/analytics/*` endpoints via Vite proxy
3. Proxy configured in `frontend/vite.config.ts` to forward `/api` → `http://localhost:8000`

### File Organization
```
application/
├── backend/          # Express server (port 8000)
│   ├── src/
│   │   ├── index.ts         # Server entry, CSV loading, route mounting
│   │   ├── types.ts         # Shared TypeScript interfaces
│   │   ├── routes/          # Express route handlers
│   │   │   ├── flights.ts   # GET /api/flights/* endpoints
│   │   │   └── analytics.ts # GET /api/analytics/* endpoints
│   │   └── services/
│   │       └── dataService.ts # CSV parsing, indexing, query functions
│   └── dist/                # Compiled output (tsc)
│
└── frontend/         # React SPA (port 8001)
    ├── src/
    │   ├── main.tsx              # React bootstrap
    │   ├── App.tsx               # Root component, Router + Layout
    │   ├── components/
    │   │   ├── Router.tsx        # Custom SPA router (custom impl, not React Router)
    │   │   └── Layout.tsx        # Navigation bar + page layout
    │   ├── pages/
    │   │   ├── SearchPage.tsx    # Flight search/filter with table
    │   │   ├── AnalyticsPage.tsx # Dashboard with Recharts visualizations
    │   │   └── MapPage.tsx       # Leaflet map with routes
    │   ├── lib/
    │   │   └── api.ts            # Axios HTTP client (typed API methods)
    │   └── types.ts              # TypeScript interfaces (shared with backend)
    └── vite.config.ts            # Vite config with /api proxy
```

## Build and Run Commands

### Backend
```bash
cd application/backend

npm run dev      # Start dev server (ts-node, watches changes)
npm run build    # Compile TypeScript → dist/
npm run start    # Run compiled production build (dist/index.js)
npm run lint     # eslint src --ext .ts
```

**Important**: Backend takes ~12 seconds on first startup to load and index CSV file (subsequent runs ~5 seconds).

### Frontend
```bash
cd application/frontend

npm run dev      # Start Vite dev server with HMR (port 8001)
npm run build    # tsc && vite build → dist/
npm run preview  # Preview production build locally
npm run lint     # eslint src --ext .ts,.tsx
```

### Root-Level Automation
```bash
cd application

./install.sh     # Install all dependencies (npm install × 2)
./start.sh       # Start both backend and frontend simultaneously
```

## TypeScript & Module System

- **Backend**: ES2020 target, ES2020 module format (ESM)
- **Frontend**: ES2020 target, ESNext module, strict mode, JSX enabled
- **Strict mode**: Enabled on both, unused variables/params are errors
- **Module imports**: Must include `.js` extension for local imports due to ESM (e.g., `import Router from './routes/flights.js'`)

## Key Conventions

### Backend API Design
- RESTful endpoints: `/api/flights/*` and `/api/analytics/*`
- Query parameters for filters: `?origin=JFK&carrier=AA&minDelay=15`
- Pagination: `?page=1&limit=100` (default 100, max 500)
- Responses: `{ data: T[], page, limit, total, totalPages }` for lists
- Error responses: `{ error: string, status: number }`
- Health check: `GET /health` → `{ status: 'ok' }`

### Environment Variables
Both services read from `.env` files (not committed):

**Backend** (`backend/.env`):
```
PORT=8000
NODE_ENV=development
CORS_ORIGIN=http://localhost:8001
CSV_PATH=../../../data/flights.csv
```

**Frontend** (no .env needed; uses Vite proxy):
- Port 8001 configured in `vite.config.ts`
- Proxy `/api` requests to `http://localhost:8000`

### CSV Data Loading
- File path: relative from `backend/src/index.ts` → `../../../data/flights.csv` (navigates up to repo root, then to `/data/`)
- Loaded in `loadFlightData()` function in `services/dataService.ts`
- Parsed with `csv-parser` package
- Indexed into maps for O(1) lookups by airport/route

### Frontend Routing
- Custom Router component in `components/Router.tsx` (NOT React Router)
- Usage: `<Router><Route path="/" element={<Page />} /><Route path="/analytics" element={<AnalyticsPage />} /></Router>`
- Navigation via JavaScript state, not URL hash

### API Client
- Centralized in `lib/api.ts` using Axios
- Exports `flightAPI` and `analyticsAPI` objects with typed methods
- Error interceptor added for ECONNREFUSED with user-friendly message
- No TypeScript `allowImportingTsExtensions` or other non-standard configs

### Type Safety
- Shared types in `types.ts` (both backend and frontend have the same interface definitions)
- Frontend types extend with `PaginatedResponse<T>` for API responses
- No `any` types; strict mode enforces typed functions and variables

### Styling
- Tailwind CSS for layout and utilities
- Framer Motion for animations (page transitions, list cascades)
- Recharts for dashboard visualizations
- Leaflet for map display

## Important Gotchas

1. **Both services must run** - Frontend will show ECONNREFUSED errors if backend is not running
2. **CSV path is relative from `backend/src/`** - If modifying CSV loading, use `../../../data/flights.csv` or environment variable
3. **ESM imports require `.js` extension** - Local module imports must include `.js` (e.g., `import app from './index.js'`)
4. **Port configuration** - Backend on 8000, frontend on 8001. Change via environment variables, not hardcoded
5. **Vite proxy only in development** - Production builds require separate backend hosting or reverse proxy

## Performance Considerations

- CSV loading (~272K records) takes ~12 seconds on first startup - acceptable for development
- All data indexed into in-memory maps for O(1) airport/route lookups
- Analytics endpoints return pre-computed stats, not real-time aggregations
- No database; all data reset on server restart

## Testing & Verification

### Quick Verification
```bash
# Terminal 1: Start backend
cd application/backend && npm run dev

# Terminal 2: Test backend (after startup completes)
curl http://localhost:8000/health
curl http://localhost:8000/api/flights/carriers

# Terminal 3: Start frontend
cd application/frontend && npm run dev

# Then open http://localhost:8001 in browser
```

### Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| `CSV file not found` | Wrong CSV_PATH in .env | Verify `CSV_PATH=../../../data/flights.csv` in `backend/.env` |
| `ECONNREFUSED` in browser | Backend not running | Start backend in separate terminal: `cd application/backend && npm run dev` |
| `Module not found: ...` | ESM import missing `.js` extension | Change `import foo from './bar'` to `import foo from './bar.js'` |
| Port already in use | Another process using 8000 or 8001 | Check `lsof -i :8000` and `lsof -i :8001`, kill if needed |
| Stale build output | Vite/tsc cache issues | Delete `frontend/dist` or `backend/dist` and rebuild |

## Scripts Reference

See `application/SCRIPTS.md` for detailed documentation on startup scripts and automation.

## Development Tips

- **Modifying backend**: Changes to `src/**/*.ts` auto-reload with `npm run dev`
- **Modifying frontend**: Vite HMR reloads changes instantly (port 8001 → http://localhost:8001)
- **TypeScript errors**: Run `npm run lint` to catch issues before runtime
- **Production**: Run `npm run build` in both backend and frontend, then `node dist/index.js` for backend and serve `frontend/dist` as static files
