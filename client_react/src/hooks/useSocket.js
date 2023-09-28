import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import { useEffect, useState } from "react";
let src = "http://localhost:8080/lobby";

export default (setRooms) => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let socket = io(src);

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("update_rooms", (data) => {
      console.log(data);
      setRooms(data);
    });
    return () => socket.disconnect();
  }, [setRooms]);

  return { connected };
};
