import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSocketContext } from "../context/SocketContext";

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const [conversations, setConversations] = useState([]);
	const [groupChats, setGroupChats] = useState([]);
	const { socket } = useSocketContext();

	const getConversations = async () => {
		setLoading(true);
		try {
			// Fetch personal conversations
			try {
				const res = await fetch("/api/users");
				if (!res.ok) {
					throw new Error(`HTTP error! Status: ${res.status}`);
				}
				const text = await res.text();
				const data = text ? JSON.parse(text) : [];
				if (data.error) {
					throw new Error(data.error);
				}
				setConversations(data);
			} catch (userError) {
				console.error("Error fetching users:", userError);
				toast.error("Failed to load conversations");
				setConversations([]);
			}

			// Fetch group chats
			try {
				const groupRes = await fetch("/api/groups");
				if (!groupRes.ok) {
					throw new Error(`HTTP error! Status: ${groupRes.status}`);
				}
				const groupText = await groupRes.text();
				const groupData = groupText ? JSON.parse(groupText) : [];
				if (groupData.error) {
					throw new Error(groupData.error);
				}
				console.log("Group chats fetched:", groupData);
				setGroupChats(groupData);
			} catch (groupError) {
				console.error("Error fetching group chats:", groupError);
				toast.error("Failed to load group chats");
				setGroupChats([]);
			}
		} catch (error) {
			console.error("Error in conversation fetching:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getConversations();
	}, []);
	
	// Listen for group updates and refresh group chats
	useEffect(() => {
		if (!socket) return;
		
		socket.on("groupUpdated", (updatedGroup) => {
			console.log("Group updated in useGetConversations:", updatedGroup);
			
			// Update the group in the groupChats list
			setGroupChats(prevGroups => {
				const updatedGroups = prevGroups.map(group => 
					group._id === updatedGroup._id ? updatedGroup : group
				);
				return updatedGroups;
			});
		});
		
		return () => {
			socket.off("groupUpdated");
		};
	}, [socket]);

	return { loading, conversations, groupChats };
};
export default useGetConversations;
