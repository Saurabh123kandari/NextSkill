import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const coursesApi = createApi({
  reducerPath: 'coursesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://example.com/api/' }), // change this URL
  endpoints: (builder) => ({
    getCourses: builder.query<any[], void>({
      query: () => 'courses',
    }),
    getCourseById: builder.query<any, number>({
      query: (id) => `courses/${id}`,
    }),
  }),
});

export const { useGetCoursesQuery, useGetCourseByIdQuery } = coursesApi;
