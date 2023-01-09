import {
  Avatar,
  Badge,
  Card,
  Grid,
  Input,
  Loading,
  Text,
} from "@nextui-org/react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import useSocket from "../hooks/useSocket";
import { PostEvent, SocketMessage } from "../types/socket";
import useLocalStorage from "../hooks/useLocalStorage";
import { TimeCircle } from "react-iconly";

export default function Main() {
  const [posts, setPosts] = useState<PostEvent[]>([]);
  const [nickname] = useLocalStorage("nickname", "익명");
  const [uploadTimer, setUploadTimer] = useState<NodeJS.Timer>();

  const { isConnected, socket } = useSocket({
    onMessage: (message) => {
      if (message.type === "post") {
        setPosts((prev) => [message, ...prev]);
      }
    },
  });

  const handleSendMessage = (message: string) => {
    if (socket) {
      socket.send({
        type: "post",
        payload: {
          id: uuidv4(),
          user: nickname,
          message,
          time: Date.now(),
        },
      } satisfies SocketMessage);

      setUploadTimer(
        setTimeout(() => {
          setUploadTimer(undefined);
        }, 10000)
      );
    }
  };

  return (
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
              ? "업로드 후 10초 동안은 업로드할 수 없어요."
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
        {posts.map(({ payload }) => {
          const { user, message, time } = payload;

          return (
            <Card
              key={time}
              variant={"bordered"}
              css={{ width: "100%", marginBottom: "1rem" }}
            >
              <Card.Header>
                <Avatar text={user} />
                <Grid.Container css={{ pl: "$6" }}>
                  <Grid xs={12}>
                    <Text h5 css={{ marginBottom: 0 }}>
                      {user}
                    </Text>
                  </Grid>
                  <Grid xs={12}>
                    <Text css={{ color: "$accents8", fontSize: "0.8rem" }}>
                      {new Date(time).toLocaleString()}
                    </Text>
                  </Grid>
                </Grid.Container>
              </Card.Header>
              <Card.Body
                css={{ paddingTop: "0.5rem", paddingBottom: "1.2rem" }}
              >
                <Text>{payload.message}</Text>
              </Card.Body>
              <Card.Divider />
              <Card.Footer>
                <Badge>인기</Badge>
              </Card.Footer>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
