import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the type for the context value
type ChatsType = {
	user: {
		loggedIn: boolean;
		userId?: number;
		token?: string;
		userName?: string;
	} | null;
	setUser: React.Dispatch<
		React.SetStateAction<{
			loggedIn: boolean;
			userId?: number;
			token?: string;
			userName?: string;
		} | null>
	>;
	chatData: { chatId: number; Sender: string; receiver: string } | null;
	setChatData: React.Dispatch<
		React.SetStateAction<{
			chatId: number;
			Sender: string;
			receiver: string;
		} | null>
	>;
	justLoggedIn: boolean | null;
	setJustLoggedIn: React.Dispatch<React.SetStateAction<boolean | null>>;
	allChats: Record<string, any[]> | null; // Consistent typing for allChats
	setAllChats: React.Dispatch<
		React.SetStateAction<Record<string, any[]> | null>
	>;
};

// Create context with undefined as the default value
const ChatContext = createContext<ChatsType | undefined>(undefined);

// ChatProvider component
export const ChatProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<{
		loggedIn: boolean;
		userId?: number;
		token?: string;
		userName?: string;
	} | null>(null);
	const [chatData, setChatData] = useState<{
		chatId: number;
		Sender: string;
		receiver: string;
	} | null>(null);
	const [justLoggedIn, setJustLoggedIn] = useState<boolean | null>(null);
	const [allChats, setAllChats] = useState<Record<string, any[]> | null>(null);
	return (
		<ChatContext.Provider
			value={{
				user,
				setUser,
				chatData,
				setChatData,
				justLoggedIn,
				setJustLoggedIn,
				allChats,
				setAllChats,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
};

// Hook to use the ChatContext
export const useChatContext = () => {
	const context = useContext(ChatContext);
	if (!context) {
		throw new Error("useChatContext must be used within a ChatProvider");
	}
	return context;
};
