import { useState } from "react";
import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="chat-container relative rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Chat Area */}
      <div className="messages-container relative">
        {/* Mobile toggle button */}
        <button
          className="absolute top-2 left-2 md:hidden p-2 bg-gray-700 text-white rounded"
          onClick={() => setIsSidebarOpen(true)}
        >
          ☰
        </button>
        <MessageContainer />
      </div>

      {/* Overlay when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Home;
