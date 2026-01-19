import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';
import { Course, Lesson, Progress, ApiResponse, PaginatedResponse } from '@/types';
import { database } from '@/services/database/database';

// Define interfaces for SQLite storage
interface SQLiteCourse {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  createdAt: string;
  updatedAt: string;
}

interface SQLiteLesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  content: string;
  order: number;
  duration: number;
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Enhanced API with SQLite persistence
export const courseApiWithPersistence = createApi({
  reducerPath: 'courseApiWithPersistence',
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
    // Courses with SQLite persistence
    getCourses: builder.query<PaginatedResponse<Course>, { page?: number; limit?: number; category?: string; search?: string }>({
      query: ({ page = 1, limit = 10, category, search }) => ({
        url: '/',
        params: { page, limit, category, search },
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          // Wait for the query to complete
          const { data } = await queryFulfilled;
          
          // Store courses in SQLite for offline access
          if (data.items && data.items.length > 0) {
            for (const course of data.items) {
              await database.addCourse({
                id: course.id,
                title: course.title,
                description: course.description,
                imageUrl: course.imageUrl || course.thumbnail || '',
                category: course.category,
                difficulty: (course.difficulty || course.level) as 'beginner' | 'intermediate' | 'advanced',
                duration: course.duration,
                createdAt: typeof course.createdAt === 'string' ? course.createdAt : new Date().toISOString(),
                updatedAt: typeof course.updatedAt === 'string' ? course.updatedAt : new Date().toISOString(),
              });
            }
            console.log('Courses persisted to SQLite successfully');
          }
        } catch (error) {
          console.error('Error persisting courses to SQLite:', error);
        }
      },
      // Provide fallback data from SQLite when offline
      async onCacheEntryAdded(
        arg,
        { cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        try {
          // Wait for the initial query to resolve
          await cacheDataLoaded;

          // When the cache entry is removed (e.g., on error or timeout),
          // we can try to serve data from SQLite
          const unsubscribe = cacheEntryRemoved.then(async () => {
            try {
              // Fetch courses from SQLite
              const courses = await database.getCourses();
              if (courses.length > 0) {
                // Manually update the cache with SQLite data
                dispatch(
                  courseApiWithPersistence.util.updateQueryData(
                    'getCourses',
                    arg,
                    (draft) => {
                      draft.items = courses;
                      draft.total = courses.length;
                      draft.page = 1;
                      draft.limit = courses.length;
                      draft.offline = true; // Mark as offline data
                      return draft;
                    }
                  )
                );
              }
            } catch (error) {
              console.error('Error fetching courses from SQLite:', error);
            }
          });

          return unsubscribe;
        } catch (error) {
          console.error('Error in onCacheEntryAdded:', error);
        }
      },
      providesTags: ['Course'],
    }),

    getCourseById: builder.query<Course, string>({
      query: (id) => `/${id}`,
      async onQueryStarted(id, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          // Store course in SQLite
          await database.addCourse({
            id: data.id,
            title: data.title,
            description: data.description,
            imageUrl: data.imageUrl || data.thumbnail || '',
            category: data.category,
            difficulty: (data.difficulty || data.level) as 'beginner' | 'intermediate' | 'advanced',
            duration: data.duration,
            createdAt: typeof data.createdAt === 'string' ? data.createdAt : new Date().toISOString(),
            updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : new Date().toISOString(),
          });
        } catch (error) {
          console.error(`Error persisting course ${id} to SQLite:`, error);
        }
      },
      // Provide fallback data from SQLite when offline
      async onCacheEntryAdded(
        id,
        { cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        try {
          await cacheDataLoaded;

          const unsubscribe = cacheEntryRemoved.then(async () => {
            try {
              const course = await database.getCourseById(id);
              if (course) {
                dispatch(
                  courseApiWithPersistence.util.updateQueryData(
                    'getCourseById',
                    id,
                    (draft) => {
                      Object.assign(draft, { ...course, offline: true });
                      return draft;
                    }
                  )
                );
              }
            } catch (error) {
              console.error(`Error fetching course ${id} from SQLite:`, error);
            }
          });

          return unsubscribe;
        } catch (error) {
          console.error('Error in onCacheEntryAdded:', error);
        }
      },
      providesTags: (result, error, id) => [{ type: 'Course', id }],
    }),

    // Lessons with SQLite persistence
    getCourseLessons: builder.query<Lesson[], string>({
      query: (courseId) => `/${courseId}/lessons`,
      async onQueryStarted(courseId, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          // Store lessons in SQLite
          if (data && data.length > 0) {
            for (const lesson of data) {
              await database.addLesson({
                id: lesson.id,
                courseId: lesson.courseId,
                title: lesson.title,
                description: lesson.description,
                content: lesson.content,
                order: lesson.order,
                duration: lesson.duration,
                videoUrl: lesson.videoUrl || '',
                createdAt: typeof lesson.createdAt === 'string' ? lesson.createdAt : new Date().toISOString(),
                updatedAt: typeof lesson.updatedAt === 'string' ? lesson.updatedAt : new Date().toISOString(),
              });
            }
            console.log(`Lessons for course ${courseId} persisted to SQLite successfully`);
          }
        } catch (error) {
          console.error(`Error persisting lessons for course ${courseId} to SQLite:`, error);
        }
      },
      // Provide fallback data from SQLite when offline
      async onCacheEntryAdded(
        courseId,
        { cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        try {
          await cacheDataLoaded;

          const unsubscribe = cacheEntryRemoved.then(async () => {
            try {
              const lessons = await database.getLessons(courseId);
              if (lessons.length > 0) {
                dispatch(
                  courseApiWithPersistence.util.updateQueryData(
                    'getCourseLessons',
                    courseId,
                    () => {
                      // Return the lessons with offline flag
                      return lessons.map(lesson => ({
                        ...lesson,
                        type: 'video',
                        isCompleted: false,
                        isLocked: false,
                        offline: true
                      }));
                    }
                  )
                );
              }
            } catch (error) {
              console.error(`Error fetching lessons for course ${courseId} from SQLite:`, error);
            }
          });

          return unsubscribe;
        } catch (error) {
          console.error('Error in onCacheEntryAdded:', error);
        }
      },
      providesTags: (result, error, courseId) => [
        { type: 'Lesson', id: courseId },
        'Lesson',
      ],
    }),

    getLessonById: builder.query<Lesson, { courseId: string; lessonId: string }>({
      query: ({ courseId, lessonId }) => `/${courseId}/lessons/${lessonId}`,
      async onQueryStarted({ courseId, lessonId }, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          // Store lesson in SQLite
          await database.addLesson({
            id: data.id,
            courseId: data.courseId,
            title: data.title,
            description: data.description,
            content: data.content,
            order: data.order,
            duration: data.duration,
            videoUrl: data.videoUrl || '',
            createdAt: typeof data.createdAt === 'string' ? data.createdAt : new Date().toISOString(),
            updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : new Date().toISOString(),
          });
        } catch (error) {
          console.error(`Error persisting lesson ${lessonId} to SQLite:`, error);
        }
      },
      // Provide fallback data from SQLite when offline
      async onCacheEntryAdded(
        { courseId, lessonId },
        { cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        try {
          await cacheDataLoaded;

          const unsubscribe = cacheEntryRemoved.then(async () => {
            try {
              const lesson = await database.getLessonById(lessonId);
              if (lesson) {
                dispatch(
                  courseApiWithPersistence.util.updateQueryData(
                    'getLessonById',
                    { courseId, lessonId },
                    (draft) => {
                      const updatedLesson = {
                        ...lesson,
                        type: 'video' as const,
                        isCompleted: false,
                        isLocked: false,
                        offline: true
                      };
                      Object.assign(draft, updatedLesson);
                      return draft;
                    }
                  )
                );
              }
            } catch (error) {
              console.error(`Error fetching lesson ${lessonId} from SQLite:`, error);
            }
          });

          return unsubscribe;
        } catch (error) {
          console.error('Error in onCacheEntryAdded:', error);
        }
      },
      providesTags: (result, error, { lessonId }) => [{ type: 'Lesson', id: lessonId }],
    }),

    // User progress with SQLite persistence
    markLessonComplete: builder.mutation<{ success: boolean }, { courseId: string; lessonId: string; userId: string }>({
      query: ({ courseId, lessonId }) => ({
        url: `/${courseId}/lessons/${lessonId}/complete`,
        method: 'POST',
      }),
      async onQueryStarted({ courseId, lessonId, userId }, { queryFulfilled }) {
        try {
          await queryFulfilled;
          
          // Update progress in SQLite
          const existingProgress = await database.getUserProgressForLesson(userId, lessonId);
          
          if (existingProgress) {
            await database.updateUserProgress({
              ...existingProgress,
              completed: true,
              completedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          } else {
            await database.addUserProgress({
              id: `${userId}-${lessonId}-${Date.now()}`,
              userId,
              courseId,
              lessonId,
              completed: true,
              completedAt: new Date().toISOString(),
              timeSpent: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.error(`Error persisting lesson completion to SQLite:`, error);
        }
      },
      invalidatesTags: ['Lesson', 'Progress'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useGetCourseLessonsQuery,
  useGetLessonByIdQuery,
  useMarkLessonCompleteMutation,
} = courseApiWithPersistence;