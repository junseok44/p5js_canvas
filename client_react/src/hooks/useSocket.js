import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { socketState } from "../state/socket";
import { setRecoil } from "recoil-nexus";
let src = "http://localhost:8080/lobby";

export default (setRooms) => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let socket = io(src);
    setRecoil(socketState, socket);

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("create_room", (room) => {
      setRooms((rooms) => [room, ...rooms]);
    });

    socket.on("update_rooms", (data) => {
      console.log(data);
      setRooms(data);
    });
    return () => socket.disconnect();
  }, [setRooms]);

  return { connected };
};
