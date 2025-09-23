let zoomLevel = 9; // Declare at the top level

// Initialize ExtPay for the sidepanel
const extpay = ExtPay('geoguesser-hacker');

// ========================================
// EXTPAY EVENT LISTENERS FOR AUTOMATIC UI UPDATES
// ========================================

// Automatic refresh when user completes payment
extpay.onPaid.addListener(async (user) => {
  try {
    // Show immediate feedback
    showStatus('Payment successful! Activating Pro features...');
    
    // Sync to Firebase
    await syncSubscriptionToFirebase(user);
    
    // Comprehensive UI refresh
    await checkPaymentStatus();
    
    // Trigger custom event for other listeners
    window.dispatchEvent(new CustomEvent('extpay-state-changed', { 
      detail: { action: 'payment-completed', user: user }
    }));
    
    showStatus('Pro features activated! 🚀');
  } catch (error) {
    console.error('Error handling onPaid event:', error);
    showStatus('Payment successful! Please refresh if UI doesn\'t update.');
  }
});

// Automatic refresh when user starts trial
extpay.onTrialStarted.addListener(async (user) => {
  try {
    // Show immediate feedback
    showStatus('Free trial activated! You now have access to free guesses.');
    
    // Sync to Firebase
    await syncSubscriptionToFirebase(user);
    
    // Comprehensive UI refresh
    await checkPaymentStatus();
    
    // Trigger custom event for other listeners
    window.dispatchEvent(new CustomEvent('extpay-state-changed', { 
      detail: { action: 'trial-started', user: user }
    }));
    
    // Show trial activation message
    chrome.storage.local.set({ shouldShowTrialMessage: true });
    showTrialActivatedMessage();
  } catch (error) {
    console.error('Error handling onTrialStarted event:', error);
    showStatus('Trial activated! Please refresh if UI doesn\'t update.');
  }
});

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
  const statusDiv = document.getElementById('status');
  const locationWordsDiv = document.getElementById('location-words');
  const coordsDiv = document.getElementById('coords');
  const mapIframe = document.getElementById('map-iframe');
  const zoomInButton = document.getElementById('zoom-in');
  const zoomOutButton = document.getElementById('zoom-out');
  const paymentButton = document.getElementById('payment-button');
  const signInButton = document.getElementById('signin-button');
  const managePlanButton = document.getElementById('manage-plan-button');

  // Ensure main page is always shown by default
  showMainPageWithoutAnimation();

  // Check payment status and update UI on load with edge case handling
  initializePaymentStatusWithEdgeCases();
  
  // Initialize user in Firebase - only on settings page or when needed
  if (document.getElementById('settings-page')) {
    initializeFirebaseUser();
  }

  // Enhanced state management system
  let lastFocusRefresh = 0;
  let lastVisibilityRefresh = 0;
  let isRefreshing = false;

  // Centralized refresh function to prevent race conditions
  const refreshUIState = async (source = 'unknown') => {
    if (isRefreshing) {
      return;
    }
    
    try {
      isRefreshing = true;
      
      await checkPaymentStatus();
    } catch (error) {
      console.error(`❌ Error refreshing UI state (source: ${source}):`, error);
    } finally {
      isRefreshing = false;
    }
  };

  // Refresh when window regains focus (user returns from payment/ExtPay pages)
  window.addEventListener('focus', async () => {
    const now = Date.now();
    // Reduce throttle time to 10 seconds for better responsiveness
    if (now - lastFocusRefresh < 10000) return;
    
    lastFocusRefresh = now;
    await refreshUIState('window-focus');
  });

  // Refresh when page becomes visible (tab switching)
  document.addEventListener('visibilitychange', async () => {
    if (!document.hidden) {
      const now = Date.now();
      // Reduce throttle time to 5 seconds for better responsiveness
      if (now - lastVisibilityRefresh < 5000) return;
      
      lastVisibilityRefresh = now;
      await refreshUIState('visibility-change');
    }
  });

  // Listen for chrome storage changes (ExtPay updates)
  if (chrome.storage && chrome.storage.onChanged) {
    chrome.storage.onChanged.addListener(async (changes, areaName) => {
      if (areaName === 'local') {
        // Look for ExtPay-related changes
        const extpayKeys = Object.keys(changes).filter(key => 
          key.includes('extpay') || 
          key.includes('payment') || 
          key.includes('subscription') ||
          key.includes('trial') ||
          key.includes('user')
        );
        
        if (extpayKeys.length > 0) {
          await refreshUIState('storage-change');
        }
      }
    });
  }

  // Listen for custom events (can be triggered by other parts of the extension)
  window.addEventListener('extpay-state-changed', async (event) => {
    await refreshUIState('custom-event');
  });

  // Listen for ExtPay popup closure (user returning from payment flow)
  let extpayWindowCheckInterval;
  const startExtPayWindowMonitoring = () => {
    extpayWindowCheckInterval = setInterval(async () => {
      // Check if user has returned from ExtPay by testing getUser response time
      try {
        const startTime = Date.now();
        const user = await extpay.getUser();
        const responseTime = Date.now() - startTime;
        
        // If getUser responds quickly and user data has changed, refresh UI
        if (responseTime < 500) { // Fast response suggests user is back
          await refreshUIState('extpay-window-return-detected');
          clearInterval(extpayWindowCheckInterval);
        }
      } catch (error) {
        // If there's an error, user might still be in ExtPay flow
      }
    }, 2000); // Check every 2 seconds
    
    // Stop monitoring after 10 minutes (payment flows shouldn't take that long)
    setTimeout(() => {
      if (extpayWindowCheckInterval) {
        clearInterval(extpayWindowCheckInterval);
      }
    }, 600000); // 10 minutes
  };

  // Start monitoring when user clicks payment buttons
  window.startExtPayWindowMonitoring = startExtPayWindowMonitoring;

  // Refresh when settings page becomes visible
  const settingsObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        if (settingsPage && settingsPage.style.display !== 'none') {
          setTimeout(() => refreshUIState('settings-visible'), 100);
        }
      }
    });
  });

  if (settingsPage) {
    settingsObserver.observe(settingsPage, { attributes: true });
  }

  // Enhanced periodic refresh system
  let periodicCheckCount = 0;
  
  // Fast periodic checks for the first 5 minutes (every 10 seconds)
  // Then slower checks (every 60 seconds) for ongoing monitoring
  const periodicCheck = async () => {
    if (!document.hidden && !isRefreshing) {
      periodicCheckCount++;
      
      // Check if this is within the first 5 minutes (30 checks * 10 seconds = 5 minutes)
      const isEarlyPeriod = periodicCheckCount <= 30;
      const checkInterval = isEarlyPeriod ? 10000 : 60000; // 10s early, 60s later
      
      await refreshUIState(`periodic-check-${isEarlyPeriod ? 'fast' : 'normal'}`);
      
      // Schedule next check
      setTimeout(periodicCheck, checkInterval);
    } else {
      // If hidden or refreshing, check again in 30 seconds
      setTimeout(periodicCheck, 30000);
    }
  };
  
  // Start the periodic checking
  setTimeout(periodicCheck, 10000); // First check after 10 seconds

  // Make refresh function globally available for manual testing/debugging
  window.refreshUIState = refreshUIState;

  // Load settings from storage
  chrome.storage.local.get(['zoomLevel'], (result) => {
    if (result.zoomLevel !== undefined) {
      zoomLevel = result.zoomLevel;
    }
  });
  
  // Always show coordinates and map - no longer user configurable
  toggleCoordsVisibility(true);
  toggleMapVisibility(true);

  // Load the last generated location words and coordinates from storage
  chrome.storage.local.get(['locationWords', 'coords'], (result) => {
    if (result.locationWords) {
      locationWordsDiv.textContent = `${result.locationWords}`;
    }
    if (result.coords) {
      coordsDiv.textContent = `${result.coords.lat}, ${result.coords.lng}`;
      updateMapIframe(result.coords.lat, result.coords.lng, zoomLevel);
    } else {
      // Default to Nassau Princeton NJ if no saved coordinates
      const defaultCoords = {
        lat: 40.348600,
        lng: -74.659300
      };
      const defaultLocation = "Nassau Hall, Princeton, New Jersey, United States";
      
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




  // Zoom controls are now handled by Google Maps iframe
  // Removed custom zoom button event listeners

  // Capture button event listener
  captureButton.addEventListener('click', async () => {
    // Check if user is signed in first
    const user = await extpay.getUser();
    const extpayUserId = user.userId || user.email || null;
    
    if (!extpayUserId || extpayUserId === 'anonymous') {
      // Show sign-in prompt for anonymous users
      showSignInPrompt();
      return;
    }
    
    // For signed-in users, check premium access and usage limits
    const hasPremiumAccess = await checkPremiumAccess();
    if (!hasPremiumAccess) {
      return;
    }
    
    // No longer need API key - using Firebase Functions
    captureScreen();
  });

  // Page navigation event listeners
  settingsButton.addEventListener('click', () => {
    showSettingsPage();
    // Initialize Firebase user when going to settings
    setTimeout(() => initializeFirebaseUser(), 300);
  });

  backButton.addEventListener('click', () => {
    showMainPage();
  });



  // Payment button event listener
  paymentButton.addEventListener('click', () => {
    // For all states (Upgrade to Pro, Manage Plan), open ExtPay page
    startExtPayWindowMonitoring();
    extpay.openPaymentPage();
  });

  // Sign-in button event listener
  signInButton.addEventListener('click', () => {
    showSignInPrompt();
  });

  // Auth buttons event listeners
  const signupSettingsButton = document.getElementById('signup-settings-button');
  const loginSettingsButton = document.getElementById('login-settings-button');

  if (signupSettingsButton) {
    signupSettingsButton.addEventListener('click', () => {
    extpay.openTrialPage();
  });
  }

  if (loginSettingsButton) {
    loginSettingsButton.addEventListener('click', () => {
      extpay.openLoginPage();
    });
  }

  // Manage plan button event listener
  managePlanButton.addEventListener('click', () => {
    extpay.openPaymentPage(); // Opens payment page where users can manage their plans
  });

  // Listen for payment completion
  extpay.onPaid.addListener(user => {
    syncSubscriptionToFirebase(user);
    setTimeout(() => checkPaymentStatus(), 1000);
    showStatus('Payment successful! Premium features unlocked.');
  });

  // Listen for trial started
  extpay.onTrialStarted.addListener(user => {
    
    // Immediately hide the sign-in button
    const signInButton = document.getElementById('signin-button');
    if (signInButton) {
      signInButton.style.display = 'none';
    }
    
    // Sync trial status to Firebase
    syncSubscriptionToFirebase(user);
    
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


// Function to toggle map visibility
function toggleMapVisibility(showMap) {
  const mapIframe = document.getElementById('map-iframe');
  if (showMap) {
    mapIframe.style.display = 'block';
  } else {
    mapIframe.style.display = 'none';
  }
}

function captureScreen() {
  showStatus('Capturing screen...');
  
  // First, let's test your theory - capture the tab and see if it includes sidebar
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    
    
    // Capture the visible tab content
    chrome.tabs.captureVisibleTab(currentTab.windowId, { format: 'png' }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        showStatus('Error capturing screen: ' + chrome.runtime.lastError.message);
        return;
      }
      
      // Get the actual sidebar width from our extension
      const sidebarContainer = document.querySelector('.sidepanel-container');
      const actualSidebarWidth = sidebarContainer ? sidebarContainer.offsetWidth : 360;
      
      // Get browser window info
      chrome.windows.get(currentTab.windowId, (window) => {
        // Get the actual tab content dimensions from the page
        chrome.scripting.executeScript({
          target: { tabId: currentTab.id },
          func: () => {
            return {
              windowWidth: window.innerWidth,
              windowHeight: window.innerHeight,
              devicePixelRatio: window.devicePixelRatio || 1,
              screenWidth: window.screen.width,
              screenHeight: window.screen.height
            };
          }
        }, (results) => {
          if (chrome.runtime.lastError || !results || !results[0] || !results[0].result) {
            console.error('Could not get page dimensions');
            return;
          }
          
          const pageInfo = results[0].result;
          
          // Let's examine what we captured vs what we expected
          const img = new Image();
          img.onload = () => {
            
            // For now, let's just use the FULL captured image without any cropping
            // This will tell us if the sidebar is included or not
            processImage(dataUrl);
          };
          img.src = dataUrl;
        });
      });
    });
  });
}

function processCapturedImage(dataUrl, windowWidth, sidebarWidth, pageInfo = null) {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Use the ACTUAL page content width if available, otherwise calculate
    const actualContentWidth = pageInfo ? pageInfo.windowWidth : (windowWidth - sidebarWidth);
    
    // Calculate scaling factor based on browser window width
    const imageToWindowRatio = img.width / windowWidth;
    const targetImageWidth = Math.round(actualContentWidth * imageToWindowRatio);
    
    // Ensure we don't exceed the captured image bounds
    const finalWidth = Math.min(targetImageWidth, img.width);
    
    
    // Let's try taking the FULL captured image width instead of calculating
    // The issue might be that we're under-calculating the target width
    const fullCapturedWidth = img.width;
    
    
    // Set canvas dimensions to the FULL captured width to test
    canvas.width = fullCapturedWidth;
    canvas.height = img.height;
    
    // Draw the ENTIRE captured image to see what we're working with
    ctx.drawImage(
      img,                    // source image
      0, 0,                   // start from left edge of captured image
      fullCapturedWidth, img.height, // take the FULL captured width
      0, 0,                   // place at canvas origin
      fullCapturedWidth, img.height  // fill the canvas with full captured image
    );
    
    // Convert to data URL and process
    const croppedDataUrl = canvas.toDataURL('image/png');
    processImage(croppedDataUrl);
  };
  
  img.src = dataUrl;
}

async function processImage(dataUrl) {
  // Show loading spinner and hide camera icon/text
  const cameraIcon = document.getElementById('camera-icon');
  const buttonText = document.getElementById('button-text');
  const loadingSpinner = document.getElementById('loading-spinner');
  
  cameraIcon.style.display = 'none';
  buttonText.style.display = 'none';
  loadingSpinner.style.display = 'block';

  try {
    // Get current user from ExtPay
    const user = await extpay.getUser();
    const extpayUserId = user.userId || user.email || null;
    
    // Check if user is signed in - if not, prompt for sign-in
    if (!extpayUserId || extpayUserId === 'anonymous') {
      // Restore button state first
      cameraIcon.style.display = 'inline';
      buttonText.style.display = 'inline';
      loadingSpinner.style.display = 'none';
      
      // Show sign-in prompt
      showSignInPrompt();
      return;
    }
    
    
    // Call local StreetCLIP service instead of Firebase/OpenAI
    const localServiceUrl = 'http://localhost:8081';
    console.log('Attempting to connect to StreetCLIP service at:', localServiceUrl);
    
    let response;
    try {
      response = await fetch(`${localServiceUrl}/processGeolocation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            extpayUserId: extpayUserId,
            imageData: dataUrl
          }
        })
      });
      
      console.log('StreetCLIP response status:', response.status);
    } catch (fetchError) {
      console.error('Fetch error details:', fetchError);
      
      // Restore button state
      cameraIcon.style.display = 'inline';
      buttonText.style.display = 'inline';
      loadingSpinner.style.display = 'none';
      
      alert('Failed to connect to local StreetCLIP service. Please make sure it\'s running on port 8081.\n\nTo start the service:\n1. Open Terminal\n2. cd backend/streetclip-service\n3. ./start.sh');
      return;
    }
    

    if (!response.ok) {
      const errorData = await response.json();
      console.error('StreetCLIP service error:', errorData);
        
        // Handle 429 - Usage limit exceeded
        if (response.status === 429) {
          // Restore button state first
          cameraIcon.style.display = 'inline';
          buttonText.style.display = 'inline';
          loadingSpinner.style.display = 'none';
          
          await showUsageLimitExceededModal(errorData);
          return;
        }
        
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const result = data.result;
    
    console.log('Received result:', result);
    
    // Update usage display immediately from response (if available)
    if (result.usage) {
      updateUsageDisplay(result.usage);
    }
    
    // Also refresh usage from database after a short delay to ensure consistency
    setTimeout(async () => {
      try {
        const user = await extpay.getUser();
        const extpayUserId = user.userId || user.email || 'anonymous';
        loadUsageInformation(extpayUserId);
      } catch (error) {
        console.error('Error refreshing usage after API call:', error);
      }
    }, 1000);
    
    const locationData = {
      coordinates: result.coordinates,
      description: result.location,
      confidence: result.confidence
    };
    
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
      // Add confidence percentage to the location display
      const confidence = locationData.confidence || 0;
      const confidencePercentage = Math.round(confidence * 100);
      
      if (confidencePercentage > 0) {
        // Create styled confidence display
        const confidenceColor = confidencePercentage >= 80 ? '#4CAF50' : confidencePercentage >= 60 ? '#FF9800' : '#FF5722';
        const confidenceHTML = `
          ${locationData.description}
          <span style="color: ${confidenceColor}; font-weight: 600; margin-left: 8px;">
            ${confidencePercentage}% confidence
          </span>
        `;
        document.getElementById('location-words').innerHTML = confidenceHTML;
      } else {
        document.getElementById('location-words').textContent = locationData.description;
      }
    }

    // Restore original button state
    cameraIcon.style.display = 'inline';
    buttonText.style.display = 'inline';
    loadingSpinner.style.display = 'none';

  } catch (error) {
    console.error('Error:', error);
    
    // Handle specific error types
    
    if (error.message.includes('Free limit reached')) {
      // Show upgrade popup for free users who exceeded limit
      showUsageLimitPopup(error.message);
    } else if (error.message.includes('resource-exhausted') || error.message.includes('Usage limit exceeded')) {
      // General usage limit reached
      showStatus('Usage limit reached. Please upgrade your plan or wait for reset.');
    } else if (error.message.includes('permission-denied')) {
      showStatus('Subscription required. Please upgrade to continue.');
    } else if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
      // Handle rate limiting
      showStatus('Too many requests. Please wait a moment and try again.');
    } else {
      showStatus('Error processing image: ' + error.message);
    }
    
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


// Firebase user initialization
async function initializeFirebaseUser() {
  try {
    // Wait a bit for DOM to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = await extpay.getUser();
    const extpayUserId = user.userId || user.email || 'anonymous';
    
    // Create/update user in Firebase
    const response = await fetch('https://us-central1-geoguesser-hacker-ext.cloudfunctions.net/createUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          extpayUserId: extpayUserId,
          email: user.email
        }
      })
    });
    
    if (response.ok) {
      // Load usage information with a small delay
      setTimeout(() => loadUsageInformation(extpayUserId), 500);
    } else {
      const errorData = await response.json();
      console.error('Firebase user initialization failed:', errorData);
    }
  } catch (error) {
    console.error('Error initializing Firebase user:', error);
  }
}

// Load and display usage information
async function loadUsageInformation(extpayUserId) {
  try {
    const response = await fetch('https://us-central1-geoguesser-hacker-ext.cloudfunctions.net/getUserUsage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: { extpayUserId }
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      
      // Store backend flags globally for UI updates
      window.backendSubscriptionFlags = {
        isCancelled: data.result.isCancelled,
        isPastDue: data.result.isPastDue,
        subscriptionType: data.result.subscriptionType,
        subscriptionStatus: data.result.subscriptionStatus
      };
      
      updateUsageDisplay(data.result);
      
      // Update UI with backend subscription flags
      try {
        const user = await extpay.getUser();
        updatePaymentUI(user);
        updateUpgradeCardHeader(user);
      } catch (error) {
        console.error('Error updating UI with backend flags:', error);
      }
    } else {
      console.error('Failed to load usage information:', response.status);
    }
  } catch (error) {
    console.error('Error loading usage information:', error);
  }
}

// Update usage display in UI
async function updateUsageDisplay(usage) {
  
  // Check if user is authenticated (has trial or paid subscription)
  try {
    const user = await extpay.getUser();
    // Check if user is authenticated (includes past_due and canceled users)
    const isAuthenticated = user.paid || user.trialStartedAt;
    
    // Find existing usage section
  let usageSection = document.getElementById('usage-section');
  
    if (!isAuthenticated) {
      // Hide usage section for unauthenticated users
      if (usageSection) {
        usageSection.style.display = 'none';
      }
      return;
    }
    
    // Show usage section for authenticated users
  if (!usageSection) {
    // Create the usage section
    usageSection = document.createElement('div');
    usageSection.id = 'usage-section';
    usageSection.className = 'settings-section';
    usageSection.innerHTML = `
      <h3>Usage Statistics</h3>
      <div class="usage-info">
        <div class="usage-item">
          <span class="usage-label">Current usage:</span>
          <span class="usage-value" id="current-usage">0</span>
        </div>
        <div class="usage-item">
          <span class="usage-label">Plan limit:</span>
          <span class="usage-value" id="usage-limit">0</span>
        </div>
        <div class="usage-item">
                  <span class="usage-label" id="reset-label">Resets on:</span>
          <span class="usage-value" id="usage-reset">-</span>
        </div>
        <div class="usage-item">
          <span class="usage-label">Plan type:</span>
          <span class="usage-value" id="plan-type">Free</span>
        </div>
      </div>
    `;
    
    // Try multiple insertion strategies
    const settingsPage = document.getElementById('settings-page');
    if (settingsPage) {
      const premiumSection = settingsPage.querySelector('.payment-section');
      if (premiumSection && premiumSection.parentNode === settingsPage) {
        // Insert before premium section if found
        settingsPage.insertBefore(usageSection, premiumSection);
      } else {
        // Fallback: append to settings page
        settingsPage.appendChild(usageSection);
      }
    } else {
      // Fallback: add to main page if settings page not found
      const mainContent = document.querySelector('.sidepanel-container');
      if (mainContent) {
        mainContent.appendChild(usageSection);
      }
    }
  }
    
    // Make sure usage section is visible for authenticated users
    if (usageSection) {
      usageSection.style.display = 'block';
  }
  
  // Update values safely
  const currentUsageEl = document.getElementById('current-usage');
  const usageLimitEl = document.getElementById('usage-limit');
  const usageResetEl = document.getElementById('usage-reset');
  const resetLabelEl = document.getElementById('reset-label');
  const planTypeEl = document.getElementById('plan-type');
  
  if (currentUsageEl) currentUsageEl.textContent = usage.current || 0;
  if (usageLimitEl) usageLimitEl.textContent = usage.limit || 3;
  
  // Update the reset label based on cancellation status
  if (resetLabelEl) {
    if (usage.isCancelled) {
      resetLabelEl.textContent = 'Expiring on:';
    } else {
      resetLabelEl.textContent = 'Resets on:';
    }
  }
  
  if (usageResetEl) {
    if (usage.resetDate) {
      // Handle Firestore timestamp format
      let date;
      if (usage.resetDate._seconds) {
        date = new Date(usage.resetDate._seconds * 1000);
      } else {
        date = new Date(usage.resetDate);
      }
      usageResetEl.textContent = date.toLocaleDateString();
    } else {
      usageResetEl.textContent = '-';
    }
  }
  if (planTypeEl) {
    planTypeEl.textContent = capitalizeFirst(usage.subscriptionType || 'free');
    }
  } catch (error) {
    console.error('Error updating usage display:', error);
    // Hide usage section on error
    const usageSection = document.getElementById('usage-section');
    if (usageSection) {
      usageSection.style.display = 'none';
    }
  }
}

// Sync subscription changes to Firebase
async function syncSubscriptionToFirebase(user) {
  try {
    
    const extpayUserId = user.userId || user.email || 'anonymous';
    let subscriptionType = 'free';
    let subscriptionStatus = 'inactive';
    
    // Check subscription status - cancelled users keep pro access until term end, past_due lose access immediately
    if (user.paid) {
      if (user.subscriptionStatus === 'past_due') {
        // User had paid subscription but payment is past due - treat as free
        subscriptionType = 'free';
        subscriptionStatus = 'past_due';
      } else {
        // User has active subscription (including cancelled but still within term)
      subscriptionType = 'pro';
        subscriptionStatus = user.subscriptionStatus || 'active';
      }
    } else if (user.trialStartedAt && !user.trialEnded) {
      subscriptionType = 'free';
      subscriptionStatus = 'trial';
    }
    
    // Determine subscription status flags
    const isCancelled = user.subscriptionStatus === 'canceled';
    const isPastDue = user.subscriptionStatus === 'past_due';
    
    
    const response = await fetch('https://us-central1-geoguesser-hacker-ext.cloudfunctions.net/updateSubscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          extpayUserId,
          subscriptionStatus,
          subscriptionType,
          isCancelled,
          isPastDue
        }
      })
    });
    
    if (response.ok) {
      // Force refresh usage information
      setTimeout(() => loadUsageInformation(extpayUserId), 1000);
    } else {
      const errorData = await response.json();
      console.error('Failed to sync subscription:', errorData);
    }
  } catch (error) {
    console.error('Error syncing subscription to Firebase:', error);
  }
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Manual sync function for testing (callable from console)
window.debugExtPay = async function() {
  try {
    const user = await extpay.getUser();
    await syncSubscriptionToFirebase(user);
    await checkPaymentStatus();
    return user;
  } catch (error) {
    console.error('Debug ExtPay error:', error);
    return null;
  }
};

// ExtPay payment functions
async function initializePaymentStatus() {
  try {
    const user = await extpay.getUser();
    updatePaymentUI(user);
    
    // Check if we should show the trial activation message
    chrome.storage.local.get(['shouldShowTrialMessage'], (result) => {
      if (result.shouldShowTrialMessage && user.trialStartedAt) {
        showTrialActivatedMessage();
        // Clear the flag so we don't show it again
        chrome.storage.local.remove('shouldShowTrialMessage');
      }
    });
    
    // Check if user has active subscription or trial
    const isSubscriptionActive = user.paid && 
      (!user.subscriptionStatus || 
       (user.subscriptionStatus !== 'past_due' && user.subscriptionStatus !== 'canceled'));
    return isSubscriptionActive || user.trialStartedAt;
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
    // Check if user has active subscription or trial
    const isSubscriptionActive = user.paid && 
      (!user.subscriptionStatus || 
       (user.subscriptionStatus !== 'past_due' && user.subscriptionStatus !== 'canceled'));
    return isSubscriptionActive || user.trialStartedAt;
  } catch (error) {
    console.error('Error checking payment status:', error);
    updatePaymentUI({ paid: false, trialStarted: false });
    return false;
  }
}

function updatePaymentUI(user) {
  const paymentButton = document.getElementById('payment-button');
  const signInButton = document.getElementById('signin-button');
  const managePlanButton = document.getElementById('manage-plan-button');
  const authButtonsContainer = document.getElementById('auth-buttons-container');
  
  // Hide all buttons initially
  paymentButton.style.display = 'none';
  signInButton.style.display = 'none';
  managePlanButton.style.display = 'none';
  if (authButtonsContainer) authButtonsContainer.style.display = 'none';
  
  // Update premium features list based on user status
  updatePremiumFeaturesList(user);
  
  // Update upgrade card header based on user status
  updateUpgradeCardHeader(user);
  
  // Update upgrade card features based on user status
  updateUpgradeCardFeatures(user);
  
  // Check for cancelled subscription warning
  checkCancelledSubscriptionWarning(user);
  
  // Check subscription status using backend flags if available, otherwise fallback to ExtPay status
  const backendFlags = window.backendSubscriptionFlags;
  const isPastDueUser = backendFlags?.isPastDue || (user.paid && user.subscriptionStatus === 'past_due');
  const isSubscriptionActive = user.paid && !isPastDueUser;

  if (isSubscriptionActive) {
    // User has active paid subscription (including cancelled but still active) - make button clickable to manage plan
    paymentButton.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
      Manage Plan
    `;
    paymentButton.classList.add('premium-active');
    paymentButton.disabled = false;
    paymentButton.style.display = 'flex';
    
    // Hide separate manage plan button since it's now integrated
    managePlanButton.style.display = 'none';
    
  } else if (user.trialStartedAt && !user.paid) {
    // User is on trial - hide sign-in button and show upgrade button
    // Check if this is a past due user who should see "Renew Pro"
    // Only show "payment declined" if backend explicitly flags them as past due
    const shouldShowRenew = backendFlags?.isPastDue === true;
    
    paymentButton.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${shouldShowRenew ? 
          '<path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>' :
          '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>'
        }
      </svg>
      ${shouldShowRenew ? 'Renew Pro' : 'Upgrade to Pro'}
    `;
    paymentButton.classList.remove('premium-active');
    paymentButton.classList.add('trial-active');
    paymentButton.disabled = false;
    paymentButton.style.display = 'flex';
    
    // Don't show sign-in button for users who already have trial
    signInButton.style.display = 'none';
    
  } else if (isPastDueUser) {
    // User's payment is past due - treat as trial user with "Renew Pro" button
    paymentButton.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 4v6h6M23 20v-6h-6"/>
        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
      </svg>
      Renew Pro
    `;
    paymentButton.classList.remove('premium-active');
    paymentButton.classList.add('trial-active');
    paymentButton.disabled = false;
    paymentButton.style.display = 'flex';
    
    // Don't show sign-in button for authenticated users
    signInButton.style.display = 'none';
    
  } else {
    // User is not signed in - show auth buttons
    paymentButton.style.display = 'none';
    signInButton.style.display = 'none';
    if (authButtonsContainer) {
      authButtonsContainer.style.display = 'flex';
    }
  }
}

async function checkPremiumAccess() {
  try {
    const user = await extpay.getUser();
    
    // Check subscription status using backend flags if available, otherwise fallback to ExtPay status
    const backendFlags = window.backendSubscriptionFlags;
    const isPastDueUser = backendFlags?.isPastDue || (user.paid && user.subscriptionStatus === 'past_due');
    const isSubscriptionActive = user.paid && !isPastDueUser;
    
    const hasActiveTrial = user.trialStartedAt && !user.paid; // Trial active if trialStartedAt exists and not paid
    const hasAccess = isSubscriptionActive || hasActiveTrial;
    
    
    if (!hasAccess) {
      // Check if user is authenticated but just not premium
      if (user.paid || user.trialStartedAt) {
        // User is authenticated but doesn't have premium access (past_due or free trial limit reached)
        if (user.subscriptionStatus === 'past_due') {
          showStatus('Your subscription payment is past due. Please renew your subscription to continue using premium features.');
        } else {
      showStatus('This feature requires premium access. Please upgrade or start a free trial.');
        }
      } else {
        // User is not authenticated at all
        showStatus('This feature requires premium access. Please upgrade or start a free trial.');
      }
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error checking premium access:', error);
    showStatus('Error checking subscription status. Please try again.');
    return false;
  }
}

function updateUpgradeCardHeader(user) {
  const upgradeHeaderH3 = document.querySelector('.upgrade-header h3');
  const upgradeHeaderDiv = document.querySelector('.upgrade-header');
  const upgradeIcon = document.querySelector('.upgrade-icon');
  const upgradeCard = document.querySelector('.upgrade-card');
  
  if (!upgradeHeaderH3 || !upgradeHeaderDiv || !upgradeIcon || !upgradeCard) return;
  
  // Reset classes
  upgradeCard.classList.remove('pro-active', 'trial-active');
  upgradeHeaderDiv.classList.remove('pro-active');
  
  // Check subscription status using backend flags if available, otherwise fallback to ExtPay status
  const backendFlags = window.backendSubscriptionFlags;
  const isPastDueUser = backendFlags?.isPastDue || (user.paid && user.subscriptionStatus === 'past_due');
  const isCancelledUser = backendFlags?.isCancelled || (user.paid && user.subscriptionStatus === 'canceled');
  const isSubscriptionActive = user.paid && !isPastDueUser;

  if (isSubscriptionActive) {
    // User has active pro subscription (including cancelled but still within term) - show "Pro Mode Activated"
    upgradeHeaderH3.textContent = 'Pro Mode Activated';
    upgradeHeaderDiv.classList.add('pro-active');
    upgradeCard.classList.add('pro-active');
    // Remove icon for cleaner look
    upgradeIcon.innerHTML = '';
  } else if (user.trialStartedAt && !user.paid) {
    // User is on trial - check if this is a past due user who should see "Renew Pro"
    // Only show "payment declined" if backend explicitly flags them as past due
    const shouldShowRenew = backendFlags?.isPastDue === true;
    
    upgradeHeaderH3.textContent = shouldShowRenew ? 'Free Mode Activated (payment declined)' : 'Free Mode Activated';
    upgradeCard.classList.add('trial-active');
    // Remove icon for cleaner look
    upgradeIcon.innerHTML = '';
  } else if (isPastDueUser) {
    // User's payment is past due - show renewal needed
    upgradeHeaderH3.textContent = 'Payment Past Due - Renew Pro';
    upgradeCard.classList.add('trial-active');
    // Remove icon for cleaner look
    upgradeIcon.innerHTML = '';
  } else {
    // Default state - user needs to sign in
    upgradeHeaderH3.textContent = 'Sign In Required';
    // Remove icon for cleaner look
    upgradeIcon.innerHTML = '';
  }
}

function updatePremiumFeaturesList(user) {
  const premiumFeaturesList = document.querySelector('.premium-features-list');
  if (!premiumFeaturesList) return;
  
  const checkIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="color: #10b981; margin-right: 8px; vertical-align: middle;">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>`;
  
  const starIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="color: #fbbf24; margin-right: 8px; vertical-align: middle;">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>`;
  
  if (user.paid) {
    // User has paid subscription
    premiumFeaturesList.innerHTML = `
      <p><strong>${checkIcon}Premium activated!</strong></p>
      <p>${checkIcon}Unlimited AI location guessing</p>
      <p>${checkIcon}Advanced geolocation analysis</p>
      <p>${checkIcon}Priority support</p>
      <p>${checkIcon}All premium features unlocked</p>
    `;
  } else if (user.trialStartedAt) {
    // User is on trial
    premiumFeaturesList.innerHTML = `
      <p><strong>${starIcon}Trial active!</strong></p>
      <p>${checkIcon}Unlimited AI location guessing</p>
      <p>${checkIcon}Advanced geolocation analysis</p>
      <p>${checkIcon}Priority support</p>
      <p>${checkIcon}All premium features available</p>
    `;
  } else {
    // User hasn't paid or started trial
    premiumFeaturesList.innerHTML = `
      <p><strong>${starIcon}Free trial available!</strong></p>
      <p>${checkIcon}Unlimited AI location guessing</p>
      <p>${checkIcon}Advanced geolocation analysis</p>
      <p>${checkIcon}Priority support</p>
      <p>${checkIcon}Future premium features</p>
    `;
  }
}

function updateUpgradeCardFeatures(user) {
  const featureItems = document.querySelectorAll('.upgrade-features .feature-item span');
  if (featureItems.length < 3) return;
  
  // Check subscription status using backend flags if available, otherwise fallback to ExtPay status
  const backendFlags = window.backendSubscriptionFlags;
  const isPastDueUser = backendFlags?.isPastDue || (user.paid && user.subscriptionStatus === 'past_due');
  const isSubscriptionActive = user.paid && !isPastDueUser;
  
  if (isSubscriptionActive) {
    // Pro mode (including cancelled but still active) - show pro features
    featureItems[0].textContent = '1,000 Guesses each month';
    featureItems[1].textContent = 'Superior Accuracy';
    featureItems[2].textContent = 'Undetectable';
  } else {
    // Free trial mode or unauthenticated - show trial features
    featureItems[0].textContent = '3 free Guesses each week';
    featureItems[1].textContent = 'High Accuracy';
    featureItems[2].textContent = 'Undetectable';
  }
}

function checkCancelledSubscriptionWarning(user) {
  // Only show warning for paid users with canceled status (still active until term ends)
  const backendFlags = window.backendSubscriptionFlags;
  const isCancelledUser = backendFlags?.isCancelled || (user.paid && user.subscriptionStatus === 'canceled');
  const isPastDueUser = backendFlags?.isPastDue || (user.paid && user.subscriptionStatus === 'past_due');
  
  
  // Only show cancellation warning for truly cancelled users (not past due masquerading as cancelled)
  const shouldShowCancelledWarning = false; // Temporarily disable for cleaner UI
  
  if (shouldShowCancelledWarning) {
    // Check if we should show the warning (don't show it every time)
    const warningKey = `cancelled_warning_${user.email || user.userId}`;
    chrome.storage.local.get([warningKey], (result) => {
      const lastShown = result[warningKey];
      const now = Date.now();
      const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
      
      // Show warning if never shown or if shown more than 1 hour ago
      if (!lastShown || (now - lastShown) > oneHour) {
        showCancelledSubscriptionWarning(user);
        // Store when we showed the warning
        chrome.storage.local.set({ [warningKey]: now });
      }
    });
  } else {
    // Remove any existing warning if user is not in cancelled state
    removeCancelledSubscriptionWarning();
  }
}

function showCancelledSubscriptionWarning(user) {
  // Remove any existing warning first
  removeCancelledSubscriptionWarning();
  
  // Create the warning element
  const warning = document.createElement('div');
  warning.id = 'cancelled-subscription-warning';
  warning.className = 'subscription-warning cancelled-warning';
  
  // Get expiration date (this would come from ExtPay user object)
  const expirationDate = user.subscriptionEndDate || user.expirationDate;
  const dateText = expirationDate ? new Date(expirationDate).toLocaleDateString() : 'your next billing date';
  
  warning.innerHTML = `
    <div class="warning-content">
      <div class="warning-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
      <div class="warning-text">
        <h4>Subscription Cancelled</h4>
        <p>Your Pro subscription will expire on <strong>${dateText}</strong>. You can reactivate anytime to continue after expiration.</p>
      </div>
      <div class="warning-actions">
        <button class="reactivate-btn" id="reactivate-subscription-btn">Reactivate</button>
        <button class="dismiss-btn" id="dismiss-warning-btn">Dismiss</button>
      </div>
    </div>
  `;
  
  // Insert the warning at the top of the settings page
  const settingsPage = document.getElementById('settings-page');
  if (settingsPage) {
    settingsPage.insertBefore(warning, settingsPage.firstChild);
  }
  
  // Add event listeners for the buttons
  const reactivateBtn = document.getElementById('reactivate-subscription-btn');
  const dismissBtn = document.getElementById('dismiss-warning-btn');
  
  if (reactivateBtn) {
    reactivateBtn.addEventListener('click', () => {
      extpay.openPaymentPage();
    });
  }
  
  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      removeCancelledSubscriptionWarning();
    });
  }
}

function removeCancelledSubscriptionWarning() {
  const warning = document.getElementById('cancelled-subscription-warning');
  if (warning) {
    warning.remove();
  }
}

async function showUsageLimitExceededModal(errorData) {
  
  // Remove any existing modal first
  const existingModal = document.getElementById('usage-limit-modal');
  if (existingModal) {
    existingModal.remove();
  }

  // Get current user info to determine subscription type
  let user;
  try {
    user = await extpay.getUser();
  } catch (error) {
    console.error('Error getting user for usage modal:', error);
    user = { paid: false, trialStartedAt: null };
  }

  // Determine subscription type and limits
  const backendFlags = window.backendSubscriptionFlags;
  const isPastDueUser = backendFlags?.isPastDue || (user.paid && user.subscriptionStatus === 'past_due');
  const isSubscriptionActive = user.paid && !isPastDueUser;
  const isTrialUser = user.trialStartedAt && !user.paid;
  
  // Set modal content based on subscription type
  let modalTitle, limitText, resetPeriod, showUpgradeButton;
  
  if (isSubscriptionActive) {
    // Pro user
    modalTitle = "Pro Usage Limit Reached";
    limitText = "1,000 Guesses";
    resetPeriod = "monthly";
    showUpgradeButton = false;
  } else {
    // Free trial or unauthenticated user
    modalTitle = "Free Trial Limit Reached";
    limitText = "3 free guesses";
    resetPeriod = "weekly";
    showUpgradeButton = true;
  }

  // Create the modal overlay
  const modal = document.createElement('div');
  modal.id = 'usage-limit-modal';
  modal.className = 'modal-overlay';
  
  
  // Extract reset date - try to get it from the already displayed usage info
  let resetDate = `next ${resetPeriod === 'weekly' ? 'week' : 'month'}`;
  
  // First try to get it from the usage display on the page
  const usageResetEl = document.getElementById('usage-reset');
  if (usageResetEl && usageResetEl.textContent && usageResetEl.textContent !== '-') {
    resetDate = usageResetEl.textContent;
  } else {
    // Fallback: try to extract from error message
    const errorMessage = errorData.error?.message || `You've reached your ${resetPeriod} limit`;
    const resetDateMatch = errorMessage.match(/Resets on (.+?)\./);
    if (resetDateMatch && resetDateMatch[1] !== 'Invalid Date') {
      resetDate = resetDateMatch[1];
    }
  }
  
  // Generate upgrade button HTML if needed
  const upgradeButtonHTML = showUpgradeButton ? `
    <button class="upgrade-modal-btn-green" id="upgrade-modal-btn">
      Upgrade to Pro
    </button>
  ` : '';
  
  modal.innerHTML = `
    <div class="modal-content usage-limit-modal-content">
      <div class="modal-header">
        <h3>${modalTitle}</h3>
        <button class="modal-close" id="close-usage-modal">&times;</button>
      </div>
      <div class="modal-body">
        <div class="usage-limit-info">
          <div class="usage-limit-icon">
            <img src="../images/geolocationbot128.png" alt="GeoGuesser Hacker" class="modal-logo" />
          </div>
          <h4>Thank you for using GeoGuesser Hacker!</h4>
          <p>You've reached your ${resetPeriod} limit of <strong>${limitText}</strong>.</p>
          <p class="reset-info">Your usage will reset on <strong>${resetDate}</strong>.</p>
          
          ${showUpgradeButton ? `
          <div class="upgrade-features-modal">
            <h5>Upgrade to Pro and get:</h5>
            <div class="modal-features-list">
              <div class="modal-feature-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="feature-check-modal">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span>1,000 Guesses per month</span>
              </div>
              <div class="modal-feature-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="feature-check-modal">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span>Superior Accuracy</span>
              </div>
              <div class="modal-feature-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="feature-check-modal">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span>Priority Support</span>
              </div>
            </div>
          </div>
          ` : `
          <div class="contact-info">
            <p>Need more guesses or have questions? Contact us:</p>
            <a href="mailto:support@geoguesserhacker.com" class="contact-email">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              support@geoguesserhacker.com
            </a>
          </div>
          `}
        </div>
        
        <div class="usage-limit-actions">
          ${upgradeButtonHTML}
          <button class="maybe-later-btn" id="close-usage-limit-btn">
            ${showUpgradeButton ? 'Maybe Later' : 'Got it!'}
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Add to page
  document.body.appendChild(modal);
  
  // Add event listeners
  const closeButtons = modal.querySelectorAll('#close-usage-modal, #close-usage-limit-btn');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.remove();
    });
  });
  
  // Add upgrade button event listener if present
  const upgradeBtn = modal.querySelector('#upgrade-modal-btn');
  if (upgradeBtn) {
    upgradeBtn.addEventListener('click', () => {
      modal.remove();
      // Start monitoring for ExtPay window
      startExtPayWindowMonitoring();
      // Open ExtPay payment page
      extpay.openPaymentPage();
    });
  }
  
  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
  
  // Close on Escape key
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
}

  // Make function globally available for onclick handlers
  window.removeCancelledSubscriptionWarning = removeCancelledSubscriptionWarning;

// TEST FUNCTION: Force reset test for current user
async function testUsageReset() {
  try {
    const user = await extpay.getUser();
    const extpayUserId = user.userId || user.email;
    
    if (!extpayUserId) {
      console.error('No user ID found for testing');
      return;
    }
    
    
    // Call the test function
    const response = await fetch('https://us-central1-geoguesser-hacker-ext.cloudfunctions.net/testResetUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { extpayUserId } })
    });
    
    if (response.ok) {
      const result = await response.json();
      
      alert(`Test setup complete! Your reset date was set to yesterday. 
             Now make a guess and check the console logs to see the auto-reset in action.
             
             Subscription Type: ${result.result.subscriptionType}
             Old Reset Date: ${new Date(result.result.oldResetDate._seconds * 1000).toLocaleDateString()}
             New Reset Date: ${result.result.newResetDate}`);
    } else {
      console.error('Test reset failed:', response.status);
    }
  } catch (error) {
    console.error('Error in test reset:', error);
  }
}

// Make test function globally available
window.testUsageReset = testUsageReset;

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
      showStatus('Payment service temporarily unavailable. Please try again later.');
      // Fallback to allow usage with warning
      return { paid: false, trialStarted: false };
    }
    
    // Edge Case 3: Trial expired but not upgraded
    if (user.trialStartedAt && user.trialEnded && !user.paid) {
      showExpiredTrialMessage();
      return user;
    }
    
    // Edge Case 4: Payment failed/cancelled
    if (user.paymentFailed) {
      showPaymentFailedMessage();
      return user;
    }
    
    // Edge Case 5: Subscription past due
    if (user.paid && user.subscriptionStatus === 'past_due') {
      showSubscriptionPastDueMessage();
      return user;
    }

    // Edge Case 6: Subscription cancelled
    if (user.paid && user.subscriptionStatus === 'canceled') {
      showSubscriptionCancelledMessage();
      return user;
    }

    // Edge Case 7: Subscription cancelled but still within period (legacy check)
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

// Comprehensive payment/subscription status refresh function
async function checkPaymentStatus() {
  try {
    const user = await extpay.getUser();
    await syncSubscriptionToFirebase(user);
    updatePaymentUI(user);
    updateUpgradeCardHeader(user);
    updateUpgradeCardFeatures(user);
    
    // Load usage information if user is authenticated
    const extpayUserId = user.userId || user.email;
    if (extpayUserId && extpayUserId !== 'anonymous') {
      await loadUsageInformation(extpayUserId);
    }
    
    // Check for cancelled subscription warning
    checkCancelledSubscriptionWarning(user);
    
    return true;
  } catch (error) {
    console.error('Error in checkPaymentStatus:', error);
    return false;
  }
}

// Enhanced initialization with edge case handling
async function initializePaymentStatusWithEdgeCases() {
  const user = await handleExtPayEdgeCases();
  if (!user) return false;
  
  // Comprehensive UI update
  updatePaymentUI(user);
  updateUpgradeCardHeader(user);
  updateUpgradeCardFeatures(user);
  
  // Check if we should show the trial activation message
  chrome.storage.local.get(['shouldShowTrialMessage'], (result) => {
    if (result.shouldShowTrialMessage && user.trialStartedAt && !user.trialEnded) {
      showTrialActivatedMessage();
      chrome.storage.local.remove('shouldShowTrialMessage');
    }
  });
  
  // Check if user has active subscription or trial
  const isSubscriptionActive = user.paid && 
    (!user.subscriptionStatus || 
     (user.subscriptionStatus !== 'past_due' && user.subscriptionStatus !== 'canceled'));
  return isSubscriptionActive || (user.trialStartedAt && !user.trialEnded);
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

function showSubscriptionPastDueMessage() {
  showNotification('subscription-past-due', {
    title: 'Payment Past Due',
    message: 'Your subscription payment is past due. Please update your payment method to continue enjoying premium features.',
    type: 'warning',
    action: 'Update Payment',
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
        <strong>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="color: #fbbf24; margin-right: 6px; vertical-align: middle;">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Free Trial Activated!
        </strong>
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

function showUsageLimitPopup(errorMessage) {
  // Parse the error message to extract details
  const usageMatch = errorMessage.match(/You've used (\d+)\/(\d+) weekly guesses/);
  const resetMatch = errorMessage.match(/wait until ([^.]+) for reset/);
  
  const usedCount = usageMatch ? usageMatch[1] : '3';
  const totalCount = usageMatch ? usageMatch[2] : '3';
  const resetDate = resetMatch ? resetMatch[1] : 'next week';
  
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.className = 'usage-limit-overlay';
  
  // Create modal content
  const modal = document.createElement('div');
  modal.className = 'usage-limit-modal';
  modal.innerHTML = `
    <div class="modal-header">
      <h3>Free Limit Reached!</h3>
      <button class="modal-close">&times;</button>
    </div>
    <div class="modal-body">
      <div class="limit-info">
        <div class="usage-circle">
          <span class="usage-count">${usedCount}/${totalCount}</span>
          <span class="usage-label">Weekly Guesses</span>
        </div>
        <p>You've used all your free weekly Guesses.</p>
      </div>
      
      <div class="upgrade-options">
        <h4>Choose your option:</h4>
        
        <div class="option-card premium-option">
          <div class="option-header">
            <span class="option-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </span>
            <span class="option-title">Upgrade to Pro</span>
          </div>
          <div class="option-benefits">
            <p><span class="check-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </span> 1,000 Guesses / Month</p>
            <p><span class="check-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </span> Advanced Analysis</p>
            <p><span class="check-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </span> Priority Support</p>
          </div>
          <button class="upgrade-button" id="upgrade-from-limit">Upgrade Now</button>
        </div>
        
        <div class="option-card wait-option">
          <div class="option-header">
            <span class="option-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14" stroke="white" stroke-width="2" fill="none"/>
              </svg>
            </span>
            <span class="option-title">Wait for Reset</span>
          </div>
          <div class="option-details">
            <p>Your Free Guesses will reset on:</p>
            <strong>${resetDate}</strong>
          </div>
        </div>
      </div>
    </div>
  `;
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  // Add event listeners
  const closeBtn = modal.querySelector('.modal-close');
  const upgradeBtn = modal.querySelector('#upgrade-from-limit');
  
  const closeModal = () => {
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  };
  
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  
  upgradeBtn.addEventListener('click', async () => {
    closeModal();
    // Trigger ExtPay upgrade flow
    try {
      await extpay.openPaymentPage();
    } catch (error) {
      console.error('Error opening payment page:', error);
      showStatus('Error opening payment page. Please try again.');
    }
  });
  
  // Close on Escape key
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
}

function showSignInPrompt() {
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.className = 'signin-prompt-overlay';
  
  // Create modal content
  const modal = document.createElement('div');
  modal.className = 'signin-prompt-modal';
  modal.innerHTML = `
    <div class="modal-header">
      <h3>Sign In Required</h3>
      <button class="modal-close">&times;</button>
    </div>
    <div class="modal-body">
      <div class="signin-info">
        <div class="signin-icon">
          <img src="../images/geolocationbot128.png" alt="GeoGuesser Hacker" class="signin-logo" />
        </div>
        <p>Sign Up/Log In to never lose again!</p>
        
        <div class="benefits-list">
          <div class="benefit-item">
            <span class="benefit-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </span>
            <span>3 Free Guesses / Week</span>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </span>
            <span>Unreal Accuracy</span>
          </div>
         
          <div class="benefit-item">
            <span class="benefit-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </span>
            <span>Easy Upgrade for Unlimited</span>
          </div>
        </div>
      </div>
      
      <div class="signin-actions">
        <div class="auth-buttons">
          <button class="signup-button" id="signup-with-extpay">
            Sign Up
          </button>
          <button class="login-button" id="login-with-extpay">
            Log In
          </button>
        </div>
        <p class="signin-note">
          <small>Secure authentication - No spam, ever</small>
        </p>
      </div>
    </div>
  `;
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  // Add event listeners
  const closeBtn = modal.querySelector('.modal-close');
  const signUpBtn = modal.querySelector('#signup-with-extpay');
  const logInBtn = modal.querySelector('#login-with-extpay');
  
  const closeModal = () => {
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  };
  
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  
  // Handle authentication after success
  const handleAuthSuccess = async (actionType) => {
    setTimeout(async () => {
      try {
        const user = await extpay.getUser();
        if (user.userId || user.email) {
          showStatus(`Successfully ${actionType}! You now have access to free guesses.`);
          // Sync user to Firebase
          await syncSubscriptionToFirebase(user);
          // Comprehensive UI refresh
          await checkPaymentStatus();
          // Trigger a custom event to notify other parts of the extension
          window.dispatchEvent(new CustomEvent('extpay-state-changed', { 
            detail: { action: actionType, user: user }
          }));
        }
      } catch (error) {
        console.error(`Error after ${actionType}:`, error);
        showStatus(`${actionType} successful! Please try your guess again.`);
        // Still try to refresh UI even if there was an error
        if (window.refreshUIState) {
          await window.refreshUIState('auth-success-fallback');
        }
      }
    }, 1500); // Slightly longer delay to ensure ExtPay state is fully updated
  };
  
  // Sign Up button
  signUpBtn.addEventListener('click', async () => {
    try {
      closeModal();
      showStatus('Opening free trial page...');
      
      // Start monitoring for ExtPay window closure
      startExtPayWindowMonitoring();
      
      // Open ExtPay trial page for new users (free trial sign-up)
      await extpay.openTrialPage();
      await handleAuthSuccess('signed up for free trial');
      
    } catch (error) {
      console.error('Error opening free trial page:', error);
      showStatus('Error opening free trial page. Please try again.');
    }
  });
  
  // Log In button
  logInBtn.addEventListener('click', async () => {
    try {
      closeModal();
      showStatus('Opening log-in page...');
      
      // Start monitoring for ExtPay window closure
      startExtPayWindowMonitoring();
      
      // Open ExtPay login page for existing users
      await extpay.openLoginPage();
      await handleAuthSuccess('log-in');
      
    } catch (error) {
      console.error('Error opening log-in page:', error);
      showStatus('Error opening log-in page. Please try again.');
    }
  });
  
  // Close on Escape key
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
} 