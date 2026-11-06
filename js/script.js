document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("taskList");
  const form = document.getElementById("addTaskForm");
  const input = document.getElementById("taskInput");
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const progressPercent = document.getElementById("progressPercent");
  const toast = document.getElementById("toast");
  let filter = "all";
  let toastTimer;

  function showToast(message) {
    toast.textContent = message; toast.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
  }
  function render() {
    const tasks = Checklist.getTasks();
    list.innerHTML = "";
    tasks.forEach((task, index) => {
      if (filter === "open" && task.done || filter === "done" && !task.done) return;
      const li = document.createElement("li"); li.className = `task${task.done ? " completed" : ""}`;
      const checkbox = document.createElement("input"); checkbox.type = "checkbox"; checkbox.checked = task.done; checkbox.id = `task-${index}`;
      checkbox.setAttribute("aria-label", `Mark ${task.text} ${task.done ? "incomplete" : "complete"}`);
      checkbox.addEventListener("change", () => { Checklist.toggle(index); render(); if (task.done) showToast("One less thing to worry about ✨"); });
      const label = document.createElement("label"); label.htmlFor = checkbox.id; label.textContent = task.text;
      const del = document.createElement("button"); del.className = "delete-task"; del.type = "button"; del.textContent = "×"; del.title = "Delete task"; del.setAttribute("aria-label", `Delete ${task.text}`);
      del.addEventListener("click", () => { Checklist.remove(index); render(); showToast("Task removed"); });
      li.append(checkbox,label,del); list.appendChild(li);
    });
    const done = tasks.filter(t => t.done).length, total = tasks.length, percent = total ? Math.round(done/total*100) : 0;
    progressText.textContent = `${done} of ${total} completed`; progressPercent.textContent = `${percent}%`; progressBar.style.width = `${percent}%`;
  }
  form.addEventListener("submit", e => { e.preventDefault(); const value = input.value.trim(); if (!value) return; Checklist.add(value); input.value = ""; render(); showToast("Added to your checklist 💗"); });
  document.querySelectorAll(".filter").forEach(btn => btn.addEventListener("click", () => { filter = btn.dataset.filter; document.querySelectorAll(".filter").forEach(b => b.classList.toggle("active", b === btn)); render(); }));
  document.getElementById("resetTasks").addEventListener("click", () => { if (confirm("Reset all checklist items to the original list?")) { Checklist.reset(); filter = "all"; document.querySelectorAll(".filter").forEach(b => b.classList.toggle("active", b.dataset.filter === "all")); render(); showToast("Checklist reset"); } });
  document.getElementById("messageBtn").addEventListener("click", () => document.getElementById("personalNote").classList.toggle("hidden"));
  document.getElementById("changeDate").addEventListener("click", () => {
    const current = new Date(Countdown.getDate()); const value = prompt("Enter countdown date (YYYY-MM-DD):", current.toISOString().slice(0,10));
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00`).getTime())) { Countdown.setDate(`${value}T00:00:00`); updateCountdown(); showToast("Countdown date updated"); }
    else if (value) showToast("Please use YYYY-MM-DD");
  });
  function updateCountdown() {
    const p = Countdown.parts(); const el = document.getElementById("countdown");
    if (p.ended) { el.innerHTML = '<div class="countdown-ended">It’s time to celebrate! 🪔</div>'; }
    else el.innerHTML = `<div><strong>${p.days}</strong><span>Days</span></div><div><strong>${String(p.hours).padStart(2,"0")}</strong><span>Hours</span></div><div><strong>${String(p.minutes).padStart(2,"0")}</strong><span>Minutes</span></div><div><strong>${String(p.seconds).padStart(2,"0")}</strong><span>Seconds</span></div>`;
    document.getElementById("dateLabel").textContent = new Date(Countdown.getDate()).toLocaleDateString(undefined,{day:"numeric",month:"long",year:"numeric"});
  }
  render(); updateCountdown(); setInterval(updateCountdown,1000);

  // Little love quiz — playful questions, no wrong answers.
  const quiz = [
    { q: "What makes a journey unforgettable?", a: ["The destination", "The people beside us", "The snacks"], sweet: "The people make every journey special. ❤️" },
    { q: "What is the best part of going home for Diwali?", a: ["Family time", "Festive food", "All the little moments"], sweet: "It's all those little moments that become memories. 🪔" },
    { q: "What should always travel with you?", a: ["A smile", "A camera", "A playlist"], sweet: "A smile makes every place brighter. 😊" },
    { q: "A little wish for your journey?", a: ["Safe travels", "Lots of happiness", "Both, of course!"], sweet: "You deserve both, and so much more. 💗" }
  ];
  let quizIndex = 0;
  const quizQuestion = document.getElementById("quizQuestion");
  const quizOptions = document.getElementById("quizOptions");
  const quizFeedback = document.getElementById("quizFeedback");
  const startQuiz = document.getElementById("startQuiz");
  function showQuizQuestion() {
    const item = quiz[quizIndex];
    quizQuestion.textContent = item.q;
    quizOptions.innerHTML = "";
    quizFeedback.textContent = "";
    item.a.forEach(answer => {
      const option = document.createElement("button");
      option.type = "button"; option.className = "quiz-option"; option.textContent = answer;
      option.addEventListener("click", () => {
        quizFeedback.textContent = item.sweet;
        quizOptions.querySelectorAll("button").forEach(button => button.disabled = true);
        quizIndex += 1;
        startQuiz.textContent = quizIndex < quiz.length ? "Next question →" : "Play again ↻";
        startQuiz.classList.remove("hidden");
      });
      quizOptions.appendChild(option);
    });
    startQuiz.classList.add("hidden");
  }
  startQuiz.addEventListener("click", () => {
    if (quizIndex >= quiz.length) quizIndex = 0;
    if (quizFeedback.textContent && quizIndex < quiz.length) showQuizQuestion();
    else showQuizQuestion();
  });

  // Pick-a-heart messages.
  document.querySelectorAll(".heart-pick").forEach(heart => {
    heart.addEventListener("click", () => {
      document.querySelectorAll(".heart-pick").forEach(item => item.classList.remove("picked"));
      heart.classList.add("picked");
      document.getElementById("heartMessage").textContent = heart.dataset.message;
    });
  });

  // Shayari carousel and gently rotating thoughts.
  const shayaris = [
    "राहें खूबसूरत हों, मंज़िल का नज़ारा प्यारा हो,\nहर कदम पर खुशियाँ हों, और अपनों का सहारा हो।",
    "दूरियाँ चाहे जितनी हों, दिलों में प्यार रहता है,\nअपनों की यादों से हर सफ़र गुलज़ार रहता है।",
    "दीयों की रोशनी से आपका हर कल रोशन रहे,\nखुशियों की दस्तक से आपका आँगन मगन रहे।",
    "घर की चौखट, अपनों की मुस्कान, और त्योहार की बहार,\nआपकी दिवाली में शामिल हों खुशियाँ बेशुमार।"
  ];
  let shayariIndex = 0;
  document.getElementById("nextShayari").addEventListener("click", () => {
    shayariIndex = (shayariIndex + 1) % shayaris.length;
    document.getElementById("shayariText").textContent = shayaris[shayariIndex];
  });
  const thoughts = [
    "Some journeys take you home; some bring you closer to the people who feel like home.",
    "May your days be bright, your heart be light, and your memories last forever. ✨",
    "The best gifts are not things, but moments we wish could last a little longer. ❤️",
    "Wherever you go, may a little happiness follow you like sunshine."
  ];
  let thoughtIndex = 0;
  setInterval(() => {
    thoughtIndex = (thoughtIndex + 1) % thoughts.length;
    const thought = document.getElementById("thoughtText");
    thought.classList.add("thought-fade");
    setTimeout(() => { thought.textContent = thoughts[thoughtIndex]; thought.classList.remove("thought-fade"); }, 220);
  }, 6500);


  
/* ============================
   LADDOO CATCHING GAME
============================ */

const gameArea = document.getElementById("laddooGameArea");
const plate = document.getElementById("gamePlate");

let score = 0;
let gameTime = 30;
let platePosition = 50;
let gameRunning = false;
let gameTimer;
let laddooSpawner;
let fallingLaddoos = [];

function movePlate(direction) {
  if (!gameRunning) return;

  platePosition = Math.max(
    8,
    Math.min(92, platePosition + direction * 7)
  );

  plate.style.left = platePosition + "%";
}

document.getElementById("moveLeft").addEventListener("click", () => {
  movePlate(-1);
});

document.getElementById("moveRight").addEventListener("click", () => {
  movePlate(1);
});

document.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") movePlate(-1);
  if (event.key === "ArrowRight") movePlate(1);
});

function spawnLaddoo() {
  if (!gameRunning) return;

  const laddoo = document.createElement("div");
  laddoo.className = "falling-laddoo";
  laddoo.textContent = "🟠";
  laddoo.style.left = Math.random() * 90 + "%";

  gameArea.appendChild(laddoo);

  const item = {
    element: laddoo,
    x: parseFloat(laddoo.style.left),
    y: -35
  };

  fallingLaddoos.push(item);
}

function updateLaddoos() {
  fallingLaddoos.forEach((item, index) => {
    item.y += 3;
    item.element.style.top = item.y + "px";

    const caught =
      item.y > 205 &&
      item.y < 260 &&
      Math.abs(item.x - platePosition) < 13;

    if (caught) {
      score++;
      document.getElementById("laddooScore").textContent = score;
      item.element.remove();
      fallingLaddoos.splice(index, 1);
      return;
    }

    if (item.y > 290) {
      item.element.remove();
      fallingLaddoos.splice(index, 1);
    }
  });

  if (gameRunning) {
    requestAnimationFrame(updateLaddoos);
  }
}

function startLaddooGame() {
  if (gameRunning) return;

  score = 0;
  gameTime = 30;
  platePosition = 50;
  gameRunning = true;
  fallingLaddoos = [];

  document.getElementById("laddooScore").textContent = "0";
  document.getElementById("laddooTime").textContent = "30";
  document.getElementById("laddooGameMessage").textContent =
    "Catch those laddoos! 🟠";

  plate.style.left = "50%";

  gameArea.querySelectorAll(".falling-laddoo").forEach(el => el.remove());

  laddooSpawner = setInterval(spawnLaddoo, 850);
  gameTimer = setInterval(() => {
    gameTime--;
    document.getElementById("laddooTime").textContent = gameTime;

    if (gameTime <= 0) {
      stopLaddooGame();
    }
  }, 1000);

  updateLaddoos();
}

function stopLaddooGame() {
  gameRunning = false;
  clearInterval(gameTimer);
  clearInterval(laddooSpawner);

  document.getElementById("laddooGameMessage").textContent =
    `Amazing! You caught ${score} laddoos! ❤️`;

  fallingLaddoos.forEach(item => item.element.remove());
  fallingLaddoos = [];
}

document.getElementById("startLaddooGame")
  .addEventListener("click", startLaddooGame);


/* ============================
   DANCE ANIMATION
============================ */

const danceStage = document.getElementById("danceStage");
const danceToggle = document.getElementById("danceToggle");

danceToggle.addEventListener("click", () => {
  const dancing = danceStage.classList.toggle("dancing");

  danceToggle.textContent = dancing
    ? "Stop Dancing 💗"
    : "Start Dancing ✨";

  document.getElementById("danceMessage").textContent = dancing
    ? "Dance like nobody is watching! 💃"
    : "The dance floor is waiting for you!";
});


/* ============================
   RANGOLI COLOUR CHANGE
============================ */

const rangoliColors = [
  ["#e84a76", "#6b4ab5", "#f2a52c"],
  ["#16a085", "#f39c12", "#e84393"],
  ["#2980b9", "#8e44ad", "#f1c40f"],
  ["#e74c3c", "#27ae60", "#3498db"]
];

let rangoliIndex = 0;

document.getElementById("changeRangoli")
  .addEventListener("click", () => {

    rangoliIndex = (rangoliIndex + 1) % rangoliColors.length;

    const colors = rangoliColors[rangoliIndex];

    document.querySelector(".ring-one").style.borderColor = colors[0];
    document.querySelector(".ring-two").style.borderColor = colors[1];
    document.querySelector(".ring-three").style.borderColor = colors[2];

    document.querySelectorAll(".rangoli-petal").forEach(petal => {
      petal.style.background = colors[0];
    });
  });


/* ============================
   TRAIN ARRIVAL
============================ */

const train = document.getElementById("diwaliTrain");
const trainButton = document.getElementById("trainButton");

trainButton.addEventListener("click", () => {
  train.classList.remove("arriving");

  // Restart animation
  void train.offsetWidth;

  train.classList.add("arriving");

  document.getElementById("trainMessage").textContent =
    "All aboard! Your Diwali journey is here! 🚂❤️";
});

train.addEventListener("animationend", () => {
  document.getElementById("trainMessage").textContent =
    "Welcome home! Happy Diwali! 🪔";
});



});