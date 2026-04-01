import { useState, useRef, useEffect } from "react";
import { BsSend, BsEmojiSmile, BsImage, BsX } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
import EmojiPicker from "emoji-picker-react";
import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { loading, sendMessage } = useSendMessage();
  const { socket } = useSocketContext();
  const { selectedConversation } = useConversation();
  const typingTimeoutRef = useRef(null);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    if (!socket || !selectedConversation) return;

    socket.emit("typing", { receiverId: selectedConversation._id });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stopTyping", { receiverId: selectedConversation._id });
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !imageFile) return;
    await sendMessage({ message, imageFile });
    setMessage("");
    setImageFile(null);
    setImagePreview(null);
  };

  const onEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="mx-4 mb-5 mt-2 flex flex-col gap-2 relative z-20">
      {/* Image Preview */}
      {imagePreview && (
        <div className="relative inline-block ml-2">
          <img src={imagePreview} alt="preview" className="h-20 w-auto rounded-xl object-contain border border-gray-600/50" />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-400 shadow-md"
          >
            <BsX size={14} />
          </button>
        </div>
      )}

      {/* Input Row */}
      <div className="flex items-center gap-3">
        {/* Emoji Button */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setShowEmojis(!showEmojis)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/60 border border-gray-600/40 text-blue-400 hover:text-cyan-400 hover:bg-gray-700/60 transition-all"
          >
            <BsEmojiSmile className="text-lg" />
          </button>
          {showEmojis && (
            <div className="absolute bottom-14 left-0 shadow-2xl rounded-2xl overflow-hidden z-50">
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                theme="dark"
                height={380}
                width={320}
              />
            </div>
          )}
        </div>

        {/* Image Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-800/60 border border-gray-600/40 text-blue-400 hover:text-cyan-400 hover:bg-gray-700/60 transition-all"
        >
          <BsImage className="text-lg" />
        </button>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        {/* Text Input + Send */}
        <form className="flex-1 flex items-center gap-2" onSubmit={handleSubmit}>
          <input
            type="text"
            className="flex-1 glass-input py-3 px-5 rounded-full font-medium text-sm"
            placeholder="Send a message..."
            value={message}
            onChange={handleMessageChange}
          />
          <button
            type="submit"
            disabled={loading}
            className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            {loading ? (
              <div className="loading loading-spinner loading-sm text-white"></div>
            ) : (
              <BsSend className="text-white text-base ml-0.5" />
            )}
          </button>
        </form>
      </div>
    </div>
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
