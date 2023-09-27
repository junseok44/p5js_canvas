let socket = io("/rooms");

socket.on("message", (data) => {
  console.log(data);
  const node = createMessageNode(data.msg);
  msgContainer.appendChild(node);
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
