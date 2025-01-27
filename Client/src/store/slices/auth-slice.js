export const createAuthSlice = (set) => ({
  userInfo: undefined,
  setUserInfo: (userInfo) => set(() => ({ userInfo })),
});

// export const createAuthSlice = (set) => ({
//   userInfo: undefined,
//   setUserInfo: (userInfo) => set({ userInfo }),
// });
