/**
 * NextSkill - Education Application
 * A comprehensive learning platform for students
 */

import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from '@/navigation/AppNavigator';
import store from '@/store';
import { databaseService } from '@/services/database/DatabaseService';
import Toast from 'react-native-toast-message';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    // Initialize database
    const initDatabase = async () => {
      try {
        await databaseService.init();
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Database initialization failed:', error);
      }
    };

    initDatabase();
  }, []);

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <AppNavigator />
          <Toast />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}

export default App;
