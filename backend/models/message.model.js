import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		senderName: {
			type: String,
			// For group chats to display sender name
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		conversationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Conversation",
		},
		message: {
			type: String,
			required: true,
		},
		// createdAt, updatedAt
	},
	{ timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
