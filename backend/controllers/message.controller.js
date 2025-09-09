import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
	try {
		const { message } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
			isGroupChat: false,
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
				isGroupChat: false,
			});
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			conversationId: conversation._id,
			message,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		// this will run in parallel
		await Promise.all([conversation.save(), newMessage.save()]);

		// SOCKET IO FUNCTIONALITY WILL GO HERE
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			// io.to(<socket_id>).emit() used to send events to specific client
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const sendGroupMessage = async (req, res) => {
	try {
		const { message } = req.body;
		const { id: groupId } = req.params;
		const senderId = req.user._id;

		// Verify the group exists and user is a participant
		const conversation = await Conversation.findOne({
			_id: groupId,
			isGroupChat: true,
			participants: { $elemMatch: { $eq: senderId } },
		}).populate("participants", "fullName");

		if (!conversation) {
			return res.status(404).json({ error: "Group not found or you're not a member" });
		}

		// Find sender's name from participants
		const sender = conversation.participants.find(p => p._id.toString() === senderId.toString());
		const senderName = sender ? sender.fullName : "Unknown User";

		const newMessage = new Message({
			senderId,
			senderName,
			conversationId: conversation._id,
			message,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		await Promise.all([conversation.save(), newMessage.save()]);

		// Emit to all participants in the group
		conversation.participants.forEach((participantId) => {
			if (participantId.toString() !== senderId.toString()) {
				const receiverSocketId = getReceiverSocketId(participantId);
				if (receiverSocketId) {
					io.to(receiverSocketId).emit("newGroupMessage", {
						message: newMessage,
						groupId: conversation._id,
					});
				}
			}
		});

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendGroupMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
			isGroupChat: false,
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getGroupMessages = async (req, res) => {
	try {
		const { id: groupId } = req.params;
		const userId = req.user._id;

		// Verify the group exists and user is a participant
		const conversation = await Conversation.findOne({
			_id: groupId,
			isGroupChat: true,
			participants: { $elemMatch: { $eq: userId } },
		}).populate("messages");

		if (!conversation) {
			return res.status(404).json({ error: "Group not found or you're not a member" });
		}

		const messages = conversation.messages;

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getGroupMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
