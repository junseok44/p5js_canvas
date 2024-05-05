import { prisma } from "../db.js";

const deleteRoom = (id) => {
  return prisma.room.delete({
    where: {
      id: id,
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

const getAllRooms = () => {
  return prisma.room.findMany();
};

const createRoom = (title, maximum, password) => {
  return prisma.room.create({
    data: {
      title: title,
      ...(maximum && { maximum: maximum }),
      ...(password && { password: password }),
    },
  });
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
