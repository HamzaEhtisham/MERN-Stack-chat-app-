import express from "express";
import { 
	getMessages, 
	sendMessage, 
	getGroupMessages, 
	sendGroupMessage 
} from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

import upload from "../middleware/upload.js";

const router = express.Router();

// Individual chat routes
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, upload.single("image"), sendMessage);

// Group chat routes
router.get("/group/:id", protectRoute, getGroupMessages);
router.post("/group/send/:id", protectRoute, upload.single("image"), sendGroupMessage);

export default router;
