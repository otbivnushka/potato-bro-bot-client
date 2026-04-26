import { useState, useRef } from 'react';

type StreamStatus = 'idle' | 'streaming' | 'done' | 'error';

interface StreamMessage {
  messageId: number | null;
  content: string;
  status: StreamStatus;
}

export function useStreamMessage() {
  const [message, setMessage] = useState<StreamMessage>({
    messageId: null,
    content: '',
    status: 'idle',
  });

  const controllerRef = useRef<AbortController | null>(null);

  const sendMessage = async (chatId: number, content: string) => {
    // отменяем предыдущий стрим если есть
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    setMessage({
      messageId: null,
      content: '',
      status: 'streaming',
    });

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/messages/stream`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatId, content }),
          signal: controller.signal,
        }
      );

      if (!res.body) throw new Error('No stream');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const parts = buffer.split('\n\n');
        buffer = parts.pop() || '';

        for (const part of parts) {
          handleChunk(part);
        }
      }

      setMessage((prev) => ({
        ...prev,
        status: 'done',
      }));
    } catch (err: any) {
      if (err.name === 'AbortError') return;

      setMessage((prev) => ({
        ...prev,
        status: 'error',
      }));
    }
  };

  const handleChunk = (chunk: string) => {
    const lines = chunk.split('\n');

    let event = '';
    let data = '';

    for (const line of lines) {
      if (line.startsWith('event:')) {
        event = line.replace('event:', '').trim();
      }
      if (line.startsWith('data:')) {
        data = line.replace('data:', '').trim();
      }
    }

    if (!data) return;

    const parsed = JSON.parse(data);

    switch (event) {
      case 'start':
        setMessage({
          messageId: parsed.id,
          content: '',
          status: 'streaming',
        });
        break;

      case 'chunk':
        setMessage((prev) => ({
          ...prev,
          messageId: parsed.messageId ?? prev.messageId,
          content: prev.content + parsed.text,
        }));
        break;

      case 'done':
        setMessage((prev) => ({
          ...prev,
          status: 'done',
        }));
        break;

      case 'error':
        setMessage((prev) => ({
          ...prev,
          status: 'error',
        }));
        break;
    }
  };

  const cancel = () => {
    controllerRef.current?.abort();
    setMessage((prev) => ({
      ...prev,
      status: 'idle',
    }));
  };

  return {
    message,
    sendMessage,
    cancel,
  };
}
