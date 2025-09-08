import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  getUsersForSidebar,
  updateProfile,
} from "../controllers/user.controller.js";
import upload from "../middleware/upload.js"; // multer config file

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);
router.put(
  "/profile",
  protectRoute,
  upload.single("profilePic"),
  updateProfile
);

export default router;
