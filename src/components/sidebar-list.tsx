// import { getChats, removeChat, shareChat } from '@/app/actions'
"use client";
import { SidebarActions } from '@/components/sidebar-actions'
import { SidebarItem } from '@/components/sidebar-item'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { Chat } from '@/lib/types';

export interface SidebarListProps {
  userId?: string
}

export function SidebarList({ userId }: SidebarListProps) {
  // const chats = await getChats(userId)

  const [chats, setChats] = useLocalStorage<Chat[]>('chats', []);

  const removeChat = async (args: { id: string; path: string }) => {
    try {
      const { id, path } = args;
      const updatedChats = [...chats];
      const indexToRemove = parseInt(id, 10);
  
      if (isNaN(indexToRemove) || indexToRemove < 0 || indexToRemove >= updatedChats.length) {
        throw new Error("Invalid chat index to remove");
      }
  
      updatedChats.splice(indexToRemove, 1);
      setChats(updatedChats);
  
    } catch (error) {
      console.error("Error removing chat:", error);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      {chats?.length ? (
        <div className="space-y-2 px-2">
          {chats.map(
            (chat,index) =>
              chat && (
                <SidebarItem key={index} chat={chat}>
                  <SidebarActions
                    chat={chat}
                    removeChat={removeChat}
                    // shareChat={shareChat}
                  />
                </SidebarItem>
              )
          )}
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No chat history</p>
        </div>
      )}
    </div>
  )
}
