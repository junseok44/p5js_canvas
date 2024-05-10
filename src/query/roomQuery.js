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
    // const userCount = await redisClient.SCARD(`room:${room.code}:users`);

    const userCount = await redisClient.get(`room:${room.code}:count`);

    room.currentUserCount = userCount;

    const status = await redisClient.get(`room:${room.code}:game`);

    room.status = status || ROOM_STATUS.WAITING;
  }

  return rooms;
};

const createRoom = async (title, maximum, password) => {
  // FIXME 임시로 만들어둔것. 나중에 삭제.
  const wordBooks = await prisma.wordBook.findMany();

  const newRoom = await prisma.room.create({
    data: {
      title: title,
      ...(maximum && { maximum: maximum }),
      ...(password && { password: password }),
      wordbook: {
        connect: wordBooks,
      },
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

const getWordsOfRoom = async (roomCode) => {
  const wordBooks = await prisma.wordBook.findMany({
    where: {
      rooms: {
        some: {
          code: roomCode,
        },
      },
    },
    select: {
      words: true,
    },
  });

  const words = [];

  for (const rem of wordBooks) {
    for (const w of rem.words) {
      words.push(w.word);
    }
  }

  return words;
};

export {
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoom,
  getRoomByCode,
  getWordsOfRoom,
};
