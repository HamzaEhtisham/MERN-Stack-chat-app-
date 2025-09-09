import { create } from "zustand";

const useConversation = create((set) => ({
	selectedConversation: null,
	setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
	messages: [],
	setMessages: (messages) => set({ messages }),
	isGroup: false,
	setIsGroup: (isGroup) => set({ isGroup }),
	conversations: [],
	setConversations: (conversations) => set({ conversations }),
}));

export default useConversation;
