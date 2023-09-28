import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import { useEffect, useState } from "react";
import { socketState } from "../state/socket";
import { setRecoil } from "recoil-nexus";
let src = "http://localhost:8080/lobby";

export default (setRooms) => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let socket = io(src);
    setRecoil(socketState, io(src));

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("create_room", (room) => {
      setRooms((rooms) => [...rooms, room]);
    });

    socket.on("update_rooms", (data) => {
      setRooms(data);
    });
    return () => socket.disconnect();
  }, [setRooms]);

  return { connected };
};
