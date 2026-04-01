import { create } from "zustand";

const useConversation = create((set) => ({
	selectedConversation: null,
	setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
	messages: [],
	setMessages: (messages) => 
		set((state) => ({ 
			messages: typeof messages === "function" ? messages(state.messages) : messages 
		})),
	
    // Global Conversation Lists
	conversations: [],
	setConversations: (conversations) => set({ conversations }),
	groupChats: [],
	setGroupChats: (groupChats) => set({ groupChats }),

    // Global Typing Tracking (Map of userId -> boolean)
	typingUsers: {},
	setTypingUser: (userId, isTyping) => set((state) => ({
		typingUsers: { ...state.typingUsers, [userId]: isTyping }
	})),

    // Messages Status Tracking (Map of convId -> string)
	lastMessages: {},
	setLastMessage: (convId, message) => set((state) => ({
		lastMessages: { ...state.lastMessages, [convId]: message }
	})),

    // Unread Count Tracking (Map of convId -> number)
	unreadCounts: {},
	incrementUnread: (convId) => set((state) => ({
		unreadCounts: { ...state.unreadCounts, [convId]: (state.unreadCounts[convId] || 0) + 1 }
	})),
	clearUnread: (convId) => set((state) => {
		const newCounts = { ...state.unreadCounts };
		delete newCounts[convId];
		return { unreadCounts: newCounts };
	}),

    // Bubbling logic for real-time list sorting
	bubbleChatToTop: (convId, isGroup) => set((state) => {
		if (isGroup) {
			const groupCopy = [...state.groupChats];
			const index = groupCopy.findIndex(g => g._id === convId);
			if (index > 0) {
				const [group] = groupCopy.splice(index, 1);
				groupCopy.unshift(group);
				return { groupChats: groupCopy };
			}
		} else {
			const convCopy = [...state.conversations];
			const index = convCopy.findIndex(c => c._id === convId);
			if (index > 0) {
				const [conv] = convCopy.splice(index, 1);
				convCopy.unshift(conv);
				return { conversations: convCopy };
			}
		}
		return {};
	}),

    // Single chat typing (Legacy)
	isTyping: false,
	setIsTyping: (isTyping) => set({ isTyping }),
}));

export default useConversation;
