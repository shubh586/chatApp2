import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "sonner";
import Contact_container from "./components/contact-container/Contact_container";
import Empty_chat_container from "./components/empty-chat-container/Empty_chat_container";
import Chat_container from "./components/chat-container/chat_container";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const { userInfo, selectChatType,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress
   } = useAppStore();
  const navigate = useNavigate();

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      {
        isUploading && (<div className="fixed top-0 left-0 bg-black/50 w-full h-full flex flex-col justify-center items-center z-1000 backdrop-blur-lg">
          <h2 className="text-5xl animate-pulse">Uploading Files</h2>
          {fileUploadProgress}%
        </div>)
      }
      {
        isDownloading && (<div className="fixed top-0 left-0 bg-black/50 w-full h-full flex flex-col justify-center items-center z-1000 backdrop-blur-lg">
          <h2 className="text-5xl animate-pulse">Downloading Files</h2>
          {fileDownloadProgress}%
        </div>)
      }
     
      

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
