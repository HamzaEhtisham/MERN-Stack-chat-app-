import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import UpdateProfile from "../profile/UpdateProfile";
import { FaUser, FaCamera, FaSignOutAlt } from "react-icons/fa";
import usePreviewImg from "../../hooks/usePreviewImg";
import toast from "react-hot-toast";

const ProfileButton = () => {
  const { authUser, setAuthUser } = useAuthContext();
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { handleImageChange } = usePreviewImg();
  const [loading, setLoading] = useState(false);

  const handleQuickProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      handleImageChange(e);
      
      const formData = new FormData();
      formData.append("profilePic", file);

      const res = await fetch(`/api/users/profile`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setAuthUser(data);
      localStorage.setItem("chat-user", JSON.stringify(data));
      toast.success("Profile picture updated successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      setShowProfileOptions(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("chat-user");
    setAuthUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowProfileOptions(prev => !prev)}
          className="flex items-center gap-3 hover:bg-gray-700 py-3 px-4 rounded-lg transition-colors w-full"
        >
          <div className="relative">
            {loading ? (
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-700">
                <span className="loading loading-spinner loading-sm"></span>
              </div>
            ) : (
              <img
                src={authUser?.profilePic || "https://via.placeholder.com/40"}
                alt="profile"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-800"
              />
            )}
          </div>
          <span className="text-gray-200 font-medium">{authUser?.username}</span>
        </button>

        {showProfileOptions && (
          <div className="absolute left-0 mt-2 w-full bg-gray-700 rounded-md shadow-lg z-10 py-2">
            <label className="flex items-center gap-2 px-4 py-2 hover:bg-gray-600 cursor-pointer">
              <FaCamera className="text-gray-300" />
              <span className="text-gray-300">Change Picture</span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleQuickProfilePicChange}
              />
            </label>
            <button 
              onClick={() => {
                setShowUpdateProfile(true);
                setShowProfileOptions(false);
              }}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-600 w-full text-left"
            >
              <FaUser className="text-gray-300" />
              <span className="text-gray-300">Edit Profile</span>
            </button>
            <button 
              onClick={() => {
                setShowLogoutConfirm(true);
                setShowProfileOptions(false);
              }}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-600 w-full text-left text-red-400"
            >
              <FaSignOutAlt className="text-red-400" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {showUpdateProfile && (
        <UpdateProfile onClose={() => setShowUpdateProfile(false)} />
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm relative">
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold mb-4 text-gray-200 text-center">Confirm Logout?</h3>
              <div className="flex justify-center gap-3 mt-6">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileButton;
