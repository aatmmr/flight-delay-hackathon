#!/bin/bash

# Flight Delay Application - Development Start Script
# Starts both backend and frontend servers for development
# Requires two terminal windows or background execution

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if backend and frontend are installed
check_dependencies() {
  if [ ! -d "$SCRIPT_DIR/backend/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Backend dependencies not installed${NC}"
    echo "Run: ./install.sh"
    exit 1
  fi
  
  if [ ! -d "$SCRIPT_DIR/frontend/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Frontend dependencies not installed${NC}"
    echo "Run: ./install.sh"
    exit 1
  fi
}

# Check if ports are available
check_ports() {
  if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 8000 is already in use (backend)${NC}"
    echo "Kill the process or use a different port"
    exit 1
  fi
  
  if lsof -Pi :8001 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 8001 is already in use (frontend)${NC}"
    echo "Kill the process or use a different port"
    exit 1
  fi
}

echo "=========================================="
echo "🚀 Flight Delay Application - Start Dev"
echo "=========================================="
echo ""

check_dependencies

echo -e "${BLUE}Checking ports...${NC}"
check_ports || true
echo -e "${GREEN}✓ Ports available${NC}"
echo ""

# Function to handle cleanup
cleanup() {
  echo ""
  echo -e "${YELLOW}Shutting down servers...${NC}"
  kill $BACKEND_PID 2>/dev/null || true
  kill $FRONTEND_PID 2>/dev/null || true
  exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend
echo -e "${BLUE}🚀 Starting Backend Server (port 8000)...${NC}"
cd "$SCRIPT_DIR/backend"
npm run dev &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend PID: $BACKEND_PID${NC}"

# Wait a bit for backend to start
sleep 3

# Start frontend
echo -e "${BLUE}🚀 Starting Frontend Server (port 8001)...${NC}"
cd "$SCRIPT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend PID: $FRONTEND_PID${NC}"

echo ""
echo -e "${GREEN}=========================================="
echo "✅ Both servers started!"
echo "==========================================${NC}"
echo ""
echo "📱 Frontend: ${BLUE}http://localhost:8001${NC}"
echo "🔌 Backend:  ${BLUE}http://localhost:8000${NC}"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
