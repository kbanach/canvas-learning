const canvas = document.querySelector('canvas#main');
const ctx = canvas.getContext('2d');

const DEBUGGING = true;

let lastFrameTime = -1;

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function showTimer() {
  ctx.font = '14px serif';
  ctx.fillText(Date.now(), 10, 20);
}

function showDeltaT(dt) {
  ctx.font = '14px serif';
  ctx.fillText(`dT: ${dt}ms`, 10, 40);
}

function draw() {
  const dT = Date.now() - lastFrameTime; 
  if (dT < (1000 / 12)) {
    return setTimeout(
      () => { draw(); },
      dT,
    );
  }

  lastFrameTime = Date.now();

  clearCanvas();
  
  if (DEBUGGING) {
    showTimer();
    showDeltaT(dT);
  }
  
  window.requestAnimationFrame(draw);
}

draw();

// ctx.beginPath();
// ctx.stroke();
