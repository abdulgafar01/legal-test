"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChatbotThreadListItem, listThreads } from '@/lib/api/chatbot'

type Props = {
  guestId: string | null
  selectedId?: string | null
  onSelect: (threadId: string) => void
  hrefBuilder?: (id: string) => string
}

const truncate = (s?: string | null, n = 15) => {
  if (!s) return 'New chat'
  const t = s.replace(/\s+/g, ' ').trim()
  return t.length > n ? t.slice(0, n) + '…' : t
}

const ThreadList: React.FC<Props> = ({ guestId, selectedId, onSelect, hrefBuilder }) => {
  const [items, setItems] = useState<ChatbotThreadListItem[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const load = async (cursor?: string | null) => {
    if (loading) return
    setLoading(true)
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem('accessToken') || localStorage.getItem('authToken')) : null
      const gid = token ? undefined : guestId || null
      const { items: data, nextCursor } = await listThreads(gid || undefined, 10, cursor || undefined)
      setItems((prev) => (cursor ? [...prev, ...data] : data))
      setNextCursor(nextCursor)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guestId])

  // Live-update when a new thread is created elsewhere
  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<ChatbotThreadListItem>
      const newThread = custom.detail
      if (!newThread) return
      setItems((prev) => (prev.find((t) => t.id === newThread.id) ? prev : [newThread, ...prev]))
    }
    window.addEventListener('chatbot:threadCreated', handler as EventListener)
    return () => window.removeEventListener('chatbot:threadCreated', handler as EventListener)
  }, [])

  // Live-update when a thread's title/updated_at changes (e.g., first message becomes title)
  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<Partial<ChatbotThreadListItem> & { id: string }>
      const upd = custom.detail
      if (!upd?.id) return
      setItems((prev) => prev.map((t) => (t.id === upd.id ? { ...t, ...upd } : t)))
    }
    window.addEventListener('chatbot:threadUpdated', handler as EventListener)
    return () => window.removeEventListener('chatbot:threadUpdated', handler as EventListener)
  }, [])

  return (
    <div className='flex flex-col h-full'>
      <div className='flex-1 overflow-y-auto pr-2 space-y-1'>
        {items.map((t) => {
          const content = (
            <div className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedId === t.id ? 'bg-yellow-200' : 'hover:bg-gray-100'}`} title={t.title || 'New chat'}>
              <div className='text-sm font-medium'>{truncate(t.title, 15)}</div>
              <div className='text-[10px] text-gray-500'>{new Date(t.updated_at).toLocaleString()}</div>
            </div>
          )
          return hrefBuilder ? (
            <Link key={t.id} href={hrefBuilder(t.id)} className='block'>
              {content}
            </Link>
          ) : (
            <button key={t.id} onClick={() => onSelect(t.id)} className='w-full'>
              {content}
            </button>
          )
        })}
        {items.length === 0 && !loading && (
          <div className='text-xs text-gray-500 px-2 py-4'>No conversations yet</div>
        )}
      </div>
      <div className='pt-2'>
        {nextCursor && (
          <button
            onClick={() => load(nextCursor)}
            className='w-full text-xs px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg'
          >
            {loading ? 'Loading…' : 'Show more'}
          </button>
        )}
      </div>
    </div>
  )
}

export default ThreadList
