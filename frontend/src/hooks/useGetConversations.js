import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSocketContext } from "../context/SocketContext";
import { saveConversations, getCachedConversations } from "../utils/idb";
import useConversation from "../zustand/useConversation";

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const { socket } = useSocketContext();
	const { setConversations, setGroupChats, conversations, groupChats } = useConversation();

	const getConversations = async () => {
		setLoading(true);
		
		// 1. Instantly load from IndexedDB cache
		const cached = await getCachedConversations();
		if (cached.length > 0) {
			const users = cached.filter(c => !c.isGroupChat);
			const groups = cached.filter(c => c.isGroupChat);
			setConversations(users);
			setGroupChats(groups);
		}

		// 2. If online, fetch fresh data from server
		if (navigator.onLine) {
			try {
				// Fetch personal conversations
				const res = await fetch("/api/users", { credentials: "include" });
				
				let data = [];
				if (res.ok) {
					const contentType = res.headers.get("content-type");
					if (contentType && contentType.indexOf("application/json") !== -1) {
						data = await res.json();
						if (data.error) throw new Error(data.error);
						setConversations(Array.isArray(data) ? data : []);
					}
				} else {
					console.error(`[Frontend] Fetch users failed: ${res.status}`);
				}
				
				// Fetch group chats
				const groupRes = await fetch("/api/groups", { credentials: "include" });
				let groupData = [];
				if (groupRes.ok) {
					const groupContentType = groupRes.headers.get("content-type");
					if (groupContentType && groupContentType.indexOf("application/json") !== -1) {
						groupData = await groupRes.json();
						if (groupData.error) throw new Error(groupData.error);
						setGroupChats(Array.isArray(groupData) ? groupData : []);
					}
				} else {
					console.error(`[Frontend] Fetch groups failed: ${groupRes.status}`);
				}
				
				// 3. Save all fresh data to IndexedDB (as a flat array)
				if (Array.isArray(data) || Array.isArray(groupData)) {
					const toCache = [
						...(Array.isArray(data) ? data.map(u => ({ ...u, isGroupChat: false })) : []),
						...(Array.isArray(groupData) ? groupData.map(g => ({ ...g, isGroupChat: true })) : [])
					];
					if (toCache.length > 0) await saveConversations(toCache);
				}

			} catch (error) {
				console.error("[Frontend] Error fetching conversations:", error.message);
				if (navigator.onLine && error.message.indexOf("Unexpected end") === -1) {
					toast.error("Failed to refresh conversations");
				}
			} finally {
				setLoading(false);
			}
		} else {
			setLoading(false);
		}
	};

	useEffect(() => {
		getConversations();
	}, []);
	
	// Listen for group updates and refresh group chats
	useEffect(() => {
		if (!socket) return;
		
		socket.on("groupUpdated", async (updatedGroup) => {
			const groupWithFlag = { ...updatedGroup, isGroupChat: true };
			setGroupChats(
				useConversation.getState().groupChats.map(group => 
					group._id === updatedGroup._id ? updatedGroup : group
				)
			);
			await saveConversations([groupWithFlag]);
		});
		
		return () => {
			socket.off("groupUpdated");
		};
	}, [socket, setGroupChats]);

	return { loading, conversations, groupChats };
};
export default useGetConversations;
