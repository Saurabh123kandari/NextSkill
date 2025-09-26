import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Course, Achievement } from '../../types';
import { COURSE_CATEGORIES } from '../../constants';

const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    // This would typically fetch data from your API
    // For now, we'll use mock data
    setFeaturedCourses(getMockFeaturedCourses());
    setRecentCourses(getMockRecentCourses());
    setAchievements(getMockAchievements());
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  };

  const getMockFeaturedCourses = (): Course[] => [
    {
      id: '1',
      title: 'React Native Fundamentals',
      description: 'Learn the basics of React Native development',
      instructor: 'John Doe',
      thumbnail: 'https://via.placeholder.com/300x200',
      duration: 120,
      level: 'beginner',
      category: 'Programming',
      rating: 4.8,
      studentsCount: 1250,
      lessons: [],
      isEnrolled: true,
      progress: 65,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Advanced JavaScript',
      description: 'Master advanced JavaScript concepts',
      instructor: 'Jane Smith',
      thumbnail: 'https://via.placeholder.com/300x200',
      duration: 180,
      level: 'advanced',
      category: 'Programming',
      rating: 4.9,
      studentsCount: 890,
      lessons: [],
      isEnrolled: false,
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const getMockRecentCourses = (): Course[] => [
    {
      id: '3',
      title: 'UI/UX Design Principles',
      description: 'Learn design fundamentals',
      instructor: 'Mike Johnson',
      thumbnail: 'https://via.placeholder.com/300x200',
      duration: 90,
      level: 'intermediate',
      category: 'Design',
      rating: 4.7,
      studentsCount: 650,
      lessons: [],
      isEnrolled: true,
      progress: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const getMockAchievements = (): Achievement[] => [
    {
      id: '1',
      title: 'First Course Completed',
      description: 'Completed your first course',
      icon: '🎓',
      type: 'course',
      criteria: { coursesCompleted: 1 },
      points: 100,
      isUnlocked: true,
      unlockedAt: new Date(),
    },
    {
      id: '2',
      title: 'Quiz Master',
      description: 'Passed 10 quizzes',
      icon: '🧠',
      type: 'quiz',
      criteria: { quizzesPassed: 10 },
      points: 200,
      isUnlocked: false,
    },
  ];

  const renderCourseCard = ({ item }: { item: Course }) => (
    <TouchableOpacity style={styles.courseCard}>
      <Image source={{ uri: item.thumbnail }} style={styles.courseThumbnail} />
      <View style={styles.courseInfo}>
        <Text style={styles.courseTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.courseInstructor}>{item.instructor}</Text>
        <View style={styles.courseMeta}>
          <Text style={styles.courseRating}>⭐ {item.rating}</Text>
          <Text style={styles.courseDuration}>{item.duration} min</Text>
        </View>
        {item.isEnrolled && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${item.progress}%` }]}
              />
            </View>
            <Text style={styles.progressText}>{item.progress}%</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderAchievement = ({ item }: { item: Achievement }) => (
    <View style={[styles.achievementCard, !item.isUnlocked && styles.lockedAchievement]}>
      <Text style={styles.achievementIcon}>{item.icon}</Text>
      <View style={styles.achievementInfo}>
        <Text style={styles.achievementTitle}>{item.title}</Text>
        <Text style={styles.achievementDescription}>{item.description}</Text>
        <Text style={styles.achievementPoints}>{item.points} points</Text>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>
          Welcome back, {user?.name || 'Student'}! 👋
        </Text>
        <Text style={styles.welcomeSubtext}>
          Ready to continue your learning journey?
        </Text>
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
        <FlatList
          data={featuredCourses}
          renderItem={renderCourseCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.coursesList}
        />
      </View>

      {/* Recent Courses */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Continue Learning</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={recentCourses}
          renderItem={renderCourseCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.coursesList}
        />
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Achievements</Text>
        <FlatList
          data={achievements}
          renderItem={renderAchievement}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.achievementsList}
        />
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Browse Categories</Text>
        <View style={styles.categoriesGrid}>
          {COURSE_CATEGORIES.slice(0, 6).map((category, index) => (
            <TouchableOpacity key={index} style={styles.categoryCard}>
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
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
  welcomeSection: {
    padding: 20,
    backgroundColor: '#6200EE',
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
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: -10,
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
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
  coursesList: {
    paddingRight: 20,
  },
  courseCard: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseThumbnail: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  courseInfo: {
    padding: 12,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  courseInstructor: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  courseMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  courseRating: {
    fontSize: 12,
    color: '#FF9800',
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
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6200EE',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#6200EE',
    fontWeight: '500',
  },
  achievementsList: {
    paddingRight: 20,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginRight: 16,
    width: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lockedAchievement: {
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 12,
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
    marginBottom: 4,
  },
  achievementPoints: {
    fontSize: 12,
    color: '#6200EE',
    fontWeight: '500',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
});

export default HomeScreen;
