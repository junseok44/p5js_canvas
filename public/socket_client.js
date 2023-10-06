let socket = io("/rooms");

socket.on("alert", (data) => {
  alert(data.msg);
});

socket.on("message", (data) => {
  createMessageAndShow(data.msg, data.type);
});

socket.on("set_name", (data) => {
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

  data.forEach((user) => {
    const node = document.createElement("li");
    node.innerHTML = user.username;
    userList.appendChild(node);
  });
});

socket.on("reset", () => {
  clear();
});

socket.on("game_start", (data) => {
  alert("게임을 시작합니다.");
  createMessageAndShow(data.msg, data.type);
});

socket.on("game_disable_canvas", () => {
  isDisabled = true;
  canvas1.style.opacity = 0.7;
});

socket.on("game_reable_canvas", () => {
  isDisabled = false;
  canvas1.style.opacity = 1;
});
