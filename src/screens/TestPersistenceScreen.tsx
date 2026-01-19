import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import CourseListWithPersistence from '@/components/course/CourseListWithPersistence';

const TestPersistenceScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Courses with SQLite Persistence</Text>
      <CourseListWithPersistence />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#333',
  }
});

export default TestPersistenceScreen;