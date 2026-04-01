import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";
import { FaUsers } from "react-icons/fa";

const Conversation = ({ conversation, lastIdx, emoji }) => {
	const { selectedConversation, setSelectedConversation } = useConversation();

	const isSelected = selectedConversation?._id === conversation._id;
	const { onlineUsers } = useSocketContext();
	const isOnline = !conversation.isGroupChat && onlineUsers.includes(conversation._id);
	
	return (
		<div
			className={`group flex gap-3 items-center rounded-xl p-2.5 my-0.5 cursor-pointer transition-all duration-300 relative overflow-hidden
			${isSelected ? "bg-cyan-500/10 border border-cyan-500/20 shadow-sm" : "hover:bg-white/5 border border-transparent"}
		`}
			onClick={() => setSelectedConversation(conversation)}
		>
			{isSelected && <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.5)]" />}
			
			<div className={`avatar ${isOnline ? "online" : ""}`}>
				<div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-white/5 group-hover:ring-cyan-500/20 transition-all duration-500">
					{conversation.isGroupChat ? (
						conversation.groupPic ? (
							<img 
								src={conversation.groupPic} 
								alt="G" 
								className="object-cover w-full h-full" 
								onError={(e) => {
									e.target.onerror = null;
									e.target.src = `https://ui-avatars.com/api/?name=${conversation.groupName}&background=4f46e5&color=fff`;
								}}
							/>
						) : (
							<div className="w-full h-full bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center">
								<FaUsers className="text-white text-lg" />
							</div>
						)
					) : (
						<img 
							src={conversation.profilePic || `https://ui-avatars.com/api/?name=${conversation.fullName}&background=06b6d4&color=fff`} 
							alt='P' 
							className="object-cover w-full h-full" 
							onError={(e) => {
								e.target.onerror = null;
								e.target.src = `https://ui-avatars.com/api/?name=${conversation.fullName}&background=06b6d4&color=fff`;
							}}
						/>
					)}
				</div>
			</div>

			<div className='flex flex-col flex-1 min-w-0'>
				<div className='flex justify-between items-center gap-2'>
					<p className={`text-sm font-bold truncate tracking-wide ${isSelected ? "text-cyan-400" : "text-slate-200"}`}>
						{conversation.isGroupChat ? conversation.groupName : conversation.fullName}
					</p>
					{!conversation.isGroupChat && isOnline && <span className='w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]'></span>}
				</div>
				<div className="flex items-center gap-1.5">
          {conversation.isGroupChat && <span className="text-[8px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter">Group</span>}
          <p className={`text-[10px] truncate font-medium ${isSelected ? "text-cyan-400/60" : "text-slate-500"}`}>
            {conversation.isGroupChat ? `${conversation.participants?.length || 0} Members` : (isOnline ? "Active" : "Offline")}
          </p>
        </div>
			</div>
		</div>

	);
};
export default Conversation;


// STARTER CODE SNIPPET
// const Conversation = () => {
// 	return (
// 		<>
// 			<div className='flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer'>
// 				<div className='avatar online'>
// 					<div className='w-12 rounded-full'>
// 						<img
// 							src='https://cdn0.iconfinder.com/data/icons/communication-line-10/24/account_profile_user_contact_person_avatar_placeholder-512.png'
// 							alt='user avatar'
// 						/>
// 					</div>
// 				</div>

// 				<div className='flex flex-col flex-1'>
// 					<div className='flex gap-3 justify-between'>
// 						<p className='font-bold text-gray-200'>John Doe</p>
// 						<span className='text-xl'>🎃</span>
// 					</div>
// 				</div>
// 			</div>

// 			<div className='divider my-0 py-0 h-1' />
// 		</>
// 	);
// };
// export default Conversation;
