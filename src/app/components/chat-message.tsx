import { useState } from 'react';
import { Copy, Check, User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  oneDark,
  oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = message.role === 'user';

  return (
    <div
      className={`group flex gap-4 px-4 py-6 rounded-2xl ${
        isUser ? 'bg-background' : 'bg-muted/30'
      }`}
    >
      <div className={`flex-shrink-0 pt-3`}>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-accent text-accent-foreground'
          }`}
        >
          {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <ReactMarkdown
            components={{
              code({ inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <div className="relative group/code">
                    <SyntaxHighlighter
                      style={theme === 'dark' ? oneDark : oneLight}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{
                        margin: 0,
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                      }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(String(children));
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded bg-background/80 hover:bg-background border border-border opacity-0 group-hover/code:opacity-100 transition-opacity"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>

      <button
        onClick={handleCopy}
        className="flex-shrink-0 p-2 rounded-lg hover:bg-accent opacity-0 group-hover:opacity-100 transition-opacity h-fit"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
