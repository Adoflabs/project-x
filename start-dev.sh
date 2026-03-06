#!/bin/bash

# Employee Intelligence Platform - Development Startup Script

echo "🚀 Starting Employee Intelligence Platform..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js $(node --version) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}⚠️  npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} npm $(npm --version) detected"
echo ""

# Backend setup
echo -e "${BLUE}📦 Setting up Backend...${NC}"
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo -e "${GREEN}✓${NC} Backend dependencies already installed"
fi

if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit backend/.env with your database credentials${NC}"
    echo ""
fi

echo -e "${GREEN}✓${NC} Backend setup complete"
echo ""

# Frontend setup
echo -e "${BLUE}📦 Setting up Frontend...${NC}"
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo -e "${GREEN}✓${NC} Frontend dependencies already installed"
fi

if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file from .env.example..."
    cp .env.example .env.local
    echo -e "${GREEN}✓${NC} Frontend .env.local created"
fi

echo -e "${GREEN}✓${NC} Frontend setup complete"
echo ""

# Instructions
echo -e "${BLUE}📋 Next Steps:${NC}"
echo ""
echo "1. Configure your database:"
echo "   - Edit backend/.env with your PostgreSQL connection string"
echo "   - Run: cd backend && npx prisma migrate dev"
echo ""
echo "2. Start the backend:"
echo "   - cd backend"
echo "   - npm run dev"
echo "   - Backend will run on http://localhost:4000"
echo ""
echo "3. Start the frontend (in a new terminal):"
echo "   - cd frontend"
echo "   - npm run dev"
echo "   - Frontend will run on http://localhost:3000"
echo ""
echo -e "${GREEN}✨ Setup complete! Follow the steps above to start development.${NC}"
