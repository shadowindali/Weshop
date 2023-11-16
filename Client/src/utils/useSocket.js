import { useContext, useEffect } from "react";
import io from "socket.io-client";
import { useChat } from "../components/chatContext";

let socket;

const useSocket = () => {
  const { chatMessages, setChatMessages } = useChat();

  useEffect(() => {
    socket = io.connect(`${import.meta.env.VITE_API_URL}`);
  }, []);

  const handleReceiveMessage = (data) => {
    setChatMessages((chatMessages) => [...chatMessages, data.message]);
  };

  useEffect(() => {
    socket.on("receive message", handleReceiveMessage);

    return () => {
      // Clean up the event listener when the component unmounts.
      socket.off("receive message", handleReceiveMessage);
    };
  }, []);

  const emitEvent = (eventName, data) => {
    socket.emit(eventName, data);
  };

  return { emitEvent };
};

export default useSocket;
