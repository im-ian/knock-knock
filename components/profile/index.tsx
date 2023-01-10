import { Avatar, Button, Input, Modal, Text } from "@nextui-org/react";
import { useState } from "react";
import { useRecoilState } from "recoil";

import { userAtom } from "../../recoil/atoms/user";

interface ProfileProps {
  onChangeNickname: (nickname: string) => void;
}

const Profile = ({ onChangeNickname }: ProfileProps) => {
  const [user, setUser] = useRecoilState(userAtom);

  const [visibleNicknameModal, setVisibleNicknameModal] = useState(false);
  const [changeNickname, setChangeNickname] = useState(user.nickname);

  const isValidNickname =
    changeNickname.length >= 2 && changeNickname.length <= 10;

  const handleModalClose = () => {
    setVisibleNicknameModal(false);
  };

  const handleChangeNickname = () => {
    if (!isValidNickname) {
      setChangeNickname(user.nickname);
      return;
    }

    setUser({
      ...user,
      nickname: changeNickname,
    });

    onChangeNickname(changeNickname);
    handleModalClose();
  };

  return (
    <>
      <Avatar
        text={user.nickname}
        onClick={() => {
          setVisibleNicknameModal(true);
        }}
      />

      <Modal
        aria-labelledby="modal-title"
        open={visibleNicknameModal}
        onClose={handleModalClose}
      >
        <Modal.Header>
          <Text size={18}>닉네임 변경</Text>
        </Modal.Header>
        <Modal.Body css={{ paddingBottom: "1.5rem" }}>
          <Input
            bordered
            fullWidth
            color={isValidNickname ? "primary" : "error"}
            helperText={
              !isValidNickname
                ? "닉네임은 최소 2글자 이상, 10글자 이하로 지정해야합니다."
                : ""
            }
            size="lg"
            placeholder={user.nickname}
            onChange={(e) => {
              setChangeNickname(e.target.value);
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            auto
            disabled={!isValidNickname}
            onPress={handleChangeNickname}
          >
            저장
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Profile;
