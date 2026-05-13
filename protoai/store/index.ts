import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from './sessionSlice';
import { sessionPersistMiddleware } from './middleware';

const preloadedState = () => {
  if (typeof window !== 'undefined') {
    const savedId = sessionStorage.getItem('protoai_session_id');
    if (savedId) {
      return { session: { sessionId: savedId } };
    }
  }
  return undefined;
};

export const store = configureStore({
  reducer: {
    session: sessionReducer,
  },
  preloadedState: preloadedState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sessionPersistMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
