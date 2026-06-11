#!/bin/bash

echo "🚀 Setting up Dehurdle Task Manager..."

# Backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

# Frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

# Copy .env
echo ""
if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo "✅ .env created from .env.example"
  echo "⚠️  Please update backend/.env with your actual values"
else
  echo "⚠️  backend/.env already exists, skipping..."
fi

# Seed flag (run from repo root so backend/.env is found)
if [ "$1" == "--seed" ]; then
  echo ""
  echo "🌱 Seeding database with sample tasks..."
  cd backend && node src/seed.js && cd ..
  echo "✅ Database seeded!"
  echo "   Login: seed@test.com / password123"
fi

echo ""
echo "✅ Setup complete! Run the app:"
echo "   Backend  → cd backend && npm run dev"
echo "   Frontend → cd frontend && npm run dev"