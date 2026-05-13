import { Middleware } from '@reduxjs/toolkit';

export const sessionPersistMiddleware: Middleware = store => next => action => {
  const result = next(action);
  if (typeof window !== 'undefined') {
    // Save sessionId on any session action
    if (typeof action === 'object' && action !== null && 'type' in action) {
      const type = (action as { type: string }).type;
      if (type.startsWith('session/')) {
        const state = store.getState();
        sessionStorage.setItem('protoai_session_id', state.session.sessionId);
      }
    }
  }
  return result;
};
