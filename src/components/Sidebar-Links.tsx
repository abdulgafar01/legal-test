'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { assets } from '@/assets/assets';
import Image, { StaticImageData } from 'next/image';
import React, { useEffect, useState } from 'react';
import { ChatbotThreadListItem, listThreads } from '@/lib/api/chatbot';

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

const links: SidebarLink[] = [
  {
    title: 'Explore',
    icon: assets.explore,
    href: '/dashboard',
    isActive: true,
  },
  {
    title: 'Legal AI',
    icon: assets.sparkles,
    href: '/dashboard/chat',
  },
  {
    title: 'Consultation',
    icon: assets.briefcase,
    href: '/dashboard/consultation',
  },
];

export default function SidebarLinks({
  expand,
  isMobile,
  toggleSidebar,
}: SidebarLinksProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentThreadId = searchParams.get('thread');
  const [threads, setThreads] = useState<ChatbotThreadListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const truncate = (s?: string | null, n = 12) => {
    if (!s) return 'New chat'
    const t = s.replace(/\s+/g, ' ').trim()
    return t.length > n ? t.slice(0, n) + '…' : t
  }

  const loadThreads = async (cursor?: string, append = false) => {
    if (loading) return
    setLoading(true)
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem('accessToken') || localStorage.getItem('authToken')) : null
      const guestId = typeof window !== 'undefined' ? localStorage.getItem('guest_id') : null
      const gid = token ? undefined : guestId || undefined
      const { items, nextCursor } = await listThreads(gid, 10, cursor) // Load 10 threads per page
      
      console.log('loadThreads debug:', { 
        cursor, 
        append, 
        itemsCount: items.length, 
        nextCursor, 
        hasNextCursor: !!nextCursor,
        totalThreads: append ? threads.length + items.length : items.length
      })
      
      if (append) {
        setThreads(prev => [...prev, ...items])
      } else {
        setThreads(items)
      }
      
      setNextCursor(nextCursor)
      setHasMore(!!nextCursor) // has more if there's a nextCursor
    } catch (error) {
      console.error('Failed to load threads:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMoreThreads = () => {
    if (hasMore && nextCursor && !loading) {
      loadThreads(nextCursor, true)
    }
  }

  useEffect(() => {
    loadThreads() // Load initial threads without cursor
  }, [])

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
                'flex mb-2 gap-3 text-xs font-semibold text-gray-700 rounded-lg transition-colors hover:bg-amber-100 hover:text-gray-900',
                {
                  'bg-amber-100': isActive,
                  'px-3 py-2': expand,
                  'p-2 m-4': !expand,
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
            <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide">Conversations</span>
            <Link 
              href="/dashboard/chat?new=true"
              className="text-[10px] px-2 py-1 bg-yellow-200 hover:bg-yellow-300 rounded text-gray-800"
            >
              New
            </Link>
          </div>
          
          {/* Scrollable thread list container - Takes all available space */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {threads.map((thread) => (
              <Link
                key={thread.id}
                href={`/dashboard/chat?thread=${thread.id}`}
                onClick={() => {
                  if (isMobile && toggleSidebar) {
                    toggleSidebar();
                  }
                }}
                className={clsx(
                  'flex mb-1 gap-3 text-xs text-gray-600 rounded-lg transition-colors hover:bg-amber-100 hover:text-gray-900 px-3 py-2',
                  {
                    'bg-yellow-200': pathname === '/dashboard/chat' && currentThreadId === thread.id,
                  }
                )}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate">{truncate(thread.title)}</p>
                </div>
              </Link>
            ))}
            
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
                <p>{loading ? 'Loading...' : 'Load more'}</p>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
