import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  startQuiz,
  selectAnswer,
  nextQuestion,
  finishQuiz,
  setError,
  setLoading,
} from '@/store/slices/quizSlice';
import { RootStackParamList, ProcessedQuestion } from '@/types';
import { fetchQuizQuestions } from '@/services/quiz/quizService';

type QuizScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Quiz'>;
type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>;

const QuizScreen: React.FC = () => {
  const navigation = useNavigation<QuizScreenNavigationProp>();
  const route = useRoute<QuizScreenRouteProp>();
  const dispatch = useAppDispatch();

  const { category, difficulty, amount = 10 } = route.params || {};

  const {
    questions,
    currentIndex,
    score,
    selectedAnswer,
    hasAnswered,
    error,
    lastResult,
    isLoading: quizLoading,
  } = useAppSelector((state) => state.quiz);

  // Local loading state for initial fetch
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  // Fetch questions on mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoadingQuestions(true);
        dispatch(setLoading(true));
        const fetchedQuestions = await fetchQuizQuestions({
          amount,
          category,
          difficulty,
        });
        if (fetchedQuestions && fetchedQuestions.length > 0) {
          dispatch(startQuiz(fetchedQuestions));
        } else {
          dispatch(setError('No questions available'));
        }
      } catch (err) {
        console.error('Failed to fetch questions:', err);
        dispatch(setError('Failed to load quiz questions'));
      } finally {
        setIsLoadingQuestions(false);
        dispatch(setLoading(false));
      }
    };

    loadQuestions();
  }, [amount, category, difficulty, dispatch]);

  // Navigate to results when quiz is finished
  useEffect(() => {
    if (lastResult) {
      navigation.replace('QuizResult', { result: lastResult });
    }
  }, [lastResult, navigation]);

  // Prevent back navigation during quiz
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Exit Quiz?',
          'Are you sure you want to exit? Your progress will be lost.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Exit',
              style: 'destructive',
              onPress: () => navigation.goBack(),
            },
          ]
        );
        return true; // Prevent default back behavior
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [navigation])
  );

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const handleAnswerSelect = (answer: string) => {
    if (hasAnswered) return;
    dispatch(selectAnswer(answer));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      dispatch(finishQuiz());
    } else {
      dispatch(nextQuestion());
    }
  };

  const getOptionStyle = (option: string) => {
    if (!hasAnswered) {
      return styles.optionButton;
    }

    if (option === currentQuestion?.correctAnswer) {
      return [styles.optionButton, styles.optionCorrect];
    }

    if (option === selectedAnswer && option !== currentQuestion?.correctAnswer) {
      return [styles.optionButton, styles.optionIncorrect];
    }

    return [styles.optionButton, styles.optionDisabled];
  };

  const getOptionTextStyle = (option: string) => {
    if (!hasAnswered) {
      return styles.optionText;
    }

    if (option === currentQuestion?.correctAnswer) {
      return [styles.optionText, styles.optionTextCorrect];
    }

    if (option === selectedAnswer && option !== currentQuestion?.correctAnswer) {
      return [styles.optionText, styles.optionTextIncorrect];
    }

    return [styles.optionText, styles.optionTextDisabled];
  };

  if (isLoadingQuestions || quizLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  if (error || questions.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>!</Text>
        <Text style={styles.errorText}>{error || 'Failed to load quiz'}</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentQuestion) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Progress Header */}
      <View style={styles.header}>
        <View style={styles.progressInfo}>
          <Text style={styles.questionNumber}>
            Question {currentIndex + 1} of {questions.length}
          </Text>
          <Text style={styles.scoreText}>Score: {score}</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.categoryText}>
          {currentQuestion.category} • {currentQuestion.difficulty}
        </Text>
      </View>

      {/* Question */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={`${currentQuestion.id}-option-${index}`}
            style={getOptionStyle(option)}
            onPress={() => handleAnswerSelect(option)}
            disabled={hasAnswered}
            activeOpacity={hasAnswered ? 1 : 0.7}
          >
            <View style={styles.optionContent}>
              <Text style={styles.optionLetter}>
                {String.fromCharCode(65 + index)}
              </Text>
              <Text style={getOptionTextStyle(option)}>{option}</Text>
            </View>
            {hasAnswered && option === currentQuestion.correctAnswer && (
              <Text style={styles.correctIcon}>✓</Text>
            )}
            {hasAnswered &&
              option === selectedAnswer &&
              option !== currentQuestion.correctAnswer && (
                <Text style={styles.incorrectIcon}>✗</Text>
              )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Feedback & Next Button */}
      {hasAnswered && (
        <View style={styles.feedbackContainer}>
          <Text
            style={[
              styles.feedbackText,
              selectedAnswer === currentQuestion.correctAnswer
                ? styles.feedbackCorrect
                : styles.feedbackIncorrect,
            ]}
          >
            {selectedAnswer === currentQuestion.correctAnswer
              ? 'Correct!'
              : `Incorrect! The answer is: ${currentQuestion.correctAnswer}`}
          </Text>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>
              {isLastQuestion ? 'See Results' : 'Next Question'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 24,
  },
  errorIcon: {
    fontSize: 48,
    color: '#F44336',
    marginBottom: 16,
    fontWeight: 'bold',
    width: 80,
    height: 80,
    textAlign: 'center',
    lineHeight: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#F44336',
  },
  errorText: {
    fontSize: 18,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6200EE',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6200EE',
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 8,
    textTransform: 'capitalize',
  },
  questionContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
    lineHeight: 28,
  },
  optionsContainer: {
    paddingHorizontal: 16,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    textAlign: 'center',
    lineHeight: 32,
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  optionCorrect: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  optionIncorrect: {
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  optionDisabled: {
    opacity: 0.6,
  },
  optionTextCorrect: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  optionTextIncorrect: {
    color: '#C62828',
    fontWeight: '600',
  },
  optionTextDisabled: {
    color: '#999999',
  },
  correctIcon: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  incorrectIcon: {
    fontSize: 20,
    color: '#F44336',
    fontWeight: 'bold',
  },
  feedbackContainer: {
    padding: 16,
    marginTop: 'auto',
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  feedbackCorrect: {
    backgroundColor: '#E8F5E9',
    color: '#2E7D32',
  },
  feedbackIncorrect: {
    backgroundColor: '#FFEBEE',
    color: '#C62828',
  },
  nextButton: {
    backgroundColor: '#6200EE',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#6200EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default QuizScreen;
