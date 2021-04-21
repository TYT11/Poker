let cards = [
  "2C",
  "2C",
  "3C",
  "3C",
  "4D",
  "4D",
  "8C",
  "8C",
  "11H",
  "11H",
  "AC",
  "AC",
  "10S",
  "10S",
  "6D",
  "6D",
  "7H",
  "7H",
  "9D",
  "9D",
  "10C",
  "10C",
  "8D",
  "8D",
  "5D",
  "5D",
  "6D",
  "6D",
  "10H",
  "10H",
  "6H",
  "6H",
  "AH",
  "AH",
  "AS",
  "AS",
  "JC",
  "JC",
  "JD",
  "JD",
];
const missions = [6, 7, 8, 9, 10, 12, 15];
const triggers = [
  "小子你到底行不行？",
  "要幫忙代購銀杏嗎？",
  "我先去睡一下。",
  "你回家練練再來！",
  "怎麼比我這個老人糊塗。",
  "就在那！還找不到？真是！",
  "你還是去玩沙吧。",
  "晚餐吃什麼好呢？",
  "到了再叫醒我。",
];
const cardpool = document.getElementById("cardpool");

let currentMission = null;
let currentTrigger = "";
let errorTurns = 0;
let openCards = [];
let challengeAccepted = false;
let lost = false;
let unmatching = false;

function startGame() {
  if (document.getElementsByClassName("card").length > 1) {
    document.querySelectorAll(".card").forEach((node) => node.remove());
  }

  document.getElementsByTagName("body")[0].style.overflow = "hidden";
  const shuffledCards = shuffle(cards);
  assignMission();
  document.getElementById("accept").addEventListener("click", acceptChallenge);

  shuffledCards.forEach((card) => {
    let cardTag = document.createElement("div");
    cardTag.classList.add("card", "open");
    cardTag.dataset.value = card;
    cardTag.innerHTML = `<img class="cardBack" src="./public/svg/${card}.svg" /><img class="cardCover" src=./public/svg/Card_back.svg />`;
    cardpool.appendChild(cardTag);
  });
}

function acceptChallenge() {
  challengeAccepted = true;
  document.getElementsByTagName("body")[0].style.overflow = "auto";
  document.getElementById("mission").style.visibility = "hidden";
  setTimeout(() => {
    document.querySelectorAll(".card").forEach((card) => {
      card.classList.remove("open");
      card.addEventListener("click", handleMatch);
    });
  }, 10000);
}

function shuffle(arr) {
  let elementIdx = arr.length,
    randomIdx,
    temp;

  while (elementIdx !== 0) {
    randomIdx = getRandom(arr);
    elementIdx -= 1;
    temp = arr[randomIdx];
    arr[randomIdx] = arr[elementIdx];
    arr[elementIdx] = temp;
  }

  return arr;
}

function openCard() {}

function handleMatch(e) {
  if (e.currentTarget.classList.contains("open") || unmatching || lost) return;

  if (openCards.length < 2) {
    e.currentTarget.classList.add("open");
    openCards.push(e.currentTarget);
  }

  if (openCards.length === 2) {
    e.currentTarget.classList.add("open");

    const firstCard = openCards[0].dataset.value;
    const secondCard = openCards[1].dataset.value;

    if (firstCard === secondCard) {
      openCards.forEach((card) => {
        card.removeEventListener("click", handleMatch);
        openCards = [];
        setTimeout(() => {
          card.classList.add("fade");
        }, 1000);
      });
    } else {
      unmatching = true;
      errorTurns++;
      const error = document.getElementById("error");
      if (errorTurns <= currentMission) {
        assignTrigger();
        error.innerHTML = `錯誤：${errorTurns}`;
      } else {
        gameOver();
        errorTurns = 0;
        error.innerHTML = `錯誤：${errorTurns}`;
      }
      setTimeout(() => {
        handleUnmatch();
        unmatching = false;
      }, 1000);
    }
  }
}

function handleUnmatch() {
  openCards.forEach((card) => {
    card.classList.remove("open");
  });
  openCards = [];
}

function assignMission() {
  const mission = document.getElementById("mission");
  const missionNum = getRandom(missions);
  currentMission = missions[missionNum];
  mission.innerHTML = `<div class="mission-title">本次挑戰</div>10 秒看牌，錯誤 ${currentMission} 次內配對所有牌卡 <button id="accept">接受挑戰</button>`;
  mission.style.visibility = "visible";
}

function assignTrigger() {
  const trigger = document.getElementById("trigger");
  if (!errorTurns) {
    trigger.innerHTML = `<div></div>`;
    return;
  }
  const triggerNum = getRandom(triggers);
  currentTrigger = triggers[triggerNum];
  trigger.innerHTML = `<img id="bean" src=./public/svg/bean.svg><div class="trigger-inner"><div class="trigger-text">${currentTrigger}</div></div>`;
  trigger.visibility = "visible";
}

function getRandom(arr) {
  if (arr.length === 0) return [];
  const arrTotal = arr.length - 1;
  const randomNum = (Math.random() * arrTotal).toFixed(0);
  return randomNum;
}

function gameOver() {
  lost = true;
  const restart = document.getElementById("restart");
  document.getElementById(
    "trigger"
  ).innerHTML = `<img id="bean" src=./public/svg/bean.svg><div class="trigger-inner"><div class="trigger-text">看來你不過如此而已！</div></div>`;
  restart.style.visibility = "visible";
  restart.innerHTML =
    '<div class="mission-title">幫你QQ</div>再挑戰一次？ <button id="restart-accept">重新開始</button>';
  document.getElementById("restart-accept").addEventListener("click", () => {
    restart.style.visibility = "hidden";
    lost = false;
    assignTrigger();
    startGame();
  });
}

window.onload = startGame();
