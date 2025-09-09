
import { useState } from "react";
import toast from "react-hot-toast";
import useConversation from "../zustand/useConversation";

const useCreateGroup = () => {
	const [loading, setLoading] = useState(false);
	const { conversations, setConversations } = useConversation();

	const createGroup = async ({ name, participants }) => {
		setLoading(true);
		try {
			const res = await fetch("/api/groups/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, participants }),
			});

			const data = await res.json();
			if (data.error) {
				throw new Error(data.error);
			}

			setConversations([...conversations, data]);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, createGroup };
};

export default useCreateGroup;
