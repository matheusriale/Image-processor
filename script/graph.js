var canvasgraph = document.getElementById("graph"); // criar canvas (representa desenho)
var contextgraph = canvasgraph.getContext("2d"); // estrutura que recebe dados para desenho
var points = [
  [100, 200],
  [200, 100],
];

var isDragging = false;
var selectedPoint = -1;

window.onload = function () {
  drawGraph();
  canvasgraph.onmousedown = click;
  canvasgraph.onmouseup = stopDragging;
  canvasgraph.onmouseout = stopDragging;
  canvasgraph.onmousemove = drag;
};

function click(event) {
  const c = canvasgraph.getBoundingClientRect();
  const x = event.clientX - c.left;
  const y = event.clientY - c.top;
  for (let i = 0; i < points.length; i++) {
    const circle = points[i];
    const distance = Math.sqrt(
      Math.pow(circle[0] - x, 2) + Math.pow(circle[1] - y, 2)
    );
    if (distance < 15) {
      selectedPoint = i;
      isDragging = true;
      return;
    } else {
      selectedPoint = -1;
    }
  }
}

function drag(event) {
  if (isDragging && selectedPoint != -1) {
    let x = event.pageX - canvasgraph.offsetLeft;
    let y = event.pageY - canvasgraph.offsetTop;
    if (selectedPoint == 0 && x > points[1][0]) {
      x = points[1][0];
    } else if (selectedPoint == 1 && x < points[0][0]) {
      x = points[0][0];
    }
    points[selectedPoint][0] = x;
    points[selectedPoint][1] = y;
    piecewiseLinear(
      points[0][0]*255/canvasgraph.width,
      (Math.abs(points[0][1]-canvasgraph.height))*255/canvasgraph.width,
      points[1][0]*255/canvasgraph.width,
      (Math.abs(points[1][1]-canvasgraph.height))*255/canvasgraph.width
    );
    drawGraph();
  }
}

function stopDragging() {
  isDragging = false;
}

function drawPoints() {
  contextgraph.fillStyle = "#000000";
  contextgraph.beginPath();
  contextgraph.arc(points[0][0], points[0][1], 5, 0, Math.PI * 2, true);
  contextgraph.fill();

  contextgraph.fillStyle = "#000000";
  contextgraph.beginPath();
  contextgraph.arc(points[1][0], points[1][1], 5, 0, Math.PI * 2, true);
  contextgraph.fill();
}

function drawLine() {
  contextgraph.strokeStyle = "black";
  contextgraph.lineWidth = 2;
  contextgraph.beginPath();
  contextgraph.moveTo(0, canvasgraph.height);
  contextgraph.lineTo(points[0][0], points[0][1]);
  contextgraph.lineTo(points[1][0], points[1][1]);
  contextgraph.lineTo(canvasgraph.width, 0);
  contextgraph.stroke();
}

function drawGraph() {
  contextgraph.clearRect(0, 0, canvasgraph.width, canvasgraph.height);
  drawPoints();
  drawLine();
}
