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
        if (cached.length > 0) {
          setMessages(cached);
        }

        // If online, refresh from server
        if (navigator.onLine) {
          const endpoint = selectedConversation.isGroupChat
            ? `/api/messages/group/${selectedConversation._id}`
            : `/api/messages/${selectedConversation._id}`;

          const res = await fetch(endpoint, { credentials: "include" });
          const data = await res.json();
          if (data.error) throw new Error(data.error);

          setMessages(data);
          // Save fresh data to IndexedDB
          await saveMessages(selectedConversation._id, data);
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
