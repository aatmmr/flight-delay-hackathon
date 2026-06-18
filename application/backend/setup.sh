#!/bin/bash

# Flight Delay Backend - Install and Setup
# Quick setup script for backend only

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "=========================================="
echo "📦 Backend - Install & Setup"
echo "=========================================="
echo ""

echo -e "${BLUE}Installing dependencies...${NC}"
cd "$SCRIPT_DIR"
npm install
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

echo -e "${BLUE}Building TypeScript...${NC}"
npm run build
echo -e "${GREEN}✓ Backend built${NC}"

if [ ! -f "$SCRIPT_DIR/.env" ]; then
  echo -e "${BLUE}Creating .env file...${NC}"
  cp "$SCRIPT_DIR/.env.example" "$SCRIPT_DIR/.env"
  echo -e "${GREEN}✓ .env created${NC}"
fi

echo ""
echo -e "${GREEN}✅ Backend setup complete!${NC}"
echo ""
echo "Start with: npm run dev"
echo ""
