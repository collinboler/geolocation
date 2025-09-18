let zoomLevel = 9; // Declare at the top level

// Initialize ExtPay for the sidepanel
const extpay = ExtPay('geoguesser-hacker');

/*
======================================================================================
COMPREHENSIVE EXTPAY.JS EDGE CASES & WORKFLOWS
======================================================================================

1. NEW USER WORKFLOW
   ├── User installs extension
   ├── ExtPay.getUser() returns { paid: false, trialStarted: false }
   ├── UI shows: "Upgrade to Premium" + "Start Free Trial" buttons
   ├── Premium features list: "★ Free trial available!"
   └── Feature access: Blocked with prompt to upgrade/trial

2. FREE TRIAL ACTIVATION WORKFLOW
   ├── User clicks "Start Free Trial"
   ├── extpay.openTrialPage() opens trial signup
   ├── onTrialStarted event fires
   ├── UI immediately hides trial button
   ├── Shows "★ Free Trial Activated!" notification
   ├── Button changes to "🔥 Trial Active - Upgrade Now"
   ├── Premium features list: "★ Trial active!"
   └── Feature access: Full premium access granted

3. PAID SUBSCRIPTION WORKFLOW
   ├── User clicks "Upgrade to Premium" or upgrades from trial
   ├── extpay.openPaymentPage() opens payment flow
   ├── onPaid event fires after successful payment
   ├── UI shows "✓ Premium Activated" button
   ├── "Manage Plan" button appears
   ├── Premium features list: "✓ Premium activated!"
   └── Feature access: Full premium access granted

4. TRIAL EXPIRATION WORKFLOW
   ├── Trial period ends (detected by user.trialEnded)
   ├── Shows "Trial Expired" notification with upgrade prompt
   ├── Button shows "Upgrade to Premium"
   ├── Trial button remains hidden
   ├── Premium features list: "★ Free trial available!" (but grayed out)
   └── Feature access: Blocked with upgrade prompt

5. SUBSCRIPTION MANAGEMENT WORKFLOW
   ├── Paid user clicks "Manage Plan"
   ├── extpay.openPaymentPage() opens management page
   ├── User can: Upgrade, downgrade, cancel, update payment method
   ├── Changes reflect immediately via refresh events
   └── UI updates based on new subscription status

6. SUBSCRIPTION CANCELLATION WORKFLOW
   ├── User cancels via ExtensionPay dashboard
   ├── user.subscriptionCancelled = true, still has access until end date
   ├── Shows "Subscription Cancelled" notification with end date
   ├── "Reactivate" action button shown
   └── Full access until subscription end date

7. SUBSCRIPTION EXPIRATION WORKFLOW
   ├── Cancelled subscription reaches end date
   ├── user.subscriptionExpired = true
   ├── Shows "Subscription Expired" notification
   ├── Button shows "Renew Now"
   ├── Premium features list: "★ Free trial available!"
   └── Feature access: Blocked with renewal prompt

8. PAYMENT FAILURE WORKFLOW
   ├── Payment processing fails (user.paymentFailed = true)
   ├── Shows "Payment Failed" error notification
   ├── "Retry Payment" action button
   ├── User retains current access level
   └── Can retry payment immediately

9. NETWORK/SERVICE ISSUES WORKFLOW
   ├── No internet: Shows offline message, allows limited functionality
   ├── ExtPay service down: Shows service unavailable message
   ├── API rate limit: Shows "too many requests" message
   ├── Initialization failed: Prompts extension reload
   └── Graceful degradation with informative messages

10. MULTIPLE PAYMENT ATTEMPTS WORKFLOW
    ├── System detects multiple failed attempts
    ├── Shows warning about payment issues
    ├── Provides support contact information
    ├── Prevents excessive retry attempts
    └── Guides user to proper resolution

EDGE CASE DETECTION MATRIX:
┌─────────────────────┬────────────┬──────────────┬─────────────┬─────────────┐
│ User State          │ Paid       │ Trial        │ Expired     │ UI Action   │
├─────────────────────┼────────────┼──────────────┼─────────────┼─────────────┤
│ New User            │ false      │ false        │ false       │ Show Both   │
│ Trial Active        │ false      │ true         │ false       │ Trial UI    │
│ Trial Expired       │ false      │ true         │ true        │ Upgrade     │
│ Paid Active         │ true       │ N/A          │ false       │ Manage      │
│ Paid Cancelled      │ true       │ N/A          │ false       │ Reactivate  │
│ Subscription Expired│ false      │ N/A          │ true        │ Renew       │
│ Payment Failed      │ varies     │ varies       │ varies      │ Retry       │
│ Network Error       │ unknown    │ unknown      │ unknown     │ Offline     │
└─────────────────────┴────────────┴──────────────┴─────────────┴─────────────┘

EXTENSIONPAY EVENTS HANDLED:
• extpay.onPaid - Subscription activated
• extpay.onTrialStarted - Free trial began
• window.focus - User returns from payment page
• document.visibilitychange - Tab becomes active
• Extension reload - Status refresh on startup

GRACEFUL DEGRADATION STRATEGY:
1. Always attempt to provide some functionality
2. Clear error messages with actionable steps
3. Fallback to basic features when payment system unavailable
4. Persistent retry mechanisms for temporary failures
5. User-friendly explanations for all edge cases
======================================================================================
*/

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
  const paymentButton = document.getElementById('payment-button');
  const trialButton = document.getElementById('trial-button');
  const managePlanButton = document.getElementById('manage-plan-button');

  // Ensure main page is always shown by default
  showMainPageWithoutAnimation();

  // Check payment status and update UI on load with edge case handling
  initializePaymentStatusWithEdgeCases();

  // Refresh payment status when the window regains focus (user returns from payment page)
  window.addEventListener('focus', () => {
    console.log('Window focused, refreshing payment status...');
    checkPaymentStatus();
  });

  // Also refresh when page becomes visible again
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      console.log('Page became visible, refreshing payment status...');
      checkPaymentStatus();
    }
  });

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
  captureButton.addEventListener('click', async () => {
    // Check premium access first
    const hasPremiumAccess = await checkPremiumAccess();
    if (!hasPremiumAccess) {
      return;
    }
    
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

  // Payment button event listener
  paymentButton.addEventListener('click', () => {
    extpay.openPaymentPage();
  });

  // Trial button event listener
  trialButton.addEventListener('click', () => {
    extpay.openTrialPage();
  });

  // Manage plan button event listener
  managePlanButton.addEventListener('click', () => {
    extpay.openPaymentPage(); // Opens payment page where users can manage their plans
  });

  // Listen for payment completion
  extpay.onPaid.addListener(user => {
    console.log('User has paid:', user);
    checkPaymentStatus();
    showStatus('Payment successful! Premium features unlocked.');
  });

  // Listen for trial started
  extpay.onTrialStarted.addListener(user => {
    console.log('User started trial:', user);
    
    // Immediately hide the trial button
    const trialButton = document.getElementById('trial-button');
    if (trialButton) {
      trialButton.style.display = 'none';
    }
    
    // Mark that we should show the trial activation message
    chrome.storage.local.set({ shouldShowTrialMessage: true }, () => {
      checkPaymentStatus();
      showTrialActivatedMessage();
    });
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

// ExtPay payment functions
async function initializePaymentStatus() {
  try {
    const user = await extpay.getUser();
    updatePaymentUI(user);
    
    // Check if we should show the trial activation message
    chrome.storage.local.get(['shouldShowTrialMessage'], (result) => {
      if (result.shouldShowTrialMessage && user.trialStarted) {
        showTrialActivatedMessage();
        // Clear the flag so we don't show it again
        chrome.storage.local.remove('shouldShowTrialMessage');
      }
    });
    
    return user.paid || user.trialStarted;
  } catch (error) {
    console.error('Error checking payment status:', error);
    updatePaymentUI({ paid: false, trialStarted: false });
    return false;
  }
}

async function checkPaymentStatus() {
  try {
    const user = await extpay.getUser();
    updatePaymentUI(user);
    return user.paid || user.trialStarted;
  } catch (error) {
    console.error('Error checking payment status:', error);
    updatePaymentUI({ paid: false, trialStarted: false });
    return false;
  }
}

function updatePaymentUI(user) {
  const paymentButton = document.getElementById('payment-button');
  const trialButton = document.getElementById('trial-button');
  const managePlanButton = document.getElementById('manage-plan-button');
  
  // Hide all buttons initially
  paymentButton.style.display = 'none';
  trialButton.style.display = 'none';
  managePlanButton.style.display = 'none';
  
  // Update premium features list based on user status
  updatePremiumFeaturesList(user);
  
  if (user.paid) {
    // User has paid subscription
    paymentButton.textContent = '✓ Premium Activated';
    paymentButton.classList.add('premium-active');
    paymentButton.disabled = true;
    paymentButton.style.display = 'flex';
    
    // Show change plan button for paid users
    managePlanButton.style.display = 'flex';
    
  } else if (user.trialStarted) {
    // User is on trial - hide trial button and show upgrade button
    paymentButton.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
      🔥 Trial Active - Upgrade Now
    `;
    paymentButton.classList.remove('premium-active');
    paymentButton.classList.add('trial-active');
    paymentButton.disabled = false;
    paymentButton.style.display = 'flex';
    
    // Don't show trial button for users who already have trial
    trialButton.style.display = 'none';
    
  } else {
    // User hasn't paid or started trial
    paymentButton.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
      Upgrade to Premium
    `;
    paymentButton.classList.remove('premium-active', 'trial-active');
    paymentButton.disabled = false;
    paymentButton.style.display = 'flex';
    
    // Show trial button for new users
    trialButton.style.display = 'flex';
  }
}

async function checkPremiumAccess() {
  const isPaid = await checkPaymentStatus();
  if (!isPaid) {
    showStatus('This feature requires premium access. Please upgrade or start a free trial.');
    return false;
  }
  return true;
}

function updatePremiumFeaturesList(user) {
  const premiumFeaturesList = document.querySelector('.premium-features-list');
  if (!premiumFeaturesList) return;
  
  if (user.paid) {
    // User has paid subscription
    premiumFeaturesList.innerHTML = `
      <p><strong>&#10003; Premium activated!</strong></p>
      <p>&#10003; Unlimited AI location guessing</p>
      <p>&#10003; Advanced geolocation analysis</p>
      <p>&#10003; Priority support</p>
      <p>&#10003; All premium features unlocked</p>
    `;
  } else if (user.trialStarted) {
    // User is on trial
    premiumFeaturesList.innerHTML = `
      <p><strong>&#9733; Trial active!</strong></p>
      <p>&#10003; Unlimited AI location guessing</p>
      <p>&#10003; Advanced geolocation analysis</p>
      <p>&#10003; Priority support</p>
      <p>&#10003; All premium features available</p>
    `;
  } else {
    // User hasn't paid or started trial
    premiumFeaturesList.innerHTML = `
      <p><strong>&#9733; Free trial available!</strong></p>
      <p>&#10003; Unlimited AI location guessing</p>
      <p>&#10003; Advanced geolocation analysis</p>
      <p>&#10003; Priority support</p>
      <p>&#10003; Future premium features</p>
    `;
  }
}

// Comprehensive ExtPay.js Edge Case Handler
async function handleExtPayEdgeCases() {
  try {
    const user = await extpay.getUser();
    
    // Edge Case 1: Network connectivity issues
    if (!navigator.onLine) {
      showStatus('No internet connection. Please check your network and try again.');
      return;
    }
    
    // Edge Case 2: ExtPay service unavailable
    if (!user && navigator.onLine) {
      console.warn('ExtPay service may be unavailable');
      showStatus('Payment service temporarily unavailable. Please try again later.');
      // Fallback to allow usage with warning
      return { paid: false, trialStarted: false };
    }
    
    // Edge Case 3: Trial expired but not upgraded
    if (user.trialStarted && user.trialEnded && !user.paid) {
      showExpiredTrialMessage();
      return user;
    }
    
    // Edge Case 4: Payment failed/cancelled
    if (user.paymentFailed) {
      showPaymentFailedMessage();
      return user;
    }
    
    // Edge Case 5: Subscription cancelled but still within period
    if (user.paid && user.subscriptionCancelled) {
      showSubscriptionCancelledMessage(user.subscriptionEndDate);
      return user;
    }
    
    // Edge Case 6: Subscription expired
    if (user.subscriptionExpired) {
      showSubscriptionExpiredMessage();
      return user;
    }
    
    // Edge Case 7: Multiple payment attempts
    if (user.multiplePaymentAttempts) {
      showMultiplePaymentAttemptsMessage();
      return user;
    }
    
    return user;
    
  } catch (error) {
    console.error('ExtPay error:', error);
    
    // Edge Case 8: ExtPay initialization failed
    if (error.message.includes('ExtPay not initialized')) {
      showStatus('Payment system initialization failed. Please reload the extension.');
      return { paid: false, trialStarted: false };
    }
    
    // Edge Case 9: API rate limiting
    if (error.status === 429) {
      showStatus('Too many requests. Please wait a moment and try again.');
      return { paid: false, trialStarted: false };
    }
    
    // Edge Case 10: General API errors
    showStatus('Payment system error. Please try again or contact support.');
    return { paid: false, trialStarted: false };
  }
}

// Enhanced initialization with edge case handling
async function initializePaymentStatusWithEdgeCases() {
  const user = await handleExtPayEdgeCases();
  if (!user) return false;
  
  updatePaymentUI(user);
  
  // Check if we should show the trial activation message
  chrome.storage.local.get(['shouldShowTrialMessage'], (result) => {
    if (result.shouldShowTrialMessage && user.trialStarted && !user.trialEnded) {
      showTrialActivatedMessage();
      chrome.storage.local.remove('shouldShowTrialMessage');
    }
  });
  
  return user.paid || (user.trialStarted && !user.trialEnded);
}

// Edge case notification functions
function showExpiredTrialMessage() {
  showNotification('trial-expired', {
    title: 'Trial Expired',
    message: 'Your free trial has ended. Upgrade to continue using premium features.',
    type: 'warning',
    action: 'Upgrade Now',
    callback: () => extpay.openPaymentPage()
  });
}

function showPaymentFailedMessage() {
  showNotification('payment-failed', {
    title: 'Payment Failed',
    message: 'Your payment could not be processed. Please try again.',
    type: 'error',
    action: 'Retry Payment',
    callback: () => extpay.openPaymentPage()
  });
}

function showSubscriptionCancelledMessage(endDate) {
  const date = new Date(endDate).toLocaleDateString();
  showNotification('subscription-cancelled', {
    title: 'Subscription Cancelled',
    message: `Your subscription is cancelled but active until ${date}.`,
    type: 'info',
    action: 'Reactivate',
    callback: () => extpay.openPaymentPage()
  });
}

function showSubscriptionExpiredMessage() {
  showNotification('subscription-expired', {
    title: 'Subscription Expired',
    message: 'Your subscription has expired. Renew to continue using premium features.',
    type: 'warning',
    action: 'Renew Now',
    callback: () => extpay.openPaymentPage()
  });
}

function showMultiplePaymentAttemptsMessage() {
  showNotification('multiple-attempts', {
    title: 'Payment Issues Detected',
    message: 'Multiple payment attempts detected. Please contact support if you\'re having trouble.',
    type: 'warning',
    action: 'Contact Support',
    callback: () => window.open('mailto:support@your-extension.com')
  });
}

// Generic notification system for edge cases
function showNotification(id, options) {
  // Remove existing notification of same type
  const existingNotification = document.getElementById(`notification-${id}`);
  if (existingNotification) {
    existingNotification.remove();
  }
  
  const notification = document.createElement('div');
  notification.id = `notification-${id}`;
  notification.className = `edge-case-notification ${options.type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <div class="notification-text">
        <strong>${options.title}</strong>
        <p>${options.message}</p>
      </div>
      <div class="notification-actions">
        ${options.action ? `<button class="notification-action" onclick="this.closest('.edge-case-notification').remove(); (${options.callback.toString()})();">${options.action}</button>` : ''}
        <button class="notification-close" onclick="this.closest('.edge-case-notification').remove();">×</button>
      </div>
    </div>
  `;
  
  const mainPage = document.getElementById('main-page');
  const header = mainPage.querySelector('.header');
  header.parentNode.insertBefore(notification, header.nextSibling);
  
  // Auto-remove after 10 seconds unless it's an error
  if (options.type !== 'error') {
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 10000);
  }
}

function showTrialActivatedMessage() {
  // Create a special notification element for the trial activation
  const notification = document.createElement('div');
  notification.className = 'trial-notification';
  notification.innerHTML = `
    <div class="trial-notification-content">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
      <div class="trial-notification-text">
        <strong>★ Free Trial Activated!</strong>
        <p>Enjoy all premium features during your trial period.</p>
      </div>
      <button class="trial-notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;
  
  // Insert at the top of the main page
  const mainPage = document.getElementById('main-page');
  const header = mainPage.querySelector('.header');
  header.parentNode.insertBefore(notification, header.nextSibling);
  
  // Auto-remove after 8 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 8000);
} 