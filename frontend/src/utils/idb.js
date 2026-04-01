import { openDB } from "idb";

const DB_NAME = "ChatAppDB";
const DB_VERSION = 1;
const MAX_MESSAGES_PER_CHAT = 100; // Keep last 100 messages per conversation

let dbPromise = null;

const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Messages store
        if (!db.objectStoreNames.contains("messages")) {
          const msgStore = db.createObjectStore("messages", { keyPath: "_id" });
          msgStore.createIndex("conversationId", "conversationId", { unique: false });
          msgStore.createIndex("createdAt", "createdAt", { unique: false });
        }
        // Conversations/Users list store
        if (!db.objectStoreNames.contains("conversations")) {
          db.createObjectStore("conversations", { keyPath: "_id" });
        }
        // Pending (offline) messages queue
        if (!db.objectStoreNames.contains("pending")) {
          db.createObjectStore("pending", {
            keyPath: "tempId",
            autoIncrement: false,
          });
        }
      },
    });
  }
  return dbPromise;
};

// ─── Messages ────────────────────────────────────────────────────────────────

export const saveMessages = async (conversationId, messages) => {
  try {
    const db = await getDB();
    const tx = db.transaction("messages", "readwrite");
    for (const msg of messages) {
      await tx.store.put({ ...msg, conversationId });
    }
    await tx.done;

    // Cleanup: keep only last MAX_MESSAGES_PER_CHAT per conversation
    await cleanupOldMessages(conversationId);
  } catch (err) {
    console.error("[IDB] saveMessages error:", err);
  }
};

export const getMessages = async (conversationId) => {
  try {
    const db = await getDB();
    const all = await db.getAllFromIndex("messages", "conversationId", conversationId);
    return all.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } catch (err) {
    console.error("[IDB] getMessages error:", err);
    return [];
  }
};

export const updateMessageStatus = async (tempId, realMessage) => {
  try {
    const db = await getDB();
    // Remove by tempId if it's a pending message
    await db.delete("messages", tempId);
    // Add the real message from server
    await db.put("messages", realMessage);
  } catch (err) {
    console.error("[IDB] updateMessageStatus error:", err);
  }
};

const cleanupOldMessages = async (conversationId) => {
  try {
    const db = await getDB();
    const all = await db.getAllFromIndex("messages", "conversationId", conversationId);
    if (all.length > MAX_MESSAGES_PER_CHAT) {
      // Sort oldest first, delete extras
      all.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      const toDelete = all.slice(0, all.length - MAX_MESSAGES_PER_CHAT);
      const tx = db.transaction("messages", "readwrite");
      for (const msg of toDelete) {
        await tx.store.delete(msg._id);
      }
      await tx.done;
    }
  } catch (err) {
    console.error("[IDB] cleanup error:", err);
  }
};

// ─── Conversations list ───────────────────────────────────────────────────────

export const saveConversations = async (conversations) => {
  try {
    const db = await getDB();
    const tx = db.transaction("conversations", "readwrite");
    for (const conv of conversations) {
      await tx.store.put(conv);
    }
    await tx.done;
  } catch (err) {
    console.error("[IDB] saveConversations error:", err);
  }
};

export const getCachedConversations = async () => {
  try {
    const db = await getDB();
    return await db.getAll("conversations");
  } catch (err) {
    console.error("[IDB] getCachedConversations error:", err);
    return [];
  }
};

// ─── Pending (offline) messages ──────────────────────────────────────────────

export const savePendingMessage = async (pendingMsg) => {
  try {
    const db = await getDB();
    await db.put("pending", pendingMsg);
    // Also add to messages store so UI shows it immediately
    await db.put("messages", { ...pendingMsg, _id: pendingMsg.tempId });
  } catch (err) {
    console.error("[IDB] savePendingMessage error:", err);
  }
};

export const getPendingMessages = async () => {
  try {
    const db = await getDB();
    return await db.getAll("pending");
  } catch (err) {
    console.error("[IDB] getPendingMessages error:", err);
    return [];
  }
};

export const deletePendingMessage = async (tempId) => {
  try {
    const db = await getDB();
    await db.delete("pending", tempId);
    await db.delete("messages", tempId);
  } catch (err) {
    console.error("[IDB] deletePendingMessage error:", err);
  }
};

// ─── Full wipe on logout ──────────────────────────────────────────────────────

export const clearAllData = async () => {
  try {
    const db = await getDB();
    await Promise.all([
      db.clear("messages"),
      db.clear("conversations"),
      db.clear("pending"),
    ]);
    console.log("[IDB] All offline data cleared.");
  } catch (err) {
    console.error("[IDB] clearAllData error:", err);
  }
};
