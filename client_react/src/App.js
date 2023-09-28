import { useState } from "react";

import Room from "./Components/Room";
import useSocket from "./hooks/useSocket";
import Modal_createRoom from "./Components/Modal_createRoom";
import Modal_joinRoom from "./Components/Modal_joinRoom";
import useCreateRoom from "./hooks/useCreateRoom";
import useJoinRoom from "./hooks/useJoinRoom";

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
  const { isRoomJoinModal, setIsRoomJoinModal } = useJoinRoom();
  return (
    <div className="App">
      <h1>정문기입과 함께하는 캐치마인드</h1>
      <span>{connected ? "온라인" : "오프라인"}</span>
      <h3>ROOMS</h3>
      <button onClick={() => setIsRoomCreateModal(!isRoomCreateModal)}>
        방 만들기
      </button>
      <button onClick={() => setIsRoomJoinModal(!isRoomJoinModal)}>
        방 참가하기
      </button>

      <ul className="room_list">
        {rooms.length == 0
          ? "방이 없습니다"
          : rooms.map((room) => (
              <Room
                key={room.id}
                title={room.title}
                current={room.count}
                isPlaying={room.is_playing}
                limit={room.maximum}
              ></Room>
            ))}
      </ul>

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
          onPressConfirm={() => {
            setIsRoomJoinModal(false);
          }}
        ></Modal_joinRoom>
      )}
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
