import { useState, useEffect } from 'react';
import { ChatWindow, Sidebar, InputPanel } from '../components';
import { CharacterModal } from '../components/character-modal';
import { useStreamMessage } from '../../hooks/use-stream-message';
import { ChatsResponseDto } from '@/services/dto/chats-response.dto';
import { Api } from '@/services/api-client';
import { Message } from '../types';
import { useTheme } from 'next-themes';

export function ChatPage() {
  const [chats, setChats] = useState<ChatsResponseDto[]>([]);
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<number, Message[]>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [characterOpen, setCharacterOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(
    null
  );

  const { setTheme } = useTheme();
  const { message, sendMessage } = useStreamMessage();

  useEffect(() => {
    let isCancelled = false;

    Promise.all([Api.chats.getAll(), Api.settings.get()]).then(
      ([loadedChats, settings]) => {
        if (isCancelled) {
          return;
        }

        setChats(loadedChats);
        setTheme(settings.theme);
      }
    );

    return () => {
      isCancelled = true;
    };
  }, [setTheme]);

  useEffect(() => {
    if (!activeChat) {
      return;
    }

    let isCancelled = false;

    Api.messages.getById(activeChat).then((response) => {
      if (isCancelled) {
        return;
      }

      setChatMessages((prev) => ({
        ...prev,
        [activeChat]: response.map((serverMessage) => ({
          id: String(serverMessage.message_id),
          role: serverMessage.role === 'bot' ? 'assistant' : 'user',
          content: serverMessage.content,
        })),
      }));
    });

    return () => {
      isCancelled = true;
    };
  }, [activeChat]);

  useEffect(() => {
    if (!activeChat || message.status === 'idle') {
      return;
    }

    setChatMessages((prev) => {
      const messages = prev[activeChat] ?? [];
      if (!messages.length) {
        return prev;
      }

      const nextMessages = [...messages];
      const lastIndex = nextMessages.length - 1;
      const lastMessage = nextMessages[lastIndex];

      if (lastMessage.role !== 'assistant') {
        return prev;
      }

      nextMessages[lastIndex] = {
        ...lastMessage,
        content: message.content,
      };

      return {
        ...prev,
        [activeChat]: nextMessages,
      };
    });

    setIsLoading(message.status === 'streaming');
  }, [activeChat, message]);

  const handleNewChat = async () => {
    await Api.chats.create().then((response) => {
      setChats((prev) => [response, ...prev]);
      setActiveChat(response.chat_id);
    });
  };

  const handleDeleteChat = async (chatId: number) => {
    await Api.chats.remove(chatId).then(() => {
      setChats((prev) => prev.filter((chat) => chat.chat_id !== chatId));
      setChatMessages((prev) => {
        const { [chatId]: _removed, ...rest } = prev;
        return rest;
      });

      setActiveChat(null);
    });
  };

  const handleChangeCharacter = () => {
    setCharacterOpen(true);
  };

  const handleConfirmCharacter = () => {
    console.log('selected:', selectedCharacter);
    Api.settings.updateCharacter(selectedCharacter);
    setCharacterOpen(false);
  };

  const handleSendMessage = async (content: string) => {
    if (!activeChat || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
    };

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
    };

    setChatMessages((prev) => ({
      ...prev,
      [activeChat]: [
        ...(prev[activeChat] ?? []),
        userMessage,
        assistantMessage,
      ],
    }));

    setIsLoading(true);

    try {
      await sendMessage(activeChat, content);
    } catch {
      setChatMessages((prev) => ({
        ...prev,
        [activeChat]: (prev[activeChat] ?? []).slice(0, -1),
      }));
      setIsLoading(false);
    }
  };

  const currentMessages = activeChat ? (chatMessages[activeChat] ?? []) : [];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        chats={chats}
        activeChat={activeChat}
        onNewChat={handleNewChat}
        onChangeCharacter={handleChangeCharacter}
        onSelectChat={setActiveChat}
        onDeleteChat={handleDeleteChat}
      />
      <div className="flex-1 flex flex-col md:pl-0 pl-0">
        <ChatWindow
          activeChat={activeChat}
          messages={currentMessages}
          isLoading={isLoading}
        />
        {activeChat && (
          <InputPanel onSend={handleSendMessage} disabled={isLoading} />
        )}
      </div>
      <CharacterModal
        open={characterOpen}
        onOpenChange={setCharacterOpen}
        selected={selectedCharacter}
        onSelect={setSelectedCharacter}
        onConfirm={handleConfirmCharacter}
      />
    </div>
  );
}
