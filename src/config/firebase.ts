import { initializeApp, getApps, FirebaseApp } from '@react-native-firebase/app';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

// Firebase configuration
// Note: For React Native Firebase, configuration is automatically loaded from:
// - Android: google-services.json
// - iOS: GoogleService-Info.plist

let app: FirebaseApp | null = null;

/**
 * Initialize Firebase app
 * Only initializes if not already initialized
 */
export const initializeFirebase = (): FirebaseApp => {
  if (app) {
    return app;
  }

  const apps = getApps();
  if (apps.length > 0) {
    app = apps[0];
    return app;
  }

  // Initialize Firebase
  // Configuration is automatically loaded from platform-specific files
  app = initializeApp();
  console.log('Firebase initialized successfully');
  
  return app;
};

/**
 * Get Firebase Auth instance
 */
export const getAuth = (): FirebaseAuthTypes.Module => {
  if (!app) {
    initializeFirebase();
  }
  return auth();
};

/**
 * Get current Firebase app instance
 */
export const getFirebaseApp = (): FirebaseApp => {
  if (!app) {
    return initializeFirebase();
  }
  return app;
};

export default {
  initializeFirebase,
  getAuth,
  getFirebaseApp,
};