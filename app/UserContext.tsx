import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the type for the context value
// type UserContextType = {
//   userData: { chatId: number } | null;
//   setUserData: React.Dispatch<React.SetStateAction<{ userId: number; userName: string } | null>>;
// };
type UserContextType = {
  chatData: { chatId: number, Sender: string, receiver: string } | null;
  setChatData: React.Dispatch<React.SetStateAction<{ chatId: number, Sender: string, receiver: string } | null>>;
};


// Create context with undefined as the default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// UserProvider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  // const [userData, setUserData] = useState<{ userId: number; userName: string } | null>({ userId: 35, userName: "abdelrahman" });
  const [chatData, setChatData] = useState<{ chatId: number, Sender: string, receiver: string } | null>(null);

  return (
    <UserContext.Provider value={{ chatData, setChatData }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook to use the UserContext
export const chat = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
