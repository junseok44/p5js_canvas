import React from "react";
import Modal_content from "./Modal_content";
import Modal_overlay from "./Modal_overlay";
import Box from "./Box";

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
        <h1>방 만들기 {roomForm.roomPublic}</h1>

        <Box>
          <label>방 제목</label>
          <input
            type="text"
            placeholder="방 제목"
            name="roomTitle"
            value={roomForm.roomTitle}
            onChange={handleChange}
          />
        </Box>

        <Box>
          <label>최대 인원</label>
          <input
            type="radio"
            placeholder="4명"
            name="roomMax"
            value={4}
            onChange={handleChange}
            defaultChecked
          />
          4명
          <input
            type="radio"
            placeholder="8명"
            name="roomMax"
            value={8}
            onChange={handleChange}
          />
          8명
        </Box>
        <Box>
          <label>방 공개여부</label>
          <input
            type="radio"
            name="roomPublic"
            value={true}
            onChange={handleChange}
            defaultChecked
          />
          공개
          <input
            type="radio"
            name="roomPublic"
            value={false}
            onChange={handleChange}
          />
          비공개
        </Box>
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
        <Box>
          <button onClick={onPressCancel}>취소</button>
          <button onClick={onPressConfirm}>확인</button>
        </Box>
      </Modal_content>
    </Modal_overlay>
  );
};

export default Modal_createRoom;
