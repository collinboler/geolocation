#!/usr/bin/env python3
"""
StreetCLIP Geolocation Service
A self-hosted alternative to OpenAI GPT-5-nano for image geolocation.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import base64
import io
import json
import logging
import numpy as np
from typing import Dict, List, Tuple
import time
import os

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

class StreetCLIPGeolocation:
    def __init__(self):
        self.model = None
        self.processor = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"Using device: {self.device}")
        
        # Major world cities and regions for initial classification
        self.major_locations = [
            "New York City, United States",
            "Los Angeles, United States", 
            "Chicago, United States",
            "London, United Kingdom",
            "Paris, France",
            "Berlin, Germany",
            "Tokyo, Japan",
            "Seoul, South Korea",
            "Beijing, China",
            "Shanghai, China",
            "Mumbai, India",
            "Delhi, India",
            "São Paulo, Brazil",
            "Mexico City, Mexico",
            "Sydney, Australia",
            "Melbourne, Australia",
            "Cairo, Egypt",
            "Lagos, Nigeria",
            "Moscow, Russia",
            "Istanbul, Turkey",
            "Bangkok, Thailand",
            "Singapore",
            "Dubai, UAE",
            "Madrid, Spain",
            "Rome, Italy",
            "Amsterdam, Netherlands",
            "Stockholm, Sweden",
            "Copenhagen, Denmark",
            "Vienna, Austria",
            "Prague, Czech Republic",
            "Warsaw, Poland",
            "Budapest, Hungary",
            "Athens, Greece",
            "Lisbon, Portugal",
            "Dublin, Ireland",
            "Helsinki, Finland",
            "Oslo, Norway",
            "Zurich, Switzerland",
            "Brussels, Belgium",
            "Montreal, Canada",
            "Toronto, Canada",
            "Vancouver, Canada",
            "Buenos Aires, Argentina",
            "Lima, Peru",
            "Santiago, Chile",
            "Bogotá, Colombia",
            "Caracas, Venezuela",
            "Johannesburg, South Africa",
            "Cape Town, South Africa",
            "Nairobi, Kenya",
            "Casablanca, Morocco",
            "Tel Aviv, Israel",
            "Riyadh, Saudi Arabia",
            "Doha, Qatar",
            "Kuwait City, Kuwait",
            "Manila, Philippines",
            "Jakarta, Indonesia",
            "Kuala Lumpur, Malaysia",
            "Ho Chi Minh City, Vietnam",
            "Hanoi, Vietnam",
            "Dhaka, Bangladesh",
            "Karachi, Pakistan",
            "Lahore, Pakistan",
            "Islamabad, Pakistan"
        ]
        
        # Coordinate mappings for major cities (approximate centers)
        self.city_coordinates = {
            "New York City, United States": {"lat": 40.7128, "lng": -74.0060},
            "Los Angeles, United States": {"lat": 34.0522, "lng": -118.2437},
            "Chicago, United States": {"lat": 41.8781, "lng": -87.6298},
            "London, United Kingdom": {"lat": 51.5074, "lng": -0.1278},
            "Paris, France": {"lat": 48.8566, "lng": 2.3522},
            "Berlin, Germany": {"lat": 52.5200, "lng": 13.4050},
            "Tokyo, Japan": {"lat": 35.6762, "lng": 139.6503},
            "Seoul, South Korea": {"lat": 37.5665, "lng": 126.9780},
            "Beijing, China": {"lat": 39.9042, "lng": 116.4074},
            "Shanghai, China": {"lat": 31.2304, "lng": 121.4737},
            "Mumbai, India": {"lat": 19.0760, "lng": 72.8777},
            "Delhi, India": {"lat": 28.7041, "lng": 77.1025},
            "São Paulo, Brazil": {"lat": -23.5505, "lng": -46.6333},
            "Mexico City, Mexico": {"lat": 19.4326, "lng": -99.1332},
            "Sydney, Australia": {"lat": -33.8688, "lng": 151.2093},
            "Melbourne, Australia": {"lat": -37.8136, "lng": 144.9631},
            "Cairo, Egypt": {"lat": 30.0444, "lng": 31.2357},
            "Lagos, Nigeria": {"lat": 6.5244, "lng": 3.3792},
            "Moscow, Russia": {"lat": 55.7558, "lng": 37.6176},
            "Istanbul, Turkey": {"lat": 41.0082, "lng": 28.9784},
            "Bangkok, Thailand": {"lat": 13.7563, "lng": 100.5018},
            "Singapore": {"lat": 1.3521, "lng": 103.8198},
            "Dubai, UAE": {"lat": 25.2048, "lng": 55.2708},
            "Madrid, Spain": {"lat": 40.4168, "lng": -3.7038},
            "Rome, Italy": {"lat": 41.9028, "lng": 12.4964},
            "Amsterdam, Netherlands": {"lat": 52.3676, "lng": 4.9041},
            "Stockholm, Sweden": {"lat": 59.3293, "lng": 18.0686},
            "Copenhagen, Denmark": {"lat": 55.6761, "lng": 12.5683},
            "Vienna, Austria": {"lat": 48.2082, "lng": 16.3738},
            "Prague, Czech Republic": {"lat": 50.0755, "lng": 14.4378},
            "Warsaw, Poland": {"lat": 52.2297, "lng": 21.0122},
            "Budapest, Hungary": {"lat": 47.4979, "lng": 19.0402},
            "Athens, Greece": {"lat": 37.9838, "lng": 23.7275},
            "Lisbon, Portugal": {"lat": 38.7223, "lng": -9.1393},
            "Dublin, Ireland": {"lat": 53.3498, "lng": -6.2603},
            "Helsinki, Finland": {"lat": 60.1699, "lng": 24.9384},
            "Oslo, Norway": {"lat": 59.9139, "lng": 10.7522},
            "Zurich, Switzerland": {"lat": 47.3769, "lng": 8.5417},
            "Brussels, Belgium": {"lat": 50.8503, "lng": 4.3517},
            "Montreal, Canada": {"lat": 45.5017, "lng": -73.5673},
            "Toronto, Canada": {"lat": 43.6532, "lng": -79.3832},
            "Vancouver, Canada": {"lat": 49.2827, "lng": -123.1207},
            "Buenos Aires, Argentina": {"lat": -34.6118, "lng": -58.3960},
            "Lima, Peru": {"lat": -12.0464, "lng": -77.0428},
            "Santiago, Chile": {"lat": -33.4489, "lng": -70.6693},
            "Bogotá, Colombia": {"lat": 4.7110, "lng": -74.0721},
            "Caracas, Venezuela": {"lat": 10.4806, "lng": -66.9036},
            "Johannesburg, South Africa": {"lat": -26.2041, "lng": 28.0473},
            "Cape Town, South Africa": {"lat": -33.9249, "lng": 18.4241},
            "Nairobi, Kenya": {"lat": -1.2921, "lng": 36.8219},
            "Casablanca, Morocco": {"lat": 33.5731, "lng": -7.5898},
            "Tel Aviv, Israel": {"lat": 32.0853, "lng": 34.7818},
            "Riyadh, Saudi Arabia": {"lat": 24.7136, "lng": 46.6753},
            "Doha, Qatar": {"lat": 25.2854, "lng": 51.5310},
            "Kuwait City, Kuwait": {"lat": 29.3759, "lng": 47.9774},
            "Manila, Philippines": {"lat": 14.5995, "lng": 120.9842},
            "Jakarta, Indonesia": {"lat": -6.2088, "lng": 106.8456},
            "Kuala Lumpur, Malaysia": {"lat": 3.1390, "lng": 101.6869},
            "Ho Chi Minh City, Vietnam": {"lat": 10.8231, "lng": 106.6297},
            "Hanoi, Vietnam": {"lat": 21.0285, "lng": 105.8542},
            "Dhaka, Bangladesh": {"lat": 23.8103, "lng": 90.4125},
            "Karachi, Pakistan": {"lat": 24.8607, "lng": 67.0011},
            "Lahore, Pakistan": {"lat": 31.5804, "lng": 74.3587},
            "Islamabad, Pakistan": {"lat": 33.6844, "lng": 73.0479}
        }
        
    def load_model(self):
        """Load the StreetCLIP model and processor"""
        try:
            logger.info("Loading StreetCLIP model...")
            self.model = CLIPModel.from_pretrained("geolocal/StreetCLIP")
            self.processor = CLIPProcessor.from_pretrained("geolocal/StreetCLIP")
            self.model.to(self.device)
            self.model.eval()
            logger.info("StreetCLIP model loaded successfully!")
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            raise
            
    def decode_base64_image(self, base64_string: str) -> Image.Image:
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
            
    def predict_location(self, image: Image.Image) -> Dict:
        """Predict location from image using StreetCLIP"""
        try:
            start_time = time.time()
            
            # Process inputs
            inputs = self.processor(
                text=self.major_locations, 
                images=image, 
                return_tensors="pt", 
                padding=True
            )
            
            # Move inputs to device
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            # Get predictions
            with torch.no_grad():
                outputs = self.model(**inputs)
                logits_per_image = outputs.logits_per_image
                probabilities = logits_per_image.softmax(dim=1)
            
            # Get top predictions
            top_k = 3
            top_probs, top_indices = torch.topk(probabilities, top_k, dim=1)
            
            predictions = []
            for i in range(top_k):
                idx = top_indices[0][i].item()
                prob = top_probs[0][i].item()
                location = self.major_locations[idx]
                coordinates = self.city_coordinates.get(location, {"lat": 0, "lng": 0})
                
                predictions.append({
                    "location": location,
                    "coordinates": coordinates,
                    "confidence": float(prob)
                })
            
            processing_time = time.time() - start_time
            
            # Return the top prediction in the expected format
            best_prediction = predictions[0]
            
            result = {
                "coordinates": best_prediction["coordinates"],
                "location": best_prediction["location"],
                "confidence": best_prediction["confidence"],
                "processing_time": processing_time,
                "model": "StreetCLIP",
                "top_predictions": predictions
            }
            
            logger.info(f"Prediction completed in {processing_time:.3f}s: {best_prediction['location']} (confidence: {best_prediction['confidence']:.3f})")
            
            return result
            
        except Exception as e:
            logger.error(f"Error during prediction: {e}")
            raise

# Global model instance
geolocation_model = StreetCLIPGeolocation()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "model_loaded": geolocation_model.model is not None,
        "device": geolocation_model.device
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Main prediction endpoint - compatible with existing Chrome extension"""
    try:
        # Get request data - handle both direct calls and Firebase-style nested data
        request_data = request.json
        
        # Handle Firebase-style nested data format
        if 'data' in request_data:
            data = request_data['data']
        else:
            data = request_data
            
        if not data or 'imageData' not in data:
            return jsonify({"error": "Missing imageData in request"}), 400
        
        image_data = data['imageData']
        
        # Optional: Handle user ID for usage tracking (simplified local version)
        user_id = data.get('extpayUserId', 'anonymous')
        logger.info(f"Processing request for user: {user_id}")
        
        # Decode and process image
        image = geolocation_model.decode_base64_image(image_data)
        
        # Make prediction
        result = geolocation_model.predict_location(image)
        
        # Return in Firebase-compatible format
        response = {
            "result": {
                "coordinates": result["coordinates"],
                "location": result["location"],
                "confidence": result["confidence"],
                "processing_time": result["processing_time"],
                "model": result["model"],
                "cost": 0,  # No cost for local model
                "tokensUsed": 0,  # No tokens for local model
                "rawResponse": result.get("rawResponse", "")
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

@app.route('/processGeolocation', methods=['POST'])
def process_geolocation():
    """Firebase-compatible endpoint name"""
    return predict()

@app.route('/locations', methods=['GET'])
def get_supported_locations():
    """Get list of supported locations"""
    return jsonify({
        "locations": geolocation_model.major_locations,
        "total_count": len(geolocation_model.major_locations)
    })

if __name__ == '__main__':
    # Load model on startup
    geolocation_model.load_model()
    
    # Start Flask app
    port = int(os.environ.get('PORT', 8081))
    app.run(host='0.0.0.0', port=port, debug=False)
