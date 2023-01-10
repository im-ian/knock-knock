import { Avatar, Badge, Card, Grid, Text } from "@nextui-org/react";

import { IUser } from "../../types/user";

interface PostProps {
  isRead: boolean;
  user: IUser;
  message: string;
  time: number;
}

const Post = ({ isRead, user: { nickname }, message, time }: PostProps) => {
  return (
    <Card variant={isRead ? "bordered" : "flat"} css={{ width: "100%" }}>
      <Card.Header>
        <Avatar text={nickname} />
        <Grid.Container css={{ pl: "$6" }}>
          <Grid xs={12}>
            <Text h5 css={{ marginBottom: 0 }}>
              {nickname}
            </Text>
          </Grid>
          <Grid xs={12}>
            <Text css={{ color: "$accents8", fontSize: "0.8rem" }}>
              {new Date(time).toLocaleString()}
            </Text>
          </Grid>
        </Grid.Container>
      </Card.Header>
      <Card.Body css={{ paddingTop: "0.5rem", paddingBottom: "1.2rem" }}>
        <Text>{message}</Text>
      </Card.Body>
      <Card.Divider />
      <Card.Footer>
        <Badge>신규</Badge>
      </Card.Footer>
    </Card>
  );
};

export default Post;
