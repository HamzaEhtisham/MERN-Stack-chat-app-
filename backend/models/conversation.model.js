import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
	{
		isGroupChat: {
			type: Boolean,
			default: false,
		},
		groupName: {
			type: String,
			trim: true,
		},
		groupPic: {
			type: String,
			default: "/uploads/default-group.png",
		},
		groupAdmin: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		participants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		messages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Message",
				default: [],
			},
		],
	},
	{ timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
