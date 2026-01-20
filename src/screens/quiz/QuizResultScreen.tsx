import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch } from '@/store/hooks';
import { resetQuiz, resetAll } from '@/store/slices/quizSlice';
import { RootStackParamList } from '@/types';
import { QUIZ_CONFIG } from '@/constants';
import { quizResultRepository } from '@/services/database/repositories/QuizResultRepository';

type QuizResultNavigationProp = StackNavigationProp<RootStackParamList, 'QuizResult'>;
type QuizResultRouteProp = RouteProp<RootStackParamList, 'QuizResult'>;

const QuizResultScreen: React.FC = () => {
  const navigation = useNavigation<QuizResultNavigationProp>();
  const route = useRoute<QuizResultRouteProp>();
  const dispatch = useAppDispatch();
  const [showAnswers, setShowAnswers] = useState(false);
  const hasSavedResult = useRef(false);

  const { result } = route.params;
  const { score, totalQuestions, percentage, category, difficulty, answers } = result;

  const isPassed = percentage >= QUIZ_CONFIG.DEFAULT_PASSING_SCORE;

  // Save quiz result to SQLite on mount
  useEffect(() => {
    const saveQuizResult = async () => {
      // Prevent duplicate saves
      if (hasSavedResult.current) return;
      hasSavedResult.current = true;

      try {
        await quizResultRepository.saveQuizResult(result);
        console.log('Quiz result saved to database');
      } catch (error) {
        console.error('Failed to save quiz result:', error);
      }
    };

    saveQuizResult();
  }, [result]);

  const handleRestartQuiz = () => {
    dispatch(resetQuiz());
    navigation.replace('QuizCategory');
  };

  const handleGoHome = () => {
    dispatch(resetAll());
    navigation.navigate('Home');
  };

  const getScoreColor = () => {
    if (percentage >= 80) return '#4CAF50';
    if (percentage >= 60) return '#FF9800';
    return '#F44336';
  };

  const getGrade = () => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const getMessage = () => {
    if (percentage >= 90) return 'Excellent! You are a genius!';
    if (percentage >= 80) return 'Great job! Well done!';
    if (percentage >= 70) return 'Good work! Keep it up!';
    if (percentage >= 60) return 'Not bad! Room for improvement.';
    return 'Keep practicing! You can do better!';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Result Card */}
      <View style={styles.resultCard}>
        {/* Status Icon */}
        <View style={[styles.statusIcon, { backgroundColor: isPassed ? '#E8F5E9' : '#FFEBEE' }]}>
          <Text style={[styles.statusEmoji, { color: isPassed ? '#4CAF50' : '#F44336' }]}>
            {isPassed ? '🎉' : '😔'}
          </Text>
        </View>

        {/* Pass/Fail Status */}
        <Text style={[styles.statusText, { color: isPassed ? '#4CAF50' : '#F44336' }]}>
          {isPassed ? 'Quiz Passed!' : 'Quiz Failed'}
        </Text>

        {/* Score Circle */}
        <View style={[styles.scoreCircle, { borderColor: getScoreColor() }]}>
          <Text style={[styles.percentageText, { color: getScoreColor() }]}>
            {percentage}%
          </Text>
          <Text style={styles.gradeText}>Grade: {getGrade()}</Text>
        </View>

        {/* Score Details */}
        <Text style={styles.scoreDetails}>
          {score} correct out of {totalQuestions} questions
        </Text>

        {/* Message */}
        <Text style={styles.messageText}>{getMessage()}</Text>

        {/* Quiz Info */}
        <View style={styles.quizInfoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Category</Text>
            <Text style={styles.infoValue}>{category}</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Difficulty</Text>
            <Text style={[styles.infoValue, styles.capitalizeText]}>
              {difficulty || 'Mixed'}
            </Text>
          </View>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, styles.correctCard]}>
          <Text style={styles.statNumber}>{score}</Text>
          <Text style={styles.statLabel}>Correct</Text>
        </View>
        <View style={[styles.statCard, styles.incorrectCard]}>
          <Text style={styles.statNumber}>{totalQuestions - score}</Text>
          <Text style={styles.statLabel}>Incorrect</Text>
        </View>
        <View style={[styles.statCard, styles.totalCard]}>
          <Text style={styles.statNumber}>{totalQuestions}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* Review Answers Toggle */}
      <TouchableOpacity
        style={styles.reviewToggle}
        onPress={() => setShowAnswers(!showAnswers)}
        activeOpacity={0.7}
      >
        <Text style={styles.reviewToggleText}>
          {showAnswers ? 'Hide Answers' : 'Review Answers'}
        </Text>
        <Text style={styles.reviewToggleIcon}>{showAnswers ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {/* Answers Review */}
      {showAnswers && (
        <View style={styles.answersContainer}>
          {answers.map((answer, index) => (
            <View key={index} style={styles.answerCard}>
              <View style={styles.answerHeader}>
                <Text style={styles.answerNumber}>Q{index + 1}</Text>
                <View
                  style={[
                    styles.answerStatus,
                    answer.isCorrect ? styles.answerCorrect : styles.answerIncorrect,
                  ]}
                >
                  <Text style={styles.answerStatusText}>
                    {answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </Text>
                </View>
              </View>
              <Text style={styles.answerQuestion}>{answer.question}</Text>
              <View style={styles.answerDetails}>
                <Text style={styles.answerLabel}>Your answer:</Text>
                <Text
                  style={[
                    styles.answerValue,
                    answer.isCorrect ? styles.answerValueCorrect : styles.answerValueIncorrect,
                  ]}
                >
                  {answer.selectedAnswer}
                </Text>
              </View>
              {!answer.isCorrect && (
                <View style={styles.answerDetails}>
                  <Text style={styles.answerLabel}>Correct answer:</Text>
                  <Text style={[styles.answerValue, styles.answerValueCorrect]}>
                    {answer.correctAnswer}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.restartButton}
          onPress={handleRestartQuiz}
          activeOpacity={0.8}
        >
          <Text style={styles.restartButtonText}>Try Another Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={handleGoHome}
          activeOpacity={0.8}
        >
          <Text style={styles.homeButtonText}>Go to Dashboard</Text>
        </TouchableOpacity>
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
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 20,
  },
  statusIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusEmoji: {
    fontSize: 40,
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scoreCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  percentageText: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  gradeText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  scoreDetails: {
    fontSize: 18,
    color: '#333333',
    marginBottom: 8,
  },
  messageText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  quizInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  capitalizeText: {
    textTransform: 'capitalize',
  },
  infoDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  correctCard: {
    backgroundColor: '#E8F5E9',
  },
  incorrectCard: {
    backgroundColor: '#FFEBEE',
  },
  totalCard: {
    backgroundColor: '#E3F2FD',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  reviewToggle: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6200EE',
  },
  reviewToggleIcon: {
    fontSize: 12,
    color: '#6200EE',
  },
  answersContainer: {
    marginBottom: 20,
  },
  answerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  answerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  answerNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6200EE',
  },
  answerStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  answerCorrect: {
    backgroundColor: '#E8F5E9',
  },
  answerIncorrect: {
    backgroundColor: '#FFEBEE',
  },
  answerStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  answerQuestion: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 22,
    marginBottom: 12,
  },
  answerDetails: {
    marginTop: 8,
  },
  answerLabel: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  answerValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  answerValueCorrect: {
    color: '#4CAF50',
  },
  answerValueIncorrect: {
    color: '#F44336',
  },
  actionsContainer: {
    marginTop: 8,
  },
  restartButton: {
    backgroundColor: '#6200EE',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#6200EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  restartButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  homeButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6200EE',
  },
  homeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6200EE',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default QuizResultScreen;
