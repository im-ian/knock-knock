import {
  Avatar,
  Badge,
  Card,
  Grid,
  Input,
  Loading,
  Text,
} from "@nextui-org/react";

import useSocket from "../hooks/useSocket";
import { Message } from "../types/socket";
import { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export default function Main() {
  const [history, setHistory] = useState<Message[]>([]);
  const [nickname] = useLocalStorage("nickname", "익명");

  const { isConnected, socket } = useSocket({
    onMessage: (message) => {
      setHistory((prev) => [message, ...prev]);
    },
  });

  const handleSendMessage = (message: string) => {
    if (socket) {
      socket.send({
        user: nickname,
        payload: {
          message,
        },
        time: Date.now(),
      } satisfies Message);
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage(e.currentTarget.value);
            }
          }}
        />
      </div>
      <div style={{ flex: 1, padding: "1.5rem" }}>
        {history.map(({ user, payload, time }) => {
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
