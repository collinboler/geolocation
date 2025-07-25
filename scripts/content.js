// Content script to handle communication from redirect pages
console.log('Geolocation extension content script loaded');

// Listen for messages from redirect pages
window.addEventListener('message', (event) => {
  console.log('Content script received message:', event.data);
  
  // Only process messages from our redirect pages
  if (event.data && event.data.source === 'stripe-redirect') {
    console.log('Processing Stripe redirect message:', event.data.type);
    
    if (event.data.type === 'STRIPE_SUCCESS') {
      console.log('Payment success detected, session ID:', event.data.sessionId);
      
      // Send message to background script
      chrome.runtime.sendMessage({
        type: 'STRIPE_PAYMENT_SUCCESS',
        sessionId: event.data.sessionId
      }).then(response => {
        console.log('Background script response:', response);
      }).catch(error => {
        console.error('Error sending message to background:', error);
      });
      
    } else if (event.data.type === 'STRIPE_CANCEL') {
      console.log('Payment cancelled');
      
      // Send message to background script
      chrome.runtime.sendMessage({
        type: 'STRIPE_PAYMENT_CANCELLED'
      }).then(response => {
        console.log('Background script response:', response);
      }).catch(error => {
        console.error('Error sending message to background:', error);
      });
    }
  }
});

// Also check if we're on a success page and handle direct navigation
if (window.location.href.includes('success.html') && window.location.search.includes('session_id')) {
  console.log('Direct success page navigation detected');
  
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');
  
  if (sessionId) {
    console.log('Processing direct success navigation, session ID:', sessionId);
    
    // Send message to background script
    chrome.runtime.sendMessage({
      type: 'STRIPE_PAYMENT_SUCCESS',
      sessionId: sessionId
    }).then(response => {
      console.log('Background script response:', response);
    }).catch(error => {
      console.error('Error sending message to background:', error);
    });
  }
}
