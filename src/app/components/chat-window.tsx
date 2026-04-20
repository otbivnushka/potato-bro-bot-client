import * as ScrollArea from '@radix-ui/react-scroll-area';
import { useEffect, useRef } from 'react';
import { ChatMessage } from './chat-message';
import { Message } from '../types';
import { Logo } from './logo';

interface ChatWindowProps {
  messages: Message[];
  isLoading?: boolean;
  activeChat: number | null;
}

export function ChatWindow({
  messages,
  isLoading,
  activeChat,
}: ChatWindowProps) {
  const viewportRef = useRef<HTMLDivElement>(null);

  // нормальный автоскролл
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  if (activeChat === null) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <Logo />

        <h2 className="mb-2 text-lg font-semibold">
          Создай новый чат или выбери существующий
        </h2>
      </div>
    );
  }
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <Logo />

        <h2 className="mb-2 text-lg font-semibold">Спроси что-нибудь</h2>

        <p className="max-w-md text-sm text-muted-foreground">
          Спроси меня что-нибудь, и я попробую ответить на твои вопросы
        </p>

        <div className="mt-8 grid w-full max-w-2xl gap-3 md:grid-cols-2">
          {[
            'Привет, как дела?',
            'Что произошло на площади Тяньаньмэнь?',
            'Сравни Си Цзиньпина с Винни-Пухом',
            'Тайвань независимое государство?',
          ].map((prompt, i) => (
            <button
              key={i}
              className="
                rounded-xl border border-border
                p-4 text-left text-sm
                transition
                hover:border-primary/50
                hover:bg-accent
              "
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <ScrollArea.Root className="flex-1 overflow-hidden pl-16">
      <ScrollArea.Viewport
        ref={viewportRef}
        className="h-full w-full px-4 py-6"
      >
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="w-full flex justify-center">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar
        orientation="vertical"
        className="flex w-2 touch-none select-none p-0.5"
      >
        <ScrollArea.Thumb className="flex-1 rounded-full bg-border/60" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
