import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Progress } from '../../types';

const ProgressScreen: React.FC = () => {
  const [progress, setProgress] = useState<Progress[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    // Mock data - replace with actual API call
    const mockProgress: Progress[] = [
      {
        id: '1',
        userId: 'user1',
        courseId: 'course1',
        lessonId: 'lesson1',
        type: 'lesson',
        status: 'completed',
        progress: 100,
        timeSpent: 45,
        lastAccessed: new Date(),
        completedAt: new Date(),
      },
      {
        id: '2',
        userId: 'user1',
        courseId: 'course1',
        type: 'quiz',
        status: 'completed',
        progress: 100,
        timeSpent: 15,
        lastAccessed: new Date(),
        completedAt: new Date(),
      },
    ];
    setProgress(mockProgress);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProgress();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.content}>
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.subtitle}>Track your learning journey</Text>

        {/* Progress Overview */}
        <View style={styles.overviewContainer}>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewNumber}>3</Text>
            <Text style={styles.overviewLabel}>Courses</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewNumber}>12</Text>
            <Text style={styles.overviewLabel}>Lessons</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewNumber}>5</Text>
            <Text style={styles.overviewLabel}>Quizzes</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewNumber}>85%</Text>
            <Text style={styles.overviewLabel}>Average</Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {progress.map((item) => (
            <View key={item.id} style={styles.activityCard}>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>
                  {item.type === 'lesson' ? 'Lesson Completed' : 'Quiz Completed'}
                </Text>
                <Text style={styles.activityTime}>
                  {item.completedAt?.toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.activityProgress}>
                <Text style={styles.progressText}>{item.progress}%</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementIcon}>🎓</Text>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>First Course Completed</Text>
              <Text style={styles.achievementDescription}>
                Completed your first course
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
  },
  overviewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overviewNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#666666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 14,
    color: '#666666',
  },
  activityProgress: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  progressText: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '600',
  },
  achievementCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666666',
  },
});

export default ProgressScreen;
