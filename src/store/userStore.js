import { create } from 'zustand';

const useUserStore = create((set) => ({
  user: null,
  users: [],
  messages: [],
  currentChatUser: null,
  notifications: [],
  setUser: (user) => set({ user }),
  setUsers: (users) => set({ users }),
  setCurrentChatUser: (chatUser) => set({ currentChatUser: chatUser }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  addNotification: (notif) => set((state) => ({ notifications: [...state.notifications, notif] })),
}));
export default useUserStore;
