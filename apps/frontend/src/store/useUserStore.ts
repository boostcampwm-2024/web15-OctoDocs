import { create } from "zustand";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";

import { getRandomColor, getRandomHexString } from "@/lib/utils";

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
  provider: new SocketIOProvider(
    import.meta.env.VITE_WS_URL,
    `users`,
    new Y.Doc(),
    {
      autoConnect: true,
      disableBc: false,
    },
    {
      reconnectionDelayMax: 10000,
      timeout: 5000,
      transports: ["websocket", "polling"],
    },
  ),
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
