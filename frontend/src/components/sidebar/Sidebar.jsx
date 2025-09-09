import { useState } from "react";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import ProfileButton from "./ProfileButton";
import CreateGroupModal from "./CreateGroupModal";
import { FaComments } from "react-icons/fa";

const Sidebar = () => {
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

  return (
    <div className="border-r border-gray-700/70 p-4 flex flex-col h-full max-w-[100vw] w-full md:w-[380px] bg-gray-800/90">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <FaComments className="text-blue-400 text-2xl" />
          <h1 className="text-2xl font-bold text-blue-100">ChatSphere</h1>
        </div>
        <div className="flex items-center justify-between gap-2">
          <SearchInput />
          <button 
            onClick={() => setIsCreateGroupModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex-shrink-0 shadow-md"
          >
            Create Group
          </button>
        </div>
        <div className="divider my-2 border-t border-gray-700/50"></div>
        <ProfileButton />
        <Conversations />
        <LogoutButton />
      </div>

      <CreateGroupModal 
        isOpen={isCreateGroupModalOpen} 
        onClose={() => setIsCreateGroupModalOpen(false)} 
      />
    </div>
  );
};
export default Sidebar;

// STARTER CODE FOR THIS FILE
// import Conversations from "./Conversations";
// import LogoutButton from "./LogoutButton";
// import SearchInput from "./SearchInput";

// const Sidebar = () => {
// 	return (
// 		<div className='border-r border-slate-500 p-4 flex flex-col'>
// 			<SearchInput />
// 			<div className='divider px-3'></div>
// 			<Conversations />
// 			<LogoutButton />
// 		</div>
// 	);
// };
// export default Sidebar;
