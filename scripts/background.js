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
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (!tabs.length) {
        console.error('No active tab found');
        sendResponse({error: 'No active tab found'});
        return;
      }
      
      const tab = tabs[0];
      console.log('Capturing tab:', tab.id);
      
      // Capture the visible tab
      chrome.tabs.captureVisibleTab(tab.windowId, {format: 'png'}, (dataUrl) => {
        if (chrome.runtime.lastError) {
          console.error('Background capture error:', chrome.runtime.lastError);
          sendResponse({error: chrome.runtime.lastError.message});
          return;
        }
        
        if (!dataUrl) {
          console.error('No capture data received');
          sendResponse({error: 'No capture data received'});
          return;
        }
        
        console.log('Background capture successful, data length:', dataUrl.length);
        sendResponse({success: true, dataUrl: dataUrl});
      });
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