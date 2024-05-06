import { ROOM_STATUS } from "../constants/status.js";
import { prisma } from "../db.js";
import { onCreateRoomRedis, onDeleteRoomRedis } from "../redis/roomQuery.js";
import { redisClient } from "../redis_client.js";

const deleteRoom = async (code) => {
  await onDeleteRoomRedis(code);
  await prisma.room.delete({
    where: {
      code: code,
    },
  });
};

const updateRoom = (id, increment) => {
  return prisma.room.update({
    where: {
      id: id,
    },
    data: {
      currentUserCount: {
        increment: increment,
      },
    },
  });
};

const getAllRooms = async () => {
  const rooms = await prisma.room.findMany();

  for (const room of rooms) {
    const userCount = await redisClient.SCARD(`room:${room.code}:users`);
    room.currentUserCount = userCount;
    room.status =
      (await redisClient.get(`room:${room.code}:status`)) ||
      ROOM_STATUS.WAITING;
  }

  return rooms;
};

const createRoom = async (title, maximum, password) => {
  const newRoom = await prisma.room.create({
    data: {
      title: title,
      ...(maximum && { maximum: maximum }),
      ...(password && { password: password }),
    },
  });

  await onCreateRoomRedis(newRoom.code);

  newRoom.status = ROOM_STATUS.WAITING;
  newRoom.currentUserCount = 0;

  return newRoom;
};

const getRoom = (roomId) => {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
  });
};

const getRoomByCode = (roomCode) => {
  return prisma.room.findFirst({
    where: {
      code: roomCode,
    },
  });
};

export {
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoom,
  getRoomByCode,
};
