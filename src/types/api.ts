// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  offline?: boolean; // Flag to indicate if data is from offline storage
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  offline?: boolean; // Flag to indicate if data is from offline storage
}

// SQLite Database Types
export interface SQLiteCourse {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  createdAt: string;
  updatedAt: string;
  offline?: boolean;
}

export interface SQLiteLesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  content: string;
  order: number;
  duration: number; // in minutes
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
  offline?: boolean;
}

export interface SQLiteUserProgress {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: string;
  score?: number;
  timeSpent: number; // in seconds
  createdAt: string;
  updatedAt: string;
  offline?: boolean;
}