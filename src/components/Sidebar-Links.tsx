"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import clsx from "clsx";
import { assets } from "@/assets/assets";
import Image, { StaticImageData } from "next/image";
import React, { useEffect, useState } from "react";
import { ChatbotThreadListItem, listThreads, deleteThread } from "@/lib/api/chatbot";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Type for each sidebar link
interface SidebarLink {
  title: string;
  icon: StaticImageData;
  href: string;
  isActive?: boolean; // optional if not all links use it
}

// Props for the SidebarLinks component
interface SidebarLinksProps {
  expand: boolean;
  isMobile: boolean;
  toggleSidebar?: () => void;
}

export default function SidebarLinks({
  expand,
  isMobile,
  toggleSidebar,
}: SidebarLinksProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentThreadId = searchParams.get("thread");
  const [threads, setThreads] = useState<ChatbotThreadListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const t = useTranslations("settingsSeeker");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ChatbotThreadListItem | null>(null);

  const links: SidebarLink[] = [
    {
      title: t("Explore"),
      icon: assets.explore,
      href: "/dashboard",
      isActive: true,
    },
    {
      title: t("Legal AI"),
      icon: assets.sparkles,
      href: "/dashboard/chat",
    },
    {
      title: t("Consultation"),
      icon: assets.briefcase,
      href: "/dashboard/consultation",
    },
  ];

  const truncate = (s?: string | null, n = 12) => {
    if (!s) return "New chat";
    const t = s.replace(/\s+/g, " ").trim();
    return t.length > n ? t.slice(0, n) + "…" : t;
  };

  const loadThreads = async (cursor?: string, append = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken") ||
            localStorage.getItem("authToken")
          : null;
      const guestId =
        typeof window !== "undefined" ? localStorage.getItem("guest_id") : null;
      const gid = token ? undefined : guestId || undefined;
      const { items, nextCursor } = await listThreads(gid, 10, cursor); // Load 10 threads per page

      console.log("loadThreads debug:", {
        cursor,
        append,
        itemsCount: items.length,
        nextCursor,
        hasNextCursor: !!nextCursor,
        totalThreads: append ? threads.length + items.length : items.length,
      });

      if (append) {
        setThreads((prev) => [...prev, ...items]);
      } else {
        setThreads(items);
      }

      setNextCursor(nextCursor);
      setHasMore(!!nextCursor); // has more if there's a nextCursor
    } catch (error) {
      console.error("Failed to load threads:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreThreads = () => {
    if (hasMore && nextCursor && !loading) {
      loadThreads(nextCursor, true);
    }
  };

  useEffect(() => {
    loadThreads(); // Load initial threads without cursor
  }, []);

  // Listen for newly created threads dispatched from chat page
  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<ChatbotThreadListItem>;
      const newThread = custom.detail;
      if (!newThread) return;
      setThreads((prev) => {
        if (prev.find((t) => t.id === newThread.id)) return prev;
        return [newThread, ...prev];
      });
    };
    window.addEventListener("chatbot:threadCreated", handler as EventListener);
    return () => window.removeEventListener("chatbot:threadCreated", handler as EventListener);
  }, []);

  // Listen for thread title/metadata updates (e.g., first message becomes title)
  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<Partial<ChatbotThreadListItem> & { id: string }>;
      const upd = custom.detail;
      if (!upd?.id) return;
      setThreads((prev) => prev.map((t) => (t.id === upd.id ? { ...t, ...upd } : t)));
    };
    window.addEventListener("chatbot:threadUpdated", handler as EventListener);
    return () => window.removeEventListener("chatbot:threadUpdated", handler as EventListener);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Navigation Links */}
      <div>
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.title}
              href={link.href}
              onClick={() => {
                if (isMobile && toggleSidebar) {
                  toggleSidebar();
                }
              }}
              className={clsx(
                "flex mb-2 gap-3 text-xs font-semibold text-gray-700 rounded-lg transition-colors hover:bg-amber-100 hover:text-gray-900",
                {
                  "bg-amber-100": isActive,
                  "px-3 py-2": expand,
                  "p-2 m-4": !expand,
                }
              )}
            >
              {expand ? (
                <>
                  <Image src={link.icon} alt={link.title} className="w-4 h-4" />
                  <p>{link.title}</p>
                </>
              ) : (
                <Image
                  src={link.icon}
                  alt={link.title}
                  className="w-4 h-4 mx-auto"
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Chat Threads Section - Takes remaining space */}
      {expand && threads.length > 0 && (
        <div className="flex flex-col flex-1 mt-3 min-h-0">
          <div className="flex items-center justify-between mb-2 px-3">
            <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide">
              {t("Conversations")}
            </span>
            <Link
              href="/dashboard/chat?new=true"
              className="text-[10px] px-2 py-1 bg-yellow-200 hover:bg-yellow-300 rounded text-gray-800"
            >
              {t("New")}
            </Link>
          </div>

          {/* Scrollable thread list container - Takes all available space */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {threads.map((thread) => (
              <div
                key={thread.id}
                className={clsx(
                  "group flex items-center mb-1 gap-2 text-xs text-gray-600 rounded-lg transition-colors hover:bg-amber-100 hover:text-gray-900 px-2 py-1",
                  {
                    "bg-yellow-200":
                      pathname === "/dashboard/chat" &&
                      currentThreadId === thread.id,
                  }
                )}
              >
                <Link
                  href={`/dashboard/chat?thread=${thread.id}`}
                  onClick={() => {
                    if (isMobile && toggleSidebar) {
                      toggleSidebar();
                    }
                  }}
                  className="flex items-center gap-2 flex-1 min-w-0"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  </div>
                  <p className="truncate">{truncate(thread.title)}</p>
                </Link>
                <button
                  aria-label="Delete conversation"
                  onClick={() => { setDeleteTarget(thread); setConfirmOpen(true); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] px-2 py-1 rounded hover:bg-red-100 hover:text-red-700 text-gray-400"
                >
                  ×
                </button>
              </div>
            ))}

            <Dialog open={confirmOpen} onOpenChange={(o) => setConfirmOpen(o)}>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Delete conversation</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this conversation? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <button
                    className="px-3 py-1.5 text-sm rounded bg-gray-100 hover:bg-gray-200"
                    onClick={() => setConfirmOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-3 py-1.5 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                    onClick={() => {
                      if (!deleteTarget) return;
                      const id = deleteTarget.id;
                      const guestId = typeof window !== "undefined" ? (localStorage.getItem("guest_id") || undefined) : undefined;
                      deleteThread(id, guestId)
                        .then(() => {
                          setThreads((prev) => prev.filter((t) => t.id !== id));
                          if (typeof window !== "undefined") {
                            window.dispatchEvent(new CustomEvent("chatbot:threadDeleted", { detail: { id } }));
                          }
                        })
                        .finally(() => {
                          setConfirmOpen(false);
                          setDeleteTarget(null);
                        })
                        .catch((err) => console.error("Failed to delete thread", err));
                    }}
                  >
                    Delete
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Load more button */}
            {hasMore && (
              <button
                onClick={loadMoreThreads}
                disabled={loading}
                className="flex mb-2 gap-3 text-[10px] text-gray-500 rounded-lg transition-colors hover:bg-amber-100 hover:text-gray-700 px-3 py-2 w-full disabled:opacity-50"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                </div>
                <p>{loading ? t("Loading") : t("Load more")}</p>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
