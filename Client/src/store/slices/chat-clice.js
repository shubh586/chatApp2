


export const createChatSlice = (set, get) => ({
  selectChatType: undefined,
  selectChatData: undefined,
  selectChatMessages: [],
  directMessagesContacts: [],
  isUploading: false,
  isDownloading:false,
  fileUploadProgress:0,
  fileDownloadProgress:0,
  channel:[],

  setChannel:(channel)=>set({channel}),
  setIsUploading:(isUploading)=>set({isUploading}),
  setIsDownloading:(isDownloading)=>set({isDownloading}),
  setFileDownloadProgress:(fileDownloadProgress)=>set({fileDownloadProgress}),
  setFileUploadProgress:(fileUploadProgress)=>set({fileUploadProgress}),
  setSelectChatType: (selectChatType) => set({ selectChatType }),
  setSelectChatData: (selectChatData) => set({ selectChatData }),
  setSelectChatMessages: (selectChatMessages)=>set({selectChatMessages}),
  setDirectMessagesContacts:(directMessagesContacts)=>set({directMessagesContacts}),
  addChannel:(channel)=>{
   set((state)=>{
    const newChannel=[...state.channel,channel];
    return {channel:newChannel}
   })
  },

  closeChat: () =>
    set({
      selectChatData: undefined,
      selectChatType: undefined,
      selectChatMessages: [],
    }),
 
  addMessage: (message) => {
    set((state) => {
      const newState = [
        ...state.selectChatMessages,  

        {
          ...message,
          recipient:
            state.selectChatType === "channel"
              ? message.recipient
              : message.recipient._id?message.recipient._id:message.recipient,
          sender:
            state.selectChatType === "channel"
              ? message.sender
              : message.sender._id?message.sender._id:message.sender,
        },
      ];
      console.log(newState);
      return { selectChatMessages: newState };
    });
  },
});
