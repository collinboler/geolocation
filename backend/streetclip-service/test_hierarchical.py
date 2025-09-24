#!/usr/bin/env python3
"""
Test script for the Hierarchical StreetCLIP implementation
"""

import requests
import base64
import json
from PIL import Image
import io

def image_to_base64(image_path):
    """Convert image file to base64 string"""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def test_hierarchical_service():
    """Test the hierarchical StreetCLIP service"""
    
    base_url = "http://localhost:8082"
    
    # Test health endpoint
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{base_url}/health")
        print(f"Health Status: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
        print()
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return
    
    # Test with a sample image (you can replace this path)
    print("🖼️  Testing with sample image...")
    
    # Create a simple test image (or use an existing one)
    # For demo purposes, create a simple colored image
    test_image = Image.new('RGB', (100, 100), color='red')
    buffer = io.BytesIO()
    test_image.save(buffer, format='PNG')
    test_image_b64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    
    # Test hierarchical prediction
    print("🏗️  Testing hierarchical prediction...")
    try:
        payload = {
            "data": {
                "imageData": test_image_b64,
                "extpayUserId": "test_user"
            }
        }
        
        response = requests.post(f"{base_url}/predict", json=payload)
        print(f"Hierarchical Prediction Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Location: {result['result']['location']}")
            print(f"Coordinates: {result['result']['coordinates']}")
            print(f"Confidence: {result['result']['confidence']:.3f}")
            print(f"Hierarchy: {result['result']['hierarchy']}")
        else:
            print(f"Error: {response.text}")
        print()
    except Exception as e:
        print(f"❌ Hierarchical prediction failed: {e}")
    
    # Test flexible prediction
    print("🎯 Testing flexible prediction...")
    try:
        flexible_payload = {
            "data": {
                "imageData": test_image_b64,
                "locationChoices": [
                    "New York City, United States",
                    "Paris, France", 
                    "Tokyo, Japan",
                    "London, United Kingdom",
                    "Sydney, Australia"
                ]
            }
        }
        
        response = requests.post(f"{base_url}/predict_flexible", json=flexible_payload)
        print(f"Flexible Prediction Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Location: {result['result']['location']}")
            print(f"Confidence: {result['result']['confidence']:.3f}")
            print(f"Top predictions: {result['result']['top_predictions']}")
        else:
            print(f"Error: {response.text}")
        print()
    except Exception as e:
        print(f"❌ Flexible prediction failed: {e}")
    
    # Test country prediction
    print("🌍 Testing country prediction...")
    try:
        country_payload = {
            "data": {
                "imageData": test_image_b64
            }
        }
        
        response = requests.post(f"{base_url}/predict_country", json=country_payload)
        print(f"Country Prediction Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Country: {result['result']['country']}")
            print(f"Confidence: {result['result']['confidence']:.3f}")
        else:
            print(f"Error: {response.text}")
        print()
    except Exception as e:
        print(f"❌ Country prediction failed: {e}")
    
    # Test locations endpoint
    print("📍 Testing locations endpoint...")
    try:
        response = requests.get(f"{base_url}/locations")
        print(f"Locations Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Countries: {len(result['countries'])}")
            print(f"Cities: {len(result['cities'])}")
            print(f"Sample countries: {result['countries'][:5]}")
        else:
            print(f"Error: {response.text}")
        print()
    except Exception as e:
        print(f"❌ Locations request failed: {e}")

if __name__ == "__main__":
    print("🧪 Hierarchical StreetCLIP Test Suite")
    print("=" * 50)
    test_hierarchical_service()
    print("✅ Tests completed!")
    print("\n🌐 Visit http://localhost:8082/demo for interactive testing")



