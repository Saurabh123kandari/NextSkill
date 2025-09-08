import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import store from './src/store';

import CoursesScreen from './src/features/courses/CoursesScreen';
// You should create this screen or replace with your actual detail screen
import CourseDetailScreen from './src/features/courses/CourseDetailScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Courses">
          <Stack.Screen name="Courses" component={CoursesScreen} />
          <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;