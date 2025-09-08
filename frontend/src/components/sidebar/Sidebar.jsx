import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import ProfileButton from "./ProfileButton";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div
      className={`
        sidebar
        ${isOpen ? "translate-x-0" : "sidebar-closed"}
      `}
    >
      {/* Mobile Header */}
      <div className="flex justify-between items-center mb-4 md:hidden">
        <h1 className="text-xl font-bold">Menu</h1>
        <button
          onClick={onClose}
          className="text-white text-lg bg-gray-700 px-2 py-1 rounded"
        >
          ✖
        </button>
      </div>

      {/* Desktop Title */}
      <h1 className="hidden md:block text-2xl font-bold text-center mb-2">
        Welcome
      </h1>

      {/* Content */}
      <div className="flex flex-col gap-4">
        <SearchInput />
        <div className="divider px-3"></div>
        <ProfileButton />
        <Conversations />
        <LogoutButton />
      </div>
    </div>
  );
};

export default Sidebar;
