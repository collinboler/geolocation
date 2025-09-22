const {onRequest, onCall, HttpsError} = require("firebase-functions/v2/https");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore, FieldValue} = require("firebase-admin/firestore");
const OpenAI = require("openai");
const cors = require("cors")({origin: true});

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();

// Usage limits by subscription type
const USAGE_LIMITS = {
  free: {limit: 3, period: "week"}, // 3 per week for trial users
  standard: {limit: 100, period: "month"}, // 100 per month
  pro: {limit: 1000, period: "month"}, // 1000 per month
};

/**
 * Create or update user in Firestore when they first use the extension
 */
exports.createUser = onCall(async (request) => {
  const {extpayUserId, email} = request.data;

  if (!extpayUserId) {
    throw new HttpsError("invalid-argument", "ExtPay User ID is required");
  }

  try {
    const userRef = db.collection("users").doc(extpayUserId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      // Create new user
      const userData = {
        extpayUserId,
        email: email || null,
        subscriptionType: "free",
        subscriptionStatus: "trial",
        createdAt: new Date(),
        updatedAt: new Date(),
        usage: {
          current: 0,
          resetDate: getNextResetDate("week"),
          history: [],
        },
      };

      await userRef.set(userData);
      return {success: true, user: userData};
    } else {
      // User exists, update last seen
      await userRef.update({
        updatedAt: new Date(),
        ...(email && {email}),
      });
      return {success: true, user: userDoc.data()};
    }
  } catch (error) {
    console.error("Error creating/updating user:", error);
    throw new HttpsError("internal", "Failed to create/update user");
  }
});

/**
 * Update user subscription status (called via ExtPay webhooks)
 */
exports.updateSubscription = onCall(async (request) => {
  const {extpayUserId, subscriptionStatus, subscriptionType, isCancelled, isPastDue} = request.data;

  if (!extpayUserId) {
    throw new HttpsError("invalid-argument", "ExtPay User ID is required");
  }

  try {
    const userRef = db.collection("users").doc(extpayUserId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();
    
    console.log(`UpdateSubscription for ${extpayUserId}:`, {
      subscriptionStatus,
      subscriptionType,
      isCancelled,
      isPastDue,
      existingData: userData
    });
    
    const updates = {
      updatedAt: new Date(),
    };

    if (subscriptionStatus) {
      updates.subscriptionStatus = subscriptionStatus;
    }

    // Add subscription status flags
    if (typeof isCancelled !== 'undefined') {
      updates.isCancelled = isCancelled;
    }

    if (typeof isPastDue !== 'undefined') {
      updates.isPastDue = isPastDue;
    }

    if (subscriptionType) {
      // Only reset usage if subscription type actually changed
      const currentSubscriptionType = userData?.subscriptionType;
      if (currentSubscriptionType !== subscriptionType) {
        console.log(`Subscription type changed from ${currentSubscriptionType} to ${subscriptionType}, resetting usage`);
        updates.subscriptionType = subscriptionType;
        
        // For pro subscriptions, use current date as the subscription start date
        // For other types, use default calculation
        const subscriptionStartDate = subscriptionType === 'pro' ? new Date() : null;
        
        updates.usage = {
          current: 0,
          resetDate: getNextResetDate(USAGE_LIMITS[subscriptionType]?.period || "month", subscriptionStartDate),
          history: [],
        };
        
        // Store subscription start date for pro users for future reset calculations
        if (subscriptionType === 'pro') {
          updates.proSubscriptionStartDate = new Date();
        }
      } else {
        // Just update subscription type without resetting usage
        updates.subscriptionType = subscriptionType;
      }
    }

    await userRef.update(updates);
    console.log(`UpdateSubscription completed for ${extpayUserId}:`, updates);
    return {success: true};
  } catch (error) {
    console.error("Error updating subscription:", error);
    throw new HttpsError("internal", "Failed to update subscription");
  }
});

/**
 * Main function to process geolocation requests
 */
exports.processGeolocation = onCall(async (request) => {
  const {extpayUserId, imageData} = request.data;

  if (!extpayUserId || !imageData) {
    throw new HttpsError("invalid-argument", "User ID and image data are required");
  }

  try {
    // Get user and check subscription/usage
    const userRef = db.collection("users").doc(extpayUserId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new HttpsError("not-found", "User not found");
    }

    const userData = userDoc.data();

    // Check usage limits first (includes free users)
    const usageCheck = await checkUsageLimit(userData, userRef);
    
    // If usage was reset, reload user data to get updated counts
    let currentUserData = userData;
    if (usageCheck.wasReset) {
      const updatedUserDoc = await userRef.get();
      currentUserData = updatedUserDoc.data();
      console.log(`Usage was reset, reloaded user data. New usage: ${currentUserData.usage?.current || 0}`);
    }
    
    if (!usageCheck.allowed) {
      // For free users, provide upgrade options in the error message
      const subscriptionType = currentUserData.subscriptionType || "free";
      if (subscriptionType === "free") {
        // Handle Firestore timestamp properly
        let resetDate = 'next week';
        if (currentUserData.usage?.resetDate) {
          try {
            // Check if it's a Firestore timestamp object
            if (currentUserData.usage.resetDate._seconds) {
              resetDate = new Date(currentUserData.usage.resetDate._seconds * 1000).toLocaleDateString();
            } else {
              resetDate = new Date(currentUserData.usage.resetDate).toLocaleDateString();
            }
          } catch (e) {
            console.error('Error parsing reset date:', e);
            resetDate = 'next week';
          }
        }
        throw new HttpsError("resource-exhausted", 
          `Free limit reached! You've used ${currentUserData.usage?.current || 0}/3 weekly guesses. Upgrade for unlimited guesses or wait until ${resetDate} for reset.`);
      } else {
        throw new HttpsError("resource-exhausted", usageCheck.message);
      }
    }

    // For paid users, ensure they have valid subscription
    const subscriptionType = currentUserData.subscriptionType || "free";
    if (subscriptionType !== "free" && !hasValidAccess(currentUserData)) {
      throw new HttpsError("permission-denied", "Active subscription required");
    }

    // Get the OpenAI API key from Secret Manager
    const {SecretManagerServiceClient} = require("@google-cloud/secret-manager");
    const secretClient = new SecretManagerServiceClient();
    
    const [version] = await secretClient.accessSecretVersion({
      name: "projects/geoguesser-hacker-ext/secrets/OPENAI_API_KEY/versions/latest",
    });
    
    const apiKey = version.payload.data.toString();
    
    // Process the geolocation request with OpenAI
    const geoResult = await processWithOpenAI(imageData, apiKey);

    // Record usage
    console.log("Recording usage for user:", extpayUserId, "Current usage before:", currentUserData.usage?.current || 0);
    await recordUsage(userRef, currentUserData, geoResult);

    // Get updated usage after recording
    const updatedUserDoc = await userRef.get();
    const updatedUserData = updatedUserDoc.data();
    console.log("Usage after recording:", updatedUserData.usage?.current || 0);

    return {
      success: true,
      result: geoResult,
      usage: {
        current: updatedUserData.usage.current,
        limit: USAGE_LIMITS[currentUserData.subscriptionType]?.limit || 3,
        resetDate: currentUserData.usage.resetDate,
      },
    };
  } catch (error) {
    console.error("Error processing geolocation:", error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Failed to process geolocation request");
  }
});

/**
 * Get user usage statistics
 */
exports.getUserUsage = onCall(async (request) => {
  const {extpayUserId} = request.data;

  if (!extpayUserId) {
    throw new HttpsError("invalid-argument", "User ID is required");
  }

  try {
    const userDoc = await db.collection("users").doc(extpayUserId).get();

    if (!userDoc.exists) {
      throw new HttpsError("not-found", "User not found");
    }

    const userData = userDoc.data();
    const subscriptionType = userData.subscriptionType || "free";
    const limit = USAGE_LIMITS[subscriptionType]?.limit || 3;

    console.log(`GetUserUsage for ${extpayUserId}:`, {
      storedSubscriptionType: userData.subscriptionType,
      storedSubscriptionStatus: userData.subscriptionStatus,
      storedIsCancelled: userData.isCancelled,
      storedIsPastDue: userData.isPastDue,
      calculatedLimit: limit
    });

    // Fix incorrect reset dates for pro users (migration logic)
    let resetDate = userData.usage?.resetDate;
    if (subscriptionType === 'pro' && resetDate) {
      const now = new Date();
      let currentResetDate;
      
      // Parse the current reset date
      if (resetDate._seconds) {
        currentResetDate = new Date(resetDate._seconds * 1000);
      } else {
        currentResetDate = new Date(resetDate);
      }
      
      // Check if this looks like a calendar month reset (1st of month) for a pro user
      // If it's the 1st of a month and they don't have a proSubscriptionStartDate, fix it
      if (currentResetDate.getDate() === 1 && !userData.proSubscriptionStartDate) {
        console.log(`Fixing incorrect reset date for pro user ${extpayUserId}`);
        
        // Set their subscription start date to 30 days before the current reset date
        const subscriptionStartDate = new Date(currentResetDate);
        subscriptionStartDate.setDate(currentResetDate.getDate() - 30);
        
        // Calculate correct reset date (30 days from now)
        const correctResetDate = new Date(now);
        correctResetDate.setDate(now.getDate() + 30);
        correctResetDate.setHours(0, 0, 0, 0);
        
        // Update the user's data
        await userDoc.ref.update({
          'usage.resetDate': correctResetDate,
          'proSubscriptionStartDate': subscriptionStartDate,
          'updatedAt': now
        });
        
        resetDate = correctResetDate;
        console.log(`Updated pro user ${extpayUserId} reset date to ${correctResetDate.toLocaleDateString()}`);
      }
    }

    return {
      current: userData.usage?.current || 0,
      limit,
      resetDate: resetDate,
      subscriptionType,
      subscriptionStatus: userData.subscriptionStatus,
      isCancelled: userData.isCancelled || false,
      isPastDue: userData.isPastDue || false,
    };
  } catch (error) {
    console.error("Error getting user usage:", error);
    throw new HttpsError("internal", "Failed to get user usage");
  }
});

/**
 * TEST FUNCTION: Manually trigger reset for a specific user (for testing)
 */
exports.testResetUser = onCall(async (request) => {
  const {extpayUserId} = request.data;
  
  if (!extpayUserId) {
    throw new HttpsError("invalid-argument", "User ID is required");
  }
  
  try {
    const userRef = db.collection("users").doc(extpayUserId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      throw new HttpsError("not-found", "User not found");
    }
    
    const userData = userDoc.data();
    const subscriptionType = userData.subscriptionType || "free";
    
    // Set reset date to yesterday to trigger auto-reset on next request
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    await userRef.update({
      "usage.resetDate": yesterday,
      updatedAt: new Date(),
    });
    
    return {
      success: true,
      message: `Reset date set to yesterday for user ${extpayUserId}. Next request will trigger auto-reset.`,
      subscriptionType,
      oldResetDate: userData.usage?.resetDate,
      newResetDate: yesterday,
    };
  } catch (error) {
    console.error("Error in test reset:", error);
    throw new HttpsError("internal", "Failed to set test reset date");
  }
});

/**
 * Reset usage counters (scheduled function)
 */
exports.resetUsageCounters = onRequest(async (req, res) => {
  return cors(req, res, async () => {
    try {
      const now = new Date();
      const usersRef = db.collection("users");

      // Get users whose reset date has passed
      const snapshot = await usersRef
          .where("usage.resetDate", "<=", now)
          .get();

      const batch = db.batch();
      let resetCount = 0;

      snapshot.forEach((doc) => {
        const userData = doc.data();
        const subscriptionType = userData.subscriptionType || "free";
        const period = USAGE_LIMITS[subscriptionType]?.period || "week";
        
        // For pro users, calculate next reset from their subscription start date
        let nextResetDate;
        if (subscriptionType === 'pro' && userData.proSubscriptionStartDate) {
          // Calculate how many 30-day periods have passed since subscription start
          const subscriptionStart = userData.proSubscriptionStartDate.toDate();
          const daysSinceStart = Math.floor((now - subscriptionStart) / (1000 * 60 * 60 * 24));
          const periodsPassed = Math.floor(daysSinceStart / 30);
          
          // Next reset is (periodsPassed + 1) * 30 days from subscription start
          const nextResetFromStart = new Date(subscriptionStart);
          nextResetFromStart.setDate(subscriptionStart.getDate() + ((periodsPassed + 1) * 30));
          nextResetDate = nextResetFromStart;
        } else {
          // Use default calculation for free/trial users
          nextResetDate = getNextResetDate(period);
        }

        batch.update(doc.ref, {
          "usage.current": 0,
          "usage.resetDate": nextResetDate,
          updatedAt: now,
        });
        resetCount++;
      });

      await batch.commit();

      res.json({
        success: true,
        message: `Reset usage for ${resetCount} users`,
      });
    } catch (error) {
      console.error("Error resetting usage counters:", error);
      res.status(500).json({error: "Failed to reset usage counters"});
    }
  });
});

// Helper Functions

/**
 * Calculate image token cost based on OpenAI vision pricing for GPT-5-mini
 * Uses 32px patch-based calculation with 1.62 multiplier
 */
function calculateImageTokenCost(imageWidth, imageHeight, detail = "low") {
  // A. Calculate the number of 32px x 32px patches needed
  const rawPatches = Math.ceil(imageWidth / 32) * Math.ceil(imageHeight / 32);
  
  let finalPatches = rawPatches;
  let scaledWidth = imageWidth;
  let scaledHeight = imageHeight;
  
  // B. If patches exceed 1536, scale down the image
  if (rawPatches > 1536) {
    // Calculate shrink factor
    const r = Math.sqrt((32 * 32 * 1536) / (imageWidth * imageHeight));
    
    // Apply initial scaling
    const initialWidth = imageWidth * r;
    const initialHeight = imageHeight * r;
    
    // Ensure we fit in whole number of patches
    const patchesWidth = initialWidth / 32;
    const patchesHeight = initialHeight / 32;
    const adjustmentFactor = Math.min(
      Math.floor(patchesWidth) / patchesWidth,
      Math.floor(patchesHeight) / patchesHeight
    );
    
    // Final scaled dimensions
    scaledWidth = Math.floor(initialWidth * adjustmentFactor);
    scaledHeight = Math.floor(initialHeight * adjustmentFactor);
    
    // C. Calculate final patches
    finalPatches = Math.ceil(scaledWidth / 32) * Math.ceil(scaledHeight / 32);
  }
  
  // Cap at maximum of 1536 patches
  const imageTokens = Math.min(finalPatches, 1536);
  
  // D. Apply GPT-5-nano multiplier (2.46)
  const multiplier = 2.46;
  const totalTokens = Math.round(imageTokens * multiplier);
  
  console.log('GPT-5-nano token calculation:', {
    imageWidth,
    imageHeight,
    rawPatches,
    scaledWidth,
    scaledHeight,
    finalPatches,
    imageTokens,
    multiplier,
    totalTokens
  });
  
  return totalTokens;
}

/**
 * Extract image dimensions from base64 data URL
 */
async function getImageDimensions(dataUrl) {
  const sharp = require('sharp');
  
  try {
    // Extract base64 data from data URL
    const base64Data = dataUrl.split(',')[1];
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    // Use Sharp to get image metadata
    const metadata = await sharp(imageBuffer).metadata();
    
    return {
      width: metadata.width,
      height: metadata.height
    };
  } catch (error) {
    console.error('Error getting image dimensions:', error);
    // Fallback to reasonable defaults if we can't get dimensions
    return {
      width: 1920,
      height: 1080
    };
  }
}

/**
 * Process image with OpenAI
 */
async function processWithOpenAI(imageData, apiKey) {
  try {
    // Get image dimensions for accurate cost calculation
    const imageDimensions = await getImageDimensions(imageData);
    console.log('Image dimensions:', imageDimensions);
    
    // Calculate image token cost based on OpenAI vision pricing
    const imageTokens = calculateImageTokenCost(imageDimensions.width, imageDimensions.height, "low");
    console.log('Calculated image tokens:', imageTokens);
    
    // Initialize OpenAI with the provided API key
    const openai = new OpenAI({
      apiKey: apiKey,
    });
    
    const response = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Look at this image carefully and identify the location. Analyze any visible text, signs, architecture, landscape, vegetation, vehicles, and other clues to determine where this photo was taken. Use your knowledge like a professional GeoGuessr player.

Provide your best guess for the exact coordinates and location name in this JSON format:
{"coordinates": {"lat": 40.348600, "lng": -74.659300}, "location": "Nassau Hall Princeton, New Jersey, United States"}

Even if you're not 100% certain, make your best educated guess based on the visual evidence. ALWAYS response with JSON format or some location, no matter what.`,
            },
            {
              type: "image_url",
              image_url: {
                url: imageData,
                detail: "high"
              },
            },
          ],
        },
      ],
      max_completion_tokens: 3000,
    });

    // Debug the full response structure
    console.log('Full OpenAI response structure:', {
      choices: response.choices,
      usage: response.usage,
      model: response.model,
      object: response.object
    });

    const responseText = response.choices[0]?.message?.content;
    const textTokens = response.usage?.completion_tokens || 0;
    const totalTokens = imageTokens + textTokens;
    
    console.log('Response parsing:', {
      choicesLength: response.choices?.length,
      firstChoice: response.choices?.[0],
      messageContent: responseText,
      contentLength: responseText?.length
    });
    
    // GPT-5-nano pricing: Input $0.15 per 1M tokens, Output $1.00 per 1M tokens  
    const inputCost = (imageTokens * 0.15) / 1000000;
    const outputCost = (textTokens * 1.00) / 1000000;
    const totalCost = inputCost + outputCost;
    
    console.log('Token breakdown:', {
      imageTokens,
      textTokens,
      totalTokens,
      inputCost,
      outputCost,
      totalCost
    });

    if (!responseText) {
      console.error("Empty response from OpenAI, using fallback. Response text:", responseText);
      return {
        coordinates: { lat: 0, lng: 0 },
        location: "Technical Error - Please Try Again",
        tokensUsed: totalTokens,
        cost: totalCost,
        rawResponse: "Empty response"
      };
    }

    // Parse the JSON response
    let locationData;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        locationData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      // Fallback parsing
      const coordMatch = responseText.match(/(\d+\.\d+)[,\s]+(-?\d+\.\d+)/);
      if (coordMatch) {
        locationData = {
          coordinates: {
            lat: parseFloat(coordMatch[1]),
            lng: parseFloat(coordMatch[2]),
          },
          location: responseText.replace(coordMatch[0], "").trim(),
        };
      } else {
        console.error("Failed to parse response:", responseText);
        throw new Error("Could not parse location from response");
      }
    }

    return {
      coordinates: locationData.coordinates,
      location: locationData.location,
      tokensUsed: totalTokens,
      cost: totalCost,
      rawResponse: responseText,
    };
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new HttpsError("internal", "Failed to process image with AI");
  }
}

/**
 * Check if user has valid access
 */
function hasValidAccess(userData) {
  const status = userData.subscriptionStatus;
  return status === "trial" || status === "active" || status === "paid";
}

/**
 * Check usage limits
 */
async function checkUsageLimit(userData, userRef = null) {
  const subscriptionType = userData.subscriptionType || "free";
  const usage = userData.usage || {current: 0};
  const limit = USAGE_LIMITS[subscriptionType]?.limit || 3;
  const now = new Date();

  // Check if reset date has passed and automatically reset usage
  if (userData.usage?.resetDate) {
    let resetDate;
    if (userData.usage.resetDate._seconds) {
      resetDate = new Date(userData.usage.resetDate._seconds * 1000);
    } else {
      resetDate = new Date(userData.usage.resetDate);
    }

    // If reset date has passed, automatically reset usage
    if (now >= resetDate && userRef) {
      console.log(`Auto-resetting usage for user - reset date ${resetDate.toLocaleDateString()} has passed`);
      
      // Calculate next reset date
      const period = USAGE_LIMITS[subscriptionType]?.period || "week";
      let nextResetDate;
      
      if (subscriptionType === 'pro' && userData.proSubscriptionStartDate) {
        // For pro users, calculate from subscription start date
        const subscriptionStart = userData.proSubscriptionStartDate.toDate ? 
          userData.proSubscriptionStartDate.toDate() : 
          new Date(userData.proSubscriptionStartDate);
        const daysSinceStart = Math.floor((now - subscriptionStart) / (1000 * 60 * 60 * 24));
        const periodsPassed = Math.floor(daysSinceStart / 30);
        
        nextResetDate = new Date(subscriptionStart);
        nextResetDate.setDate(subscriptionStart.getDate() + ((periodsPassed + 1) * 30));
      } else {
        // For free/trial users, use standard calculation
        nextResetDate = getNextResetDate(period);
      }

      // Reset usage to 0 and update reset date
      await userRef.update({
        "usage.current": 0,
        "usage.resetDate": nextResetDate,
        updatedAt: now,
      });

      console.log(`Usage reset to 0, next reset: ${nextResetDate.toLocaleDateString()}`);
      
      // Return that usage is allowed since we just reset
      return {allowed: true, wasReset: true};
    }
  }

  // Normal usage limit check
  if (usage.current >= limit) {
    const period = USAGE_LIMITS[subscriptionType]?.period || "week";
    let resetDateString = 'soon';
    
    if (userData.usage?.resetDate) {
      try {
        let resetDate;
        if (userData.usage.resetDate._seconds) {
          resetDate = new Date(userData.usage.resetDate._seconds * 1000);
        } else {
          resetDate = new Date(userData.usage.resetDate);
        }
        resetDateString = resetDate.toLocaleDateString();
      } catch (e) {
        console.error('Error parsing reset date:', e);
      }
    }

    return {
      allowed: false,
      message: `You've reached your ${period}ly limit of ${limit} requests. Resets on ${resetDateString}.`,
    };
  }

  return {allowed: true};
}

/**
 * Record usage in Firestore
 */
async function recordUsage(userRef, userData, geoResult) {
  const now = new Date();
  const usageEntry = {
    timestamp: now,
    tokensUsed: geoResult.tokensUsed,
    cost: geoResult.cost,
    coordinates: geoResult.coordinates,
  };

  // Use atomic increment for usage counter and update history
  await userRef.update({
    "usage.current": FieldValue.increment(1),
    "usage.history": FieldValue.arrayUnion(usageEntry),
    updatedAt: now,
  });
}

/**
 * Calculate next reset date
 */
function getNextResetDate(period, fromDate = null) {
  const baseDate = fromDate ? new Date(fromDate) : new Date();
  const resetDate = new Date(baseDate);

  if (period === "week") {
    // Reset every Monday for free trial users
    const daysUntilMonday = (8 - baseDate.getDay()) % 7;
    resetDate.setDate(baseDate.getDate() + (daysUntilMonday || 7));
  } else if (period === "month") {
    // Reset 30 days from the base date (subscription date for pro users)
    resetDate.setDate(baseDate.getDate() + 30);
  }

  resetDate.setHours(0, 0, 0, 0);
  return resetDate;
}
