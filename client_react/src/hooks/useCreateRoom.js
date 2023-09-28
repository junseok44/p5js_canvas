import React, { useState } from "react";
import { socketState } from "../state/socket";
import { useRecoilValue } from "recoil";

const useCreateRoom = () => {
  const [isRoomCreateModal, setIsRoomCreateModal] = useState(false);
  const [roomForm, setRoomForm] = useState({
    roomTitle: "",
    roomMax: 4,
    roomPublic: true,
    roomPassword: "",
    roomPasswordCheck: "",
  });
  const socket = useRecoilValue(socketState);

  const submitForm = () => {
    setIsRoomCreateModal(false);

    if (roomForm.roomTitle == "" || roomForm.roomTitle.length > 15) return;

    // 여기서 이제 쿼리를 보낸다.
    socket.emit("create_room", roomForm);
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
