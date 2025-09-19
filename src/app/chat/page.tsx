'use client'

import PromptBox from '@/components/PromptBox'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChatbotMessageDTO, ChatbotThread, createThread, getThreadMessages } from '@/lib/api/chatbot'

type Msg = ChatbotMessageDTO & { temp_id?: string }

const Page = () => {
  const [thread, setThread] = useState<ChatbotThread | null>(null)
  const [messages, setMessages] = useState<Msg[]>([])
  const [guestId, setGuestId] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')

  const wsRef = useRef<WebSocket | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  // guest id management
  useEffect(() => {
    let gid = localStorage.getItem('guest_id')
    if (!gid) {
      gid = crypto.randomUUID()
      localStorage.setItem('guest_id', gid)
    }
    setGuestId(gid)
  }, [])

  const connectWS = useCallback((t: ChatbotThread, gid: string | null) => {
    if (!t) return
    const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken')
    const qs = new URLSearchParams()
    if (token) qs.set('token', token)
    if (gid) qs.set('guest_id', gid)
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const host = window.location.host
    const url = `${protocol}://${host}/ws/chatbot/${t.id}/?${qs.toString()}`
    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      if (msg.type === 'message:created') {
        setMessages((prev) => [...prev, msg.payload])
      } else if (msg.type === 'assistant:started') {
        const temp_id = msg.payload.temp_id as string
        setMessages((prev) => [...prev, { id: temp_id, thread: t.id, role: 'assistant', content: '', status: 'streaming', created_at: new Date().toISOString(), temp_id }])
      } else if (msg.type === 'assistant:delta') {
        const { temp_id, delta } = msg.payload as { temp_id: string; delta: string }
        setMessages((prev) => prev.map(m => (m.temp_id === temp_id ? { ...m, content: (m.content || '') + delta } : m)))
      } else if (msg.type === 'assistant:completed') {
        const { temp_id, ...rest } = msg.payload
        setMessages((prev) => prev.map(m => (m.temp_id === temp_id ? { ...m, ...rest, temp_id: undefined } as Msg : m)))
      }
    }

    ws.onclose = () => {
      wsRef.current = null
    }
  }, [])

  // autoscroll on messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // start a new thread on first message; for now, create on mount
  useEffect(() => {
    const bootstrap = async () => {
      if (!guestId) return
      const t = await createThread(guestId)
      setThread(t)
      const { messages } = await getThreadMessages(t.id, guestId)
      setMessages(messages)
      connectWS(t, guestId)
    }
    bootstrap()
  }, [guestId, connectWS])

  const sendPrompt = useCallback((text: string) => {
    if (!text.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return
    wsRef.current.send(JSON.stringify({ type: 'message:new', payload: { content: text.trim() } }))
  }, [])

  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const val = prompt.trim()
    if (!val) return
    sendPrompt(val)
    setPrompt('')
  }, [prompt, sendPrompt])

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <header className="sticky top-0 z-20 w-full bg-orange-50 border-b border-gray-200 px-6 py-3">
        <Link href='signup'>
          <div className="flex justify-end">
            <Button className='rounded-2xl'>sign up</Button>
          </div>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 pb-8 relative overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex items-center gap-3 mt-16">
            <p className="text-2xl font-medium">How can I be of help today?</p>
          </div>
        ) : (
          <div className="w-full max-w-2xl flex-1 overflow-auto mt-6 space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={`w-full flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-2xl px-4 py-2 max-w-[80%] ${m.role === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-black'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}

        <form onSubmit={onSubmit} className={`w-full max-w-2xl bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-2px_rgba(0,0,0,0.1)] drop-shadow-xl p-4 rounded-3xl mt-4 transition-all`}>
          <textarea
            className='outline-none w-full resize-none overflow-hidden break-words bg-transparent'
            rows={2}
            placeholder='Ask me...'
            required
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
          />
          <div className='flex items-center justify-between text-sm'>
            <div className=''></div>
            <div className='flex items-center gap-2'>
              <button className={`${prompt ? 'bg-primary shadow-md cursor-pointer' : 'bg-[#71717a] shadow-sm disabled'} rounded-full px-4 py-2 text-white`}>
                Send
              </button>
            </div>
          </div>
        </form>

        <p className="text-xs mt-2 text-gray-500">Legal AI can make mistakes, kindly check important information.</p>
      </main>
    </div>
  )
}

export default Page
