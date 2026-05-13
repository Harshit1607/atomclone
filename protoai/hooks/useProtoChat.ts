"use client";

import { useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface UseProtoChatOptions {
  apiEndpoint: string;
}

export function useProtoChat({ apiEndpoint }: UseProtoChatOptions) {
  const sessionId = useSelector((state: RootState) => state.session.sessionId);
  const [input, setInput] = useState("");

  const { messages, sendMessage, setMessages, status } = useChat({
    transport: new DefaultChatTransport({
      url: apiEndpoint,
      headers: {
        "x-session-id": sessionId,
      },
    }),
  });

  // Hydrate from sessionStorage on mount or when sessionId changes
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("protoai_session");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.sessionId === sessionId && parsed.messages) {
          setMessages(parsed.messages);
        } else if (parsed.sessionId !== sessionId) {
          setMessages([]);
        }
      }
    } catch (e) {
      console.error("Failed to parse protoai_session", e);
    }
  }, [sessionId, setMessages]);

  // Persist to sessionStorage on changes
  useEffect(() => {
    sessionStorage.setItem(
      "protoai_session",
      JSON.stringify({ messages, sessionId })
    );
  }, [messages, sessionId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const msg = input;
    setInput("");
    sendMessage({ role: "user", content: msg });
  };

  const append = (msg: { role: "user"; content: string }) => {
    sendMessage(msg);
  };

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    isLoading: status === "submitted" || status === "streaming",
  };
}
