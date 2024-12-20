import { create } from "zustand";
import { SocketIOProvider } from "y-socket.io";

type ConnectionStatus = "disconnected" | "connecting" | "connected";

interface ConnectionState {
  mindmap: {
    provider: SocketIOProvider | null;
    connectionStatus: ConnectionStatus;
  };
  editor: {
    provider: SocketIOProvider | null;
    connectionStatus: ConnectionStatus;
  };
  user: {
    provider: SocketIOProvider | null;
    connectionStatus: ConnectionStatus;
  };
}

interface ConnectionActions {
  setProvider: (
    type: keyof ConnectionState,
    provider: SocketIOProvider,
  ) => void;
  setConnectionStatus: (
    type: keyof ConnectionState,
    status: ConnectionStatus,
  ) => void;
}

const useConnectionStore = create<ConnectionState & ConnectionActions>(
  (set) => ({
    mindmap: {
      provider: null,
      connectionStatus: "disconnected",
    },
    editor: {
      provider: null,
      connectionStatus: "disconnected",
    },
    user: {
      provider: null,
      connectionStatus: "disconnected",
    },
    setProvider: (type, provider) =>
      set((state) => ({
        [type]: {
          ...state[type],
          provider,
        },
      })),
    setConnectionStatus: (type, status) =>
      set((state) => ({
        [type]: {
          ...state[type],
          connectionStatus: status,
        },
      })),
  }),
);

export default useConnectionStore;
