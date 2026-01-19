import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface HomeScreenProps {
  onLogout: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onLogout }) => {
  const { user } = useAuth();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: onLogout },
      ]
    );
  };

  const handleCoursePress = () => {
    Alert.alert('Course', 'Course details will be implemented soon.');
  };

  const handleQuizPress = () => {
    Alert.alert('Quiz', 'Quiz functionality will be implemented soon.');
  };

  const handleProgressPress = () => {
    Alert.alert('Progress', 'Progress tracking will be implemented soon.');
  };
  
  const navigateToTestPersistence = () => {
    navigation.navigate('TestPersistence');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>
              Welcome back, {user?.name || 'Student'}! 👋
            </Text>
            <Text style={styles.welcomeSubtext}>
              Ready to continue your learning journey?
            </Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
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
          <Text style={styles.statNumber}>5</Text>
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
        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>✅ Completed Lesson 5</Text>
          <Text style={styles.activityDescription}>React Native Navigation</Text>
          <Text style={styles.activityTime}>2 hours ago</Text>
        </View>
        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>🎯 Quiz Completed</Text>
          <Text style={styles.activityDescription}>JavaScript Fundamentals</Text>
          <Text style={styles.activityTime}>1 day ago</Text>
        </View>
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
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#E0E0E0',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
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