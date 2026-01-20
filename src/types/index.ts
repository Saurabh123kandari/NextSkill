// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'student' | 'teacher' | 'admin';
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Course Types
export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty?: string;
  level?: string;
  duration: number;
  imageUrl?: string;
  thumbnail?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  offline?: boolean;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  content: string;
  order: number;
  duration: number;
  videoUrl?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  type?: 'video' | 'text' | 'quiz';
  isCompleted?: boolean;
  isLocked?: boolean;
  offline?: boolean;
  resources?: Resource[];
  quiz?: Quiz;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'audio' | 'document';
  url: string;
  size: number; // in bytes
}

// Quiz Types
export interface Quiz {
  id: string;
  courseId: string;
  lessonId?: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit?: number; // in minutes
  passingScore: number; // percentage
  attempts: number;
  maxAttempts?: number;
  createdAt: Date;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-in-blank' | 'essay';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  answers: Answer[];
  score: number;
  timeSpent: number; // in minutes
  completedAt: Date;
  passed: boolean;
}

export interface Answer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  timeSpent: number; // in seconds
}

// Open Trivia DB Types
export interface OpenTriviaCategory {
  id: number;
  name: string;
}

export interface OpenTriviaQuestion {
  category: string;
  type: 'multiple' | 'boolean';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string; // HTML encoded
  correct_answer: string;
  incorrect_answers: string[];
}

export interface OpenTriviaResponse {
  response_code: number;
  results: OpenTriviaQuestion[];
}

export interface OpenTriviaCategoryResponse {
  trivia_categories: OpenTriviaCategory[];
}

// Processed Question for Quiz Screen
export interface ProcessedQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  category: string;
  difficulty: string;
}

// Local Quiz Result (for tracking)
export interface QuizResult {
  id: string;
  category: string;
  difficulty: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timestamp: Date;
  answers: QuizAnswerRecord[];
}

export interface QuizAnswerRecord {
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

// Quiz Parameters for API
export interface QuizParams {
  amount?: number;
  category?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Progress Types
export interface Progress {
  id: string;
  userId: string;
  courseId: string;
  lessonId?: string;
  type: 'lesson' | 'quiz' | 'assignment';
  status: 'not-started' | 'in-progress' | 'completed' | 'failed';
  progress: number; // percentage
  timeSpent: number; // in minutes
  lastAccessed: Date;
  completedAt?: Date;
}

// Achievement Types
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'course' | 'quiz' | 'streak' | 'milestone';
  criteria: {
    coursesCompleted?: number;
    quizzesPassed?: number;
    streakDays?: number;
    totalTimeSpent?: number;
  };
  points: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Home: undefined;
  CourseDetail: { courseId: string };
  LessonDetail: { lessonId: string; courseId: string };
  QuizDetail: { quizId: string; courseId?: string };
  QuizCategory: undefined;
  Quiz: { category?: number; difficulty?: 'easy' | 'medium' | 'hard'; amount?: number };
  QuizResult: { result: QuizResult };
  Profile: undefined;
  Settings: undefined;
  TestPersistence: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Courses: undefined;
  Progress: undefined;
  Profile: undefined;
};

export type DrawerParamList = {
  Main: undefined;
  Settings: undefined;
  Achievements: undefined;
  Help: undefined;
  About: undefined;
};

// API Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
  offline?: boolean;
}

// Theme Types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    h1: object;
    h2: object;
    h3: object;
    body: object;
    caption: object;
  };
}
