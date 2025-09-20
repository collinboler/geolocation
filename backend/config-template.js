// Configuration template for GeoGuesser Hacker Extension
// Copy this file to config.js and fill in your actual values

const CONFIG = {
  // Firebase Configuration
  firebase: {
    apiKey: "your-firebase-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
  },
  
  // Firebase Functions URLs (will be auto-generated after deployment)
  functions: {
    baseUrl: "https://your-project-id.cloudfunctions.net",
    createUser: "/createUser",
    processGeolocation: "/processGeolocation", 
    getUserUsage: "/getUserUsage",
    updateSubscription: "/updateSubscription"
  },
  
  // ExtPay Configuration
  extpay: {
    extensionId: "geoguesser-hacker"
  },
  
  // Usage Limits (these should match Firebase Functions)
  usageLimits: {
    free: { limit: 3, period: "week" },
    standard: { limit: 100, period: "month" },
    pro: { limit: 1000, period: "month" }
  },
  
  // Feature Flags
  features: {
    useFirebaseBackend: true,
    enableUsageTracking: true,
    enableAnalytics: false
  }
};

// Export for use in extension
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
