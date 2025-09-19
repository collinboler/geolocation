#!/bin/bash

# Firebase deployment script for GeoGuesser Hacker Extension

echo "🚀 Deploying GeoGuesser Hacker Firebase Backend..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it with: npm install -g firebase-tools"
    exit 1
fi

# Login to Firebase (if not already logged in)
echo "🔐 Checking Firebase authentication..."
firebase login --reauth

# Initialize Firebase project (if not already initialized)
if [ ! -f ".firebaserc" ]; then
    echo "📁 Initializing Firebase project..."
    firebase init
fi

# Install dependencies
echo "📦 Installing Firebase Functions dependencies..."
cd functions
npm install
cd ..

# Set environment variables
echo "⚙️  Setting up environment variables..."
echo "Please set your OpenAI API Key:"
read -p "Enter your OpenAI API Key: " OPENAI_API_KEY
firebase functions:config:set openai.api_key="$OPENAI_API_KEY"

# Deploy Firestore rules and indexes
echo "🔥 Deploying Firestore rules and indexes..."
firebase deploy --only firestore

# Deploy Firebase Functions
echo "☁️  Deploying Firebase Functions..."
firebase deploy --only functions

# Get the deployed function URLs
PROJECT_ID=$(firebase projects:list --format=json | jq -r '.[0].projectId')
echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Update your extension with these URLs:"
echo "   Project ID: $PROJECT_ID"
echo "   Functions URL: https://$PROJECT_ID.cloudfunctions.net/"
echo ""
echo "🔧 Next steps:"
echo "   1. Update sidepanel.js with your Project ID"
echo "   2. Set up ExtPay webhooks to call updateSubscription function"
echo "   3. Test the extension with the new backend"
echo ""
echo "📊 To monitor your functions:"
echo "   firebase functions:log"
echo ""
echo "🎉 Your GeoGuesser Hacker backend is now live!"
