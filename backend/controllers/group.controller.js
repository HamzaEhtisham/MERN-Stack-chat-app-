import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";

export const createGroup = async (req, res) => {
    try {
        const { groupName, participants } = req.body;
        const groupAdmin = req.user._id;

        if (!groupName || !participants || participants.length === 0) {
            return res.status(400).json({ error: "Group name and participants are required" });
        }

        const allParticipants = [...participants, groupAdmin];

        // Ensure all participants exist
        const users = await User.find({ _id: { $in: allParticipants } });
        if (users.length !== allParticipants.length) {
            return res.status(400).json({ error: "One or more participants not found" });
        }

        const newConversation = new Conversation({
            isGroup: true,
            groupName,
            groupAdmin,
            participants: allParticipants,
        });

        await newConversation.save();

        res.status(201).json(newConversation);
    } catch (error) {
        console.error("Error in createGroup: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
