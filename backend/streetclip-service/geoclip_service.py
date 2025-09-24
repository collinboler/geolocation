#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GeoCLIP Geolocation Service

This service provides direct GPS coordinate prediction using the GeoCLIP model,
which uses CLIP-inspired alignment between locations and images for worldwide geo-localization.

GeoCLIP differs from StreetCLIP by:
- Directly predicting GPS coordinates (lat/lng) instead of text descriptions
- Using coordinate regression rather than hierarchical classification
- Trained on worldwide GPS-tagged images for global coverage

Author: Assistant
Date: September 2025
"""

import os
import sys
import time
import logging
from typing import Tuple, Dict, List, Optional
import torch
import numpy as np
from PIL import Image
import base64
import io

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GeoCLIPPredictor:
    """GeoCLIP model for direct GPS coordinate prediction"""
    
    def __init__(self):
        """Initialize the GeoCLIP model"""
        self.model = None
        self.device = None
        self._load_model()
    
    def _load_model(self):
        """Load the GeoCLIP model"""
        try:
            logger.info("Loading GeoCLIP model...")
            
            # Check for CUDA availability
            if torch.cuda.is_available():
                self.device = "cuda"
                logger.info("CUDA available - using GPU acceleration")
            else:
                self.device = "cpu" 
                logger.info("CUDA not available - using CPU")
            
            # Import and initialize GeoCLIP
            from geoclip import GeoCLIP
            self.model = GeoCLIP().to(self.device)
            
            logger.info(f"GeoCLIP model loaded successfully on {self.device}")
            
        except ImportError as e:
            logger.error(f"GeoCLIP not installed. Install with: pip install geoclip")
            raise e
        except Exception as e:
            logger.error(f"Failed to load GeoCLIP model: {e}")
            raise e
    
    def predict_coordinates(self, image: Image.Image, top_k: int = 5) -> Dict:
        """
        Predict GPS coordinates for an image using GeoCLIP
        
        Args:
            image: PIL Image to geolocate
            top_k: Number of top predictions to return
            
        Returns:
            Dictionary with predictions, coordinates, and confidence scores
        """
        start_time = time.time()
        
        try:
            logger.info(f"Predicting coordinates with GeoCLIP (top_k={top_k})...")
            
            # Convert PIL Image to the format expected by GeoCLIP
            # GeoCLIP expects either a file path or BytesIO object
            img_buffer = io.BytesIO()
            image.save(img_buffer, format='JPEG')
            img_buffer.seek(0)
            
            # Make prediction
            top_pred_gps, top_pred_prob = self.model.predict(img_buffer, top_k=top_k)
            
            # Convert numpy arrays to lists for JSON serialization
            coordinates_list = top_pred_gps.tolist()
            probabilities_list = top_pred_prob.tolist()
            
            # Get the top prediction
            top_lat, top_lng = coordinates_list[0]
            top_confidence = probabilities_list[0]
            
            # Format predictions
            predictions = []
            for i in range(len(coordinates_list)):
                lat, lng = coordinates_list[i]
                prob = probabilities_list[i]
                predictions.append({
                    "rank": i + 1,
                    "coordinates": {"lat": lat, "lng": lng},
                    "confidence": prob,
                    "location_description": f"Predicted location: {lat:.6f}, {lng:.6f}"
                })
            
            processing_time = time.time() - start_time
            
            result = {
                "coordinates": {"lat": top_lat, "lng": top_lng},
                "location": f"GeoCLIP Prediction: {top_lat:.6f}, {lng:.6f}",
                "confidence": top_confidence,
                "processing_time": processing_time,
                "model": "GeoCLIP",
                "method": "coordinate_regression",
                "predictions": predictions,
                "total_predictions": len(predictions)
            }
            
            logger.info(f"GeoCLIP prediction completed in {processing_time:.2f}s")
            logger.info(f"Top prediction: ({top_lat:.6f}, {top_lng:.6f}) with confidence {top_confidence:.6f}")
            
            return result
            
        except Exception as e:
            logger.error(f"Error during GeoCLIP prediction: {e}")
            raise e
    
    def predict_with_heatmap_data(self, image: Image.Image, top_k: int = 10) -> Dict:
        """
        Predict coordinates and return heatmap visualization data
        
        Args:
            image: PIL Image to geolocate
            top_k: Number of predictions for heatmap
            
        Returns:
            Prediction results with heatmap coordinates
        """
        result = self.predict_coordinates(image, top_k)
        
        # Extract coordinates and probabilities for heatmap
        coordinates = []
        probabilities = []
        
        for pred in result["predictions"]:
            lat = pred["coordinates"]["lat"]
            lng = pred["coordinates"]["lng"]
            prob = pred["confidence"]
            coordinates.append([lat, lng])
            probabilities.append(prob)
        
        # Normalize probabilities for heatmap weighting
        total_prob = sum(probabilities)
        normalized_probs = [prob / total_prob for prob in probabilities] if total_prob > 0 else probabilities
        
        # Create weighted coordinates for heatmap
        weighted_coordinates = []
        for i, (lat_lng, weight) in enumerate(zip(coordinates, normalized_probs)):
            lat, lng = lat_lng
            weighted_coordinates.append([lat, lng, weight])
        
        # Calculate average location for map centering
        avg_lat = sum(coord[0] for coord in coordinates) / len(coordinates)
        avg_lng = sum(coord[1] for coord in coordinates) / len(coordinates)
        
        result["heatmap"] = {
            "weighted_coordinates": weighted_coordinates,
            "center": {"lat": avg_lat, "lng": avg_lng},
            "zoom_level": 2
        }
        
        return result

def test_geoclip():
    """Test function for GeoCLIP predictor"""
    try:
        predictor = GeoCLIPPredictor()
        logger.info("GeoCLIP predictor initialized successfully!")
        return True
    except Exception as e:
        logger.error(f"GeoCLIP test failed: {e}")
        return False

if __name__ == "__main__":
    # Test the GeoCLIP predictor
    if test_geoclip():
        print("✅ GeoCLIP service is ready!")
    else:
        print("❌ GeoCLIP service failed to initialize")
        sys.exit(1)
