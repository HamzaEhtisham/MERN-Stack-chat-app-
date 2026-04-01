import useConversation from "../../zustand/useConversation";
import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";
import useGlobalSocketListeners from "../../hooks/useGlobalSocketListeners";

const Home = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  useGlobalSocketListeners();

  return (
    <div className="flex h-full w-full overflow-hidden bg-transparent animate-fade-in relative">
      {/* Sidebar - Chat List View */}
      <div 
        className={`h-full bg-slate-950/40 backdrop-blur-3xl border-r border-white/5 transition-all duration-500 ease-in-out
          ${selectedConversation ? 'hidden md:flex md:w-[380px]' : 'w-full md:w-[380px] flex'}`}
      >
        <Sidebar hideSidebar={() => setSelectedConversation(null)} />
      </div>
      
      {/* Message Area - Active Chat View */}
      <div 
        className={`flex-1 h-full relative z-10 overflow-hidden 
          ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}
      >
        <MessageContainer />
      </div>
    </div>
  );
};

export default Home;


