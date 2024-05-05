import { getAllRooms, createRoom, getRoom } from "../query/roomQuery.js";

export default function setupLobbySocket(lobby) {
  lobby.on("connection", (socket) => {
    getAllRooms().then((result) => {
      socket.emit("update_rooms", result);
    });

    socket.on("create_room", async (data) => {
      const result = await createRoom(
        data.roomTitle,
        data.roomMax,
        data.roomPublic
      );

      const newRoom = await getRoom(result.insertId);
      lobby.emit("create_room", newRoom);
    });

    socket.on("delete_room", () => {});
  });
}
