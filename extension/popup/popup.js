let zoomLevel = 5; // Declare at the top level
document.addEventListener('DOMContentLoaded', () => {
  const captureButton = document.getElementById('capture-button');
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
  const openSettingsButton = document.getElementById('open-settings');
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

  // Toggle map display when switch is changed
  showMapSwitch.addEventListener('change', () => {
    const showMap = showMapSwitch.checked;
    chrome.storage.local.set({ showMap: showMap }, () => {
      toggleMapVisibility(showMap);
    });
  });

  // Toggle coordinates display when switch is changed
  showCoordsSwitch.addEventListener('change', () => {
      const showCoords = showCoordsSwitch.checked;
      chrome.storage.local.set({ showCoords: showCoords }, () => {
          toggleCoordsVisibility(showCoords);
      });
  });

  // Dark Mode switch event listener
  darkModeSwitch.addEventListener('change', () => {
      const darkMode = darkModeSwitch.checked;
      chrome.storage.local.set({ darkMode: darkMode }, () => {
          toggleDarkMode(darkMode);
      });
  });

  // Open the side panel when the Settings button is clicked
  openSettingsButton.addEventListener('click', () => {
    if (chrome.sidePanel && chrome.sidePanel.open) {
      chrome.sidePanel.open({ windowId: chrome.windows.WINDOW_ID_CURRENT });
    } else {
      // Fallback: try to open the side panel using the action
      chrome.action.openPopup();
    }
  });

  // Zoom In button event listener
  zoomInButton.addEventListener('click', () => {
      if (zoomLevel < 21) {
          zoomLevel++;
          updateZoomLevel(zoomLevel);
      }
  });

  // Zoom Out button event listener
  zoomOutButton.addEventListener('click', () => {
      if (zoomLevel > 0) {
          zoomLevel--;
          updateZoomLevel(zoomLevel);
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
});

// Function to toggle the visibility of coordinates based on the switch state
function toggleCoordsVisibility(showCoords) {
  const coordsDiv = document.getElementById('coords');
  const coordsText = document.getElementById('coords-text');
  if (showCoords) {
      coordsDiv.style.display = 'block';
      coordsText.style.display = 'inline';
  } else {
      coordsDiv.style.display = 'none';
      coordsText.style.display = 'none';
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
  const zoomInButton = document.getElementById('zoom-in');
  const zoomOutButton = document.getElementById('zoom-out');
  if (showMap) {
    mapIframe.style.display = 'block';
    zoomInButton.style.display = 'inline-block';
    zoomOutButton.style.display = 'inline-block';
  } else {
    mapIframe.style.display = 'none';
    zoomInButton.style.display = 'none';
    zoomOutButton.style.display = 'none';
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
      const messages = [
          {
              role: "user",
              content: [
                  {
                      type: "text",
                      text: "Guess this location's exact coordinates, and only output the coordinates of your best guess followed by the location's name or general regional location.  \
This is for the game geoguessr, so use all the metas that a pro would use, and answer asap! \
Your response should look something like this for example: 40.348600, -74.659300 Nassau Hall Princeton, New Jersey, United States."
                  },
                  {
                      type: "image_url",
                      image_url: {
                          url: dataUrl  // Use the base64-encoded image directly
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
          updateMapIframe(coords.lat, coords.lng, zoomLevel);
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
  const coordRegex = /(-?\d{1,3}\.\d+),\s*(-?\d{1,3}\.\d+)/;
  const match = locationText.match(coordRegex);

  if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      return { lat: lat, lng: lng };
  }
  return null;
}

function parseLocationWords(locationText) {
  const locationWords = locationText.replace(/(-?\d{1,3}\.\d+),\s*(-?\d{1,3}\.\d+)/, '').trim();
  return locationWords || null;
}
