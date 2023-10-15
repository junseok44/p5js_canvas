const { updateRoom, getRoomByCode } = require("./query/roomQuery");
const { formatMessage } = require("./utils");

const question_words = [
  "가격",
  "창세기",
  "가출",
  "경찰",
  "가족",
  "연장전",
  "퇴학",
  "가수",
  "냅킨",
  "단감",
  "단도",
  "동맥",
  "단백질",
  "단추",
  "방귀",
  "보리",
  "단풍",
  "달걀",
  "사막",
  "명탐정",
  "무전기",
  "무지개",
  "샌드백",
  "순두부",
  "수수떡",
  "사이렌",
  "우체통",
  "입체파",
  "유재석",
  "작곡가",
  "진공관",
  "정문기입",
  "저녁밥",
  "종이컵",
  "자판기",
  "재활용",
];

const drawPhaseTime = 30000;
const answerPhaseTime = 30000;

class CatchMindGame {
  // 룸정보와, 게임을 시작한 host 정보가 있어야 하고.
  constructor(room, roomCode, socket, map, lobby) {
    this.room = room;
    this.lobby = lobby;
    this.roomCode = roomCode;
    this.host = socket;
    this.answer = "";
    this.roomCodeToGameMap = map;
  }

  drawPhase() {
    this.roomCodeToGameMap.set(this.roomCode, {
      ...this.roomCodeToGameMap.get(this.roomCode),
      status: "drawing",
    });

    updateRoom(this.roomCode, null, true)
      .then((res) => {
        return getRoomByCode(this.roomCode);
      })
      .then((room) => {
        this.lobby.emit("update_room", room);
      });

    this.room.to(this.roomCode).emit("game_drawPhase");

    this.startRoomTimer(drawPhaseTime / 1000);

    this.answer =
      question_words[Math.floor(Math.random() * question_words.length)];

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
    this.roomCodeToGameMap.set(this.roomCode, {
      ...this.roomCodeToGameMap.get(this.roomCode),
      status: "answer",
    });

    this.room.to(this.roomCode).emit("game_answerPhase");

    this.startRoomTimer(answerPhaseTime / 1000);

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
            tyep: "fail",
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
          this.calculateScoreStep();
        } else {
          this.room.to(this.roomCode).emit("message", {
            msg: formatMessage("system", `${data.answer}는 오답입니다!!`),
            type: "fail",
          });
        }
      });
    });
  }

  startRoomTimer(time) {
    // time초동안 1초마다 room의 time을 1씩 줄여주고, 0이되면 clearInterval

    let timer = setInterval(() => {
      time -= 1;

      this.roomCodeToGameMap.set(this.roomCode, {
        ...this.roomCodeToGameMap.get(this.roomCode),
        time: time,
      });

      this.room.to(this.roomCode).emit("game_time", {
        status: this.roomCodeToGameMap.get(this.roomCode).status,
        time: this.roomCodeToGameMap.get(this.roomCode).time,
      });

      if (time == 0) {
        clearInterval(timer);
        return;
      }
    }, 1000);
  }

  calculateScoreStep() {
    this.room.to(this.roomCode).emit("message", {
      msg: formatMessage("system", "점수를 계산중입니다..."),
      type: "system",
    });

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
    updateRoom(this.roomCode, null, false)
      .then((res) => {
        return getRoomByCode(this.roomCode);
      })
      .then((room) => {
        this.lobby.emit("update_room", room);
      });

    this.room.to(this.roomCode).emit("game_end");
    this.room.to(this.roomCode).emit("game_reable_canvas");

    const sockets = await this.room.in(this.roomCode).fetchSockets();

    sockets.forEach((socket) => {
      socket.removeAllListeners("send_answer");
    });

    this.room.to(this.roomCode).emit("message", {
      msg: formatMessage("System", "게임이 종료되었습니다. 다들 안녕~~"),
      type: "system",
    });

    this.roomCodeToGameMap.set(this.roomCode, {
      ...this.roomCodeToGameMap.get(this.roomCode),
      status: "waiting",
    });
  }
}

module.exports = CatchMindGame;
