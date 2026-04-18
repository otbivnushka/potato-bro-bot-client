import { useState, useMemo } from 'react';
import { MessageSquare, Plus, Search, Sun, Moon, Menu, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { useTheme } from 'next-themes';
import { Chat } from '../types';

interface SidebarProps {
  chats: Chat[];
  activeChat: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
}

export function Sidebar({
  chats,
  activeChat,
  onNewChat,
  onSelectChat,
}: SidebarProps) {
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // 🔥 оптимизация фильтра
  const filteredChats = useMemo(() => {
    return chats.filter((chat) =>
      chat.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [chats, search]);

  const handleSelect = (id: string) => {
    onSelectChat(id);
    setMobileOpen(false);
  };

  const SidebarContent = (
    <div className="flex h-full flex-col bg-sidebar border-r border-sidebar-border">
      {/* Header */}
      <div className="border-b border-sidebar-border p-4">
        <button
          onClick={onNewChat}
          className="flex w-full items-center gap-3 rounded-lg bg-sidebar-primary px-4 py-2.5 text-sidebar-primary-foreground transition hover:opacity-90"
        >
          <Plus className="h-5 w-5" />
          <span>New chat</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg bg-sidebar-accent py-2 pl-10 pr-4 text-sidebar-foreground outline-none transition focus:ring-2 ring-sidebar-ring"
          />
        </div>
      </div>

      {/* Chat List (Radix ScrollArea) */}
      <div className="flex-1 overflow-hidden px-2">
        <ScrollArea.Root className="h-full">
          <ScrollArea.Viewport className="h-full pr-2">
            {filteredChats.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                {search ? 'No chats found' : 'No chats yet'}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => handleSelect(chat.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                      activeChat === chat.id
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                    }`}
                  >
                    <MessageSquare className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{chat.title}</span>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea.Viewport>

          {/* scrollbar */}
          <ScrollArea.Scrollbar
            orientation="vertical"
            className="flex w-2 p-0.5"
          >
            <ScrollArea.Thumb className="flex-1 rounded-full bg-border/60" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </div>

      {/* Theme Toggle */}
      <div className="border-t border-sidebar-border p-4">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition hover:bg-sidebar-accent"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="h-5 w-5" />
              <span>Light mode</span>
            </>
          ) : (
            <>
              <Moon className="h-5 w-5" />
              <span>Dark mode</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg border border-border bg-card p-2 transition hover:bg-accent md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Desktop */}
      <aside className="hidden h-full w-64 md:block">{SidebarContent}</aside>

      {/* Mobile Drawer */}
      <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 md:hidden" />

          <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-64 md:hidden">
            {/* 🔥 обязательно для accessibility */}
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
