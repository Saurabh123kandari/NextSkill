import { Theme } from '../types';

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://api.nextskill.com',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// Storage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
  OFFLINE_DATA: 'offline_data',
  PROGRESS: 'progress',
  SETTINGS: 'settings',
};

// Course Categories
export const COURSE_CATEGORIES = [
  'Programming',
  'Mathematics',
  'Science',
  'Language',
  'Business',
  'Design',
  'Music',
  'Photography',
  'Health',
  'Other',
];

// Course Levels
export const COURSE_LEVELS = [
  { key: 'beginner', label: 'Beginner', color: '#4CAF50' },
  { key: 'intermediate', label: 'Intermediate', color: '#FF9800' },
  { key: 'advanced', label: 'Advanced', color: '#F44336' },
];

// Quiz Types
export const QUIZ_TYPES = [
  { key: 'multiple-choice', label: 'Multiple Choice' },
  { key: 'true-false', label: 'True/False' },
  { key: 'fill-in-blank', label: 'Fill in the Blank' },
  { key: 'essay', label: 'Essay' },
];

// Progress Status
export const PROGRESS_STATUS = {
  NOT_STARTED: 'not-started',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

// Achievement Types
export const ACHIEVEMENT_TYPES = {
  COURSE: 'course',
  QUIZ: 'quiz',
  STREAK: 'streak',
  MILESTONE: 'milestone',
} as const;

// Theme Configuration
export const LIGHT_THEME: Theme = {
  colors: {
    primary: '#6200EE',
    secondary: '#03DAC6',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    border: '#E0E0E0',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal',
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      fontWeight: 'normal',
      lineHeight: 20,
    },
  },
};

export const DARK_THEME: Theme = {
  ...LIGHT_THEME,
  colors: {
    ...LIGHT_THEME.colors,
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#333333',
  },
};

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};

// File Upload Limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['jpg', 'jpeg', 'png', 'gif'],
  ALLOWED_DOCUMENT_TYPES: ['pdf', 'doc', 'docx', 'txt'],
  ALLOWED_VIDEO_TYPES: ['mp4', 'mov', 'avi'],
};

// Quiz Configuration
export const QUIZ_CONFIG = {
  DEFAULT_TIME_LIMIT: 30, // minutes
  DEFAULT_PASSING_SCORE: 70, // percentage
  MAX_ATTEMPTS: 3,
  REVIEW_TIME: 5, // minutes to review answers
};

// Offline Configuration
export const OFFLINE_CONFIG = {
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  MAX_CACHE_SIZE: 100 * 1024 * 1024, // 100MB
  SYNC_INTERVAL: 5 * 60 * 1000, // 5 minutes
};

// Notification Types
export const NOTIFICATION_TYPES = {
  COURSE_REMINDER: 'course_reminder',
  QUIZ_DEADLINE: 'quiz_deadline',
  ACHIEVEMENT: 'achievement',
  NEW_LESSON: 'new_lesson',
  SYSTEM_UPDATE: 'system_update',
} as const;
