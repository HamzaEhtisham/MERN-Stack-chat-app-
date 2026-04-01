import { useState, useEffect } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { FaUsers, FaUsersCog, FaEdit } from "react-icons/fa";
import { HiChevronLeft } from "react-icons/hi";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";
import GroupProfileModal from "../group/GroupProfileModal";
import GroupMembersModal from "../group/GroupMembersModal";

const MessageContainer = () => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const { socket, onlineUsers } = useSocketContext();
	const { authUser } = useAuthContext();
	
	const [showGroupProfileModal, setShowGroupProfileModal] = useState(false);
	const [showGroupMembersModal, setShowGroupMembersModal] = useState(false);
	
	const isGroupAdmin = selectedConversation?.isGroupChat && 
		selectedConversation?.groupAdmin?._id === authUser?._id;

	useEffect(() => {
		if (selectedConversation?.isGroupChat) {
			socket.emit("joinGroup", selectedConversation._id);
		}
		return () => {
			if (selectedConversation?.isGroupChat) {
				socket.emit("leaveGroup", selectedConversation._id);
			}
		};
	}, [selectedConversation, socket]);

	return (
		<div className='flex flex-col h-full w-full bg-transparent overflow-hidden'>
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					{/* Header */}
					<div className='chatverse-glass px-6 py-4 flex items-center justify-between z-10 border-b border-white/5'>
						<div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedConversation(null)}
                className="md:hidden p-2 -ml-2 rounded-xl hover:bg-white/5 text-slate-400"
              >
                <HiChevronLeft size={24} />
              </button>
							{selectedConversation.isGroupChat ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
                    {selectedConversation.groupPic ? (
                      <img 
                        src={selectedConversation.groupPic} 
                        className="w-full h-full rounded-xl object-cover" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${selectedConversation.groupName}&background=4f46e5&color=fff`;
                        }}
                      />
                    ) : (
                      <FaUsers className="text-white text-xl" />
                    )}
                  </div>
                  <div>
                    <h3 className='text-white font-bold tracking-wide'>{selectedConversation.groupName}</h3>
                    <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">{selectedConversation.participants?.length || 0} Members</p>
                  </div>
                </div>
							) : (
                <div className="flex items-center gap-3">
                  <div className={`avatar ${onlineUsers?.includes(selectedConversation._id) ? "online" : ""}`}>
                    <div className="w-10 h-10 rounded-xl">
                      <img 
                        src={selectedConversation.profilePic || `https://ui-avatars.com/api/?name=${selectedConversation.fullName}&background=06b6d4&color=fff`} 
                        alt="user avatar" 
                        className="w-full h-full object-cover rounded-xl"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${selectedConversation.fullName}&background=06b6d4&color=fff`;
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className='text-white font-bold tracking-wide'>{selectedConversation.fullName}</h3>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${onlineUsers?.includes(selectedConversation._id) ? "text-green-400" : "text-slate-500"}`}>
                      {onlineUsers?.includes(selectedConversation._id) ? "Online Now" : "Offline"}
                    </p>
                  </div>
                </div>
							)}
						</div>

            <div className="flex items-center gap-2">
              {selectedConversation.isGroupChat && (
                <>
                  {isGroupAdmin && (
                    <button onClick={() => setShowGroupProfileModal(true)} className="p-2.5 rounded-xl hover:bg-white/5 text-slate-400 transition-colors">
                      <FaEdit size={18} />
                    </button>
                  )}
                  <button onClick={() => setShowGroupMembersModal(true)} className="p-2.5 rounded-xl hover:bg-white/5 text-slate-400 transition-colors">
                    <FaUsersCog size={18} />
                  </button>
                </>
              )}
            </div>
					</div>

					<Messages />
					<MessageInput />
					
					{showGroupProfileModal && (
						<GroupProfileModal isOpen={showGroupProfileModal} onClose={() => setShowGroupProfileModal(false)} group={selectedConversation} />
					)}
					{showGroupMembersModal && (
						<GroupMembersModal isOpen={showGroupMembersModal} onClose={() => setShowGroupMembersModal(false)} group={selectedConversation} />
					)}
				</>
			)}
		</div>
	);
};
export default MessageContainer;

const NoChatSelected = () => {
	const { authUser } = useAuthContext();
	return (
		<div className='flex items-center justify-center w-full h-full p-8 animate-fade-in'>
			<div className='max-w-md w-full text-center space-y-10 premium-card p-12 bg-slate-900/40 backdrop-blur-3xl shadow-2xl'>
				<div className="relative inline-block">
          <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-cyan-400 via-blue-600 to-violet-600 flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.3)] mx-auto transform hover:rotate-12 transition-all duration-700">
            <img src="/logo.png" alt="ChatVerse" className="w-14 h-14 object-contain" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-slate-950 rounded-2xl p-2.5 border border-white/10 shadow-xl">
            <TiMessages className='text-3xl text-cyan-400' />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className='text-5xl font-extrabold tracking-tighter'>
            <span className='chatverse-gradient-text'>ChatVerse</span>
          </h1>
          <div className="space-y-2">
            <p className='text-xl text-white font-semibold'>Welcome, {authUser.fullName.split(' ')[0]}! 👋</p>
            <p className='text-slate-400 font-medium leading-relaxed'>
              Your professional universe for secure and instant messaging.
              Select a conversation to start exploring.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`w-2 h-2 rounded-full bg-cyan-500/40 animate-bounce delay-${i * 150}`}></div>
          ))}
        </div>
			</div>
		</div>
	);
};


// STARTER CODE SNIPPET
// import MessageInput from "./MessageInput";
// import Messages from "./Messages";

// const MessageContainer = () => {
// 	return (
// 		<div className='md:min-w-[450px] flex flex-col'>
// 			<>
// 				{/* Header */}
// 				<div className='bg-slate-500 px-4 py-2 mb-2'>
// 					<span className='label-text'>To:</span> <span className='text-gray-900 font-bold'>John doe</span>
// 				</div>

// 				<Messages />
// 				<MessageInput />
// 			</>
// 		</div>
// 	);
// };
// export default MessageContainer;
