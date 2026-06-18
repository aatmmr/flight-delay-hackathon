#!/bin/bash

# Flight Delay Frontend - Start Development Server
# Starts the Vite dev server with hot module replacement

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "=========================================="
echo "🚀 Frontend Server - Start Development"
echo "=========================================="
echo ""

# Check if node_modules exists
if [ ! -d "$SCRIPT_DIR/node_modules" ]; then
  echo -e "${YELLOW}Dependencies not installed${NC}"
  echo "Run: ./setup.sh"
  exit 1
fi

# Check if port is available
if lsof -Pi :8001 -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo -e "${YELLOW}⚠️  Port 8001 is already in use${NC}"
  echo "Kill the process: lsof -ti:8001 | xargs kill -9"
  exit 1
fi

echo -e "${BLUE}Starting Vite dev server on port 8001...${NC}"
echo ""
echo -e "${GREEN}Frontend is running at: http://localhost:8001${NC}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Backend must also be running!${NC}"
echo "   Start backend in another terminal with:"
echo "   cd ../backend && npm run dev"
echo ""
echo "Backend runs on: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop"
echo ""

cd "$SCRIPT_DIR"
npm run dev
