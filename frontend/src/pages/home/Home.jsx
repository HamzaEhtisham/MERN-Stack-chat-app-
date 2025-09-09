import { useState } from "react";
import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";
import MobileMenuButton from "../../components/sidebar/MobileMenuButton";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-[90vh] md:h-[85vh] rounded-xl overflow-hidden bg-gray-900/70 bg-clip-padding backdrop-filter backdrop-blur-md shadow-xl border border-gray-700/50">
      <div className={`sidebar transition-transform duration-300 ${!isSidebarOpen ? 'transform -translate-x-full md:translate-x-0' : ''}`}>
        <Sidebar />
      </div>
      <div className="flex-1 relative">
        <MessageContainer />
      </div>
      <MobileMenuButton onClick={toggleSidebar} />
    </div>
  );
};


export default Home;
