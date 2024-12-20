import { create } from "zustand";

import { getRandomColor, getRandomHexString } from "@/shared/lib";

export interface User {
  clientId: string;
  color: string;
  currentPageId: string | null;
}

interface UserStore {
  users: User[];
  currentUser: User;
  setUsers: (users: User[]) => void;
  setCurrentUser: (user: User) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  currentUser: {
    clientId: getRandomHexString(10),
    color: getRandomColor(),
    currentPageId: null,
  },
  setUsers: (users: User[]) => set({ users }),
  setCurrentUser: (user: User) => set({ currentUser: user }),
}));
