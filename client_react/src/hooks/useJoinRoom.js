import React, { useState } from "react";

const useJoinRoom = () => {
  const [isRoomJoinModal, setIsRoomJoinModal] = useState(false);

  return { isRoomJoinModal, setIsRoomJoinModal };
};

export default useJoinRoom;
