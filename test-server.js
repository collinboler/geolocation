const express = require('express');
const cors = require('cors');
const app = express();
const port = 8081;

// Enable CORS for all routes
app.use(cors());
app.use(express.json({limit: '50mb'})); // Support large base64 images

app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({
    status: 'healthy',
    test: 'Node.js server working',
    timestamp: new Date().toISOString()
  });
});

app.post('/processGeolocation', (req, res) => {
  console.log('Process geolocation requested');
  console.log('Request body keys:', Object.keys(req.body));
  
  res.json({
    result: {
      coordinates: {lat: 40.7128, lng: -74.0060},
      location: "Test Location - New York City",
      confidence: 0.95,
      processing_time: 0.1,
      model: "Test Node.js Server",
      cost: 0,
      tokensUsed: 0,
      rawResponse: "Test response from Node.js"
    }
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🧪 Test server running on http://localhost:${port}`);
  console.log('This will help debug Chrome extension connectivity');
});
