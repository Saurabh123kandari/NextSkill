import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppSelector } from '@/store/hooks';
import { RootStackParamList } from '@/types';
import { quizResultRepository } from '@/services/database/repositories/QuizResultRepository';
import { formatTimeAgo } from '@/utils/dateUtils';
import { QuizResultRecord } from '@/services/database/models';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

// Activity type for recent activity display
interface Activity {
  type: 'QUIZ' | 'LESSON' | 'COURSE';
  title: string;
  subtitle: string;
  time: string;
  score?: number;
}

const HomeScreen: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // Dynamic stats state
  const [quizCount, setQuizCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  // Load dashboard stats when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadDashboardStats();
    }, [])
  );

  const loadDashboardStats = async () => {
    try {
      // Get quiz count from database
      const count = await quizResultRepository.getQuizCount();
      setQuizCount(count);

      // Get recent quiz results for activity feed
      const recentQuizzes = await quizResultRepository.getRecentResults(5);
      
      // Transform quiz results to activity format
      const quizActivities: Activity[] = recentQuizzes.map((quiz: QuizResultRecord) => ({
        type: 'QUIZ' as const,
        title: 'Quiz Completed',
        subtitle: quiz.category,
        time: formatTimeAgo(quiz.created_at),
        score: quiz.percentage,
      }));

      setRecentActivity(quizActivities);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    }
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleCoursePress = () => {
    Alert.alert('Course', 'Course details will be implemented soon.');
  };

  const handleQuizPress = () => {
    navigation.navigate('QuizCategory');
  };

  const handleProgressPress = () => {
    Alert.alert('Progress', 'Progress tracking will be implemented soon.');
  };
  
  const navigateToTestPersistence = () => {
    navigation.navigate('TestPersistence');
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'QUIZ':
        return '🎯';
      case 'LESSON':
        return '✅';
      case 'COURSE':
        return '📚';
      default:
        return '📝';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.welcomeText}>
              Welcome back, {user?.name || 'Student'}! 👋
            </Text>
            <Text style={styles.welcomeSubtext}>
              Ready to continue your learning journey?
            </Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
            <Text style={styles.profileButtonText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Courses</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Lessons</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{quizCount}</Text>
          <Text style={styles.statLabel}>Quizzes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>85%</Text>
          <Text style={styles.statLabel}>Progress</Text>
        </View>
      </View>

      {/* Featured Courses */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Courses</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.courseCard} onPress={handleCoursePress}>
          <Text style={styles.courseTitle}>React Native Fundamentals</Text>
          <Text style={styles.courseDescription}>
            Learn the basics of React Native development with hands-on projects
          </Text>
          <View style={styles.courseMeta}>
            <Text style={styles.courseInstructor}>Instructor: John Doe</Text>
            <Text style={styles.courseDuration}>2h 30m</Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '65%' }]} />
            </View>
            <Text style={styles.progressText}>65% Complete</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {recentActivity.length > 0 ? (
          recentActivity.map((activity, index) => (
            <View key={index} style={styles.activityCard}>
              <Text style={styles.activityTitle}>
                {getActivityIcon(activity.type)} {activity.title}
                {activity.score !== undefined && (
                  <Text style={styles.activityScore}> - {activity.score}%</Text>
                )}
              </Text>
              <Text style={styles.activityDescription}>{activity.subtitle}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          ))
        ) : (
          <View style={styles.activityCard}>
            <Text style={styles.activityTitle}>📝 No recent activity</Text>
            <Text style={styles.activityDescription}>
              Take a quiz to see your activity here!
            </Text>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCoursePress}>
            <Text style={styles.actionIcon}>📚</Text>
            <Text style={styles.actionText}>Browse Courses</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleQuizPress}>
            <Text style={styles.actionIcon}>🧠</Text>
            <Text style={styles.actionText}>Take Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleProgressPress}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>View Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>🏆</Text>
            <Text style={styles.actionText}>Achievements</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={navigateToTestPersistence}>
            <Text style={styles.actionIcon}>🔄</Text>
            <Text style={styles.actionText}>Test Persistence</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#6200EE',
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    flexShrink: 1,
    marginRight: 12,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#E0E0E0',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    flexShrink: 0,
  },
  profileButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: -10,
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
  },
  section: {
    margin: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#6200EE',
    fontWeight: '500',
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  courseMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  courseInstructor: {
    fontSize: 12,
    color: '#666666',
  },
  courseDuration: {
    fontSize: 12,
    color: '#666666',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6200EE',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6200EE',
    fontWeight: '500',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  activityScore: {
    color: '#6200EE',
    fontWeight: '600',
  },
  activityDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#999999',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default HomeScreen;
