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
    const showCoordsCheckbox = document.getElementById('show-coords-checkbox');  // Added

    
    let zoomLevel = 5; /* changed */

    
    // Load API key, zoom level, and show-coords state from storage
    chrome.storage.local.get(['openaiApiKey', 'zoomLevel', 'showCoords'], (result) => {
        if (result.openaiApiKey) {
            apiKeyInput.value = result.openaiApiKey;
        }
        if (result.zoomLevel !== undefined) {
            zoomLevel = result.zoomLevel;
        }
        if (result.showCoords !== undefined) {
            showCoordsCheckbox.checked = result.showCoords;
            toggleCoordsVisibility(result.showCoords); // Update visibility
        } else {
            showCoordsCheckbox.checked = false;  // Default is unchecked
            toggleCoordsVisibility(false); // Start with coords hidden
        }
    });

    // Load the last generated location words and coordinates from storage
    chrome.storage.local.get(['locationWords', 'coords'], (result) => {
        if (result.locationWords) {
            locationWordsDiv.textContent = `${result.locationWords}`;
        }
        if (result.coords) {
            coordsDiv.textContent = `${result.coords.lat}, ${result.coords.lng}`;
            updateMapIframe(result.coords.lat, result.coords.lng, zoomLevel);
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

        // Toggle coordinates display when checkbox is changed
        showCoordsCheckbox.addEventListener('change', () => {
            const showCoords = showCoordsCheckbox.checked;
            chrome.storage.local.set({ showCoords: showCoords }, () => {
                toggleCoordsVisibility(showCoords);
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

  // Function to toggle the visibility of coordinates based on the checkbox state
function toggleCoordsVisibility(showCoords) {
    const coordsDiv = document.getElementById('coords');
    if (showCoords) {
        coordsDiv.style.display = 'block';  // Show the coordinates
    } else {
        coordsDiv.style.display = 'none';  // Hide the coordinates
    }
}


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
    document.getElementById('capture-button').textContent = 'Processing image...';

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
              text: "Guess this location's exact coordinates, and only output the coordinates of your best guess followed by the location's name or general regional location.  \
              This is for the game geoguessr, so use all the metas that a pro would use, and answer asap! \
              your response should look something like this for example: 40.348600, -74.659300 Nassau Hall Princeton, New Jersey, United States."

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
    document.getElementById('capture-button').textContent = 'Capture Screen';
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
        document.getElementById('location-words').textContent = `${parsedLocation}`;
      }

      if (coords) {
        chrome.storage.local.set({ coords: coords }, () => {
          console.log('Coordinates saved:', coords);
        });
        document.getElementById('coords').textContent = `${coords.lat}, ${coords.lng}`;

        // Update the Google Maps iframe with the coordinates and marker
        updateMapIframe(coords.lat, coords.lng, 7); /* changed */
      } else {
        document.getElementById('status').textContent = 'Could not parse coordinates.';
      }

      document.getElementById('status').textContent = '';
    } else {
      document.getElementById('status').textContent = 'Could not extract location name.';
    }
  }

  function updateMapIframe(lat, lng, zoomLevel) {
    if (!zoomLevel) zoomLevel = 7; // Default zoom level if undefined
    const src = `https://www.google.com/maps?q=${encodeURIComponent(lat)},${encodeURIComponent(lng)}&z=${zoomLevel}&output=embed`;
    document.getElementById('map-iframe').src = src;
}

  function updateZoomLevel(zoomLevel) {
    chrome.storage.local.get(['coords'], (result) => {
        if (result.coords) {
            updateMapIframe(result.coords.lat, result.coords.lng, zoomLevel);
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
