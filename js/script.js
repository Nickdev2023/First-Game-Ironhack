const heroMoving = document.querySelector(".hero");
let positionX = 0;
const mainContainer = document.querySelector("#background");

const pressedKeys = { left: false, right: false };

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

setInterval(() => {
  for (const key in pressedKeys) {
    if (pressedKeys[key]) {
      move(key);
    }
  }
}, 1000 / 60);

//

function move(direction) {
  const containerBounding = mainContainer.getBoundingClientRect();
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
      if (heroBounding.right >= containerBounding.right) {
        positionX = containerBounding.width - heroBounding.width;
      } else {
        positionX += 10;
      }
      break;
  }

  heroMoving.style.left = `${positionX}px`;
}

let bottom = 0;
let gravity = 0.9;
let isJumping = false;

function jump() {
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

function control(e) {
  //console.log(e);
  if (e.key === " ") {
    jump();
  }
}
window.addEventListener("keydown", control);

const zombieMove = document.querySelector(".zombie");
let bouncingCircleX = 0;
let direction = 1;
let speed = 1;
const actionContainer = document.querySelector(".actionPart");
const containerBounding = actionContainer.getBoundingClientRect();

setInterval(() => {
  const zombieBounding = zombieMove.getBoundingClientRect();

  if (zombieBounding.right >= containerBounding.right) {
    // console.log(circleBounding.right, containerBounding.right);
    direction = -1;
  }
  if (zombieBounding.left <= containerBounding.left) {
    direction = 1;
  }
  bouncingCircleX += speed * direction;

  zombieMove.style.left = `${bouncingCircleX}px`;

  if (checkCollision()) {
    console.log("lose life");
  }
}, 1000 / 60);

let speedIIntervalId = setInterval(() => {
  speed *= 1.05;
  if (speed > 30) {
    speed = 30;
  }
  // if (bouncingCircleX > 1.5 * direction) {
  //   clearInterval(speed);
  //   // bouncingCircleX = 1.5 * direction;
  // }
}, 2000);

function checkCollision() {
  const zombieBounding = zombieMove.getBoundingClientRect();
  const heroBounding = heroMoving.getBoundingClientRect();
  let isInX =
    heroBounding.left < zombieBounding.right &&
    heroBounding.right > zombieBounding.left;

  let isInY =
    heroBounding.bottom > zombieBounding.top &&
    heroBounding.top < zombieBounding.bottom;

  if (isInX && isInY) {
    console.log("touche");
  }
}
