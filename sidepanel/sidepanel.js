let zoomLevel = 5; // Declare at the top level

document.addEventListener('DOMContentLoaded', () => {
  const captureButton = document.getElementById('capture-button');
  const settingsButton = document.getElementById('settings-button');
  const closeSettingsButton = document.getElementById('close-settings');
  const settingsModal = document.getElementById('settings-modal');
  const saveApiKeyButton = document.getElementById('save-api-key-button');
  const apiKeyInput = document.getElementById('api-key-input');
  const statusDiv = document.getElementById('status');
  const locationWordsDiv = document.getElementById('location-words');
  const coordsDiv = document.getElementById('coords');
  const mapIframe = document.getElementById('map-iframe');
  const zoomInButton = document.getElementById('zoom-in');
  const zoomOutButton = document.getElementById('zoom-out');
  const showCoordsSwitch = document.getElementById('show-coords-switch');
  const showMapSwitch = document.getElementById('show-map-switch');
  const darkModeSwitch = document.getElementById('dark-mode-switch');

  // Load settings from storage
  chrome.storage.local.get(['openaiApiKey', 'zoomLevel', 'showCoords', 'showMap', 'darkMode'], (result) => {
    if (result.openaiApiKey) {
      apiKeyInput.value = result.openaiApiKey;
    }
    if (result.zoomLevel !== undefined) {
      zoomLevel = result.zoomLevel;
    }
    if (result.showMap !== undefined) {
      showMapSwitch.checked = result.showMap;
      toggleMapVisibility(result.showMap);
    } else {
      showMapSwitch.checked = true;
      toggleMapVisibility(true);
    }
    if (result.showCoords !== undefined) {
      showCoordsSwitch.checked = result.showCoords;
      toggleCoordsVisibility(result.showCoords);
    } else {
      showCoordsSwitch.checked = false;
      toggleCoordsVisibility(false);
    }
    if (result.darkMode !== undefined) {
      darkModeSwitch.checked = result.darkMode;
      toggleDarkMode(result.darkMode);
    } else {
      darkModeSwitch.checked = false;
      toggleDarkMode(false);
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
    } else {
      // Default to Laurizan Hall, Whitman College, Princeton NJ if no saved coordinates
      const defaultCoords = {
        lat: 40.348600,
        lng: -74.659300
      };
      const defaultLocation = "Whitman College, Princeton, New Jersey, United States";
      
      locationWordsDiv.textContent = defaultLocation;
      coordsDiv.textContent = `${defaultCoords.lat}, ${defaultCoords.lng}`;
      updateMapIframe(defaultCoords.lat, defaultCoords.lng, zoomLevel);
      
      // Save default values to storage
      chrome.storage.local.set({
        coords: defaultCoords,
        locationWords: defaultLocation
      });
    }
  });

  // Save API key
  saveApiKeyButton.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
      chrome.storage.local.set({ openaiApiKey: apiKey }, () => {
        statusDiv.textContent = 'API Key saved successfully!';
        setTimeout(() => { statusDiv.textContent = ''; }, 3000);
      });
    } else {
      statusDiv.textContent = 'Please enter a valid API Key.';
    }
  });

  // Toggle map display
  showMapSwitch.addEventListener('change', () => {
    const showMap = showMapSwitch.checked;
    chrome.storage.local.set({ showMap: showMap }, () => {
      toggleMapVisibility(showMap);
      statusDiv.textContent = showMap ? 'Map display enabled' : 'Map display disabled';
      setTimeout(() => { statusDiv.textContent = ''; }, 2000);
    });
  });

  // Toggle coordinates display
  showCoordsSwitch.addEventListener('change', () => {
    const showCoords = showCoordsSwitch.checked;
    chrome.storage.local.set({ showCoords: showCoords }, () => {
      toggleCoordsVisibility(showCoords);
      statusDiv.textContent = showCoords ? 'Coordinates display enabled' : 'Coordinates display disabled';
      setTimeout(() => { statusDiv.textContent = ''; }, 2000);
    });
  });

  // Toggle dark mode
  darkModeSwitch.addEventListener('change', () => {
    const darkMode = darkModeSwitch.checked;
    chrome.storage.local.set({ darkMode: darkMode }, () => {
      toggleDarkMode(darkMode);
      statusDiv.textContent = darkMode ? 'Dark mode enabled' : 'Dark mode disabled';
      setTimeout(() => { statusDiv.textContent = ''; }, 2000);
    });
  });

  // Zoom controls are now handled by Google Maps iframe
  // Removed custom zoom button event listeners

  // Capture button event listener
  captureButton.addEventListener('click', () => {
    chrome.storage.local.get(['openaiApiKey'], (result) => {
      if (result.openaiApiKey) {
        captureScreen(result.openaiApiKey);
      } else {
        statusDiv.textContent = 'Please enter your OpenAI API Key.';
      }
    });
  });

  // Settings modal event listeners
  settingsButton.addEventListener('click', () => {
    settingsModal.style.display = 'block';
  });

  closeSettingsButton.addEventListener('click', () => {
    settingsModal.style.display = 'none';
  });

  // Close modal when clicking outside of it
  settingsModal.addEventListener('click', (event) => {
    if (event.target === settingsModal) {
      settingsModal.style.display = 'none';
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && settingsModal.style.display === 'block') {
      settingsModal.style.display = 'none';
    }
  });
});

// Function to toggle the visibility of coordinates based on the switch state
function toggleCoordsVisibility(showCoords) {
  const coordsCard = document.querySelector('.coords-card');
  if (showCoords) {
    coordsCard.style.display = 'block';
  } else {
    coordsCard.style.display = 'none';
  }
}

// Function to toggle dark mode
function toggleDarkMode(darkMode) {
  const body = document.body;
  if (darkMode) {
    body.classList.add('dark-mode');
  } else {
    body.classList.remove('dark-mode');
  }
}

// Function to toggle map visibility
function toggleMapVisibility(showMap) {
  const mapIframe = document.getElementById('map-iframe');
  if (showMap) {
    mapIframe.style.display = 'block';
  } else {
    mapIframe.style.display = 'none';
  }
}

function captureScreen(apiKey) {
  // Get current tab info
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    
    // Capture the visible tab content
    chrome.tabs.captureVisibleTab(currentTab.windowId, { format: 'png' }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        document.getElementById('status').textContent = 'Error capturing screen: ' + chrome.runtime.lastError.message;
        return;
      }
      
      // Create canvas to crop out the side panel
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Get the side panel width (approximately 400px)
        const sidePanelWidth = 400;
        const cropWidth = img.width - sidePanelWidth;
        
        // Set canvas dimensions to exclude side panel
        canvas.width = cropWidth;
        canvas.height = img.height;
        
        // Draw only the main content area (excluding side panel)
        ctx.drawImage(img, 0, 0, cropWidth, img.height, 0, 0, cropWidth, img.height);
        
        // Convert cropped canvas to data URL
        const croppedDataUrl = canvas.toDataURL('image/png');
        processImage(croppedDataUrl, apiKey);
      };
      
      img.src = dataUrl;
    });
  });
}

async function processImage(dataUrl, apiKey) {
  document.getElementById('capture-button').textContent = 'Processing image...';

  try {
    const messages = [
      {
        role: "user",
        content: [
          {
            type: "text",

            /*             text: "Guess this location's exact coordinates, and only output the coordinates of your best guess followed by the location's name or general regional location.  \
This is for the game geoguessr, so use all the metas that a pro would use, and answer asap! \
Your response should look something like this for example: 40.348600, -74.659300 Nassau Hall Princeton, New Jersey, United States."  */
            text: "Guess this location's exact coordinates, and only output the coordinates of your best guess followed by the location's name or general regional location. This is for the game geoguessr, so use all the metas that a pro would use, and answer asap! Output your response in this JSON format only: {\"coordinates\": {\"lat\": 40.348600, \"lng\": -74.659300}, \"location\": \"Nassau Hall Princeton, New Jersey, United States\"} ALWAYS OUTPUT SOME JSON GUESS, EVEN IF YOU ARE NOT 100% CERTAIN. Take your best guess for sure though, just in edge cases." 
          },
          {
            type: "image_url",
            image_url: {
              url: dataUrl
            }
          }
        ]
      }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.choices[0].message.content;
    
    const locationData = extractLocationFromResponse(responseText);
    
    if (locationData.coordinates) {
      document.getElementById('coords').textContent = `${locationData.coordinates.lat}, ${locationData.coordinates.lng}`;
      updateMapIframe(locationData.coordinates.lat, locationData.coordinates.lng, zoomLevel);
      
      // Save to storage
      chrome.storage.local.set({
        coords: locationData.coordinates,
        locationWords: locationData.description
      });
    }
    
    if (locationData.description) {
      document.getElementById('location-words').textContent = locationData.description;
    }

    document.getElementById('capture-button').innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M20 4h-3.17l-1.24-1.35A2 2 0 0 0 14.12 2H9.88a2 2 0 0 0-1.47.65L7.17 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
      </svg>
      Guess
    `;

  } catch (error) {
    console.error('Error:', error);
    document.getElementById('status').textContent = 'Error processing image: ' + error.message;
    document.getElementById('capture-button').innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M20 4h-3.17l-1.24-1.35A2 2 0 0 0 14.12 2H9.88a2 2 0 0 0-1.47.65L7.17 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
      </svg>
      Guess
    `;
  }
}

function extractLocationFromResponse(responseText) {
  try {
    // Find and parse JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Handle the new JSON format
      if (parsed.coordinates && parsed.location) {
        return {
          coordinates: parsed.coordinates,
          description: parsed.location
        };
      }
    }
    
    // Fallback: try to extract coordinates from text (in case AI doesn't output JSON)
    const coordMatch = responseText.match(/(\d+\.\d+)[,\s]+(-?\d+\.\d+)/);
    if (coordMatch) {
      return {
        coordinates: {
          lat: parseFloat(coordMatch[1]),
          lng: parseFloat(coordMatch[2])
        },
        description: responseText.replace(coordMatch[0], '').trim()
      };
    }
    
    return { description: "Could not parse location from response" };
  } catch (error) {
    console.error('Error parsing response:', error);
    return { description: "Error parsing location data" };
  }
}

function updateMapIframe(lat, lng, zoomLevel) {
  const mapIframe = document.getElementById('map-iframe');
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${lat},${lng}&zoom=${zoomLevel}`;
  mapIframe.src = mapUrl;
}

function updateZoomLevel(zoomLevel) {
  chrome.storage.local.set({ zoomLevel: zoomLevel }, () => {
    // Update map if coordinates exist
    chrome.storage.local.get(['coords'], (result) => {
      if (result.coords) {
        updateMapIframe(result.coords.lat, result.coords.lng, zoomLevel);
      }
    });
  });
} 