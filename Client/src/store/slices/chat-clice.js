export const createChatSlice = (set, get) => ({
  selectChatType: undefined,
  selectChatData: undefined,
  selectChatMessages: [],
  setSelectChatType: (selectChatType) => set({ selectChatType }),
  setSelectChatData: (selectChatData) => set({ selectChatData }),
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
              : message.recipient._id,
          sender:
            state.selectChatType === "channel"
              ? message.sender
              : message.sender._id,
        },
      ];
      console.log(newState);
      return { selectChatMessages: newState };
    });
  },
});
