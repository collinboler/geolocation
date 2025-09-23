#!/bin/bash

# StreetCLIP Geolocation Service Startup Script

echo "🚀 Starting StreetCLIP Geolocation Service..."

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check if virtual environment exists, create if not
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install/update dependencies
echo "📋 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Check if model files exist, download if not
echo "🤖 Checking StreetCLIP model..."
python3 -c "
from transformers import CLIPModel, CLIPProcessor
print('📥 Downloading StreetCLIP model (this may take a few minutes on first run)...')
model = CLIPModel.from_pretrained('geolocal/StreetCLIP')
processor = CLIPProcessor.from_pretrained('geolocal/StreetCLIP')
print('✅ StreetCLIP model ready!')
"

# Start the service
echo "🌍 Starting StreetCLIP service on port 8081..."
echo "📍 Service will be available at: http://localhost:8081"
echo "🔍 Health check: http://localhost:8081/health"
echo ""
echo "Press Ctrl+C to stop the service"
echo ""

export FLASK_ENV=production
python3 app.py
