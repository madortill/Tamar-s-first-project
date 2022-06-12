let canvas;
let toolbar;
let ctx; 
let lineWidth = 5;
let startX;
let startY;
let canvasOffsetX;
let canvasOffsetY;

const VW_CANVAS_WIDTH = 50;
const VH_CANVAS_HEIGHT = 50;


window.addEventListener("load", (event) => {
  canvas = document.getElementById('drawing-board');
  toolbar = document.getElementById('toolbar');
  toolbar.style.padding = `10px 0`;
  toolbar.style.width = `${VW_CANVAS_WIDTH}vw`;
  console.log(toolbar.offsetWidth);
  document.getElementById("drawing-warpper").style.width = `${VW_CANVAS_WIDTH}vw`;
  ctx = canvas.getContext('2d');
  canvasOffsetX = canvas.offsetLeft;
  canvasOffsetY = canvas.offsetTop;
  canvas.width = (window.innerWidth * VW_CANVAS_WIDTH)/ 100;
  canvas.height = (window.innerHeight * VH_CANVAS_HEIGHT) / 100;
  window.addEventListener("resize", (event) => {
    canvasOffsetX = canvas.offsetLeft;
    canvasOffsetY = canvas.offsetTop;
    canvas.width = (window.innerWidth * VW_CANVAS_WIDTH)/ 100;
    canvas.height = (window.innerHeight * VH_CANVAS_HEIGHT) / 100;
  });
  document.getElementById("clear").addEventListener("click", (event) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
  console.log(document.getElementById("drawing-board"))
  toolbar.addEventListener("input", changePen);
  canvas.addEventListener("touchstart", startDrawing);
});

const changePen = (event) => {
  if (event.target.id === "lineWidth") {
    lineWidth = event.target.value;
  } else if (event.target.id === "stroke") {
    ctx.strokeStyle = event.target.value;
  }
}

const startDrawing = (event) => {
  console.log("start");
  event.preventDefault();
  startX = event.clientX;
  startY = event.clientY;
  canvas.addEventListener("touchmove", draw);
  canvas.addEventListener("touchend", stopDrawing);
}

const draw = (event) => {
  console.log("draw");
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  for (let i = 0; i < event.changedTouches.length; i++) {
    ctx.lineTo(event.changedTouches[i].pageX - canvasOffsetX, event.changedTouches[i].pageY - canvasOffsetY);
    ctx.stroke();
  }
}

const stopDrawing = (event) => {
  console.log("stop")
  canvas.removeEventListener("touchmove", draw);
  ctx.beginPath();
}
