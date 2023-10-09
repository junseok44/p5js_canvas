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
      setRooms(data);
    });

    socket.on("update_room", (room) => {
      console.log("updating room" + room);
      setRooms((rooms) => rooms.map((r) => (r.id === room.id ? room : r)));
    });

    socket.on("delete_room", (roomCode) => {
      console.log(roomCode);
      setRooms((rooms) => rooms.filter((r) => r.roomCode !== roomCode));
    });

    return () => socket.disconnect();
  }, [setRooms]);

  return { connected };
};
