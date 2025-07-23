// Configure side panel behavior - don't auto-open on action click
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false });

// Listen for action clicks to open the popup (default behavior)
chrome.action.onClicked.addListener((tab) => {
  // This will open the popup by default
  // The side panel can be opened from within the popup
}); 