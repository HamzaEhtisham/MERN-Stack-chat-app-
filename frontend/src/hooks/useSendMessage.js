import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	const sendMessage = async ({ message, imageFile }) => {
		setLoading(true);
		try {
			let endpoint = selectedConversation.isGroupChat 
				? `/api/messages/group/send/${selectedConversation._id}` 
				: `/api/messages/send/${selectedConversation._id}`;

			let options = {
				method: "POST",
				credentials: "include",
			};

			if (imageFile) {
				const formData = new FormData();
				formData.append("message", message);
				formData.append("image", imageFile);
				options.body = formData;
			} else {
				options.headers = { "Content-Type": "application/json" };
				options.body = JSON.stringify({ message });
			}

			const res = await fetch(endpoint, options);
			const data = await res.json();
			if (data.error) throw new Error(data.error);

			setMessages([...messages, data]);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};
export default useSendMessage;
