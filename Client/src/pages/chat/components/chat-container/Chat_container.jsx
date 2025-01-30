import ChatHeader from "./components/chat-header/ChatHeader";
import MessageBar from "./components/message-bar/MessageBar";

const Chat_container = () => {
  return (
    <div className="top-0 md:static fixed flex flex-col md:flex-1 bg-[#1c1d25] w-[100vw] h-[100vh]">
      <ChatHeader />
      <MessageComponents />
      <MessageBar />
    </div>
  );
};

export default Chat_container;
