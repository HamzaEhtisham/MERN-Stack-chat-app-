import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";
import { FaUsers } from "react-icons/fa";
import { useEffect } from "react";

const Conversation = ({ conversation, lastIdx, emoji }) => {
	const { selectedConversation, setSelectedConversation } = useConversation();

	const isSelected = selectedConversation?._id === conversation._id;
	const { onlineUsers } = useSocketContext();
	const isOnline = !conversation.isGroupChat && onlineUsers.includes(conversation._id);
	
	useEffect(() => {
		console.log("Conversation props:", conversation);
	}, [conversation]);

	return (
		<>
			<div
				className={`flex gap-4 items-center rounded-2xl p-3 my-2 cursor-pointer transition-all duration-300 relative overflow-hidden
				${isSelected ? "bg-gradient-to-r from-blue-600/60 to-cyan-500/60 shadow-[0_4px_16px_rgba(6,182,212,0.2)]" : "bg-transparent hover:bg-gray-800/50"}
			`}
				onClick={() => setSelectedConversation(conversation)}
			>
                {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_8px_cyan]" />}
				{conversation.isGroupChat ? (
					<div className="avatar">
						<div className="w-12 h-12 rounded-full ring-2 ring-offset-2 ring-offset-gray-800 ring-blue-400">
							{conversation.groupPic ? (
								<img 
									src={conversation.groupPic} 
									alt="group avatar" 
									className="object-cover" 
									onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${conversation.groupName || 'Group'}&background=0D8ABC&color=fff`; }}
								/>
							) : (
								<div className="w-full h-full bg-blue-800 flex items-center justify-center shadow-inner">
									<FaUsers className="text-blue-100 text-xl" />
								</div>
							)}
						</div>
					</div>
				) : (
					<div className={`avatar ${isOnline ? "online" : ""}`}>
						<div className='w-12 h-12 rounded-full ring-2 ring-offset-2 ring-offset-gray-800 ring-blue-400'>
							<img 
								src={conversation.profilePic || `https://ui-avatars.com/api/?name=${conversation.fullName || 'User'}&background=0D8ABC&color=fff`} 
								alt='user avatar' 
								className="object-cover" 
								onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${conversation.fullName || 'User'}&background=0D8ABC&color=fff`; }}
							/>
						</div>
					</div>
				)}

				<div className='flex flex-col flex-1'>
					<div className='flex gap-3 justify-between items-center'>
						<p className='font-bold text-gray-100'>
							{conversation.isGroupChat ? conversation.groupName : conversation.fullName}
						</p>
						{!conversation.isGroupChat && <span className='text-xl'>{emoji}</span>}
					</div>
					{conversation.isGroupChat && (
						<p className="text-blue-200 text-xs font-medium">{conversation.participants?.length || 0} members</p>
					)}
				</div>
			</div>

			{!lastIdx && <div className='border-t border-gray-800/50 my-1' />}
		</>
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
