document.addEventListener('DOMContentLoaded', () => {
    const captureButton = document.getElementById('capture-button');
    const saveApiKeyButton = document.getElementById('save-api-key-button');
    const apiKeyInput = document.getElementById('api-key-input');
    const statusDiv = document.getElementById('status');
    const locationWordsDiv = document.getElementById('location-words');
    const coordsDiv = document.getElementById('coords');
    const mapIframe = document.getElementById('map-iframe');
    const zoomInButton = document.getElementById('zoom-in');  /* changed */
    const zoomOutButton = document.getElementById('zoom-out'); /* changed */
    
    let zoomLevel = 10; /* changed */

    // Load API key and last zoom level from storage
    chrome.storage.local.get(['openaiApiKey', 'zoomLevel'], (result) => {
      if (result.openaiApiKey) {
        apiKeyInput.value = result.openaiApiKey;
      }
      if (result.zoomLevel) {
        zoomLevel = result.zoomLevel;
      }
    });

    // Load the last generated location words and coordinates from storage
    chrome.storage.local.get(['locationWords', 'coords'], (result) => {
      if (result.locationWords) {
        locationWordsDiv.textContent = `Location: ${result.locationWords}`;
      }
      if (result.coords) {
        coordsDiv.textContent = `Coords: ${result.coords.lat}, ${result.coords.lng}`;
        
        // Update the Google Maps iframe with the coordinates and marker
        updateMapIframe(result.coords.lat, result.coords.lng, zoomLevel); /* changed */
      }
    });

    saveApiKeyButton.addEventListener('click', () => {
      const apiKey = apiKeyInput.value.trim();
      if (apiKey) {
        chrome.storage.local.set({ openaiApiKey: apiKey }, () => {
          statusDiv.textContent = 'API Key saved!';
          setTimeout(() => { statusDiv.textContent = ''; }, 2000);
        });
      } else {
        statusDiv.textContent = 'Please enter a valid API Key.';
      }
    });

    captureButton.addEventListener('click', () => {
      chrome.storage.local.get(['openaiApiKey'], (result) => {
        if (result.openaiApiKey) {
          captureScreen(result.openaiApiKey);
        } else {
          statusDiv.textContent = 'Please enter your OpenAI API Key.';
        }
      });
    });

    // Zoom In button event listener /* changed */
    zoomInButton.addEventListener('click', () => {
      if (zoomLevel < 21) {  // Max zoom level for Google Maps is 21 /* changed */
        zoomLevel++;
        updateZoomLevel(zoomLevel);
      }
    });

    // Zoom Out button event listener /* changed */
    zoomOutButton.addEventListener('click', () => {
      if (zoomLevel > 0) {  // Min zoom level for Google Maps is 0 /* changed */
        zoomLevel--;
        updateZoomLevel(zoomLevel);
      }
    });
  });

  function captureScreen(apiKey) {
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        document.getElementById('status').textContent = 'Error capturing screen: ' + chrome.runtime.lastError.message;
        return;
      }
      processImage(dataUrl, apiKey);
    });
  }

  async function processImage(dataUrl, apiKey) {
    document.getElementById('status').textContent = 'Processing image...';

    try {
      const imageUrl = await uploadImage(dataUrl);

      if (!imageUrl) {
        document.getElementById('status').textContent = 'Error uploading image.';
        return;
      }

      const messages = [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Guess this location's exact coordinates, and only output the coordinates of your best guess followed by the location's name or general regional location. \
              your response should look something like this for example: 39, 94.5 Kansas City, Kansas. Answer as fast as possible!!"
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: messages,
          max_tokens: 300
        })
      });

      const data = await response.json();

      if (response.ok) {
        const assistantReply = data.choices[0].message.content;
        extractLocationFromResponse(assistantReply);
      } else {
        document.getElementById('status').textContent = 'Error: ' + data.error.message;
      }
    } catch (error) {
      document.getElementById('status').textContent = 'Error: ' + error.message;
    }
  }

  async function uploadImage(dataUrl) {
    try {
      const cloudName = 'dg6ksg0a2';
      const uploadPreset = 'GeoExtension';

      const formData = new FormData();
      formData.append('file', dataUrl);
      formData.append('upload_preset', uploadPreset);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.secure_url) {
        return data.secure_url;
      } else {
        console.error('Image upload failed:', data);
        return null;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  }

  function extractLocationFromResponse(responseText) {
    const locationName = responseText.trim();

    if (locationName) {
      document.getElementById('location-words').textContent = locationName;

      const parsedLocation = parseLocationWords(locationName);
      const coords = parseCoordinates(locationName);

      if (parsedLocation) {
        chrome.storage.local.set({ locationWords: parsedLocation }, () => {
          console.log('Location words saved:', parsedLocation);
        });
        document.getElementById('location-words').textContent = `Location: ${parsedLocation}`;
      }

      if (coords) {
        chrome.storage.local.set({ coords: coords }, () => {
          console.log('Coordinates saved:', coords);
        });
        document.getElementById('coords').textContent = `Coords: ${coords.lat}, ${coords.lng}`;

        // Update the Google Maps iframe with the coordinates and marker
        updateMapIframe(coords.lat, coords.lng, zoomLevel); /* changed */
      } else {
        document.getElementById('status').textContent = 'Could not parse coordinates.';
      }

      document.getElementById('status').textContent = '';
    } else {
      document.getElementById('status').textContent = 'Could not extract location name.';
    }
  }

  function updateMapIframe(lat, lng, zoomLevel) { /* changed */
    const apiKey = 'AIzaSyBTCrEPAQbgMfY1brzBn7Zcd3DlvaXwsSI'; // Use your actual Google Maps API key here
    const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(lat)},${encodeURIComponent(lng)}&zoom=${zoomLevel}`;
    document.getElementById('map-iframe').src = src;
  }

  function updateZoomLevel(zoomLevel) { /* changed */
    chrome.storage.local.get(['coords'], (result) => {
      if (result.coords) {
        // Update the Google Maps iframe with the new zoom level
        updateMapIframe(result.coords.lat, result.coords.lng, zoomLevel);
        // Save the new zoom level in local storage
        chrome.storage.local.set({ zoomLevel: zoomLevel }, () => {
          console.log('Zoom level saved:', zoomLevel);
        });
      }
    });
  }

  function parseCoordinates(locationText) {
    const coordRegex = /(-?\d{1,3}\.\d+),\s*(-?\d{1,3}\.\d+)/; // Regex to find coordinates
    const match = locationText.match(coordRegex);

    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      return { lat: lat, lng: lng };
    }
    return null;
  }

  function parseLocationWords(locationText) {
    // Remove the coordinates from the location string, leaving only the words
    const locationWords = locationText.replace(/(-?\d{1,3}\.\d+),\s*(-?\d{1,3}\.\d+)/, '').trim();
    return locationWords || null;
  }
