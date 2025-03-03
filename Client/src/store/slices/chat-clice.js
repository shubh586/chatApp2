export const createChatSlice = (set, get) => ({
  selectChatType: undefined,
  selectChatData: undefined,
  selectChatMessages: [],
  directMessagesContacts: [],
  setSelectChatType: (selectChatType) => set({ selectChatType }),
  setSelectChatData: (selectChatData) => set({ selectChatData }),
  setSelectChatMessages: (selectChatMessages)=>set({selectChatMessages}),
  setDirectMessagesContacts:(directMessagesContacts)=>set({directMessagesContacts}),
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
