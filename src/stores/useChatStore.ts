import { create } from 'zustand';
import { ChatMessage } from '@/lib/api/chat';

type SocketStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error';

interface ChatState {
  messages: Record<number, ChatMessage[]>; // by consultationId
  readOnlyByConsultation: Record<number, boolean>;
  statusByConsultation: Record<number, SocketStatus>;
  nextCursorByConsultation: Record<number, string | null>;
  addMessages: (consultationId: number, msgs: ChatMessage[], to: 'prepend' | 'append') => void;
  setReadOnly: (consultationId: number, readOnly: boolean) => void;
  setStatus: (consultationId: number, status: SocketStatus) => void;
  setNextCursor: (consultationId: number, cursor: string | null) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: {},
  readOnlyByConsultation: {},
  statusByConsultation: {},
  nextCursorByConsultation: {},
  addMessages: (consultationId, msgs, to) => {
    set((state) => {
      const existing = state.messages[consultationId] || [];
      // de-dupe by id
      const map = new Map<string | number, ChatMessage>();
      const merged = (to === 'prepend' ? [...msgs, ...existing] : [...existing, ...msgs]);
      for (const m of merged) map.set(m.id, m);
      return {
        messages: { ...state.messages, [consultationId]: Array.from(map.values()) },
      };
    });
  },
  setReadOnly: (consultationId, readOnly) => set((s) => ({
    readOnlyByConsultation: { ...s.readOnlyByConsultation, [consultationId]: readOnly },
  })),
  setStatus: (consultationId, status) => set((s) => ({
    statusByConsultation: { ...s.statusByConsultation, [consultationId]: status },
  })),
  setNextCursor: (consultationId, cursor) => set((s) => ({
    nextCursorByConsultation: { ...s.nextCursorByConsultation, [consultationId]: cursor },
  })),
}));
