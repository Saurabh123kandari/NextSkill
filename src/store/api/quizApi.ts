import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';
import { Quiz, Question, QuizAttempt, Answer, ApiResponse } from '@/types';

export const quizApi = createApi({
  reducerPath: 'quizApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.nextskill.com/quizzes',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Quiz', 'Question', 'Attempt'],
  endpoints: (builder) => ({
    // Quizzes
    getQuizById: builder.query<Quiz, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Quiz', id }],
    }),
    getCourseQuizzes: builder.query<Quiz[], string>({
      query: (courseId) => `/course/${courseId}`,
      providesTags: (result, error, courseId) => [
        { type: 'Quiz', id: courseId },
        'Quiz',
      ],
    }),
    getLessonQuiz: builder.query<Quiz, { courseId: string; lessonId: string }>({
      query: ({ courseId, lessonId }) => `/course/${courseId}/lesson/${lessonId}`,
      providesTags: (result, error, { lessonId }) => [{ type: 'Quiz', id: lessonId }],
    }),
    
    // Questions
    getQuizQuestions: builder.query<Question[], string>({
      query: (quizId) => `/${quizId}/questions`,
      providesTags: (result, error, quizId) => [
        { type: 'Question', id: quizId },
        'Question',
      ],
    }),
    
    // Quiz Attempts
    startQuizAttempt: builder.mutation<QuizAttempt, string>({
      query: (quizId) => ({
        url: `/${quizId}/attempts`,
        method: 'POST',
      }),
      invalidatesTags: ['Attempt'],
    }),
    submitQuizAttempt: builder.mutation<
      QuizAttempt,
      { attemptId: string; answers: Answer[] }
    >({
      query: ({ attemptId, answers }) => ({
        url: `/attempts/${attemptId}`,
        method: 'PUT',
        body: { answers },
      }),
      invalidatesTags: ['Attempt', 'Quiz'],
    }),
    getUserAttempts: builder.query<QuizAttempt[], string>({
      query: (quizId) => `/${quizId}/attempts`,
      providesTags: (result, error, quizId) => [
        { type: 'Attempt', id: quizId },
        'Attempt',
      ],
    }),
    getAttemptById: builder.query<QuizAttempt, string>({
      query: (attemptId) => `/attempts/${attemptId}`,
      providesTags: (result, error, attemptId) => [{ type: 'Attempt', id: attemptId }],
    }),
    
    // Quiz Statistics
    getQuizStats: builder.query<
      {
        totalAttempts: number;
        averageScore: number;
        passRate: number;
        bestScore: number;
        lastAttempt?: QuizAttempt;
      },
      string
    >({
      query: (quizId) => `/${quizId}/stats`,
      providesTags: (result, error, quizId) => [{ type: 'Quiz', id: quizId }],
    }),
    
    // Quiz Management (for teachers/admins)
    createQuiz: builder.mutation<Quiz, { courseId: string; quizData: Partial<Quiz> }>({
      query: ({ courseId, quizData }) => ({
        url: `/course/${courseId}`,
        method: 'POST',
        body: quizData,
      }),
      invalidatesTags: ['Quiz'],
    }),
    updateQuiz: builder.mutation<Quiz, { quizId: string; quizData: Partial<Quiz> }>({
      query: ({ quizId, quizData }) => ({
        url: `/${quizId}`,
        method: 'PUT',
        body: quizData,
      }),
      invalidatesTags: (result, error, { quizId }) => [{ type: 'Quiz', id: quizId }],
    }),
    deleteQuiz: builder.mutation<{ success: boolean }, string>({
      query: (quizId) => ({
        url: `/${quizId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Quiz'],
    }),
    
    // Question Management
    addQuestion: builder.mutation<
      Question,
      { quizId: string; questionData: Omit<Question, 'id' | 'quiz_id'> }
    >({
      query: ({ quizId, questionData }) => ({
        url: `/${quizId}/questions`,
        method: 'POST',
        body: questionData,
      }),
      invalidatesTags: (result, error, { quizId }) => [
        { type: 'Question', id: quizId },
        { type: 'Quiz', id: quizId },
      ],
    }),
    updateQuestion: builder.mutation<
      Question,
      { questionId: string; questionData: Partial<Question> }
    >({
      query: ({ questionId, questionData }) => ({
        url: `/questions/${questionId}`,
        method: 'PUT',
        body: questionData,
      }),
      invalidatesTags: (result, error, { questionId }) => [
        { type: 'Question', id: questionId },
      ],
    }),
    deleteQuestion: builder.mutation<{ success: boolean }, string>({
      query: (questionId) => ({
        url: `/questions/${questionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Question'],
    }),
  }),
});

export const {
  useGetQuizByIdQuery,
  useGetCourseQuizzesQuery,
  useGetLessonQuizQuery,
  useGetQuizQuestionsQuery,
  useStartQuizAttemptMutation,
  useSubmitQuizAttemptMutation,
  useGetUserAttemptsQuery,
  useGetAttemptByIdQuery,
  useGetQuizStatsQuery,
  useCreateQuizMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
  useAddQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} = quizApi;
