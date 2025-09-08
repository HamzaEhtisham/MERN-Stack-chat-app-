import { useState } from "react";
import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 relative">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Chat area */}
      <div className="flex-1 relative">
        {/* Mobile menu button */}
        <button
          className="absolute top-2 left-2 md:hidden p-2 bg-gray-700 text-white rounded"
          onClick={() => setIsSidebarOpen(true)}
        >
          ☰
        </button>
        <MessageContainer />
      </div>
    </div>
  );
};
export default Home;
