#!/bin/bash

# Flight Delay Application - Complete Setup Wizard
# Interactive setup guide for the application

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

show_banner() {
  echo -e "${BLUE}"
  echo "╔════════════════════════════════════════════════════════╗"
  echo "║   Flight Delay Analysis - Setup Wizard                 ║"
  echo "║                                                        ║"
  echo "║   Analyzing 7.2M flight records from 2013             ║"
  echo "╚════════════════════════════════════════════════════════╝"
  echo -e "${NC}"
  echo ""
}

show_banner

echo "This wizard will help you set up the Flight Delay Application."
echo ""
echo -e "${YELLOW}Available setup options:${NC}"
echo ""
echo "  1) Full Setup (install + build + start both servers)"
echo "  2) Install Dependencies Only"
echo "  3) Build Both Applications"
echo "  4) Start Both Servers"
echo "  5) Backend Only Setup"
echo "  6) Frontend Only Setup"
echo "  7) View Instructions"
echo "  8) Exit"
echo ""
read -p "Select option (1-8): " option

case $option in
  1)
    echo ""
    echo -e "${BLUE}Running Full Setup...${NC}"
    echo ""
    "$SCRIPT_DIR/install.sh"
    sleep 2
    echo ""
    read -p "Start servers now? (y/n): " start_now
    if [ "$start_now" = "y" ] || [ "$start_now" = "Y" ]; then
      "$SCRIPT_DIR/start.sh"
    fi
    ;;
  2)
    echo ""
    echo -e "${BLUE}Installing Dependencies...${NC}"
    "$SCRIPT_DIR/install.sh"
    ;;
  3)
    echo ""
    echo -e "${BLUE}Building Applications...${NC}"
    echo ""
    echo -e "${BLUE}Building Backend...${NC}"
    cd "$SCRIPT_DIR/backend" && npm run build
    echo -e "${GREEN}✓ Backend built${NC}"
    echo ""
    echo -e "${BLUE}Building Frontend...${NC}"
    cd "$SCRIPT_DIR/frontend" && npm run build
    echo -e "${GREEN}✓ Frontend built${NC}"
    ;;
  4)
    echo ""
    echo -e "${BLUE}Starting Servers...${NC}"
    "$SCRIPT_DIR/start.sh"
    ;;
  5)
    echo ""
    echo -e "${BLUE}Backend Setup...${NC}"
    cd "$SCRIPT_DIR/backend"
    ./setup.sh
    echo ""
    read -p "Start backend now? (y/n): " start_backend
    if [ "$start_backend" = "y" ] || [ "$start_backend" = "Y" ]; then
      ./start.sh
    fi
    ;;
  6)
    echo ""
    echo -e "${BLUE}Frontend Setup...${NC}"
    cd "$SCRIPT_DIR/frontend"
    ./setup.sh
    echo ""
    read -p "Start frontend now? (y/n): " start_frontend
    if [ "$start_frontend" = "y" ] || [ "$start_frontend" = "Y" ]; then
      ./start.sh
    fi
    ;;
  7)
    cat << 'INSTRUCTIONS'

📖 QUICK START INSTRUCTIONS

Option A: Automated Setup (Recommended)
────────────────────────────────────
1. From application/ directory, run:
   $ ./install.sh
   
2. Then start servers:
   $ ./start.sh

3. Open: http://localhost:8001


Option B: Manual Setup (More Control)
──────────────────────────────────
Terminal 1 - Backend:
  $ cd backend
  $ ./setup.sh
  $ ./start.sh

Terminal 2 - Frontend:
  $ cd frontend
  $ ./setup.sh
  $ ./start.sh

Then open: http://localhost:8001


Option C: Step by Step
──────────────────────
# Install dependencies
$ ./install.sh

# In terminal 1: Start backend
$ cd backend && npm run dev

# In terminal 2: Start frontend
$ cd frontend && npm run dev

# Open browser
$ open http://localhost:8001


📊 What Gets Started
────────────────────
✓ Backend API on http://localhost:8000
✓ Frontend on http://localhost:8001
✓ Auto-reload on file changes (Vite HMR)
✓ ~30 second CSV data loading on first startup


📝 Configuration
────────────────
Backend config: backend/.env (auto-created)
Frontend config: Uses CORS proxy to backend


🚀 First Run
────────────
First startup loads 7.2M flight records into memory (~30s)
Subsequent startups are faster as data is indexed


📚 For More Info
────────────────
See: QUICKSTART.md or README.md

INSTRUCTIONS
    ;;
  8)
    echo -e "${GREEN}Goodbye!${NC}"
    exit 0
    ;;
  *)
    echo -e "${RED}Invalid option${NC}"
    exit 1
    ;;
esac
