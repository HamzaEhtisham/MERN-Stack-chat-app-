
import { useState } from "react";
import { useSelector } from "react-redux";
import useCreateGroup from "@/hooks/useCreateGroup";

const GroupChatModal = ({ onClose }) => {
    const [groupName, setGroupName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const { loading, createGroup } = useCreateGroup();

    const { conversations } = useSelector((state) => state.conversations);
    const { authUser } = useSelector((state) => state.auth);

    const users = conversations.filter(c => c._id !== authUser._id)

    const handleUserSelection = (userId) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const handleCreateGroup = async () => {
        if (!groupName || selectedUsers.length === 0) return;
        await createGroup({ name: groupName, participants: selectedUsers });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-white text-center">Create Group Chat</h2>
                <input
                    type="text"
                    placeholder="Group Name"
                    className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-white">Select Members</h3>
                    <div className="flex flex-col max-h-48 overflow-y-auto">
                        {users.map((user) => (
                            <div
                                key={user._id}
                                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${selectedUsers.includes(user._id) ? "bg-blue-600" : "hover:bg-gray-700"
                                    }`}
                                onClick={() => handleUserSelection(user._id)}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(user._id)}
                                    onChange={() => handleUserSelection(user._id)}
                                    className="mr-4"
                                />
                                <span className="text-white">{user.fullName}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end mt-8">
                    <button
                        className="btn bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg mr-2 transition-transform transform hover:scale-105"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className={`btn bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 ${loading ? "loading" : ""
                            }`}
                        onClick={handleCreateGroup}
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupChatModal;
