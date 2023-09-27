import { useState, useEffect } from "react";
import Room from "./Components/Room";
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const temp_room_data = [
  {
    title: "room1",
    is_playing: false,
    current: 1,
    full: 8,
  },

  {
    title: "room2",
    is_playing: false,
    current: 1,
    full: 8,
  },
  {
    title: "room3",
    is_playing: true,
    current: 1,
    full: 8,
  },
];

let src = "http://localhost:8080/lobby";
let socket = io(src);

export default () => {
  const [rooms, setRooms] = useState([]);

  return (
    <div className="App">
      <h1>정문인과 함께하는 캐치마인드</h1>
      <h3>ROOMS</h3>
      <button>방 만들기</button>
      <button>방 참가하기</button>
      <div className="room_list">
        {temp_room_data.map((room) => (
          <Room
            title={room.title}
            current={room.current}
            isPlaying={room.is_playing}
            limit={room.full}
          ></Room>
        ))}
      </div>
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
