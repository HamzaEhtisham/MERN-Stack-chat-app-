import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { messages, setMessages, selectedConversation } = useConversation();

	useEffect(() => {
		socket?.on("newMessage", (newMessage) => {
			const sound = new Audio(notificationSound);
			sound.play();

			// If we are currently chatting with the sender
			if (selectedConversation && selectedConversation._id === newMessage.senderId) {
				newMessage.shouldShake = true;
				newMessage.status = "read";
				setMessages((prev) => [...prev, newMessage]);
				socket.emit("markAsRead", { messageId: newMessage._id, senderId: newMessage.senderId });
			}
		});

		// Listen for group messages
		socket?.on("newGroupMessage", (data) => {
			const { message, groupId } = data;
			if (selectedConversation && selectedConversation._id === groupId) {
				message.shouldShake = true;
				const sound = new Audio(notificationSound);
				sound.play();
				setMessages((prev) => [...prev, message]);
			}
		});

		socket?.on("messagesRead", ({ readerId }) => {
			if (selectedConversation && selectedConversation._id === readerId) {
				setMessages((prev) => prev.map(m => m.status === "sent" ? { ...m, status: "read" } : m));
			}
		});

		socket?.on("messageStatusUpdated", ({ messageId, status }) => {
			setMessages((prev) => prev.map(m => m._id === messageId ? { ...m, status } : m));
		});

		// Group read receipts — update readBy in messages when a member opens the group
		socket?.on("groupMessagesRead", ({ groupId, readerId }) => {
			if (selectedConversation && selectedConversation._id === groupId) {
				setMessages((prev) => prev.map(m => {
					const alreadyRead = m.readBy?.some(id => id.toString() === readerId.toString());
					if (!alreadyRead) {
						return { ...m, readBy: [...(m.readBy || []), readerId] };
					}
					return m;
				}));
			}
		});

		return () => {
			socket?.off("newMessage");
			socket?.off("newGroupMessage");
			socket?.off("messagesRead");
			socket?.off("messageStatusUpdated");
			socket?.off("groupMessagesRead");
		};
	}, [socket, setMessages, selectedConversation]);
};
export default useListenMessages;
