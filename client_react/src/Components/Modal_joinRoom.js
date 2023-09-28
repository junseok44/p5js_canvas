import React from "react";
import Modal_content from "./Modal_content";
import Modal_overlay from "./Modal_overlay";
import Box from "./Box";
const Modal_joinRoom = ({ onPressCancel, onPressConfirm }) => {
  return (
    <Modal_overlay>
      <Modal_content>
        <h1>방 참가하기</h1>
        <input type="text" placeholder="방 초대코드" />

        <Box>
          <button onClick={onPressCancel}>취소</button>
          <button onClick={onPressConfirm}>확인</button>
        </Box>
      </Modal_content>
    </Modal_overlay>
  );
};

export default Modal_joinRoom;
