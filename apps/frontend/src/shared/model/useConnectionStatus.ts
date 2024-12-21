import useConnectionStore, {
  type ConnectionStatus,
} from "./useConnectionStore";
import { usePageStore } from "@/entities/page";

export const useConnectionStatus = (): ConnectionStatus => {
  const { canvas, editor, user } = useConnectionStore();
  const { currentPage } = usePageStore();

  if (
    (currentPage &&
      canvas.connectionStatus === "connected" &&
      editor.connectionStatus === "connected" &&
      user.connectionStatus === "connected") ||
    (!currentPage &&
      canvas.connectionStatus === "connected" &&
      user.connectionStatus === "connected")
  ) {
    return "connected";
  }

  if (
    canvas.connectionStatus === "connecting" ||
    editor.connectionStatus === "connecting" ||
    user.connectionStatus === "connecting"
  ) {
    return "connecting";
  }

  return "disconnected";
};
