let socket = io("/rooms");
let currentRoomUsers = [];

socket.on("alert", (data) => {
  alert(data.msg);
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
  console.log(data);

  const userList = document.querySelector(".all_users");
  userList.innerHTML = "";
  data.forEach((user) => {
    const node = document.createElement("li");
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
    case "waiting":
      changeGameStatus(waitingPhase);
      // setTimer(waitingPhase, data.time);
      break;
    case "drawing":
      changeGameStatus(drawPhase);
      setTimer(drawPhase, data.time);
      break;
    case "answer":
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
    case "drawing":
      setTimer(drawPhase, data.time);
      break;
    case "answer":
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
  changeGameStatus(waitingPhase);
});

socket.on("game_disable_canvas", () => {
  disableCanvas();
});

socket.on("game_reable_canvas", () => {
  reableCanvas();
});
