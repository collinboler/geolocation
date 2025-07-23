document.addEventListener('DOMContentLoaded', () => {
  const saveApiKeyButton = document.getElementById('save-api-key-button');
  const apiKeyInput = document.getElementById('api-key-input');
  const statusDiv = document.getElementById('status');
  const showCoordsSwitch = document.getElementById('show-coords-switch');
  const showMapSwitch = document.getElementById('show-map-switch');
  const darkModeSwitch = document.getElementById('dark-mode-switch');

  // Load settings from storage
  chrome.storage.local.get(['openaiApiKey', 'showCoords', 'showMap', 'darkMode'], (result) => {
    if (result.openaiApiKey) {
      apiKeyInput.value = result.openaiApiKey;
    }
    if (result.showMap !== undefined) {
      showMapSwitch.checked = result.showMap;
    } else {
      showMapSwitch.checked = true;
    }
    if (result.showCoords !== undefined) {
      showCoordsSwitch.checked = result.showCoords;
    } else {
      showCoordsSwitch.checked = false;
    }
    if (result.darkMode !== undefined) {
      darkModeSwitch.checked = result.darkMode;
    } else {
      darkModeSwitch.checked = false;
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
      statusDiv.textContent = showMap ? 'Map display enabled' : 'Map display disabled';
      setTimeout(() => { statusDiv.textContent = ''; }, 2000);
    });
  });

  // Toggle coordinates display
  showCoordsSwitch.addEventListener('change', () => {
    const showCoords = showCoordsSwitch.checked;
    chrome.storage.local.set({ showCoords: showCoords }, () => {
      statusDiv.textContent = showCoords ? 'Coordinates display enabled' : 'Coordinates display disabled';
      setTimeout(() => { statusDiv.textContent = ''; }, 2000);
    });
  });

  // Toggle dark mode
  darkModeSwitch.addEventListener('change', () => {
    const darkMode = darkModeSwitch.checked;
    chrome.storage.local.set({ darkMode: darkMode }, () => {
      statusDiv.textContent = darkMode ? 'Dark mode enabled' : 'Dark mode disabled';
      setTimeout(() => { statusDiv.textContent = ''; }, 2000);
    });
  });

  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateStatus') {
      statusDiv.textContent = request.message;
      setTimeout(() => { statusDiv.textContent = ''; }, 3000);
    }
  });
}); 