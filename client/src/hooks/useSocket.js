import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { socketState } from "../state/socket";
import { setRecoil } from "recoil-nexus";

let src = "/lobby";

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
      console.log(room.code, room.currentUserCount);

      setRooms((rooms) => {
        return rooms.map((r) =>
          r.code == room.code
            ? {
                ...r,
                currentUserCount: Number(room.currentUserCount),
              }
            : r
        );
      });
    });

    socket.on("delete_room", (roomCode) => {
      setRooms((rooms) => rooms.filter((r) => r.code !== roomCode));
    });

    return () => socket.disconnect();
  }, [setRooms]);

  return { connected };
};
