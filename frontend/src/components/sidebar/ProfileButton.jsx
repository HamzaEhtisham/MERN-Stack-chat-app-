import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import UpdateProfile from "../profile/UpdateProfile";

const ProfileButton = () => {
  const { authUser } = useAuthContext();
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowUpdateProfile(true)}
        className="flex items-center gap-2 hover:bg-sky-500 py-2 px-4 rounded-md transition-colors"
      >
        <img
          src={authUser?.profilePic || "https://via.placeholder.com/40"}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
        />
        <span className="text-gray-300">{authUser?.username}</span>
      </button>

      {showUpdateProfile && (
        <UpdateProfile onClose={() => setShowUpdateProfile(false)} />
      )}
    </>
  );
};

export default ProfileButton;
