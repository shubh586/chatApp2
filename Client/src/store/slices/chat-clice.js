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
});
