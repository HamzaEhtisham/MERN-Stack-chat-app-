import { create } from "zustand";

const useConversation = create((set) => ({
	selectedConversation: null,
	setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
	messages: [],
	setMessages: (messages) => 
		set((state) => ({ 
			messages: typeof messages === "function" ? messages(state.messages) : messages 
		})),
	isTyping: false,
	setIsTyping: (isTyping) => set({ isTyping }),
}));

export default useConversation;
