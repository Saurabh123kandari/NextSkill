import { configureStore } from '@reduxjs/toolkit';
import { coursesApi } from '../services/coursesApi';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    user: userReducer,                   // normal slice
    [coursesApi.reducerPath]: coursesApi.reducer, // RTK Query API
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(coursesApi.middleware), // add RTK Query middleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
