import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';
import { User } from '@/types';
import { firebaseAuthService, AuthError } from '@/services/firebase/authService';

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

// Custom base query for Firebase authentication
const firebaseBaseQuery: BaseQueryFn<
  {
    type: 'login' | 'signup' | 'logout' | 'googleSignIn' | 'forgotPassword' | 'getCurrentUser' | 'refreshToken';
    data?: any;
  },
  unknown,
  AuthError
> = async ({ type, data }) => {
  try {
    switch (type) {
      case 'login':
        const loginResult = await firebaseAuthService.signInWithEmail(
          data.email,
          data.password
        );
        return { data: loginResult };

      case 'signup':
        const signupResult = await firebaseAuthService.signUpWithEmail(
          data.email,
          data.password,
          data.name
        );
        return { data: signupResult };

      case 'googleSignIn':
        const googleResult = await firebaseAuthService.signInWithGoogle();
        return { data: googleResult };

      case 'logout':
        await firebaseAuthService.signOut();
        return { data: undefined };

      case 'forgotPassword':
        await firebaseAuthService.sendPasswordResetEmail(data.email);
        return { data: undefined };

      case 'getCurrentUser':
        const user = await firebaseAuthService.getCurrentAppUser();
        if (!user) {
          return { error: { code: 'user-not-found', message: 'No user is currently signed in' } };
        }
        const token = await firebaseAuthService.getCurrentUserToken();
        return { data: { user, token: token || '' } };

      case 'refreshToken':
        const refreshedToken = await firebaseAuthService.getCurrentUserToken();
        if (!refreshedToken) {
          return { error: { code: 'token-not-found', message: 'No token available' } };
        }
        return { data: { token: refreshedToken } };

      default:
        return { error: { code: 'unknown', message: 'Unknown operation' } };
    }
  } catch (error: any) {
    if (error.code && error.message) {
      return { error: error as AuthError };
    }
    return {
      error: {
        code: 'unknown',
        message: error.message || 'An unexpected error occurred',
      },
    };
  }
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: firebaseBaseQuery,
  tagTypes: ['User', 'Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        type: 'login',
        data: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    signup: builder.mutation<LoginResponse, SignupRequest>({
      query: (userData) => ({
        type: 'signup',
        data: userData,
      }),
      invalidatesTags: ['Auth'],
    }),
    googleSignIn: builder.mutation<LoginResponse, void>({
      query: () => ({
        type: 'googleSignIn',
      }),
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        type: 'logout',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
    refreshToken: builder.mutation<{ token: string }, void>({
      query: () => ({
        type: 'refreshToken',
      }),
    }),
    forgotPassword: builder.mutation<void, { email: string }>({
      query: ({ email }) => ({
        type: 'forgotPassword',
        data: { email },
      }),
    }),
    getCurrentUser: builder.query<LoginResponse, void>({
      query: () => ({
        type: 'getCurrentUser',
      }),
      providesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useGoogleSignInMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useGetCurrentUserQuery,
} = authApi;
