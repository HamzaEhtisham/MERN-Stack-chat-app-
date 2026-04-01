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
    <div className="flex flex-col mx-2 md:mx-4 mb-3 md:mb-5 mt-1 md:mt-2 gap-2 relative z-20">
      {/* Image Preview */}
      {imagePreview && (
        <div className="relative inline-block ml-4 self-start bg-slate-800/80 backdrop-blur-xl p-2 rounded-2xl shadow-xl border border-white/10 ring-1 ring-cyan-500/20">
          <img src={imagePreview} alt="preview" className="h-[90px] md:h-[120px] w-auto rounded-xl object-contain" />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute -top-3 -right-3 bg-red-500 rounded-full p-1.5 md:p-2 text-white hover:bg-red-400 shadow-xl transition-all hover:scale-110 active:scale-90"
          >
            <BsX size={18} />
          </button>
        </div>
      )}

      {/* Text Input + Send */}
      <form className="flex-1 flex items-center gap-1 md:gap-2 w-full" onSubmit={handleSubmit}>
        
        <button
           type="button"
           onClick={() => fileInputRef.current?.click()}
           className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-white/5 rounded-2xl transition-all flex-shrink-0"
           title="Upload Image"
        >
           <BsImage size={20} className="md:w-[22px] md:h-[22px]" />
        </button>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        <div className="relative flex-1 min-w-0">
          <input
            type="text"
            className="w-full glass-input py-3 md:py-3.5 px-4 md:px-6 rounded-full font-medium text-[14px] md:text-[15px] xl:text-base text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500/50 shadow-inner"
            placeholder="Message..."
            value={message}
            onChange={handleMessageChange}
          />
          {/* Emoji Picker Integration */}
          <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 flex items-center h-full">
            <button
              type="button"
              onClick={() => setShowEmojis(!showEmojis)}
              className="text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer p-1"
              title="Emojis"
            >
              <BsEmojiSmile size={18} className="md:w-5 md:h-5" />
            </button>
            {showEmojis && (
              <div className="absolute bottom-14 right-0 shadow-[0_15px_50px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden z-[100] border border-white/10">
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  theme="dark"
                  height={window.innerWidth < 400 ? 350 : 400}
                  width={window.innerWidth < 400 ? window.innerWidth - 40 : 320}
                />
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={(!message.trim() && !imageFile) || loading}
          className={`w-11 h-11 md:w-12 md:h-12 xl:w-14 xl:h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ml-0.5 md:ml-1 flex-shrink-0
            ${(!message.trim() && !imageFile) ? "bg-white/5 text-slate-500 cursor-not-allowed" : "bg-gradient-to-tr from-cyan-500 to-blue-500 text-white hover:shadow-cyan-500/30 hover:scale-[1.05] active:scale-95"}`}
        >
          {loading ? (
            <span className="loading loading-spinner text-white loading-sm"></span>
          ) : (
            <BsSend className="text-lg md:text-xl xl:text-2xl mr-0.5 md:mr-1" />
          )}
        </button>
      </form>
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
