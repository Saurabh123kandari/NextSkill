import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CourseDetailScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Course Detail Screen</Text>
      <Text style={styles.subtext}>This screen will show detailed course information</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});

export default CourseDetailScreen;
