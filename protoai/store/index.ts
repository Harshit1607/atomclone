import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from './sessionSlice';
import { sessionPersistMiddleware } from './middleware';

export const store = configureStore({
  reducer: {
    session: sessionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sessionPersistMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
