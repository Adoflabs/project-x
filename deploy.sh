#!/bin/bash

# Veridion Deployment Helper Script
# This script helps prepare the project for deployment

set -e

echo "🚀 Veridion Deployment Helper"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if we're in the project root
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

echo "📋 Pre-Deployment Checklist"
echo ""

# 1. Check if all feature branches are merged
echo "1. Checking Git status..."
if git diff-index --quiet HEAD --; then
    print_success "No uncommitted changes"
else
    print_warning "You have uncommitted changes. Commit them before deploying."
fi

# 2. Check backend dependencies
echo ""
echo "2. Checking backend dependencies..."
cd backend
if npm list > /dev/null 2>&1; then
    print_success "Backend dependencies OK"
else
    print_warning "Backend dependencies have issues. Run: cd backend && npm install"
fi
cd ..

# 3. Check frontend dependencies
echo ""
echo "3. Checking frontend dependencies..."
cd frontend
if npm list > /dev/null 2>&1; then
    print_success "Frontend dependencies OK"
else
    print_warning "Frontend dependencies have issues. Run: cd frontend && npm install"
fi
cd ..

# 4. Test backend build
echo ""
echo "4. Testing backend..."
cd backend
if node --check src/server.js > /dev/null 2>&1; then
    print_success "Backend syntax check passed"
else
    print_error "Backend has syntax errors"
    exit 1
fi
cd ..

# 5. Test frontend build
echo ""
echo "5. Testing frontend build..."
cd frontend
print_warning "Building frontend (this may take a minute)..."
if npm run build > /dev/null 2>&1; then
    print_success "Frontend build successful"
else
    print_error "Frontend build failed. Check errors above."
    exit 1
fi
cd ..

# 6. Check environment files
echo ""
echo "6. Checking environment configuration..."
if [ -f "backend/.env" ]; then
    print_success "Backend .env exists"
else
    print_warning "Backend .env not found. Copy from .env.example"
fi

if [ -f "frontend/.env.local" ]; then
    print_success "Frontend .env.local exists"
else
    print_warning "Frontend .env.local not found (optional for deployment)"
fi

# 7. Check deployment config files
echo ""
echo "7. Checking deployment configuration..."
if [ -f "backend/railway.json" ]; then
    print_success "Railway config exists"
else
    print_error "Railway config missing"
fi

if [ -f "frontend/vercel.json" ]; then
    print_success "Vercel config exists"
else
    print_error "Vercel config missing"
fi

# Summary
echo ""
echo "=============================="
echo "📊 Deployment Readiness Summary"
echo "=============================="
echo ""
print_success "Pre-deployment checks complete!"
echo ""
echo "Next steps:"
echo "1. Commit and push all changes to GitHub"
echo "2. Deploy backend to Railway (see DEPLOYMENT_GUIDE.md)"
echo "3. Deploy frontend to Vercel (see DEPLOYMENT_GUIDE.md)"
echo ""
echo "📖 Full guide: DEPLOYMENT_GUIDE.md"
echo ""

# Ask if user wants to commit deployment files
echo ""
read -p "Do you want to commit deployment configuration files? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git add backend/railway.json backend/.railwayignore backend/package.json
    git add frontend/vercel.json frontend/.vercelignore
    git add DEPLOYMENT_GUIDE.md deploy.sh
    git commit -m "chore: add deployment configuration for Railway and Vercel

- Add Railway configuration (railway.json, .railwayignore)
- Add Vercel configuration (vercel.json, .vercelignore)
- Update backend package.json with deployment scripts
- Add comprehensive deployment guide
- Add deployment helper script"
    print_success "Deployment files committed!"
    echo ""
    echo "Now push to GitHub:"
    echo "  git push origin main"
else
    print_warning "Skipped commit. Remember to commit before deploying!"
fi

echo ""
print_success "Ready to deploy! 🚀"
