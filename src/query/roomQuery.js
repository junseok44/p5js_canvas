const connection = require("../db.js");

const getAllRoomsQuery = "SELECT * FROM rooms;";

const getRoomQuery = (id) => {
  return `SELECT * FROM rooms WHERE id = ${id}`;
};

const createRoomQuery = (title, maximum, is_public) => {
  return `INSERT INTO rooms (title, maximum, isPublic) VALUES ('${title}', ${maximum}, ${is_public});`;
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
      resolve(result[0]);
    });
  });
};

module.exports = {
  getAllRoomsQuery,
  createRoomQuery,
  getAllRooms,
  createRoom,
  getRoom,
};
