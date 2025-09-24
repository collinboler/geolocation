#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GeoCLIP Flask Application

Flask web service for GeoCLIP-based image geolocation.
Provides direct GPS coordinate prediction using coordinate regression.

Endpoints:
- POST /processGeolocation: Main geolocation endpoint
- POST /geoclip/predict: GeoCLIP-specific prediction
- POST /geoclip/heatmap: Prediction with heatmap data  
- GET /geoclip/demo: Demo page
- GET /geoclip/status: Service status

Author: Assistant
Date: September 2025
"""

import os
import sys
import logging
import time
import base64
import io
from PIL import Image
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from geoclip_service import GeoCLIPPredictor

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Global predictor instance
geoclip_predictor = None

def initialize_predictor():
    """Initialize the GeoCLIP predictor"""
    global geoclip_predictor
    try:
        if geoclip_predictor is None:
            logger.info("Initializing GeoCLIP predictor...")
            geoclip_predictor = GeoCLIPPredictor()
            logger.info("GeoCLIP predictor initialized successfully")
        return True
    except Exception as e:
        logger.error(f"Failed to initialize GeoCLIP predictor: {e}")
        return False

def decode_base64_image(base64_string: str) -> Image.Image:
    """Decode base64 image string to PIL Image"""
    try:
        # Remove data URL prefix if present
        if base64_string.startswith('data:image'):
            base64_string = base64_string.split(',')[1]
        
        # Decode base64
        image_data = base64.b64decode(base64_string)
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        return image
    except Exception as e:
        logger.error(f"Error decoding base64 image: {e}")
        raise e

@app.route('/geoclip/status', methods=['GET'])
def status():
    """Check service status"""
    try:
        if geoclip_predictor is None:
            return jsonify({
                "status": "error",
                "message": "GeoCLIP predictor not initialized"
            }), 500
        
        return jsonify({
            "status": "ready",
            "model": "GeoCLIP",
            "method": "coordinate_regression",
            "device": geoclip_predictor.device,
            "message": "GeoCLIP service is running"
        })
    except Exception as e:
        return jsonify({
            "status": "error", 
            "message": str(e)
        }), 500

@app.route('/processGeolocation', methods=['POST'])
def process_geolocation():
    """Main geolocation endpoint (compatible with existing Chrome extension)"""
    try:
        if geoclip_predictor is None:
            return jsonify({
                "error": "GeoCLIP predictor not initialized"
            }), 500
        
        # Get image from request
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({
                "error": "No image data provided"
            }), 400
        
        image_data = data['image']
        image = decode_base64_image(image_data)
        
        # Make prediction
        result = geoclip_predictor.predict_coordinates(image, top_k=5)
        
        # Format response to match expected Chrome extension format
        response = {
            "result": {
                "coordinates": result["coordinates"],
                "location": result["location"],
                "confidence": result["confidence"],
                "processing_time": result["processing_time"],
                "model": result["model"],
                "method": result["method"],
                "cost": 0,
                "tokensUsed": 0,
                "rawResponse": f"GeoCLIP prediction: {result['predictions'][0]['location_description']}"
            }
        }
        
        logger.info(f"Processed geolocation request - {result['location']}")
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error in process_geolocation: {e}")
        return jsonify({
            "error": str(e)
        }), 500

@app.route('/geoclip/predict', methods=['POST'])
def geoclip_predict():
    """GeoCLIP-specific prediction endpoint"""
    try:
        if geoclip_predictor is None:
            return jsonify({
                "error": "GeoCLIP predictor not initialized"
            }), 500
        
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({
                "error": "No image data provided"
            }), 400
        
        image_data = data['image']
        top_k = data.get('top_k', 5)
        
        image = decode_base64_image(image_data)
        result = geoclip_predictor.predict_coordinates(image, top_k)
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in geoclip_predict: {e}")
        return jsonify({
            "error": str(e)
        }), 500

@app.route('/geoclip/heatmap', methods=['POST'])
def geoclip_heatmap():
    """GeoCLIP prediction with heatmap data"""
    try:
        if geoclip_predictor is None:
            return jsonify({
                "error": "GeoCLIP predictor not initialized"
            }), 500
        
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({
                "error": "No image data provided"
            }), 400
        
        image_data = data['image']
        top_k = data.get('top_k', 10)
        
        image = decode_base64_image(image_data)
        result = geoclip_predictor.predict_with_heatmap_data(image, top_k)
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in geoclip_heatmap: {e}")
        return jsonify({
            "error": str(e)
        }), 500

@app.route('/geoclip/demo', methods=['GET'])
def demo_page():
    """Demo page for GeoCLIP service"""
    html_template = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>GeoCLIP Geolocation Demo</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .upload-area { border: 2px dashed #ccc; padding: 40px; text-align: center; margin: 20px 0; }
            .result { margin-top: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
            .coordinates { font-family: monospace; background: #f5f5f5; padding: 10px; margin: 10px 0; }
            .prediction { margin: 5px 0; padding: 5px; background: #f9f9f9; }
            button { background: #007cba; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
            button:hover { background: #005a87; }
            .confidence { color: #666; font-size: 0.9em; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🌍 GeoCLIP Geolocation Demo</h1>
            <p>Upload an image to predict its GPS coordinates using GeoCLIP</p>
        </div>
        
        <div class="upload-area" onclick="document.getElementById('fileInput').click()">
            <p>Click here to select an image file</p>
            <input type="file" id="fileInput" accept="image/*" style="display: none;">
        </div>
        
        <div id="imagePreview" style="display: none; text-align: center; margin: 20px 0;">
            <img id="previewImage" style="max-width: 400px; max-height: 300px;">
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
            <button onclick="predictLocation()" id="predictBtn" disabled>Predict Location</button>
        </div>
        
        <div id="results" style="display: none;"></div>
        
        <script>
            let selectedImage = null;
            
            document.getElementById('fileInput').addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        selectedImage = e.target.result;
                        document.getElementById('previewImage').src = selectedImage;
                        document.getElementById('imagePreview').style.display = 'block';
                        document.getElementById('predictBtn').disabled = false;
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            async function predictLocation() {
                if (!selectedImage) return;
                
                document.getElementById('predictBtn').disabled = true;
                document.getElementById('predictBtn').textContent = 'Predicting...';
                
                try {
                    const response = await fetch('/geoclip/predict', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            image: selectedImage.split(',')[1],
                            top_k: 5
                        })
                    });
                    
                    const result = await response.json();
                    displayResults(result);
                } catch (error) {
                    document.getElementById('results').innerHTML = 
                        '<div class="result"><p style="color: red;">Error: ' + error.message + '</p></div>';
                }
                
                document.getElementById('predictBtn').disabled = false;
                document.getElementById('predictBtn').textContent = 'Predict Location';
                document.getElementById('results').style.display = 'block';
            }
            
            function displayResults(result) {
                const top = result.predictions[0];
                const lat = top.coordinates.lat;
                const lng = top.coordinates.lng;
                
                let html = '<div class="result">';
                html += '<h3>🎯 GeoCLIP Prediction Results</h3>';
                html += '<div class="coordinates">';
                html += '<strong>Top Prediction:</strong><br>';
                html += `Latitude: ${lat.toFixed(6)}°<br>`;
                html += `Longitude: ${lng.toFixed(6)}°<br>`;
                html += `Confidence: ${(top.confidence * 100).toFixed(2)}%`;
                html += '</div>';
                
                html += '<p><strong>🕐 Processing Time:</strong> ' + result.processing_time.toFixed(2) + 's</p>';
                html += '<p><strong>🔬 Model:</strong> ' + result.model + ' (' + result.method + ')</p>';
                
                html += '<div style="margin-top: 15px;"><strong>📍 All Predictions:</strong></div>';
                result.predictions.forEach(pred => {
                    html += '<div class="prediction">';
                    html += `${pred.rank}. (${pred.coordinates.lat.toFixed(6)}, ${pred.coordinates.lng.toFixed(6)}) `;
                    html += `<span class="confidence">${(pred.confidence * 100).toFixed(2)}%</span>`;
                    html += '</div>';
                });
                
                html += '<div style="margin-top: 15px;">';
                html += `<a href="https://www.google.com/maps/@${lat},${lng},10z" target="_blank">`;
                html += '🗺️ View on Google Maps</a>';
                html += '</div>';
                
                html += '</div>';
                
                document.getElementById('results').innerHTML = html;
            }
        </script>
    </body>
    </html>
    """
    return render_template_string(html_template)

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "error": "Endpoint not found",
        "available_endpoints": [
            "POST /processGeolocation",
            "POST /geoclip/predict", 
            "POST /geoclip/heatmap",
            "GET /geoclip/demo",
            "GET /geoclip/status"
        ]
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "error": "Internal server error",
        "message": str(error)
    }), 500

if __name__ == '__main__':
    print("🌍 Starting GeoCLIP Geolocation Service...")
    
    # Initialize the predictor
    if not initialize_predictor():
        print("❌ Failed to initialize GeoCLIP predictor")
        sys.exit(1)
    
    print("✅ GeoCLIP predictor initialized successfully!")
    print("🚀 Starting Flask server on http://localhost:8083")
    print("📍 Endpoints:")
    print("   - POST /processGeolocation (Chrome extension compatible)")
    print("   - POST /geoclip/predict (GeoCLIP specific)")
    print("   - POST /geoclip/heatmap (with visualization data)")
    print("   - GET /geoclip/demo (demo page)")
    print("   - GET /geoclip/status (service status)")
    
    try:
        app.run(host='0.0.0.0', port=8083, debug=False)
    except KeyboardInterrupt:
        print("\n👋 GeoCLIP service stopped")
    except Exception as e:
        print(f"❌ Server error: {e}")
        sys.exit(1)
