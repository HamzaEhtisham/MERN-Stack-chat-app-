import { useState } from "react";
import { BsSend } from "react-icons/bs";
import { BsEmojiSmile } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
import EmojiPicker from "emoji-picker-react";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const { loading, sendMessage } = useSendMessage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;
    await sendMessage(message);
    setMessage("");
  };

  const onEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  return (
    <form className="px-6 py-4 bg-gray-800/80 border-t border-gray-700/50" onSubmit={handleSubmit}>
      <div className="w-full relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
          <button type="button" onClick={() => setShowEmojis(!showEmojis)}>
            <BsEmojiSmile className="text-xl text-blue-400 hover:text-blue-300 transition-colors" />
          </button>
          {showEmojis && (
            <div className="absolute bottom-full left-0 mb-2 shadow-xl rounded-lg overflow-hidden">
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                theme="dark"
                height={350}
                width={300}
              />
            </div>
          )}
        </div>
        <input
          type="text"
          className="border text-sm rounded-full block w-full p-3 pl-12 bg-gray-700/70 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
          placeholder="Send a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
            type="submit"
            className="absolute inset-y-0 end-0 flex items-center pe-4"
          >
            {loading ? (
              <div className="loading loading-spinner loading-sm text-blue-400"></div>
            ) : (
              <BsSend className="text-blue-400 hover:text-blue-300 transition-colors text-lg" />
            )}
          </button>
      </div>
    </form>
  );
};
export default MessageInput;

// STARTER CODE SNIPPET
// import { BsSend } from "react-icons/bs";

// const MessageInput = () => {
// 	return (
// 		<form className='px-4 my-3'>
// 			<div className='w-full'>
// 				<input
// 					type='text'
// 					className='border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white'
// 					placeholder='Send a message'
// 				/>
// 				<button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
// 					<BsSend />
// 				</button>
// 			</div>
// 		</form>
// 	);
// };
// export default MessageInput;
