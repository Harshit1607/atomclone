import { useEffect } from 'react';
import { useChat } from 'ai/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface UseProtoChatOptions {
  apiEndpoint: string;
}

export function useProtoChat({ apiEndpoint }: UseProtoChatOptions) {
  const sessionId = useSelector((state: RootState) => state.session.sessionId);

  const chat = useChat({
    api: apiEndpoint,
    headers: {
      "x-session-id": sessionId,
    },
  });

  const { messages, setMessages } = chat;

  // Hydrate from sessionStorage on mount or when sessionId changes
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('protoai_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.sessionId === sessionId && parsed.messages) {
          setMessages(parsed.messages);
        } else if (parsed.sessionId !== sessionId) {
          // If session changed, clear messages locally (new session)
          setMessages([]);
        }
      }
    } catch (e) {
      console.error('Failed to parse protoai_session', e);
    }
  }, [sessionId, setMessages]);

  // Persist to sessionStorage on changes
  useEffect(() => {
    sessionStorage.setItem(
      'protoai_session',
      JSON.stringify({ messages, sessionId })
    );
  }, [messages, sessionId]);

  return chat;
}
