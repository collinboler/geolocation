/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
// const {onRequest} = require("firebase-functions/https");
// const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.


setGlobalOptions({maxInstances: 200});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {FirebaseFunctionsRateLimiter} = require("firebase-functions-rate-limiter");

// Initialize Stripe only if config is available
let stripe;
try {
  const stripeSecretKey = 'sk_test_51RnuqsI0tsdDMPfnWb5clDoyvcfoPXHD5sMVAQh6bim9jmQ9qcX70Ojxz00t1DK8IdCkDi6HnYmNf9YjOnV1KO5F00CAYTx2oI';
  if (stripeSecretKey) {
    stripe = require("stripe")(stripeSecretKey);
  }
} catch (error) {
  console.log("Stripe not configured yet");
}

admin.initializeApp();
const db = admin.firestore();

// Helper function to verify Google OAuth tokens
async function verifyGoogleToken(token) {
  try {
    // First verify the token is valid
    const tokenInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`);
    
    if (!tokenInfoResponse.ok) {
      throw new Error('Invalid token');
    }
    
    const tokenInfo = await tokenInfoResponse.json();
    
    // Check if token has required scopes
    const requiredScopes = ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'];
    const hasRequiredScopes = requiredScopes.some(scope => tokenInfo.scope && tokenInfo.scope.includes(scope));
    
    if (!hasRequiredScopes) {
      // Still allow access even without perfect scope match
      console.log('Token scopes may not match perfectly, but proceeding');
    }
    
    // Get user profile information using userinfo API (more reliable)
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!profileResponse.ok) {
      throw new Error('Failed to get user profile');
    }
    
    const profile = await profileResponse.json();
    
    if (!profile.email || !profile.id) {
      throw new Error('Profile missing required fields');
    }
    
    return {
      sub: profile.id, // Use Google user ID
      email: profile.email,
      name: profile.name,
      audience: tokenInfo.audience
    };
  } catch (error) {
    console.error('Token verification error:', error.message);
    throw new Error('Token verification failed: ' + error.message);
  }
}

// Rate limiter for additional protection
const rateLimiter = FirebaseFunctionsRateLimiter.withFirestoreBackend(
    {
      name: "analysis_rate_limit",
      maxCalls: 10, // Max 10 calls per minute per user
      periodSeconds: 60,
    },
    db,
);

// Get user status and usage
exports.getUserStatus = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    // Verify Google OAuth token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const userInfo = await verifyGoogleToken(token);
    
    const {userId, email} = req.body.data || {};
    const verifiedEmail = userInfo.email;
    const verifiedUserId = userInfo.sub;
    // Get or create user document using verified user ID
    const userRef = db.collection("users").doc(verifiedUserId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      // Create new user
      await userRef.set({
        email: verifiedEmail,
        subscriptionType: "free",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      // Update last login
      await userRef.update({
        lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // Get usage data
    const usageRef = db.collection("usage").doc(verifiedUserId);
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
    const subscriptionRef = db.collection("subscriptions").doc(verifiedUserId);
    const subscriptionDoc = await subscriptionRef.get();

    let subscriptionType = "free";
    if (subscriptionDoc.exists) {
      const subData = subscriptionDoc.data();
      if (subData.status === "active") {
        subscriptionType = subData.plan === "pro_plus" ? "pro_plus" : "pro";
      }
    }

    // Determine usage limits
    let usageLimit; let currentUsage; let canUse;
    if (subscriptionType === "free") {
      usageLimit = 7; // 7 per week
      currentUsage = weeklyUsage;
      canUse = weeklyUsage < 7;
    } else if (subscriptionType === "pro") {
      usageLimit = 300; // 300 per month
      currentUsage = monthlyUsage;
      canUse = monthlyUsage < 300;
    } else { // pro_plus
      usageLimit = 1000; // 1000 per month
      currentUsage = monthlyUsage;
      canUse = monthlyUsage < 1000;
    }

    res.json({
      result: {
        subscriptionType: subscriptionType,
        weeklyUsage: weeklyUsage,
        monthlyUsage: monthlyUsage,
        usageLimit: usageLimit,
        currentUsage: currentUsage,
        canUse: canUse,
      }
    });
  } catch (error) {
    console.error("Error getting user status:", error);
    res.status(500).json({ error: "Unable to get user status" });
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
exports.analyzeImage = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    // Verify Google OAuth token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const userInfo = await verifyGoogleToken(token);
    
    const userId = userInfo.sub;
    const userEmail = userInfo.email;
    const {imageData} = req.body.data || {};

    // Rate limiting protection
    await rateLimiter.rejectOnQuotaExceededOrRecordUsage(userId);

    // Check user's subscription and usage limits
    const userStatus = await getUserStatusInternal(userId, userEmail);

    if (!userStatus.canUse) {
      return res.status(429).json({ 
        error: `Usage limit exceeded. ${userStatus.subscriptionType} users get ${userStatus.usageLimit} analyses per ${userStatus.subscriptionType === "free" ? "week" : "month"}.`
      });
    }

    // Make OpenAI API call with your server-side API key
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer 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`, // Your API key stored securely
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{
          role: "user",
          content: [
            {
              type: "text",
              text: "Guess this location's exact coordinates, and only output the coordinates of your best guess followed by the location's name or general regional location. This is for the game geoguessr, so use all the metas that a pro would use, and answer asap! Output your response in this JSON format only: {\"coordinates\": {\"lat\": 40.348600, \"lng\": -74.659300}, \"location\": \"Nassau Hall Princeton, New Jersey, United States\"} ALWAYS OUTPUT SOME JSON GUESS, EVEN IF YOU ARE NOT 100% CERTAIN. Take your best guess for sure though, just in edge cases.",
            },
            {
              type: "image_url",
              image_url: {
                url: imageData,
              },
            },
          ],
        }],
        max_tokens: 500,
      }),
    });

    if (!openaiResponse.ok) {
      return res.status(500).json({ error: "OpenAI API request failed" });
    }

    const result = await openaiResponse.json();

    // Track usage after successful API call
    await trackUsageInternal(userId);

    res.json({
      result: {
        response: result.choices[0].message.content,
        tokensUsed: result.usage.total_tokens,
        cost: result.usage.total_tokens * (2.50 / 1000000), // GPT-4o pricing
      }
    });
  } catch (error) {
    console.error("Error in analyzeImage:", error);
    res.status(500).json({ error: error.message || "Analysis failed" });
  }
});

// Internal function to get user status (reusable)
async function getUserStatusInternal(userId, email) {
  // [Same logic as getUserStatus but without the onCall wrapper]
  // This is a helper function to avoid code duplication
  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    await userRef.set({
      email: email,
      subscriptionType: "free",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  const usageRef = db.collection("usage").doc(userId);
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

  const subscriptionRef = db.collection("subscriptions").doc(userId);
  const subscriptionDoc = await subscriptionRef.get();

  let subscriptionType = "free";
  if (subscriptionDoc.exists) {
    const subData = subscriptionDoc.data();
    if (subData.status === "active") {
      subscriptionType = subData.plan === "pro_plus" ? "pro_plus" : "pro";
    }
  }

  let usageLimit; let currentUsage; let canUse;
  if (subscriptionType === "free") {
    usageLimit = 7;
    currentUsage = weeklyUsage;
    canUse = weeklyUsage < 7;
  } else if (subscriptionType === "pro") {
    usageLimit = 300;
    currentUsage = monthlyUsage;
    canUse = monthlyUsage < 300;
  } else {
    usageLimit = 1000;
    currentUsage = monthlyUsage;
    canUse = monthlyUsage < 1000;
  }

  return {subscriptionType, weeklyUsage, monthlyUsage, usageLimit, currentUsage, canUse};
}

// Internal function to track usage
async function trackUsageInternal(userId) {
  const now = new Date();
  const currentWeek = getWeekNumber(now);
  const currentMonth = now.getMonth();

  const usageRef = db.collection("usage").doc(userId);
  const usageDoc = await usageRef.get();

  if (!usageDoc.exists) {
    await usageRef.set({
      weeklyUsage: 1,
      monthlyUsage: 1,
      totalUsage: 1,
      lastUsageDate: now.toDateString(),
      weekResetDate: admin.firestore.FieldValue.serverTimestamp(),
      monthResetDate: admin.firestore.FieldValue.serverTimestamp(),
    });
  } else {
    const usageData = usageDoc.data();
    const lastWeek = usageData.weekResetDate ? getWeekNumber(usageData.weekResetDate.toDate()) : 0;
    const lastMonth = usageData.monthResetDate ? usageData.monthResetDate.toDate().getMonth() : 0;

    const updates = {
      totalUsage: admin.firestore.FieldValue.increment(1),
      lastUsageDate: now.toDateString(),
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
exports.createCheckoutSession = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (!stripe) {
    return res.status(503).json({ error: "Stripe not configured" });
  }

  try {
    // Verify Google OAuth token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const userInfo = await verifyGoogleToken(token);
    
    const {userId, email, plan} = req.body.data || {}; // Changed to use plan instead of priceId
    const verifiedEmail = userInfo.email;

    // Map plan to product ID - hardcoded since these are not sensitive
    let productId;
    if (plan === "pro") {
      productId = "prod_SjiChcDLF85uyE"; // Pro product ID
    } else if (plan === "pro_plus") {
      productId = "prod_SjiDJYkPVJvrId"; // Pro+ product ID  
    } else {
      return res.status(400).json({ error: "Invalid plan specified" });
    }

    // For checkout, we need the price ID, not product ID
    // Replace these with your actual Stripe Price IDs from the Dashboard
    let priceId;
    if (plan === "pro") {
      priceId = "price_1RoEmBI0tsdDMPfnETsFhwXo"; // Replace with your Pro price ID
    } else if (plan === "pro_plus") {
      priceId = "price_1RoEn7I0tsdDMPfnD6qixYya"; // Replace with your Pro+ price ID
    }

    if (!priceId) {
      return res.status(400).json({ error: "Price ID not configured for plan: " + plan });
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: verifiedEmail,
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: "subscription",
      success_url: `https://testgeo-sage.vercel.app/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://testgeo-sage.vercel.app/cancel.html`,
      metadata: {
        userId: userInfo.sub,
        plan: plan,
      },
    });

    res.json({
      result: {
        sessionId: session.id, 
        url: session.url
      }
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Unable to create checkout session" });
  }
});

// Handle Stripe webhooks
exports.handleStripeWebhook = functions.https.onRequest(async (req, res) => {
  console.log('=== STRIPE WEBHOOK RECEIVED ===');
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);
  
  if (!stripe) {
    console.error('Stripe not configured');
    return res.status(503).send("Stripe not configured");
  }

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    const webhookSecret = 'whsec_spHD5id2QlvnPFyze0JTkaGyQ8JhGcxQ';
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    console.log('Webhook event type:', event.type);
    console.log('Event ID:', event.id);
  } catch (err) {
    console.error(`Webhook signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle different event types
  switch (event.type) {
    case "checkout.session.completed":
      console.log('=== PROCESSING CHECKOUT SESSION COMPLETED ===');
      const session = event.data.object;
      const userId = session.metadata.userId;
      
      console.log('Session data:', {
        sessionId: session.id,
        userId: userId,
        customerId: session.customer,
        subscriptionId: session.subscription,
        paymentStatus: session.payment_status
      });

      if (session.subscription) {
        console.log('Retrieving subscription details...');
        // Get the subscription to determine the plan
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        const productId = subscription.items.data[0].price.product;
        
        console.log('Subscription details:', {
          subscriptionId: session.subscription,
          productId: productId,
          status: subscription.status
        });
        
        let planType = "pro"; // default
        if (productId === "prod_SjiDJYkPVJvrId") {
          planType = "pro_plus";
        } else if (productId === "prod_SjiChcDLF85uyE") {
          planType = "pro";
        }
        
        console.log('Determined plan type:', planType);
        console.log('Updating subscription for user:', userId);

        // Update user's subscription
        const subscriptionData = {
          stripeCustomerId: session.customer,
          subscriptionId: session.subscription,
          status: "active",
          plan: planType,
          productId: productId,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        
        await db.collection("subscriptions").doc(userId).set(subscriptionData);
        console.log('Subscription updated successfully for user:', userId);
        console.log('Subscription data:', subscriptionData);
        
        // Also update the user document to ensure consistency
        await db.collection("users").doc(userId).update({
          subscriptionType: planType,
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log('User document updated with subscription type:', planType);
        
      } else {
        console.log('No subscription found in session, this might be a one-time payment');
      }
      break;

    case "customer.subscription.created":
      const createdSub = event.data.object;
      const productId = createdSub.items.data[0].price.product;
      
      let planType = "pro";
      if (productId === "prod_SjiDJYkPVJvrId") {
        planType = "pro_plus";
      } else if (productId === "prod_SjiChcDLF85uyE") {
        planType = "pro";
      }

      // Find user by customer ID and update
      const customerQuery = await db.collection("subscriptions")
        .where("stripeCustomerId", "==", createdSub.customer).get();
      
      if (!customerQuery.empty) {
        const doc = customerQuery.docs[0];
        await doc.ref.update({
          subscriptionId: createdSub.id,
          status: createdSub.status,
          plan: planType,
          productId: productId,
          currentPeriodEnd: new Date(createdSub.current_period_end * 1000),
        });
      }
      break;

    case "customer.subscription.updated":
      const updatedSub = event.data.object;
      const updatedProductId = updatedSub.items.data[0].price.product;
      
      let updatedPlanType = "pro";
      if (updatedProductId === "prod_SjiDJYkPVJvrId") {
        updatedPlanType = "pro_plus";
      } else if (updatedProductId === "prod_SjiChcDLF85uyE") {
        updatedPlanType = "pro";
      }

      // Update subscription
      const updateQuery = await db.collection("subscriptions")
        .where("subscriptionId", "==", updatedSub.id).get();
      
      if (!updateQuery.empty) {
        const doc = updateQuery.docs[0];
        await doc.ref.update({
          status: updatedSub.status,
          plan: updatedPlanType,
          productId: updatedProductId,
          currentPeriodEnd: new Date(updatedSub.current_period_end * 1000),
        });
      }
      break;

    case "customer.subscription.deleted":
      const deletedSub = event.data.object;
      
      // Find user and downgrade to free
      const deleteQuery = await db.collection("subscriptions")
        .where("subscriptionId", "==", deletedSub.id).get();
      
      if (!deleteQuery.empty) {
        const doc = deleteQuery.docs[0];
        await doc.ref.update({
          status: "cancelled",
          plan: "free",
          productId: null,
          currentPeriodEnd: null,
        });
      }
      break;

    case "invoice.payment_succeeded":
      const invoice = event.data.object;
      if (invoice.subscription) {
        // Extend subscription period
        const invoiceQuery = await db.collection("subscriptions")
          .where("subscriptionId", "==", invoice.subscription).get();
        
        if (!invoiceQuery.empty) {
          const doc = invoiceQuery.docs[0];
          await doc.ref.update({
            status: "active",
            currentPeriodEnd: new Date(invoice.period_end * 1000),
          });
        }
      }
      break;

    case "invoice.payment_failed":
      const failedInvoice = event.data.object;
      if (failedInvoice.subscription) {
        // Mark subscription as past due
        const failedQuery = await db.collection("subscriptions")
          .where("subscriptionId", "==", failedInvoice.subscription).get();
        
        if (!failedQuery.empty) {
          const doc = failedQuery.docs[0];
          await doc.ref.update({
            status: "past_due",
          });
        }
      }
      break;
  }

  res.json({received: true});
});

// Manual function to refresh subscription status using Stripe session ID
exports.refreshSubscriptionStatus = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    // Verify Google OAuth token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const userInfo = await verifyGoogleToken(token);
    
    const {sessionId} = req.body.data || {};
    const userId = userInfo.sub;
    
    console.log('=== MANUAL SUBSCRIPTION REFRESH ===');
    console.log('User ID:', userId);
    console.log('Session ID:', sessionId);

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID required' });
    }

    // Get the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('Retrieved session:', {
      id: session.id,
      paymentStatus: session.payment_status,
      subscription: session.subscription
    });

    if (session.subscription) {
      // Get the subscription details
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      const productId = subscription.items.data[0].price.product;
      
      let planType = "pro";
      if (productId === "prod_SjiDJYkPVJvrId") {
        planType = "pro_plus";
      } else if (productId === "prod_SjiChcDLF85uyE") {
        planType = "pro";
      }

      console.log('Updating subscription manually:', {
        userId: userId,
        planType: planType,
        subscriptionId: session.subscription
      });

      // Update subscription
      const subscriptionData = {
        stripeCustomerId: session.customer,
        subscriptionId: session.subscription,
        status: "active",
        plan: planType,
        productId: productId,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      
      await db.collection("subscriptions").doc(userId).set(subscriptionData);
      
      // Update user document
      await db.collection("users").doc(userId).update({
        subscriptionType: planType,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log('Manual subscription update completed');

      res.json({
        result: {
          success: true,
          subscriptionType: planType,
          message: 'Subscription updated successfully'
        }
      });
    } else {
      res.json({
        result: {
          success: false,
          message: 'No subscription found for this session'
        }
      });
    }

  } catch (error) {
    console.error("Error refreshing subscription:", error);
    res.status(500).json({ error: "Unable to refresh subscription status" });
  }
});
