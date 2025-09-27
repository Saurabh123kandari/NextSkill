import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';
import { Course, Lesson, Progress, ApiResponse, PaginatedResponse } from '@/types';

export const courseApi = createApi({
  reducerPath: 'courseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.nextskill.com/courses',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Course', 'Lesson', 'Progress'],
  endpoints: (builder) => ({
    // Courses
    getCourses: builder.query<PaginatedResponse<Course>, { page?: number; limit?: number; category?: string; search?: string }>({
      query: ({ page = 1, limit = 10, category, search }) => ({
        url: '/',
        params: { page, limit, category, search },
      }),
      providesTags: ['Course'],
    }),
    getCourseById: builder.query<Course, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Course', id }],
    }),
    getFeaturedCourses: builder.query<Course[], void>({
      query: () => '/featured',
      providesTags: ['Course'],
    }),
    enrollInCourse: builder.mutation<{ success: boolean }, string>({
      query: (courseId) => ({
        url: `/${courseId}/enroll`,
        method: 'POST',
      }),
      invalidatesTags: ['Course'],
    }),
    unenrollFromCourse: builder.mutation<{ success: boolean }, string>({
      query: (courseId) => ({
        url: `/${courseId}/unenroll`,
        method: 'POST',
      }),
      invalidatesTags: ['Course'],
    }),
    getUserCourses: builder.query<Course[], void>({
      query: () => '/my-courses',
      providesTags: ['Course'],
    }),
    
    // Lessons
    getCourseLessons: builder.query<Lesson[], string>({
      query: (courseId) => `/${courseId}/lessons`,
      providesTags: (result, error, courseId) => [
        { type: 'Lesson', id: courseId },
        'Lesson',
      ],
    }),
    getLessonById: builder.query<Lesson, { courseId: string; lessonId: string }>({
      query: ({ courseId, lessonId }) => `/${courseId}/lessons/${lessonId}`,
      providesTags: (result, error, { lessonId }) => [{ type: 'Lesson', id: lessonId }],
    }),
    markLessonComplete: builder.mutation<{ success: boolean }, { courseId: string; lessonId: string }>({
      query: ({ courseId, lessonId }) => ({
        url: `/${courseId}/lessons/${lessonId}/complete`,
        method: 'POST',
      }),
      invalidatesTags: ['Lesson', 'Progress'],
    }),
    
    // Progress
    getUserProgress: builder.query<Progress[], void>({
      query: () => '/progress',
      providesTags: ['Progress'],
    }),
    getCourseProgress: builder.query<Progress, string>({
      query: (courseId) => `/progress/${courseId}`,
      providesTags: (result, error, courseId) => [{ type: 'Progress', id: courseId }],
    }),
    updateProgress: builder.mutation<Progress, { courseId: string; lessonId?: string; progress: number; timeSpent?: number }>({
      query: ({ courseId, lessonId, progress, timeSpent }) => ({
        url: `/progress/${courseId}`,
        method: 'PUT',
        body: { lessonId, progress, timeSpent },
      }),
      invalidatesTags: ['Progress'],
    }),
    
    // Course categories
    getCategories: builder.query<string[], void>({
      query: () => '/categories',
      providesTags: ['Course'],
    }),
    
    // Course reviews and ratings
    getCourseReviews: builder.query<any[], { courseId: string; page?: number }>({
      query: ({ courseId, page = 1 }) => `/${courseId}/reviews?page=${page}`,
      providesTags: (result, error, { courseId }) => [{ type: 'Course', id: courseId }],
    }),
    addCourseReview: builder.mutation<{ success: boolean }, { courseId: string; rating: number; review: string }>({
      query: ({ courseId, rating, review }) => ({
        url: `/${courseId}/reviews`,
        method: 'POST',
        body: { rating, review },
      }),
      invalidatesTags: (result, error, { courseId }) => [{ type: 'Course', id: courseId }],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useGetFeaturedCoursesQuery,
  useEnrollInCourseMutation,
  useUnenrollFromCourseMutation,
  useGetUserCoursesQuery,
  useGetCourseLessonsQuery,
  useGetLessonByIdQuery,
  useMarkLessonCompleteMutation,
  useGetUserProgressQuery,
  useGetCourseProgressQuery,
  useUpdateProgressMutation,
  useGetCategoriesQuery,
  useGetCourseReviewsQuery,
  useAddCourseReviewMutation,
} = courseApi;
