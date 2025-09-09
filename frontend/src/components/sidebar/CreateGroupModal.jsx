import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const CreateGroupModal = ({ isOpen, onClose }) => {
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (groupName.trim() === "") {
      return toast.error("Group name is required");
    }
    if (selectedUsers.length < 2) {
      return toast.error("Please select at least 2 users");
    }

    try {
      setLoading(true);
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: groupName,
          participants: selectedUsers,
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      toast.success("Group created successfully!");
      setGroupName("");
      setSelectedUsers([]);
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-200">
          Create Group Chat
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="groupName" className="block text-gray-300 mb-1">
              Group Name
            </label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600 focus:outline-none focus:border-blue-500"
              placeholder="Enter group name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-1">
              Select Users (at least 2)
            </label>
            <div className="max-h-40 overflow-y-auto bg-gray-700 rounded p-2">
              {availableUsers.map((user) => (
                <div key={user._id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`user-${user._id}`}
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => handleUserSelect(user._id)}
                    className="mr-2"
                  />
                  <label
                    htmlFor={`user-${user._id}`}
                    className="flex items-center cursor-pointer"
                  >
                    <img
                      src={user.profilePic}
                      alt={user.fullName}
                      className="w-8 h-8 rounded-full object-cover mr-2"
                    />
                    <span className="text-gray-200">{user.fullName}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
