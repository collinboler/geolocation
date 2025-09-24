#!/bin/bash

echo "🌍 Starting GeoCLIP Geolocation Service..."
echo "================================================"

# Activate virtual environment
source venv/bin/activate

# Install GeoCLIP if not already installed
echo "📦 Checking GeoCLIP installation..."
pip install geoclip

echo "🚀 Starting GeoCLIP Flask app on port 8083..."
python3 geoclip_app.py
