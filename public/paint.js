let canvas1;
let prevX = 0;
let prevY = 0;
let cursorWidth = 5;
let paintColor = 0;
let isDisabled = false;

function setup() {
  canvas1 = createCanvas(1200, 400);
  strokeWeight(cursorWidth);
  stroke(paintColor);
  background(255);
  // cursor("https://avatars0.githubusercontent.com/u/1617169?s=16");
}

function draw() {
  if (mouseIsPressed && !isDisabled) {
    line(prevX, prevY, mouseX, mouseY);
    let data = {
      x: mouseX,
      y: mouseY,
      prevX,
      prevY,
      cursorWidth,
      paintColor,
    };
    socket.emit("paint", data);
  }
  prevX = mouseX;
  prevY = mouseY;
}

function disableCanvas() {
  isDisabled = true;
  canvas1.style.opacity = 0.7;
  cursor(WAIT);
}

function reableCanvas() {
  isDisabled = false;
  canvas1.style.opacity = 1;
  cursor(ARROW);
}

const colorItems = document.querySelectorAll(".color__item");
colorItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    colorItems.forEach((item) => {
      item.classList.remove("selected");
    });
    e.target.classList.add("selected");
    changeStrokeColor(e.target.id);
  });
});
