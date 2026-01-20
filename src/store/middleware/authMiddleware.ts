import { Middleware } from '@reduxjs/toolkit';
import { firebaseAuthService } from '@/services/firebase/authService';
import { setCredentials, logout, setLoading } from '../slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState, AppDispatch } from '../index';

const AUTH_TOKEN_KEY = 'firebase_auth_token';
const USER_DATA_KEY = 'user_data';

/**
 * Middleware to sync Firebase authentication state with Redux store
 */
export const authMiddleware: Middleware<{}, RootState, AppDispatch> = (store) => (next) => async (action) => {
  // Handle auth actions
  if (setCredentials.match(action)) {
    // Save token and user data to AsyncStorage when credentials are set
    try {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, action.payload.token);
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(action.payload.user));
    } catch (error) {
      console.error('Failed to save auth data:', error);
    }
  }

  if (logout.match(action)) {
    // Clear AsyncStorage when logging out
    try {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_DATA_KEY);
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }
  }

  return next(action);
};

/**
 * Initialize auth state from Firebase and AsyncStorage
 * Should be called on app startup
 */
export const initializeAuthState = async (dispatch: AppDispatch): Promise<void> => {
  try {
    dispatch(setLoading(true));

    // Check Firebase auth state
    const firebaseUser = firebaseAuthService.getCurrentUser();
    
    if (firebaseUser) {
      // User is authenticated in Firebase
      const token = await firebaseUser.getIdToken();
      const user = await firebaseAuthService.getCurrentAppUser();

      if (user) {
        dispatch(setCredentials({ user, token }));
      }
    } else {
      // Check AsyncStorage for cached auth data
      const [token, userData] = await Promise.all([
        AsyncStorage.getItem(AUTH_TOKEN_KEY),
        AsyncStorage.getItem(USER_DATA_KEY),
      ]);

      if (token && userData) {
        // Try to restore from cache
        // Note: Token might be expired, Firebase will handle re-authentication if needed
        const user = JSON.parse(userData);
        dispatch(setCredentials({ user, token }));
      }
    }
  } catch (error) {
    console.error('Failed to initialize auth state:', error);
    // Clear potentially corrupted auth data
    await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
  } finally {
    dispatch(setLoading(false));
  }
};

/**
 * Setup Firebase auth state listener
 * Automatically syncs Firebase auth changes with Redux
 */
export const setupAuthStateListener = (dispatch: AppDispatch): (() => void) => {
  return firebaseAuthService.onAuthStateChanged(async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const token = await firebaseUser.getIdToken();
        const user = await firebaseAuthService.getCurrentAppUser();

        if (user) {
          dispatch(setCredentials({ user, token }));
        }
      } catch (error) {
        console.error('Failed to sync auth state:', error);
      }
    } else {
      // User signed out
      dispatch(logout());
    }
  });
};