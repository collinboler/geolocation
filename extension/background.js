// Import ExtPay
importScripts('extpay.js');

// Initialize ExtPay with your extension ID
const extpay = ExtPay('geoguesser-hacker');
extpay.startBackground();

// Configure side panel behavior
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

// Open welcome page on extension install
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({
      url: chrome.runtime.getURL('welcome.html')
    });
  }
});

// Listen for action clicks to open the side panel
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openPaymentPage') {
    // Redeclare extpay in the callback as per documentation
    const extpay = ExtPay('geoguesser-hacker');
    extpay.openPaymentPage();
    sendResponse({ success: true });
  }
});