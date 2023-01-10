import type { Server as HTTPServer } from "http";
import type { NextApiResponse } from "next";
import type { Socket as NetSocket } from "net";
import type { Server as IOServer } from "socket.io";

import { IUser } from "./user";

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

export interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

type EventTypes = "post" | "like" | "comment";

export interface ISocket<
  T extends EventTypes,
  P extends Record<string, unknown>
> {
  type: T;
  payload: P;
}

export type PostEvent = ISocket<
  "post",
  {
    id: string;
    user: IUser;
    message: string;
    isRead: boolean;
    time: number;
  }
>;

export type LikeEvent = ISocket<
  "like",
  {
    user: IUser;
    postId: string;
  }
>;

export type CommentEvent = ISocket<
  "comment",
  {
    postId: string;
    user: IUser;
    message: string;
    time: number;
  }
>;

export type SocketMessage = PostEvent | LikeEvent | CommentEvent;
