import { useEffect } from "react";
import useSocket from "../hooks/useSocket";

export default function Home() {
  const { isConnected, socketId } = useSocket({
    onMessage: (message) => {
      console.log(message);
    },
  });

  return (
    <>
      <h2>socket id: {socketId}</h2>
    </>
  );
}
