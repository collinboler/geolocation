// Firebase configuration for the extension
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth, signInAnonymously } from 'firebase/auth';

// Your Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com", 
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
const auth = getAuth(app);

// Firebase Functions
export const createUser = httpsCallable(functions, 'createUser');
export const processGeolocation = httpsCallable(functions, 'processGeolocation');
export const getUserUsage = httpsCallable(functions, 'getUserUsage');
export const updateSubscription = httpsCallable(functions, 'updateSubscription');

// Authentication
export async function authenticateUser() {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error('Firebase authentication failed:', error);
    throw error;
  }
}

// Usage tracking helpers
export async function checkUserUsage(extpayUserId) {
  try {
    const result = await getUserUsage({ extpayUserId });
    return result.data;
  } catch (error) {
    console.error('Error checking usage:', error);
    throw error;
  }
}

export async function processGeolocationRequest(extpayUserId, imageData) {
  try {
    const result = await processGeolocation({ 
      extpayUserId, 
      imageData 
    });
    return result.data;
  } catch (error) {
    console.error('Error processing geolocation:', error);
    throw error;
  }
}
