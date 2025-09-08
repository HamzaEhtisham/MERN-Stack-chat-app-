// controllers/user.controller.js
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

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

    if (req.file) {
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

// ✅ New function to fetch users for sidebar
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Get all users except the logged-in one
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
