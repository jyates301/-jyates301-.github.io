const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("scoreValue");
const livesEl = document.getElementById("livesValue");
const bricksEl = document.getElementById("bricksValue");
const messageEl = document.getElementById("gameMessage");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");

const GAME = {
  width: canvas.width,
  height: canvas.height,
  initialLives: 3,
  maxBallSpeedY: 7.5
};

const paddle = {
  width: 120,
  height: 14,
  x: (GAME.width - 120) / 2,
  y: GAME.height - 34,
  speed: 7.5
};

const ball = {
  radius: 9,
  x: GAME.width / 2,
  y: GAME.height - 48,
  dx: 4.2,
  dy: -4.2
};

const brickConfig = {
  rows: 6,
  cols: 10,
  width: 64,
  height: 22,
  gap: 8,
  top: 58
};

let bricks = [];
let score = 0;
let lives = GAME.initialLives;
let running = false;
let paused = false;
let rightPressed = false;
let leftPressed = false;
let rafId = null;

function createBricks() {
  bricks = [];
  const totalRowWidth = brickConfig.cols * brickConfig.width + (brickConfig.cols - 1) * brickConfig.gap;
  const offsetX = (GAME.width - totalRowWidth) / 2;

  for (let r = 0; r < brickConfig.rows; r += 1) {
    for (let c = 0; c < brickConfig.cols; c += 1) {
      const x = offsetX + c * (brickConfig.width + brickConfig.gap);
      const y = brickConfig.top + r * (brickConfig.height + brickConfig.gap);
      bricks.push({
        x,
        y,
        width: brickConfig.width,
        height: brickConfig.height,
        alive: true
      });
    }
  }
}

function resetBallAndPaddle() {
  paddle.x = (GAME.width - paddle.width) / 2;
  ball.x = GAME.width / 2;
  ball.y = GAME.height - 48;
  ball.dx = 4.2 * (Math.random() > 0.5 ? 1 : -1);
  ball.dy = -4.2;
}

function resetGame() {
  score = 0;
  lives = GAME.initialLives;
  running = true;
  paused = false;
  pauseBtn.textContent = "Pause";
  createBricks();
  resetBallAndPaddle();
  updateHud();
  setMessage("Game running. Break all bricks to win.");
  startLoop();
}

function setMessage(text) {
  messageEl.textContent = text;
}

function updateHud() {
  const remaining = bricks.filter((brick) => brick.alive).length;
  scoreEl.textContent = String(score);
  livesEl.textContent = String(lives);
  bricksEl.textContent = String(remaining);
}

function drawPaddle() {
  ctx.fillStyle = "#0284c7";
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#0f172a";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  bricks.forEach((brick, i) => {
    if (!brick.alive) {
      return;
    }
    const hue = 210 + (i % brickConfig.cols) * 4;
    ctx.fillStyle = `hsl(${hue} 80% 55%)`;
    ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
  });
}

function drawFrame() {
  ctx.clearRect(0, 0, GAME.width, GAME.height);
  drawBricks();
  drawPaddle();
  drawBall();
}

function movePaddle() {
  if (rightPressed) {
    paddle.x += paddle.speed;
  }
  if (leftPressed) {
    paddle.x -= paddle.speed;
  }
  if (paddle.x < 0) {
    paddle.x = 0;
  }
  if (paddle.x + paddle.width > GAME.width) {
    paddle.x = GAME.width - paddle.width;
  }
}

function checkWallCollisions() {
  if (ball.x + ball.dx > GAME.width - ball.radius || ball.x + ball.dx < ball.radius) {
    ball.dx = -ball.dx;
  }
  if (ball.y + ball.dy < ball.radius) {
    ball.dy = -ball.dy;
  }
}

function checkPaddleCollision() {
  const hitsPaddleY =
    ball.y + ball.radius >= paddle.y &&
    ball.y + ball.radius <= paddle.y + paddle.height + Math.abs(ball.dy);
  const withinPaddleX = ball.x >= paddle.x && ball.x <= paddle.x + paddle.width;

  if (hitsPaddleY && withinPaddleX && ball.dy > 0) {
    const relativeIntersect = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
    ball.dx = relativeIntersect * 6;
    ball.dy = -Math.max(3.2, Math.min(GAME.maxBallSpeedY, Math.abs(ball.dy) + 0.12));
  }
}

function checkBrickCollisions() {
  for (let i = 0; i < bricks.length; i += 1) {
    const brick = bricks[i];
    if (!brick.alive) {
      continue;
    }
    const withinX = ball.x + ball.radius > brick.x && ball.x - ball.radius < brick.x + brick.width;
    const withinY = ball.y + ball.radius > brick.y && ball.y - ball.radius < brick.y + brick.height;
    if (withinX && withinY) {
      brick.alive = false;
      score += 10;
      ball.dy = -ball.dy;
      updateHud();
      if (bricks.every((candidate) => !candidate.alive)) {
        running = false;
        setMessage("You win! Press Start / Restart to play again.");
        stopLoop();
      }
      break;
    }
  }
}

function checkMissedBall() {
  if (ball.y - ball.radius > GAME.height) {
    lives -= 1;
    updateHud();
    if (lives <= 0) {
      running = false;
      setMessage("Game over. Press Start / Restart to try again.");
      stopLoop();
      return;
    }
    setMessage("Life lost. Keep going.");
    resetBallAndPaddle();
  }
}

function update() {
  if (!running || paused) {
    drawFrame();
    return;
  }
  movePaddle();
  checkWallCollisions();
  checkPaddleCollision();
  checkBrickCollisions();
  checkMissedBall();
  ball.x += ball.dx;
  ball.y += ball.dy;
  drawFrame();
}

function loop() {
  update();
  rafId = window.requestAnimationFrame(loop);
}

function startLoop() {
  stopLoop();
  rafId = window.requestAnimationFrame(loop);
}

function stopLoop() {
  if (rafId !== null) {
    window.cancelAnimationFrame(rafId);
    rafId = null;
  }
}

function togglePause() {
  if (!running) {
    return;
  }
  paused = !paused;
  pauseBtn.textContent = paused ? "Resume" : "Pause";
  setMessage(paused ? "Paused." : "Game running. Break all bricks to win.");
}

function onKeyDown(event) {
  const key = event.key.toLowerCase();
  if (key === "arrowright" || key === "d") {
    rightPressed = true;
  }
  if (key === "arrowleft" || key === "a") {
    leftPressed = true;
  }
}

function onKeyUp(event) {
  const key = event.key.toLowerCase();
  if (key === "arrowright" || key === "d") {
    rightPressed = false;
  }
  if (key === "arrowleft" || key === "a") {
    leftPressed = false;
  }
}

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);

startBtn.addEventListener("click", resetGame);
pauseBtn.addEventListener("click", togglePause);

createBricks();
updateHud();
drawFrame();
