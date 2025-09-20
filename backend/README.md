# GeoGuesser Hacker - Firebase Backend

This folder contains all Firebase-related backend code and configuration for the GeoGuesser Hacker Chrome Extension.

## 📁 Directory Structure

```
backend/
├── functions/               # Firebase Cloud Functions
│   ├── index.js            # Main functions code
│   ├── package.json        # Node.js dependencies
│   └── node_modules/       # Installed dependencies
├── firebase.json           # Firebase project configuration
├── firestore.rules         # Firestore security rules
├── firestore.indexes.json  # Firestore database indexes
├── deploy-firebase.sh      # Deployment script
├── firebase-config.js      # Client-side Firebase config
├── config-template.js      # Configuration template
├── FIREBASE_SETUP.md       # Detailed setup instructions
└── README.md              # This file
```

## 🚀 Quick Start

### 1. Deploy Backend
```bash
cd backend
./deploy-firebase.sh
```

### 2. Update Extension
After deployment, update the Chrome extension with your Firebase project URLs.

## 🔧 Available Functions

- **`createUser`** - Initialize new user data
- **`getUserUsage`** - Get user usage statistics  
- **`updateSubscription`** - Update user subscription status
- **`processGeolocation`** - Main AI processing endpoint
- **`resetUsageCounters`** - Reset usage limits (admin)

## 📊 Database Structure

### Users Collection (`/users/{extpayUserId}`)
```javascript
{
  email: "user@example.com",
  subscriptionType: "free" | "standard" | "pro",
  subscriptionStatus: "active" | "expired" | "trial",
  usage: {
    current: 5,
    limit: 100,
    resetDate: timestamp,
    history: [...usageEntries]
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🔐 Environment Variables

The following secrets are managed in Firebase:
- `OPENAI_API_KEY` - OpenAI API key for GPT-4 processing

## 🛠 Development

### Local Testing
```bash
cd backend
firebase emulators:start
```

### View Logs
```bash
firebase functions:log
```

### Deploy Specific Services
```bash
firebase deploy --only functions
firebase deploy --only firestore
```

## 📈 Usage Limits

- **Free Trial**: 3 requests per week
- **Standard**: 100 requests per month  
- **Pro**: 1000 requests per month

## 🔗 Integration

The Chrome extension communicates with these endpoints:
- `https://us-central1-{project-id}.cloudfunctions.net/createUser`
- `https://us-central1-{project-id}.cloudfunctions.net/processGeolocation`
- `https://us-central1-{project-id}.cloudfunctions.net/updateSubscription`
- `https://us-central1-{project-id}.cloudfunctions.net/getUserUsage`
