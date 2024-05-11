import React, { useState } from "react";
import { socketState } from "../state/socket";
import { useRecoilValue } from "recoil";

const useCreateRoom = () => {
  const [isRoomCreateModal, setIsRoomCreateModal] = useState(false);
  const [roomForm, setRoomForm] = useState({
    roomTitle: "",
    wordBookIds: [],
  });
  const socket = useRecoilValue(socketState);

  const submitForm = () => {
    if (roomForm.roomTitle == "" || roomForm.roomTitle.length > 15) {
      alert("방 제목은 1자 이상 15자 이하로 입력해주세요.");
      return;
    }
    햣;
    if (roomForm.wordBookIds.length == 0) {
      alert("단어장을 선택해주세요.");
      return;
    }

    // 여기서 이제 쿼리를 보낸다.
    socket.emit("create_room", roomForm);

    setRoomForm({
      roomTitle: "",
      wordBookIds: [],
    });

    setIsRoomCreateModal(false);
  };

  return {
    isRoomCreateModal,
    setIsRoomCreateModal,
    roomForm,
    setRoomForm,
    submitForm,
  };
};

export default useCreateRoom;
