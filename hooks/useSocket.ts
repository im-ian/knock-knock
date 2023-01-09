import { useEffect, useRef, useState } from "react";
import SocketIOClient from "socket.io-client";

import { SocketMessage } from "../types/socket";
import { Socket } from "socket.io";

interface UseSocketProps {
  onConnect?: () => void;
  onMessage?: (message: SocketMessage) => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

const useSocket = ({
  onConnect,
  onMessage,
  onDisconnect,
  onError,
}: UseSocketProps) => {
  const [connected, setConnected] = useState(false);
  const socketClient = useRef<Socket>();

  useEffect(() => {
    if (connected || socketClient.current) return;

    const client = SocketIOClient("http://localhost:3000", {
      path: "/api/socket",
    });

    client.on("connect", () => {
      onConnect && onConnect();
      socketClient.current = client as any;
      setConnected(true);
    });

    client.on("test", () => client.emit("test"));

    client.on("message", (message) => onMessage && onMessage(message));

    client.on("disconnect", () => onDisconnect && onDisconnect());

    client.on("error", (error: Error) => onError && onError(error));

    () => client.disconnect();
  }, [connected, onConnect, onMessage, onDisconnect, onError]);

  return { isConnected: connected, socket: socketClient.current };
};

export default useSocket;
