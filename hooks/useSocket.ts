import { useEffect, useRef, useState } from "react";
import SocketIOClient from "socket.io-client";

import { Message } from "../types/socket";

interface UseSocketProps {
  onConnect?: () => void;
  onMessage?: (message: Message) => void;
  onDisconnect?: () => void;
}

const useSocket = ({ onConnect, onMessage, onDisconnect }: UseSocketProps) => {
  const [connected, setConnected] = useState(false);
  const socketId = useRef<string>();

  useEffect(() => {
    const socket = SocketIOClient("ws://localhost:3000", {
      path: "/api/socket",
    });

    socket.on("connect", () => {
      onConnect && onConnect();
      socketId.current = socket.id;
      setConnected(true);
    });

    socket.on("message", (message) => onMessage && onMessage(message));

    socket.on("disconnect", () => onDisconnect && onDisconnect());

    socket.on("error", (error) => console.log(error));

    () => socket.disconnect();
  }, [onConnect, onMessage, onDisconnect]);

  return { isConnected: connected, socketId: socketId.current };
};

export default useSocket;
