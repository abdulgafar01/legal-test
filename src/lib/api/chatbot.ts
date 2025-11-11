import axios from 'axios'
import { API_CONFIG, API_ENDPOINTS, buildApiUrl } from '@/config/api'

export interface ChatbotThread {
  id: string
  title?: string | null
  created_at: string
  updated_at: string
  guest_id?: string
}

export interface ChatbotMessageDTO {
  id: string
  thread: string
  role: 'user' | 'assistant'
  content: string
  status: 'streaming' | 'completed'
  created_at: string
}

export const createThread = async (guestId?: string, title?: string) => {
  const url = buildApiUrl(API_ENDPOINTS.chatbot!.threads)
  const headers: Record<string, string> = {}
  const token = typeof window !== 'undefined' ? (localStorage.getItem('accessToken') || localStorage.getItem('authToken')) : null
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (!token && guestId) headers['X-Guest-Id'] = guestId
  const res = await axios.post<ChatbotThread>(url, { title }, { headers })
  return res.data
}

const parseCursor = (nextUrl?: string | null) => {
  if (!nextUrl) return null
  try {
    const url = new URL(nextUrl)
    return url.searchParams.get('cursor')
  } catch {
    // maybe backend returned just the cursor token
    return nextUrl.includes('cursor=') ? new URL(nextUrl).searchParams.get('cursor') : nextUrl
  }
}

export const getThreadMessages = async (threadId: string, guestId?: string, limit = 50, cursor?: string) => {
  const base = buildApiUrl(API_ENDPOINTS.chatbot!.threadMessages(threadId))
  const params = new URLSearchParams()
  params.set('limit', String(limit))
  if (cursor) params.set('cursor', cursor)
  const url = `${base}?${params.toString()}`

  const headers: Record<string, string> = {}
  const token = typeof window !== 'undefined' ? (localStorage.getItem('accessToken') || localStorage.getItem('authToken')) : null
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (!token && guestId) headers['X-Guest-Id'] = guestId

  const res = await axios.get<{ results?: ChatbotMessageDTO[]; data?: ChatbotMessageDTO[]; next?: string; next_cursor?: string }>(url, { headers })
  // normalize shapes if necessary
  const messages = res.data.results || res.data.data || []
  const nextCursor = parseCursor((res.data as any).next) || (res.data as any).next_cursor || null
  return { messages, nextCursor }
}

export interface ChatbotThreadListItem {
  id: string
  title?: string | null
  created_at: string
  updated_at: string
}

export const listThreads = async (guestId?: string, limit = 10, cursor?: string) => {
  const base = buildApiUrl(API_ENDPOINTS.chatbot!.threadsList)
  const params = new URLSearchParams()
  params.set('limit', String(limit))
  if (cursor) params.set('cursor', cursor)
  const url = `${base}?${params.toString()}`

  const headers: Record<string, string> = {}
  const token = typeof window !== 'undefined' ? (localStorage.getItem('accessToken') || localStorage.getItem('authToken')) : null
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (!token && guestId) headers['X-Guest-Id'] = guestId

  const res = await axios.get<{ results?: ChatbotThreadListItem[]; data?: ChatbotThreadListItem[]; next?: string; next_cursor?: string }>(url, { headers })
  const items = res.data.results || res.data.data || []
  const nextCursor = parseCursor((res.data as any).next) || (res.data as any).next_cursor || null
  
  console.log('listThreads API response:', {
    url,
    itemsCount: items.length,
    hasResults: !!res.data.results,
    hasData: !!res.data.data,
    rawNext: (res.data as any).next,
    rawNextCursor: (res.data as any).next_cursor,
    parsedNextCursor: nextCursor,
    fullResponse: res.data
  })
  
  return { items, nextCursor }
}

export const deleteThread = async (threadId: string, guestId?: string) => {
  const url = buildApiUrl(`${API_ENDPOINTS.chatbot!.threads}${threadId}/`)
  const headers: Record<string, string> = {}
  const token = typeof window !== 'undefined' ? (localStorage.getItem('accessToken') || localStorage.getItem('authToken')) : null
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (!token && guestId) headers['X-Guest-Id'] = guestId
  await axios.delete(url, { headers })
  return { id: threadId }
}
