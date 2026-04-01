import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import { saveMessages, getMessages as getLocalMessages } from "../utils/idb";
import toast from "react-hot-toast";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation?._id) return;
      setLoading(true);

      try {
        // Always show cached data instantly
        const cached = await getLocalMessages(selectedConversation._id);
        if (cached && Array.isArray(cached) && cached.length > 0) {
          setMessages(cached);
        } else {
          setMessages([]); // Fallback to empty instead of letting it be old data
        }

        // If online, refresh from server
        if (navigator.onLine) {
          const endpoint = selectedConversation.isGroupChat
            ? `/api/messages/group/${selectedConversation._id}`
            : `/api/messages/${selectedConversation._id}`;

          const res = await fetch(endpoint, { credentials: "include" });
          
          if (!res.ok) {
            throw new Error(`Failed to fetch messages: ${res.statusText}`);
          }

          const data = await res.json();
          if (data && data.error) throw new Error(data.error);

          const messagesArray = Array.isArray(data) ? data : [];
          setMessages(messagesArray);

          // Save fresh data to IndexedDB
          if (messagesArray.length > 0) {
            await saveMessages(selectedConversation._id, messagesArray);
          }
        }
      } catch (error) {
        if (!navigator.onLine) {
          // Offline — show cached only, no error toast
          console.log("[Offline] Showing cached messages.");
        } else {
          toast.error(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedConversation?._id, setMessages]);

  return { messages, loading };
};

export default useGetMessages;
