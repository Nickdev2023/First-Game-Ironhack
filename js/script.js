const heroMoving = document.querySelector(".hero");
let positionX = 0;
const mainContainer = document.querySelector(".background");

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
  const containerBounding = background.getBoundingClientRect();
  const heroBounding = heroMoving.getBoundingClientRect();

  switch (direction) {
    case "left":
      if (heroBounding.left <= containerBounding.left) {
        x = 0;
      } else {
        positionX -= 5;
      }
      break;

    case "right":
      if (heroBounding.right >= containerBounding.right) {
        x = containerBounding.width - heroBounding.width;
      } else {
        positionX += 5;
      }
      break;
  }

  heroMoving.style.left = `${positionX}px`;
}
