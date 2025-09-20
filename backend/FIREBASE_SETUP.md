# Firebase Backend Setup for GeoGuesser Hacker Extension

This guide will help you set up a complete Firebase backend system with Firestore database, Cloud Functions, and usage tracking.

## 🏗️ Architecture Overview

```
Extension (ExtPay) → Firebase Functions → OpenAI API → Firestore DB
                ↓
            User Management & Usage Tracking
```

### Components:
- **Firebase Firestore**: Stores user data, subscription status, usage tracking
- **Firebase Functions**: Middleware for OpenAI API calls and usage management  
- **ExtPay Integration**: Subscription management and payment processing
- **Usage Limits**: Trial (3/week), Standard (100/month), Pro (1000/month)

## 📋 Prerequisites

1. **Firebase CLI**: `npm install -g firebase-tools`
2. **Firebase Project**: Create at [Firebase Console](https://console.firebase.google.com)
3. **OpenAI API Key**: Get from [OpenAI Dashboard](https://platform.openai.com/api-keys)
4. **ExtPay Account**: Register at [ExtensionPay.com](https://extensionpay.com)

## 🚀 Quick Setup

### Step 1: Initialize Firebase Project

```bash
# Clone/navigate to your extension directory
cd geolocation

# Login to Firebase
firebase login

# Initialize Firebase project
firebase init

# Select:
# - Firestore: Configure security rules and indexes
# - Functions: Configure and deploy Cloud Functions
```

### Step 2: Install Dependencies

```bash
cd functions
npm install
```

### Step 3: Configure Environment Variables

```bash
# Set your OpenAI API key
firebase functions:config:set openai.api_key="your-openai-api-key-here"
```

### Step 4: Deploy to Firebase

```bash
# Run the deployment script
./deploy-firebase.sh

# Or deploy manually:
firebase deploy
```

### Step 5: Update Extension Configuration

1. Copy `config-template.js` to `config.js`
2. Fill in your Firebase project details
3. Update the Firebase Function URLs in `sidepanel.js`

## 📊 Database Schema

### Users Collection (`/users/{extpayUserId}`)

```javascript
{
  extpayUserId: "string",           // ExtPay user identifier
  email: "string",                  // User email (optional)
  subscriptionType: "free|standard|pro",
  subscriptionStatus: "trial|active|cancelled|expired",
  createdAt: "timestamp",
  updatedAt: "timestamp",
  usage: {
    current: 0,                     // Current period usage count
    resetDate: "timestamp",         // When usage resets
    history: [                      // Usage history (last 100)
      {
        timestamp: "timestamp",
        tokensUsed: 1234,
        cost: 0.00123,
        coordinates: {lat: 40.0, lng: -74.0}
      }
    ]
  }
}
```

## ⚙️ Firebase Functions

### Available Endpoints:

1. **`createUser`** - Initialize user in database
2. **`processGeolocation`** - Main AI processing endpoint
3. **`getUserUsage`** - Get user's current usage stats
4. **`updateSubscription`** - Sync ExtPay subscription changes
5. **`resetUsageCounters`** - Scheduled function to reset usage

### Usage Limits:

| Plan Type | Limit | Reset Period |
|-----------|-------|--------------|
| Free Trial | 3 requests | Weekly (Monday) |
| Standard | 100 requests | Monthly (1st) |
| Pro | 1000 requests | Monthly (1st) |

## 🔗 ExtPay Integration

### Webhook Setup:
1. Go to ExtPay dashboard
2. Add webhook URL: `https://your-project.cloudfunctions.net/updateSubscription`
3. Configure events: `subscription.created`, `subscription.updated`, `subscription.cancelled`

### Subscription Status Sync:
The system automatically syncs subscription changes from ExtPay to Firebase:

- **Trial Started** → `subscriptionStatus: "trial"`
- **Payment Successful** → `subscriptionStatus: "active"`
- **Subscription Cancelled** → `subscriptionStatus: "cancelled"`
- **Subscription Expired** → `subscriptionStatus: "expired"`

## 📈 Usage Tracking

### Real-time Usage Display:
- Current usage count
- Monthly/weekly limits
- Reset date
- Plan type
- Usage history

### Automatic Limit Enforcement:
- Blocks requests when limit exceeded
- Shows informative error messages
- Suggests plan upgrades

### Reset Schedule:
- **Weekly Plans**: Reset every Monday at midnight
- **Monthly Plans**: Reset on 1st of each month at midnight

## 🔧 Development & Testing

### Local Development:
```bash
# Start Firebase emulators
firebase emulators:start

# Test functions locally
curl -X POST http://localhost:5001/your-project/us-central1/processGeolocation \
  -H "Content-Type: application/json" \
  -d '{"data": {"extpayUserId": "test", "imageData": "data:image/png;base64,..."}}'
```

### Monitoring:
```bash
# View function logs
firebase functions:log

# Monitor specific function
firebase functions:log --only processGeolocation
```

## 🛡️ Security Features

### Firestore Security Rules:
- Users can only access their own data
- Cloud Functions have admin access
- Analytics are read-only for authenticated users

### Rate Limiting:
- Built-in usage limits per subscription tier
- API error handling and retry logic
- Graceful degradation on service failures

### Data Privacy:
- User emails are optional
- Image data is not stored (only processed)
- Usage history limited to last 100 requests

## 🚨 Troubleshooting

### Common Issues:

1. **"ExtPay User ID required"**
   - Ensure ExtPay is properly initialized
   - Check user authentication status

2. **"Usage limit exceeded"**
   - Verify user's subscription status
   - Check reset date calculation

3. **"OpenAI API Error"**
   - Verify API key in Firebase config
   - Check billing status in OpenAI dashboard

4. **"Firebase Function timeout"**
   - Increase function timeout in Firebase console
   - Optimize image processing

### Debug Steps:
1. Check Firebase Function logs
2. Verify ExtPay user status
3. Test API endpoints manually
4. Check Firestore data structure

## 💰 Cost Estimation

### Firebase Costs:
- **Firestore**: ~$0.18 per 100K document reads
- **Functions**: ~$0.40 per 1M invocations
- **Hosting**: Free tier sufficient

### OpenAI Costs:
- **GPT-4o**: $2.50 per 1M input tokens
- **Average per request**: ~$0.001-0.003
- **Monthly costs**: Trial: ~$0.01, Standard: ~$0.30, Pro: ~$3.00

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [ExtPay Documentation](https://github.com/Glench/ExtPay)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/)

## 🎉 Success!

Your GeoGuesser Hacker extension now has:
- ✅ Scalable Firebase backend
- ✅ Usage tracking and limits
- ✅ Subscription management
- ✅ Real-time analytics
- ✅ Cost optimization
- ✅ Security best practices

Ready to handle thousands of users! 🚀
