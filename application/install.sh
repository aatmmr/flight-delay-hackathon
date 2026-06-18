#!/bin/bash

# Flight Delay Application - Install Dependencies Script
# Installs npm packages for both backend and frontend

set -e

echo "=========================================="
echo "🚀 Flight Delay Application - Setup"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Install Backend
echo -e "${BLUE}📦 Installing Backend Dependencies...${NC}"
cd "$SCRIPT_DIR/backend"
npm install
echo -e "${GREEN}✓ Backend dependencies installed${NC}"
echo ""

# Install Frontend
echo -e "${BLUE}📦 Installing Frontend Dependencies...${NC}"
cd "$SCRIPT_DIR/frontend"
npm install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
echo ""

# Setup Backend .env if it doesn't exist
if [ ! -f "$SCRIPT_DIR/backend/.env" ]; then
  echo -e "${BLUE}📝 Creating backend .env file...${NC}"
  cp "$SCRIPT_DIR/backend/.env.example" "$SCRIPT_DIR/backend/.env"
  echo -e "${GREEN}✓ Backend .env created (using defaults)${NC}"
else
  echo -e "${GREEN}✓ Backend .env already exists${NC}"
fi

echo ""
echo -e "${GREEN}=========================================="
echo "✅ Setup Complete!"
echo "==========================================${NC}"
echo ""
echo "📖 Next steps:"
echo ""
echo "  1. Start the backend server:"
echo "     $ cd application/backend"
echo "     $ npm run dev"
echo ""
echo "  2. In a new terminal, start the frontend:"
echo "     $ cd application/frontend"
echo "     $ npm run dev"
echo ""
echo "  3. Open your browser to:"
echo "     http://localhost:8001"
echo ""
echo "📚 For more information, see application/README.md"
echo ""
