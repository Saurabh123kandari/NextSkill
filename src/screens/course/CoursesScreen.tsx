import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl,
} from 'react-native';
import { Course } from '../../types';
import { COURSE_CATEGORIES, COURSE_LEVELS } from '../../constants';

const CoursesScreen: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchQuery, selectedCategory, selectedLevel]);

  const loadCourses = async () => {
    // Mock data - replace with actual API call
    const mockCourses: Course[] = [
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
    setCourses(mockCourses);
  };

  const filterCourses = () => {
    let filtered = courses;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        course =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Level filter
    if (selectedLevel !== 'All') {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }

    setFilteredCourses(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCourses();
    setRefreshing(false);
  };

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
        <View style={styles.courseFooter}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>
              {COURSE_LEVELS.find(l => l.key === item.level)?.label}
            </Text>
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
      </View>
    </TouchableOpacity>
  );

  const renderCategoryFilter = () => (
    <View style={styles.filterContainer}>
      <Text style={styles.filterTitle}>Categories</Text>
      <FlatList
        data={['All', ...COURSE_CATEGORIES]}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedCategory === item && styles.activeFilterChip,
            ]}
            onPress={() => setSelectedCategory(item)}>
            <Text
              style={[
                styles.filterChipText,
                selectedCategory === item && styles.activeFilterChipText,
              ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.filterList}
      />
    </View>
  );

  const renderLevelFilter = () => (
    <View style={styles.filterContainer}>
      <Text style={styles.filterTitle}>Level</Text>
      <FlatList
        data={['All', ...COURSE_LEVELS.map(l => l.label)]}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedLevel === item && styles.activeFilterChip,
            ]}
            onPress={() => setSelectedLevel(item)}>
            <Text
              style={[
                styles.filterChipText,
                selectedLevel === item && styles.activeFilterChipText,
              ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.filterList}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search courses..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999999"
        />
      </View>

      {/* Filters */}
      {renderCategoryFilter()}
      {renderLevelFilter()}

      {/* Courses List */}
      <FlatList
        data={filteredCourses}
        renderItem={renderCourseCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.coursesList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  filterList: {
    paddingHorizontal: 16,
  },
  filterChip: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: '#6200EE',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  activeFilterChipText: {
    color: '#FFFFFF',
  },
  coursesList: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  courseCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
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
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 10,
    color: '#1976D2',
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
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
    fontSize: 10,
    color: '#6200EE',
    fontWeight: '500',
  },
});

export default CoursesScreen;
