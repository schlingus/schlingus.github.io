const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");

const pauseBtn = document.getElementById("pauseBtn");
const menuOverlay = document.getElementById("menuOverlay");
const resumeBtn = document.getElementById("resumeBtn");
const restartBtn = document.getElementById("restartBtn");
const menuTitle = document.getElementById("menuTitle");
const skinSelector = document.getElementById("skinSelector");
const skinDropdown = document.getElementById("skin");
const startBtn = document.getElementById("startBtn");

let playerSprite = "player-ninja.png"; // default


let playerX = 175;
let score = 0;
let spawnRate = 1000;
let fallSpeed = 5;
let enemiesPerSpawn = 1;
let gameOver = false;
let paused = false;
let spawnLoopId = null;
let moveLeft = false;
let moveRight = false;
let moveSpeed = 5;


// Move player
document.addEventListener("keydown", (e) => {
  if (paused || gameOver) return;

  if (e.key === "ArrowLeft") moveLeft = true;
  if (e.key === "ArrowRight") moveRight = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") moveLeft = false;
  if (e.key === "ArrowRight") moveRight = false;
});


// Spawn enemy
function spawnEnemy() {
  const enemy = document.createElement("div");
  enemy.classList.add("enemy");
  enemy.style.left = Math.floor(Math.random() * 8) * 50 + "px";
  let y = 0;

  const fall = setInterval(() => {
    if (gameOver || paused) {
      clearInterval(fall);
      enemy.remove();
      return;
    }

    y += fallSpeed;
    enemy.style.top = y + "px";

    const playerRect = player.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();

    if (
      playerRect.left < enemyRect.right &&
      playerRect.right > enemyRect.left &&
      playerRect.top < enemyRect.bottom &&
      playerRect.bottom > enemyRect.top
    ) {
      endGame();
    }

    if (y > 600) {
      clearInterval(fall);
      enemy.remove();
      score++;
      scoreDisplay.innerText = "Score: " + score;

      // Increase difficulty
      if (score % 5 === 0 && spawnRate > 300) {
        spawnRate -= 50;
        fallSpeed += 1;
        enemiesPerSpawn = Math.min(enemiesPerSpawn + 1, 5);
      }
    }
  }, 20);

  game.appendChild(enemy);
}

// Game loop
function loop() {
  if (gameOver || paused) return;

  for (let i = 0; i < enemiesPerSpawn; i++) {
    spawnEnemy();
  }

  spawnLoopId = setTimeout(loop, spawnRate);
}

// Start the game
function startGame() {
  score = 0;
  gameOver = false;
  paused = false;
  spawnRate = 1000;
  fallSpeed = 5;
  enemiesPerSpawn = 1;
  scoreDisplay.innerText = "Score: 0";
  menuOverlay.classList.add("hidden");
  loop();
}

// End game
function endGame() {
  gameOver = true;
  clearTimeout(spawnLoopId);
  menuTitle.innerText = `Game Over! Final Score: ${score}`;
  menuOverlay.classList.remove("hidden");
}

// Pause/Resume
function togglePause() {
  if (gameOver) return;

  paused = !paused;
  if (paused) {
    clearTimeout(spawnLoopId);
    menuTitle.innerText = "Game Paused";
    menuOverlay.classList.remove("hidden");
  } else {
    menuOverlay.classList.add("hidden");
    loop();
  }
}

// Restart
function restartGame() {
  window.location.reload();
}

// Button events
pauseBtn.addEventListener("click", togglePause);
resumeBtn.addEventListener("click", togglePause);
restartBtn.addEventListener("click", restartGame);

// Start game on load
startGame();

function movePlayer() {
  if (!paused && !gameOver) {
    if (moveLeft && playerX > 0) {
      playerX -= moveSpeed;
    }
    if (moveRight && playerX < 350) {
      playerX += moveSpeed;
    }
    player.style.left = playerX + "px";
  }

  requestAnimationFrame(movePlayer);
}

movePlayer(); // Start the smooth movement loop

startBtn.addEventListener("click", () => {
  playerSprite = skinDropdown.value;
  player.style.backgroundImage = `url('${playerSprite}')`;
  skinSelector.style.display = "none";
  startGame();
});
