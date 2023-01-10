import { Input } from "@nextui-org/react";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { TimeCircle } from "react-iconly";
import { v4 as uuidv4 } from "uuid";
import update from "immutability-helper";

import useSocket from "../hooks/useSocket";
import {
  EventTypes,
  NoticeEvent,
  PostEvent,
  SocketMessage,
} from "../types/socket";
import { useRecoilValue } from "recoil";
import { userAtom } from "../recoil/atoms/user";
import Head from "next/head";

import Post from "../components/timeline/post";
import Notice from "../components/timeline/notice";

export default function Main() {
  const isActiveRef = useRef(true);
  const [timeline, setTimeline] = useState<(PostEvent | NoticeEvent)[]>([]);
  const timelineSet = useRef<Set<string>>(new Set());

  const user = useRecoilValue(userAtom);

  const [uploadTimer, setUploadTimer] = useState<NodeJS.Timer>();

  const { isConnected, socket } = useSocket({
    onMessage: (message) => {
      if (message.type === "post") {
        if (timelineSet.current.has(message.payload.id)) return;

        setTimeline((prev) =>
          [
            update(message, {
              payload: {
                isRead: {
                  $set: isActiveRef.current,
                },
              },
            }),
            ...prev,
          ].sort((a, b) => b.payload.time - a.payload.time)
        );

        timelineSet.current.add(message.payload.id);
        return;
      }

      if (message.type === "notice") {
      }
    },
  });

  const handleSendMessage = (message: string) => {
    if (socket) {
      socket.send({
        type: "post",
        payload: {
          id: uuidv4(),
          user,
          message,
          isRead: false,
          time: Date.now(),
        },
      } satisfies SocketMessage);

      setUploadTimer(
        setTimeout(() => {
          setUploadTimer(undefined);
        }, 3000)
      );
    }
  };

  useEffect(() => {
    const handleBlur = () => {
      isActiveRef.current = false;
    };

    window.addEventListener("blur", handleBlur);

    const handleFocus = () => {
      isActiveRef.current = true;

      setTimeline((prev) =>
        prev.map((post) => {
          if (post.type !== "post" || post.payload.isRead) return post;

          return update(post, {
            payload: {
              isRead: {
                $set: true,
              },
            },
          });
        })
      );
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const unreadCount = useMemo(() => {
    return timeline.filter(
      (post) => post.type === "post" && !post.payload.isRead
    ).length;
  }, [timeline]);

  return (
    <>
      <Head>
        <title>
          {unreadCount
            ? `${unreadCount}개의 읽지 않은 포스트가 있습니다.`
            : "낙낙"}
        </title>
      </Head>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          overflow: "hidden",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            marginBottom: "1rem",
          }}
        >
          <Input
            css={{
              width: "100%",
            }}
            contentRight={uploadTimer ? <TimeCircle /> : undefined}
            placeholder={
              uploadTimer
                ? "업로드 후 3초 동안은 업로드할 수 없어요."
                : "이 곳에 입력해주세요."
            }
            onKeyUp={(e) => {
              if (uploadTimer) return;

              const value = e.currentTarget.value;
              if (!value) return;

              if (e.key === "Enter") {
                handleSendMessage(e.currentTarget.value);
                e.currentTarget.value = "";
                e.currentTarget.blur();
              }
            }}
          />
        </div>
        <div style={{ flex: 1, padding: "1.5rem" }}>
          {timeline.map(({ type, payload }) => {
            return (
              <div key={payload.id} style={{ marginBottom: "1rem" }}>
                {type === "post" && <Post {...payload} />}
                {type === "notice" && <Notice {...payload} />}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
