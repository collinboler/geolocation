#!/bin/bash

# Complete Local StreetCLIP Geolocation Setup Script
# This replaces Firebase with a local StreetCLIP service

set -e  # Exit on any error

echo "🌍 Setting up Local StreetCLIP Geolocation Service..."
echo "================================================="

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    echo "Please install Python 3.7+ and try again."
    exit 1
fi

# Check Python version
python_version=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
echo "🐍 Python version: $python_version"

# Navigate to the StreetCLIP service directory
cd backend/streetclip-service

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
else
    echo "📦 Virtual environment already exists"
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install/upgrade dependencies
echo "📋 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Download StreetCLIP model (this may take a while on first run)
echo "🤖 Preparing StreetCLIP model..."
echo "⏳ This may take several minutes on the first run..."
python3 -c "
import sys
sys.path.append('.')
try:
    from transformers import CLIPModel, CLIPProcessor
    print('📥 Downloading StreetCLIP model...')
    model = CLIPModel.from_pretrained('geolocal/StreetCLIP')
    processor = CLIPProcessor.from_pretrained('geolocal/StreetCLIP')
    print('✅ StreetCLIP model downloaded and ready!')
    print('📊 Model info:')
    print(f'   - Vision encoder: {model.config.vision_config.model_type}')
    print(f'   - Text encoder: {model.config.text_config.model_type}')
    print(f'   - Hidden size: {model.config.projection_dim}')
except Exception as e:
    print(f'❌ Error downloading model: {e}')
    print('Please check your internet connection and try again.')
    sys.exit(1)
"

# Test the service
echo "🧪 Testing StreetCLIP service..."
python3 -c "
import sys
import torch
from transformers import CLIPModel, CLIPProcessor
from PIL import Image
import numpy as np

try:
    # Load model
    model = CLIPModel.from_pretrained('geolocal/StreetCLIP')
    processor = CLIPProcessor.from_pretrained('geolocal/StreetCLIP')
    
    # Test with a dummy image
    dummy_image = Image.new('RGB', (224, 224), color='blue')
    test_locations = ['New York', 'London', 'Tokyo']
    
    inputs = processor(text=test_locations, images=dummy_image, return_tensors='pt', padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits_per_image
        probs = logits.softmax(dim=1)
    
    print('✅ StreetCLIP service test successful!')
    print(f'   - Device: {\"GPU\" if torch.cuda.is_available() else \"CPU\"}')
    print(f'   - Test prediction: {test_locations[probs.argmax().item()]}')
    
except Exception as e:
    print(f'❌ Service test failed: {e}')
    sys.exit(1)
"

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the local geolocation service:"
echo "   cd backend/streetclip-service"
echo "   ./start.sh"
echo ""
echo "📝 The service will run on: http://localhost:8080"
echo "🔍 Health check: http://localhost:8080/health"
echo ""
echo "🔧 Chrome Extension Configuration:"
echo "   1. Load the extension in Chrome Developer Mode"
echo "   2. Point to the 'extension/' directory"
echo "   3. The extension is already configured to use localhost:8080"
echo ""
echo "💡 Note: Make sure to start the StreetCLIP service before using the extension!"
echo ""
echo "🆓 Benefits of local setup:"
echo "   ✓ No API costs"
echo "   ✓ No internet required for predictions"
echo "   ✓ Full privacy - images never leave your machine"
echo "   ✓ Fast predictions (especially with GPU)"
echo ""
