import { useState } from "react";
import Conversations from "./Conversations";
import SearchInput from "./SearchInput";
import ProfileButton from "./ProfileButton";
import CreateGroupModal from "./CreateGroupModal";
import { HiX, HiPlus } from "react-icons/hi";

const Sidebar = ({ hideSidebar }) => {
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-full bg-slate-900/40 p-3 md:p-4 w-full">
      {/* Professional Logo & Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
        <div className="flex items-center gap-3 xl:gap-4 group cursor-default">
          <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-500 transform group-hover:-translate-y-1">
            <img src="/logo.png" alt="ChatVerse" className="w-6 h-6 xl:w-7 xl:h-7 object-contain" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[20px] md:text-[22px] xl:text-3xl font-extrabold tracking-tight chatverse-gradient-text leading-none mb-0.5 xl:mb-1">
              ChatVerse
            </h1>
            <span className="text-[9px] md:text-[10px] xl:text-[11px] text-slate-500 font-bold uppercase tracking-[0.2em] leading-none">
              Professional
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:gap-4 h-full overflow-hidden">
        {/* Compact Actions Row */}
        <div className="flex items-center gap-2 px-1">
          <div className="flex-1">
            <SearchInput />
          </div>
          <button 
            onClick={() => setIsCreateGroupModalOpen(true)}
            className="w-[42px] h-[42px] md:w-11 md:h-11 xl:w-12 xl:h-12 flex-shrink-0 flex items-center justify-center bg-white/5 hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/20 text-cyan-400 rounded-2xl transition-all duration-300 shadow-sm group"
            title="Create New Group"
          >
            <HiPlus size={20} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <div className="border-b border-white/5 mx-1 my-1"></div>
        
        <ProfileButton />

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 mt-1 md:mt-2">
          <h2 className="text-[10px] xl:text-xs font-bold text-slate-600 uppercase tracking-widest mb-2 md:mb-3 px-2">
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
