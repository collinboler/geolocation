document.addEventListener('DOMContentLoaded', () => {
    const captureButton = document.getElementById('capture-button');
    const saveApiKeyButton = document.getElementById('save-api-key-button');
    const apiKeyInput = document.getElementById('api-key-input');
    const statusDiv = document.getElementById('status');
    const locationDiv = document.getElementById('location-name'); /* changed */

  
    // Load API key from storage
    chrome.storage.local.get(['openaiApiKey'], (result) => {
      if (result.openaiApiKey) {
        apiKeyInput.value = result.openaiApiKey;
      }
    });

      // Load the last generated location from storage
      chrome.storage.local.get(['lastLocation'], (result) => { 
        if (result.lastLocation) {
          locationDiv.textContent = result.lastLocation; 
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
      // Upload the image to get a publicly accessible URL
      const imageUrl = await uploadImage(dataUrl);
  
      if (!imageUrl) {
        document.getElementById('status').textContent = 'Error uploading image.';
        return;
      }
  
      // Construct the messages array
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
  
      // Call the OpenAI API
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
    // Display the assistant's reply
    // document.getElementById('status').textContent = 'Assistant response received.';
  
    // For simplicity, assume the assistant provides the location name directly.
    const locationName = responseText.trim();
  
    if (locationName) {
      document.getElementById('location-name').textContent = locationName;
      
      // Save the last generated location to storage
      chrome.storage.local.set({ lastLocation: locationName }, () => { /* changed */
        console.log('Last location saved:', locationName); /* changed */
      }); /* changed */


      document.getElementById('status').textContent = '';
  
      // Convert location name to coordinates
    //   geocodeLocationName(locationName);
    } else {
      document.getElementById('status').textContent = 'Could not extract location name.';
    }
  }
