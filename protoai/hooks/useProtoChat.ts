"use client";

import { useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { HttpChatTransport } from "ai";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface UseProtoChatOptions {
  apiEndpoint: string;
}

export function useProtoChat({ apiEndpoint }: UseProtoChatOptions) {
  const sessionId = useSelector((state: RootState) => state.session.sessionId);
  const [input, setInput] = useState("");

  const chat = useChat({
    transport: new HttpChatTransport({
      url: apiEndpoint,
      headers: {
        "x-session-id": sessionId,
      },
    }),
  });

  const { messages, setMessages } = chat;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const msg = input;
    setInput("");
    await chat.sendMessage({ role: "user", content: msg });
  };

  const append = async (msg: { role: "user"; content: string }) => {
    await chat.sendMessage(msg);
  };

  return {
    ...chat,
    input,
    handleInputChange,
    handleSubmit,
    append,
    isLoading: chat.status === "submitted" || chat.status === "streaming",
  };
}
