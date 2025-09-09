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
			{allConversations.length > 0 ? (
				allConversations.map((conversation, idx) => (
					<Conversation
						key={conversation._id}
						conversation={conversation}
						emoji={getRandomEmoji()}
						lastIdx={idx === allConversations.length - 1}
					/>
				))
			) : !loading ? (
				<p className="text-center text-gray-400 mt-4">No conversations yet</p>
			) : null}

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
