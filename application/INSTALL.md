# Flight Delay Application - Installation & Startup Guide

## ⚠️ IMPORTANT: Both Services Required

This application requires **both backend and frontend** running simultaneously:
- **Backend** (Express.js) on port 8000 - flight data API
- **Frontend** (React) on port 8001 - web UI

If only frontend is running, you'll see: `ECONNREFUSED` errors

---

## 🎯 Quick Start (3 steps)

```bash
cd application
./install.sh    # Install dependencies (1-2 min)
./start.sh      # Start BOTH servers (5-10 sec)
```

Then open: **http://localhost:8001**

---

## 📦 Installation Scripts

### Full Installation (One Command)

```bash
./install.sh
```

This installs everything needed:
- Backend npm dependencies
- Frontend npm dependencies
- Creates backend configuration file
- Ready to run

**Time required:** 1-2 minutes
**What you need:** Node.js 18+, npm 9+

---

## 🚀 Startup Scripts

### Start Both Servers

```bash
./start.sh
```

Starts:
- Backend API on **http://localhost:8000**
- Frontend on **http://localhost:8001**
- Shows status dashboard

**Requirements:**
- Run `./install.sh` first
- Ports 8000 and 8001 available

---

### Start Backend Only

```bash
cd backend
./start.sh
```

Starts Express.js server on **http://localhost:8000**

---

### Start Frontend Only

```bash
cd frontend
./start.sh
```

Starts Vite dev server on **http://localhost:8001**

Note: Backend must be running on port 8000

---

## 🔧 Manual Steps (If Preferred)

### Backend Setup

```bash
cd application/backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd application/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🧙 Interactive Setup

For guided setup with menu:

```bash
./setup-wizard.sh
```

Menu options:
1. Full Setup (install + build + start)
2. Install Only
3. Build Only
4. Start Servers
5. Backend Setup
6. Frontend Setup
7. View Help
8. Exit

---

## ✅ Verification Checklist

After running scripts:

- [ ] No errors in terminal
- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:8001
- [ ] Health check passes: curl http://localhost:8000/health
- [ ] Browser shows app at http://localhost:8001

---

## 🐛 Troubleshooting

### "Port already in use"

```bash
# Find what's using port 8000
lsof -i :8000

# Kill it
kill -9 <PID>
```

### "Dependencies not found"

```bash
# Delete and reinstall
rm -rf backend/node_modules frontend/node_modules
npm cache clean --force
./install.sh
```

### "CSV file not found"

Make sure `data/flights.csv` exists in the repository root:
```bash
ls -lh ../data/flights.csv
```

### Scripts won't run

```bash
# Make executable
chmod +x *.sh backend/*.sh frontend/*.sh
```

---

## 📊 What Gets Installed

### Backend (6 packages)
- express, cors, csv-parser, dotenv, typescript, ts-node

### Frontend (10 packages)
- react, react-dom, vite, typescript, tailwindcss
- framer-motion, recharts, leaflet, axios

### Total Size
- Backend: ~200 MB (node_modules)
- Frontend: ~800 MB (node_modules)
- Total: ~1 GB

---

## 🚢 Production Build

To build for production:

```bash
# Build both
./install.sh

# Run production
cd backend && npm start
cd frontend && npm run build && # serve dist/
```

---

## 📝 Configuration

### Backend (.env)
```env
PORT=8000
NODE_ENV=development
CORS_ORIGIN=http://localhost:8001
CSV_PATH=../../data/flights.csv
```

Auto-created by install script. Edit if needed.

### Frontend
No configuration needed. Vite proxy configured in vite.config.ts

---

## 🎓 After Installation

1. **Explore the App**
   - Search flights by origin/destination/carrier
   - View analytics dashboard with charts
   - Check interactive route map

2. **Read Documentation**
   - `QUICKSTART.md` - Quick reference
   - `README.md` - Full documentation
   - `SCRIPTS.md` - Script reference

3. **API Testing**
   - Try health check: `curl http://localhost:8000/health`
   - Browse API docs in README.md

4. **Development**
   - Edit files in `backend/src/` or `frontend/src/`
   - Changes auto-reload (Vite HMR)
   - Backend has ts-node for on-the-fly compilation

---

## 📞 Support

### Check the Logs

**Backend logs:**
- Shows request logs with timestamps
- Shows data loading progress
- Shows errors with details

**Frontend logs:**
- Browser console (F12)
- Network tab shows API calls
- Shows React errors

### Common Commands

```bash
# Check if servers running
lsof -i :8000    # Backend
lsof -i :8001    # Frontend

# Kill servers
kill -9 <PID>

# View installed versions
npm list

# Update packages
npm update

# Clean cache
npm cache clean --force
```

---

## ⚡ Performance Notes

### First Startup
- Takes 20-30 seconds
- Loads 7.2M flight records into memory
- Indexes data for fast lookup
- Subsequent startups are fast

### Typical Startup Time
- Backend: 30 seconds (first), 5 seconds (subsequent)
- Frontend: 5 seconds (Vite)
- Total: ~40 seconds (first), ~10 seconds (subsequent)

---

## 🎯 Success Indicators

✅ You're set up when:

```bash
# Backend running
$ curl http://localhost:8000/health
{"status":"ok"}

# Frontend running
$ open http://localhost:8001
# (Shows the Flight Delay Analysis app)

# Data loaded
$ curl http://localhost:8000/api/flights/carriers
# (Returns list of airline codes)
```

---

## 📚 Next Steps

1. ✅ Run `./install.sh`
2. ✅ Run `./start.sh`
3. ✅ Open http://localhost:8001
4. 📖 Read QUICKSTART.md for features
5. 🚀 Explore the application!

---

**Installation complete!** Happy exploring! ✈️
