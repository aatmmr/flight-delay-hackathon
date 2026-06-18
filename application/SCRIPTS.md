# Flight Delay Application - Scripts Reference

Complete documentation of all setup, installation, and startup scripts.

## 📋 Script Overview

| Script | Location | Purpose | Time |
|--------|----------|---------|------|
| `install.sh` | `application/` | Install all dependencies | 1-2 min |
| `start.sh` | `application/` | Start both servers | 30 sec* |
| `setup-wizard.sh` | `application/` | Interactive setup menu | 5 min |
| `setup.sh` | `backend/` | Install & build backend | 45 sec |
| `start.sh` | `backend/` | Start backend server | instant |
| `setup.sh` | `frontend/` | Install & build frontend | 1 min |
| `start.sh` | `frontend/` | Start frontend server | instant |

*First run takes 30 seconds to load CSV, subsequent runs take 5 seconds

---

## 🎯 Quick Decision Tree

**New user? Don't know where to start?**
```
├─ Run: ./setup-wizard.sh
└─ Follow the menu options
```

**Just want to run the app?**
```
├─ Run: ./install.sh
├─ Run: ./start.sh
└─ Open: http://localhost:8001
```

**Want to understand each step?**
```
├─ Read: INSTALL.md
├─ Read: QUICKSTART.md
└─ Follow the manual setup section
```

---

## 📦 Application Root Scripts

### `./install.sh`

**Purpose:** Install all dependencies for backend and frontend

**What it does:**
1. Installs backend npm packages
2. Installs frontend npm packages
3. Creates backend `.env` file from `.env.example`
4. Shows next steps

**When to use:**
- First time setup
- After cleaning node_modules
- To get everything installed at once

**Run:**
```bash
cd application
./install.sh
```

**Expected output:**
```
========================================
🚀 Flight Delay Application - Setup
========================================

📦 Installing Backend Dependencies...
✓ Backend dependencies installed

📦 Installing Frontend Dependencies...
✓ Frontend dependencies installed

📝 Creating backend .env file...
✓ Backend .env created (using defaults)

✅ Setup Complete!

Next steps:
1. Start the backend server:
   $ cd application/backend
   $ npm run dev

2. In a new terminal, start the frontend:
   $ cd application/frontend
   $ npm run dev

3. Open your browser to:
   http://localhost:8001
```

**Time:** 1-2 minutes first time

---

### `./start.sh`

**Purpose:** Start both backend and frontend servers together

**What it does:**
1. Checks if dependencies are installed
2. Checks if ports 8000 and 8001 are available
3. Starts backend server (port 8000)
4. Starts frontend server (port 8001)
5. Shows status dashboard
6. Waits for Ctrl+C to stop

**When to use:**
- After running `./install.sh`
- For local development
- To run both servers simultaneously

**Run:**
```bash
cd application
./start.sh
```

**Expected output:**
```
==========================================
🚀 Flight Delay Application - Start Dev
==========================================

Checking ports...
✓ Ports available

🚀 Starting Backend Server (port 8000)...
✓ Backend PID: 12345

🚀 Starting Frontend Server (port 8001)...
✓ Frontend PID: 12346

==========================================
✅ Both servers started!
==========================================

📱 Frontend: http://localhost:8001
🔌 Backend:  http://localhost:8000

Press Ctrl+C to stop both servers
```

**Time:** 30 seconds (first run), 5 seconds (subsequent)

---

### `./setup-wizard.sh`

**Purpose:** Interactive menu-driven setup system

**What it does:**
1. Shows a menu with 8 options
2. Guides through various setup steps
3. Can install, build, start, or view help
4. Customizable path for each user

**Options:**
1. Full Setup (install + build + start)
2. Install Dependencies Only
3. Build Both Applications
4. Start Both Servers
5. Backend Only Setup
6. Frontend Only Setup
7. View Instructions
8. Exit

**When to use:**
- First time setup (option 1)
- When you need guidance
- For specific tasks (pick the option)

**Run:**
```bash
cd application
./setup-wizard.sh
```

**Then select an option (1-8)**

**Time:** Varies by option (5 min - 2 min depending on selection)

---

## 🔧 Backend Scripts

### `backend/setup.sh`

**Purpose:** Install and configure the Express.js backend

**What it does:**
1. Changes to backend directory
2. Installs npm dependencies
3. Compiles TypeScript to JavaScript
4. Shows completion message

**When to use:**
- First time backend setup
- After deleting `backend/node_modules`
- To rebuild TypeScript

**Run:**
```bash
cd application/backend
./setup.sh
```

**Expected output:**
```
==========================================
📦 Backend - Install & Setup
==========================================

Installing dependencies...
✓ Backend dependencies installed

Building TypeScript...
✓ Backend built

Creating .env file...
✓ .env created

✅ Backend setup complete!

Start with: npm run dev
```

**Time:** 45 seconds

---

### `backend/start.sh`

**Purpose:** Start the Express.js development server

**What it does:**
1. Checks dependencies installed
2. Checks port 8000 available
3. Creates `.env` from `.env.example` if needed
4. Starts server with `npm run dev`
5. Shows server URL
6. Runs until Ctrl+C

**When to use:**
- Starting backend only
- For backend development
- When debugging backend issues

**Run:**
```bash
cd application/backend
./start.sh
```

**Expected output:**
```
==========================================
🚀 Backend Server - Start Development
==========================================

Starting server on port 8000...

✓ Server is running at: http://localhost:8000
Health check: http://localhost:8000/health

Press Ctrl+C to stop

[loaded message...]
✓ Loaded 7,200,000 flights
✓ Indexed 500 unique airports
✓ Indexed 5,000 unique routes
```

**Time:** Instant (30 sec first run to load data, 5 sec subsequent)

**Port:** 8000 (configurable in `.env`)

---

## 🎨 Frontend Scripts

### `frontend/setup.sh`

**Purpose:** Install and configure the React frontend

**What it does:**
1. Changes to frontend directory
2. Installs npm dependencies
3. Builds production bundle with Vite
4. Shows completion message

**When to use:**
- First time frontend setup
- After deleting `frontend/node_modules`
- To rebuild production bundle

**Run:**
```bash
cd application/frontend
./setup.sh
```

**Expected output:**
```
==========================================
📦 Frontend - Install & Setup
==========================================

Installing dependencies...
✓ Frontend dependencies installed

Building production bundle...
✓ Frontend built

✅ Frontend setup complete!

Start dev server with: npm run dev
Preview production build with: npm run preview
```

**Time:** 1 minute

---

### `frontend/start.sh`

**Purpose:** Start the Vite development server

**What it does:**
1. Checks dependencies installed
2. Checks port 8001 available
3. Starts Vite dev server with HMR
4. Shows server URL
5. Runs until Ctrl+C

**When to use:**
- Starting frontend only
- For frontend development
- With backend running separately

**Run:**
```bash
cd application/frontend
./start.sh
```

**Expected output:**
```
==========================================
🚀 Frontend Server - Start Development
==========================================

Starting Vite dev server on port 8001...

✓ Frontend is running at: http://localhost:8001

Backend must be running on http://localhost:8000

Press Ctrl+C to stop
```

**Time:** Instant startup

**Port:** 8001 (configurable in `vite.config.ts`)

---

## 🚀 Common Usage Patterns

### Pattern 1: Fastest Setup (5 minutes)

```bash
cd application
./install.sh
./start.sh
open http://localhost:8001
```

### Pattern 2: Separate Terminals (For Development)

**Terminal 1:**
```bash
cd application/backend
./start.sh
```

**Terminal 2:**
```bash
cd application/frontend
./start.sh
```

Then open: http://localhost:8001

### Pattern 3: Interactive Guided Setup

```bash
cd application
./setup-wizard.sh
# Select option 1 for full setup
# Select option 4 to start servers
```

### Pattern 4: Build and Test Production

```bash
cd application

# Build both
./install.sh

# Test production backend
cd backend && npm start &

# Serve frontend build
cd ../frontend && npm run preview
```

---

## 🔍 Script Details

### Dependencies Check

Scripts check for `node_modules` before running:
```bash
if [ ! -d "$SCRIPT_DIR/node_modules" ]; then
  # Dependencies not installed
  exit 1
fi
```

### Port Availability Check

Scripts check if ports are in use:
```bash
# Check port 8000
lsof -Pi :8000 -sTCP:LISTEN -t

# Check port 8001
lsof -Pi :8001 -sTCP:LISTEN -t
```

### Error Handling

All scripts use `set -e` for early exit on errors:
```bash
set -e  # Exit on first error
```

### Color Output

Scripts use ANSI color codes:
- `GREEN` - Success messages
- `BLUE` - Information
- `YELLOW` - Warnings
- `RED` - Errors (in wizard)

---

## ⚠️ Troubleshooting Scripts

### Script Won't Run

```bash
# Check if executable
ls -l install.sh

# Should show: -rwxr-xr-x

# If not, make executable
chmod +x install.sh
chmod +x backend/setup.sh backend/start.sh
chmod +x frontend/setup.sh frontend/start.sh
```

### Port Already in Use

```bash
# Find process using port
lsof -i :8000     # Backend
lsof -i :8001     # Frontend

# Kill it
kill -9 <PID>

# Then run script again
```

### Dependencies Won't Install

```bash
# Clean npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Run install script
./install.sh
```

### CSV File Not Found

Make sure data exists:
```bash
ls -lh ../data/flights.csv
```

Should be in repo root, not in `application/`

---

## 📊 Performance Characteristics

| Script | First Run | Repeat | Bottleneck |
|--------|-----------|--------|-----------|
| `install.sh` | 1-2 min | - | npm install |
| `backend/setup.sh` | 45 sec | - | npm install |
| `frontend/setup.sh` | 1 min | - | npm install |
| `start.sh` | 30 sec | 5 sec | CSV loading |
| `backend/start.sh` | 30 sec | 5 sec | CSV loading |
| `frontend/start.sh` | instant | instant | - |

---

## 🎯 Success Checklist

After running scripts, verify:

- [ ] All scripts are executable (`chmod +x`)
- [ ] `install.sh` completes without errors
- [ ] `start.sh` shows both servers running
- [ ] Backend accessible: `curl http://localhost:8000/health`
- [ ] Frontend accessible: http://localhost:8001
- [ ] No port conflicts
- [ ] CSV file loaded (check backend logs)

---

## 📚 See Also

- **INSTALL.md** - Step-by-step installation guide
- **QUICKSTART.md** - Quick reference
- **README.md** - Full documentation
- **package.json** - NPM scripts and dependencies

---

## 💡 Advanced Usage

### Custom Configuration

Edit `.env` before running:
```bash
# Backend configuration
PORT=8080  # Change port
NODE_ENV=production
CORS_ORIGIN=https://mysite.com
CSV_PATH=/path/to/custom/flights.csv
```

### Parallel Development

Run both servers in background:
```bash
# Install first
./install.sh

# Run both in background (macOS/Linux)
./start.sh &

# Or in screen/tmux
screen -S backend -d -m bash -c "cd backend && ./start.sh"
screen -S frontend -d -m bash -c "cd frontend && ./start.sh"
```

### Continuous Integration

For CI/CD pipelines:
```bash
# Install
./install.sh

# Build (skip starting)
cd backend && npm run build
cd ../frontend && npm run build

# Test if needed
cd ../backend && npm test
```

---

**Last Updated:** June 2026
**Version:** 1.0
**Status:** Production Ready ✅
