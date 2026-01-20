# Firebase Authentication Setup Guide

This guide will help you complete the Firebase Authentication setup for the NextSkill education app.

## Prerequisites

- Firebase project created in [Firebase Console](https://console.firebase.google.com/)
- Android app registered in Firebase Console
- iOS app registered in Firebase Console (for iOS development)

## Android Setup

### 1. Download google-services.json

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on the Android app (or add one if not exists)
4. Download the `google-services.json` file
5. Place it in: `android/app/google-services.json`

**Note:** The file should already be present. If you need to update it, replace the existing file.

### 2. Verify Android Configuration

The following should already be configured:

- ✅ `android/build.gradle` - Google Services classpath
- ✅ `android/app/build.gradle` - Google Services plugin
- ✅ `android/app/google-services.json` - Firebase config file

### 3. Enable Authentication Methods

1. Go to Firebase Console → Authentication → Sign-in method
2. Enable the following providers:
   - **Email/Password** - Enable this
   - **Google** - Enable and configure OAuth consent screen

## iOS Setup (Optional - for iOS development)

### 1. Download GoogleService-Info.plist

1. Go to Firebase Console
2. Select your project
3. Click on the iOS app (or add one if not exists)
4. Download the `GoogleService-Info.plist` file
5. Place it in: `ios/NextSkill/GoogleService-Info.plist`

### 2. Configure iOS Project

1. Open `ios/NextSkill.xcworkspace` in Xcode
2. Drag `GoogleService-Info.plist` into the project
3. Ensure it's added to the target

### 3. Install Pods

```bash
cd ios
pod install
cd ..
```

## Google Sign-In Setup

### 1. Install Google Sign-In Package

```bash
yarn add @react-native-google-signin/google-signin
```

### 2. Configure Google Sign-In

#### Android

1. Go to Firebase Console → Authentication → Sign-in method → Google
2. Copy the Web client ID (OAuth 2.0 Client ID)
3. Add to `android/app/src/main/res/values/strings.xml`:

```xml
<resources>
    <string name="default_web_client_id">YOUR_WEB_CLIENT_ID</string>
</resources>
```

#### iOS

1. Go to Firebase Console → Authentication → Sign-in method → Google
2. Copy the iOS client ID
3. Configure in Xcode project settings

### 3. Initialize Google Sign-In

The Firebase auth service will automatically handle Google Sign-In initialization. Make sure the package is installed.

## Testing Authentication

### Email/Password Authentication

1. **Sign Up:**
   - Open the app
   - Navigate to Sign Up screen
   - Enter name, email, and password
   - Tap "Create Account"

2. **Sign In:**
   - Navigate to Login screen
   - Enter email and password
   - Tap "Sign In"

3. **Password Reset:**
   - On Login screen, tap "Forgot Password?"
   - Enter your email
   - Check email for reset link

### Google Sign-In

1. Tap "Continue with Google" button
2. Select Google account
3. Grant permissions
4. Should automatically sign in

## Troubleshooting

### Common Issues

1. **"Google Sign-In is not configured"**
   - Install `@react-native-google-signin/google-signin` package
   - Configure Google Sign-In as described above

2. **"Firebase initialization failed"**
   - Verify `google-services.json` is in correct location
   - Check that Google Services plugin is applied in `build.gradle`
   - Clean and rebuild: `yarn clean:android && yarn android`

3. **"Email already in use"**
   - User already exists, try signing in instead
   - Or use password reset if forgotten

4. **"Invalid email or password"**
   - Verify email format
   - Check password meets requirements (min 6 characters)
   - Ensure user exists in Firebase Console

### Debug Steps

1. Check Firebase Console → Authentication → Users to see registered users
2. Check app logs for detailed error messages
3. Verify network connectivity
4. Ensure Firebase project is active and billing is enabled (if required)

## Security Notes

- Never commit `google-services.json` or `GoogleService-Info.plist` with sensitive data to public repos
- Use environment variables for different Firebase projects (dev/staging/prod)
- Enable Firebase App Check for additional security
- Implement proper error handling for production

## Next Steps

- Set up Firestore for user profiles and course data
- Configure Firebase Cloud Messaging for push notifications
- Implement Firebase Analytics for user tracking
- Set up Firebase Storage for course media files

## Support

For more information, refer to:
- [React Native Firebase Documentation](https://rnfirebase.io/)
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Google Sign-In Documentation](https://developers.google.com/identity/sign-in/web/sign-in)