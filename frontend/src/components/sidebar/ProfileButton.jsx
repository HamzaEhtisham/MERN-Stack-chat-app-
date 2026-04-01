import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";
import UpdateProfile from "../profile/UpdateProfile";
import { FaUser, FaCamera, FaSignOutAlt } from "react-icons/fa";
import usePreviewImg from "../../hooks/usePreviewImg";
import toast from "react-hot-toast";

const ProfileButton = () => {
  const { authUser, setAuthUser } = useAuthContext();
  const { onlineUsers } = useSocketContext();
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { handleImageChange } = usePreviewImg();
  const [loading, setLoading] = useState(false);
  
  const isOnline = authUser && onlineUsers.includes(authUser._id);

  const handleQuickProfilePicChange = async (e) => {
    // ... [Logic remains exactly the same] ...
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
        credentials: "include",
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
          className="flex items-center gap-3 hover:bg-white/5 py-3 px-4 rounded-xl transition-all w-full border border-transparent hover:border-cyan-500/20 group"
        >
          <div className={`avatar relative ${isOnline ? "online" : ""}`}>
            <div className="w-12 h-12 rounded-[1.25rem] overflow-hidden ring-1 ring-white/10 group-hover:ring-cyan-500/30 transition-all duration-500 shadow-md">
              {loading ? (
                <div className="w-full h-full rounded-full flex items-center justify-center bg-gray-700">
                  <span className="loading loading-spinner loading-sm text-cyan-500"></span>
                </div>
              ) : (
                <img
                  src={authUser?.profilePic || `https://ui-avatars.com/api/?name=${authUser?.username || 'User'}&background=06b6d4&color=fff`}
                  alt="profile"
                  className="object-cover w-full h-full"
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${authUser?.username || 'User'}&background=06b6d4&color=fff`; }}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col items-start min-w-0">
            <span className="text-slate-200 font-bold truncate tracking-wide">{authUser?.username}</span>
            <span className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">{isOnline ? "Online" : "Offline"}</span>
          </div>
        </button>

        {showProfileOptions && (
          <div className="absolute left-0 mt-3 w-full bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 py-2 overflow-hidden">
            <label className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors group/item">
              <div className="w-8 h-8 rounded-full bg-slate-700/50 group-hover/item:bg-cyan-500/10 flex items-center justify-center transition-colors">
                <FaCamera className="text-slate-400 group-hover/item:text-cyan-400 text-sm transition-colors" />
              </div>
              <span className="text-slate-300 font-bold text-sm tracking-wide">Change Picture</span>
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
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 w-full text-left transition-colors group/item"
            >
              <div className="w-8 h-8 rounded-full bg-slate-700/50 group-hover/item:bg-cyan-500/10 flex items-center justify-center transition-colors">
                <FaUser className="text-slate-400 group-hover/item:text-cyan-400 text-sm transition-colors" />
              </div>
              <span className="text-slate-300 font-bold text-sm tracking-wide">Edit Profile</span>
            </button>
            <button 
              onClick={() => {
                setShowLogoutConfirm(true);
                setShowProfileOptions(false);
              }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 w-full text-left text-red-400 transition-colors group/item"
            >
              <div className="w-8 h-8 rounded-full bg-red-500/10 group-hover/item:bg-red-500/20 flex items-center justify-center transition-colors">
                 <FaSignOutAlt className="text-red-400 text-sm transition-colors" />
              </div>
              <span className="font-bold text-sm tracking-wide text-red-400">Logout</span>
            </button>
          </div>
        )}
      </div>

      {showUpdateProfile && (
        <UpdateProfile onClose={() => setShowUpdateProfile(false)} />
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[100] px-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 w-full max-w-sm relative shadow-2xl">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                 <FaSignOutAlt className="text-red-500 text-2xl" />
              </div>
              <h3 className="text-2xl font-black mb-2 text-slate-100 text-center tracking-tight">Log out?</h3>
              <p className="text-slate-400 text-sm mb-8 text-center font-medium">Are you sure you want to end your session?</p>
              <div className="flex justify-center gap-3 w-full">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 font-bold hover:bg-red-500/30 transition-colors"
                >
                  Confirm
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
