import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

const useListenTyping = () => {
    const { socket } = useSocketContext();
    const { setIsTyping, selectedConversation } = useConversation();

    useEffect(() => {
        if (!socket) return;

        socket.on("typing", ({ senderId }) => {
            if (selectedConversation && selectedConversation._id === senderId) {
                setIsTyping(true);
            }
        });

        socket.on("stopTyping", ({ senderId }) => {
            if (selectedConversation && selectedConversation._id === senderId) {
                setIsTyping(false);
            }
        });

        return () => {
            socket.off("typing");
            socket.off("stopTyping");
        };
    }, [socket, selectedConversation, setIsTyping]);
};

export default useListenTyping;
