import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "sonner";
import Contact_container from "./components/contact-container/Contact_container";
import Empty_chat_container from "./components/empty-chat-container/Empty_chat_container";
import Chat_container from "./components/chat-container/chat_container";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const { userInfo, selectChatType } = useAppStore();
  const navigate = useNavigate();

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      <Contact_container />
      {selectChatType === undefined ? (
        <Empty_chat_container />
      ) : (
        <Chat_container />
      )}
    </div>
  );
};

export default Chat;
