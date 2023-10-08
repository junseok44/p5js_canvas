const connection = require("../db.js");

const getAllRoomsQuery = "SELECT * FROM rooms;";

const updateRoomQuery = (id, increment, isStarted) => {
  const queries = [];

  if (increment !== undefined && increment !== null) {
    queries.push(`count = count + ${increment}`);
  }

  if (isStarted !== undefined && isStarted !== null) {
    queries.push(`isStarted = ${isStarted}`);
  }

  return `UPDATE rooms SET ${queries} WHERE roomCode = '${id}'`;
};

const getRoomQuery = (id) => {
  return `SELECT * FROM rooms WHERE id = '${id}'`;
};

const deleteRoomQuery = (id) => {
  return `DELETE FROM rooms WHERE roomCode = '${id}'`;
};

const getRoomQueryByCode = (roodCode) => {
  return `SELECT * FROM rooms WHERE roomCode = '${roodCode}'`;
};

const createRoomQuery = (title, maximum, is_public) => {
  return `INSERT INTO rooms (title, maximum, isPublic) VALUES ('${title}', ${maximum}, ${is_public});`;
};

const deleteRoom = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(deleteRoomQuery(id), (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

const updateRoom = (id, increment, isStarted) => {
  return new Promise((resolve, reject) => {
    connection.query(
      updateRoomQuery(id, increment, isStarted),
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
};

const getAllRooms = () => {
  return new Promise((resolve, reject) => {
    connection.query(getAllRoomsQuery, (err, result, fields) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

const createRoom = (title, maximum, is_public) => {
  return new Promise((resolve, reject) => {
    connection.query(
      createRoomQuery(title, maximum, is_public),
      (err, result, fields) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
};

const getRoom = (roomId) => {
  return new Promise((resolve, reject) => {
    connection.query(getRoomQuery(roomId), (err, result) => {
      if (err) reject(err);
      if (result) resolve(result[0]);
      else resolve(null);
    });
  });
};

const getRoomByCode = (roomCode) => {
  return new Promise((resolve, reject) => {
    connection.query(getRoomQueryByCode(roomCode), (err, result) => {
      if (err) reject(err);
      if (result) resolve(result[0]);
      else resolve(null);
    });
  });
};

module.exports = {
  getAllRoomsQuery,
  createRoomQuery,
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoom,
  getRoomByCode,
};
