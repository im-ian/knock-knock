import { Avatar, Grid, Input } from "@nextui-org/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { v4 } from "uuid";
import update from "immutability-helper";

import useSocket from "../hooks/useSocket";
import { NoticeEvent, PostEvent, SocketMessage } from "../types/socket";
import { useRecoilValue } from "recoil";
import { userAtom } from "../recoil/atoms/user";
import Head from "next/head";

import Post from "../components/timeline/post";
import Notice from "../components/timeline/notice";
import Profile from "../components/profile";
import { TimeCircle } from "react-iconly";

export default function Main() {
  const isActiveRef = useRef(true);
  const [timeline, setTimeline] = useState<(PostEvent | NoticeEvent)[]>([]);
  const timelineSet = useRef<Set<string>>(new Set());
  const [isFocusInput, setIsFocusInput] = useState(false);

  const user = useRecoilValue(userAtom);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([
    user.nickname,
  ]);

  const [uploadTimer, setUploadTimer] = useState<NodeJS.Timer>();

  const { socket } = useSocket({
    onMessage: (message) => {
      if (message.type === "post") {
        if (timelineSet.current.has(message.payload.id)) return;

        setTimeline((prev) => [
          ...prev,
          update(message, {
            payload: {
              isRead: {
                $set: isActiveRef.current,
              },
            },
          }),
        ]);

        timelineSet.current.add(message.payload.id);

        setTimeout(() => {
          document.body.scrollTop = document.body.scrollHeight;
        }, 100);
        return;
      }

      if (message.type === "notice") {
        if (timelineSet.current.has(message.payload.id)) return;

        setTimeline((prev) => [...prev, message]);
        timelineSet.current.add(message.payload.id);
        return;
      }

      if (message.type === "info") {
        if (message.payload.key === "connected-users") {
          setConnectedUsers(Object.values(message.payload.value));
        }
      }
    },
  });

  const handleSendMessage = (message: string) => {
    if (socket) {
      socket.send({
        type: "post",
        payload: {
          id: v4(),
          user,
          message,
          isRead: false,
          time: Date.now(),
        },
      } satisfies SocketMessage);

      setUploadTimer(
        setTimeout(() => {
          setUploadTimer(undefined);
        }, 500)
      );
    }
  };

  const handleChangeNickname = (nickname: string) => {
    if (socket) {
      socket.send({
        type: "notice",
        payload: {
          id: v4(),
          icon: "system",
          message: `${user.nickname}님이 ${nickname}으로 닉네임을 변경하였습니다.`,
          time: Date.now(),
        },
      } satisfies SocketMessage);

      socket.send({
        type: "info",
        payload: {
          key: "change-nickname",
          value: {
            socketId: socket.id,
            nickname,
          },
        },
      } satisfies SocketMessage);
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
          position: "sticky",
          top: 0,
          backdropFilter: "blur(10px)",
          zIndex: 10,
        }}
      >
        <Grid.Container
          gap={0}
          css={{
            padding: "1rem",
          }}
        >
          <Grid xs={4}>
            <Avatar.Group count={connectedUsers.length}>
              {connectedUsers.map((name, index) => (
                <Avatar key={index} text={name} stacked />
              ))}
            </Avatar.Group>
          </Grid>
          <Grid></Grid>
        </Grid.Container>
      </div>
      <div style={{ padding: "1.5rem", overflowY: "scroll" }}>
        {timeline.map(({ type, payload }) => {
          return (
            <div
              key={payload.id}
              className={"socket-contents"}
              style={{ marginBottom: "1rem" }}
            >
              {type === "post" && <Post {...payload} />}
              {type === "notice" && <Notice {...payload} />}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "sticky",
          bottom: 0,
          backdropFilter: "blur(10px)",
          zIndex: 10,
        }}
      >
        <Grid.Container
          gap={0}
          css={{
            padding: "1rem",
          }}
        >
          {!isFocusInput && (
            <Grid xs={2}>
              <Profile onChangeNickname={handleChangeNickname} />
            </Grid>
          )}
          <Grid xs={isFocusInput ? 12 : 10}>
            <Input
              css={{
                width: "100%",
                backgroundColor: "var(--nextui-colors-accents2)",
              }}
              onFocus={() => setIsFocusInput(true)}
              onBlur={() => setIsFocusInput(false)}
              contentRight={uploadTimer ? <TimeCircle /> : undefined}
              placeholder={
                uploadTimer
                  ? "도배 방지를 위해 잠시만 기다려주세요."
                  : "이 곳에 입력해주세요."
              }
              onKeyUp={(e) => {
                if (uploadTimer) return;

                const value = e.currentTarget.value;
                if (!value) return;

                if (e.key === "Enter") {
                  handleSendMessage(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
          </Grid>
        </Grid.Container>
      </div>
    </>
  );
}
