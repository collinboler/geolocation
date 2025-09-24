#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test script for GeoCLIP service

This script tests the various endpoints of the GeoCLIP Flask application.
"""

import requests
import base64
import json
import time
from PIL import Image
import io

def create_test_image():
    """Create a simple test image"""
    # Create a simple 256x256 RGB image with some basic patterns
    img = Image.new('RGB', (256, 256), color='blue')
    
    # Convert to base64
    buffer = io.BytesIO()
    img.save(buffer, format='JPEG')
    img_data = buffer.getvalue()
    base64_image = base64.b64encode(img_data).decode('utf-8')
    
    return base64_image

def test_status():
    """Test the status endpoint"""
    print("🔍 Testing GeoCLIP status endpoint...")
    try:
        response = requests.get('http://localhost:8083/geoclip/status')
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Status: {result.get('status')}")
            print(f"   Model: {result.get('model')}")
            print(f"   Method: {result.get('method')}")
            print(f"   Device: {result.get('device')}")
            return True
        else:
            print(f"❌ Status check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Status check error: {e}")
        return False

def test_geoclip_predict():
    """Test the GeoCLIP predict endpoint"""
    print("\n🎯 Testing GeoCLIP prediction endpoint...")
    try:
        test_image = create_test_image()
        
        data = {
            "image": test_image,
            "top_k": 3
        }
        
        start_time = time.time()
        response = requests.post('http://localhost:8083/geoclip/predict', 
                               json=data,
                               headers={'Content-Type': 'application/json'})
        elapsed_time = time.time() - start_time
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Prediction successful!")
            print(f"   Top coordinates: ({result['coordinates']['lat']:.6f}, {result['coordinates']['lng']:.6f})")
            print(f"   Confidence: {result['confidence']:.6f}")
            print(f"   Processing time: {result['processing_time']:.2f}s")
            print(f"   Request time: {elapsed_time:.2f}s")
            print(f"   Total predictions: {result['total_predictions']}")
            
            # Show top 3 predictions
            for i, pred in enumerate(result['predictions'][:3]):
                lat = pred['coordinates']['lat']
                lng = pred['coordinates']['lng']
                conf = pred['confidence']
                print(f"   {i+1}. ({lat:.6f}, {lng:.6f}) - {conf:.4f}")
            
            return True
        else:
            print(f"❌ Prediction failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        return False

def test_process_geolocation():
    """Test the main geolocation endpoint (Chrome extension compatible)"""
    print("\n🌍 Testing main geolocation endpoint...")
    try:
        test_image = create_test_image()
        
        data = {
            "image": test_image
        }
        
        start_time = time.time()
        response = requests.post('http://localhost:8083/processGeolocation', 
                               json=data,
                               headers={'Content-Type': 'application/json'})
        elapsed_time = time.time() - start_time
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Geolocation successful!")
            coord = result['result']['coordinates']
            print(f"   Coordinates: ({coord['lat']:.6f}, {coord['lng']:.6f})")
            print(f"   Location: {result['result']['location']}")
            print(f"   Confidence: {result['result']['confidence']:.6f}")
            print(f"   Model: {result['result']['model']}")
            print(f"   Method: {result['result']['method']}")
            print(f"   Processing time: {result['result']['processing_time']:.2f}s")
            print(f"   Request time: {elapsed_time:.2f}s")
            return True
        else:
            print(f"❌ Geolocation failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Geolocation error: {e}")
        return False

def test_heatmap():
    """Test the heatmap endpoint"""
    print("\n🗺️ Testing GeoCLIP heatmap endpoint...")
    try:
        test_image = create_test_image()
        
        data = {
            "image": test_image,
            "top_k": 5
        }
        
        response = requests.post('http://localhost:8083/geoclip/heatmap', 
                               json=data,
                               headers={'Content-Type': 'application/json'})
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Heatmap data generated!")
            print(f"   Heatmap center: ({result['heatmap']['center']['lat']:.6f}, {result['heatmap']['center']['lng']:.6f})")
            print(f"   Weighted coordinates: {len(result['heatmap']['weighted_coordinates'])} points")
            print(f"   Zoom level: {result['heatmap']['zoom_level']}")
            
            # Show first few weighted coordinates
            for i, coord in enumerate(result['heatmap']['weighted_coordinates'][:3]):
                lat, lng, weight = coord
                print(f"   {i+1}. ({lat:.6f}, {lng:.6f}) weight: {weight:.4f}")
                
            return True
        else:
            print(f"❌ Heatmap failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Heatmap error: {e}")
        return False

def main():
    """Run all GeoCLIP tests"""
    print("🧪 GeoCLIP Service Test Suite")
    print("=" * 50)
    
    # Wait a moment for the service to fully start
    print("⏳ Waiting for service to start...")
    time.sleep(3)
    
    tests = [
        ("Status Check", test_status),
        ("GeoCLIP Predict", test_geoclip_predict),
        ("Process Geolocation", test_process_geolocation),
        ("Heatmap Data", test_heatmap)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n{'='*20} {test_name} {'='*20}")
        if test_func():
            passed += 1
        time.sleep(1)  # Brief pause between tests
    
    print("\n" + "="*50)
    print(f"🏁 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All GeoCLIP tests passed!")
        print("🌍 GeoCLIP service is fully operational!")
    else:
        print("⚠️ Some tests failed. Check the service logs.")
    
    print("\n📍 Service Endpoints:")
    print("   - http://localhost:8083/geoclip/status")
    print("   - http://localhost:8083/geoclip/demo")
    print("   - POST http://localhost:8083/processGeolocation")
    print("   - POST http://localhost:8083/geoclip/predict")
    print("   - POST http://localhost:8083/geoclip/heatmap")

if __name__ == "__main__":
    main()
