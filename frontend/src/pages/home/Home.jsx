import { useState } from "react";
import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";
import GroupChatModal from "../../components/sidebar/GroupChatModal";

const Home = () => {
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

    return (
        <div className='flex h-screen w-screen rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
            <Sidebar openGroupModal={() => setIsGroupModalOpen(true)} />
            <MessageContainer />
            {isGroupModalOpen && <GroupChatModal onClose={() => setIsGroupModalOpen(false)} />}
        </div>
    );
};

export default Home;