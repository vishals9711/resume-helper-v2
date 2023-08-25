"use client";
import { createContext, useContext, ReactNode, useState } from 'react';
import { User } from '../UserModel';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';
import PropTypes from 'prop-types';
import { redirect } from 'next/navigation';
type UserContextType = {
    session: { user: User } | null;
    setSession: (user: { user: User } | null) => void;
};

// const UserContext = createContext<UserContextType | undefined>(undefined);

// export function useUser() {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error('useUser must be used within a UserProvider');
//   }
//   return context;
// }

// type UserProviderProps = {
//   children: ReactNode;
// };

// export function UserProvider({ children }: UserProviderProps) {
//     const [session,setSession] = useLocalStorage<{ user: User } | null>('user', null);


//   const userContextValue = {
//     session,
//     setSession,
//   };

//   if(session === null || !session){
//     redirect('/sign-in')
//   }

//   return (
//     <UserContext.Provider value={userContextValue}>
//       {children}
//     </UserContext.Provider>
//   );
// }

const UserContext = createContext<UserContextType | null>(null);

type DataProviderProps = {
  children: ReactNode;
};

function UserProvider({ children }: DataProviderProps): React.ReactElement {
    const [session,setSession] = useLocalStorage<{ user: User } | null>('user', null);

//   if(session === null || !session){
//     redirect('/sign-in')
//     console.log('redirect')
//   }

//   function handleAuth(value: User) {
//     setConversations([]);
//     setUserData(value);
//   }
//   function handlelogout() {
//     setUserData(null);
//     setConversations(null);
//     localStorage.removeItem('auth');
//   }

//   function appendMessage(message: string, user: boolean) {
//     setCurrentConversation((prev) => {
//       if (prev) {
//         return {
//           ...prev,
//           messages: [
//             ...prev.messages,
//             {
//               msg: message,
//               user: user,
//               timestamp: new Date().toISOString(),
//             },
//           ],
//         };
//       } else return prev;
//     });
//   }

//   function postToServer() {
//     setCurrentConversation((prev) => {
//       if (prev) {
//         if (prev.conversation_id) {
//           axios.put(`/api/v1/conversation/${prev.conversation_id}`, {
//             messages: prev.messages,
//           });
//         } else {
//           axios
//             .post(`/api/v1/conversation`, {
//               user_id: userData?.user_id,
//               messages: prev.messages,
//               title: prev.title,
//             })
//             .then((res) => {
//               setRedirect(res.data.conversation_id);
//               setConversations((prevCon) => {
//                 if (prevCon) {
//                   return [...prevCon, { ...res.data, title: res.data.title }];
//                 } else return prevCon;
//               });
//             });
//         }
//       }
//       return prev;
//     });
//   }

  return (
    <UserContext.Provider
      value={{
        session,
        setSession,
        
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