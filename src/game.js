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
];

const drawPhaseTime = 20000;
const answerPhaseTime = 20000;

class CatchMindGame {
  // 룸정보와, 게임을 시작한 host 정보가 있어야 하고.
  constructor(room, roomCode, socket, map) {
    this.room = room;
    this.roomCode = roomCode;
    this.host = socket;
    this.answer = "";
    this.roomCodeToGameMap = map;
  }

  drawPhase() {
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
      // if (socket.id == this.host.id) {
      //   return;
      // }

      socket.on("send_answer", (data) => {
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
    this.room.to(this.roomCode).emit("game_reable_canvas");

    const sockets = await this.room.in(this.roomCode).fetchSockets();

    sockets.forEach((socket) => {
      socket.removeAllListeners("send_answer");
    });

    this.room.to(this.roomCode).emit("message", {
      msg: formatMessage("System", "게임이 종료되었습니다. 다들 안녕~~"),
      type: "system",
    });
    this.roomCodeToGameMap.set(this.roomCode, false);
  }
}

module.exports = CatchMindGame;
