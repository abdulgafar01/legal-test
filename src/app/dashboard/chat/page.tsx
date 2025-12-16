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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTranslations } from "next-intl";

type Msg = ChatbotMessageDTO & { temp_id?: string; isOptimistic?: boolean };

const Page = () => {
  const [thread, setThread] = useState<ChatbotThread | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [guestId, setGuestId] = useState<string | null>(null);
  const [creatingThread, setCreatingThread] = useState(false);
  const t = useTranslations("chat");

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
        // Remove optimistic user message and add the confirmed one
        setMessages((prev) => {
          const filtered = prev.filter((m) => !m.isOptimistic);
          return [...filtered, msg.payload];
        });
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

      // Immediately add user message to the UI (optimistic update)
      // const userMessageId = `user-${Date.now()}`;
      // const userMessage: Msg = {
      //   id: userMessageId,
      //   thread: thread?.id || "",
      //   role: "user",
      //   content: trimmed,
      //   status: "completed",
      //   created_at: new Date().toISOString(),
      //   isOptimistic: true,
      // };
      // setMessages((prev) => [...prev, userMessage]);

      // If no thread yet (blank state after user deleted all threads), create one first
      if (!thread && guestId && !creatingThread) {
        try {
          setCreatingThread(true);
          const t = await createThread(guestId);
          setThread(t);
          // Update the user message with the correct thread ID
          // setMessages((prev) =>
          //   prev.map((m) =>
          //     m.id === userMessageId ? { ...m, thread: t.id } : m
          //   )
          // );
          connectWS(t, guestId);
          router.replace(`/dashboard/chat?thread=${t.id}`);
          // Notify sidebar and any thread lists to update without a page refresh
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("chatbot:threadCreated", { detail: t }));
          }
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

          // Optimistically set the thread title to the first user message and notify sidebar
          const now = new Date().toISOString();
          setThread((prev) => (prev ? { ...prev, title: prev.title || trimmed, updated_at: now } : prev));
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("chatbot:threadUpdated", {
                detail: { id: t.id, title: trimmed, updated_at: now },
              })
            );
          }
        } catch (e) {
          console.error(
            "Failed to auto-create thread before sending message",
            e
          );
          // Remove optimistic message on error
          // setMessages((prev) => prev.filter((m) => m.id !== userMessageId));
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

      // If this is the first message and the title is still empty, optimistically set it and broadcast update
      if (thread && !thread.title) {
        const now = new Date().toISOString();
        setThread({ ...thread, title: trimmed, updated_at: now });
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("chatbot:threadUpdated", {
              detail: { id: thread.id, title: trimmed, updated_at: now },
            })
          );
        }
      }
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
      // Notify sidebar and any thread lists to update without a page refresh
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("chatbot:threadCreated", { detail: t }));
      }
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
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-black h-[calc(100vh-60px)] mt-2 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        {messages.length === 0 ? (
          <div className="flex items-center gap-3 mb-10">
            <p className="text-2xl font-medium text-gray-700">{t("helpText")}</p>
          </div>
        ) : (
          <div className="w-full max-w-2xl flex-1 overflow-y-auto mt-6 space-y-4 pb-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`w-full flex animate-fade-in ${
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
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    className="prose prose-sm max-w-none text-inherit"
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            
            {/* Loading indicator - show when assistant is streaming */}
            {messages.length > 0 && messages[messages.length - 1]?.role === "user" && (
              <div className="w-full flex justify-start animate-fade-in">
                <div className="rounded-2xl rounded-bl-none px-4 py-3 bg-gray-100 text-gray-900 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                    <span className="text-sm text-gray-600 ml-1">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={bottomRef} />
          </div>
        )}

        <PromptBox onSubmit={handleSubmit} placeholder={t("promptPlaceholder")} />

        <p className="text-xs mb-2 py-2 text-gray-500 text-center">{t("chatDisclaimer")}</p>
      </div>
    </>
  );
};

export default Page;
