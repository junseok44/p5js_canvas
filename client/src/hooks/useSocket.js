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
      console.log(data);
      setRooms(data);
    });

    socket.on("update_room", (room) => {
      setRooms((rooms) => {
        return rooms.map((r) =>
          r.code === room.code
            ? {
                ...r,
                currentUserCount:
                  room.currentUserCount != null &&
                  room.currentUserCount != undefined
                    ? Number(room.currentUserCount)
                    : r.currentUserCount,
                status: room.status || r.status,
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
