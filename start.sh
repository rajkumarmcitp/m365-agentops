#!/bin/bash

# M365 AgentOps startup script for Azure App Service

echo "🚀 Starting M365 AgentOps Backend..."
echo ""

# Change to backend directory
cd /home/site/wwwroot/backend || {
  echo "❌ Backend directory not found, trying alternative path..."
  cd backend || {
    echo "❌ Cannot find backend directory"
    exit 1
  }
}

echo "📦 Installing dependencies..."
npm install --only=production || {
  echo "❌ npm install failed"
  exit 1
}

echo "✅ Dependencies installed"
echo ""
echo "🔧 Starting Node.js server..."
node server.js
