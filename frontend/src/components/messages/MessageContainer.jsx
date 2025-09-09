import { useEffect } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { FaUsers } from "react-icons/fa";
import { BsCircleFill } from "react-icons/bs";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";

const MessageContainer = () => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const { socket } = useSocketContext();

	useEffect(() => {
		// Join group chat room when selected conversation changes
		if (selectedConversation?.isGroupChat) {
			socket.emit("joinGroup", selectedConversation._id);
		}

		// cleanup function (unmounts)
		return () => {
			if (selectedConversation?.isGroupChat) {
				socket.emit("leaveGroup", selectedConversation._id);
			}
			// Don't reset selectedConversation on unmount to preserve selection
		};
	}, [selectedConversation, socket, setSelectedConversation]);

	return (
		<div className='md:min-w-[450px] flex flex-col h-full'>
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					{/* Header */}
					<div className='bg-gray-800/90 px-6 py-4 mb-2 shadow-md border-b border-gray-700/50'>
						{selectedConversation.isGroupChat ? (
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center shadow-inner">
									<FaUsers className="text-blue-100 text-xl" />
								</div>
								<div>
									<span className='text-gray-100 font-bold text-lg'>{selectedConversation.groupName}</span>
									<p className="text-blue-300 text-xs font-medium">{selectedConversation.participants?.length || 0} members</p>
								</div>
							</div>
						) : (
							<div className="flex items-center gap-3">
								<div className="avatar">
									<div className="w-10 h-10 rounded-full ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-800">
										<img src={selectedConversation.profilePic} alt="user avatar" />
									</div>
								</div>
								<div>
									<span className='text-gray-100 font-bold text-lg'>{selectedConversation.fullName}</span>
									<div className="flex items-center gap-1">
										<BsCircleFill className={`${socket.onlineUsers?.includes(selectedConversation._id) ? "text-green-500" : "text-gray-500"} text-[8px]`} />
										<span className="text-xs text-gray-300">{socket.onlineUsers?.includes(selectedConversation._id) ? "Online" : "Offline"}</span>
									</div>
								</div>
							</div>
						)}
					</div>
					<Messages />
					<MessageInput />
				</>
			)}
		</div>
	);
};
export default MessageContainer;

const NoChatSelected = () => {
	const { authUser } = useAuthContext();
	return (
		<div className='flex items-center justify-center w-full h-full bg-gray-900/50 backdrop-blur-sm'>
			<div className='px-8 py-10 text-center rounded-xl bg-gray-800/70 shadow-xl border border-gray-700/50 backdrop-blur-sm'>
				<div className='flex flex-col items-center gap-4'>
					<div className='w-20 h-20 rounded-full bg-blue-600/30 flex items-center justify-center mb-2'>
						<TiMessages className='text-4xl text-blue-300' />
					</div>
					<h2 className='text-2xl font-bold text-gray-100'>Welcome, {authUser.fullName}! 👋</h2>
					<p className='text-gray-300'>Select a chat to start messaging</p>
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
