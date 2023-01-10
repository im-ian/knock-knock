import { Text } from "@nextui-org/react";
import { Setting, Star, Voice2 } from "react-iconly";

import { IconTypes } from "../../types/socket";

interface NoticeProps {
  icon?: IconTypes;
  message: string;
}

export const iconMap: Record<IconTypes, JSX.Element> = {
  notice: (
    <Voice2
      set={"bold"}
      size={"small"}
      style={{ verticalAlign: "text-bottom", marginRight: "0.2rem" }}
    />
  ),
  system: (
    <Setting
      set={"bold"}
      size={"small"}
      style={{ verticalAlign: "text-bottom", marginRight: "0.2rem" }}
    />
  ),
  event: (
    <Star
      set={"bold"}
      size={"small"}
      style={{ verticalAlign: "text-bottom", marginRight: "0.2rem" }}
    />
  ),
};

const Notice = ({ icon, message }: NoticeProps) => {
  return (
    <div
      style={{
        padding: "1.5rem",
        backgroundColor: "var(--nextui-colors-accents2)",
        borderRadius: "var(--nextui-radii-lg)",
        textAlign: "center",
        justifyContent: "center",
      }}
    >
      {icon && iconMap[icon]}
      <Text as={"span"} css={{ lineHeight: "19px" }}>
        {message}
      </Text>
    </div>
  );
};

export default Notice;
