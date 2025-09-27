import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Course, Lesson, Progress } from '@/types';

interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  lessons: Lesson[];
  progress: Progress[];
  isLoading: boolean;
  error: string | null;
  selectedCategory: string | null;
  searchQuery: string;
}

const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  lessons: [],
  progress: [],
  isLoading: false,
  error: null,
  selectedCategory: null,
  searchQuery: '',
};

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    setCourses: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload;
    },
    setCurrentCourse: (state, action: PayloadAction<Course | null>) => {
      state.currentCourse = action.payload;
    },
    setLessons: (state, action: PayloadAction<Lesson[]>) => {
      state.lessons = action.payload;
    },
    setProgress: (state, action: PayloadAction<Progress[]>) => {
      state.progress = action.payload;
    },
    updateCourseProgress: (state, action: PayloadAction<{ courseId: string; progress: number }>) => {
      const course = state.courses.find(c => c.id === action.payload.courseId);
      if (course) {
        course.progress = action.payload.progress;
      }
      if (state.currentCourse?.id === action.payload.courseId) {
        state.currentCourse.progress = action.payload.progress;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    enrollInCourse: (state, action: PayloadAction<string>) => {
      const course = state.courses.find(c => c.id === action.payload);
      if (course) {
        course.isEnrolled = true;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCourses,
  setCurrentCourse,
  setLessons,
  setProgress,
  updateCourseProgress,
  setLoading,
  setError,
  setSelectedCategory,
  setSearchQuery,
  enrollInCourse,
  clearError,
} = courseSlice.actions;

export default courseSlice.reducer;
