const startButton = document.getElementById("startButton");
startButton.addEventListener("click", function () {
  startGame();
});

/**
 * SELECTORS
 */
const zombieMove = document.querySelector(".zombie");
const actionContainer = document.querySelector(".actionPart");
const containerBounding = actionContainer.getBoundingClientRect();
const background = document.getElementById("background");
const backgroundBounding = background.getBoundingClientRect();
const lifeScore = document.querySelector(".life");
const scoreNumber = document.querySelector(".scoreNumber");
const heroMoving = document.querySelector(".hero");
const levelToDisplay = document.querySelector(".level");
const finishScreen = document.getElementById("finishScreen");
background.style.display = "none";
finishScreen.style.display = "none";

/**
 * AUDIO
 */
let giftsSounds = new Audio("./Sounds/Bell.mp3");
let backSounds = new Audio("./Sounds/BackgroundSounds.mp3");
let touchSounds = new Audio("./Sounds/hurt.mp3");
let sounds;
/**
 * INTERVALS
 */
let levelInterval;
let gameIntervalId;
let speedIntervalId;
let dropIron;
let fallId;

/**
 * HERO
 */
const pressedKeys = { left: false, right: false };
let positionX;
let bottom = 0;
let gravity = 0.9;
let isJumping = false;
let hasBeenTouch = false;
let lives;
let score;
let bouncingCircleX = 0;
let level = 0;
/**
 * ZOMBIE
 */
let direction = 1;
let speed = 1;
/**
 * GIFTS
 */
let isFalling = false;

function startGame() {
  backSounds.play();
  sounds = setInterval(() => {
    backSounds.pause();
    backSounds.currentTime = 0;
    backSounds.play();
  }, 22000);
  background.style.display = "flex";
  firstScreen.style.display = "none";
  positionX = 700;
  heroMoving.style.left = `${positionX}px`;
  lives = 5;
  lifeScore.textContent = lives;
  score = 0;
  scoreNumber.textContent = score;

  levelToDisplay.textContent = 0;

  // GAME ENGINE
  gameIntervalId = setInterval(() => {
    const zombieBounding = zombieMove.getBoundingClientRect();
    for (const key in pressedKeys) {
      if (pressedKeys[key]) {
        move(key);
      }
    }

    if (zombieBounding.right >= containerBounding.right - 30) {
      // console.log(circleBounding.right, containerBounding.right);
      direction = -1;
      zombieMove.classList.add("lefSide");
    }
    if (zombieBounding.left <= containerBounding.left) {
      direction = 1;
      zombieMove.classList.remove("lefSide");
    }
    bouncingCircleX += speed * direction;

    zombieMove.style.left = `${bouncingCircleX}px`;
    checkScore();
    if (checkCollision()) {
      console.log("lose life");
    }
  }, 1000 / 60);

  speedIntervalId = setInterval(() => {
    speed *= 1.05;
    if (speed > 30) {
      speed = 30;
    }
  }, 2000);

  dropIron = setInterval(() => {
    const gifts = document.querySelector(".ironhack");

    gifts.classList.remove("hidden");
    let top = 0;
    let leftRandom = Math.floor(
      Math.random() * backgroundBounding.width - gifts.width
    );
    function fall() {
      fallId = setInterval(function () {
        const bottomOffset = (backgroundBounding.height / 100) * 15;
        // console.log(bottomOffset, backgroundBounding);
        if (top > backgroundBounding.height - bottomOffset - gifts.height) {
          clearInterval(fallId);
        }
        top += 30;
        gifts.style.top = top + "px";
      }, 20);
    }
    gifts.style.left = leftRandom + "px ";
    fall();
  }, 4000);

  levelInterval = setInterval(() => {
    level++;
    levelToDisplay.textContent = level;
  }, 25000);
}

const finishButton = document.getElementById("finishButton");
finishButton.addEventListener("click", () => {
  // location.reload();
  // background.style.display = "none";
  finishScreen.style.display = "none";
  // firstScreen.style.display = "flex";
  // const lifeScore = document.querySelector(".life");
  lifeScore.textContent = "";
  // const scoreNumber = document.querySelector(".scoreNumber");
  // scoreNumber.textContent = "";
  const allIntervals = [
    levelInterval,
    gameIntervalId,
    speedIntervalId,
    dropIron,
    fallId,
  ];

  for (const interval of allIntervals) {
    clearInterval(interval);
  }
  console.log(allIntervals);
  level = 0;
  bottom = 0;
  isJumping = false;
  hasBeenTouch = false;
  bouncingCircleX = 0;
  direction = 1;
  speed = 1;
  isFalling = false;

  startGame();
  const loveHearts = document.querySelectorAll(".love");

  loveHearts.forEach((heart) => heart.classList.remove("hidden"));
});

function move(direction) {
  const containerBounding = background.getBoundingClientRect();
  const heroMoving = document.querySelector(".hero");

  const heroBounding = heroMoving.getBoundingClientRect();

  // console.log(containerBounding);

  switch (direction) {
    case "left":
      if (heroBounding.left <= containerBounding.left) {
        positionX = -30;
      } else {
        positionX -= 10;
      }
      break;

    case "right":
      if (heroBounding.right >= containerBounding.right - 10) {
        positionX = containerBounding.width - heroBounding.width - 10;
      } else {
        positionX += 10;
      }
      break;
  }

  heroMoving.style.left = `${positionX}px`;
}

function checkScore() {
  const heroMoving = document.querySelector(".hero");
  const gifts = document.querySelector(".ironhack");

  const giftsBounding = gifts.getBoundingClientRect();
  const heroBounding = heroMoving.getBoundingClientRect();

  let isInX =
    heroBounding.left + 20 < giftsBounding.right - 20 &&
    heroBounding.right - 20 > giftsBounding.left + 20;
  // console.log(isInX);
  let isInY =
    heroBounding.bottom > giftsBounding.top &&
    heroBounding.top < giftsBounding.bottom;

  if (isInX && isInY) {
    // console.log("scored");
    score++;
    scoreNumber.textContent = score;
    gifts.classList.add("hidden");
    giftsSounds.play();
  }
}

function jump() {
  const heroMoving = document.querySelector(".hero");

  if (isJumping) {
    return;
  }
  let timerIdUp = setInterval(function () {
    if (bottom > 250) {
      clearInterval(timerIdUp);
      let timerIdDown = setInterval(function () {
        if (bottom < 85) {
          clearInterval(timerIdDown);
          bottom = 11;
          isJumping = false;
          heroMoving.style.bottom = bottom + "vh";
          return;
        }
        bottom -= 5;
        heroMoving.style.bottom = bottom + "px";
      }, 10);
    }
    isJumping = true;
    bottom += 85;
    bottom *= gravity;
    heroMoving.style.bottom = bottom + "px";
  }, 10);
}

function checkCollision() {
  const heroMoving = document.querySelector(".hero");

  const loveHearts = document.querySelectorAll(".love:not(.hidden)");

  if (hasBeenTouch) {
    return;
  }
  const zombieBounding = zombieMove.getBoundingClientRect();
  const heroBounding = heroMoving.getBoundingClientRect();
  let isInX =
    heroBounding.left + 20 < zombieBounding.right - 20 &&
    heroBounding.right - 20 > zombieBounding.left + 20;

  let isInY =
    heroBounding.bottom > zombieBounding.top &&
    heroBounding.top < zombieBounding.bottom;
  if (isInX && isInY) {
    // console.log("touche");
    hasBeenTouch = true;
    let touchInt = setTimeout(() => {
      hasBeenTouch = false;
    }, 5000);
    lives--;
    lifeScore.textContent = lives;
    touchSounds.play();
    if (lives <= 0) {
      lifeScore.textContent = 0;
      console.log("game over");
      finishScreen.style.display = "flex";
      background.style.display = "none";
      return;
    }
    loveHearts[0].classList.add("hidden");
  }
}

function control(e) {
  //console.log(e);
  if (e.key === " ") {
    jump();
  }
}

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      pressedKeys.left = true;

      break;
    case "ArrowRight":
      pressedKeys.right = true;
      break;
  }
});
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      heroMoving.classList.add("animHero");
      heroMoving.classList.add("lefSide");

      break;
    case "ArrowRight":
      heroMoving.classList.add("animHero");
      heroMoving.classList.remove("lefSide");
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      pressedKeys.left = false;
      break;
    case "ArrowRight":
      pressedKeys.right = false;
      break;
  }
});
window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      heroMoving.classList.remove("animHero");

      break;
    case "ArrowRight":
      heroMoving.classList.remove("animHero");
      break;
  }
});
window.addEventListener("keydown", control);
