import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppSelector } from '@/store/hooks';

// Import Screens
import LoginScreen from '@/screens/auth/LoginScreen';
import SignupScreen from '@/screens/auth/SignupScreen';
import HomeScreen from '@/screens/home/HomeScreen';
import LoadingScreen from '@/components/common/LoadingScreen';

// Import Types
import { RootStackParamList, AuthStackParamList } from '@/types';

const Stack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();

// Auth Stack Navigator
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
};

// Import TestPersistenceScreen
import TestPersistenceScreen from '@/screens/TestPersistenceScreen';

// Import Quiz Screens
import QuizCategoryScreen from '@/screens/quiz/QuizCategoryScreen';
import QuizScreen from '@/screens/quiz/QuizScreen';
import QuizResultScreen from '@/screens/quiz/QuizResultScreen';

// Import Profile Screen
import ProfileScreen from '@/screens/profile/ProfileScreen';

// Simple Main Navigator
const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#6200EE' },
        headerTintColor: '#FFFFFF',
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'NextSkill' }}
      />
      <Stack.Screen
        name="TestPersistence"
        component={TestPersistenceScreen}
        options={{ title: 'SQLite Persistence Test' }}
      />
      <Stack.Screen
        name="QuizCategory"
        component={QuizCategoryScreen}
        options={{ title: 'Select Category' }}
      />
      <Stack.Screen
        name="Quiz"
        component={QuizScreen}
        options={{
          title: 'Quiz',
          headerLeft: () => null, // Prevent back navigation during quiz
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="QuizResult"
        component={QuizResultScreen}
        options={{
          title: 'Results',
          headerLeft: () => null, // Prevent back navigation to quiz
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Stack.Navigator>
  );
};


// Root Navigator
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;