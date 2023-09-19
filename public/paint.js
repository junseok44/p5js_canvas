let circleX = 0;
let circleY = 0;
let canvas1;
function setup() {
  canvas1 = createCanvas(1200, 400);
  strokeWeight(cursorWidth);
  background(255);
  cursor("https://avatars0.githubusercontent.com/u/1617169?s=16");
}

let prevX = 0;
let prevY = 0;
let isDrawing = false;
let cursorWidth = 5;

function draw() {
  // circle(circleX, circleY, 50, 50);

  if (!isDrawing) {
    prevX = mouseX;
    prevY = mouseY;
  }

  if (mouseIsPressed) {
    isDrawing = true;
    line(prevX, prevY, mouseX, mouseY);
    prevX = mouseX;
    prevY = mouseY;
  }
}

function mouseReleased() {
  isDrawing = false;
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
