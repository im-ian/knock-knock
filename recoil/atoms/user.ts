import { atom } from "recoil";
import { v4 } from "uuid";

import { IUser } from "../../types/user";

export const userAtom = atom<IUser>({
  key: "user",
  default: {
    id: v4(),
    nickname: "익명",
    startAt: Date.now(),
  },
});
