import { NextApiRequest } from "next";
import { Server } from "socket.io";

import { defaultNickname } from "../../constants";
import { NextApiResponseWithSocket, SocketMessage } from "../../types/socket";

export const config = {
  api: {
    bodyParser: false,
  },
};

const api = async (_: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    console.log("✅ New Socket.io server...");

    const clients: Record<string, string> = {};

    const io = new Server(res.socket.server, {
      path: "/api/socket",
    });

    io.on("connection", (socket) => {
      console.log("✅ New connection:", socket.id);

      clients[socket.id] = defaultNickname;

      socket.on("message", (message: SocketMessage) => {
        if (
          message.type === "info" &&
          message.payload.key === "change-nickname"
        ) {
          clients[message.payload.value.socketId] =
            message.payload.value.nickname;
        }

        socket.broadcast.emit("message", message);
      });

      socket.on("disconnect", () => {
        console.log("❌ Disconnected:", socket.id);
        delete clients[socket.id];
      });

      // socket.on("input-change", (msg) => {
      //   socket.broadcast.emit("update-input", msg);
      // });
    });

    res.socket.server.io = io;
  }

  res.end();
};

export default api;
