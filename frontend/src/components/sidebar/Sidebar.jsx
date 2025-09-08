import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import ProfileButton from "./ProfileButton";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div
      className={`
        border-r border-slate-500 p-4 flex flex-col h-full bg-gray-900 text-white
        md:static md:translate-x-0 md:w-[380px]
        fixed top-0 left-0 h-full w-full z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Welcome</h1>
        {/* Close button sirf mobile pe */}
        <button className="md:hidden text-white text-xl" onClick={onClose}>
          ✖
        </button>
      </div>

      {/* Content */}
      <SearchInput />
      <div className="divider px-3"></div>
      <ProfileButton />
      <Conversations />
      <LogoutButton />
    </div>
  );
};
export default Sidebar;
