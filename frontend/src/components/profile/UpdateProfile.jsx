import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import usePreviewImg from "../../hooks/usePreviewImg";
import toast from "react-hot-toast";

const UpdateProfile = ({ onClose }) => {
  const { authUser, setAuthUser } = useAuthContext();
  const [inputs, setInputs] = useState({
    username: authUser.username,
    password: "",
    confirmPassword: "",
  });
  const { handleImageChange, imgUrl } = usePreviewImg();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputs.password !== inputs.confirmPassword) {
      return toast.error("Passwords don't match");
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("username", inputs.username);
      if (inputs.password) formData.append("password", inputs.password);
      if (selectedFile) formData.append("profilePic", selectedFile);

      const res = await fetch(`/api/users/profile`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setAuthUser(data);
      localStorage.setItem("chat-user", JSON.stringify(data));
      toast.success("Profile updated successfully");
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
      <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md z-50">
        <h2 className="text-2xl font-bold mb-4 text-gray-200">
          Update Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Picture */}
          <div className="flex flex-col mb-4">
            <label className="text-gray-300 mb-2">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                handleImageChange(e);
                setSelectedFile(e.target.files[0]);
              }}
              className="text-gray-300 p-2 bg-gray-700 rounded w-full"
            />
            {imgUrl && (
              <img
                src={imgUrl}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover mt-4"
              />
            )}
          </div>

          {/* Username */}
          <div className="mb-4">
            <label className="text-gray-300 mb-2 block">Username</label>
            <input
              type="text"
              value={inputs.username}
              onChange={(e) =>
                setInputs({ ...inputs, username: e.target.value })
              }
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>

          {/* New Password */}
          <div className="mb-4">
            <label className="text-gray-300 mb-2 block">New Password</label>
            <input
              type="password"
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
              className="w-full p-2 rounded bg-gray-700 text-white"
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="text-gray-300 mb-2 block">Confirm Password</label>
            <input
              type="password"
              value={inputs.confirmPassword}
              onChange={(e) =>
                setInputs({ ...inputs, confirmPassword: e.target.value })
              }
              className="w-full p-2 rounded bg-gray-700 text-white"
              autoComplete="new-password"
              minLength={6}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
