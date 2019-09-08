const canvas = document.querySelector('canvas#main');
const ctx = canvas.getContext('2d');

const DEBUGGING = true;
const TARGET_FPS = 24;

let averageFps = 0;
let lastFrameTime = -1;

/**********************************
 * debugging methods
 */
function printDbgMsg(msg, dbgMsgRow) {
  ctx.font = '14px serif';
  ctx.fillText(msg, 10, 18 * dbgMsgRow);
}

function printDebugs(dT) {
  let i = 1;

  printDbgMsg(getTimer(), i++);
  printDbgMsg(getVarDbg('dT', dT), i++);
  printDbgMsg(getVarDbg('target fps', TARGET_FPS), i++);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function getTimer() {
  return Date.now();
}

function getVarDbg(varName, value) {
  return `${varName}: ${value}`;
}
/* end ****************************/

const elements = [];

function updateElements(dT) {

}

function drawElements() {

}

/**********************************
 * the magic happens here:
 */
function drawFrame(dT) {
  clearCanvas();
  
  if (DEBUGGING) {
    printDebugs(dT);
  }

  updateElements(dT);
  drawElements();
}
/* end ****************************/



/**********************************
 * maintenance canvas refresh loop
 */
function mainLoop() {
  const now = Date.now();

  const dT = now - lastFrameTime; 
  if (dT < (1000 / TARGET_FPS)) {
    return setTimeout(
      () => { mainLoop(); },
      (1000 / TARGET_FPS) - dT,
    );
  }

  lastFrameTime = now;

  drawFrame(dT); 
 
  window.requestAnimationFrame(mainLoop);
}
/* end ****************************/



mainLoop();

