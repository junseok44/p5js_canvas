import { ROOM_STATUS } from "../constants/status.js";
import { prisma } from "../db.js";
import { onCreateRoomRedis, onDeleteRoomRedis } from "../redis/roomQuery.js";
import { redisClient } from "../redis_client.js";

// ok
const deleteRoom = async (code) => {
  await onDeleteRoomRedis(code);
  await prisma.room.delete({
    where: {
      code: code,
    },
  });
};

// ok
const getAllRooms = async () => {
  try {
    const rooms = await prisma.room.findMany();

    for (const room of rooms) {
      // const userCount = await redisClient.SCARD(`room:${room.code}:users`);

      const userCount = await redisClient.get(`room:${room.code}:count`);

      room.currentUserCount = userCount;

      const status = await redisClient.get(`room:${room.code}:game`);

      room.status = status || ROOM_STATUS.WAITING;
    }

    return rooms;
  } catch (err) {
    console.log(err);
    return [];
  }
};

// ok
const createRoom = async (title, wordBookIds) => {
  try {
    const wordBooks = await prisma.wordBook.findMany({
      where: {
        id: {
          in: wordBookIds,
        },
      },
    });

    if (wordBooks.length === 0) {
      return null;
    }

    const newRoom = await prisma.room.create({
      data: {
        title: title,
        wordbook: {
          connect: wordBooks,
        },
      },
    });

    await onCreateRoomRedis(newRoom.code);

    newRoom.status = ROOM_STATUS.WAITING;
    newRoom.currentUserCount = 0;

    return newRoom;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// ok.
const getRoomByCode = async (roomCode) => {
  try {
    const room = await prisma.room.findFirst({
      where: {
        code: roomCode,
      },
    });

    return room;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// ok
const getWordsOfRoom = async (roomCode) => {
  try {
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
  } catch (err) {
    console.log(err);
    return [];
  }
};

export { getAllRooms, createRoom, deleteRoom, getRoomByCode, getWordsOfRoom };
