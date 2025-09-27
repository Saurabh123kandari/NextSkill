// Database model interfaces matching SQLite schema

export interface User {
  id: number;
  email: string;
  name: string;
  password_hash: string;
  avatar_url?: string;
  role: 'student' | 'teacher' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: number;
  title: string;
  description?: string;
  instructor: string;
  thumbnail_url?: string;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  rating: number;
  students_count: number;
  is_enrolled: boolean;
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: number;
  course_id: number;
  title: string;
  description?: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  content_url?: string;
  duration: number;
  order_index: number;
  is_completed: boolean;
  is_locked: boolean;
  created_at: string;
}

export interface Quiz {
  id: number;
  course_id?: number;
  lesson_id?: number;
  title: string;
  description?: string;
  time_limit?: number;
  passing_score: number;
  max_attempts?: number;
  created_at: string;
}

export interface Question {
  id: number;
  quiz_id: number;
  type: 'multiple-choice' | 'true-false' | 'fill-in-blank' | 'essay';
  question_text: string;
  options?: string;
  correct_answer: string;
  explanation?: string;
  points: number;
  order_index: number;
}

export interface Progress {
  id: number;
  user_id: number;
  course_id?: number;
  lesson_id?: number;
  quiz_id?: number;
  type: 'course' | 'lesson' | 'quiz' | 'assignment';
  status: 'not-started' | 'in-progress' | 'completed' | 'failed';
  progress_percentage: number;
  time_spent: number;
  last_accessed: string;
  completed_at?: string;
}

export interface Achievement {
  id: number;
  title: string;
  description?: string;
  icon?: string;
  type: 'course' | 'quiz' | 'streak' | 'milestone';
  criteria?: string;
  points: number;
  is_unlocked: boolean;
  unlocked_at?: string;
  created_at: string;
}

// Database operation result types
export interface InsertResult {
  insertId: number;
  rowsAffected: number;
}

export interface UpdateResult {
  rowsAffected: number;
}

export interface DeleteResult {
  rowsAffected: number;
}

// Query builder types
export interface WhereClause {
  column: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN' | 'NOT IN';
  value: any;
}

export interface OrderByClause {
  column: string;
  direction: 'ASC' | 'DESC';
}

export interface QueryOptions {
  where?: WhereClause[];
  orderBy?: OrderByClause[];
  limit?: number;
  offset?: number;
}
