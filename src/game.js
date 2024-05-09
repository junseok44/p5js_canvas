import { ROOM_STATUS } from "./constants/status.js";
import { updateRoom, getRoomByCode } from "./query/roomQuery.js";
import { getUserListOfRoom, onEndGameRedis } from "./redis/roomQuery.js";
import { formatMessage } from "./utils/message.js";

const drawPhaseTime = 10000;
const answerPhaseTime = 10000;

class CatchMindGame {
  // 룸정보와, 게임을 시작한 host 정보가 있어야 하고.
  constructor(room, roomCode, socket, lobby, redisClient, question_words) {
    this.room = room;
    this.lobby = lobby;
    this.roomCode = roomCode;
    this.host = socket;
    this.answer = "";
    this.redis = redisClient;
    this.wordBox = question_words;
  }

  drawPhase() {
    // 게임 상태 변화는 그냥 redis에 따로 설정하는 일 없이, 그냥 socket으로만 보내줬음.

    this.room.to(this.roomCode).emit("game_drawPhase");

    this.startRoomTimer(ROOM_STATUS.DRAWING, drawPhaseTime / 1000);

    this.answer = this.wordBox[Math.floor(Math.random() * this.wordBox.length)];

    // 각 게임 시간 보내줄것.

    this.room.to(this.roomCode).emit("all_game_time", {
      [ROOM_STATUS.DRAWING]: drawPhaseTime / 1000,
      [ROOM_STATUS.ANSWER]: answerPhaseTime / 1000,
    });

    this.host.emit("alert", {
      msg: `당신이 그릴 단어는 ${this.answer}입니다. ${
        drawPhaseTime / 1000
      }초 동안 그려주세요!}`,
    });

    this.room.to(this.roomCode).emit("message", {
      msg: formatMessage(
        "System",
        `${this.host.request.session.username}님이 그림을 그리고 있습니다....`
      ),
      type: "system",
    });

    this.host.broadcast.emit("game_disable_canvas");

    setTimeout(() => {
      this.answerPhase();
    }, drawPhaseTime);
  }

  async answerPhase() {
    // this.roomCodeToGameMap.set(this.roomCode, {
    //   ...this.roomCodeToGameMap.get(this.roomCode),
    //   status: "answer",
    // });

    this.room.to(this.roomCode).emit("game_answerPhase");

    this.startRoomTimer(ROOM_STATUS.ANSWER, answerPhaseTime / 1000);

    this.room.to(this.roomCode).emit("game_disable_canvas");

    this.room.to(this.roomCode).emit("message", {
      msg: formatMessage(
        "System",
        `이제 정답을 맞춰주세요! ${answerPhaseTime / 1000}초 드립니다.`
      ),
      type: "system",
    });

    let answerTimer = setTimeout(() => {
      this.room.to(this.roomCode).emit("message", {
        msg: formatMessage(
          "system",
          `아무도 못맞추셨네요 ㅠㅠ 정답은 ${this.answer}입니다.`
        ),
        type: "fail",
      });
      this.endGame();
    }, answerPhaseTime);

    const sockets = await this.room.in(this.roomCode).fetchSockets();

    sockets.forEach((socket) => {
      socket.on("send_answer", (data) => {
        if (this.host.id == socket.id) {
          socket.emit("message", {
            msg: formatMessage(
              "system",
              `그림을 그린 사람은 정답을 맞출 수 없습니다.`
            ),
            type: "fail",
          });

          return;
        }

        if (this.validateAnswer(data.answer)) {
          clearTimeout(answerTimer);
          this.room.to(this.roomCode).emit("message", {
            msg: formatMessage(
              "system",
              `${socket.request.session.username}님이 정답을 맞추셨습니다!! 정답은 ${this.answer}였어요`
            ),
            type: "success",
          });
          this.calculateScoreStep(socket.request.session.id);
        } else {
          this.room.to(this.roomCode).emit("message", {
            msg: formatMessage("system", `${data.answer}는 오답입니다!!`),
            type: "fail",
          });
        }
      });
    });
  }

  async startRoomTimer(status, time) {
    // time초동안 1초마다 room의 time을 1씩 줄여주고, 0이되면 clearInterval

    // await this.redis.SET(`room:${this.roomCode}:time`, time);

    let timer = setInterval(() => {
      time -= 1;

      // this.roomCodeToGameMap.set(this.roomCode, {
      //   ...this.roomCodeToGameMap.get(this.roomCode),
      //   time: time,
      // });

      // this.room.to(this.roomCode).emit("game_time", {
      //   status: this.roomCodeToGameMap.get(this.roomCode).status,
      //   time: this.roomCodeToGameMap.get(this.roomCode).time,
      // });

      this.room.to(this.roomCode).emit("game_time", {
        status,
        time,
      });

      if (time == 0) {
        clearInterval(timer);
        return;
      }
    }, 1000);
  }

  async calculateScoreStep(winnerId) {
    this.room.to(this.roomCode).emit("message", {
      msg: formatMessage("system", "점수를 계산중입니다..."),
      type: "system",
    });

    await this.redis.HINCRBY(`room:${this.roomCode}:points`, winnerId, 1);

    this.endGame();
  }

  validateAnswer(answer) {
    if (answer == this.answer) {
      return true;
    } else {
      return false;
    }
  }

  startGame() {
    this.room.to(this.roomCode).emit("game_start", {
      msg: formatMessage("System", "게임을 시작합니다."),
      type: "system",
    });
    this.room.to(this.roomCode).emit("reset");
    this.drawPhase();
  }

  async endGame() {
    const [res] = await onEndGameRedis(this.roomCode);

    this.lobby.emit("update_room", {
      code: this.roomCode,
      status: ROOM_STATUS.WAITING,
    });
    this.room.to(this.roomCode).emit("game_end");
    this.room.to(this.roomCode).emit("game_reable_canvas");

    const sockets = await this.room.in(this.roomCode).fetchSockets();

    sockets.forEach((socket) => {
      socket.removeAllListeners("send_answer");
    });

    // const promises = sockets.map(async (socket) => {

    //   const sessionId = socket.request.session.id;

    //   await this.redis.HINCRBY(`room:${this.roomCode}:points`, sessionId, 1);
    // });

    // await Promise.all(promises);

    const userlist = await getUserListOfRoom(this.roomCode);

    this.room.to(this.roomCode).emit("update_users", userlist);

    this.room.to(this.roomCode).emit("message", {
      msg: formatMessage("System", "게임이 종료되었습니다. 다들 안녕~~"),
      type: "system",
    });

    this.room.to(this.roomCode).emit("game_time", {
      status: ROOM_STATUS.WAITING,
      time: 0,
    });
  }
}

export default CatchMindGame;
