// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'student' | 'teacher' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// Course Types
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  duration: number; // in minutes
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  rating: number;
  studentsCount: number;
  lessons: Lesson[];
  isEnrolled: boolean;
  progress: number; // percentage
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  content: string; // URL or text content
  duration: number; // in minutes
  order: number;
  isCompleted: boolean;
  isLocked: boolean;
  resources?: Resource[];
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
  CourseDetail: { courseId: string };
  LessonDetail: { lessonId: string; courseId: string };
  QuizDetail: { quizId: string; courseId?: string };
  Profile: undefined;
  Settings: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Courses: undefined;
  Progress: undefined;
  Profile: undefined;
};

// API Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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
