import { useState } from "react";
import Conversations from "./Conversations";
import SearchInput from "./SearchInput";
import ProfileButton from "./ProfileButton";
import CreateGroupModal from "./CreateGroupModal";
import { HiX, HiPlus } from "react-icons/hi";

const Sidebar = ({ hideSidebar }) => {
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-full bg-transparent p-4">
      {/* Professional Logo & Header */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-2.5 group cursor-default">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/10 group-hover:shadow-cyan-500/30 transition-all duration-500 transform group-hover:rotate-6">
            <img src="/logo.png" alt="ChatVerse" className="w-6 h-6 object-contain" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-extrabold tracking-tight chatverse-gradient-text leading-none mb-0.5">
              ChatVerse
            </h1>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] leading-none">
              Professional Messenger
            </span>
          </div>
        </div>
        <button 
          onClick={hideSidebar} 
          className="md:hidden p-2 rounded-xl hover:bg-white/5 transition-colors text-slate-400"
        >
          <HiX size={22} />
        </button>
      </div>

      <div className="flex flex-col gap-4 h-full overflow-hidden">
        {/* Compact Actions Row */}
        <div className="flex items-center gap-2 px-1">
          <div className="flex-1">
            <SearchInput />
          </div>
          <button 
            onClick={() => setIsCreateGroupModalOpen(true)}
            className="w-11 h-11 flex-shrink-0 flex items-center justify-center bg-white/5 hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/20 text-cyan-400 rounded-2xl transition-all duration-300 shadow-sm group"
            title="Create New Group"
          >
            <HiPlus size={20} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <div className="border-b border-white/5 mx-1"></div>
        
        <ProfileButton />

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
          <h2 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-3 px-2">
            Recent Activity
          </h2>
          <Conversations />
        </div>
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
