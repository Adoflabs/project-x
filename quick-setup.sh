#!/bin/bash

# Employee Intelligence Platform - Quick Setup Script

set -e  # Exit on error

echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                              ║"
echo "║              Employee Intelligence Platform - Quick Setup                    ║"
echo "║                                                                              ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Generate secrets
echo -e "${BLUE}Step 1: Generating secure secrets...${NC}"
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
ENCRYPTION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

echo -e "${GREEN}✓${NC} JWT_SECRET generated"
echo -e "${GREEN}✓${NC} ENCRYPTION_SECRET generated"
echo ""

# Step 2: Update .env file
echo -e "${BLUE}Step 2: Updating backend/.env with secrets...${NC}"
cd backend

# Update secrets in .env
sed -i.bak "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
sed -i.bak "s/ENCRYPTION_SECRET=.*/ENCRYPTION_SECRET=$ENCRYPTION_SECRET/" .env

echo -e "${GREEN}✓${NC} Secrets updated in backend/.env"
echo ""

# Step 3: Apply database migration
echo -e "${BLUE}Step 3: Applying database migration...${NC}"
npx prisma migrate deploy

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Database migration applied successfully"
else
    echo -e "${RED}✗${NC} Database migration failed"
    echo -e "${YELLOW}Please check your DATABASE_URL in backend/.env${NC}"
    exit 1
fi
echo ""

# Step 4: Generate Prisma Client
echo -e "${BLUE}Step 4: Generating Prisma Client...${NC}"
npx prisma generate
echo -e "${GREEN}✓${NC} Prisma Client generated"
echo ""

cd ..

# Step 5: Create frontend .env.local if it doesn't exist
echo -e "${BLUE}Step 5: Setting up frontend environment...${NC}"
if [ ! -f "frontend/.env.local" ]; then
    cp frontend/.env.example frontend/.env.local
    echo -e "${GREEN}✓${NC} Created frontend/.env.local"
else
    echo -e "${GREEN}✓${NC} frontend/.env.local already exists"
fi
echo ""

# Success message
echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                              ║"
echo "║                        ✅ Setup Complete! ✅                                  ║"
echo "║                                                                              ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo ""
echo "1. Start the backend (Terminal 1):"
echo -e "   ${BLUE}cd backend && npm run dev${NC}"
echo ""
echo "2. Start the frontend (Terminal 2):"
echo -e "   ${BLUE}cd frontend && npm run dev${NC}"
echo ""
echo "3. Open your browser:"
echo -e "   ${BLUE}http://localhost:3000${NC}"
echo ""
echo -e "${YELLOW}Note: Keep both terminals running while using the application${NC}"
echo ""
