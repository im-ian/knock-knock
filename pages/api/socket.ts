import { NextApiRequest } from "next";
import { Server } from "socket.io";

import { NextApiResponseWithSocket } from "../../types/socket";

export const config = {
  api: {
    bodyParser: false,
  },
};

const api = async (_: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    console.log("✅ New Socket.io server...");

    const io = new Server(res.socket.server, {
      path: "/api/socket",
    });

    console.log(io);

    io.on("connection", (socket) => {
      console.log("✅ New connection:", socket.id);

      // socket.on("input-change", (msg) => {
      //   socket.broadcast.emit("update-input", msg);
      // });
    });

    res.socket.server.io = io;
  }

  res.end();
};

export default api;
