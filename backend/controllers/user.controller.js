import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, username, newPassword, confirmPassword } = req.body;

    let updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (username) updateData.username = username;

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
      }
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }

    const user = await User.findById(userId);

    if (req.file) {
      // Delete old profile pic if exists
      if (user.profilePic) {
        const oldPath = path.join(process.cwd(), user.profilePic);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updateData.profilePic = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in updateProfile: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Fetch all users except logged-in user
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
