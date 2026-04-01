import useGetConversations from "../../hooks/useGetConversations";
import { getRandomEmoji } from "../../utils/emojis";
import Conversation from "./Conversation";

const Conversations = () => {
	const { loading, conversations, groupChats } = useGetConversations();

	// Combine personal and group chats
	const allConversations = [
		...conversations.map(conv => ({ ...conv, isGroupChat: false })),
		...groupChats.map(group => ({
			...group,
			isGroupChat: true,
			_id: group._id,
			groupName: group.groupName || group.name
		}))
	];

	console.log("All conversations:", allConversations);

	return (
		<div className='py-2 flex flex-col overflow-auto w-full'>
			<div className="mb-4 mt-2">
				<h3 className="text-cyan-400/80 font-bold text-[10px] xl:text-xs uppercase tracking-widest px-3 mb-2">
					DIRECT MESSAGES
				</h3>
				{allConversations.filter(c => !c.isGroupChat).length > 0 ? (
					allConversations.filter(c => !c.isGroupChat).map((conversation, idx, arr) => (
						<Conversation
							key={`desktop-${conversation._id}`}
							conversation={conversation}
							emoji={getRandomEmoji()}
							lastIdx={idx === arr.length - 1}
						/>
					))
				) : !loading ? (
					<p className="text-center text-slate-500 mt-2 text-sm italic">No direct messages yet</p>
				) : null}
			</div>
			
			<div className="mb-6">
				<h3 className="text-cyan-400/80 font-bold text-[10px] xl:text-xs uppercase tracking-widest px-3 mb-2">
					GROUPS
				</h3>
				{allConversations.filter(c => c.isGroupChat).length > 0 ? (
					allConversations.filter(c => c.isGroupChat).map((conversation, idx, arr) => (
						<Conversation
							key={`desktop-group-${conversation._id}`}
							conversation={conversation}
							emoji={getRandomEmoji()}
							lastIdx={idx === arr.length - 1}
						/>
					))
				) : !loading ? (
					<p className="text-center text-slate-500 mt-2 text-sm italic">No groups yet</p>
				) : null}
			</div>

			{loading ? <span className='loading loading-spinner mx-auto text-cyan-500 block mt-4'></span> : null}
		</div>
	);
};
export default Conversations;

// STARTER CODE SNIPPET
// import Conversation from "./Conversation";

// const Conversations = () => {
// 	return (
// 		<div className='py-2 flex flex-col overflow-auto'>
// 			<Conversation />
// 			<Conversation />
// 			<Conversation />
// 			<Conversation />
// 			<Conversation />
// 			<Conversation />
// 		</div>
// 	);
// };
// export default Conversations;
