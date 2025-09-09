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
		<div className='py-2 flex flex-col overflow-auto'>
			<div className="mb-4">
				<h3 className="text-blue-300 font-semibold text-sm px-2 mb-2">DIRECT MESSAGES</h3>
				{allConversations.filter(c => !c.isGroupChat).length > 0 ? (
					allConversations.filter(c => !c.isGroupChat).map((conversation, idx, arr) => (
						<Conversation
							key={conversation._id}
							conversation={conversation}
							emoji={getRandomEmoji()}
							lastIdx={idx === arr.length - 1}
						/>
					))
				) : !loading ? (
					<p className="text-center text-gray-400 mt-2 text-sm">No direct messages yet</p>
				) : null}
			</div>
			
			<div className="mb-2">
				<h3 className="text-blue-300 font-semibold text-sm px-2 mb-2">GROUPS</h3>
				{allConversations.filter(c => c.isGroupChat).length > 0 ? (
					allConversations.filter(c => c.isGroupChat).map((conversation, idx, arr) => (
						<Conversation
							key={conversation._id}
							conversation={conversation}
							emoji={getRandomEmoji()}
							lastIdx={idx === arr.length - 1}
						/>
					))
				) : !loading ? (
					<p className="text-center text-gray-400 mt-2 text-sm">No groups yet</p>
				) : null}
			</div>

			{loading ? <span className='loading loading-spinner mx-auto'></span> : null}
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
