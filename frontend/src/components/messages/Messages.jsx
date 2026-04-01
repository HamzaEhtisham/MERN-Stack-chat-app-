import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useConversation from "../../zustand/useConversation";

const Messages = () => {
	const { messages, loading } = useGetMessages();
	const { isTyping } = useConversation();
	const lastMessageRef = useRef();

	useEffect(() => {
		setTimeout(() => {
			lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 100);
	}, [messages, isTyping]);

	return (
		<div className='px-4 flex-1 overflow-auto custom-scrollbar relative z-10'>
			{!loading &&
				Array.isArray(messages) && messages.length > 0 &&
				messages.map((message) => (
					<div key={message._id} ref={lastMessageRef} className="animate-fade-in">
						<Message message={message} />
					</div>
				))}

			{loading && [...Array(4)].map((_, idx) => <MessageSkeleton key={idx} />)}
			{!loading && Array.isArray(messages) && messages.length === 0 && (
				<div className="flex flex-col items-center justify-center h-full opacity-50 space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center">
            <img src="/logo.png" alt="ChatVerse" className="w-8 h-8 object-contain grayscale opacity-50" />
          </div>
          <p className='text-center text-sm font-medium'>No messages yet. Send one to start the conversation!</p>
        </div>
			)}

			{isTyping && (
				<div className="chat chat-start my-2" ref={lastMessageRef}>
					<div className="chat-bubble bg-gray-700 text-white flex gap-1 items-center pb-2 w-16 px-3">
						<span className="typing-dot animate-bounce delay-75">.</span>
						<span className="typing-dot animate-bounce delay-150">.</span>
						<span className="typing-dot animate-bounce delay-300">.</span>
					</div>
				</div>
			)}
		</div>
	);
};
export default Messages;

// STARTER CODE SNIPPET
// import Message from "./Message";

// const Messages = () => {
// 	return (
// 		<div className='px-4 flex-1 overflow-auto'>
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 		</div>
// 	);
// };
// export default Messages;
