import { createSlice } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

export interface SessionState {
  sessionId: string;
}

const initialState: SessionState = {
  sessionId: nanoid(),
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    newSession: (state) => {
      state.sessionId = nanoid();
    },
    // We can also allow hydration from storage
    setSessionId: (state, action) => {
      state.sessionId = action.payload;
    }
  },
});

export const { newSession, setSessionId } = sessionSlice.actions;
export default sessionSlice.reducer;
