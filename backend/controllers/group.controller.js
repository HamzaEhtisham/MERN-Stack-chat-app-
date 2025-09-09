import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";
import { io } from "../socket/socket.js";
import fs from "fs";
import path from "path";

// Create a new group chat
export const createGroupChat = async (req, res) => {
	try {
		const { name, participants } = req.body;
		const userId = req.user._id;

		if (!name || !participants || participants.length < 2) {
			return res.status(400).json({ error: "Please provide a group name and at least 2 participants" });
		}

		// Add current user to participants if not already included
		if (!participants.includes(userId.toString())) {
			participants.push(userId.toString());
		}

		// Create the group chat
		const groupChat = await Conversation.create({
			isGroupChat: true,
			groupName: name,
			groupAdmin: userId,
			participants: participants,
		});

		// Populate the participants information
		const fullGroupChat = await Conversation.findOne({ _id: groupChat._id })
			.populate("participants", "-password")
			.populate("groupAdmin", "-password");

		// Notify all participants about the new group
		io.emit("newGroupChat", fullGroupChat);

		res.status(201).json(fullGroupChat);
	} catch (error) {
		console.log("Error in createGroupChat controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Get all group chats for a user
export const getGroupChats = async (req, res) => {
	try {
		const userId = req.user._id;

		const groupChats = await Conversation.find({
			isGroupChat: true,
			participants: { $elemMatch: { $eq: userId } },
		})
			.populate("participants", "-password")
			.populate("groupAdmin", "-password")
			.sort({ updatedAt: -1 });

		res.status(200).json(groupChats);
	} catch (error) {
		console.log("Error in getGroupChats controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Add user to group
export const addToGroup = async (req, res) => {
	try {
		const { groupId, userId } = req.body;
		const currentUserId = req.user._id;

		// Check if the current user is the admin of the group
		const group = await Conversation.findOne({
			_id: groupId,
			groupAdmin: currentUserId,
		});

		if (!group) {
			return res.status(403).json({ error: "Only group admin can add members" });
		}

		// Check if user already in the group
		if (group.participants.includes(userId)) {
			return res.status(400).json({ error: "User already in the group" });
		}

		// Add user to the group
		const updated = await Conversation.findByIdAndUpdate(
			groupId,
			{ $push: { participants: userId } },
			{ new: true }
		)
			.populate("participants", "-password")
			.populate("groupAdmin", "-password");

		if (!updated) {
			return res.status(404).json({ error: "Group not found" });
		}

		// Notify all participants about the update
		io.emit("groupUpdated", updated);

		res.status(200).json(updated);
	} catch (error) {
		console.log("Error in addToGroup controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Remove user from group
export const removeFromGroup = async (req, res) => {
	try {
		const { groupId, userId } = req.body;
		const currentUserId = req.user._id;

		// Check if the current user is the admin of the group
		const group = await Conversation.findOne({
			_id: groupId,
			groupAdmin: currentUserId,
		});

		if (!group) {
			return res.status(403).json({ error: "Only group admin can remove members" });
		}

		// Remove user from the group
		const updated = await Conversation.findByIdAndUpdate(
			groupId,
			{ $pull: { participants: userId } },
			{ new: true }
		)
			.populate("participants", "-password")
			.populate("groupAdmin", "-password");

		if (!updated) {
			return res.status(404).json({ error: "Group not found" });
		}

		// Notify all participants about the update
		io.emit("groupUpdated", updated);

		res.status(200).json(updated);
	} catch (error) {
		console.log("Error in removeFromGroup controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Update group profile
export const updateGroupProfile = async (req, res) => {
	try {
		const { id: groupId } = req.params;
		const { groupName } = req.body;
		const currentUserId = req.user._id;

		// Check if the current user is the admin of the group
		const group = await Conversation.findOne({
			_id: groupId,
			groupAdmin: currentUserId,
		});

		if (!group) {
			return res.status(403).json({ error: "Only group admin can update group profile" });
		}

		// Prepare update data
		let updateData = {};
		if (groupName) updateData.groupName = groupName;

		// Handle group profile picture upload
		if (req.file) {
			// Delete old group pic if exists and not the default
			if (group.groupPic && !group.groupPic.includes('default-group.png')) {
				const oldPath = path.join(process.cwd(), group.groupPic);
				if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
			}
			updateData.groupPic = `/uploads/${req.file.filename}`;
		}

		// Update group profile
		const updated = await Conversation.findByIdAndUpdate(
			groupId,
			updateData,
			{ new: true }
		)
			.populate("participants", "-password")
			.populate("groupAdmin", "-password");

		if (!updated) {
			return res.status(404).json({ error: "Group not found" });
		}

		// Notify all participants about the update
		io.emit("groupUpdated", updated);

		res.status(200).json(updated);
	} catch (error) {
		console.log("Error in updateGroupProfile controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};