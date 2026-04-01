import { useState } from "react";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import ProfileButton from "./ProfileButton";
import CreateGroupModal from "./CreateGroupModal";

const Sidebar = () => {
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

  return (
    <div className="border-r border-gray-100/10 p-4 flex flex-col h-full max-w-[100vw] w-full md:w-[380px] bg-transparent">
      <div className="flex flex-col gap-4 h-full">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="relative w-full">
            <SearchInput />
          </div>
          <button 
            onClick={() => setIsCreateGroupModalOpen(true)}
            className="premium-btn px-4 py-2 rounded-xl text-sm transition-colors duration-200 flex-shrink-0"
          >
            Create Group
          </button>
        </div>
        <div className="divider my-2 border-t border-gray-800/50"></div>
        <ProfileButton />
        <div className="flex-grow overflow-y-auto mt-4">
          <Conversations />
        </div>
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
