'use client'

import PromptBox from '@/components/PromptBox'
import ThinkingIndicator from '@/components/chat/ThinkingIndicator'
import MarkdownMessage from '@/components/chat/MarkdownMessage'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChatbotMessageDTO, ChatbotThread, createThread, getThreadMessages } from '@/lib/api/chatbot'
import { buildWsUrl } from '@/config/ws'
import { useSearchParams, useRouter } from 'next/navigation'

type Msg = ChatbotMessageDTO & { temp_id?: string }

const sortByCreatedAt = (list: Msg[]) => [...list].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

const Page = () => {
  const [thread, setThread] = useState<ChatbotThread | null>(null)
  const [messages, setMessages] = useState<Msg[]>([])
  const [guestId, setGuestId] = useState<string | null>(null)
  const [creatingThread, setCreatingThread] = useState(false)
  const [isAwaitingAssistant, setIsAwaitingAssistant] = useState(false)

  const wsRef = useRef<WebSocket | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const search = useSearchParams()
  const router = useRouter()

  const normalizeMessage = useCallback((raw: Partial<Msg>, fallbackThreadId?: string): Msg => {
    const threadId = (raw.thread as string) || (raw as any)?.thread_id || fallbackThreadId || thread?.id || ''
    return {
      id: raw.id || (raw.temp_id as string) || crypto.randomUUID(),
      thread: threadId,
      role: raw.role === 'user' ? 'user' : 'assistant',
      content: raw.content ?? '',
      status: raw.status === 'streaming' ? 'streaming' : 'completed',
      created_at: raw.created_at || new Date().toISOString(),
      temp_id: raw.temp_id,
    }
  }, [thread?.id])

  const mergeMessages = useCallback((incoming: Partial<Msg> | Partial<Msg>[], fallbackThreadId?: string) => {
    const items = Array.isArray(incoming) ? incoming : [incoming]
    if (!items.length) return
    setMessages((prev) => {
      const next = [...prev]
      items.forEach((item) => {
        const normalized = normalizeMessage(item, fallbackThreadId)
        const idx = next.findIndex(existing => existing.id === normalized.id || (!!normalized.temp_id && existing.temp_id === normalized.temp_id))
        if (idx >= 0) {
          next[idx] = { ...next[idx], ...normalized }
        } else {
          next.push(normalized)
        }
      })
      return sortByCreatedAt(next)
    })
  }, [normalizeMessage])

  useEffect(() => {
    let gid = localStorage.getItem('guest_id')
    if (!gid) {
      gid = crypto.randomUUID()
      localStorage.setItem('guest_id', gid)
    }
    setGuestId(gid)
  }, [])

  const connectWS = useCallback((t: ChatbotThread, gid: string | null) => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken')
    const qs = new URLSearchParams()
    if (token) qs.set('token', token)
    if (gid) qs.set('guest_id', gid)
    const url = buildWsUrl(`/ws/chatbot/${t.id}/?${qs.toString()}`)
    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      if (msg.type === 'message:created') {
        mergeMessages(msg.payload, t.id)
        if (msg.payload.role === 'assistant') {
          setIsAwaitingAssistant(false)
        }
      } else if (msg.type === 'assistant:started') {
        const temp_id = msg.payload.temp_id as string
        mergeMessages({ id: temp_id, thread: t.id, role: 'assistant', content: '', status: 'streaming', created_at: new Date().toISOString(), temp_id }, t.id)
        setIsAwaitingAssistant(false)
      } else if (msg.type === 'assistant:delta') {
        const { temp_id, delta } = msg.payload as { temp_id: string; delta: string }
        setMessages((prev) => prev.map(m => (m.temp_id === temp_id ? { ...m, content: (m.content || '') + delta } : m)))
      } else if (msg.type === 'assistant:completed') {
        mergeMessages(msg.payload, t.id)
        setIsAwaitingAssistant(false)
      }
    }

    ws.onopen = () => {
      // console.debug('WS connected', url)
    }
    ws.onerror = (e) => {
      // console.error('WS error', e)
    }
    ws.onclose = () => { wsRef.current = null }
  }, [mergeMessages])

  const selectThread = useCallback(async (id: string) => {
    if (!id) return
    try {
      const t: ChatbotThread = { id, title: null as any, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), guest_id: undefined }
      setThread(t)
      setMessages([])
      setIsAwaitingAssistant(false)
      const { messages } = await getThreadMessages(id, guestId || undefined)
      const normalized = messages.map((m) => normalizeMessage(m, id))
      setMessages(sortByCreatedAt(normalized))
      connectWS(t, guestId)
      router.replace(`/dashboard/chat?thread=${id}`)
    } catch (error) {
      console.error('Failed to load thread:', error)
    }
  }, [connectWS, guestId, normalizeMessage, router])

  const handleSubmit = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return

    // If no thread yet (blank state after user deleted all threads), create one first
    if (!thread && guestId && !creatingThread) {
      try {
        setCreatingThread(true)
        const t = await createThread(guestId)
        setThread(t)
        setMessages([])
        setIsAwaitingAssistant(false)
        connectWS(t, guestId)
        router.replace(`/dashboard/chat?thread=${t.id}`)
        // slight delay to allow ws to open; fallback send once open
        setIsAwaitingAssistant(true)
        setTimeout(() => {
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'message:new', payload: { content: trimmed } }))
          } else {
            setIsAwaitingAssistant(false)
          }
        }, 150)
      } catch (e) {
        console.error('Failed to auto-create thread before sending message', e)
      } finally {
        setCreatingThread(false)
      }
      return
    }

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.warn('Chat not ready yet. Initializing...')
      return
    }
    setIsAwaitingAssistant(true)
    wsRef.current.send(JSON.stringify({ type: 'message:new', payload: { content: trimmed } }))
  }, [thread, guestId, creatingThread, connectWS, router])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const newChat = useCallback(async () => {
    if (!guestId) return
    try {
      const t = await createThread(guestId)
      setThread(t)
      setMessages([])
      setIsAwaitingAssistant(false)
      connectWS(t, guestId)
      router.replace(`/dashboard/chat?thread=${t.id}`)
    } catch (error) {
      console.error('Failed to create new chat:', error)
    }
  }, [guestId, connectWS, router])

  // Load thread if provided in URL (?thread=UUID) or create new if "new" param
  useEffect(() => {
    const threadParam = search.get('thread')
    const newParam = search.get('new')
    
    if (threadParam && guestId) {
      selectThread(threadParam)
    } else if (newParam === 'true' && guestId) {
      newChat()
    }
  }, [guestId, selectThread, newChat, search])

  // Auto create a new chat thread when user lands on blank state with no params
  useEffect(() => {
    if (guestId && !thread && !search.get('thread') && !search.get('new') && !creatingThread) {
      newChat()
    }
  }, [guestId, thread, search, newChat, creatingThread])

  const hasStreamingPlaceholder = useMemo(() => messages.some(m => m.role === 'assistant' && m.status === 'streaming' && (!m.content || !m.content.trim())), [messages])
  const showTrailingThinking = isAwaitingAssistant && !hasStreamingPlaceholder

  return (
    <div className='flex h-full w-full justify-center px-4 pb-1 pt-6 text-black min-h-0'>
      <div className='flex w-full max-w-3xl flex-1 flex-col min-h-0'>
        <div className='flex-1 overflow-y-auto pr-2'>
          {messages.length === 0 ? (
            <div className='flex h-full items-center justify-center'>
              <p className='text-2xl font-medium'>How can i be of help today?</p>
            </div>
          ) : (
            <div className='flex flex-col gap-4'>
              {messages.map((m) => {
                const isEmptyAssistantStreaming = m.role === 'assistant' && m.status === 'streaming' && (!m.content || !m.content.trim())

                if (isEmptyAssistantStreaming) {
                  return (
                    <div key={m.id} className='flex w-full justify-start'>
                      <ThinkingIndicator />
                    </div>
                  )
                }

                const isAssistant = m.role === 'assistant'

                return (
                  <div key={m.id} className={`flex w-full ${isAssistant ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${isAssistant ? 'bg-gray-100 text-black' : 'bg-primary text-white'}`}>
                      {isAssistant ? (
                        <MarkdownMessage content={m.content || ''} />
                      ) : (
                        <p className='whitespace-pre-wrap leading-relaxed'>{m.content || ''}</p>
                      )}
                    </div>
                  </div>
                )
              })}
              {showTrailingThinking && (
                <div className='flex w-full justify-start'>
                  <ThinkingIndicator />
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
        <div className='mt-2 shrink-0'>
          <PromptBox onSubmit={handleSubmit} />
          <p className='mt-3 text-center text-xs text-gray-500'>Legal Ai can make mistakes, kindly check important information</p>
        </div>
      </div>
    </div>
  )
}

export default Page
