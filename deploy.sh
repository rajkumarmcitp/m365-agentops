#!/bin/bash
set -e

echo "Installing dependencies..."
cd /home/site/wwwroot
npm install --production 2>&1

echo "Dependencies installed!"
echo "Starting server..."
node server.js
