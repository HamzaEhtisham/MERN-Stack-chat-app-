import { useState } from "react";
import useConversation from "../zustand/useConversation";
import { savePendingMessage, saveMessages } from "../utils/idb";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const { authUser } = useAuthContext();

  const sendMessage = async ({ message, imageFile }) => {
    setLoading(true);

    // Create a temporary message for instant UI display
    const tempId = `temp_${Date.now()}_${Math.random()}`;
    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      senderName: authUser.fullName,
      message: message || "",
      image: imageFile ? URL.createObjectURL(imageFile) : "",
      conversationId: selectedConversation._id,
      status: "pending", // pending tick icon
      readBy: [],
      createdAt: new Date().toISOString(),
    };

    // Show immediately in UI
    setMessages((prev) => [...prev, optimisticMessage]);

    if (!navigator.onLine) {
      // Queue in IndexedDB for later sync
      await savePendingMessage({
        ...optimisticMessage,
        tempId,
        isGroupChat: selectedConversation.isGroupChat || false,
        imageFile: imageFile || null,
      });
      toast("Message queued. Will send when back online.", { icon: "🕒" });
      setLoading(false);
      return;
    }

    try {
      const endpoint = selectedConversation.isGroupChat
        ? `/api/messages/group/send/${selectedConversation._id}`
        : `/api/messages/send/${selectedConversation._id}`;

      let options = { method: "POST", credentials: "include" };

      if (imageFile) {
        const formData = new FormData();
        formData.append("message", message || "");
        formData.append("image", imageFile);
        options.body = formData;
      } else {
        options.headers = { "Content-Type": "application/json" };
        options.body = JSON.stringify({ message });
      }

      const res = await fetch(endpoint, options);
      
      // Robust error handling — if server returns 500 or non-JSON, catch it
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      if (data && data.error) throw new Error(data.error);

      // Verify data is a valid message object before updating state
      if (data && data._id) {
        setMessages((prev) => prev.map((m) => (m._id === tempId ? data : m)));
        // Cache the real message
        await saveMessages(selectedConversation._id, [data]);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      // If send fails while online, keep as pending for retry
      console.error("Message send failed:", error);
      await savePendingMessage({
        ...optimisticMessage,
        tempId,
        isGroupChat: selectedConversation.isGroupChat || false,
        imageFile: imageFile || null,
      });
      toast.error(`Send failed: ${error.message}.`);
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};

export default useSendMessage;
