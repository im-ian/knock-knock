import { NextApiRequest } from "next";
import { Server } from "socket.io";
import { v4 } from "uuid";

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
      socket.broadcast.emit("message", {
        type: "notice",
        payload: {
          id: v4(),
          icon: "system",
          message: "익명의 사용자가 접속하셨습니다.",
          time: Date.now(),
        },
      } satisfies SocketMessage);

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

      setInterval(() => {
        console.log(clients);
        socket.broadcast.emit("message", {
          type: "info",
          payload: {
            key: "connected-users",
            value: clients,
          },
        } satisfies SocketMessage);
      }, 5000);

      // socket.on("input-change", (msg) => {
      //   socket.broadcast.emit("update-input", msg);
      // });
    });

    res.socket.server.io = io;
  }

  res.end();
};

export default api;
