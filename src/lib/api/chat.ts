import axios from 'axios';
import { API_CONFIG, buildApiUrl } from '@/config/api';

export interface ChatMessage {
  id: number | string;
  consultation_id: number;
  conversation_id: number;
  sender: { id: number; full_name?: string; role?: string };
  content: string;
  message_type: 'text';
  created_at: string;
}

export interface MessagesListResponse {
  data: ChatMessage[];
  next_cursor: string | null;
}

export const getChatMessages = async (
  consultationId: number,
  limit = 50,
  cursor?: string
): Promise<MessagesListResponse> => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
  if (!token) throw new Error('Authentication token not found');

  const params = new URLSearchParams();
  params.set('limit', String(limit));
  if (cursor) params.set('cursor', cursor);

  const url = buildApiUrl(`/api/v1/consultations/${consultationId}/chat/messages/`);
  const fullUrl = `${url}?${params.toString()}`;

  const response = await axios.get(fullUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
