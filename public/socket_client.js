let socket = io("/rooms");

socket.on("message", (data) => {
  const node = createMessageNode(data.msg);
  msgContainer.appendChild(node);

  msgContainer.scrollTop = msgContainer.scrollHeight;
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

socket.on("reset", () => {
  clear();
});
