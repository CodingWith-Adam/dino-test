import Ground from "./Ground.js";
import Player from "./Player.js";
import CactiController from "./CactiController.js";
import Score from "./Score.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const GAME_SPEED_START = 1.0;
const GAME_SPEED_INCREMENT = 0.00001;

const GAME_WIDTH = 800;
const GAME_HEIGHT = 200;
const PLAYER_WIDTH = 88 / 1.5; //58
const PLAYER_HEIGHT = 94 / 1.5; // 62
const MAX_JUMP_HEIGHT = GAME_HEIGHT;
const MIN_JUMP_HEIGHT = 150;
const GROUND_WIDTH = 2400;
const GROUND_HEIGHT = 24;
const GROUND_AND_CACTUS_SPEED = 0.5;

let previousTime = null;
let gameSpeed = GAME_SPEED_START;
let gameOver = false;
let waitingToStart = true;

const CACTI_CONFIG = [
  {
    width: 48 / 1.5,
    height: 100 / 1.5,
    image: "images/cactus_1.png",
  },
  {
    width: 98 / 1.5,
    height: 100 / 1.5,
    image: "images/cactus_2.png",
  },
  {
    width: 68 / 1.5,
    height: 70 / 1.5,
    image: "images/cactus_3.png",
  },
];

let player;
let ground;
let cactiController;
let score;
let scaleRatio;

function setScreen() {
  console.log("setScreen");
  //window is wider than the game width
  if (window.innerWidth / window.innerHeight < GAME_WIDTH / GAME_HEIGHT) {
    scaleRatio = window.innerWidth / GAME_WIDTH;
  } else {
    scaleRatio = window.innerHeight / GAME_HEIGHT;
  }

  canvas.width = GAME_WIDTH * scaleRatio;
  canvas.height = GAME_HEIGHT * scaleRatio;

  const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
  const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
  const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
  const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;

  const groundHeightInGame = GROUND_HEIGHT * scaleRatio;
  const groundWidthInGame = GROUND_WIDTH * scaleRatio;

  console.log("height", groundHeightInGame);
  console.log("width", groundWidthInGame);
  console.log("scale", scaleRatio);

  const cactiImages = CACTI_CONFIG.map((cactus) => {
    const image = new Image();
    image.src = cactus.image;

    return {
      image,
      width: cactus.width * scaleRatio,
      height: cactus.height * scaleRatio,
    };
  });

  cactiController = new CactiController(
    ctx,
    cactiImages,
    scaleRatio,
    GROUND_AND_CACTUS_SPEED
  );

  player = new Player(
    ctx,
    playerWidthInGame,
    playerHeightInGame,
    minJumpHeightInGame,
    maxJumpHeightInGame,
    scaleRatio
  );
  ground = new Ground(
    ctx,
    groundWidthInGame,
    groundHeightInGame,
    scaleRatio,
    GROUND_AND_CACTUS_SPEED
  );

  score = new Score(ctx, scaleRatio);
}

setScreen();

window.addEventListener("resize", () => setTimeout(setScreen, 4000));

// screen.orientation.addEventListener("change", setScreen);

function clearScreen() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function startGameText() {
  const fontSize = 40 * scaleRatio;
  ctx.font = `${fontSize}px serif`;
  ctx.fillStyle = "green";
  const x = canvas.width / 8;
  const y = canvas.height / 2;
  ctx.fillText("Tap Screen or Press Space To Start", x, y);
}

let hasSetRestartEvents = false;
function setGameOver() {
  const fontSize = 40 * scaleRatio;
  ctx.font = `${fontSize}px serif`;
  ctx.fillStyle = "red";
  const x = canvas.width / 3.5;
  const y = canvas.height / 2;
  ctx.fillText("GAME OVER", x, y);

  if (!hasSetRestartEvents) {
    hasSetRestartEvents = true;

    setTimeout(() => {
      document.addEventListener("keyup", reset, { once: true });
      document.addEventListener("touchstart", reset, { once: true });
    }, 1000);
  }
}

function updateGameSpeed(frameTimeDelta) {
  gameSpeed += gameSpeed * GAME_SPEED_INCREMENT * frameTimeDelta;
  console.log(gameSpeed);
}

function gameLoop(currentTime) {
  clearScreen();
  if (previousTime === null) {
    previousTime = currentTime;
    requestAnimationFrame(gameLoop);
    return;
  }

  const frameTimeDelta = currentTime - previousTime;
  previousTime = currentTime;

  if (!gameOver && !waitingToStart) {
    ground.update(gameSpeed, frameTimeDelta);
    cactiController.update(gameSpeed, frameTimeDelta);
    player.update(gameSpeed, frameTimeDelta);
    score.update(frameTimeDelta);
    updateGameSpeed(frameTimeDelta);
  }

  if (cactiController.collideWith(player)) {
    gameOver = true;
    setGameOver();
    score.setHighScore();
  }

  if (waitingToStart) {
    startGameText();
  }

  ground.draw();
  cactiController.draw();
  player.draw();
  score.draw(frameTimeDelta);

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

const reset = () => {
  waitingToStart = false;
  hasSetRestartEvents = false;
  if (gameOver) {
    player.reset();
    ground.reset();
    score.reset();
    cactiController.reset();
    gameOver = false;
    gameSpeed = GAME_SPEED_START;
  }
};

document.addEventListener("keyup", reset, { once: true });
document.addEventListener("touchstart", reset, { once: true });
