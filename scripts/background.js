// Configure side panel behavior
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

// Open side panel when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
}); 

// Handle payment success/cancel messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background script received message:', message);
  
  if (message.type === 'CAPTURE_TAB') {
    console.log('Capture request received from side panel');
    
    // Get the active tab
    chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
      if (!tabs.length) {
        sendResponse({error: 'No active tab found'});
        return;
      }
      
      const tab = tabs[0];
      console.log('Getting stream ID for tab:', tab.id);
      
      try {
        // Get a stream ID for the tab
        const streamId = await chrome.tabCapture.getMediaStreamId({
          targetTabId: tab.id,
          consumerTabId: sender.tab?.id
        });
        
        console.log('Got stream ID:', streamId);
        
        // Send the stream ID back to the side panel
        sendResponse({streamId: streamId});
      } catch (error) {
        console.error('Error getting stream ID:', error);
        sendResponse({error: error.message || 'Failed to get stream ID'});
      }
    });
    
    return true; // Keep the message channel open for async response
  }
  
  if (message.type === 'STRIPE_PAYMENT_SUCCESS') {
    console.log('Payment successful! Session ID:', message.sessionId);
    
    // Store payment info for debugging
    chrome.storage.local.set({
      lastPaymentSession: message.sessionId,
      lastPaymentTime: Date.now(),
      paymentStatus: 'completed'
    });
    
    // Notify all tabs about the successful payment
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          type: 'PAYMENT_SUCCESS_NOTIFICATION',
          sessionId: message.sessionId
        }).catch(err => {
          // Ignore errors for tabs that don't have content scripts
        });
      });
    });
    
    // Show success notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'images/geolocationbot128.png',
      title: 'Payment Successful!',
      message: 'Your subscription has been activated. Thank you!'
    });
    
    sendResponse({ success: true });
    
  } else if (message.type === 'STRIPE_PAYMENT_CANCELLED') {
    console.log('Payment was cancelled');
    
    // Show cancellation notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'images/geolocationbot128.png',
      title: 'Payment Cancelled',
      message: 'Your payment was cancelled. You can try again anytime.'
    });
    
    sendResponse({ success: true });
  }
  
  return true; // Keep the message channel open for async response
});