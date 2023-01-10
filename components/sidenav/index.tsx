import { Avatar, Button, Input, Modal, Text } from "@nextui-org/react";
import { useState } from "react";
import { useRecoilState } from "recoil";

import { userAtom } from "../../recoil/atoms/user";

const SideNav = () => {
  const [user, setUser] = useRecoilState(userAtom);

  const [visibleNicknameModal, setVisibleNicknameModal] = useState(false);
  const [changeNickname, setChangeNickname] = useState(user.nickname);

  const handleModalClose = () => {
    setVisibleNicknameModal(false);
  };

  const handleChangeNickname = () => {
    if (changeNickname.length < 2) return;

    setUser({
      ...user,
      nickname: changeNickname,
    });

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
            color={changeNickname.length < 2 ? "error" : "primary"}
            helperText={"닉네임은 최소 2글자 이상으로 지정해야합니다."}
            size="lg"
            placeholder={user.nickname}
            onChange={(e) => {
              setChangeNickname(e.target.value);
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button auto onPress={handleChangeNickname}>
            저장
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SideNav;
