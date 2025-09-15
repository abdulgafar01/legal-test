import { API_CONFIG } from '@/config/api';
import { ChatMessage } from './api/chat';
import { useChatStore } from '@/stores/useChatStore';

type EventHandler = (ev: MessageEvent) => void;

export const openChatSocket = (consultationId: number) => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
  if (!token) throw new Error('Authentication token not found');

  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const base = API_CONFIG.baseUrl || '';
  // If base is empty (dev proxy), default to Django backend on localhost:8000
  const defaultBackendHost = 'localhost:8000';
  const host = base ? base.replace(/^https?:\/\//, '') : defaultBackendHost;
  const path = `/ws/chat/${consultationId}/?token=${encodeURIComponent(token)}`;
  const url = `${protocol}://${host}${path}`;

  const store = useChatStore.getState();
  store.setStatus(consultationId, 'connecting');

  let ws = new WebSocket(url);
  let retries = 0;

  const reconnect = () => {
    if (retries > 5) {
      store.setStatus(consultationId, 'error');
      return;
    }
    const timeout = Math.min(1000 * Math.pow(2, retries), 10000);
    setTimeout(() => {
      retries += 1;
      ws = new WebSocket(url);
      attach();
    }, timeout);
  };

  const onMessage: EventHandler = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'chat:state') {
        store.setReadOnly(consultationId, !!data.payload?.readOnly);
      } else if (data.type === 'message:created') {
        const msg: ChatMessage = data.payload;
        useChatStore.getState().addMessages(consultationId, [msg], 'append');
      } else if (data.type === 'error') {
        // noop for now; could expose UI notifications
      }
    } catch (e) {
      // ignore invalid JSON
    }
  };

  const attach = () => {
    ws.onopen = () => {
      store.setStatus(consultationId, 'open');
    };
    ws.onmessage = onMessage;
    ws.onclose = () => {
      store.setStatus(consultationId, 'closed');
      reconnect();
    };
    ws.onerror = () => {
      store.setStatus(consultationId, 'error');
      try { ws.close(); } catch {}
    };
  };

  attach();

  return {
    send: (content: string) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'message:new', content }));
      }
    },
    close: () => ws.close(),
  };
};
