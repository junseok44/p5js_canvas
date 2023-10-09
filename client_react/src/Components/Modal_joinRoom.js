import React from "react";
import Modal_content from "./Modal_content";
import Modal_overlay from "./Modal_overlay";
import { Box, Button } from "@mui/material";
import { Typography } from "@mui/material";
const Modal_joinRoom = ({
  onPressCancel,
  onPressConfirm,
  roomCode,
  setRoomCode,
}) => {
  return (
    <Modal_overlay>
      <Modal_content>
        <Typography variant="h4" sx={{ mb: 1 }}>
          방 참가하기
        </Typography>
        <input
          type="text"
          placeholder="방 초대코드"
          value={roomCode}
          onChange={(e) => {
            setRoomCode(e.target.value);
          }}
        />
        <Box sx={{ mb: 1 }}></Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button color="error" variant="outlined" onClick={onPressCancel}>
            취소
          </Button>
          <Button variant="outlined" onClick={onPressConfirm}>
            확인
          </Button>
        </Box>
      </Modal_content>
    </Modal_overlay>
  );
};

export default Modal_joinRoom;
