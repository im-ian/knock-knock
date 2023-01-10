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

export type EventTypes = "notice" | "info" | "post" | "like" | "comment";

export type IconTypes = "notice" | "system" | "event";

export interface ISocket<
  T extends EventTypes,
  P extends Record<string, unknown>
> {
  type: T;
  payload: P;
}

export type NoticeEvent = ISocket<
  "notice",
  {
    id: string;
    icon: IconTypes;
    message: string;
    time: number;
  }
>;

export type IInfoEvent<
  T extends {
    key: string;
    value: unknown;
  }
> = ISocket<"info", T>;

export type ConnectedUsersInfoEvent = IInfoEvent<{
  key: "connected-users";
  value: Record<string, string>;
}>;

export type ChangeNicknameInfoEvent = IInfoEvent<{
  key: "change-nickname";
  value: {
    socketId: string;
    nickname: string;
  };
}>;

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

export type SocketMessage =
  | NoticeEvent
  | ConnectedUsersInfoEvent
  | ChangeNicknameInfoEvent
  | PostEvent
  | LikeEvent
  | CommentEvent;
