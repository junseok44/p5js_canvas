import React from "react";
import Modal_content from "./Modal_content";
import Modal_overlay from "./Modal_overlay";
import { Box, Button, Typography } from "@mui/material";
import Modal_Input from "./Modal_Input";

const Modal_createRoom = ({
  onPressCancel,
  onPressConfirm,
  roomForm,
  setRoomForm,
}) => {
  const isRoomPublic = roomForm.roomPublic;
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (name === "roomPublic") {
      const isPublic = value === "true"; // 문자열 "true"를 불리언으로 변환
      setRoomForm({
        ...roomForm,
        [name]: isPublic,
      });
    } else {
      setRoomForm({
        ...roomForm,
        [name]: value,
      });
    }
  };

  return (
    <Modal_overlay>
      <Modal_content>
        <Typography variant="h4" sx={{ mb: 1 }}>
          방 만들기 {roomForm.roomPublic}
        </Typography>
        <Modal_Input
          label="방 제목"
          type="text"
          placeholder="방 제목"
          name="roomTitle"
          value={roomForm.roomTitle}
          onChange={handleChange}
        ></Modal_Input>
        <Modal_Input
          label="최대 인원"
          type="radio"
          name="roomMax"
          value={roomForm.roomMax}
          onChange={handleChange}
          radioValues={[4, 8]}
          radioLabels={["4명", "8명"]}
        ></Modal_Input>
        <Modal_Input
          label="방 공개여부"
          type="radio"
          name="roomPublic"
          value={roomForm.roomPublic}
          onChange={handleChange}
          radioValues={[true, false]}
          radioLabels={["공개", "비공개"]}
        ></Modal_Input>
        {!isRoomPublic && (
          <>
            <input
              type="password"
              placeholder="비밀번호"
              name="roomPassword"
              value={roomForm.roomPassword}
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="비밀번호 확인"
              name="roomPasswordCheck"
              value={roomForm.roomPasswordCheck}
              onChange={handleChange}
            />
          </>
        )}
        <Box sx={{ mb: 1 }}></Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button color="error" variant={"outlined"} onClick={onPressCancel}>
            취소
          </Button>
          <Button variant={"outlined"} onClick={onPressConfirm}>
            확인
          </Button>
        </Box>
      </Modal_content>
    </Modal_overlay>
  );
};

export default Modal_createRoom;
