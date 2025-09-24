#!/bin/bash

# Hierarchical StreetCLIP Service Startup Script

echo "🚀 Starting Hierarchical StreetCLIP Service..."

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    echo "📦 Activating virtual environment..."
    source venv/bin/activate
fi

# Check if required packages are installed
echo "🔍 Checking dependencies..."
python3 -c "import torch, transformers, PIL, flask" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "❌ Missing dependencies. Installing..."
    pip install torch torchvision transformers pillow flask flask-cors
fi

# Set environment variables
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
export FLASK_APP=hierarchical_app.py
export FLASK_ENV=production

# Check if StreetCLIP model needs to be downloaded
echo "🤖 Checking StreetCLIP model..."
python3 -c "
try:
    from transformers import CLIPModel
    model = CLIPModel.from_pretrained('geolocal/StreetCLIP')
    print('✅ StreetCLIP model ready')
except Exception as e:
    print(f'📥 Downloading StreetCLIP model: {e}')
"

echo "🌐 Starting Hierarchical StreetCLIP service on port 8082..."
echo "📍 Available endpoints:"
echo "   • POST /predict - Hierarchical prediction"
echo "   • POST /predict_flexible - Custom location choices"
echo "   • POST /predict_country - Country-only prediction"
echo "   • GET /demo - Interactive demo page"
echo "   • GET /locations - Supported locations"
echo ""
echo "🔗 Demo: http://localhost:8082/demo"
echo "❓ Health check: http://localhost:8082/health"
echo ""

# Start the service
python3 hierarchical_app.py



