let zoomLevel = 9; // Declare at the top level

document.addEventListener('DOMContentLoaded', () => {
  const captureButton = document.getElementById('capture-button');
  const settingsButton = document.getElementById('settings-button');
  const backButton = document.getElementById('back-button');
  const mainPage = document.getElementById('main-page');
  const settingsPage = document.getElementById('settings-page');
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
  const resetSessionCostButton = document.getElementById('reset-session-cost');
  const advancedDropdownToggle = document.getElementById('advanced-dropdown-toggle');
  const advancedSettingsDropdown = document.getElementById('advanced-settings-dropdown');

  // Ensure main page is always shown by default
  showMainPageWithoutAnimation();

  // Load settings from storage
  chrome.storage.local.get(['openaiApiKey', 'zoomLevel', 'showCoords', 'showMap', 'darkMode', 'sessionCost'], (result) => {
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
    
    // Load session cost
    if (result.sessionCost !== undefined) {
      updateSessionCost(result.sessionCost);
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
        showStatus('API Key saved successfully!');
      });
    } else {
      showStatus('Please enter a valid API Key.');
    }
  });

  // Toggle map display
  showMapSwitch.addEventListener('change', () => {
    const showMap = showMapSwitch.checked;
    chrome.storage.local.set({ showMap: showMap }, () => {
      toggleMapVisibility(showMap);
      showStatus(showMap ? 'Map display enabled' : 'Map display disabled');
    });
  });

  // Toggle coordinates display
  showCoordsSwitch.addEventListener('change', () => {
    const showCoords = showCoordsSwitch.checked;
    chrome.storage.local.set({ showCoords: showCoords }, () => {
      toggleCoordsVisibility(showCoords);
      showStatus(showCoords ? 'Coordinates display enabled' : 'Coordinates display disabled');
    });
  });

  // Toggle dark mode
  darkModeSwitch.addEventListener('change', () => {
    const darkMode = darkModeSwitch.checked;
    chrome.storage.local.set({ darkMode: darkMode }, () => {
      toggleDarkMode(darkMode);
      showStatus(darkMode ? 'Dark mode enabled' : 'Dark mode disabled');
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
        showStatus('Please enter your OpenAI API Key.');
      }
    });
  });

  // Page navigation event listeners
  settingsButton.addEventListener('click', () => {
    showSettingsPage();
  });

  backButton.addEventListener('click', () => {
    showMainPage();
  });

  // Reset session cost button
  resetSessionCostButton.addEventListener('click', () => {
    chrome.storage.local.set({ sessionCost: 0 }, () => {
      updateSessionCost(0);
      showStatus('Session cost reset to $0.00');
    });
  });

  // Advanced Settings dropdown toggle
  advancedDropdownToggle.addEventListener('click', () => {
    const isExpanded = advancedSettingsDropdown.classList.contains('expanded');
    
    if (isExpanded) {
      advancedSettingsDropdown.classList.remove('expanded');
      advancedDropdownToggle.classList.remove('expanded');
    } else {
      advancedSettingsDropdown.classList.add('expanded');
      advancedDropdownToggle.classList.add('expanded');
    }
  });

  // Also allow clicking on the header to toggle
  document.getElementById('advanced-settings-header').addEventListener('click', (e) => {
    if (e.target !== advancedDropdownToggle) {
      advancedDropdownToggle.click();
    }
  });
});

// Page navigation functions
function showMainPage() {
  const mainPage = document.getElementById('main-page');
  const settingsPage = document.getElementById('settings-page');
  
  // Position both pages absolutely for transition
  mainPage.style.display = 'block';
  mainPage.style.position = 'absolute';
  mainPage.style.top = '0';
  mainPage.style.left = '0';
  mainPage.style.right = '0';
  mainPage.style.bottom = '0';
  mainPage.style.height = '100vh';
  mainPage.style.transform = 'translateX(-100%)';
  mainPage.style.transition = 'none';
  mainPage.style.zIndex = '2';
  mainPage.classList.add('transitioning');
  
  settingsPage.style.position = 'absolute';
  settingsPage.style.top = '0';
  settingsPage.style.left = '0';
  settingsPage.style.right = '0';
  settingsPage.style.bottom = '0';
  settingsPage.style.height = '100vh';
  settingsPage.style.zIndex = '1';
  settingsPage.classList.add('transitioning');
  
  // Force a reflow
  mainPage.offsetHeight;
  
  // Animate settings page out to the right
  settingsPage.classList.remove('active');
  settingsPage.classList.add('slide-out-right');
  
  // Start the main page animation
  mainPage.style.transition = 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)';
  mainPage.style.transform = 'translateX(0)';
  
  setTimeout(() => {
    mainPage.classList.add('active');
    mainPage.classList.remove('transitioning');
    mainPage.style.position = 'absolute';
    mainPage.style.top = '0';
    mainPage.style.left = '0';
    mainPage.style.right = '0';
    mainPage.style.bottom = '0';
    mainPage.style.minHeight = '100vh';
    mainPage.style.transform = '';
    mainPage.style.transition = '';
    mainPage.style.zIndex = '';
    
    settingsPage.classList.remove('slide-out-right', 'transitioning');
    settingsPage.style.display = 'none';
    settingsPage.style.position = '';
    settingsPage.style.top = '';
    settingsPage.style.left = '';
    settingsPage.style.right = '';
    settingsPage.style.bottom = '';
    settingsPage.style.minHeight = '';
    settingsPage.style.zIndex = '';
  }, 300);
}

function showSettingsPage() {
  const mainPage = document.getElementById('main-page');
  const settingsPage = document.getElementById('settings-page');
  
  // Position both pages absolutely for transition
  settingsPage.style.display = 'block';
  settingsPage.style.position = 'absolute';
  settingsPage.style.top = '0';
  settingsPage.style.left = '0';
  settingsPage.style.right = '0';
  settingsPage.style.bottom = '0';
  settingsPage.style.height = '100vh';
  settingsPage.style.transform = 'translateX(100%)';
  settingsPage.style.transition = 'none';
  settingsPage.style.zIndex = '2';
  settingsPage.classList.add('transitioning');
  
  mainPage.style.position = 'absolute';
  mainPage.style.top = '0';
  mainPage.style.left = '0';
  mainPage.style.right = '0';
  mainPage.style.bottom = '0';
  mainPage.style.height = '100vh';
  mainPage.style.zIndex = '1';
  mainPage.classList.add('transitioning');
  
  // Force a reflow
  settingsPage.offsetHeight;
  
  // Animate main page out to the left
  mainPage.classList.remove('active');
  mainPage.classList.add('slide-out-left');
  
  // Start the settings page animation
  settingsPage.style.transition = 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)';
  settingsPage.style.transform = 'translateX(0)';
  
  setTimeout(() => {
    settingsPage.classList.add('active');
    settingsPage.classList.remove('transitioning');
    settingsPage.style.position = 'absolute';
    settingsPage.style.top = '0';
    settingsPage.style.left = '0';
    settingsPage.style.right = '0';
    settingsPage.style.bottom = '0';
    settingsPage.style.minHeight = '100vh';
    settingsPage.style.transform = '';
    settingsPage.style.transition = '';
    settingsPage.style.zIndex = '';
    
    mainPage.classList.remove('slide-out-left', 'transitioning');
    mainPage.style.display = 'none';
    mainPage.style.position = '';
    mainPage.style.top = '';
    mainPage.style.left = '';
    mainPage.style.right = '';
    mainPage.style.bottom = '';
    mainPage.style.minHeight = '';
    mainPage.style.zIndex = '';
  }, 300);
}

function showMainPageWithoutAnimation() {
  const mainPage = document.getElementById('main-page');
  const settingsPage = document.getElementById('settings-page');

  // Ensure main page is visible and active with consistent positioning
  mainPage.classList.add('active');
  mainPage.style.position = 'absolute';
  mainPage.style.top = '0';
  mainPage.style.left = '0';
  mainPage.style.right = '0';
  mainPage.style.bottom = '0';
  mainPage.style.height = '100vh';
  mainPage.style.transform = '';
  mainPage.style.transition = '';

  // Ensure settings page is hidden
  settingsPage.classList.remove('active');
  settingsPage.classList.remove('slide-out-left');
  settingsPage.classList.remove('slide-out-right');
  settingsPage.style.display = 'none';
}

// Status display function
function showStatus(message) {
  const statusDiv = document.getElementById('status');
  if (statusDiv) {
    statusDiv.textContent = message;
    setTimeout(() => { statusDiv.textContent = ''; }, 3000);
  }
}

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
  // Show loading spinner and hide camera icon/text
  const cameraIcon = document.getElementById('camera-icon');
  const buttonText = document.getElementById('button-text');
  const loadingSpinner = document.getElementById('loading-spinner');
  
  cameraIcon.style.display = 'none';
  buttonText.style.display = 'none';
  loadingSpinner.style.display = 'block';

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
    
    // Calculate cost based on token usage
    const tokensUsed = data.usage.total_tokens;
    const costPerToken = 2.50 / 1000000; // $2.50 per 1M tokens for GPT-4o
    const analysisCost = tokensUsed * costPerToken;
    
    // Update cost display and save to storage
    updateCostDisplay(tokensUsed, analysisCost);
    
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

    // Restore original button state
    cameraIcon.style.display = 'inline';
    buttonText.style.display = 'inline';
    loadingSpinner.style.display = 'none';

  } catch (error) {
    console.error('Error:', error);
    document.getElementById('status').textContent = 'Error processing image: ' + error.message;
    
    // Restore original button state
    cameraIcon.style.display = 'inline';
    buttonText.style.display = 'inline';
    loadingSpinner.style.display = 'none';
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

function updateCostDisplay(tokensUsed, analysisCost) {
  // Update last analysis cost
  document.getElementById('tokens-used').textContent = tokensUsed.toLocaleString();
  document.getElementById('analysis-cost').textContent = `$${analysisCost.toFixed(6)}`;
  
  // Update session total
  chrome.storage.local.get(['sessionCost'], (result) => {
    const currentSessionCost = result.sessionCost || 0;
    const newSessionCost = currentSessionCost + analysisCost;
    
    chrome.storage.local.set({ sessionCost: newSessionCost }, () => {
      updateSessionCost(newSessionCost);
    });
  });
}

function updateSessionCost(sessionCost) {
  document.getElementById('session-cost').textContent = `$${sessionCost.toFixed(6)}`;
} 