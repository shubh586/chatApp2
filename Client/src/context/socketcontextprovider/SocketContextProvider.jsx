import { createContext, useEffect, useRef } from "react";
import { useAppStore } from "@/store";
import { io } from "socket.io-client";
import { HOST } from "@/utils/constant";

export const SocketContext = createContext(null);
// eslint-disable-next-line react/prop-types
const SocketContextProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo } = useAppStore();
  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        transports: ["websocket", "polling"],
        query: { userId: userInfo.id },
      });

      const handleRecieveMessage = (message) => {
        const { selectChatData, selectChatType, addMessage,addContactsInDMContacts } =
          useAppStore.getState();

        if (
          selectChatType !== undefined &&
          (selectChatData._id === message.sender._id ||
            selectChatData._id === message.recipient._id)
        ) {
          {
            // console.log("message received", message);
            addMessage(message);
          }
        }
        addContactsInDMContacts(message)
      };

      const handleReceivedChannelMessage = (message) => {
        const { selectChatData, selectChatType, addMessage,addChannelInChannelList } =
          useAppStore.getState();
        if (
          selectChatType !== undefined &&
          selectChatData._id === message.channelId
        ) {
          //console.log("channel message received", message);
          addMessage(message);
        }
        addChannelInChannelList(message);
      };


      socket.current.on("receivedmessage", handleRecieveMessage);
      socket.current.on(
        "recieve-channel-message",
        handleReceivedChannelMessage
      );
      socket.current.on("connect", () => {
        //console.log("Clinet is connected");
      });
      
      return () => {
        socket.current.disconnect();
      };
    }
  }, [userInfo]);
  const value = {
    socket: socket.current,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export default SocketContextProvider;
