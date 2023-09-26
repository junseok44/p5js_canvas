let socket = io();

socket.on("message", (data) => {
  const node = createMessageNode(data.msg);
  msgContainer.appendChild(node);
});

socket.on("mouse", function (data) {
  line(data.prevX, data.prevY, data.x, data.y);
});

socket.on("reset", () => {
  clear();
});
