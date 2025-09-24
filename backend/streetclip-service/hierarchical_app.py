#!/usr/bin/env python3
"""
Hierarchical StreetCLIP Flask Service
Uses the real power of StreetCLIP with hierarchical prediction and flexible location choices.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import io
import logging
import os
from PIL import Image
from hierarchical_streetclip import hierarchical_model

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

def decode_base64_image(base64_string: str) -> Image.Image:
    """Decode base64 image string to PIL Image"""
    try:
        # Remove data URL prefix if present
        if base64_string.startswith('data:image'):
            base64_string = base64_string.split(',', 1)[1]
        
        # Decode base64
        image_data = base64.b64decode(base64_string)
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
            
        return image
    except Exception as e:
        logger.error(f"Error decoding image: {e}")
        raise

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "model_loaded": hierarchical_model.model is not None,
        "device": hierarchical_model.device,
        "service": "Hierarchical StreetCLIP"
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Main prediction endpoint - hierarchical approach"""
    try:
        # Get request data
        request_data = request.json
        
        # Handle Firebase-style nested data format
        if 'data' in request_data:
            data = request_data['data']
        else:
            data = request_data
            
        if not data or 'imageData' not in data:
            return jsonify({"error": "Missing imageData in request"}), 400
        
        image_data = data['imageData']
        
        # Optional: Handle user ID for usage tracking
        user_id = data.get('extpayUserId', 'anonymous')
        logger.info(f"Processing hierarchical request for user: {user_id}")
        
        # Decode and process image
        image = decode_base64_image(image_data)
        
        # Make hierarchical prediction
        result = hierarchical_model.predict_location_hierarchical(image)
        
        # Return in Firebase-compatible format
        response = {
            "result": {
                "coordinates": result["coordinates"],
                "location": result["location"],
                "confidence": result["confidence"],
                "processing_time": result["processing_time"],
                "model": result["model"],
                "hierarchy": result["hierarchy"],
                "cost": 0,  # No cost for local model
                "tokensUsed": 0,  # No tokens for local model
                "rawResponse": ""
            }
        }
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return jsonify({
            "error": {
                "message": str(e),
                "code": "prediction-failed"
            }
        }), 500

@app.route('/predict_flexible', methods=['POST'])
def predict_flexible():
    """Flexible prediction with custom location choices"""
    try:
        # Get request data
        request_data = request.json
        
        # Handle Firebase-style nested data format
        if 'data' in request_data:
            data = request_data['data']
        else:
            data = request_data
            
        if not data or 'imageData' not in data:
            return jsonify({"error": "Missing imageData in request"}), 400
        
        if 'locationChoices' not in data:
            return jsonify({"error": "Missing locationChoices for flexible prediction"}), 400
        
        image_data = data['imageData']
        location_choices = data['locationChoices']
        
        # Validate location_choices
        if not isinstance(location_choices, list) or not location_choices:
            return jsonify({"error": "locationChoices must be a non-empty list"}), 400
        
        user_id = data.get('extpayUserId', 'anonymous')
        logger.info(f"Processing flexible request for user: {user_id} with {len(location_choices)} choices")
        
        # Decode and process image
        image = decode_base64_image(image_data)
        
        # Make flexible prediction
        result = hierarchical_model.predict_location_flexible(image, location_choices)
        
        # Return in Firebase-compatible format
        response = {
            "result": {
                "coordinates": result["coordinates"],
                "location": result["location"],
                "confidence": result["confidence"],
                "processing_time": result["processing_time"],
                "model": result["model"],
                "top_predictions": result["top_predictions"],
                "cost": 0,
                "tokensUsed": 0,
                "rawResponse": ""
            }
        }
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Flexible prediction error: {e}")
        return jsonify({
            "error": {
                "message": str(e),
                "code": "flexible-prediction-failed"
            }
        }), 500

@app.route('/predict_country', methods=['POST'])
def predict_country():
    """Country-only prediction endpoint"""
    try:
        request_data = request.json
        
        if 'data' in request_data:
            data = request_data['data']
        else:
            data = request_data
            
        if not data or 'imageData' not in data:
            return jsonify({"error": "Missing imageData in request"}), 400
        
        image_data = data['imageData']
        user_id = data.get('extpayUserId', 'anonymous')
        
        # Decode and process image
        image = decode_base64_image(image_data)
        
        # Predict country only
        country, confidence = hierarchical_model.predict_country(image)
        
        response = {
            "result": {
                "country": country,
                "confidence": confidence,
                "model": "StreetCLIP-Country"
            }
        }
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Country prediction error: {e}")
        return jsonify({
            "error": {
                "message": str(e),
                "code": "country-prediction-failed"
            }
        }), 500

@app.route('/processGeolocation', methods=['POST'])
def process_geolocation():
    """Firebase-compatible endpoint name"""
    return predict()

@app.route('/locations', methods=['GET'])
def get_supported_locations():
    """Get list of supported locations"""
    return jsonify({
        "countries": list(hierarchical_model.countries.keys()),
        "cities": list(hierarchical_model.city_coordinates.keys()),
        "total_countries": len(hierarchical_model.countries),
        "total_cities": len(hierarchical_model.city_coordinates)
    })

@app.route('/demo', methods=['GET'])
def demo_page():
    """Simple demo page for testing"""
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Hierarchical StreetCLIP Demo</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .endpoint { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .method { background: #007acc; color: white; padding: 3px 8px; border-radius: 3px; font-size: 12px; }
            pre { background: #f0f0f0; padding: 10px; border-radius: 3px; overflow-x: auto; }
        </style>
    </head>
    <body>
        <h1>Hierarchical StreetCLIP API</h1>
        <p>Advanced geolocation service using hierarchical country→region→city prediction</p>
        
        <div class="endpoint">
            <h3><span class="method">POST</span> /predict</h3>
            <p>Hierarchical prediction (country → region → city)</p>
            <pre>{"data": {"imageData": "base64_image_string", "extpayUserId": "user123"}}</pre>
        </div>
        
        <div class="endpoint">
            <h3><span class="method">POST</span> /predict_flexible</h3>
            <p>Flexible prediction with custom location choices</p>
            <pre>{"data": {"imageData": "base64_image_string", "locationChoices": ["Paris, France", "London, UK", "Berlin, Germany"]}}</pre>
        </div>
        
        <div class="endpoint">
            <h3><span class="method">POST</span> /predict_country</h3>
            <p>Country-only prediction</p>
            <pre>{"data": {"imageData": "base64_image_string"}}</pre>
        </div>
        
        <div class="endpoint">
            <h3><span class="method">GET</span> /locations</h3>
            <p>Get all supported countries and cities</p>
        </div>
        
        <h2>Features</h2>
        <ul>
            <li><strong>Hierarchical Prediction:</strong> Country → Region → City for more accurate results</li>
            <li><strong>Flexible Locations:</strong> Use any location descriptions, not just predefined cities</li>
            <li><strong>Real StreetCLIP:</strong> Uses the actual pre-trained weights from geolocal/StreetCLIP</li>
            <li><strong>Confidence Scores:</strong> Per-level and overall confidence metrics</li>
            <li><strong>Precise Coordinates:</strong> Detailed lat/lng for hundreds of cities</li>
        </ul>
    </body>
    </html>
    """

if __name__ == '__main__':
    # Load model on startup
    hierarchical_model.load_model()
    
    # Start Flask app
    port = int(os.environ.get('PORT', 8082))  # Different port to avoid conflicts
    app.run(host='0.0.0.0', port=port, debug=False)
