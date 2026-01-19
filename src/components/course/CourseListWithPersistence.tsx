import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useGetCoursesQuery } from '@/store/api/courseApiWithPersistence';
import { database } from '@/services/database/database';
import { Course, PaginatedResponse } from '@/types';

interface CourseWithOffline extends Course {
  offline?: boolean;
  imageUrl?: string;
  thumbnail?: string;
  difficulty?: string;
  level?: string;
}

const CourseListWithPersistence = () => {
  // Initialize the database when component mounts
  useEffect(() => {
    const initDatabase = async () => {
      await database.init();
      console.log('Database initialized in CourseListWithPersistence');
    };
    
    initDatabase();
  }, []);

  // Fetch courses with SQLite persistence
  const { data, error, isLoading, refetch } = useGetCoursesQuery({ page: 1, limit: 10 });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading courses...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error loading courses</Text>
        <Text style={styles.errorDetails}>{JSON.stringify(error)}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
        <Text style={styles.offlineNote}>
          Note: If you're offline, data will be loaded from local storage if available.
        </Text>
      </View>
    );
  }

  const courses: CourseWithOffline[] = data?.items || [];
  const isOfflineData: boolean = data?.offline || false;

  return (
    <View style={styles.container}>
      {isOfflineData && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>You are viewing offline data</Text>
        </View>
      )}
      
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.courseItem}>
            <Text style={styles.courseTitle}>{item.title}</Text>
            <Text style={styles.courseDescription}>{item.description}</Text>
            <View style={styles.courseDetails}>
              <Text style={styles.courseCategory}>{item.category}</Text>
              <Text style={styles.courseDifficulty}>
                {item.difficulty || item.level || 'Beginner'}
              </Text>
              <Text style={styles.courseDuration}>{item.duration} min</Text>
              {item.offline && (
                <View style={styles.offlineIndicator}>
                  <Text style={styles.offlineIndicatorText}>Offline</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No courses available</Text>
          </View>
        }
      />
      
      <TouchableOpacity style={styles.refreshButton} onPress={() => refetch()}>
        <Text style={styles.refreshText}>Refresh Courses</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  offlineIndicator: {
    backgroundColor: '#FFA500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  offlineIndicatorText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 10,
  },
  errorDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
  },
  offlineNote: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  offlineBanner: {
    backgroundColor: '#FFC107',
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 5,
  },
  offlineText: {
    color: '#333',
    fontWeight: 'bold',
  },
  courseItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  courseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  courseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  courseCategory: {
    fontSize: 12,
    color: '#2196F3',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  courseDifficulty: {
    fontSize: 12,
    color: '#4CAF50',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  courseDuration: {
    fontSize: 12,
    color: '#FF9800',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  refreshButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  refreshText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CourseListWithPersistence;