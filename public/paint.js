let circleX = 0;
let circleY = 0;
let canvas1;
let prevX = 0;
let prevY = 0;
let isDrawing = false;
let cursorWidth = 5;
let paintColor = 0;

function setup() {
  canvas1 = createCanvas(1200, 400);
  strokeWeight(cursorWidth);
  background(255);
  // cursor("https://avatars0.githubusercontent.com/u/1617169?s=16");
}

function draw() {
  if (mouseIsPressed) {
    line(prevX, prevY, mouseX, mouseY);
  }
  prevX = mouseX;
  prevY = mouseY;
}

function mouseDragged() {
  circleX = mouseX;
  circleY = mouseY;

  if (mouseIsPressed) {
    let data = {
      x: mouseX,
      y: mouseY,
      prevX,
      prevY,
    };
    socket.emit("mouse", data);
  }
}
