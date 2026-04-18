import { useState, useEffect } from 'react';
import { ThemeProvider, ChatWindow, Sidebar, InputPanel } from './components';
import { Chat, Message } from './types';

function ChatApp() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
      const parsed = JSON.parse(savedChats);
      setChats(parsed);
      if (parsed.length > 0) {
        setActiveChat(parsed[0].id);
      }
    }
  }, []);

  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('chats', JSON.stringify(chats));
    }
  }, [chats]);

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New conversation',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setChats([newChat, ...chats]);
    setActiveChat(newChat.id);
  };

  const handleSendMessage = async (content: string) => {
    if (!activeChat) {
      handleNewChat();
      setTimeout(() => {
        handleSendMessage(content);
      }, 100);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === activeChat) {
          const updatedMessages = [...chat.messages, userMessage];
          const title =
            chat.messages.length === 0
              ? content.slice(0, 50) + (content.length > 50 ? '...' : '')
              : chat.title;
          return {
            ...chat,
            messages: updatedMessages,
            title,
            updatedAt: Date.now(),
          };
        }
        return chat;
      })
    );

    setIsLoading(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMockResponse(content),
        timestamp: Date.now(),
      };

      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === activeChat) {
            return {
              ...chat,
              messages: [...chat.messages, assistantMessage],
              updatedAt: Date.now(),
            };
          }
          return chat;
        })
      );
      setIsLoading(false);
    }, 1500);
  };

  const generateMockResponse = (userMessage: string): string => {
    const responses = [
      `I understand you're asking about "${userMessage}". Here's a comprehensive response:\n\n## Key Points\n\n1. **First Point**: This is an important consideration.\n2. **Second Point**: Another relevant aspect to keep in mind.\n3. **Third Point**: Finally, this completes the picture.\n\n### Code Example\n\nHere's a simple example:\n\n\`\`\`javascript\nfunction example() {\n  console.log("This is a code example");\n  return true;\n}\n\`\`\`\n\nLet me know if you need more details!`,
      `Great question! Let me break this down:\n\n- **Point A**: First consideration\n- **Point B**: Second aspect\n- **Point C**: Final thought\n\nWould you like me to elaborate on any of these points?`,
      `That's an interesting topic. Here's what you should know:\n\n\`\`\`python\n# Example code\ndef hello_world():\n    print("Hello, World!")\n    return "Success"\n\`\`\`\n\nThis demonstrates the concept clearly.`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const currentChat = chats.find((chat) => chat.id === activeChat);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        chats={chats}
        activeChat={activeChat}
        onNewChat={handleNewChat}
        onSelectChat={setActiveChat}
      />
      <div className="flex-1 flex flex-col md:pl-0 pl-0">
        <ChatWindow
          messages={currentChat?.messages || []}
          isLoading={isLoading}
        />
        <InputPanel onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ChatApp />
    </ThemeProvider>
  );
}
