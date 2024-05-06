import React, { useState } from "react";

const useJoinRoom = () => {
  const [isRoomJoinModal, setIsRoomJoinModal] = useState(false);

  const [roomCode, setRoomCode] = useState("");

  const joinRoom = (code) => {
    window.location.href = `/room/${code}`;
  };

  return {
    isRoomJoinModal,
    setIsRoomJoinModal,
    joinRoom,
    setRoomCode,
    roomCode,
  };
};

export default useJoinRoom;
