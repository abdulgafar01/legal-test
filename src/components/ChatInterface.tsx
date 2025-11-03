import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowLeft, MoreVertical, Smile, Paperclip, Mic, Send, Play, FileText, Clock, Calendar, MessageSquare, CheckCircle2, Video } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { getConsultationById, isConsultationTimeReady, getTimeUntilConsultation, startConsultation, debugSetConsultationNow, completeConsultation, type Consultation } from '@/lib/api/consultations';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { getChatMessages, type ChatMessage } from '@/lib/api/chat';
import MarkdownMessage from '@/components/chat/MarkdownMessage';
import { useChatStore } from '@/stores/useChatStore';
import { openChatSocket } from '@/lib/ws';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAccountTypeStore } from '@/stores/useAccountTypeStore';
import { format, parseISO } from 'date-fns';
import { getCurrentUserId } from '@/lib/auth';

interface ChatInterfaceProps {
  selectedChat: string | null;
  onBack: () => void;
}

const ChatInterface = ({ selectedChat, onBack }: ChatInterfaceProps) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [joining, setJoining] = useState(false);
  const [timeUntil, setTimeUntil] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    isReady: false,
  });
  const { accountType } = useAccountTypeStore();
  const [forceAccess, setForceAccess] = useState(false);
  const chatStore = useChatStore();
  const consultationId = useMemo(
    () => (selectedChat ? parseInt(selectedChat) : null),
    [selectedChat]
  );
  const socketRef = useRef<ReturnType<typeof openChatSocket> | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const prevIdsRef = useRef<Set<string | number>>(new Set());
  const prevLenRef = useRef<number>(0);
  const initialScrolledRef = useRef<boolean>(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const openedViaDebugRef = useRef<boolean>(false);
  // Configurable artificial delay (previously hard-coded 80ms) – set NEXT_PUBLIC_CHAT_SCROLL_DELAY=0 to disable.
  const SCROLL_DELAY = Number(process.env.NEXT_PUBLIC_CHAT_SCROLL_DELAY ?? '0');
  const queueInitialScroll = () => {
    const run = () => {
      const el = scrollRef.current;
      if (!el) return;
      try {
        if (bottomRef.current?.scrollIntoView) {
          bottomRef.current.scrollIntoView({ block: "end" });
        } else {
          el.scrollTop = el.scrollHeight;
        }
      } catch {}
      initialScrolledRef.current = true;
    };
    requestAnimationFrame(() => requestAnimationFrame(run));
    if (SCROLL_DELAY > 0) setTimeout(run, SCROLL_DELAY);
  };
  const setScrollEl = (el: HTMLDivElement | null) => {
    scrollRef.current = el;
    if (el && !initialScrolledRef.current && messages.length > 0) {
      queueInitialScroll();
    }
  };
  // Subscribe to store maps once; derive per-consultation values without creating new arrays
  const messagesMap = useChatStore((s) => s.messages);
  const nextCursorMap = useChatStore((s) => s.nextCursorByConsultation);
  const readOnlyMap = useChatStore((s) => s.readOnlyByConsultation);
  const EMPTY_MESSAGES: ChatMessage[] = useMemo(() => [], []);
  const messages = consultationId
    ? messagesMap[consultationId] ?? EMPTY_MESSAGES
    : EMPTY_MESSAGES;
  const nextCursor = consultationId
    ? nextCursorMap[consultationId] ?? null
    : null;
  const readOnly = consultationId ? !!readOnlyMap[consultationId] : false;
  // Access gating computed early to keep hook order consistent
  const statusName = consultation?.status_info.name;
  const autoInProgress = statusName === "in_progress";
  const isCompleted = statusName === "completed";
  const canAccessChat = consultation
    ? autoInProgress
      ? true
      : isConsultationTimeReady(consultation)
    : true;
  const allowedToEnter =
    (autoInProgress || canAccessChat || forceAccess) && !isCompleted;

  useEffect(() => {
    if (selectedChat) {
      loadConsultationDetails();
    }
  }, [selectedChat]);

  useEffect(() => {
    if (consultation) {
      const updateTimer = () => {
        const newTimeInfo = getTimeUntilConsultation(consultation);
        setTimeUntil(newTimeInfo);
      };

      updateTimer();
      const interval = setInterval(updateTimer, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [consultation]);

  // Listen for status change events from WebSocket
  useEffect(() => {
    const handler = (e: Event) => {
      const detail: any = (e as CustomEvent).detail;
      if (!consultationId) return;
      if (detail && detail.consultation_id === consultationId) {
        loadConsultationDetails();
      }
    };
    window.addEventListener(
      "consultation-status-changed",
      handler as EventListener
    );
    return () =>
      window.removeEventListener(
        "consultation-status-changed",
        handler as EventListener
      );
  }, [consultationId]);

  const loadConsultationDetails = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const response = await getConsultationById(parseInt(selectedChat));
      if (response.success) {
        setConsultation(response.data);
      }
    } catch (error) {
      console.error("Error loading consultation details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Track when Open Session (Debug) was used
  useEffect(() => {
    if (forceAccess) {
      openedViaDebugRef.current = true;
    }
  }, [forceAccess]);

  // History: fetch messages with cursor pagination
  const {
    data: pages,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["chat", "messages", consultationId],
    queryFn: async ({ pageParam }) => {
      if (!consultationId) return { data: [], next_cursor: null };
      return getChatMessages(
        consultationId,
        50,
        pageParam as string | undefined
      );
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    enabled: !!consultationId,
  });

  // Merge history pages into store
  useEffect(() => {
    if (!consultationId || !pages) return;
    const all: ChatMessage[] = [];
    for (const p of pages.pages) {
      all.unshift(...p.data);
    }
    if (all.length) {
      chatStore.addMessages(consultationId, all, "prepend");
      const nextCursor =
        pages.pages[pages.pages.length - 1]?.next_cursor ?? null;
      chatStore.setNextCursor(consultationId, nextCursor);
      // Prime previous IDs on initial history load to avoid animating everything
      prevIdsRef.current = new Set(all.map((m) => m.id));
      // Scroll to bottom on open after DOM paints
      queueInitialScroll();
    }
  }, [pages, consultationId]);

  // Open WebSocket when allowed (supports auto in_progress sessions)
  useEffect(() => {
    if (!consultationId) return;
    if (!consultation) return;
    if (!allowedToEnter) return;
    socketRef.current = openChatSocket(consultationId);
    return () => {
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [consultationId, consultation, allowedToEnter]);

  // Auto-scroll on new messages appended; cache seen ids after paint
  useEffect(() => {
    if (!scrollRef.current) return;
    const listLen = messages.length;
    const prevLen = prevLenRef.current;
    const appended = listLen > prevLen;
    if (appended) {
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
    }
    // Update seen ids for animation dedupe
    prevIdsRef.current = new Set(messages.map((m) => m.id));
    prevLenRef.current = listLen;
  }, [messages]);

  // Reset scroll trackers when switching conversations
  useEffect(() => {
    prevLenRef.current = 0;
    prevIdsRef.current = new Set();
    initialScrolledRef.current = false;
  }, [consultationId]);

  // Ensure initial scroll once messages are first rendered
  useEffect(() => {
    if (!initialScrolledRef.current && messages.length > 0) {
      queueInitialScroll();
    }
  }, [messages, consultationId]);

  // When chat becomes allowed (e.g., after clicking Open Session), ensure we scroll to bottom once
  useEffect(() => {
    if (!allowedToEnter) return;
    if (messages.length === 0) return;
    if (openedViaDebugRef.current) {
      const scrollNow = () => {
        if (bottomRef.current?.scrollIntoView) {
          try {
            bottomRef.current.scrollIntoView({ block: "end" });
          } catch {}
        }
        if (scrollRef.current) {
          try {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          } catch {}
        }
        initialScrolledRef.current = true;
      };
      setTimeout(scrollNow, 0);
      setTimeout(scrollNow, 150);
      openedViaDebugRef.current = false;
      return;
    }
    if (initialScrolledRef.current) return;
    queueInitialScroll();
  }, [allowedToEnter, messages.length]);

  const chatData = {
    "wade-1": {
      name: "Wade Warren",
      status: "Active now",
      avatar: "/placeholder.svg",
      messages: [
        {
          id: 1,
          text: "Hi Wade, i have a case",
          time: "15:18",
          sent: true,
          type: "text",
        },
        {
          id: 2,
          text: "Hello Lilian!",
          time: "15:22",
          sent: false,
          type: "text",
        },
        {
          id: 3,
          text: "Hope you are doing very well today. Tell me about the case.",
          time: "15:22",
          sent: false,
          type: "text",
        },
        {
          id: 4,
          text: "Please, can I send a VN?",
          time: "15:18",
          sent: true,
          type: "text",
        },
        {
          id: 5,
          text: "Sure, you can please",
          time: "15:22",
          sent: false,
          type: "text",
        },
        {
          id: 6,
          duration: "0:37",
          time: "15:03",
          sent: true,
          type: "voice",
        },
        {
          id: 7,
          fileName: "Case file.pdf",
          fileSize: "246 KB",
          pages: "6 pages",
          time: "15:03",
          sent: true,
          type: "file",
        },
      ],
    },
    "floyd-1": {
      name: "Floyd Miles",
      status: "Active now",
      avatar: "/placeholder.svg",
      messages: [
        {
          id: 1,
          text: "Hello! How can I help you today?",
          time: "14:30",
          sent: false,
          type: "text",
        },
      ],
    },
  };

  const currentChat = selectedChat
    ? chatData[selectedChat as keyof typeof chatData]
    : null;

  if (!consultation && !currentChat) {
    return (
      <div
        className="flex-1 flex items-center justify-center bg-gray-50"
        style={{ height: "calc(100vh - 60px)" }}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Select a conversation
          </h2>
          <p className="text-gray-600">
            Choose a chat from the sidebar to start messaging
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className="flex-1 flex items-center justify-center bg-gray-50"
        style={{ height: "calc(100vh - 60px)" }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading consultation...</p>
        </div>
      </div>
    );
  }

  // Check if consultation time has arrived (values computed above)

  // If consultation exists but time hasn't arrived, show waiting screen
  // Closed consultation (past) state
  if (consultation && isCompleted) {
    const counterpart =
      accountType === "professional"
        ? consultation.service_seeker_info
        : consultation.practitioner_info;
    return (
      <div
        className="flex-1 flex items-center justify-center bg-gray-50"
        style={{ height: "calc(100vh - 60px)" }}
      >
        <div className="text-center p-8 max-w-md">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Consultation Completed
          </h2>
          <p className="text-gray-600 mb-6">
            This consultation has been completed.{" "}
            {accountType === "service-seeker"
              ? `You can book a new session with ${counterpart.first_name} ${counterpart.last_name}.`
              : "Thank you for your session."}
          </p>
          {accountType === "service-seeker" && (
            <div className="space-y-3">
              <Button
                className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                onClick={() =>
                  window.location.assign(
                    `/dashboard/professionals/${consultation.practitioner_info.id}`
                  )
                }
              >
                Book New Consultation
              </Button>
              <Button variant="outline" className="w-full" onClick={onBack}>
                Back to Consultations
              </Button>
            </div>
          )}
          {accountType === "professional" && (
            <Button variant="outline" onClick={onBack}>
              Back to Consultations
            </Button>
          )}
        </div>
      </div>
    );
  }

  const debugEnabled =
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_ENABLE_DEBUG_CONSULTATION === "true";

  if (consultation && !allowedToEnter) {
    const counterpart =
      accountType === "professional"
        ? consultation.service_seeker_info
        : consultation.practitioner_info;
    const consultationDate = parseISO(consultation.time_slot_info.date);
    const formattedDate = format(consultationDate, "EEEE, MMMM d, yyyy");
    const formattedTime = `${consultation.time_slot_info.start_time} - ${consultation.time_slot_info.end_time}`;

    return (
      <div
        className="flex-1 flex items-center justify-center bg-gray-50"
        style={{ height: "calc(100vh - 60px)" }}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="lg:hidden"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={counterpart.profile_image || ""}
                alt={`${counterpart.first_name} ${counterpart.last_name}`}
              />
              <AvatarFallback>
                {counterpart.first_name[0]}
                {counterpart.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">
                {counterpart.first_name} {counterpart.last_name}
              </h3>
              <p className="text-sm text-gray-600">Consultation scheduled</p>
            </div>
          </div>
        </div>

        {/* Waiting Content */}
        <div className="text-center p-8 max-w-md">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-blue-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Consultation Not Ready
          </h2>
          <p className="text-gray-600 mb-6">
            Your consultation with {counterpart.first_name}{" "}
            {counterpart.last_name} is scheduled for:
          </p>

          <div className="bg-white rounded-lg p-6 border mb-6">
            <div className="flex items-center justify-center space-x-2 text-gray-600 mb-2">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">{formattedDate}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{formattedTime}</span>
            </div>
          </div>

          {timeUntil.isReady ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">
                Your consultation is ready to start!
              </p>
              <p className="text-green-600 text-sm">
                Please refresh the page to access the chat.
              </p>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 font-medium">
                Time remaining: {timeUntil.days > 0 && `${timeUntil.days}d `}
                {timeUntil.hours > 0 && `${timeUntil.hours}h `}
                {timeUntil.minutes}m
              </p>
              <p className="text-yellow-600 text-sm">
                Chat will be available 15 minutes before your consultation.
              </p>
            </div>
          )}

          {debugEnabled &&
            !consultation.is_past &&
            !autoInProgress &&
            !isCompleted && (
              <div className="mt-6 flex items-center justify-center gap-3">
                <Button
                  onClick={async () => {
                    try {
                      setLoading(true);
                      await debugSetConsultationNow(consultation.id);
                      await loadConsultationDetails();
                      // After shifting time, force access and start consultation
                      setForceAccess(true);
                      await startConsultation(consultation.id, { force: true });
                      await loadConsultationDetails();
                    } catch (e) {
                      console.error("Failed debug open:", e);
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="bg-gray-900 hover:bg-gray-800 text-white"
                >
                  Open Session (Debug)
                </Button>
                {consultation.meeting_link && (
                  <Button
                    variant="secondary"
                    onClick={() =>
                      window.open(
                        consultation.meeting_link as string,
                        "_blank",
                        "noopener"
                      )
                    }
                  >
                    Open Meeting Link
                  </Button>
                )}
              </div>
            )}
        </div>
      </div>
    );
  }

  // Display name for header
  // Derive counterpart name robustly; treat store 'professional' as practitioner perspective; otherwise show practitioner.
  const currentUserId = getCurrentUserId();
  let displayName = currentChat?.name || "Unknown";
  let counterpartImage: string | undefined = currentChat?.avatar;
  if (consultation) {
    const seeker = consultation.service_seeker_info;
    const practitioner = consultation.practitioner_info; // has user_id
    const isUserPractitioner = currentUserId === practitioner.user_id;
    const counterpart = isUserPractitioner ? seeker : practitioner;
    displayName = `${counterpart.first_name} ${counterpart.last_name}`;
    counterpartImage = counterpart.profile_image;
  }

  const displayAvatar = counterpartImage;

  const displayStatus = consultation
    ? consultation.status_info.name === "in_progress"
      ? "In consultation"
      : "Available"
    : currentChat?.status || "Active now";

  const handleSendMessage = () => {
    if (!consultationId) return;
    const text = message.trim();
    if (!text) return;
    socketRef.current?.send(text);
    setMessage("");
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleStartConsultationDebug = async () => {
    if (!consultationId) return;
    try {
      setLoading(true);
      await startConsultation(consultationId, {
        force: process.env.NODE_ENV === "development",
      });
      await loadConsultationDetails();
    } catch (e) {
      console.error("Failed to start consultation:", e);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="flex-1 flex flex-col bg-white"
      style={{ height: "calc(100vh - 60px)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="lg:hidden"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Avatar className="w-10 h-10">
            <AvatarImage src={displayAvatar || ""} alt={displayName} />
            <AvatarFallback>
              {displayName
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900">{displayName}</h3>
            <p className="text-sm text-green-600">{displayStatus}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {consultation && (autoInProgress || isConsultationTimeReady(consultation)) && (
            <button
              type="button"
              disabled={joining}
              onClick={() => {
                if (joining) return;
                setJoining(true);
                window.location.assign(`/meeting/${consultation.id}`);
                setTimeout(() => setJoining(false), 3000);
              }}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md ${joining ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white text-sm`}
            >
              <Video className="w-4 h-4" /> {joining ? 'Opening…' : 'Join Video'}
            </button>
          )}
          {consultation &&
            consultation.status_info.name !== "in_progress" &&
            (debugEnabled || accountType === "professional") && (
              <Button
                size="sm"
                className="bg-gray-900 hover:bg-gray-800 text-white"
                onClick={handleStartConsultationDebug}
              >
                Start (Debug)
              </Button>
            )}
          {consultation &&
            consultation.status_info.name === "in_progress" &&
            !isCompleted && (
              <Button
                size="sm"
                variant="outline"
                disabled={completing}
                className="border-red-600 text-red-600 hover:bg-red-50 disabled:opacity-50"
                onClick={() => setConfirmOpen(true)}
              >
                Complete
              </Button>
            )}
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={setScrollEl}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ maxHeight: "calc(100vh - 60px - 64px - 64px)" }}
      >
        {/* Read-only banner when chat is not writable */}
        {consultation && readOnly && (
          <div className="flex justify-center">
            <span className="text-xs text-yellow-800 bg-yellow-100 border border-yellow-200 px-3 py-1 rounded">
              Chat is read-only until the session starts
            </span>
          </div>
        )}
        {/* Date separator */}
        <div className="flex justify-center">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {consultation
              ? format(parseISO(consultation.time_slot_info.date), "dd-MM-yyyy")
              : "24-01-2025"}
          </span>
        </div>

        {/* Show consultation-specific content or fallback to mock messages */}
        {consultation ? (
          <>
            {nextCursor ? (
              <div className="flex justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={isFetchingNextPage}
                  onClick={() => fetchNextPage()}
                >
                  {isFetchingNextPage ? "Loading..." : "Load older messages"}
                </Button>
              </div>
            ) : null}

            {messages.map((msg) => {
              const currentUserId = getCurrentUserId();
              const isMine =
                currentUserId != null && msg.sender.id === currentUserId;
              const isNew = !prevIdsRef.current.has(msg.id);
              const refCb = (el: HTMLDivElement | null) => {
                if (!el || !isNew) return;
                try {
                  el.animate(
                    [
                      { opacity: 0, transform: "translateY(4px)" },
                      { opacity: 1, transform: "translateY(0)" },
                    ],
                    { duration: 180, easing: "ease-out" }
                  );
                } catch {}
              };
              return (
                <div key={msg.id} ref={refCb} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`prose prose-sm dark:prose-invert max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isMine ? 'bg-yellow-100 text-gray-900' : 'bg-gray-100 text-gray-900'}`}>
                    <MarkdownMessage content={msg.content} />
                    <div className="flex items-center justify-end mt-1 space-x-1">
                      <span className="text-xs text-gray-500">{format(parseISO(msg.created_at), 'HH:mm')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </>
        ) : (
          currentChat?.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.sent
                    ? "bg-yellow-100 text-gray-900"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {msg.type === "text" && <p className="text-sm">{msg.text}</p>}

                {msg.type === "voice" && (
                  <div className="flex items-center space-x-2 bg-yellow-200 rounded-lg p-2">
                    <Button
                      size="sm"
                      className="w-8 h-8 rounded-full bg-yellow-600 hover:bg-yellow-700"
                    >
                      <Play className="w-3 h-3 fill-white" />
                    </Button>
                    <div className="flex-1">
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 30 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-0.5 bg-yellow-600 rounded-full"
                            style={{ height: `${Math.random() * 20 + 4}px` }}
                          />
                        ))}
                      </div>
                    </div>
                    {/* <span className="text-xs text-gray-600">{msg.duration}</span> */}
                  </div>
                )}

                {msg.type === "file" && (
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                    <div className="w-12 h-12 bg-red-500 rounded flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      {/* <p className="text-sm font-medium">{msg.fileName}</p> */}
                      <p className="text-xs text-gray-500">
                        {/* {msg.pages} • {msg.fileSize} • pdf */}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end mt-1 space-x-1">
                  <span className="text-xs text-gray-500">{msg.time}</span>
                  {msg.sent && (
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                      <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Subscription notification - only show for mock chats */}
        {!consultation && (
          <Card className="mx-4 bg-yellow-50 border-yellow-200">
            <CardContent className="p-4 text-center">
              <p className="text-sm font-medium text-gray-900 mb-2">
                Your subscription will expire in 7 days.
              </p>
              <p className="text-xs text-gray-600 mb-3">
                Kindly renew before the end of 7 days to continue consulting
                with Wade Warren.
              </p>
              <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                Renew Subscription
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message"
              className="pr-12"
              disabled={consultation ? readOnly : false}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            disabled={consultation ? readOnly : false}
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleRecording}
            className={isRecording ? "bg-red-100" : ""}
          >
            <Mic className={`w-4 h-4 ${isRecording ? "text-red-500" : ""}`} />
          </Button>
          {message.trim() && (
            <Button
              onClick={handleSendMessage}
              size="sm"
              disabled={consultation ? readOnly : false}
            >
              <Send className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      {/* Completion Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onOpenChange={(o) => {
          if (!completing) setConfirmOpen(o);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Consultation</DialogTitle>
            <DialogDescription>
              This will mark the consultation as completed and close the chat
              for both participants. You cannot send further messages afterward.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm text-gray-600">
            <p>Are you sure you want to continue?</p>
          </div>
          <DialogFooter className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              disabled={completing}
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-500 text-white"
              disabled={completing}
              onClick={async () => {
                if (!consultation) return;
                try {
                  setCompleting(true);
                  const optimisticPayload = {
                    consultation_id: consultation.id,
                    status: "completed",
                    completed_at: new Date().toISOString(),
                  };
                  window.dispatchEvent(
                    new CustomEvent("consultation-status-changed", {
                      detail: optimisticPayload,
                    })
                  );
                  toast.info("Completing consultation...");
                  await completeConsultation(consultation.id);
                  toast.success("Consultation completed");
                  await loadConsultationDetails();
                  setConfirmOpen(false);
                } catch (e) {
                  console.error("Failed to complete consultation:", e);
                  toast.error("Failed to complete consultation");
                } finally {
                  setCompleting(false);
                }
              }}
            >
              {completing ? "Completing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatInterface;
