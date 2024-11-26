import { useEffect, useState } from "react";
import { SocketIOProvider } from "y-socket.io";

import { useUserStore } from "@/entities/user/model";

export const useEditor = (provider: SocketIOProvider) => {
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);

  const { currentUser } = useUserStore();

  useEffect(() => {
    provider.awareness.setLocalStateField("user", {
      name: currentUser.clientId,
      color: currentUser.color,
    });
  }, [currentUser]);

  return {
    openNode,
    openColor,
    openLink,
    setOpenNode,
    setOpenColor,
    setOpenLink,
  };
};
