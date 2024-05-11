import React, { useEffect } from "react";
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
  const [isLoading, setIsLoading] = React.useState(false);

  const [wordBookList, setWordBookList] = React.useState([]); // 단어 목록

  const getWordBookList = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/words");
      const data = await response.json();
      setWordBookList(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getWordBookList();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setRoomForm({
      ...roomForm,
      [name]: value,
    });
  };

  const handleRadioChange = (e) => {
    const newWordBookIds = roomForm.wordBookIds.includes(e)
      ? roomForm.wordBookIds.filter((id) => id !== e)
      : [...roomForm.wordBookIds, e];

    console.log(newWordBookIds);
    setRoomForm({
      ...roomForm,
      wordBookIds: newWordBookIds,
    });
  };

  return (
    <Modal_overlay>
      <Modal_content>
        <Typography variant="h4" sx={{ mb: 1 }}>
          방 만들기
        </Typography>
        <Modal_Input label="방 제목">
          <input
            type={"text"}
            placeholder="방 제목"
            name="roomTitle"
            value={roomForm.roomTitle}
            onChange={handleChange}
          />
        </Modal_Input>
        <Modal_Input label="단어집 선택">
          {!isLoading &&
            wordBookList.map((wordBook) => (
              <div key={wordBook.id}>
                <input
                  type="checkbox"
                  name="action"
                  value={wordBook.id}
                  checked={roomForm.wordBookIds.includes(wordBook.id)}
                  onChange={(e) => handleRadioChange(wordBook.id)}
                ></input>
                <label>{wordBook.title}</label>
              </div>
            ))}
        </Modal_Input>

        <Box sx={{ mb: 1 }}></Box>
        {!isLoading && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button color="error" variant={"outlined"} onClick={onPressCancel}>
              취소
            </Button>
            <Button variant={"outlined"} onClick={onPressConfirm}>
              확인
            </Button>
          </Box>
        )}
      </Modal_content>
    </Modal_overlay>
  );
};

export default Modal_createRoom;
