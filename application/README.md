# Flight Delay Analysis Application

A full-stack web application for analyzing flight delay data from US domestic flights in 2013. Built with Express.js backend and React frontend.

## 📁 Project Structure

```
application/
├── backend/              # Express.js server
│   ├── src/
│   │   ├── index.ts     # Main server entry point
│   │   ├── types.ts     # TypeScript type definitions
│   │   ├── routes/      # API route handlers
│   │   │   ├── flights.ts    # Flight search endpoints
│   │   │   └── analytics.ts  # Analytics endpoints
│   │   └── services/    # Business logic
│   │       └── dataService.ts # CSV loading and data processing
│   ├── dist/            # Compiled JavaScript
│   ├── package.json
│   ├── tsconfig.json
│   └── .env            # Environment variables
│
└── frontend/            # React + Vite application
    ├── src/
    │   ├── main.tsx          # App entry point
    │   ├── App.tsx           # Root component
    │   ├── types.ts          # TypeScript interfaces
    │   ├── components/       # Reusable components
    │   │   ├── Layout.tsx    # Page layout with navigation
    │   │   └── Router.tsx    # Client-side router
    │   ├── lib/
    │   │   └── api.ts        # API client with axios
    │   ├── pages/            # Page components
    │   │   ├── SearchPage.tsx     # Search & filter flights
    │   │   ├── AnalyticsPage.tsx  # Delay analytics dashboard
    │   │   └── MapPage.tsx        # Route visualization on map
    │   └── index.css         # Tailwind styles
    ├── dist/                 # Built application
    ├── vite.config.ts
    ├── tsconfig.json
    ├── tailwind.config.js
    ├── package.json
    └── index.html            # HTML entry point
```

## 🚀 Quick Start

### ⚠️ IMPORTANT: Both Services Must Run Simultaneously

This is a **full-stack application** that requires:
1. **Backend** (Express.js) on port 8000 - serves the flight delay API
2. **Frontend** (React) on port 8001 - displays the UI and consumes the API

If you only start the frontend, all API calls will fail with `ECONNREFUSED` errors.

### Prerequisites
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd application/backend

# Install dependencies
npm install

# Build TypeScript
npm run build

# Start development server
npm run dev

# Or run production build
npm start
```

The backend will start on `http://localhost:8000` and load flight data from `../../data/flights.csv`.

**Environment Variables** (`.env`):
```
PORT=8000
NODE_ENV=development
CORS_ORIGIN=http://localhost:8001
CSV_PATH=../../data/flights.csv
```

### Frontend Setup

```bash
cd application/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The frontend will be available at `http://localhost:8001` and automatically proxy API requests to the backend.

---

## 📊 Features

### 1. **Flight Search & Filter**
- Search flights by origin/destination airport
- Filter by airline carrier
- Filter by departure delay range
- Paginated results (50 flights per page)
- View departure and arrival delays
- Real-time search with instant filtering

**Endpoint**: `GET /api/flights/search?origin=...&destination=...&carrier=...&minDelay=...&maxDelay=...&page=1&limit=50`

### 2. **Analytics Dashboard**
- **Top Airlines by Delays**: Bar chart showing which carriers have the most delayed flights
- **Delay by Day of Week**: Line chart showing delay patterns for each day
- **Delay by Month**: Monthly trends in flight delays
- **Key Metrics Cards**: Quick stats on delay percentages for top carriers

**Endpoint**: `GET /api/analytics/delays`

### 3. **Route Visualization Map**
- Interactive Leaflet map showing US flight routes
- Routes colored by delay severity:
  - 🔴 Red: High delays (>40%)
  - 🟠 Orange: Medium delays (30-40%)
  - 🟡 Yellow: Low delays (20-30%)
  - 🟢 Green: Minimal delays (<20%)
- Route thickness indicates number of delayed flights
- Click on routes to see detailed stats
- Airport markers for major hubs

**Endpoint**: `GET /api/analytics/routes?limit=500`

---

## 🔌 API Reference

### Flights Endpoints

#### List All Flights
```
GET /api/flights?page=1&limit=100
```
Returns paginated list of all flights.

#### Search Flights
```
GET /api/flights/search?origin=...&destination=...&carrier=...&minDelay=...&maxDelay=...&page=1&limit=50
```

**Query Parameters**:
- `origin` (string): Airport name (e.g., "John F. Kennedy International")
- `destination` (string): Airport name
- `carrier` (string): Airline code (e.g., "AA", "DL", "UA")
- `minDelay` (number): Minimum departure delay in minutes
- `maxDelay` (number): Maximum departure delay in minutes
- `year` (number): Year (2013)
- `month` (number): Month (1-12)
- `page` (number): Page number (default: 1)
- `limit` (number): Results per page (default: 100, max: 500)

#### Get Airports
```
GET /api/flights/airports
```
Returns list of all unique airport names.

#### Get Carriers
```
GET /api/flights/carriers
```
Returns list of all unique airline carriers.

### Analytics Endpoints

#### Delay Statistics
```
GET /api/analytics/delays
```
Returns comprehensive delay analysis:
- `delaysByCarrier`: Array of delay stats per airline
- `delaysByDayOfWeek`: Delay stats for each day of week
- `delaysByMonth`: Delay stats for each month
- `topRoutes`: Top 20 routes by number of delays

#### Route Statistics
```
GET /api/analytics/routes?limit=100
```
Returns detailed stats for flight routes.

#### Airport Information
```
GET /api/analytics/airports
```
Returns geographic coordinates for all airports.

---

## 🛠 Technology Stack

### Backend
- **Framework**: Express.js
- **Language**: TypeScript
- **Data Processing**: csv-parser
- **CORS**: Enabled for frontend
- **Middleware**: Express JSON parser, logging middleware

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Maps**: Leaflet
- **HTTP Client**: Axios
- **Routing**: Custom client-side router

---

## 📈 Data Schema

### Flight Record
```typescript
{
  year: number;
  month: number;
  dayOfMonth: number;
  dayOfWeek: number;           // 1=Monday, 7=Sunday
  carrier: string;              // Airline code (e.g., "AA")
  originAirportId: number;
  originAirportName: string;
  originCity: string;
  originState: string;
  destAirportId: number;
  destAirportName: string;
  destCity: string;
  destState: string;
  crsDepTime: number;            // Scheduled departure time (HHMM)
  depDelay: number;              // Departure delay in minutes
  depDel15: number;              // 1 if depDelay >= 15, else 0
  crsArrTime: number;            // Scheduled arrival time (HHMM)
  arrDelay: number;              // Arrival delay in minutes
  arrDel15: number;              // 1 if arrDelay >= 15, else 0
  cancelled: number;             // 1 if cancelled, else 0
}
```

### Delay Stats
```typescript
{
  carrier: string;
  totalFlights: number;
  delayedFlights: number;        // Flights with delay >= 15 min
  averageDepDelay: number;       // Average departure delay
  averageArrDelay: number;       // Average arrival delay
  delayPercentage: number;       // % of flights delayed >= 15 min
}
```

---

## 🎨 UI Components

### Layout Components
- **Navigation**: Top navigation bar with links to all pages
- **Layout**: Main wrapper with responsive grid layout
- **Router**: Simple client-side routing system

### Page Components
- **SearchPage**: Search form + results table
- **AnalyticsPage**: Multiple charts and metric cards
- **MapPage**: Leaflet map with route visualization

### Reusable Elements
- Form inputs (text, select, number)
- Tables with sorting and pagination
- Loading spinners
- Charts (Bar, Line charts)
- Map markers and polylines
- Metric cards

---

## ⚡ Performance Optimizations

### Backend
- **In-memory CSV loading**: Data loaded once at startup (~30 seconds)
- **Indexed lookups**: Airports and routes indexed for O(1) access
- **Precomputed analytics**: Delay stats computed on demand with caching potential
- **Pagination**: Results limited to prevent memory overload (max 500 per request)

### Frontend
- **Code splitting**: Routes lazy-loaded via dynamic imports
- **Memoization**: Component re-renders optimized with React.memo
- **Chart optimization**: Recharts handles large datasets efficiently
- **Virtual scrolling**: Tables can be virtualized for large datasets
- **Image optimization**: Leaflet tiles served via CDN

---

## 📝 Development Notes

### Adding New Features

**Add a new API endpoint**:
1. Create a route handler in `backend/src/routes/`
2. Add data processing logic to `backend/src/services/dataService.ts`
3. Define types in `backend/src/types.ts`
4. Register route in `backend/src/index.ts`

**Add a new page**:
1. Create page component in `frontend/src/pages/`
2. Add route to `Router` in `frontend/src/App.tsx`
3. Add navigation link in `frontend/src/components/Layout.tsx`
4. Create API calls in `frontend/src/lib/api.ts`

### Debugging
- Backend logs all requests with timestamps
- Frontend uses browser DevTools console
- API proxy configured in `vite.config.ts` for easy development

---

## 📊 Data Source

**Dataset**: US Domestic Flights (2013)
- **Source**: 2013 flight data from US aviation
- **Size**: ~7.2 million records
- **Format**: CSV with 21 columns
- **Location**: `../../data/flights.csv`

---

## 🚢 Deployment

### Backend
```bash
npm run build
npm start  # Uses compiled JavaScript
```

### Frontend
```bash
npm run build
# Serve dist/ folder with static HTTP server
```

---

## 📄 License

MIT

---

## 🤝 Contributing

Feel free to extend the application with:
- Real-time data updates via WebSocket
- Additional analytics visualizations
- Export to CSV/PDF
- Advanced filtering (date ranges, etc.)
- Dark mode
- Responsive improvements
- Performance enhancements

---

## 📞 Support

For issues or questions:
1. Check API endpoints with `curl` or Postman
2. Review browser console for frontend errors
3. Check server logs for backend issues
4. Verify CSV file path and data format
