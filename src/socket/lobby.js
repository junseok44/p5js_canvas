import { ROOM_STATUS } from "../constants/status.js";
import { getAllRooms, createRoom, getRoom } from "../query/roomQuery.js";
import { onCreateRoomRedis } from "../redis/roomQuery.js";
import { redisClient } from "../redis_client.js";

export default function setupLobbySocket(lobby) {
  lobby.on("connection", async (socket) => {
    const rooms = await getAllRooms();
    socket.emit("update_rooms", rooms);

    socket.on("create_room", async (data) => {
      try {
        const newRoom = await createRoom(data.roomTitle, data.wordBookIds);
        if (newRoom === null) {
          return;
        }
        lobby.emit("create_room", newRoom);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("delete_room", () => {});
  });
}
