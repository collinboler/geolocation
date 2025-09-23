#!/usr/bin/env python3
"""
Simple test server to debug Chrome extension connectivity
"""

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/health', methods=['GET'])
def health():
    print("Health check requested")
    return jsonify({"status": "healthy", "test": "server working"})

@app.route('/processGeolocation', methods=['POST'])
def test_process():
    print("Process geolocation requested")
    print(f"Request data: {request.json}")
    
    return jsonify({
        "result": {
            "coordinates": {"lat": 40.7128, "lng": -74.0060},
            "location": "Test Location - New York City",
            "confidence": 0.95,
            "processing_time": 0.1,
            "model": "Test Model",
            "cost": 0,
            "tokensUsed": 0,
            "rawResponse": "Test response"
        }
    })

if __name__ == '__main__':
    print("🧪 Starting test server on port 8080...")
    print("This will help debug Chrome extension connectivity")
    app.run(host='0.0.0.0', port=8080, debug=True)
