import { getAllRooms, createRoom } from "../query/roomQuery.js";

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
