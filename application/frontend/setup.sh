#!/bin/bash

# Flight Delay Frontend - Install and Setup
# Quick setup script for frontend only

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "=========================================="
echo "📦 Frontend - Install & Setup"
echo "=========================================="
echo ""

echo -e "${BLUE}Installing dependencies...${NC}"
cd "$SCRIPT_DIR"
npm install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

echo -e "${BLUE}Building production bundle...${NC}"
npm run build
echo -e "${GREEN}✓ Frontend built${NC}"

echo ""
echo -e "${GREEN}✅ Frontend setup complete!${NC}"
echo ""
echo "Start dev server with: npm run dev"
echo "Preview production build with: npm run preview"
echo ""
