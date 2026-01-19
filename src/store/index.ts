import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { authApi } from './api/authApi';
import { courseApi } from './api/courseApi';
import { courseApiWithPersistence } from './api/courseApiWithPersistence';
import { quizApi } from './api/quizApi';
import authSlice from './slices/authSlice';
import courseSlice from './slices/courseSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    // API slices
    [authApi.reducerPath]: authApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
    [courseApiWithPersistence.reducerPath]: courseApiWithPersistence.reducer,
    [quizApi.reducerPath]: quizApi.reducer,
    
    // Feature slices
    auth: authSlice,
    course: courseSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    })
      .concat(authApi.middleware)
      .concat(courseApi.middleware)
      .concat(courseApiWithPersistence.middleware)
      .concat(quizApi.middleware),
});

// Setup listeners for RTK Query
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
