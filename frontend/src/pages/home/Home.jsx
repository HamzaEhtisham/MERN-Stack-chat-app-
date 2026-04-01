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
    <div className="flex h-screen w-full overflow-hidden bg-transparent animate-fade-in">
      <div 
        className={`sidebar h-full z-20 bg-slate-950/40 backdrop-blur-3xl border-r border-white/5 transition-all duration-500 ease-in-out 
          ${!isSidebarOpen ? 'w-0 -translate-x-full md:w-[380px] md:translate-x-0' : 'w-full md:w-[380px] translate-x-0'}`}
      >
        <Sidebar hideSidebar={() => setIsSidebarOpen(false)} />
      </div>
      
      <div className="flex-1 h-full relative z-10">
        <MessageContainer />
      </div>

      <div className="md:hidden">
        <MobileMenuButton onClick={toggleSidebar} isOpen={isSidebarOpen} />
      </div>
    </div>
  );
};

export default Home;

