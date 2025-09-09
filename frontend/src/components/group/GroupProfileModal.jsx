import { useState } from "react";
import toast from "react-hot-toast";
import { useSocketContext } from "../../context/SocketContext";
import { FaCamera } from "react-icons/fa";
import usePreviewImg from "../../hooks/usePreviewImg";

const GroupProfileModal = ({ isOpen, onClose, group }) => {
  const [groupName, setGroupName] = useState(group?.groupName || "");
  const [loading, setLoading] = useState(false);
  const { socket } = useSocketContext();
  const { handleImageChange, imgUrl } = usePreviewImg();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (groupName.trim() === "") {
      return toast.error("Group name is required");
    }

    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append("groupName", groupName);
      if (selectedFile) formData.append("groupPic", selectedFile);
      
      const res = await fetch(`/api/groups/${group._id}/update`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // Notify socket about group update
      socket.emit("groupUpdated", data);

      toast.success("Group profile updated successfully!");
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-200">
          Update Group Profile
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Group Picture */}
          <div className="mb-4 flex flex-col items-center">
            <div className="relative mb-3">
              <img
                src={imgUrl || group?.groupPic || "/uploads/default-group.png"}
                alt="Group"
                className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
              />
              <label className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full cursor-pointer">
                <FaCamera className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    handleImageChange(e);
                    setSelectedFile(e.target.files[0]);
                  }}
                />
              </label>
            </div>
          </div>
          
          {/* Group Name */}
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
              {loading ? "Updating..." : "Update Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupProfileModal;