import * as Form from '@radix-ui/react-form';
import { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface InputPanelProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function InputPanel({ onSend, disabled }: InputPanelProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // стабильный autoresize
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = '0px';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  }, [input]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed);
    setInput('');

    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = '0px';
      }
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="border-t border-border/60 bg-background/80 backdrop-blur-md p-4">
      <div className="mx-auto max-w-3xl">
        <Form.Root
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <div className="relative flex items-end gap-2">
            <Form.Field name="message" className="flex-1">
              <Form.Control asChild>
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message..."
                  disabled={disabled}
                  rows={1}
                  className="
                    w-full resize-none
                    rounded-2xl
                    border border-border/60
                    bg-muted/30
                    px-4 py-3 pr-12
                    text-sm
                    outline-none
                    transition
                    focus:border-primary/40
                    focus:ring-2 focus:ring-primary/20
                    max-h-40 overflow-y-auto
                    no-scrollbar
                    disabled:opacity-50
                  "
                />
              </Form.Control>
            </Form.Field>

            <Form.Submit asChild>
              <button
                disabled={!input.trim() || disabled}
                className="
                  absolute right-2 bottom-2
                  flex items-center justify-center
                  rounded-xl
                  bg-primary
                  p-2
                  text-primary-foreground
                  shadow-sm
                  transition
                  hover:opacity-90 hover:scale-[1.02]
                  active:scale-95
                  disabled:opacity-40 disabled:cursor-not-allowed
                "
              >
                <Send className="h-4 w-4" />
              </button>
            </Form.Submit>
          </div>
        </Form.Root>

        <p className="mt-2 text-center text-xs text-muted-foreground">
          Enter — send · Shift + Enter — new line
        </p>
      </div>
    </div>
  );
}
