window.onload = function () {
  const startButton = document.getElementById("startButton");
  background.style.display = "none";
  finishScreen.style.display = "none";
  startButton.addEventListener("click", function () {
    startGame();
  });
};

function startGame() {
  background.style.display = "flex";
  firstScreen.style.display = "none";
  const heroMoving = document.querySelector(".hero");
  let positionX = 700;
  let lives = 3;
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
        if (heroBounding.right >= containerBounding.right - 10) {
          positionX = containerBounding.width - heroBounding.width - 10;
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

    if (zombieBounding.right >= containerBounding.right - 30) {
      // console.log(circleBounding.right, containerBounding.right);
      direction = -1;
    }
    if (zombieBounding.left <= containerBounding.left) {
      direction = 1;
    }
    bouncingCircleX += speed * direction;

    zombieMove.style.left = `${bouncingCircleX}px`;
    checkScore();
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

  const lifeScore = document.querySelector(".life");
  lifeScore.textContent = 3;
  let hasBeenTouch = false;

  function checkCollision() {
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
      console.log("touche");
      hasBeenTouch = true;
      setTimeout(() => {
        hasBeenTouch = false;
      }, 5000);
      lives--;
      lifeScore.textContent = lives;
      if (lives <= 0) {
        lifeScore.textContent = 0;
        console.log("game over");
        finishScreen.style.display = "flex";
        background.style.display = "none";
      }
      loveHearts[0].classList.add("hidden");
    }
  }

  let isFalling = false;

  const gifts = document.querySelector(".ironhack");
  setInterval(() => {
    gifts.classList.remove("hidden");
    let top = 0;
    let leftRandom = Math.floor(Math.random() * 650 * 2);
    function fall() {
      let fallId = setInterval(function () {
        if (top > 598) {
          clearInterval(fallId);
        }
        top += 30;
        gifts.style.top = top + "px";
      }, 20);
    }
    gifts.style.left = leftRandom + "px";
    fall();
  }, 4000);

  const scoreNumber = document.querySelector(".scoreNumber");
  scoreNumber.textContent = 0;
  let score = 0;

  function checkScore() {
    const giftsBounding = gifts.getBoundingClientRect();
    const heroBounding = heroMoving.getBoundingClientRect();

    let isInX =
      heroBounding.left + 20 < giftsBounding.right - 20 &&
      heroBounding.right - 20 > giftsBounding.left + 20;
    console.log(isInX);
    let isInY =
      heroBounding.bottom > giftsBounding.top &&
      heroBounding.top < giftsBounding.bottom;

    if (isInX && isInY) {
      // console.log("scored");
      score++;
      scoreNumber.textContent = score;
      gifts.classList.add("hidden");
    }
  }

  const LevelToDisplay = document.querySelector(".level");
  LevelToDisplay.textContent = 0;
  let Level = 0;

  setInterval(() => {
    Level++;
    LevelToDisplay.textContent = Level;
  }, 25000);
}
