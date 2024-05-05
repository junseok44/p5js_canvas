import { httpServer } from "./app.js";
import { sessionMiddleware } from "./session.js";
import { Server as SocketIoServer } from "socket.io";
import setupRoomSocket from "./socket/room.js";
import setupLobbySocket from "./socket/lobby.js";

let io = new SocketIoServer(httpServer, {
  cors: {
    origin: [
      "http://ec2-3-35-48-144.ap-northeast-2.compute.amazonaws.com",
      "http://127.0.0.1:8080",
      "http://127.0.0.1:3000",
    ],
    methods: ["GET", "POST"],
  },
});

io.engine.use(sessionMiddleware);

const room = io.of("/rooms");
const lobby = io.of("/lobby");

// roomCode -> [session1, session2, ...]
let roomCodetoSessionMap = new Map();
// roomCode -> {status: "waiting" | "playing", time: 20}
let roomCodeToGameMap = new Map();

setupRoomSocket(room);
setupLobbySocket(lobby);

export { io, room, lobby, roomCodetoSessionMap, roomCodeToGameMap };
