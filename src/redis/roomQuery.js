import { ROOM_STATUS } from "../constants/status.js";
import { redisClient } from "../redis_client.js";

/*
현재 저장된 redis key
room:${roomCode}:count
room:${roomCode}:game

room:${roomCode}:hostId

room:${roomCode}:users
room:${roomCode}:user_names
room:${roomCode}:points

*/

export async function getUserListOfRoom(roomCode) {
  // 해야할것은, roomCode를 인자로 받아서 해당 roomCode의 user_names를 가져와야한다.
  // 그리고 point도 가져와야 함.

  try {
    const [sessions, usernames, points] = await Promise.all([
      redisClient.SMEMBERS(`room:${roomCode}:users`),
      redisClient.HGETALL(`room:${roomCode}:user_names`),
      redisClient.HGETALL(`room:${roomCode}:points`),
    ]);

    const users = sessions.map((session) => {
      return {
        id: session,
        username: usernames[session],
        point: points[session],
      };
    });

    return users;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function onUserJoinRoomRedis(roomCode, sessionId, username) {
  try {
    const [cnt, _, _t] = await Promise.all([
      redisClient.INCR(`room:${roomCode}:count`),
      redisClient.HSET(`room:${roomCode}:user_names`, sessionId, username),
      redisClient.SADD(`room:${roomCode}:users`, sessionId),
    ]);

    const POINTS = await redisClient.HGETALL(`room:${roomCode}:points`);

    if (!POINTS[sessionId]) {
      await redisClient.HSET(`room:${roomCode}:points`, sessionId, 0);
    }

    return cnt;
  } catch (err) {
    console.log(err);
    return -1;
  }
}

export async function onUserLeaveRoomRedis(roomCode, sessionId) {
  try {
    const [cnt, _, _t] = await Promise.all([
      redisClient.DECR(`room:${roomCode}:count`),
      redisClient.SREM(`room:${roomCode}:users`, sessionId),
      redisClient.HDEL(`room:${roomCode}:user_names`, sessionId),
      // redisClient.HDEL(`room:${roomCode}:points`, sessionId),
    ]);

    return cnt;
  } catch (err) {
    console.log(err);
    return -1;
  }
}

export async function onStartGameRedis(roomCode, hostId) {
  await Promise.all([
    redisClient.SET(`room:${roomCode}:game`, ROOM_STATUS.PLAYING),
    redisClient.SET(`room:${roomCode}:hostId`, hostId),
  ]);
}

export async function onEndGameRedis(roomCode) {
  try {
    const [status, res1] = await Promise.all([
      redisClient.SET(`room:${roomCode}:game`, ROOM_STATUS.WAITING),
      redisClient.DEL(`room:${roomCode}:hostId`),
    ]);

    return status;
  } catch (err) {
    console.log(err);
    return ROOM_STATUS.ERROR;
  }
}

export async function onCreateRoomRedis(roomCode) {
  return Promise.all([
    redisClient.SET(`room:${roomCode}:count`, 0),
    redisClient.SET(`room:${roomCode}:game`, ROOM_STATUS.WAITING),
  ]);
}

export async function onDeleteRoomRedis(roomCode) {
  try {
    await redisClient.DEL(`room:${roomCode}:count`);
    await redisClient.DEL(`room:${roomCode}:users`);
    await redisClient.DEL(`room:${roomCode}:user_names`);
    await redisClient.DEL(`room:${roomCode}:points`);
    await redisClient.DEL(`room:${roomCode}:game`);
  } catch (err) {
    console.log(err);
  }
}

export async function getRoomStatus(roomCode) {
  try {
    const status = await redisClient.GET(`room:${roomCode}:game`);
    return status || ROOM_STATUS.ERROR;
  } catch (err) {
    console.log(err);
    return ROOM_STATUS.ERROR;
  }
}

// 이 부분을 어떻게 할 것인지.
export async function changeRoomStatus(roomCode, status) {
  try {
    await redisClient.SET(`room:${roomCode}:game`, status);
  } catch (err) {
    console.log(err);
  }
}

export async function getSessionIdsOfRoom(roomCode) {
  try {
    const sessions = await redisClient.SMEMBERS(`room:${roomCode}:users`);
    return sessions;
  } catch (err) {
    console.log(err);
    return [];
  }
}
