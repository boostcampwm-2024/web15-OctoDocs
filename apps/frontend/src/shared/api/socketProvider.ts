import { SocketIOProvider } from "y-socket.io";
import * as Y from "yjs";

export const createSocketIOProvider = (roomname: string, ydoc: Y.Doc) => {
  return new SocketIOProvider(
    import.meta.env.VITE_WS_URL,
    roomname,
    ydoc,
    {
      autoConnect: true,
      disableBc: false,
    },
    {
      reconnectionDelayMax: 10000,
      timeout: 5000,
      transports: ["websocket", "polling"],
    },
  );
};
