import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ProcessedQuestion,
  QuizAnswerRecord,
  QuizResult,
  OpenTriviaCategory,
} from '@/types';
import {
  generateQuizResultId,
  calculatePercentage,
} from '@/services/quiz/quizService';

interface QuizState {
  // Quiz session state
  questions: ProcessedQuestion[];
  currentIndex: number;
  answers: QuizAnswerRecord[];
  score: number;
  isLoading: boolean;
  error: string | null;
  quizStartTime: number | null;
  
  // Quiz configuration
  selectedCategory: OpenTriviaCategory | null;
  selectedDifficulty: 'easy' | 'medium' | 'hard' | null;
  questionCount: number;
  
  // Categories cache
  categories: OpenTriviaCategory[];
  categoriesLoading: boolean;
  
  // Current question state
  selectedAnswer: string | null;
  hasAnswered: boolean;
  
  // Quiz result
  lastResult: QuizResult | null;
}

const initialState: QuizState = {
  questions: [],
  currentIndex: 0,
  answers: [],
  score: 0,
  isLoading: false,
  error: null,
  quizStartTime: null,
  selectedCategory: null,
  selectedDifficulty: null,
  questionCount: 10,
  categories: [],
  categoriesLoading: false,
  selectedAnswer: null,
  hasAnswered: false,
  lastResult: null,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    // Set categories
    setCategories: (state, action: PayloadAction<OpenTriviaCategory[]>) => {
      state.categories = action.payload;
      state.categoriesLoading = false;
    },
    setCategoriesLoading: (state, action: PayloadAction<boolean>) => {
      state.categoriesLoading = action.payload;
    },
    
    // Quiz configuration
    setSelectedCategory: (state, action: PayloadAction<OpenTriviaCategory | null>) => {
      state.selectedCategory = action.payload;
    },
    setSelectedDifficulty: (state, action: PayloadAction<'easy' | 'medium' | 'hard' | null>) => {
      state.selectedDifficulty = action.payload;
    },
    setQuestionCount: (state, action: PayloadAction<number>) => {
      state.questionCount = action.payload;
    },
    
    // Start quiz with questions
    startQuiz: (state, action: PayloadAction<ProcessedQuestion[]>) => {
      state.questions = action.payload;
      state.currentIndex = 0;
      state.answers = [];
      state.score = 0;
      state.isLoading = false;
      state.error = null;
      state.quizStartTime = Date.now();
      state.selectedAnswer = null;
      state.hasAnswered = false;
      state.lastResult = null;
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    // Select an answer for current question
    selectAnswer: (state, action: PayloadAction<string>) => {
      if (state.hasAnswered) return; // Prevent multiple selections
      
      const currentQuestion = state.questions[state.currentIndex];
      if (!currentQuestion) return;
      
      const selectedAnswer = action.payload;
      const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
      
      state.selectedAnswer = selectedAnswer;
      state.hasAnswered = true;
      
      if (isCorrect) {
        state.score += 1;
      }
      
      // Record the answer
      state.answers.push({
        question: currentQuestion.question,
        selectedAnswer,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect,
      });
    },
    
    // Move to next question
    nextQuestion: (state) => {
      if (state.currentIndex < state.questions.length - 1) {
        state.currentIndex += 1;
        state.selectedAnswer = null;
        state.hasAnswered = false;
      }
    },
    
    // Finish quiz and generate result
    finishQuiz: (state) => {
      const totalQuestions = state.questions.length;
      const percentage = calculatePercentage(state.score, totalQuestions);
      
      const result: QuizResult = {
        id: generateQuizResultId(),
        category: state.selectedCategory?.name || 'General',
        difficulty: state.selectedDifficulty || 'mixed',
        score: state.score,
        totalQuestions,
        percentage,
        timestamp: new Date(),
        answers: state.answers,
      };
      
      state.lastResult = result;
    },
    
    // Reset quiz to initial state
    resetQuiz: (state) => {
      state.questions = [];
      state.currentIndex = 0;
      state.answers = [];
      state.score = 0;
      state.isLoading = false;
      state.error = null;
      state.quizStartTime = null;
      state.selectedAnswer = null;
      state.hasAnswered = false;
      // Keep category and difficulty selections
      // Keep lastResult for potential review
    },
    
    // Full reset including configuration
    resetAll: (state) => {
      return initialState;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCategories,
  setCategoriesLoading,
  setSelectedCategory,
  setSelectedDifficulty,
  setQuestionCount,
  startQuiz,
  setLoading,
  setError,
  selectAnswer,
  nextQuestion,
  finishQuiz,
  resetQuiz,
  resetAll,
  clearError,
} = quizSlice.actions;

export default quizSlice.reducer;
