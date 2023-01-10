import { atom } from "recoil";
import { v4 } from "uuid";

import { defaultNickname } from "../../constants";
import { IUser } from "../../types/user";

export const userAtom = atom<IUser>({
  key: "user-atom",
  default: {
    id: v4(),
    nickname: defaultNickname,
    startAt: Date.now(),
  },
});
