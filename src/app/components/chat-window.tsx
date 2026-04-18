import * as ScrollArea from '@radix-ui/react-scroll-area';
import { useEffect, useRef } from 'react';
import { ChatMessage } from './chat-message';
import { Sparkles } from 'lucide-react';
import { Message } from '../types';

interface ChatWindowProps {
  messages: Message[];
  isLoading?: boolean;
}

export function ChatWindow({ messages, isLoading }: ChatWindowProps) {
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

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500">
          <Sparkles className="h-8 w-8 text-white" />
        </div>

        <h2 className="mb-2 text-lg font-semibold">Start a conversation</h2>

        <p className="max-w-md text-sm text-muted-foreground">
          Ask me anything or start with a simple question.
        </p>

        <div className="mt-8 grid w-full max-w-2xl gap-3 md:grid-cols-2">
          {[
            'Explain quantum computing in simple terms',
            'Write a Python function to sort a list',
            'Best practices for React?',
            'Help me debug this code',
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
            <div className="flex gap-3 rounded-xl bg-muted/40 p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <Sparkles className="h-4 w-4" />
              </div>

              <div className="flex items-center gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea.Viewport>

      {/* красивый scrollbar */}
      <ScrollArea.Scrollbar
        orientation="vertical"
        className="flex w-2 touch-none select-none p-0.5"
      >
        <ScrollArea.Thumb className="flex-1 rounded-full bg-border/60" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
