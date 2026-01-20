import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setSelectedCategory,
  setSelectedDifficulty,
  setQuestionCount,
  resetQuiz,
} from '@/store/slices/quizSlice';
import { RootStackParamList, OpenTriviaCategory } from '@/types';
import { fetchCategories } from '@/services/quiz/quizService';

type QuizCategoryNavigationProp = StackNavigationProp<RootStackParamList, 'QuizCategory'>;

const DIFFICULTY_OPTIONS: Array<{ key: 'easy' | 'medium' | 'hard' | null; label: string; color: string }> = [
  { key: null, label: 'Any', color: '#9E9E9E' },
  { key: 'easy', label: 'Easy', color: '#4CAF50' },
  { key: 'medium', label: 'Medium', color: '#FF9800' },
  { key: 'hard', label: 'Hard', color: '#F44336' },
];

const QUESTION_COUNT_OPTIONS = [5, 10, 15, 20];

const QuizCategoryScreen: React.FC = () => {
  const navigation = useNavigation<QuizCategoryNavigationProp>();
  const dispatch = useAppDispatch();
  
  const { selectedCategory, selectedDifficulty, questionCount } = useAppSelector(
    (state) => state.quiz
  );
  
  // Local state for categories (avoiding RTK Query due to React 19 compatibility)
  const [categories, setCategories] = useState<OpenTriviaCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      setIsError(false);
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Failed to load categories:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Reset quiz state when entering this screen
    dispatch(resetQuiz());
    loadCategories();
  }, [dispatch, loadCategories]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadCategories();
  }, [loadCategories]);

  const handleCategorySelect = (category: OpenTriviaCategory | null) => {
    dispatch(setSelectedCategory(category));
  };

  const handleDifficultySelect = (difficulty: 'easy' | 'medium' | 'hard' | null) => {
    dispatch(setSelectedDifficulty(difficulty));
  };

  const handleQuestionCountSelect = (count: number) => {
    dispatch(setQuestionCount(count));
  };

  const handleStartQuiz = () => {
    navigation.navigate('Quiz', {
      category: selectedCategory?.id,
      difficulty: selectedDifficulty || undefined,
      amount: questionCount,
    });
  };

  const renderCategoryCard = (category: OpenTriviaCategory, isSelected: boolean) => (
    <TouchableOpacity
      key={category.id}
      style={[styles.categoryCard, isSelected && styles.categoryCardSelected]}
      onPress={() => handleCategorySelect(category)}
      activeOpacity={0.7}
    >
      <Text
        style={[styles.categoryText, isSelected && styles.categoryTextSelected]}
        numberOfLines={2}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6200EE']} />
      }
    >
      {/* Any Category Option */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Category</Text>
        <TouchableOpacity
          style={[
            styles.anyCategoryCard,
            !selectedCategory && styles.categoryCardSelected,
          ]}
          onPress={() => handleCategorySelect(null)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.anyCategoryText,
              !selectedCategory && styles.categoryTextSelected,
            ]}
          >
            Any Category
          </Text>
        </TouchableOpacity>
      </View>

      {/* Categories Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionSubtitle}>Or choose a specific category:</Text>
        {isError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load categories</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadCategories}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.categoriesGrid}>
            {categories.map((category) =>
              renderCategoryCard(category, selectedCategory?.id === category.id)
            )}
          </View>
        )}
      </View>

      {/* Difficulty Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Difficulty</Text>
        <View style={styles.optionsRow}>
          {DIFFICULTY_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.label}
              style={[
                styles.difficultyButton,
                selectedDifficulty === option.key && {
                  backgroundColor: option.color,
                  borderColor: option.color,
                },
              ]}
              onPress={() => handleDifficultySelect(option.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.difficultyButtonText,
                  selectedDifficulty === option.key && styles.difficultyButtonTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Question Count Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Number of Questions</Text>
        <View style={styles.optionsRow}>
          {QUESTION_COUNT_OPTIONS.map((count) => (
            <TouchableOpacity
              key={count}
              style={[
                styles.countButton,
                questionCount === count && styles.countButtonSelected,
              ]}
              onPress={() => handleQuestionCountSelect(count)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.countButtonText,
                  questionCount === count && styles.countButtonTextSelected,
                ]}
              >
                {count}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Start Quiz Button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={handleStartQuiz}
        activeOpacity={0.8}
      >
        <Text style={styles.startButtonText}>Start Quiz</Text>
      </TouchableOpacity>

      {/* Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          {questionCount} questions
          {selectedCategory ? ` in ${selectedCategory.name}` : ' from any category'}
          {selectedDifficulty ? ` (${selectedDifficulty})` : ''}
        </Text>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  anyCategoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  anyCategoryText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    minHeight: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryCardSelected: {
    borderColor: '#6200EE',
    backgroundColor: '#F3E5F5',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    textAlign: 'center',
  },
  categoryTextSelected: {
    color: '#6200EE',
    fontWeight: '600',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  difficultyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  difficultyButtonTextSelected: {
    color: '#FFFFFF',
  },
  countButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  countButtonSelected: {
    borderColor: '#6200EE',
    backgroundColor: '#6200EE',
  },
  countButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  countButtonTextSelected: {
    color: '#FFFFFF',
  },
  startButton: {
    backgroundColor: '#6200EE',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#6200EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  summaryContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default QuizCategoryScreen;
