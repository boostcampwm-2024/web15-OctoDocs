import { create } from "zustand";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";

import { getRandomColor, getRandomHexString } from "@/lib/utils";
import { createSocketIOProvider } from "@/lib/socketProvider";

export interface User {
  clientId: string;
  color: string;
  currentPageId: string | null;
}

interface UserStore {
  provider: SocketIOProvider;
  users: User[];
  currentUser: User;
  setUsers: (users: User[]) => void;
  setCurrentUser: (user: User) => void;
}

const useUserStore = create<UserStore>((set) => ({
  provider: createSocketIOProvider("users", new Y.Doc()),
  users: [],
  currentUser: {
    clientId: getRandomHexString(10),
    color: getRandomColor(),
    currentPageId: null,
  },
  setUsers: (users: User[]) => set({ users }),
  setCurrentUser: (user: User) => set({ currentUser: user }),
}));

export default useUserStore;
