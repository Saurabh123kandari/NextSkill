import { getAuth } from '@/config/firebase';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { User } from '@/types';

export interface SignInResult {
  user: User;
  token: string;
}

export interface AuthError {
  code: string;
  message: string;
}

/**
 * Firebase Authentication Service
 * Handles all authentication operations with Firebase
 */
class FirebaseAuthService {
  private auth = getAuth();

  /**
   * Sign in with email and password
   */
  async signInWithEmail(email: string, password: string): Promise<SignInResult> {
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();

      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || email.split('@')[0],
        avatar: firebaseUser.photoURL || undefined,
        role: 'student', // Default role, can be updated from Firestore later
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return { user, token };
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign up with email and password
   */
  async signUpWithEmail(
    email: string,
    password: string,
    name: string
  ): Promise<SignInResult> {
    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      const firebaseUser = userCredential.user;

      // Update user profile with display name
      await firebaseUser.updateProfile({
        displayName: name,
      });

      const token = await firebaseUser.getIdToken();

      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: name,
        avatar: firebaseUser.photoURL || undefined,
        role: 'student',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return { user, token };
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign in with Google
   * Note: Requires @react-native-google-signin/google-signin package
   */
  async signInWithGoogle(): Promise<SignInResult> {
    try {
      // Import Google Sign-In dynamically to avoid errors if not installed
      const { GoogleSignin } = require('@react-native-google-signin/google-signin');
      
      // Check if Google Play Services are available
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Get user info from Google Sign-In
      const userInfo = await GoogleSignin.signIn();
      
      if (!userInfo.idToken) {
        throw new Error('Google Sign-In failed: No ID token received');
      }

      // Create Firebase credential
      const googleCredential = this.auth.GoogleAuthProvider.credential(userInfo.idToken);

      // Sign in to Firebase with Google credential
      const userCredential = await this.auth.signInWithCredential(googleCredential);
      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();

      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || 'User',
        avatar: firebaseUser.photoURL || undefined,
        role: 'student',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return { user, token };
    } catch (error: any) {
      // If Google Sign-In package is not installed, provide helpful error
      if (error.message?.includes('Cannot find module')) {
        throw new Error(
          'Google Sign-In is not configured. Please install @react-native-google-signin/google-signin'
        );
      }
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      await this.auth.signOut();
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await this.auth.sendPasswordResetEmail(email);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): FirebaseAuthTypes.User | null {
    return this.auth.currentUser;
  }

  /**
   * Get current user as app User type
   */
  async getCurrentAppUser(): Promise<User | null> {
    const firebaseUser = this.getCurrentUser();
    if (!firebaseUser) {
      return null;
    }

    const token = await firebaseUser.getIdToken();
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      avatar: firebaseUser.photoURL || undefined,
      role: 'student',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Get current user's ID token
   */
  async getCurrentUserToken(): Promise<string | null> {
    const user = this.getCurrentUser();
    if (!user) {
      return null;
    }
    return user.getIdToken();
  }

  /**
   * Listen to authentication state changes
   */
  onAuthStateChanged(
    callback: (user: FirebaseAuthTypes.User | null) => void
  ): () => void {
    return this.auth.onAuthStateChanged(callback);
  }

  /**
   * Handle Firebase authentication errors and convert to user-friendly messages
   */
  private handleAuthError(error: any): AuthError {
    let code = error.code || 'unknown';
    let message = 'An error occurred during authentication';

    switch (code) {
      case 'auth/email-already-in-use':
        message = 'This email is already registered. Please sign in instead.';
        break;
      case 'auth/invalid-email':
        message = 'Please enter a valid email address.';
        break;
      case 'auth/operation-not-allowed':
        message = 'This sign-in method is not enabled. Please contact support.';
        break;
      case 'auth/weak-password':
        message = 'Password is too weak. Please use a stronger password.';
        break;
      case 'auth/user-disabled':
        message = 'This account has been disabled. Please contact support.';
        break;
      case 'auth/user-not-found':
        message = 'No account found with this email address.';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password. Please try again.';
        break;
      case 'auth/invalid-credential':
        message = 'Invalid email or password. Please try again.';
        break;
      case 'auth/network-request-failed':
        message = 'Network error. Please check your internet connection.';
        break;
      case 'auth/too-many-requests':
        message = 'Too many failed attempts. Please try again later.';
        break;
      case 'auth/user-token-expired':
        message = 'Your session has expired. Please sign in again.';
        break;
      case 'auth/requires-recent-login':
        message = 'Please sign in again to complete this action.';
        break;
      default:
        message = error.message || 'An unexpected error occurred. Please try again.';
    }

    return { code, message };
  }
}

export const firebaseAuthService = new FirebaseAuthService();
export default firebaseAuthService;