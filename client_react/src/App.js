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

import List from "@mui/material/List";

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

  return (
    <div className="App">
      <Helmet>
        <title>캐치마인드 with p5.js</title>
        <meta property="og:title" content={"캐치마인드 with p5.js"} />
        <meta
          name="description"
          content="시험공부하기 싫은 당신, 캐치마인드 한접시 어떠세요"
        />
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
        <Box sx={{ display: "flex", gap: 1 }}>
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
        <Box sx={{ mb: 2 }}></Box>

        <h3>방 목록</h3>
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            maxHeight: 350,
            overflow: "auto",
          }}
        >
          {!connected
            ? "로딩중..."
            : rooms.length == 0
            ? "방이 없습니다"
            : rooms.map((room) => (
                <Room
                  key={room.id}
                  title={room.title}
                  current={room.count}
                  isStarted={room.isStarted}
                  limit={room.maximum}
                  code={room.roomCode}
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
      </Container>
    </div>
  );
};

// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
