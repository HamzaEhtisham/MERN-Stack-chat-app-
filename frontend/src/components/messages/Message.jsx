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
		<div className={`chat ${chatClassName} my-3 px-2`}>
			<div className='chat-image avatar'>
				<div className='w-9 rounded-xl overflow-hidden shadow-md ring-1 ring-white/5'>
					<img 
						alt='user avatar' 
						src={profilePic || `https://ui-avatars.com/api/?name=${senderName || 'U'}&background=0D8ABC&color=fff`} 
						onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${senderName || 'U'}&background=0D8ABC&color=fff`; }}
					/>
				</div>
			</div>
			{senderName && <div className="chat-header text-[10px] font-bold text-cyan-400/80 uppercase tracking-widest ml-1 mb-1">{senderName}</div>}
			
      <div className={`chat-bubble min-w-[80px] max-w-[85%] md:max-w-[70%] shadow-lg ${bubbleBgColor} ${shakeClass} p-3 relative
        ${fromMe ? 'rounded-2xl rounded-tr-none' : 'rounded-2xl rounded-tl-none'}
      `}>
				{message.image && (
					<img 
						src={message.image} 
						alt="Attachment" 
						className="w-full rounded-lg mb-2 object-contain border border-white/10"
					/>
				)}
				<div className="flex flex-col gap-1">
          {message.message && <p className="text-sm md:text-base leading-relaxed font-medium">{message.message}</p>}
          
          <div className='flex justify-end items-center gap-1 mt-1 opacity-60'>
            <span className="text-[10px] font-bold">{formattedTime}</span>
            {fromMe && !isGroupChat && (
              <span className={message.status === "read" ? "text-cyan-200" : "text-white/60"}>
                {message.status === "pending" ? <BsClock size={10} /> : message.status === "read" ? <BsCheck2All size={14} /> : <BsCheck2 size={14} />}
              </span>
            )}
            {fromMe && isGroupChat && (
              <span className={allRead ? "text-cyan-200" : "text-white/60"}>
                {message.status === "pending" ? <BsClock size={10} /> : allRead ? <BsCheck2All size={14} /> : <BsCheck2 size={14} />}
              </span>
            )}
          </div>
        </div>
			</div>
		</div>

	);
};
export default Message;
