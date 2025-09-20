# GeoGuesser Hacker Chrome Extension

Chrome Extension that uses LLMs to guess your onscreen location using AI computer vision (Perfect for GeoGuesser, among other things)

Download [here](https://chromewebstore.google.com/detail/geoguesser-hacker/ogjhgcaaaclhdaalliolbhibppalepkj?hl=en)

Supports OpenAI GPT-4o; more models coming soon

**3,500+ downloads and counting**

## 📁 Project Structure

```
├── backend/                 # 🔥 Firebase backend (Cloud Functions, Firestore)
│   ├── functions/          # Cloud Functions code
│   ├── firebase.json       # Firebase configuration
│   ├── firestore.rules     # Database security rules
│   └── deploy-firebase.sh  # Deployment script
├── sidepanel/              # 🎨 Extension UI (HTML, CSS, JS)
├── images/                 # 🖼️ Extension icons
├── manifest.json           # 📋 Chrome Extension configuration
├── background.js           # ⚙️ Extension background script
└── extpay.js              # 💳 Payment integration
```

## 🚀 Quick Start

### Extension Development
1. Load the extension in Chrome Developer Mode
2. Point to this directory

### Backend Deployment
1. `cd backend`
2. `./deploy-firebase.sh`
3. Update extension with your Firebase URLs

## 🔧 Features

- **AI Location Guessing** - GPT-4o powered image analysis
- **Subscription Management** - Free trial, Standard, and Pro tiers
- **Usage Tracking** - Per-user limits and analytics
- **Payment Integration** - ExtPay.js integration
- **Cloud Backend** - Firebase Functions and Firestore

## 📊 Architecture

- **Frontend**: Chrome Extension (Manifest V3)
- **Backend**: Firebase Cloud Functions
- **Database**: Firestore
- **AI**: OpenAI GPT-4o
- **Payments**: ExtPay.js
