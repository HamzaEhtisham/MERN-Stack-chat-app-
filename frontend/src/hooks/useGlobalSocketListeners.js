import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/sounds/notification.mp3";

const useGlobalSocketListeners = () => {
	const { socket } = useSocketContext();
	const { 
        selectedConversation, 
        setTypingUser, 
        setLastMessage, 
        incrementUnread, 
        bubbleChatToTop,
        setMessages,
        setIsTyping
    } = useConversation();

	useEffect(() => {
		if (!socket) return;

		// 1. TYPING LISTENERS
		const handleTyping = ({ senderId }) => {
            setTypingUser(senderId, true);
            // Legacy fallbacks for active chat view
            if (selectedConversation && selectedConversation._id === senderId) setIsTyping(true);
        };
		
        const handleStopTyping = ({ senderId }) => {
            setTypingUser(senderId, false);
            if (selectedConversation && selectedConversation._id === senderId) setIsTyping(false);
        };

		// 2. NEW MESSAGE LISTENERS
		const handleNewMessage = (newMessage) => {
			const sound = new Audio(notificationSound);
			sound.play();

            const senderId = newMessage.senderId;
            const messageText = newMessage.message || (newMessage.image ? "🖼️ Image" : "New message");

            // Update global sidebar states
            setLastMessage(senderId, messageText);
            bubbleChatToTop(senderId, false);

			// Active chat behavior vs background behavior
			if (selectedConversation && selectedConversation._id === senderId) {
				newMessage.shouldShake = true;
				newMessage.status = "read";
				setMessages((prev) => [...prev, newMessage]);
				socket.emit("markAsRead", { messageId: newMessage._id, senderId });
			} else {
                incrementUnread(senderId);
            }
		};

		const handleNewGroupMessage = (data) => {
			const { message, groupId } = data;
			const sound = new Audio(notificationSound);
			sound.play();

            const messageText = message.message || (message.image ? "🖼️ Image" : "New message");

            setLastMessage(groupId, `${message.senderName}: ${messageText}`);
            bubbleChatToTop(groupId, true);

			if (selectedConversation && selectedConversation._id === groupId) {
				message.shouldShake = true;
				setMessages((prev) => [...prev, message]);
			} else {
                incrementUnread(groupId);
            }
		};

		// 3. READ STATUS LISTENERS
        const handleMessagesRead = ({ readerId }) => {
			if (selectedConversation && selectedConversation._id === readerId) {
				setMessages((prev) => prev.map(m => m.status === "sent" ? { ...m, status: "read" } : m));
			}
		};

		const handleMessageStatusUpdated = ({ messageId, status }) => {
			setMessages((prev) => prev.map(m => m._id === messageId ? { ...m, status } : m));
		};

		const handleGroupMessagesRead = ({ groupId, readerId }) => {
			if (selectedConversation && selectedConversation._id === groupId) {
				setMessages((prev) => prev.map(m => {
					const alreadyRead = m.readBy?.some(id => id.toString() === readerId.toString());
					if (!alreadyRead) {
						return { ...m, readBy: [...(m.readBy || []), readerId] };
					}
					return m;
				}));
			}
		};

        // Attach listeners
		socket.on("typing", handleTyping);
		socket.on("stopTyping", handleStopTyping);
		socket.on("newMessage", handleNewMessage);
		socket.on("newGroupMessage", handleNewGroupMessage);
		socket.on("messagesRead", handleMessagesRead);
		socket.on("messageStatusUpdated", handleMessageStatusUpdated);
		socket.on("groupMessagesRead", handleGroupMessagesRead);

		return () => {
            // Detach listeners
			socket.off("typing", handleTyping);
			socket.off("stopTyping", handleStopTyping);
			socket.off("newMessage", handleNewMessage);
			socket.off("newGroupMessage", handleNewGroupMessage);
			socket.off("messagesRead", handleMessagesRead);
			socket.off("messageStatusUpdated", handleMessageStatusUpdated);
			socket.off("groupMessagesRead", handleGroupMessagesRead);
		};
	}, [socket, selectedConversation, setTypingUser, setLastMessage, incrementUnread, bubbleChatToTop, setMessages, setIsTyping]);
};

export default useGlobalSocketListeners;
