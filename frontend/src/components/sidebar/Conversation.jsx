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
			className={`group flex items-center rounded-2xl p-2 md:p-3 my-1 mx-1 md:mx-2 cursor-pointer transition-all duration-300 relative overflow-hidden
			${isSelected ? "bg-cyan-500/10 border border-cyan-500/20 shadow-sm" : "hover:bg-white/5 border border-transparent"}
		`}
			onClick={() => setSelectedConversation(conversation)}
		>
			{isSelected && <div className="absolute left-0 top-2 bottom-2 w-1.5 bg-cyan-500 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.6)]" />}
			
			<div className="relative flex-shrink-0">
				<div className="w-[48px] h-[48px] md:w-12 md:h-12 xl:w-14 xl:h-14 rounded-[1.25rem] xl:rounded-3xl overflow-hidden ring-1 ring-white/10 group-hover:ring-cyan-500/30 transition-all duration-500 shadow-md">
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
								<FaUsers className="text-white text-xl xl:text-2xl" />
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
				{isOnline && !conversation.isGroupChat && (
					<div className="absolute -bottom-0.5 -right-0.5 w-[14px] h-[14px] xl:w-4 xl:h-4 bg-green-500 rounded-full border-[2.5px] border-slate-900 shadow-[0_0_8px_rgba(34,197,94,0.6)] z-10" />
				)}
			</div>

			<div className='flex flex-col flex-1 min-w-0 ml-3.5 xl:ml-4'>
				<div className='flex justify-between items-center mb-0.5'>
					<p className={`text-base xl:text-lg font-bold truncate tracking-wide ${isSelected ? "text-cyan-400" : "text-slate-100"}`}>
						{conversation.isGroupChat ? conversation.groupName : conversation.fullName}
					</p>
					{isOnline && !conversation.isGroupChat && (
						<span className="text-[10px] xl:text-xs font-bold text-green-500 uppercase tracking-wider">
							Online
						</span>
					)}
				</div>
				<div className="flex items-center justify-between gap-2 overflow-hidden">
					<p className={`text-[13px] xl:text-sm truncate font-medium ${isSelected ? "text-cyan-400/80" : "text-slate-400"}`}>
						{conversation.isGroupChat ? `${conversation.participants?.length || 0} participants` : `@${conversation.username || "user"}`}
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
