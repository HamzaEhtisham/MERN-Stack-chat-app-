import express from "express";
import {
	createGroupChat,
	getGroupChats,
	addToGroup,
	removeFromGroup,
} from "../controllers/group.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

// Create a new group chat
router.post("/", protectRoute, createGroupChat);

// Get all group chats for a user
router.get("/", protectRoute, getGroupChats);

// Add a user to a group
router.put("/add", protectRoute, addToGroup);

// Remove a user from a group
router.put("/remove", protectRoute, removeFromGroup);

export default router;