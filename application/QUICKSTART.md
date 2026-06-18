# Flight Delay Application - Quick Start Guide

This directory contains a complete full-stack application for analyzing US flight delays.

## 📁 Folder Structure

```
application/
├── backend/          Express.js API server
├── frontend/         React SPA
├── install.sh        Install dependencies for both apps
├── start.sh          Start both servers (dev mode)
└── README.md         Full documentation
```

## 🚀 Quick Start (2 methods)

### ⚠️ IMPORTANT: Both Services Required

The application requires **BOTH backend and frontend** to be running simultaneously:
- **Backend** (Express.js) on port 8000 - serves the flight data API
- **Frontend** (React) on port 8001 - consumes the API

If you only run the frontend, you'll see connection errors: `ECONNREFUSED`

### Method 1: Automated Setup (Recommended)

```bash
# From the application/ directory
./install.sh
./start.sh
```

This will:
1. Install all dependencies
2. Configure environment variables
3. Start both backend and frontend servers

Then open: **http://localhost:8001**

---

### Method 2: Manual Setup (for more control)

#### Backend Setup
```bash
cd backend
./setup.sh              # Install, build, and configure
npm run dev             # Start development server (port 8000)
```

#### Frontend Setup (in a new terminal)
```bash
cd frontend
./setup.sh              # Install and build
npm run dev             # Start dev server (port 8001)
```

---

## 🔧 Available Scripts

### Root Level (application/)
- **`./install.sh`** - Install dependencies for backend + frontend
- **`./start.sh`** - Start both servers simultaneously

### Backend (application/backend/)
- **`./setup.sh`** - Quick setup (install + build + config)
- **`npm run dev`** - Start development server with ts-node
- **`npm run build`** - Compile TypeScript to JavaScript
- **`npm start`** - Run production build (dist/index.js)

### Frontend (application/frontend/)
- **`./setup.sh`** - Quick setup (install + build)
- **`npm run dev`** - Start Vite dev server with HMR
- **`npm run build`** - Build optimized production bundle
- **`npm run preview`** - Preview production build locally

---

## 📝 Environment Setup

### Backend Configuration
The backend uses an `.env` file for configuration:

```env
PORT=8000
NODE_ENV=development
CORS_ORIGIN=http://localhost:8001
CSV_PATH=../../data/flights.csv
```

**Automatic**: `./install.sh` creates `.env` from `.env.example`

**Manual**: Copy `.env.example` to `.env` and adjust as needed

### Frontend Configuration
Frontend uses environment variables passed through Vite config.

The dev server automatically proxies API calls to `http://localhost:8000`

---

## 🌐 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:8001 | Main application UI |
| Backend | http://localhost:8000 | REST API server |
| Health Check | http://localhost:8000/health | Backend status |

---

## 📊 Features

The application provides:

1. **Flight Search** - Filter flights by airport, carrier, delay range
2. **Analytics Dashboard** - Charts showing delay patterns
3. **Route Visualization** - Interactive map of flight routes colored by delays

---

## 🔌 API Endpoints

Key endpoints (full list in README.md):

```
GET  /api/flights              - List all flights (paginated)
GET  /api/flights/search       - Search with filters
GET  /api/flights/airports     - Available airports
GET  /api/flights/carriers     - Available carriers
GET  /api/analytics/delays     - Delay statistics
GET  /api/analytics/routes     - Route analytics
GET  /api/analytics/airports   - Airport locations
```

---

## 🛠 Troubleshooting

### Ports Already in Use
```bash
# Check what's using the ports
lsof -i :8000     # Backend
lsof -i :8001     # Frontend

# Kill the process (macOS/Linux)
kill -9 <PID>
```

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Backend Not Loading CSV
- Verify CSV path in `.env`
- Check that `data/flights.csv` exists in root
- Check file permissions

### Frontend Not Connecting to Backend
- Ensure backend is running on port 8000
- Check CORS_ORIGIN in backend .env matches frontend URL
- Check browser console for CORS errors

---

## 📚 Documentation

For detailed information, see:
- **README.md** - Full architecture, features, and API reference
- **Backend README** - Server-side setup and development
- **Frontend README** - Client-side setup and development

---

## 🚢 Production Deployment

### Build for Production

```bash
# Build backend
cd backend
npm run build

# Build frontend
cd frontend
npm run build
```

### Run Production Build

```bash
# Backend
cd backend
npm start         # Runs compiled JavaScript from dist/

# Frontend
cd frontend
npm run preview   # Preview production build
# Or serve dist/ directory with a static HTTP server
```

---

## 💡 Development Tips

### Hot Module Replacement
- Frontend: Changes reload automatically in browser (Vite HMR)
- Backend: Use `npm run dev` for automatic restart on file changes

### Debugging
- Backend: Check console logs in terminal
- Frontend: Use browser DevTools (F12) → Console/Network
- API Debugging: Use curl, Postman, or VS Code REST Client

### Code Structure
- **Backend**: TypeScript in `src/`, compiled to `dist/`
- **Frontend**: React components in `src/`, built to `dist/`
- Both use ESM (ES6 modules)

---

## 📊 Data

The application analyzes **7.2 million flight records** from 2013.

Data source: `data/flights.csv` (relative to repo root)

**Note**: First startup takes ~30 seconds as CSV is loaded and indexed.

---

## 🎯 Next Steps

1. Run `./install.sh` from the application/ directory
2. Run `./start.sh` to start both servers
3. Open http://localhost:8001 in your browser
4. Try searching for flights, viewing analytics, or checking the map

Enjoy exploring flight delay data! ✈️

---

## 📄 License

MIT - See LICENSE file in repository root
