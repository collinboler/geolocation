# Firebase Setup for User Management & Monetization

## 🚀 Quick Setup Guide

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enable Google Analytics (recommended)
4. Go to Authentication > Sign-in method > Enable Google

### 2. Set up Firestore Database

Create these collections in Firestore:

```javascript
// users/{userId}
{
  email: "user@example.com",
  name: "John Doe",
  picture: "https://...",
  subscriptionType: "free", // or "premium"
  createdAt: timestamp,
  lastLoginAt: timestamp
}

// usage/{userId}
{
  weeklyUsage: 3,
  monthlyUsage: 45,
  totalUsage: 157,
  lastUsageDate: "2024-01-15",
  weekResetDate: timestamp,
  monthResetDate: timestamp
}

// subscriptions/{userId}
{
  stripeCustomerId: "cus_...",
  subscriptionId: "sub_...",
  status: "active", // or "canceled", "past_due"
  currentPeriodEnd: timestamp,
  plan: "pro_monthly" // or "pro_yearly"
}
```

### 3. Deploy Cloud Functions

Install Firebase CLI and deploy these functions:

```bash
npm install -g firebase-tools
firebase login
firebase init functions
```

Create these Cloud Functions:

#### `functions/index.js`
```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { FirebaseFunctionsRateLimiter } = require('firebase-functions-rate-limiter');
const stripe = require('stripe')(functions.config().stripe.secret_key);

admin.initializeApp();
const db = admin.firestore();

// Rate limiter for additional protection
const rateLimiter = FirebaseFunctionsRateLimiter.withFirestoreBackend(
  {
    name: 'analysis_rate_limit',
    maxCalls: 10, // Max 10 calls per minute per user
    periodSeconds: 60,
  },
  db
);

// Get user status and usage
exports.getUserStatus = functions.https.onCall(async (data, context) => {
  const { userId, email } = data;
  
  try {
    // Get or create user document
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      // Create new user
      await userRef.set({
        email: email,
        subscriptionType: 'free',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastLoginAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } else {
      // Update last login
      await userRef.update({
        lastLoginAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    // Get usage data
    const usageRef = db.collection('usage').doc(userId);
    const usageDoc = await usageRef.get();
    
    const now = new Date();
    const currentWeek = getWeekNumber(now);
    const currentMonth = now.getMonth();
    
    let weeklyUsage = 0;
    let monthlyUsage = 0;
    
    if (usageDoc.exists) {
      const usageData = usageDoc.data();
      const lastWeek = usageData.weekResetDate ? getWeekNumber(usageData.weekResetDate.toDate()) : 0;
      const lastMonth = usageData.monthResetDate ? usageData.monthResetDate.toDate().getMonth() : 0;
      
      // Check if we're in the same week/month
      if (lastWeek === currentWeek) {
        weeklyUsage = usageData.weeklyUsage || 0;
      }
      if (lastMonth === currentMonth) {
        monthlyUsage = usageData.monthlyUsage || 0;
      }
    }
    
    // Get subscription status
    const subscriptionRef = db.collection('subscriptions').doc(userId);
    const subscriptionDoc = await subscriptionRef.get();
    
    let subscriptionType = 'free';
    if (subscriptionDoc.exists) {
      const subData = subscriptionDoc.data();
      if (subData.status === 'active') {
        subscriptionType = subData.plan === 'pro_plus' ? 'pro_plus' : 'pro';
      }
    }
    
    // Determine usage limits
    let usageLimit, currentUsage, canUse;
    if (subscriptionType === 'free') {
      usageLimit = 7; // 7 per week
      currentUsage = weeklyUsage;
      canUse = weeklyUsage < 7;
    } else if (subscriptionType === 'pro') {
      usageLimit = 300; // 300 per month
      currentUsage = monthlyUsage;
      canUse = monthlyUsage < 300;
    } else { // pro_plus
      usageLimit = 1000; // 1000 per month
      currentUsage = monthlyUsage;
      canUse = monthlyUsage < 1000;
    }
    
    return {
      subscriptionType: subscriptionType,
      weeklyUsage: weeklyUsage,
      monthlyUsage: monthlyUsage,
      usageLimit: usageLimit,
      currentUsage: currentUsage,
      canUse: canUse
    };
    
  } catch (error) {
    console.error('Error getting user status:', error);
    throw new functions.https.HttpsError('internal', 'Unable to get user status');
  }
});

// Helper function to get week number
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// OpenAI Proxy Function - handles API calls server-side
exports.analyzeImage = functions.https.onCall(async (data, context) => {
  // Authentication check
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }
  
  const userId = context.auth.uid;
  const { imageData } = data;
  
  try {
    // Rate limiting protection
    await rateLimiter.rejectOnQuotaExceededOrRecordUsage(userId);
    
    // Check user's subscription and usage limits
    const userStatus = await getUserStatusInternal(userId, context.auth.token.email);
    
    if (!userStatus.canUse) {
      throw new functions.https.HttpsError('resource-exhausted', 
        `Usage limit exceeded. ${userStatus.subscriptionType} users get ${userStatus.usageLimit} analyses per ${userStatus.subscriptionType === 'free' ? 'week' : 'month'}.`);
    }
    
    // Make OpenAI API call with your server-side API key
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${functions.config().openai.api_key}` // Your API key stored securely
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{
          role: "user",
          content: [
            {
              type: "text",
              text: "Guess this location's exact coordinates, and only output the coordinates of your best guess followed by the location's name or general regional location. This is for the game geoguessr, so use all the metas that a pro would use, and answer asap! Output your response in this JSON format only: {\"coordinates\": {\"lat\": 40.348600, \"lng\": -74.659300}, \"location\": \"Nassau Hall Princeton, New Jersey, United States\"} ALWAYS OUTPUT SOME JSON GUESS, EVEN IF YOU ARE NOT 100% CERTAIN. Take your best guess for sure though, just in edge cases."
            },
            {
              type: "image_url",
              image_url: {
                url: imageData
              }
            }
          ]
        }],
        max_tokens: 500
      })
    });
    
    if (!openaiResponse.ok) {
      throw new functions.https.HttpsError('internal', 'OpenAI API request failed');
    }
    
    const result = await openaiResponse.json();
    
    // Track usage after successful API call
    await trackUsageInternal(userId);
    
    return {
      response: result.choices[0].message.content,
      tokensUsed: result.usage.total_tokens,
      cost: result.usage.total_tokens * (2.50 / 1000000) // GPT-4o pricing
    };
    
  } catch (error) {
    console.error('Error in analyzeImage:', error);
    throw new functions.https.HttpsError('internal', error.message || 'Analysis failed');
  }
});

// Internal function to get user status (reusable)
async function getUserStatusInternal(userId, email) {
  // [Same logic as getUserStatus but without the onCall wrapper]
  // This is a helper function to avoid code duplication
  const userRef = db.collection('users').doc(userId);
  const userDoc = await userRef.get();
  
  if (!userDoc.exists) {
    await userRef.set({
      email: email,
      subscriptionType: 'free',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
  
  const usageRef = db.collection('usage').doc(userId);
  const usageDoc = await usageRef.get();
  
  const now = new Date();
  const currentWeek = getWeekNumber(now);
  const currentMonth = now.getMonth();
  
  let weeklyUsage = 0;
  let monthlyUsage = 0;
  
  if (usageDoc.exists) {
    const usageData = usageDoc.data();
    const lastWeek = usageData.weekResetDate ? getWeekNumber(usageData.weekResetDate.toDate()) : 0;
    const lastMonth = usageData.monthResetDate ? usageData.monthResetDate.toDate().getMonth() : 0;
    
    if (lastWeek === currentWeek) weeklyUsage = usageData.weeklyUsage || 0;
    if (lastMonth === currentMonth) monthlyUsage = usageData.monthlyUsage || 0;
  }
  
  const subscriptionRef = db.collection('subscriptions').doc(userId);
  const subscriptionDoc = await subscriptionRef.get();
  
  let subscriptionType = 'free';
  if (subscriptionDoc.exists) {
    const subData = subscriptionDoc.data();
    if (subData.status === 'active') {
      subscriptionType = subData.plan === 'pro_plus' ? 'pro_plus' : 'pro';
    }
  }
  
  let usageLimit, currentUsage, canUse;
  if (subscriptionType === 'free') {
    usageLimit = 7;
    currentUsage = weeklyUsage;
    canUse = weeklyUsage < 7;
  } else if (subscriptionType === 'pro') {
    usageLimit = 300;
    currentUsage = monthlyUsage;
    canUse = monthlyUsage < 300;
  } else {
    usageLimit = 1000;
    currentUsage = monthlyUsage;
    canUse = monthlyUsage < 1000;
  }
  
  return { subscriptionType, weeklyUsage, monthlyUsage, usageLimit, currentUsage, canUse };
}

// Internal function to track usage
async function trackUsageInternal(userId) {
  const now = new Date();
  const currentWeek = getWeekNumber(now);
  const currentMonth = now.getMonth();
  
  const usageRef = db.collection('usage').doc(userId);
  const usageDoc = await usageRef.get();
  
  if (!usageDoc.exists) {
    await usageRef.set({
      weeklyUsage: 1,
      monthlyUsage: 1,
      totalUsage: 1,
      lastUsageDate: now.toDateString(),
      weekResetDate: admin.firestore.FieldValue.serverTimestamp(),
      monthResetDate: admin.firestore.FieldValue.serverTimestamp()
    });
  } else {
    const usageData = usageDoc.data();
    const lastWeek = usageData.weekResetDate ? getWeekNumber(usageData.weekResetDate.toDate()) : 0;
    const lastMonth = usageData.monthResetDate ? usageData.monthResetDate.toDate().getMonth() : 0;
    
    const updates = {
      totalUsage: admin.firestore.FieldValue.increment(1),
      lastUsageDate: now.toDateString()
    };
    
    if (lastWeek === currentWeek) {
      updates.weeklyUsage = admin.firestore.FieldValue.increment(1);
    } else {
      updates.weeklyUsage = 1;
      updates.weekResetDate = admin.firestore.FieldValue.serverTimestamp();
    }
    
    if (lastMonth === currentMonth) {
      updates.monthlyUsage = admin.firestore.FieldValue.increment(1);
    } else {
      updates.monthlyUsage = 1;
      updates.monthResetDate = admin.firestore.FieldValue.serverTimestamp();
    }
    
    await usageRef.update(updates);
  }
}

// Create Stripe checkout session
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  const { userId, email, priceId } = data;
  
  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [{
        price: priceId, // Your Stripe price ID
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: 'https://your-extension-website.com/success',
      cancel_url: 'https://your-extension-website.com/cancel',
      metadata: {
        userId: userId
      }
    });
    
    return { sessionId: session.id };
    
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new functions.https.HttpsError('internal', 'Unable to create checkout session');
  }
});

// Handle Stripe webhooks
exports.handleStripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, functions.config().stripe.webhook_secret);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle different event types
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const userId = session.metadata.userId;
      
      // Update user's subscription
      await db.collection('subscriptions').doc(userId).set({
        stripeCustomerId: session.customer,
        subscriptionId: session.subscription,
        status: 'active',
        plan: 'pro_monthly',
        currentPeriodEnd: new Date(session.current_period_end * 1000),
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      break;
      
    case 'invoice.payment_succeeded':
      // Handle successful payment
      break;
      
    case 'customer.subscription.deleted':
      // Handle subscription cancellation
      const subscription = event.data.object;
      // Find user by customer ID and update subscription status
      break;
  }
  
  res.json({ received: true });
});
```

### 4. Install Dependencies and Set Environment Variables

First install the required packages:

```bash
cd functions
npm install firebase-functions-rate-limiter stripe
```

Then set your environment variables:

```bash
firebase functions:config:set stripe.secret_key="sk_test_..." stripe.webhook_secret="whsec_..." openai.api_key="sk-..."
```

### 5. Update Your Extension

Replace the placeholder URLs in your `sidepanel.js`:

```javascript
// Replace these URLs with your actual Firebase project URLs
const response = await fetch('https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com/getUserStatus', {
// ...
```

### 6. Pricing Tiers

#### Free Tier (7 uses/week)
- 7 analyses per week
- Basic location guessing
- Community support

#### Pro Tier ($9.99/month - 300 uses/month)
- 300 analyses per month (~10/day)
- Priority processing
- Advanced features
- Email support

#### Pro+ Tier ($19.99/month - 1000 uses/month)
- 1000 analyses per month (~33/day)
- Highest priority processing
- Export functionality
- Priority support

### 7. Stripe Integration

1. Create [Stripe account](https://stripe.com)
2. Create products and prices in Stripe Dashboard
3. Set up webhook endpoint pointing to your Cloud Function
4. Add Stripe keys to Firebase config

### 8. Next Steps

1. Deploy your Cloud Functions
2. Test the rate limiting
3. Set up Stripe checkout
4. Create a landing page for upgrades
5. Implement analytics and monitoring

## 💰 Monetization Strategy

- **Freemium Model**: 7 free analyses/week → upgrade for more
- **Pro Subscription**: $9.99/month for 300 analyses/month  
- **Pro+ Subscription**: $19.99/month for 1000 analyses/month
- **Server-Side API Key**: Your OpenAI costs are controlled and users can't abuse your API key
- **Rate Limiting**: Built-in protection using [firebase-functions-rate-limiter](https://github.com/Jblew/firebase-functions-rate-limiter)

## 📊 Analytics to Track

- Daily/Monthly Active Users
- Conversion rate (free → paid)
- Churn rate
- Usage patterns
- Revenue metrics

This setup gives you a complete user management and monetization system! 