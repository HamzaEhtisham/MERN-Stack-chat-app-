import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSocketContext } from "../../context/SocketContext";
import { useAuthContext } from "../../context/AuthContext";
import { FaUserPlus, FaUserMinus } from "react-icons/fa";

const GroupMembersModal = ({ isOpen, onClose, group }) => {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { socket } = useSocketContext();
  const { authUser } = useAuthContext();
  
  const isAdmin = group?.groupAdmin?._id === authUser?._id;

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch("/api/users", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setAvailableUsers(data);
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (isOpen) {
      getUsers();
    }
  }, [isOpen]);

  const handleAddMember = async (userId) => {
    try {
      setLoading(true);
      const res = await fetch("/api/groups/add", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupId: group._id,
          userId,
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      toast.success("Member added successfully!");
      
      // Notify socket about group update
      socket.emit("groupUpdated", data);
      
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      setLoading(true);
      const res = await fetch("/api/groups/remove", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupId: group._id,
          userId,
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      toast.success("Member removed successfully!");
      
      // Notify socket about group update
      socket.emit("groupUpdated", data);
      
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-200">
          Group Members
        </h2>
        
        {/* Current Members */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-300">Current Members</h3>
          <div className="max-h-40 overflow-y-auto bg-gray-700 rounded p-2">
            {group?.participants?.map((user) => (
              <div key={user._id} className="flex items-center justify-between mb-2 p-2 hover:bg-gray-600 rounded">
                <div className="flex items-center">
                  <img
                    src={user.profilePic}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full object-cover mr-2"
                  />
                  <span className="text-gray-200">
                    {user.fullName}
                    {user._id === group.groupAdmin._id && (
                      <span className="ml-2 text-xs text-blue-400">(Admin)</span>
                    )}
                  </span>
                </div>
                {isAdmin && user._id !== authUser._id && (
                  <button
                    onClick={() => handleRemoveMember(user._id)}
                    disabled={loading}
                    className="text-red-400 hover:text-red-500 disabled:opacity-50"
                    title="Remove member"
                  >
                    <FaUserMinus />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Add Members (Only visible to admin) */}
        {isAdmin && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-300">Add Members</h3>
            <div className="max-h-40 overflow-y-auto bg-gray-700 rounded p-2">
              {availableUsers
                .filter(user => !group.participants.some(p => p._id === user._id))
                .map((user) => (
                  <div key={user._id} className="flex items-center justify-between mb-2 p-2 hover:bg-gray-600 rounded">
                    <div className="flex items-center">
                      <img
                        src={user.profilePic}
                        alt={user.fullName}
                        className="w-8 h-8 rounded-full object-cover mr-2"
                      />
                      <span className="text-gray-200">{user.fullName}</span>
                    </div>
                    <button
                      onClick={() => handleAddMember(user._id)}
                      disabled={loading}
                      className="text-green-400 hover:text-green-500 disabled:opacity-50"
                      title="Add member"
                    >
                      <FaUserPlus />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupMembersModal;