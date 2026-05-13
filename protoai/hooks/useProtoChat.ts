"use client";

import { useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface UseProtoChatOptions {
  apiEndpoint: string;
  apiKey?: string;
}

export function useProtoChat({ apiEndpoint, apiKey }: UseProtoChatOptions) {
  const sessionId = useSelector((state: RootState) => state.session.sessionId);
  const [input, setInput] = useState("");

  const { messages, sendMessage, setMessages, status } = useChat({
    api: apiEndpoint,
    headers: {
      "x-session-id": sessionId,
      ...(apiKey ? { "x-api-key": apiKey } : {}),
    },
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
    sendMessage({ role: "user", parts: [{ type: "text", text: msg }] });
  };

  const append = (msg: { role: "user"; content: string }) => {
    try {
      sendMessage({ role: "user", parts: [{ type: "text", text: msg.content }] });
    } catch (e) {
      console.error("SendMessage failed", e);
    }
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
