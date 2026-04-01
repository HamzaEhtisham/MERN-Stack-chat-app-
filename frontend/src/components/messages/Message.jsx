import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";
import { BsCheck2, BsCheck2All, BsClock } from "react-icons/bs";

const Message = ({ message }) => {
	const { authUser } = useAuthContext();
	const { selectedConversation } = useConversation();
	const fromMe = message.senderId === authUser._id;
	const formattedTime = extractTime(message.createdAt);
	const chatClassName = fromMe ? "chat-end" : "chat-start";
	const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
	const bubbleBgColor = fromMe 
		? "bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-lg shadow-cyan-500/20 text-white" 
		: "bg-gray-800/80 backdrop-blur-sm border border-gray-100/10 shadow-lg text-gray-100";
	const isGroupChat = selectedConversation?.isGroupChat;
	const senderName = !fromMe && isGroupChat ? message.senderName : "";

	const shakeClass = message.shouldShake ? "shake" : "";

	// Group read receipt logic
	const readByCount = message.readBy?.length || 0;
	const totalOtherMembers = (selectedConversation?.participants?.length || 1) - 1;
	const allRead = readByCount >= totalOtherMembers && totalOtherMembers > 0;

	return (
		<div className={`chat ${chatClassName} my-2`}>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<img 
						alt='user avatar' 
						src={profilePic || `https://ui-avatars.com/api/?name=${senderName || 'U'}&background=0D8ABC&color=fff`} 
						onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${senderName || 'U'}&background=0D8ABC&color=fff`; }}
					/>
				</div>
			</div>
			{senderName && <div className="chat-header text-xs opacity-70 mb-1">{senderName}</div>}
			<div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2 flex flex-col gap-2`}>
				{message.image && (
					<img 
						src={message.image} 
						alt="Attachment" 
						className="max-w-[200px] sm:max-w-[250px] rounded-md object-contain"
					/>
				)}
				{message.message && <p>{message.message}</p>}
			</div>
			<div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>
				{formattedTime}
				{fromMe && !isGroupChat && (
					<span className={message.status === "read" ? "text-blue-400" : message.status === "pending" ? "text-yellow-400" : "text-gray-400"}>
						{message.status === "pending" ? <BsClock size={12} /> : message.status === "read" ? <BsCheck2All size={16} /> : <BsCheck2 size={16} />}
					</span>
				)}
				{fromMe && isGroupChat && (
					<span className={message.status === "pending" ? "text-yellow-400" : allRead ? "text-blue-400" : readByCount > 0 ? "text-gray-300" : "text-gray-500"}>
						{message.status === "pending" ? <BsClock size={12} /> : allRead ? <BsCheck2All size={16} /> : readByCount > 0 ? <BsCheck2All size={16} /> : <BsCheck2 size={16} />}
					</span>
				)}
			</div>
		</div>
	);
};
export default Message;
