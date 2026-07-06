#!/bin/bash

# M365 AgentOps Deployment Script for Azure App Service
# Installs dependencies for the Node.js backend

echo "🚀 Deploying M365 AgentOps Backend..."

# Change to backend directory
cd backend || { echo "❌ Backend directory not found"; exit 1; }

echo "📦 Installing backend dependencies..."
npm ci --only=production || { echo "❌ npm install failed"; exit 1; }

echo "✅ Backend dependencies installed"
echo "✅ Deployment ready - startup command will run: node backend/server.js"
exit 0
