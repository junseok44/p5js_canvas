let socket = io("/rooms");
let currentRoomUsers = [];

const ROOM_STATUS = {
  WAITING: "대기중..",
  PLAYING: "게임 실행중..",
  DRAWING: "그림 그리는중..",
  ANSWER: "답 기다리는중..",
  ERROR: "에러",
};

let gameStatus = ROOM_STATUS.WAITING;

socket.on("redirect", function (destination) {
  window.location.href = destination;
});

socket.on("alert", (data) => {
  alert(data.msg);
});

socket.on("all_game_time", (data) => {
  if (data[ROOM_STATUS.DRAWING]) {
    setTimer(drawPhase, data[ROOM_STATUS.DRAWING]);
  }

  if (data[ROOM_STATUS.ANSWER]) {
    setTimer(answerPhase, data[ROOM_STATUS.ANSWER]);
  }
});

socket.on("message", (data) => {
  createMessageAndShow(data.msg, data.type);
});

socket.on("set_name", (data) => {
  console.log(data.name);
  const username = document.querySelector("#username");
  username.innerHTML = data.name;
});

socket.on("paint", function (data) {
  push();
  stroke(data.paintColor);
  strokeWeight(data.cursorWidth);
  line(data.prevX, data.prevY, data.x, data.y);
  pop();
});

socket.on("update_users", (data) => {
  const userList = document.querySelector(".all_users");
  userList.innerHTML = "";

  let sortedUsers = data.sort((a, b) => {
    return b.point - a.point;
  });

  currentRoomUsers = sortedUsers;

  sortedUsers.forEach((user) => {
    const node = document.createElement("li");
    node.className = `user_item ${user.id === socket.id ? "me" : ""} user_${
      user.id
    }`;

    const textnode = document.createTextNode(user.username);
    const pointNode = document.createElement("span");
    pointNode.innerHTML = `${user.point}점`;
    node.appendChild(textnode);
    node.appendChild(pointNode);
    userList.appendChild(node);
  });
});

socket.on("update_point", (data) => {
  const point = document.querySelector(`.user_${data.id} span`);
  point.innerHTML = `${data.point}점`;
});

socket.on("update_room_status", (data) => {
  console.log("updateroom status", data.status);
  switch (data.status) {
    case ROOM_STATUS.WAITING:
      changeGameStatus(waitingPhase);
      gameStatus = ROOM_STATUS.WAITING;
      break;
    case ROOM_STATUS.DRAWING:
      changeGameStatus(drawPhase);
      gameStatus = ROOM_STATUS.DRAWING;
      setTimer(drawPhase, data.time);
      break;
    case ROOM_STATUS.ANSWER:
      changeGameStatus(answerPhase);
      gameStatus = ROOM_STATUS.ANSWER;
      setTimer(answerPhase, data.time);
      break;
    case ROOM_STATUS.ERROR:
      alert("에러가 발생했습니다. 로비로 돌아갑니다.");
      window.location.href = "/";
      break;
    default:
      changeGameStatus(waitingPhase);
      break;
  }
});

socket.on("game_time", (data) => {
  switch (data.status) {
    case ROOM_STATUS.DRAWING:
      setTimer(drawPhase, data.time);
      break;
    case ROOM_STATUS.ANSWER:
      setTimer(answerPhase, data.time);
      break;
    default:
      break;
  }
});

socket.on("reset", () => {
  clear();
});

socket.on("game_start", (data) => {
  alert("게임을 시작합니다.");
  createMessageAndShow(data.msg, data.type);
});

socket.on("game_drawPhase", (data) => {
  changeGameStatus(drawPhase);
});

socket.on("game_answerPhase", (data) => {
  changeGameStatus(answerPhase);
});

socket.on("game_end", (data) => {
  clear();
  changeGameStatus(waitingPhase);
});

socket.on("game_disable_canvas", () => {
  disableCanvas();
});

socket.on("game_reable_canvas", () => {
  reableCanvas();
});
