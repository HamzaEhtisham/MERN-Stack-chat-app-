import { useEffect, useState } from "react";
import { getPendingMessages, deletePendingMessage, saveMessages } from "../utils/idb";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { messages, setMessages } = useConversation();

  // Track connectivity
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("You're back online! Syncing messages...", { id: "online-toast", icon: "📶" });
      syncPendingMessages();
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.error("You're offline. Messages will be queued.", { id: "offline-toast", icon: "📵", duration: 5000 });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Sync on initial load if online
    if (navigator.onLine) {
      syncPendingMessages();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const syncPendingMessages = async () => {
    const pending = await getPendingMessages();
    if (pending.length === 0) return;

    console.log(`[Sync] Syncing ${pending.length} pending messages...`);

    for (const pendingMsg of pending) {
      try {
        const endpoint = pendingMsg.isGroupChat
          ? `/api/messages/group/send/${pendingMsg.conversationId}`
          : `/api/messages/send/${pendingMsg.conversationId}`;

        let options = { method: "POST", credentials: "include" };

        if (pendingMsg.imageFile) {
          const formData = new FormData();
          formData.append("message", pendingMsg.message || "");
          formData.append("image", pendingMsg.imageFile);
          options.body = formData;
        } else {
          options.headers = { "Content-Type": "application/json" };
          options.body = JSON.stringify({ message: pendingMsg.message });
        }

        const res = await fetch(endpoint, options);
        const data = await res.json();

        if (!data.error) {
          // Remove pending entry, save real message from server
          await deletePendingMessage(pendingMsg.tempId);
          await saveMessages(pendingMsg.conversationId, [data]);

          // Update Zustand state: replace temp message with real one
          setMessages(prev =>
            prev.map(m => m._id === pendingMsg.tempId ? { ...data } : m)
          );

          console.log(`[Sync] Message ${pendingMsg.tempId} sent successfully.`);
        }
      } catch (err) {
        console.error("[Sync] Failed to sync message:", err);
      }
    }
  };

  return { isOnline };
};

export default useOfflineSync;
