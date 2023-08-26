"use client";
import { createContext, useContext, ReactNode, useState } from 'react';
import { User } from '../UserModel';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';
import PropTypes from 'prop-types';
import { redirect } from 'next/navigation';
import { Chat } from '@/lib/types';
type UserContextType = {
    session: { user: User } | null;
    setSession: (user: { user: User } | null) => void;
    allChatData: Chat[];
    setChatDatabyId: (chat: Chat) => void;
};
const UserContext = createContext<UserContextType | null>(null);

type DataProviderProps = {
  children: ReactNode;
};

function UserProvider({ children }: DataProviderProps): React.ReactElement {
    const [session,setSession] = useLocalStorage<{ user: User } | null>('user', null);
    const [allChatData, setAllChatData] = useLocalStorage<Chat[]>('chat_data',[]);

    const setChatDatabyId = (chat: Chat) => {
      // if chat already exists, update it
      const id = allChatData.findIndex((c) => c.id === chat.id);
      if(id !== -1) {
        allChatData[id] = chat;
        setAllChatData(allChatData);
        return;
      }
      // else add it
      setAllChatData([...allChatData, chat]);
    };


  return (
    <UserContext.Provider
      value={{
        session,
        setSession,
        allChatData,
        setChatDatabyId
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const UserConsumer = UserContext.Consumer;

export { UserProvider, UserConsumer };
export default UserContext;