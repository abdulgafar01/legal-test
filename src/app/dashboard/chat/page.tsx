"use client";

import PromptBox from "@/components/PromptBox";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ChatbotMessageDTO,
  ChatbotThread,
  createThread,
  getThreadMessages,
} from "@/lib/api/chatbot";
import { buildWsUrl } from "@/config/ws";
import { useSearchParams, useRouter } from "next/navigation";

type Msg = ChatbotMessageDTO & { temp_id?: string };

const Page = () => {
  const [thread, setThread] = useState<ChatbotThread | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [guestId, setGuestId] = useState<string | null>(null);
  const [creatingThread, setCreatingThread] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const search = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    let gid = localStorage.getItem("guest_id");
    if (!gid) {
      gid = crypto.randomUUID();
      localStorage.setItem("guest_id", gid);
    }
    setGuestId(gid);
  }, []);

  const connectWS = useCallback((t: ChatbotThread, gid: string | null) => {
    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("authToken");
    const qs = new URLSearchParams();
    if (token) qs.set("token", token);
    if (gid) qs.set("guest_id", gid);
    const url = buildWsUrl(`/ws/chatbot/${t.id}/?${qs.toString()}`);
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "message:created") {
        setMessages((prev) => [...prev, msg.payload]);
      } else if (msg.type === "assistant:started") {
        const temp_id = msg.payload.temp_id as string;
        setMessages((prev) => [
          ...prev,
          {
            id: temp_id,
            thread: t.id,
            role: "assistant",
            content: "",
            status: "streaming",
            created_at: new Date().toISOString(),
            temp_id,
          },
        ]);
      } else if (msg.type === "assistant:delta") {
        const { temp_id, delta } = msg.payload as {
          temp_id: string;
          delta: string;
        };
        setMessages((prev) =>
          prev.map((m) =>
            m.temp_id === temp_id
              ? { ...m, content: (m.content || "") + delta }
              : m
          )
        );
      } else if (msg.type === "assistant:completed") {
        const { temp_id, ...rest } = msg.payload;
        setMessages((prev) =>
          prev.map((m) =>
            m.temp_id === temp_id
              ? ({ ...m, ...rest, temp_id: undefined } as Msg)
              : m
          )
        );
      }
    };

    ws.onopen = () => {
      // console.debug('WS connected', url)
    };
    ws.onerror = (e) => {
      // console.error('WS error', e)
    };
    ws.onclose = () => {
      wsRef.current = null;
    };
  }, []);

  const selectThread = useCallback(
    async (id: string) => {
      if (!id) return;
      try {
        const t: ChatbotThread = {
          id,
          title: null as any,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          guest_id: undefined,
        };
        setThread(t);
        setMessages([]);
        const { messages } = await getThreadMessages(id, guestId || undefined);
        setMessages(messages);
        connectWS(t, guestId);
        router.replace(`/dashboard/chat?thread=${id}`);
      } catch (error) {
        console.error("Failed to load thread:", error);
      }
    },
    [connectWS, guestId, router]
  );

  const handleSubmit = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      // If no thread yet (blank state after user deleted all threads), create one first
      if (!thread && guestId && !creatingThread) {
        try {
          setCreatingThread(true);
          const t = await createThread(guestId);
          setThread(t);
          setMessages([]);
          connectWS(t, guestId);
          router.replace(`/dashboard/chat?thread=${t.id}`);
          // slight delay to allow ws to open; fallback send once open
          setTimeout(() => {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
              wsRef.current.send(
                JSON.stringify({
                  type: "message:new",
                  payload: { content: trimmed },
                })
              );
            }
          }, 150);
        } catch (e) {
          console.error(
            "Failed to auto-create thread before sending message",
            e
          );
        } finally {
          setCreatingThread(false);
        }
        return;
      }

      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        console.warn("Chat not ready yet. Initializing...");
        return;
      }
      wsRef.current.send(
        JSON.stringify({ type: "message:new", payload: { content: trimmed } })
      );
    },
    [thread, guestId, creatingThread, connectWS, router]
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const newChat = useCallback(async () => {
    if (!guestId) return;
    try {
      const t = await createThread(guestId);
      setThread(t);
      setMessages([]);
      connectWS(t, guestId);
      router.replace(`/dashboard/chat?thread=${t.id}`);
    } catch (error) {
      console.error("Failed to create new chat:", error);
    }
  }, [guestId, connectWS, router]);

  // Load thread if provided in URL (?thread=UUID) or create new if "new" param
  useEffect(() => {
    const threadParam = search.get("thread");
    const newParam = search.get("new");

    if (threadParam && guestId) {
      selectThread(threadParam);
    } else if (newParam === "true" && guestId) {
      newChat();
    }
  }, [guestId, selectThread, newChat, search]);

  // Auto create a new chat thread when user lands on blank state with no params
  useEffect(() => {
    if (
      guestId &&
      !thread &&
      !search.get("thread") &&
      !search.get("new") &&
      !creatingThread
    ) {
      newChat();
    }
  }, [guestId, thread, search, newChat, creatingThread]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 text-black h-[calc(100vh-60px)] mt-2 overflow-hidden">
      {messages.length === 0 ? (
        <div className="flex items-center gap-3 mb-3">
          <p className="text-2xl font-medium">How can i be of help today?</p>
        </div>
      ) : (
        <div className="w-full max-w-2xl flex-1 overflow-auto mt-6 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`w-full flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                  m.role === "user"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-black"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}

      <PromptBox onSubmit={handleSubmit} />

      <p className="text-xs mb-2 py-2 text-gray-500">
        Legal Ai can make mistakes, kindly check important information
      </p>
    </div>
  );
};

export default Page;
