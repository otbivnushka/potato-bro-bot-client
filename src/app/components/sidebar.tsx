import { useState, useMemo } from 'react';
import {
  MessageSquare,
  Plus,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  Laugh,
  Trash,
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { useTheme } from 'next-themes';
import { ChatsResponseDto } from '@/services/dto/chats-response.dto';
import { Api } from '@/services/api-client';

interface SidebarProps {
  chats: ChatsResponseDto[];
  activeChat: number | null;
  onNewChat: () => void;
  onChangeCharacter: () => void;
  onSelectChat: (id: number) => void;
  onDeleteChat: (id: number) => void;
}

export function Sidebar({
  chats,
  activeChat,
  onNewChat,
  onChangeCharacter,
  onSelectChat,
  onDeleteChat,
}: SidebarProps) {
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isThemeUpdating, setIsThemeUpdating] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  const filteredChats = useMemo(() => {
    return chats.filter((chat) =>
      chat.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [chats, search]);

  const handleSelect = (id: number) => {
    onSelectChat(id);
    setMobileOpen(false);
  };

  const currentTheme = theme === 'system' ? resolvedTheme : theme;

  const handleToggleTheme = async () => {
    if (isThemeUpdating) {
      return;
    }

    const previousTheme = currentTheme === 'dark' ? 'dark' : 'light';
    const nextTheme = previousTheme === 'dark' ? 'light' : 'dark';

    setTheme(nextTheme);
    setIsThemeUpdating(true);

    try {
      await Api.settings.updateTheme({ theme: nextTheme });
    } catch {
      setTheme(previousTheme);
    } finally {
      setIsThemeUpdating(false);
    }
  };

  const SidebarContent = (
    <div className="flex h-full flex-col bg-sidebar border-r border-sidebar-border">
      <div className=" flex flex-col border-b border-sidebar-border p-4 gap-3">
        <button
          onClick={onNewChat}
          className="flex w-full items-center gap-3 rounded-lg bg-sidebar-primary px-4 py-2.5 text-sidebar-primary-foreground transition hover:opacity-90"
        >
          <Plus className="h-5 w-5" />
          <span>Новый чат</span>
        </button>

        <button
          onClick={onChangeCharacter}
          className="flex w-full items-center gap-3 rounded-lg bg-sidebar-primary px-4 py-2.5 text-sidebar-primary-foreground transition hover:opacity-90"
        >
          <Laugh className="h-5 w-5" />
          <span>Персонаж</span>
        </button>
      </div>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg bg-sidebar-accent py-2 pl-10 pr-4 text-sidebar-foreground outline-none transition focus:ring-2 ring-sidebar-ring"
          />
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-2">
        <ScrollArea.Root className="h-full">
          <ScrollArea.Viewport className="h-full pr-2">
            {filteredChats.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                {search ? 'Чаты не найдены' : 'Пока нет чатов'}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredChats.map((chat) => (
                  <button
                    key={chat.chat_id}
                    onClick={() => handleSelect(chat.chat_id)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition ${
                      activeChat === chat.chat_id
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{chat.title}</span>
                    </div>
                    {activeChat === chat.chat_id && (
                      <Trash
                        className="text-red-500 h-4"
                        onClick={() => onDeleteChat(chat.chat_id)}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </ScrollArea.Viewport>

          <ScrollArea.Scrollbar
            orientation="vertical"
            className="flex w-2 p-0.5"
          >
            <ScrollArea.Thumb className="flex-1 rounded-full bg-border/60" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </div>

      <div className="border-t border-sidebar-border p-4">
        <button
          onClick={handleToggleTheme}
          disabled={isThemeUpdating}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition hover:bg-sidebar-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          {currentTheme === 'dark' ? (
            <>
              <Sun className="h-5 w-5" />
              <span>Темная</span>
            </>
          ) : (
            <>
              <Moon className="h-5 w-5" />
              <span>Светлая</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg border border-border bg-card p-2 transition hover:bg-accent md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <aside className="hidden h-full w-64 md:block">{SidebarContent}</aside>

      <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 md:hidden" />

          <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-64 md:hidden">
            <Dialog.Title className="sr-only">Sidebar</Dialog.Title>

            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-2 transition hover:bg-sidebar-accent"
            >
              <X className="h-5 w-5 text-sidebar-foreground" />
            </button>

            {SidebarContent}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
