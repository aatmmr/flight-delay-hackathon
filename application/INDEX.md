# Flight Delay Application - Complete Index

## 📂 File Structure

```
flight-delay-hackathon/application/
│
├── 📚 DOCUMENTATION
│   ├── README.md                   - Full documentation (architecture, API, features)
│   ├── QUICKSTART.md               - Quick start reference guide
│   ├── INSTALL.md                  - Detailed installation instructions
│   ├── SCRIPTS.md                  - Complete scripts documentation
│   └── INDEX.md                    - This file
│
├── 🚀 SETUP SCRIPTS (Root)
│   ├── install.sh                  - Install all dependencies
│   ├── start.sh                    - Start both servers
│   └── setup-wizard.sh             - Interactive setup menu
│
├── 🔧 BACKEND (Express.js API)
│   ├── package.json                - Dependencies & npm scripts
│   ├── tsconfig.json               - TypeScript configuration
│   ├── .env.example                - Environment template
│   ├── .env                        - Environment (auto-created)
│   ├── setup.sh                    - Backend setup script
│   ├── start.sh                    - Start backend server
│   │
│   ├── src/
│   │   ├── index.ts                - Express app & server
│   │   ├── types.ts                - TypeScript definitions
│   │   ├── routes/
│   │   │   ├── flights.ts          - Flight search endpoints
│   │   │   └── analytics.ts        - Analytics endpoints
│   │   └── services/
│   │       └── dataService.ts      - Data loading & processing
│   │
│   └── dist/                       - Compiled JavaScript (generated)
│
├── 🎨 FRONTEND (React + Vite)
│   ├── package.json                - Dependencies & npm scripts
│   ├── tsconfig.json               - TypeScript configuration
│   ├── vite.config.ts              - Vite build config
│   ├── tailwind.config.js          - Tailwind CSS config
│   ├── index.html                  - HTML entry point
│   ├── setup.sh                    - Frontend setup script
│   ├── start.sh                    - Start frontend dev server
│   │
│   ├── src/
│   │   ├── main.tsx                - React entry point
│   │   ├── App.tsx                 - Root component
│   │   ├── types.ts                - TypeScript types
│   │   ├── index.css               - Tailwind styles
│   │   ├── components/
│   │   │   ├── Layout.tsx          - Navigation & layout
│   │   │   └── Router.tsx          - Client-side router
│   │   ├── pages/
│   │   │   ├── SearchPage.tsx      - Flight search UI
│   │   │   ├── AnalyticsPage.tsx   - Charts & analytics
│   │   │   └── MapPage.tsx         - Route visualization
│   │   └── lib/
│   │       └── api.ts              - API client
│   │
│   └── dist/                       - Built app (generated)
│
└── 📊 DATA
    └── flights.csv                 - 7.2M flight records (in root)
```

---

## 📖 Documentation Guide

### For Quick Start
**Read:** `QUICKSTART.md` (5 min read)
- Commands to get running
- Feature overview
- Basic troubleshooting

### For Installation
**Read:** `INSTALL.md` (10 min read)
- Step-by-step setup
- Configuration details
- Verification checklist
- Performance notes

### For Scripts Details
**Read:** `SCRIPTS.md` (15 min read)
- What each script does
- Common patterns
- Script parameters
- Advanced usage

### For Full Documentation
**Read:** `README.md` (20 min read)
- Complete architecture
- API endpoints reference
- Data schema
- Technology stack
- Deployment guide

---

## 🚀 Getting Started (3 Ways)

### Way 1: Automated (30 seconds to start)
```bash
cd application
./install.sh
./start.sh
```

### Way 2: Interactive
```bash
cd application
./setup-wizard.sh
# Follow menu
```

### Way 3: Manual
```bash
cd application/backend && ./setup.sh && ./start.sh
cd application/frontend && ./setup.sh && ./start.sh  # new terminal
```

---

## 🔍 Script Quick Reference

| Command | What | Where | Time |
|---------|------|-------|------|
| `./install.sh` | Install all deps | app root | 1-2 min |
| `./start.sh` | Start both servers | app root | 30s first* |
| `./setup-wizard.sh` | Interactive menu | app root | varies |
| `./setup.sh` | Setup backend | backend/ | 45s |
| `./start.sh` | Start backend | backend/ | 30s first* |
| `./setup.sh` | Setup frontend | frontend/ | 1 min |
| `./start.sh` | Start frontend | frontend/ | instant |

*First run loads CSV data, subsequent runs are 5 seconds

---

## 📊 Quick Stats

| Item | Value |
|------|-------|
| **Data Records** | 7.2 Million flights |
| **Data Year** | 2013 |
| **Backend Port** | 8000 |
| **Frontend Port** | 8001 |
| **First Startup** | ~30 seconds |
| **Subsequent Startup** | ~5 seconds |
| **Backend Size** | ~200 MB (node_modules) |
| **Frontend Size** | ~800 MB (node_modules) |
| **Total Install** | ~1 GB |

---

## 🎯 Feature Overview

### 1. Flight Search
- Filter by origin/destination
- Filter by carrier
- Filter by delay range
- Paginated results

### 2. Analytics Dashboard
- Delays by airline (bar chart)
- Delays by day of week (line chart)
- Delays by month (line chart)
- Key metrics cards

### 3. Route Visualization
- Interactive Leaflet map
- Routes colored by delay severity
- Hover tooltips
- Top routes list

---

## 📡 API Endpoints

**All endpoints are prefixed with `/api`**

### Flights
```
GET /flights              - List flights (paginated)
GET /flights/search       - Search with filters
GET /flights/airports     - Available airports
GET /flights/carriers     - Available carriers
```

### Analytics
```
GET /analytics/delays     - Delay statistics
GET /analytics/routes     - Route analytics
GET /analytics/airports   - Airport locations
```

### Health
```
GET /health              - Server status
```

See `README.md` for full API reference

---

## 🛠️ Technology Stack

### Backend
- Express.js (REST API)
- TypeScript (Type safety)
- csv-parser (Data loading)
- Node.js 18+

### Frontend
- React 18 (UI framework)
- Vite (Build tool)
- TypeScript (Type safety)
- Tailwind CSS (Styling)
- Framer Motion (Animations)
- Recharts (Charts)
- Leaflet (Maps)
- Axios (HTTP client)

---

## 📝 Configuration

### Backend (.env)
```env
PORT=8000
NODE_ENV=development
CORS_ORIGIN=http://localhost:8001
CSV_PATH=../../data/flights.csv
```

Auto-created by `install.sh`

### Frontend
No configuration needed (Vite proxy configured automatically)

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Scripts are executable
  ```bash
  ls -l *.sh backend/*.sh frontend/*.sh | grep rwx
  ```

- [ ] Dependencies installed
  ```bash
  ls -d backend/node_modules frontend/node_modules
  ```

- [ ] Backend builds
  ```bash
  cd backend && npm run build
  ```

- [ ] Frontend builds
  ```bash
  cd frontend && npm run build
  ```

- [ ] Health endpoint works
  ```bash
  curl http://localhost:8000/health
  ```

---

## 🐛 Common Issues & Solutions

### "Port already in use"
```bash
lsof -i :8000  # Check port
kill -9 <PID>  # Kill process
```

### "Dependencies not found"
```bash
./install.sh   # Run installer
```

### "CSV file not found"
```bash
ls ../data/flights.csv  # Check location
```

### "Scripts won't run"
```bash
chmod +x *.sh backend/*.sh frontend/*.sh
```

---

## 🚢 Deployment

### Build for Production
```bash
# Install and build
./install.sh

# Backend
cd backend && npm start

# Frontend
cd frontend && npm run build
# Serve dist/ with static server
```

### Docker (Future)
Dockerfiles can be added for containerized deployment

---

## 📚 File Reference

### Configuration Files
- `backend/package.json` - Backend dependencies
- `backend/tsconfig.json` - TypeScript config
- `backend/.env` - Runtime configuration
- `frontend/package.json` - Frontend dependencies
- `frontend/tsconfig.json` - TypeScript config
- `frontend/vite.config.ts` - Build configuration
- `frontend/tailwind.config.js` - CSS framework config

### Source Files
- `backend/src/index.ts` - Server entry point
- `backend/src/types.ts` - TypeScript definitions
- `backend/src/routes/*.ts` - API endpoints
- `backend/src/services/*.ts` - Business logic
- `frontend/src/App.tsx` - Root component
- `frontend/src/pages/*.tsx` - Page components
- `frontend/src/components/*.tsx` - UI components
- `frontend/src/lib/api.ts` - API client

### Documentation Files
- `README.md` - Full documentation
- `QUICKSTART.md` - Quick reference
- `INSTALL.md` - Installation guide
- `SCRIPTS.md` - Scripts documentation
- `INDEX.md` - This file

---

## 🎓 Learning Path

### Beginner
1. Read: `QUICKSTART.md`
2. Run: `./install.sh`
3. Run: `./start.sh`
4. Use the app

### Intermediate
1. Read: `INSTALL.md`
2. Read: `SCRIPTS.md`
3. Understand each script
4. Run manually for control

### Advanced
1. Read: `README.md` (full docs)
2. Explore: `backend/src/` code
3. Explore: `frontend/src/` code
4. Modify for your needs

---

## 🤝 Contributing

To extend the application:

1. Read: `README.md` architecture section
2. Understand: File structure above
3. Follow: Existing code patterns
4. Test: With `npm run dev`

### Common Extensions
- Add new API endpoint: `backend/src/routes/*.ts`
- Add new page: `frontend/src/pages/*.tsx`
- Add new component: `frontend/src/components/*.tsx`
- Modify styles: `frontend/src/index.css`

---

## 📞 Support

### Self-Help
1. Check: Logs in terminal
2. Read: Troubleshooting sections
3. Verify: Ports available
4. Test: Health endpoint

### Documentation
- See: `INSTALL.md` troubleshooting
- See: `SCRIPTS.md` advanced usage
- See: `README.md` full reference

---

## 📋 Checklist for New User

- [ ] Read `QUICKSTART.md`
- [ ] Run `./install.sh`
- [ ] Run `./start.sh`
- [ ] Open `http://localhost:8001`
- [ ] Explore the application
- [ ] Read `README.md` for details
- [ ] Try API endpoints
- [ ] Read `SCRIPTS.md` for automation

---

## 🎯 Next Steps

1. **NOW:** Read `QUICKSTART.md` (5 min)
2. **THEN:** Run `./install.sh` (1-2 min)
3. **THEN:** Run `./start.sh` (30 sec)
4. **FINALLY:** Enjoy the app! 🎉

---

**Status:** ✅ Complete & Ready to Use
**Version:** 1.0
**Date:** June 2026
**Maintainers:** Development Team

For questions, see the documentation or check the scripts themselves!
