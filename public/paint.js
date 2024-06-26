let canvas1;
let prevX = 0;
let prevY = 0;
let cursorWidth = 5;
let paintColor = 0;
let isDisabled = false;
let touchTriggered = false;
let canvasHeight = 400;

function setup() {
  let canvasDiv = document.getElementById("roomContainer");
  let width = getContentWidth(canvasDiv);
  canvas1 = createCanvas(width - 10, canvasHeight);
  canvas1.parent("roomContainer");
  strokeWeight(cursorWidth);
  stroke(paintColor);
  background(255);
}

function draw() {
  if (mouseIsPressed && !isDisabled) {
    if (!touchTriggered) {
      touchTriggered = true;
      prevX = mouseX;
      prevY = mouseY;
    }

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

function mouseReleased() {
  touchTriggered = false;
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

const pen = document.getElementsByClassName("black_pen");

if (pen.length > 0) {
  pen[0].addEventListener("click", () => {
    changeStrokeColor("black");
  });
}

colorItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    colorItems.forEach((item) => {
      item.classList.remove("selected");
    });
    e.target.classList.add("selected");
    changeStrokeColor(e.target.id);
  });
});

window.addEventListener("resize", () => {
  let canvasDiv = document.getElementById("roomContainer");
  let width = getContentWidth(canvasDiv);

  resizeCanvas(width, canvasHeight);
  // background(255);
  // strokeWeight(cursorWidth);
  // stroke(paintColor);
});

function getContentWidth(element) {
  var styles = getComputedStyle(element);

  return (
    parseInt(styles.width) -
    parseFloat(styles.paddingLeft) -
    parseFloat(styles.paddingRight)
  );
}
