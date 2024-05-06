import React from "react";
import "./reset.css";
import { useState } from "react";
import Room from "./Components/Room";
import useSocket from "./hooks/useSocket";
import Modal_createRoom from "./Components/Modal_createRoom";
import Modal_joinRoom from "./Components/Modal_joinRoom";
import useCreateRoom from "./hooks/useCreateRoom";
import useJoinRoom from "./hooks/useJoinRoom";
import { Helmet } from "react-helmet";
import { Box, Typography, Button, Container } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import List from "@mui/material/List";
import { useReport } from "./hooks/useReport";
import Modal_report from "./Components/Modal_report";

export default () => {
  const [rooms, setRooms] = useState([]);
  const { connected } = useSocket(setRooms);
  const {
    isRoomCreateModal,
    roomForm,
    setIsRoomCreateModal,
    setRoomForm,
    submitForm,
  } = useCreateRoom();
  const {
    isRoomJoinModal,
    roomCode,
    setIsRoomJoinModal,
    joinRoom,
    setRoomCode,
  } = useJoinRoom();

  const {
    isReportModal,
    onPressCancel,
    onPressConfirm,
    onPressReport,
    report,
    onChangeReport,
  } = useReport();

  return (
    <div className="App">
      <Helmet>
        <title>캐치마인드 with p5.js</title>
      </Helmet>
      <Container maxWidth="sm" sx={{ mt: 2 }}>
        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
          <Typography
            sx={{
              fontSize: 30,
              fontWeight: "bold",
              color: "#3f51b5",
            }}
          >
            캐치마인드 with p5.js
          </Typography>
          <Typography sx={{ mb: 0.7 }}>
            {connected ? "온라인" : "오프라인"}
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}></Box>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              onClick={() => setIsRoomCreateModal(!isRoomCreateModal)}
            >
              방 만들기
            </Button>
            <Button
              variant="outlined"
              onClick={() => setIsRoomJoinModal(!isRoomJoinModal)}
            >
              방 참가하기
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
            }}
          >
            <Button variant="outlined" onClick={onPressReport} color={"error"}>
              피드백
            </Button>
            <a
              href="https://github.com/junseok44/p5js_canvas"
              target="_blank"
              style={{ cursor: "pointer " }}
            >
              <GitHubIcon></GitHubIcon>
            </a>
          </Box>
        </Box>
        <Box sx={{ mb: 2 }}></Box>

        <h3>방 목록</h3>
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            maxHeight: 370,
            overflow: "auto",
          }}
        >
          {!connected
            ? "로딩중..."
            : rooms.length == 0
            ? "방이 없습니다"
            : rooms
                .sort((a, b) => {
                  const dateA = new Date(a.createdAt);
                  const dateB = new Date(b.createdAt);

                  return dateB.getTime() - dateA.getTime();
                })
                .map((room) => (
                  <Room
                    key={room.id}
                    title={room.title}
                    초
                    current={room.currentUserCount}
                    status={room.status}
                    limit={room.maximum}
                    code={room.code}
                  ></Room>
                ))}
        </List>

        {isRoomCreateModal && (
          <Modal_createRoom
            onPressCancel={() => setIsRoomCreateModal(false)}
            onPressConfirm={submitForm}
            roomForm={roomForm}
            setRoomForm={setRoomForm}
          ></Modal_createRoom>
        )}
        {isRoomJoinModal && (
          <Modal_joinRoom
            onPressCancel={() => setIsRoomJoinModal(false)}
            roomCode={roomCode}
            setRoomCode={setRoomCode}
            onPressConfirm={() => {
              joinRoom(roomCode);
              setIsRoomJoinModal(false);
            }}
          ></Modal_joinRoom>
        )}
        {isReportModal && (
          <Modal_report
            onPressCancel={onPressCancel}
            onPressConfirm={onPressConfirm}
            report={report}
            onChangeReport={onChangeReport}
          ></Modal_report>
        )}
      </Container>
    </div>
  );
};
