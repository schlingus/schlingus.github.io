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
const mainMenu = document.getElementById("mainMenu");
const startGameBtn = document.getElementById("startGameBtn");
const previews = document.querySelectorAll(".skinPreview");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const jumpBtn = document.getElementById("jumpBtn");
const dashBtn = document.getElementById("dashBtn");




let playerSprite = "infernus.png"; // default


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
  
  if (e.key === " ") jumpPlayer();       // Spacebar to jump
  if (e.key === "Shift") dashPlayer();   // Shift to dash
});


document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") moveLeft = false;
  if (e.key === "ArrowRight") moveRight = false;
  
  if (e.key === " ") jumpPlayer();       // Spacebar to jump
  if (e.key === "Shift") dashPlayer();   // Shift to dash
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
  menuTitle.innerText = `game over! final score: ${score}`;
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
// startGame();

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

startGameBtn.addEventListener("click", () => {
  mainMenu.style.display = "none";
  player.style.backgroundImage = `url('${playerSprite}')`;
  startGame();
});


previews.forEach(preview => {
  preview.addEventListener("click", () => {
    previews.forEach(p => p.classList.remove("selected"));
    preview.classList.add("selected");
    playerSprite = preview.getAttribute("data-skin");
  });
});

leftBtn.addEventListener("touchstart", () => moveLeft = true);
leftBtn.addEventListener("touchend", () => moveLeft = false);

rightBtn.addEventListener("touchstart", () => moveRight = true);
rightBtn.addEventListener("touchend", () => moveRight = false);

pauseBtn.addEventListener("click", () => {
  paused = !paused;
  document.getElementById("pauseOverlay").style.display = paused ? "flex" : "none";
});

let isJumping = false;
let jumpHeight = 100;
let jumpSpeed = 5;
let dashCooldown = false;
let dashDistance = 100;

function jumpPlayer() {
  if (isJumping) return;

  isJumping = true;
  let startY = player.offsetTop;
  let peakY = startY - jumpHeight;

  let up = setInterval(() => {
    if (player.offsetTop <= peakY) {
      clearInterval(up);
      let down = setInterval(() => {
        if (player.offsetTop >= startY) {
          clearInterval(down);
          isJumping = false;
        } else {
          player.style.top = player.offsetTop + jumpSpeed + "px";
        }
      }, 10);
    } else {
      player.style.top = player.offsetTop - jumpSpeed + "px";
    }
  }, 10);
}

function dashPlayer() {
  if (dashCooldown) return;

  let direction = moveRight ? 1 : moveLeft ? -1 : 0;
  if (direction === 0) return;

  dashCooldown = true;
  updateDashCooldownBar(0); // start empty

  let distance = 0;
  let maxDistance = 100;
  let speed = 10;

  let dashInterval = setInterval(() => {
    distance += speed;
    playerX += speed * direction;

    if (playerX < 0) playerX = 0;
    if (playerX > 350) playerX = 350;

    player.style.left = playerX + "px";

    if (distance >= maxDistance) {
      clearInterval(dashInterval);

      // Fill bar gradually over 1s
      let cooldownTime = 1000;
      let intervalTime = 50;
      let elapsed = 0;

      let fillInterval = setInterval(() => {
        elapsed += intervalTime;
        let percent = elapsed / cooldownTime;
        updateDashCooldownBar(percent);

        if (percent >= 1) {
          clearInterval(fillInterval);
          dashCooldown = false;
        }
      }, intervalTime);
    }
  }, 10);
}


jumpBtn.addEventListener("touchstart", jumpPlayer);
dashBtn.addEventListener("touchstart", dashPlayer);

const dashCooldownFill = document.getElementById("dashCooldownFill");

function updateDashCooldownBar(percent) {
  dashCooldownFill.style.transform = `scaleX(${percent})`;
}

