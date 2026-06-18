#!/bin/bash

# Flight Delay Backend - Start Development Server
# Starts the Express.js server with TypeScript on-the-fly compilation

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "=========================================="
echo "🚀 Backend Server - Start Development"
echo "=========================================="
echo ""

# Check if node_modules exists
if [ ! -d "$SCRIPT_DIR/node_modules" ]; then
  echo -e "${YELLOW}Dependencies not installed${NC}"
  echo "Run: ./setup.sh"
  exit 1
fi

# Check if .env exists
if [ ! -f "$SCRIPT_DIR/.env" ]; then
  echo -e "${YELLOW}Creating .env file...${NC}"
  cp "$SCRIPT_DIR/.env.example" "$SCRIPT_DIR/.env"
fi

# Check if port is available
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo -e "${YELLOW}⚠️  Port 8000 is already in use${NC}"
  echo "Kill the process: lsof -ti:8000 | xargs kill -9"
  exit 1
fi

echo -e "${BLUE}Starting server on port 8000...${NC}"
echo ""
echo -e "${GREEN}Server is running at: http://localhost:8000${NC}"
echo "Health check: http://localhost:8000/health"
echo ""
echo "Press Ctrl+C to stop"
echo ""

cd "$SCRIPT_DIR"
npm run dev
