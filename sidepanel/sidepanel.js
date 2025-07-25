let zoomLevel = 9; // Declare at the top level

document.addEventListener('DOMContentLoaded', () => {
  const captureButton = document.getElementById('capture-button');
  const settingsButton = document.getElementById('settings-button');
  const backButton = document.getElementById('back-button');
  const mainPage = document.getElementById('main-page');
  const settingsPage = document.getElementById('settings-page');

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
  chrome.storage.local.get(['zoomLevel', 'showCoords', 'showMap', 'darkMode', 'sessionCost'], (result) => {
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
    // Check if user is signed in
    if (!currentUser) {
      showStatus('Please sign in to use the analysis feature.');
      return;
    }
    
    chrome.storage.local.get(['userStatus'], (result) => {
      // Check rate limiting
      if (result.userStatus && !checkRateLimit(result.userStatus)) {
        showUpgradePrompt();
        return;
      }
      
      captureScreen(); // No API key needed anymore
    });
  });

  // Page navigation event listeners
  settingsButton.addEventListener('click', () => {
    showSettingsPage();
  });

  backButton.addEventListener('click', () => {
    showMainPage();
  });

  // Upgrade page navigation
  const upgradeButton = document.getElementById('upgrade-button');
  const backToSettingsButton = document.getElementById('back-to-settings-button');
  
  if (upgradeButton) {
    upgradeButton.addEventListener('click', () => {
      showUpgradePage();
    });
  }
  
  if (backToSettingsButton) {
    backToSettingsButton.addEventListener('click', () => {
      showSettingsPage();
    });
  }

  // Plan selection buttons
  const planButtons = document.querySelectorAll('.plan-button[data-plan]');
  planButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const plan = e.target.getAttribute('data-plan');
      if (plan && currentUser) {
        initiateUpgrade(plan);
      }
    });
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

  // Initialize authentication
  initAuth();
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
  const upgradePage = document.getElementById('upgrade-page');
  
  // Hide upgrade page if it's currently visible
  upgradePage.classList.remove('active');
  upgradePage.style.display = 'none';
  
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
  
  // Animate main page out to the left (or upgrade page if coming from there)
  const currentlyActive = upgradePage.classList.contains('active') ? upgradePage : mainPage;
  currentlyActive.classList.remove('active');
  currentlyActive.classList.add('slide-out-left');
  
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
  const upgradePage = document.getElementById('upgrade-page');

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

  // Ensure other pages are hidden
  settingsPage.classList.remove('active');
  settingsPage.classList.remove('slide-out-left');
  settingsPage.classList.remove('slide-out-right');
  settingsPage.style.display = 'none';

  upgradePage.classList.remove('active');
  upgradePage.style.display = 'none';
}

function showUpgradePage() {
  const settingsPage = document.getElementById('settings-page');
  const upgradePage = document.getElementById('upgrade-page');
  
  // Update plan cards based on current user status
  updatePlanCards();
  
  // Position both pages absolutely for transition
  upgradePage.style.display = 'block';
  upgradePage.style.position = 'absolute';
  upgradePage.style.top = '0';
  upgradePage.style.left = '0';
  upgradePage.style.right = '0';
  upgradePage.style.bottom = '0';
  upgradePage.style.height = '100vh';
  upgradePage.style.transform = 'translateX(100%)';
  upgradePage.style.transition = 'none';
  upgradePage.style.zIndex = '2';
  upgradePage.classList.add('transitioning');
  
  settingsPage.style.position = 'absolute';
  settingsPage.style.top = '0';
  settingsPage.style.left = '0';
  settingsPage.style.right = '0';
  settingsPage.style.bottom = '0';
  settingsPage.style.height = '100vh';
  settingsPage.style.zIndex = '1';
  settingsPage.classList.add('transitioning');
  
  // Force a reflow
  upgradePage.offsetHeight;
  
  // Animate settings page out to the left
  settingsPage.classList.remove('active');
  settingsPage.classList.add('slide-out-left');
  
  // Start the upgrade page animation
  upgradePage.style.transition = 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)';
  upgradePage.style.transform = 'translateX(0)';
  
  setTimeout(() => {
    upgradePage.classList.add('active');
    upgradePage.classList.remove('transitioning');
    upgradePage.style.position = 'absolute';
    upgradePage.style.top = '0';
    upgradePage.style.left = '0';
    upgradePage.style.right = '0';
    upgradePage.style.bottom = '0';
    upgradePage.style.minHeight = '100vh';
    upgradePage.style.transform = '';
    upgradePage.style.transition = '';
    upgradePage.style.zIndex = '';
    
    settingsPage.classList.remove('slide-out-left', 'transitioning');
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

async function tryCaptureMethods() {
  try {
    // Method 1: Try getting stream ID from background script
    console.log('Requesting stream ID from background script...');
    const response = await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        { type: 'CAPTURE_TAB' },
        response => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else if (response && response.error) {
            reject(new Error(response.error));
          } else if (response && response.streamId) {
            resolve(response);
          } else {
            reject(new Error('No stream ID received'));
          }
        }
      );
    });

    if (response.streamId) {
      console.log('Got stream ID, getting user media...');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'tab',
            chromeMediaSourceId: response.streamId
          }
        }
      });

      if (stream) {
        console.log('Got media stream, capturing frame...');
        const frame = await captureVideoFrame(stream);
        stream.getTracks().forEach(track => track.stop());
        return frame;
      }
    }
  } catch (error) {
    console.log('Tab capture failed:', error);
  }

  // Method 2: Desktop capture (user must select a window/screen)
  console.log('Trying desktop capture...');
  return new Promise((resolve, reject) => {
    chrome.desktopCapture.chooseDesktopMedia(['screen', 'window'], streamId => {
      if (!streamId) {
        reject(new Error('Desktop capture cancelled or failed'));
        return;
      }

      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: streamId
          }
        }
      }).then(async stream => {
        console.log('Desktop capture successful, getting video frame...');
        const frame = await captureVideoFrame(stream);
        stream.getTracks().forEach(track => track.stop());
        resolve(frame);
      }).catch(reject);
    });
  });
}

function captureVideoFrame(stream) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.srcObject = stream;
    video.onloadedmetadata = () => {
      video.play();
      video.onplaying = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0);
          
          // Get the side panel width (approximately 400px)
          const sidePanelWidth = 400;
          const cropWidth = canvas.width - sidePanelWidth;
          
          // Create a new canvas for the cropped image
          const croppedCanvas = document.createElement('canvas');
          croppedCanvas.width = cropWidth;
          croppedCanvas.height = canvas.height;
          
          // Draw only the main content area (excluding side panel)
          const croppedCtx = croppedCanvas.getContext('2d');
          croppedCtx.drawImage(canvas, sidePanelWidth, 0, cropWidth, canvas.height, 0, 0, cropWidth, canvas.height);
          
          resolve(croppedCanvas.toDataURL('image/png'));
          video.remove();
        } catch (error) {
          reject(error);
        }
      };
    };
    video.onerror = reject;
  });
}

function captureScreen() {
  // Show loading state
  const cameraIcon = document.getElementById('camera-icon');
  const buttonText = document.getElementById('button-text');
  const loadingSpinner = document.getElementById('loading-spinner');
  
  cameraIcon.style.display = 'none';
  buttonText.style.display = 'none';
  loadingSpinner.style.display = 'block';

  // Try multiple capture methods in sequence
  tryCaptureMethods()
    .then(processImage)
    .catch(error => {
      console.error('Capture failed:', error);
      showStatus('Error: ' + error.message);
      // Restore button state
      cameraIcon.style.display = 'inline';
      buttonText.style.display = 'inline';
      loadingSpinner.style.display = 'none';
    });
}

// Helper function to call Firebase Cloud Functions via HTTP
async function callFirebaseFunction(functionName, data) {
  try {
    // Get the current user's Google OAuth token
    const googleToken = await new Promise((resolve, reject) => {
      // Try non-interactive first, then interactive if needed
      chrome.identity.getAuthToken({ interactive: false }, (token) => {
        if (chrome.runtime.lastError || !token) {
          // If non-interactive fails, try interactive
          chrome.identity.getAuthToken({ interactive: true }, (interactiveToken) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else if (!interactiveToken) {
              reject(new Error('Failed to get authentication token'));
            } else {
              resolve(interactiveToken);
            }
          });
        } else {
          resolve(token);
        }
      });
    });

    // Firebase Cloud Function URLs (updated to new Cloud Run format)
    const functionUrls = {
      'getUserStatus': 'https://getuserstatus-yw2af4l42q-uc.a.run.app',
      'analyzeImage': 'https://analyzeimage-yw2af4l42q-uc.a.run.app',
      'createCheckoutSession': 'https://createcheckoutsession-yw2af4l42q-uc.a.run.app'
    };
    
    const functionUrl = functionUrls[functionName];
    if (!functionUrl) {
      throw new Error(`Unknown function: ${functionName}`);
    }
    
    // Call Firebase Cloud Function via HTTP with Google OAuth token
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${googleToken}`
      },
      body: JSON.stringify({
        data: data
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result.result || result;
  } catch (error) {
    console.error('Firebase function call failed:', error);
    throw error;
  }
}

// Note: We now use Google OAuth tokens directly with Firebase Functions

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

// Google Authentication Functions
let currentUser = null;

// Initialize authentication
function initAuth() {
  const googleSigninButton = document.getElementById('google-signin-button');
  const googleSignoutButton = document.getElementById('google-signout-button');
  
  if (googleSigninButton) {
    googleSigninButton.addEventListener('click', signInWithGoogle);
  }
  
  if (googleSignoutButton) {
    googleSignoutButton.addEventListener('click', signOutFromGoogle);
  }
  
  // Check if user is already signed in
  checkAuthState();
  
  // Listen for payment success messages
  window.addEventListener('message', (event) => {
    if (event.data && event.data.source === 'stripe-redirect') {
      console.log('Received payment message:', event.data);
      
      if (event.data.type === 'STRIPE_SUCCESS') {
        // Payment successful, refresh user status
        showStatus('Payment successful! Refreshing your subscription...');
        
        // Force refresh multiple times to ensure we get the updated status
        setTimeout(async () => {
          if (currentUser && event.data.sessionId) {
            console.log('=== REFRESHING USER STATUS AFTER PAYMENT ===');
            console.log('Session ID:', event.data.sessionId);
            
            // Clear cached status first
            chrome.storage.local.remove(['userStatus']);
            
            // Refresh user status to get updated data
            await checkUserStatus();
            const result = await new Promise(resolve => {
              chrome.storage.local.get(['userStatus'], resolve);
            });
            
            if (result.userStatus) {
              updateUserStatusUI(result.userStatus);
              showStatus(`Subscription activated! You now have ${result.userStatus.subscriptionType} access.`);
            }
          }
        }, 2000);
      }
    }
  });
}

// Check current authentication state
function checkAuthState() {
  chrome.storage.local.get(['userProfile'], (result) => {
    if (result.userProfile) {
      currentUser = result.userProfile;
      updateAuthUI(true);
      // Check user's subscription status and usage
      checkUserStatus();
    } else {
      updateAuthUI(false);
    }
  });
}

// Check user status for rate limiting
async function checkUserStatus() {
  if (!currentUser) return;
  
  try {
    const userStatus = await callFirebaseFunction('getUserStatus', {
      userId: currentUser.id,
      email: currentUser.email
    });
    
    // Store user status for rate limiting
    chrome.storage.local.set({
      userStatus: userStatus
    });
    
    // Update UI based on subscription status
    updateUserStatusUI(userStatus);
    
  } catch (error) {
    console.error('Failed to check user status:', error);
  }
}

// Update plan cards based on user subscription status
function updatePlanCards() {
  chrome.storage.local.get(['userStatus'], (result) => {
    const userStatus = result.userStatus || { subscriptionType: 'free' };
    const subscriptionType = userStatus.subscriptionType || 'free';
    
    // Reset all plan cards
    const planCards = document.querySelectorAll('.plan-card');
    const planButtons = document.querySelectorAll('.plan-button');
    
    planCards.forEach(card => {
      card.classList.remove('current-plan');
    });
    
    planButtons.forEach(button => {
      button.classList.remove('current');
      button.disabled = false;
      
      const plan = button.getAttribute('data-plan');
      if (plan) {
        button.textContent = `Upgrade to ${plan === 'pro' ? 'Pro' : 'Pro+'}`;
      }
    });
    
    // Mark current plan
    if (subscriptionType === 'free') {
      const freeCard = document.getElementById('free-plan');
      const freeButton = freeCard.querySelector('.plan-button');
      freeCard.classList.add('current-plan');
      freeButton.classList.add('current');
      freeButton.disabled = true;
      freeButton.textContent = 'Current Plan';
    } else if (subscriptionType === 'pro') {
      const proCard = document.getElementById('pro-plan');
      const proButton = proCard.querySelector('.plan-button');
      proCard.classList.add('current-plan');
      proButton.classList.add('current');
      proButton.disabled = true;
      proButton.textContent = 'Current Plan';
      
      // Update Pro+ button to show as upgrade
      const proPlusButton = document.querySelector('[data-plan="pro_plus"]');
      proPlusButton.textContent = 'Upgrade to Pro+';
    } else if (subscriptionType === 'pro_plus') {
      const proPlusCard = document.getElementById('pro-plus-plan');
      const proPlusButton = proPlusCard.querySelector('.plan-button');
      proPlusCard.classList.add('current-plan');
      proPlusButton.classList.add('current');
      proPlusButton.disabled = true;
      proPlusButton.textContent = 'Current Plan';
      
      // Disable Pro button since they already have a higher tier
      const proButton = document.querySelector('[data-plan="pro"]');
      proButton.disabled = true;
      proButton.textContent = 'Downgrade (Contact Support)';
    }
  });
}

// Initiate upgrade process
async function initiateUpgrade(plan) {
  if (!currentUser) {
    showStatus('Please sign in to upgrade your plan.');
    return;
  }
  
  try {
    showStatus('Preparing checkout...');
    
    // Call Firebase function to create Stripe checkout session
    const result = await callFirebaseFunction('createCheckoutSession', {
      userId: currentUser.id,
      email: currentUser.email,
      plan: plan
    });
    
    if (result.sessionId && result.url) {
      // Open Stripe checkout in a new tab
      chrome.tabs.create({ url: result.url });
      showStatus('Redirecting to checkout...');
    } else {
      throw new Error('Failed to create checkout session');
    }
  } catch (error) {
    console.error('Upgrade error:', error);
    showStatus('Error: ' + error.message);
  }
}

// Update UI based on user subscription status
function updateUserStatusUI(userStatus) {
  // You can add subscription status indicators here
  const accountSection = document.querySelector('.settings-section h3');
  if (userStatus.subscriptionType === 'pro_plus') {
    accountSection.innerHTML = 'Account <span style="color: #EA4335; font-size: 12px;">PRO+</span>';
  } else if (userStatus.subscriptionType === 'pro') {
    accountSection.innerHTML = 'Account <span style="color: #34A853; font-size: 12px;">PRO</span>';
  } else {
    accountSection.innerHTML = 'Account <span style="color: #9AA0A6; font-size: 12px;">FREE</span>';
  }
  
  // Update usage display
  const period = userStatus.subscriptionType === 'free' ? 'week' : 'month';
  const usage = userStatus.subscriptionType === 'free' ? userStatus.weeklyUsage : userStatus.monthlyUsage;
  const remaining = userStatus.usageLimit - usage;
  console.log(`Usage: ${usage}/${userStatus.usageLimit} per ${period} (${remaining} remaining)`);
  
  // Update visual usage display
  const usageDisplay = document.getElementById('usage-display');
  const usageText = document.getElementById('usage-text');
  
  if (usageDisplay && usageText) {
    usageDisplay.style.display = 'block';
    const periodText = period === 'week' ? 'this week' : 'this month';
    usageText.textContent = `${usage}/${userStatus.usageLimit} analyses ${periodText} (${remaining} remaining)`;
    
    // Change color based on usage
    if (remaining === 0) {
      usageDisplay.style.background = 'rgba(239, 68, 68, 0.1)';
      usageDisplay.style.borderColor = 'rgba(239, 68, 68, 0.2)';
      usageText.style.color = '#EF4444';
    } else if (remaining <= Math.ceil(userStatus.usageLimit * 0.2)) {
      usageDisplay.style.background = 'rgba(245, 158, 11, 0.1)';
      usageDisplay.style.borderColor = 'rgba(245, 158, 11, 0.2)';
      usageText.style.color = '#F59E0B';
    } else {
      usageDisplay.style.background = 'rgba(52, 168, 83, 0.1)';
      usageDisplay.style.borderColor = 'rgba(52, 168, 83, 0.2)';
      usageText.style.color = '#34A853';
    }
  }
}

// Check if user has exceeded rate limits
function checkRateLimit(userStatus) {
  const now = new Date();
  const today = now.toDateString();
  
  // Free tier: 5 queries per day
  // Premium tier: unlimited
  if (userStatus.subscriptionType === 'premium') {
    return true;
  }
  
  // Check usage based on subscription type
  if (userStatus.subscriptionType === 'free') {
    return userStatus.weeklyUsage < 7; // 7 per week
  } else if (userStatus.subscriptionType === 'pro') {
    return userStatus.monthlyUsage < 300; // 300 per month
  } else { // pro_plus
    return userStatus.monthlyUsage < 1000; // 1000 per month
  }
  
  return true; // Allow if no usage data or new day
}

// Show upgrade prompt for rate limited users
function showUpgradePrompt() {
  chrome.storage.local.get(['userStatus'], (result) => {
    const userStatus = result.userStatus || {};
    let limitText = 'your usage limit';
    let upgradeText = 'Upgrade for more analyses!';
    
    if (userStatus.subscriptionType === 'free') {
      limitText = 'your weekly limit of 7 free analyses';
      upgradeText = 'Upgrade to Pro (300/month) or Pro+ (1000/month)!';
    } else if (userStatus.subscriptionType === 'pro') {
      limitText = 'your monthly limit of 300 analyses';
      upgradeText = 'Upgrade to Pro+ for 1000 analyses per month!';
    }
    
    const modal = document.createElement('div');
    modal.className = 'upgrade-modal';
    modal.innerHTML = `
      <div class="upgrade-modal-content">
        <h3>Usage Limit Reached</h3>
        <p>You've reached ${limitText}.</p>
        <p>${upgradeText}</p>
        <div class="upgrade-buttons">
          <button id="upgrade-btn" class="upgrade-btn">View Plans</button>
          <button id="close-modal-btn" class="close-modal-btn">Maybe Later</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('upgrade-btn').addEventListener('click', () => {
      // TODO: Open Stripe checkout or your payment page
      chrome.tabs.create({ url: 'https://your-website.com/upgrade' });
      modal.remove();
    });
    
    document.getElementById('close-modal-btn').addEventListener('click', () => {
      modal.remove();
    });
  });
}

// Track usage after successful API call
async function trackUsage() {
  if (!currentUser) return;
  
  try {
    // TODO: Replace with your Firebase Cloud Function URL
    await fetch('https://your-project.cloudfunctions.net/trackUsage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: currentUser.id,
        timestamp: new Date().toISOString(),
        action: 'analysis'
      })
    });
    
    // Refresh user status
    checkUserStatus();
  } catch (error) {
    console.error('Failed to track usage:', error);
  }
}

// Sign in with Google using Chrome's built-in identity API
function signInWithGoogle() {
  chrome.identity.getAuthToken({ interactive: true }, async function(token) {
    if (chrome.runtime.lastError || !token) {
      console.error(chrome.runtime.lastError);
      showStatus('Authentication failed. Please try again.');
      return;
    }

    try {
      // Get user profile information using userinfo API (consistent with Firebase functions)
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get user profile');
      }

      const userProfile = await response.json();
      
      // Store user data (using same format as Firebase functions)
      currentUser = {
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
        picture: userProfile.picture
      };
      
      chrome.storage.local.set({
        userProfile: currentUser
      }, () => {
        updateAuthUI(true);
        showStatus('Successfully signed in with Google!');
      });
      
    } catch (error) {
      console.error('Profile fetch error:', error);
      showStatus('Failed to get user profile.');
    }
  });
}

// Sign out from Google
function signOutFromGoogle() {
  // Get the token and revoke access
  chrome.identity.getAuthToken({ interactive: false }, function(token) {
    if (token) {
      // Revoke token
      fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`);
      // Remove token from Chrome's cache
      chrome.identity.removeCachedAuthToken({ token: token });
    }
    
    // Clear stored user data
    chrome.storage.local.remove(['userProfile'], () => {
      currentUser = null;
      updateAuthUI(false);
      showStatus('Successfully signed out.');
    });
  });
}

// Update authentication UI
function updateAuthUI(isSignedIn) {
  const notSignedInDiv = document.getElementById('not-signed-in');
  const signedInDiv = document.getElementById('signed-in');
  const userNameDiv = document.getElementById('user-name');
  const userEmailDiv = document.getElementById('user-email');
  const userAvatarImg = document.getElementById('user-avatar');
  
  if (isSignedIn && currentUser) {
    notSignedInDiv.style.display = 'none';
    signedInDiv.style.display = 'flex';
    
    userNameDiv.textContent = currentUser.name;
    userEmailDiv.textContent = currentUser.email;
    userAvatarImg.src = currentUser.picture;
  } else {
    notSignedInDiv.style.display = 'flex';
    signedInDiv.style.display = 'none';
  }
} 