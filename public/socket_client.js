let socket = io("/rooms");
let currentRoomUsers = [];

const ROOM_STATUS = {
  WAITING: "대기중..",
  PLAYING: "게임 실행중..",
  DRAWING: "그림 그리는중..",
  ANSWER: "답 기다리는중..",
};

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

  sortedUsers.forEach((user) => {
    const node = document.createElement("li");
    node.className = "user_item";
    const textnode = document.createTextNode(user.username);
    const pointNode = document.createElement("span");
    pointNode.innerHTML = `${user.point}점`;
    node.appendChild(textnode);
    node.appendChild(pointNode);
    userList.appendChild(node);
  });
});

socket.on("update_room_status", (data) => {
  switch (data.status) {
    case ROOM_STATUS.WAITING:
      changeGameStatus(waitingPhase);
      // setTimer(waitingPhase, data.time);
      break;
    case ROOM_STATUS.DRAWING:
      changeGameStatus(drawPhase);
      setTimer(drawPhase, data.time);
      break;
    case ROOM_STATUS.ANSWER:
      changeGameStatus(answerPhase);
      setTimer(answerPhase, data.time);
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
