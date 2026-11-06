document.addEventListener("DOMContentLoaded", () => {
  const diyaIntro = document.getElementById("diyaIntro");
  const lightWelcomeDiya = document.getElementById("lightWelcomeDiya");
  const mainPage = document.querySelector("main.page");
  document.documentElement.classList.add("intro-active");
  if (typeof diyaIntro.showModal === "function") {
    diyaIntro.showModal();
  } else {
    diyaIntro.setAttribute("open", "");
  }
  diyaIntro.addEventListener("cancel", event => event.preventDefault());
  diyaIntro.addEventListener("close", () => document.documentElement.classList.remove("intro-active"), { once: true });
  lightWelcomeDiya.addEventListener("click", () => {
    lightWelcomeDiya.disabled = true;
    diyaIntro.classList.add("is-lighting");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bloomDelay = reducedMotion ? 0 : 280;
    const revealDelay = reducedMotion ? 0 : 1750;
    window.setTimeout(() => diyaIntro.classList.add("is-lit"), bloomDelay);
    window.setTimeout(() => {
      diyaIntro.close();
      mainPage.setAttribute("tabindex", "-1");
      mainPage.focus({ preventScroll: true });
      mainPage.addEventListener("blur", () => mainPage.removeAttribute("tabindex"), { once: true });
    }, revealDelay);
  });

  const secretCard = document.getElementById("secretCard");
  const secretCardInside = document.getElementById("secretCardMessage");
  const secretWishCopy = secretCardInside.querySelector(".secret-wish-copy");
  const secretWishCount = document.getElementById("secretWishCount");
  const secretWishes = [
    "May your home glow with laughter, your heart feel light, and your days be as sweet as a box of mithai. You make the world brighter just by being in it. Happy Diwali! 🪔❤️",
    "May every diya you light bring a little more peace, hope, and happiness into your life. Shubh Deepavali! ✨",
    "Wishing you a festival full of warm hugs, favorite sweets, and memories you will keep glowing all year. 💛",
    "May your dreams sparkle brighter than the fireworks and your heart always find its way home. Happy Diwali! 🎆",
    "You are someone’s reason to smile. May this Diwali bring that same joy right back to you. 🌼",
    "May prosperity find your doorstep, laughter fill every room, and love stay long after the diyas glow. 🪔",
    "Here’s to new beginnings, kind people, second helpings of dessert, and a year full of little miracles. 💫",
    "May the light within you shine gently and brightly, wherever your journey takes you. Happy Diwali! 🧡",
    "Sending you a pocketful of festive cheer, a plate of mithai, and the biggest Diwali hug. 🤗",
    "May your celebrations be colorful, your worries be small, and your heart be surrounded by your favorite people. 🌈",
    "May every rangoli bring beauty to your doorstep and every new day bring something lovely to your life. 🌸",
    "A little reminder for the festival of lights: you are loved, you are cherished, and you make life brighter. Happy Diwali! ❤️"
  ];
  let secretWishIndex = 0;
  function showSecretWish() {
    secretWishIndex = (secretWishIndex + 1) % secretWishes.length;
    secretWishCopy.textContent = secretWishes[secretWishIndex];
    secretWishCount.textContent = `Wish ${secretWishIndex + 1} of ${secretWishes.length}`;
    secretCard.classList.add("is-open");
    secretCard.setAttribute("aria-expanded", "true");
    secretCardInside.setAttribute("aria-hidden", "false");
    secretCard.setAttribute("aria-label", "Close your secret Diwali card");
  }
  secretCard.addEventListener("click", () => {
    const opened = secretCard.classList.toggle("is-open");
    secretCard.setAttribute("aria-expanded", String(opened));
    secretCardInside.setAttribute("aria-hidden", String(!opened));
    secretCard.setAttribute("aria-label", opened ? "Close your secret Diwali card" : "Open your secret Diwali card");
  });
  document.getElementById("nextSecretWish").addEventListener("click", showSecretWish);

  const list = document.getElementById("taskList");
  const form = document.getElementById("addTaskForm");
  const input = document.getElementById("taskInput");
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const progressPercent = document.getElementById("progressPercent");
  const progressTrack = document.querySelector(".progress-track");
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
    progressTrack.setAttribute("aria-valuenow", String(percent));
  }
  form.addEventListener("submit", e => { e.preventDefault(); const value = input.value.trim(); if (!value) return; Checklist.add(value); input.value = ""; render(); showToast("Added to your checklist 💗"); });
  document.querySelectorAll(".filter").forEach(btn => btn.addEventListener("click", () => {
    filter = btn.dataset.filter;
    document.querySelectorAll(".filter").forEach(button => {
      const active = button === btn;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    render();
  }));
  document.getElementById("resetTasks").addEventListener("click", () => { if (confirm("Reset all checklist items to the original list?")) { Checklist.reset(); filter = "all"; document.querySelectorAll(".filter").forEach(button => { const active = button.dataset.filter === "all"; button.classList.toggle("active", active); button.setAttribute("aria-pressed", String(active)); }); render(); showToast("Checklist reset"); } });
  document.getElementById("messageBtn").addEventListener("click", () => document.getElementById("personalNote").classList.toggle("hidden"));
  const countdownDate = document.getElementById("countdownDate");
  countdownDate.value = Countdown.getDate().slice(0, 10);
  countdownDate.addEventListener("change", () => {
    const value = countdownDate.value;
    if (!value) return;
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
      Countdown.setDate(`${value}T00:00:00`);
      updateCountdown();
      showToast("Countdown date updated");
    } else {
      countdownDate.value = Countdown.getDate().slice(0, 10);
      showToast("Please choose a valid date");
    }
  });
  function updateCountdown() {
    const p = Countdown.parts(); const el = document.getElementById("countdown");
    if (p.ended) { el.innerHTML = '<div class="countdown-ended">It’s time to celebrate! 🪔</div>'; }
    else el.innerHTML = `<div><strong>${p.days}</strong><span>Days</span></div><div><strong>${String(p.hours).padStart(2,"0")}</strong><span>Hours</span></div><div><strong>${String(p.minutes).padStart(2,"0")}</strong><span>Minutes</span></div><div><strong>${String(p.seconds).padStart(2,"0")}</strong><span>Seconds</span></div>`;
  }
  render(); updateCountdown(); setInterval(updateCountdown,1000);

  const tripForm = document.getElementById("tripForm");
  const tripStatus = document.getElementById("tripStatus");
  const tripFields = {
    destination: document.getElementById("tripDestination"),
    date: document.getElementById("tripDate"),
    transport: document.getElementById("tripTransport"),
    companion: document.getElementById("tripCompanion")
  };
  try {
    const savedTrip = localStorage.getItem("diwaliTripDetails_v1");
    if (savedTrip) {
      const details = JSON.parse(savedTrip);
      if (details && typeof details === "object") {
        Object.keys(tripFields).forEach(key => {
          if (typeof details[key] === "string") tripFields[key].value = details[key];
        });
        tripStatus.textContent = "Your saved trip details are ready to update.";
      }
    }
  } catch (error) {
    console.error("Could not load saved trip details.", error);
    tripStatus.textContent = "Saved trip details could not be loaded on this device.";
  }
  tripForm.addEventListener("submit", event => {
    event.preventDefault();
    const details = Object.fromEntries(
      Object.entries(tripFields).map(([key, field]) => [key, field.value.trim()])
    );
    try {
      localStorage.setItem("diwaliTripDetails_v1", JSON.stringify(details));
      tripStatus.textContent = `Trip saved: ${details.destination}${details.date ? ` on ${new Date(`${details.date}T00:00:00`).toLocaleDateString()}` : ""}.`;
      showToast("Your trip details are saved ✨");
    } catch (error) {
      console.error("Could not save trip details.", error);
      tripStatus.textContent = "Your trip could not be saved. Please check your browser storage settings.";
    }
  });

  let sweetStatusTimer;
  const sweetRainLayer = document.getElementById("sweetRainLayer");
  document.querySelectorAll(".sweet-rain-button").forEach(button => {
    button.addEventListener("click", () => {
      const card = button.closest(".sweet-card");
      const sweet = card.dataset.sweetRain;
      const sweetName = card.querySelector("h3").textContent;
      const status = document.getElementById("sweetRainStatus");
      status.textContent = `A page-wide shower of ${sweetName} is on its way!`;
      clearTimeout(sweetStatusTimer);
      sweetStatusTimer = setTimeout(() => {
        status.textContent = "Pick your favourite sweet and make it rain across the whole page!";
      }, 1800);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      sweetRainLayer.replaceChildren();
      for (let index = 0; index < 28; index++) {
        const drop = document.createElement("span");
        drop.className = "sweet-drop";
        drop.textContent = sweet;
        drop.style.setProperty("--sweet-x", `${Math.random() * 96 + 2}%`);
        drop.style.setProperty("--sweet-delay", `${Math.random() * 700}ms`);
        drop.style.setProperty("--sweet-duration", `${1400 + Math.random() * 900}ms`);
        drop.addEventListener("animationend", () => drop.remove(), { once: true });
        sweetRainLayer.appendChild(drop);
      }
    });
  });

  const fortunes = [
    "Your smile will outshine every Diwali light—and someone may save you the biggest laddoo.",
    "A happy surprise is on its way. It might be a hug, a gift, or the last piece of barfi.",
    "Your kindness will travel farther than any firework. Keep spreading that sparkle.",
    "This Diwali, good company and great snacks are written in your stars.",
    "A bright idea will find you soon. Keep a little room in your bag for extra sweets.",
    "Your festive superpower is making everyone feel at home. Expect bonus hugs.",
    "A little adventure is coming your way—and the directions probably lead to dessert.",
    "The diya predicts laughter, lovely memories, and absolutely no sharing of your favourite sweet.",
    "Your good luck is glowing. May your celebrations be joyful and your phone battery full.",
    "A wonderful moment is waiting around the corner. It may be wearing a very festive outfit.",
    "A warm welcome and a table full of treats are heading your way.",
    "Your kindness will return to you in smiles, hugs, and extra helpings.",
    "The stars say your next happy memory is closer than you think.",
    "This season brings bright ideas, brighter lights, and excellent snacks.",
    "Your festive sparkle is contagious. Share it generously!",
    "A lovely surprise is on its way—keep your heart and your sweet box open.",
    "May every mile bring you closer to laughter, love, and home.",
    "A little patience today brings a big reason to celebrate tomorrow.",
    "Your Diwali wish has been heard. Keep smiling while the magic gets ready.",
    "You will find joy in the little things—and maybe a hidden mithai box.",
    "Someone is lucky to celebrate with you. That someone might be everyone!",
    "Expect a day full of colour, kind words, and happy reunions.",
    "Your light makes every room feel more like home.",
    "Good fortune follows a generous heart—and you have one.",
    "Your next adventure comes with music, memories, and a snack break.",
    "May your celebrations be peaceful, bright, and full of togetherness.",
    "A happy ending to your journey is already waiting with a diya lit for you."
  ];
  let lastFortuneIndex = -1;
  const fortuneForm = document.getElementById("fortuneForm");
  const fortuneName = document.getElementById("fortuneName");
  const fortuneResult = document.getElementById("fortuneResult");
  const fortuneCard = document.querySelector(".fortune-card");
  fortuneForm.addEventListener("submit", event => {
    event.preventDefault();
    const name = fortuneName.value.trim();
    if (!name) {
      fortuneName.focus();
      fortuneResult.textContent = "Add your name first, and the fortune diya will have a look.";
      return;
    }

    let fortuneIndex = Math.floor(Math.random() * fortunes.length);
    if (fortunes.length > 1 && fortuneIndex === lastFortuneIndex) {
      fortuneIndex = (fortuneIndex + 1) % fortunes.length;
    }
    lastFortuneIndex = fortuneIndex;
    fortuneResult.textContent = `${name}, ${fortunes[fortuneIndex]}`;
    fortuneResult.classList.remove("fortune-pop");
    void fortuneResult.offsetWidth;
    fortuneResult.classList.add("fortune-pop");
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const sparkles = ["✨", "🌟", "🪔", "💫"];
      for (let index = 0; index < 18; index++) {
        const sparkle = document.createElement("span");
        sparkle.className = "fortune-confetti";
        sparkle.textContent = sparkles[index % sparkles.length];
        sparkle.style.setProperty("--confetti-x", `${Math.random() * 100}%`);
        sparkle.style.setProperty("--confetti-delay", `${Math.random() * 250}ms`);
        sparkle.addEventListener("animationend", () => sparkle.remove(), { once: true });
        fortuneCard.appendChild(sparkle);
      }
    }
  });

  const funnySound = document.getElementById("funnySound");
  const soundNote = document.querySelector(".sound-note");
  funnySound.addEventListener("click", async () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      soundNote.textContent = "This browser does not support the celebration sound.";
      return;
    }

    funnySound.disabled = true;
    let audio;
    try {
      audio = new AudioContext();
      await audio.resume();
      const oscillator = audio.createOscillator();
      const volume = audio.createGain();
      const now = audio.currentTime;
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(523.25, now);
      oscillator.frequency.setValueAtTime(659.25, now + 0.12);
      oscillator.frequency.setValueAtTime(783.99, now + 0.24);
      oscillator.frequency.setValueAtTime(1046.5, now + 0.36);
      oscillator.frequency.setValueAtTime(783.99, now + 0.5);
      volume.gain.setValueAtTime(0.0001, now);
      volume.gain.exponentialRampToValueAtTime(0.07, now + 0.025);
      volume.gain.exponentialRampToValueAtTime(0.0001, now + 0.72);
      oscillator.connect(volume);
      volume.connect(audio.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.73);
      soundNote.textContent = "A sweet little Diwali tune just for you! 🎵";
      oscillator.addEventListener("ended", () => {
        audio.close().catch(error => console.error("Could not close the sound player.", error));
        funnySound.disabled = false;
      }, { once: true });
    } catch (error) {
      console.error("Could not play the celebration sound.", error);
      soundNote.textContent = "The sound could not play. Check your device audio settings and try again.";
      if (audio && audio.state !== "closed") {
        audio.close().catch(closeError => console.error("Could not close the sound player.", closeError));
      }
      funnySound.disabled = false;
    }
  });

  const memoryGrid = document.getElementById("memoryGrid");
  const memoryTiles = Array.from(memoryGrid.querySelectorAll(".memory-tile"));
  const memoryMoves = document.getElementById("memoryMoves");
  const memoryPairs = document.getElementById("memoryPairs");
  const memoryStatus = document.getElementById("memoryStatus");
  let revealedTiles = [];
  let matchedPairs = 0;
  let moves = 0;
  let memoryLocked = false;
  let mismatchTimer;

  function shuffleMemoryCards() {
    const symbols = memoryTiles.map(tile => tile.dataset.symbol);
    for (let index = symbols.length - 1; index > 0; index--) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [symbols[index], symbols[swapIndex]] = [symbols[swapIndex], symbols[index]];
    }
    memoryTiles.forEach((tile, index) => {
      tile.dataset.symbol = symbols[index];
      tile.textContent = "?";
      tile.classList.remove("revealed", "matched");
      tile.disabled = false;
      tile.setAttribute("aria-label", `Hidden card ${index + 1}`);
    });
  }

  function resetMemoryGame() {
    clearTimeout(mismatchTimer);
    revealedTiles = [];
    matchedPairs = 0;
    moves = 0;
    memoryLocked = false;
    memoryMoves.textContent = "0";
    memoryPairs.textContent = "0";
    memoryStatus.textContent = "Ready? Find two matching festive pictures.";
    shuffleMemoryCards();
  }

  memoryTiles.forEach((tile, index) => {
    tile.addEventListener("click", () => {
      if (memoryLocked || tile.disabled || tile.classList.contains("revealed")) return;
      tile.textContent = tile.dataset.symbol;
      tile.classList.add("revealed");
      tile.setAttribute("aria-label", `${tile.dataset.symbol}, card ${index + 1}`);
      revealedTiles.push(tile);
      if (revealedTiles.length < 2) return;

      moves++;
      memoryMoves.textContent = String(moves);
      const [first, second] = revealedTiles;
      if (first.dataset.symbol === second.dataset.symbol) {
        first.classList.add("matched");
        second.classList.add("matched");
        first.disabled = true;
        second.disabled = true;
        matchedPairs++;
        memoryPairs.textContent = String(matchedPairs);
        revealedTiles = [];
        if (matchedPairs === 4) {
          memoryStatus.textContent = `Brilliant, ${moves} moves and all the pairs found! Happy Diwali! 🪔`;
        } else {
          memoryStatus.textContent = "A perfect match! Find another pair. ✨";
        }
        return;
      }

      memoryLocked = true;
      memoryStatus.textContent = "Not a pair this time. Try again!";
      mismatchTimer = setTimeout(() => {
        [first, second].forEach(card => {
          card.textContent = "?";
          card.classList.remove("revealed");
          card.setAttribute("aria-label", `Hidden card ${memoryTiles.indexOf(card) + 1}`);
        });
        revealedTiles = [];
        memoryLocked = false;
        memoryStatus.textContent = "Keep going—you’re getting closer!";
      }, 750);
    });
  });
  document.getElementById("restartMemory").addEventListener("click", resetMemoryGame);
  resetMemoryGame();

  // Little love quiz — playful questions, no wrong answers.
  const quiz = [
    { q: "What makes a journey unforgettable?", a: ["The destination", "The people beside us", "The snacks"], sweet: "The people make every journey special. ❤️" },
    { q: "What is the best part of going home for Diwali?", a: ["Family time", "Festive food", "All the little moments"], sweet: "It's all those little moments that become memories. 🪔" },
    { q: "What should always travel with you?", a: ["A smile", "A camera", "A playlist"], sweet: "A smile makes every place brighter. 😊" },
    { q: "A little wish for your journey?", a: ["Safe travels", "Lots of happiness", "Both, of course!"], sweet: "You deserve both, and so much more. 💗" },
    { q: "Which Diwali superpower would you choose?", a: ["Light every diya", "Make sweets appear", "Give everyone a hug"], sweet: "That sounds like a superpower that makes everybody happy! ✨" },
    { q: "What is the best festive soundtrack?", a: ["Dhol beats", "Family laughter", "The pressure cooker whistle"], sweet: "A little bit of all three makes a perfect celebration! 🥁" },
    { q: "You found one extra sweet. What now?", a: ["Share it", "Save it for later", "Take one bite and decide"], sweet: "A wise festive choice. Sharing is sweet, too! 🍬" },
    { q: "Pick a perfect Diwali evening.", a: ["Lights and rangoli", "Games and music", "Food with favourite people"], sweet: "The best evening is whichever one feels like home. 🪔" },
    { q: "What should your festive outfit have?", a: ["A little sparkle", "Maximum comfort", "Room for dessert"], sweet: "Room for dessert is always an excellent plan! 😄" },
    { q: "Choose your Diwali sidekick.", a: ["A cheerful cousin", "A tiny diya", "A very full snack bag"], sweet: "A full snack bag has never let anyone down! 🧳" },
    { q: "What does a diya say to the darkness?", a: ["I have got this!", "Let us glow together", "Where are the sweets?"], sweet: "Glow together—and then find the sweets! 🌟" },
    { q: "How do you wrap up a perfect celebration?", a: ["One more family photo", "One more sweet", "One more hug"], sweet: "There is always room for one more hug. ❤️" },
    { q: "Your rangoli needs one final touch. What do you add?", a: ["More colour", "A little sparkle", "A tiny diya"], sweet: "A little sparkle makes everything more festive! 🎨" },
    { q: "What is the real magic of Diwali?", a: ["Being together", "Sharing joy", "Making new memories"], sweet: "All of that magic is already right here with you. 💛" }
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
  const heartMessages = [
    "You deserve all the happiness in the world. ❤️",
    "Sending you the warmest hug for your journey. 🤗",
    "No matter the distance, you are always special. 💖",
    "May your home be bright and your heart even brighter. 🪔",
    "You make ordinary days feel a little more magical. ✨",
    "Someone is smiling because you are in their life. 😊",
    "May your celebrations be full of laughter and love. 🎉",
    "You are a gift to the people lucky enough to know you. 🎁",
    "May every diya remind you how much light you bring. 🌟",
    "A little note to say: you are doing wonderfully. 💌",
    "Wishing you a pocket full of joy and a plate full of sweets. 🍬",
    "Your kindness makes every place feel like home. 🏡",
    "May your next happy moment arrive sooner than expected. 💫",
    "Here is a tiny reminder: take a breath, smile, and enjoy today. 🌸",
    "You are loved more than all the festival lights. 💗",
    "May your journey be safe and your welcome home extra warm. 🚂"
  ];
  let heartMessageBag = [];
  let lastHeartMessage = "";
  document.querySelectorAll(".heart-pick").forEach(heart => {
    heart.addEventListener("click", () => {
      document.querySelectorAll(".heart-pick").forEach(item => item.classList.remove("picked"));
      heart.classList.add("picked");
      if (!heartMessageBag.length) {
        heartMessageBag = heartMessages.filter(message => message !== lastHeartMessage);
        for (let index = heartMessageBag.length - 1; index > 0; index--) {
          const swapIndex = Math.floor(Math.random() * (index + 1));
          [heartMessageBag[index], heartMessageBag[swapIndex]] = [heartMessageBag[swapIndex], heartMessageBag[index]];
        }
      }
      lastHeartMessage = heartMessageBag.pop();
      document.getElementById("heartMessage").textContent = lastHeartMessage;
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
    "Wherever you go, may a little happiness follow you like sunshine.",
    "A home is made brighter by the people who fill it with laughter.",
    "Let the little lights remind you that small joys can brighten a whole day.",
    "The best journeys are the ones that bring us closer to one another.",
    "May kindness be the brightest thing you carry with you.",
    "A shared sweet and a good story can turn any moment into a celebration.",
    "May every new beginning bring peace, warmth, and a reason to smile.",
    "Where there is love, even a small diya can light a very big world.",
    "Today is a lovely day to make a memory you will want to keep."
  ];
  let thoughtBag = [];
  let thoughtIndex = 0;
  function nextThoughtIndex() {
    if (!thoughtBag.length) {
      thoughtBag = thoughts.map((_, index) => index).filter(index => index !== thoughtIndex);
      for (let index = thoughtBag.length - 1; index > 0; index--) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [thoughtBag[index], thoughtBag[swapIndex]] = [thoughtBag[swapIndex], thoughtBag[index]];
      }
    }
    return thoughtBag.pop();
  }
  setInterval(() => {
    thoughtIndex = nextThoughtIndex();
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

function movePlateToPointer(event) {
  const bounds = gameArea.getBoundingClientRect();
  platePosition = Math.max(8, Math.min(92, (event.clientX - bounds.left) / bounds.width * 100));
  plate.style.left = `${platePosition}%`;
}

document.getElementById("moveLeft").addEventListener("click", () => {
  movePlate(-1);
});

document.getElementById("moveRight").addEventListener("click", () => {
  movePlate(1);
});

gameArea.addEventListener("pointerdown", event => {
  if (!gameRunning) return;
  movePlateToPointer(event);
  gameArea.setPointerCapture(event.pointerId);
});

gameArea.addEventListener("pointermove", event => {
  if (!gameRunning || !gameArea.hasPointerCapture(event.pointerId)) return;
  movePlateToPointer(event);
});

document.addEventListener("keydown", event => {
  if (event.target instanceof HTMLElement && event.target.closest("input, textarea, select, [contenteditable='true']")) return;
  if ((event.key === "ArrowLeft" || event.key === "ArrowRight") && gameRunning) {
    event.preventDefault();
    movePlate(event.key === "ArrowLeft" ? -1 : 1);
  }
});

const fallingSweets = [
  { emoji: "🟠", name: "laddoo" },
  { emoji: "🍩", name: "gulab jamun" },
  { emoji: "🍬", name: "kaju katli" },
  { emoji: "🍥", name: "jalebi" },
  { emoji: "🍮", name: "kheer" },
  { emoji: "⚪", name: "rasgulla" },
  { emoji: "🟩", name: "barfi" },
  { emoji: "🟡", name: "Mysore pak" },
  { emoji: "🍰", name: "soan papdi" },
  { emoji: "🪔", name: "bonus diya" },
  { emoji: "🌸", name: "bonus flower" }
];

function spawnLaddoo() {
  if (!gameRunning) return;

  const sweet = fallingSweets[Math.floor(Math.random() * fallingSweets.length)];
  const fallingSweet = document.createElement("div");
  fallingSweet.className = "falling-laddoo";
  fallingSweet.textContent = sweet.emoji;
  fallingSweet.setAttribute("aria-label", sweet.name);
  const position = Math.random() * 84 + 8;
  fallingSweet.style.left = `${position}%`;

  gameArea.appendChild(fallingSweet);

  const item = {
    element: fallingSweet,
    emoji: sweet.emoji,
    name: sweet.name,
    x: position,
    y: -35
  };

  fallingLaddoos.push(item);
}

function updateLaddoos() {
  const areaHeight = gameArea.clientHeight;
  for (let index = fallingLaddoos.length - 1; index >= 0; index--) {
    const item = fallingLaddoos[index];
    item.y += 3.2;
    item.element.style.top = item.y + "px";

    const caught =
      item.y >= areaHeight - 78 &&
      item.y <= areaHeight - 28 &&
      Math.abs(item.x - platePosition) < 14;

    if (caught) {
      score++;
      document.getElementById("laddooScore").textContent = score;
      document.getElementById("laddooGameMessage").textContent = `Yum! You caught ${item.name} ${item.emoji}`;
      if (navigator.vibrate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) navigator.vibrate(15);
      item.element.remove();
      fallingLaddoos.splice(index, 1);
      continue;
    }

    if (item.y > areaHeight + 20) {
      item.element.remove();
      fallingLaddoos.splice(index, 1);
    }
  }

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
    "Catch the sweet surprises! 🍬";

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
const danceMessage = document.getElementById("danceMessage");
const AudioContext = window.AudioContext || window.webkitAudioContext;
let danceAudio;
let danceMusicTimer;
let melodyIndex = 0;
const melody = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46, 523.25, 659.25, 783.99, 1046.5, 880, 783.99, 659.25, 587.33, 523.25, 587.33, 659.25, 783.99, 698.46, 659.25, 587.33, 523.25];

function playDanceNote() {
  if (!danceAudio || danceAudio.state !== "running") return;
  const now = danceAudio.currentTime;
  const note = danceAudio.createOscillator();
  const volume = danceAudio.createGain();
  note.type = melodyIndex % 4 === 0 ? "triangle" : "sine";
  note.frequency.value = melody[melodyIndex];
  volume.gain.setValueAtTime(0.0001, now);
  volume.gain.exponentialRampToValueAtTime(0.045, now + 0.025);
  volume.gain.exponentialRampToValueAtTime(0.0001, now + 0.31);
  note.connect(volume);
  volume.connect(danceAudio.destination);
  note.start(now);
  note.stop(now + 0.32);
  if (melodyIndex % 4 === 0) {
    const bass = danceAudio.createOscillator();
    const bassVolume = danceAudio.createGain();
    bass.type = "sine";
    bass.frequency.value = melody[melodyIndex] / 2;
    bassVolume.gain.setValueAtTime(0.0001, now);
    bassVolume.gain.exponentialRampToValueAtTime(0.024, now + 0.035);
    bassVolume.gain.exponentialRampToValueAtTime(0.0001, now + 0.23);
    bass.connect(bassVolume);
    bassVolume.connect(danceAudio.destination);
    bass.start(now);
    bass.stop(now + 0.24);
  }
  melodyIndex = (melodyIndex + 1) % melody.length;
}

async function startDanceMusic() {
  if (!AudioContext) {
    danceMessage.textContent = "The dance floor is open! This browser does not support music playback.";
    return;
  }
  try {
    danceAudio = new AudioContext();
    await danceAudio.resume();
    melodyIndex = 0;
    playDanceNote();
    danceMusicTimer = setInterval(playDanceNote, 320);
    danceMessage.textContent = "Your dancers are moving to an original little festive tune! 🎶";
  } catch (error) {
    console.error("Could not start the dance music.", error);
    danceMessage.textContent = "The dancers are ready, but the music could not start. Check your device audio settings.";
    if (danceAudio && danceAudio.state !== "closed") {
      await danceAudio.close().catch(closeError => console.error("Could not close the dance music player.", closeError));
    }
    danceAudio = undefined;
  }
}

async function stopDanceMusic() {
  clearInterval(danceMusicTimer);
  danceMusicTimer = undefined;
  if (danceAudio && danceAudio.state !== "closed") {
    await danceAudio.close().catch(error => console.error("Could not stop the dance music.", error));
  }
  danceAudio = undefined;
}

danceToggle.addEventListener("click", async () => {
  const dancing = danceStage.classList.toggle("dancing");
  danceToggle.setAttribute("aria-pressed", String(dancing));

  danceToggle.textContent = dancing
    ? "Stop Dancing + Music 🔇"
    : "Start Dancing + Music 🎶";

  if (dancing) {
    await startDanceMusic();
  } else {
    await stopDanceMusic();
    danceMessage.textContent = "The dance floor is waiting for you!";
  }
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
const rangoliStyles = [
  { className: "style-classic", name: "Classic rangoli" },
  { className: "style-lotus", name: "Eight-petal lotus" },
  { className: "style-starburst", name: "Starburst rangoli" },
  { className: "style-mandala", name: "Mandala rangoli" },
  { className: "style-peacock", name: "Peacock feather rangoli" },
  { className: "style-diya-border", name: "Diya garden rangoli" },
  { className: "style-flower-garden", name: "Marigold garden rangoli" },
  { className: "style-geometric", name: "Geometric rangoli" }
];

let rangoliIndex = 0;

document.getElementById("changeRangoli")
  .addEventListener("click", () => {

    rangoliIndex = (rangoliIndex + 1) % rangoliStyles.length;

    const colors = rangoliColors[rangoliIndex % rangoliColors.length];
    const rangoliArt = document.getElementById("rangoliArt");
    const style = rangoliStyles[rangoliIndex];
    rangoliStyles.forEach(item => rangoliArt.classList.remove(item.className));
    rangoliArt.classList.add(style.className);
    rangoliArt.dataset.style = style.className.replace("style-", "");
    document.getElementById("rangoliStyleLabel").textContent = style.name;
    rangoliArt.classList.remove("rangoli-changing");
    void rangoliArt.offsetWidth;
    rangoliArt.classList.add("rangoli-changing");
    clearTimeout(rangoliArt.colorChangeTimer);
    rangoliArt.colorChangeTimer = setTimeout(() => rangoliArt.classList.remove("rangoli-changing"), 1100);

    document.querySelector(".ring-one").style.borderColor = colors[0];
    document.querySelector(".ring-two").style.borderColor = colors[1];
    document.querySelector(".ring-three").style.borderColor = colors[2];

    document.querySelectorAll(".rangoli-petal").forEach(petal => {
      petal.style.background = colors[0];
    });
  });

/* ============================
   DIWALI WORLD MAP
============================ */

const worldMapMessage = document.getElementById("worldMapMessage");
const worldMapCity = document.getElementById("worldMapCity");
const worldMapGreeting = document.getElementById("worldMapGreeting");
const mapCityButtons = Array.from(document.querySelectorAll(".map-city"));
let currentWorldCity = "Mumbai";

function sendDiwaliWish(city) {
  currentWorldCity = city;
  mapCityButtons.forEach(button => {
    const selected = button.dataset.city === city;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  worldMapCity.textContent = `A little light for ${city}`;
  worldMapGreeting.textContent = `Happy Diwali, ${city}! 🪔`;
  worldMapMessage.classList.remove("celebrating");
  void worldMapMessage.offsetWidth;
  worldMapMessage.classList.add("celebrating");
}

mapCityButtons.forEach(button => {
  button.addEventListener("click", () => sendDiwaliWish(button.dataset.city));
});
document.getElementById("surpriseWorldCity").addEventListener("click", () => {
  const otherCities = mapCityButtons.filter(button => button.dataset.city !== currentWorldCity);
  const nextCity = otherCities[Math.floor(Math.random() * otherCities.length)];
  sendDiwaliWish(nextCity.dataset.city);
});

/* ============================
   DIGITAL FIREWORKS
============================ */

const fireworksSky = document.getElementById("fireworksSky");
const fireworksMessage = document.getElementById("fireworksMessage");
const fireworksCount = document.getElementById("fireworksCount");
const addFirecracker = document.getElementById("addFirecracker");
const fireworksHaptics = document.getElementById("fireworksHaptics");
let fireworksLit = 0;
let nextFirecrackerNumber = fireworksSky.querySelectorAll(".cracker-button").length + 1;
const maximumFirecrackers = 16;
const firecrackerTypes = [
  { kind: "rocket", emoji: "🚀", name: "Rocket" },
  { kind: "anar", emoji: "⛲", name: "Anar" },
  { kind: "chakri", emoji: "🌀", name: "Chakri" },
  { kind: "phuljhari", emoji: "✨", name: "Phuljhari" },
  { kind: "flowerpot", emoji: "🎆", name: "Flower pot" },
  { kind: "skyshot", emoji: "🌠", name: "Sky shot" },
  { kind: "spinner", emoji: "💫", name: "Spinner" },
  { kind: "sparkler", emoji: "🌟", name: "Sparkler" }
];

async function playFirecrackerSound(kind) {
  if (!AudioContext) {
    fireworksMessage.textContent = "The screen fireworks work, but this browser cannot play their digital sounds.";
    return;
  }
  let audio;
  try {
    audio = new AudioContext();
    await audio.resume();
    const now = audio.currentTime;
    const notesByKind = {
      rocket: [260, 420, 680, 960],
      anar: [440, 660, 880, 660],
      chakri: [880, 740, 620, 500],
      phuljhari: [1046, 1318, 1568, 1318],
      flowerpot: [330, 494, 659, 784],
      skyshot: [392, 587, 784, 1174],
      spinner: [784, 659, 880, 698],
      sparkler: [1174, 1396, 1568, 1760]
    };
    const frequencies = notesByKind[kind] || notesByKind.phuljhari;
    const oscillator = audio.createOscillator();
    const volume = audio.createGain();
    oscillator.type = kind === "chakri" ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(frequencies[0], now);
    frequencies.slice(1).forEach((frequency, index) => {
      oscillator.frequency.setValueAtTime(frequency, now + (index + 1) * 0.075);
    });
    volume.gain.setValueAtTime(0.0001, now);
    volume.gain.exponentialRampToValueAtTime(0.045, now + 0.025);
    volume.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
    oscillator.connect(volume);
    volume.connect(audio.destination);
    const noiseLength = Math.floor(audio.sampleRate * 0.16);
    const noiseBuffer = audio.createBuffer(1, noiseLength, audio.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let index = 0; index < noiseLength; index++) {
      noiseData[index] = (Math.random() * 2 - 1) * (1 - index / noiseLength);
    }
    const noise = audio.createBufferSource();
    const noiseVolume = audio.createGain();
    noise.buffer = noiseBuffer;
    noiseVolume.gain.setValueAtTime(0.0001, now);
    noiseVolume.gain.exponentialRampToValueAtTime(0.025, now + 0.008);
    noiseVolume.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    noise.connect(noiseVolume);
    noiseVolume.connect(audio.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.39);
    noise.start(now);
    noise.stop(now + 0.16);
    oscillator.addEventListener("ended", () => {
      audio.close().catch(error => console.error("Could not close the firecracker sound.", error));
    }, { once: true });
  } catch (error) {
    console.error("Could not play the digital firecracker sound.", error);
    fireworksMessage.textContent = "The visual fireworks still work, but the sound could not play on this device.";
    if (audio && audio.state !== "closed") {
      await audio.close().catch(closeError => console.error("Could not close the firecracker sound.", closeError));
    }
  }
}

function lightFirecracker(button, tactileFeedback = true) {
  if (button.disabled) return;
  button.disabled = true;
  button.classList.add("cracker-launch");
  const kind = button.dataset.kind || "phuljhari";
  void playFirecrackerSound(kind);
  if (tactileFeedback && fireworksHaptics.checked && navigator.vibrate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    navigator.vibrate([25, 18, 40]);
  }
  fireworksLit++;
  fireworksCount.textContent = String(fireworksLit);
  const cracker = firecrackerTypes.find(item => item.kind === kind);
  fireworksMessage.textContent = `Sparkle! Your ${cracker ? cracker.name : "firework"} lit up the screen.`;

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const bounds = fireworksSky.getBoundingClientRect();
    const x = button.offsetLeft + button.offsetWidth / 2;
    const y = button.offsetTop + 18;
    for (let index = 0; index < 18; index++) {
      const particle = document.createElement("span");
      const angle = Math.PI * 2 * index / 18;
      const distance = 55 + Math.random() * 45;
      particle.className = "firework-particle";
      particle.textContent = kind === "phuljhari" || kind === "sparkler"
        ? ["✦", "✧", "•", "✨"][index % 4]
        : ["✦", "✧", "•"][index % 3];
      particle.style.left = `${x / bounds.width * 100}%`;
      particle.style.top = `${y / bounds.height * 100}%`;
      particle.style.setProperty("--firework-x", `${Math.cos(angle) * distance}px`);
      particle.style.setProperty("--firework-y", `${Math.sin(angle) * distance}px`);
      particle.style.setProperty("--firework-hue", `${Math.round(Math.random() * 330)}deg`);
      particle.addEventListener("animationend", () => particle.remove(), { once: true });
      fireworksSky.appendChild(particle);
    }
  }

  setTimeout(() => {
    button.disabled = false;
    button.classList.remove("cracker-launch");
  }, 1000);
}

fireworksSky.addEventListener("click", event => {
  const button = event.target.closest(".cracker-button");
  if (button && fireworksSky.contains(button)) lightFirecracker(button);
});

addFirecracker.addEventListener("click", () => {
  const existing = fireworksSky.querySelectorAll(".cracker-button").length;
  if (existing >= maximumFirecrackers) {
    fireworksMessage.textContent = `Your sky is full of sparkle! You can add up to ${maximumFirecrackers} firecrackers.`;
    return;
  }
  const button = document.createElement("button");
  button.type = "button";
  button.className = "cracker-button cracker-new";
  const cracker = firecrackerTypes[(nextFirecrackerNumber - 1) % firecrackerTypes.length];
  button.dataset.kind = cracker.kind;
  button.classList.add(`cracker-${cracker.kind}`);
  button.setAttribute("aria-label", `Light digital ${cracker.name}`);
  button.append(document.createTextNode(cracker.emoji));
  const label = document.createElement("span");
  label.textContent = cracker.name;
  button.appendChild(label);
  fireworksSky.appendChild(button);
  nextFirecrackerNumber++;
  fireworksMessage.textContent = `A new digital firecracker is ready! (${existing + 1}/${maximumFirecrackers})`;
  if (existing + 1 >= maximumFirecrackers) addFirecracker.disabled = true;
});

document.getElementById("lightAllFirecrackers").addEventListener("click", () => {
  const crackers = Array.from(fireworksSky.querySelectorAll(".cracker-button"));
  let lit = 0;
  crackers.forEach((button, index) => {
    if (button.disabled) return;
    lit++;
    const tactileFeedback = lit === 1;
    setTimeout(() => lightFirecracker(button, tactileFeedback), index * 140);
  });
  if (!lit) fireworksMessage.textContent = "Your firecrackers are recharging—try again in a moment!";
});


/* ============================
   TRAIN ARRIVAL
============================ */

const train = document.getElementById("diwaliTrain");
const trainButton = document.getElementById("trainButton");
const trainMessage = document.getElementById("trainMessage");
const stationPassenger = document.getElementById("stationPassenger");
let trainSequenceTimers = [];

function scheduleTrainStep(callback, delay) {
  trainSequenceTimers.push(window.setTimeout(callback, delay));
}

async function playTrainSound() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    console.warn("Train sounds are not supported by this browser.");
    return false;
  }

  let audio;
  try {
    audio = new AudioContextClass();
    await audio.resume();
    const now = audio.currentTime;
    const chug = audio.createOscillator();
    const chugVolume = audio.createGain();
    chug.type = "square";
    chug.frequency.setValueAtTime(110, now);
    chug.frequency.exponentialRampToValueAtTime(72, now + 1.15);
    chugVolume.gain.setValueAtTime(0.0001, now);
    for (let beat = 0; beat < 6; beat++) {
      const start = now + beat * 0.19;
      chugVolume.gain.setValueAtTime(0.0001, start);
      chugVolume.gain.linearRampToValueAtTime(0.035, start + 0.025);
      chugVolume.gain.exponentialRampToValueAtTime(0.0001, start + 0.13);
    }
    chug.connect(chugVolume);
    chugVolume.connect(audio.destination);
    chug.start(now);
    chug.stop(now + 1.2);

    const whistle = audio.createOscillator();
    const whistleVolume = audio.createGain();
    whistle.type = "sine";
    whistle.frequency.setValueAtTime(660, now + 0.12);
    whistle.frequency.setValueAtTime(880, now + 0.48);
    whistle.frequency.setValueAtTime(784, now + 0.86);
    whistleVolume.gain.setValueAtTime(0.0001, now);
    whistleVolume.gain.setValueAtTime(0.0001, now + 0.12);
    whistleVolume.gain.exponentialRampToValueAtTime(0.045, now + 0.2);
    whistleVolume.gain.exponentialRampToValueAtTime(0.0001, now + 1.12);
    whistle.connect(whistleVolume);
    whistleVolume.connect(audio.destination);
    whistle.start(now + 0.12);
    whistle.stop(now + 1.15);
    window.setTimeout(() => {
      if (audio.state !== "closed") {
        audio.close().catch(error => console.error("Could not close the train sound.", error));
      }
    }, 1700);
    return true;
  } catch (error) {
    console.error("Could not play the train sound.", error);
    if (audio && audio.state !== "closed") {
      await audio.close().catch(closeError => console.error("Could not close the train sound.", closeError));
    }
    return false;
  }
}

trainButton.addEventListener("click", async () => {
  trainSequenceTimers.forEach(timer => window.clearTimeout(timer));
  trainSequenceTimers = [];
  train.classList.remove("arriving", "stopped", "departing", "departed");
  stationPassenger.classList.remove("passenger-arriving", "passenger-waving");
  trainButton.disabled = true;
  void train.offsetWidth;

  train.classList.add("arriving");
  trainMessage.textContent = "Chug-chug, toot-toot! The Diwali Express is pulling into the station. 🚂";
  void playTrainSound();

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const arrivalDuration = reducedMotion ? 200 : 2400;
  const waitingDuration = reducedMotion ? 200 : 900;
  const passengerDuration = reducedMotion ? 250 : 1550;
  const departureDuration = reducedMotion ? 200 : 1850;

  scheduleTrainStep(() => {
    train.classList.remove("arriving");
    train.classList.add("stopped");
    trainMessage.textContent = "The train is at the station. Your special guest is stepping out! 🌸";

    scheduleTrainStep(() => {
      stationPassenger.classList.add("passenger-arriving");

      scheduleTrainStep(() => {
        stationPassenger.classList.remove("passenger-arriving");
        stationPassenger.classList.add("passenger-waving");
        train.classList.remove("stopped");
        train.classList.add("departing");
        trainMessage.textContent = "She made it home! The Diwali Express is waving goodbye. 👋";

        scheduleTrainStep(() => {
          train.classList.remove("departing");
          train.classList.add("departed");
          trainMessage.textContent = "Welcome home! Happy Diwali! 🪔✨";
          trainButton.disabled = false;
        }, departureDuration);
      }, passengerDuration);
    }, waitingDuration);
  }, arrivalDuration);
});

/* ============================
   FESTIVE OUTFIT BUILDER
============================ */

const outfitCollections = {
  women: ["Saree", "Lehenga choli", "Anarkali suit", "Sharara set"],
  men: ["Kurta pajama", "Sherwani", "Dhoti-kurta", "Bandhgala"]
};
const outfitStyle = document.getElementById("outfitStyle");
const outfitPreview = document.getElementById("outfitPreview");
const outfitPreviewTitle = document.getElementById("outfitPreviewTitle");
const outfitStatus = document.getElementById("outfitStatus");
const outfitAvatar = document.getElementById("outfitAvatar");
const outfitAccessory = document.getElementById("outfitAccessory");
const outfitAccessoryPreview = document.getElementById("outfitAccessoryPreview");
let outfitGender = "women";
let outfitChangeTimer;

function updateOutfitPreview() {
  const selectedColor = document.querySelector(".outfit-color.active");
  const colorName = selectedColor.dataset.colorName;
  const outfitName = outfitStyle.value;
  outfitPreview.style.setProperty("--outfit-color", selectedColor.dataset.color);
  outfitPreview.classList.toggle("women", outfitGender === "women");
  outfitPreview.classList.toggle("men", outfitGender === "men");
  outfitAvatar.classList.toggle("woman", outfitGender === "women");
  outfitAvatar.classList.toggle("man", outfitGender === "men");
  outfitAvatar.classList.remove(
    "style-saree",
    "style-lehenga-choli",
    "style-anarkali-suit",
    "style-sharara-set",
    "style-kurta-pajama",
    "style-sherwani",
    "style-dhoti-kurta",
    "style-bandhgala"
  );
  const styleClass = `style-${outfitName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  outfitAvatar.classList.add(styleClass);
  outfitAvatar.classList.remove("outfit-turn");
  void outfitAvatar.offsetWidth;
  outfitAvatar.classList.add("outfit-turn");
  outfitPreview.classList.remove("outfit-changing");
  void outfitPreview.offsetWidth;
  outfitPreview.classList.add("outfit-changing");
  window.clearTimeout(outfitChangeTimer);
  outfitChangeTimer = window.setTimeout(() => {
    outfitPreview.classList.remove("outfit-changing");
    outfitAvatar.classList.remove("outfit-turn");
  }, 900);
  outfitAvatar.setAttribute("aria-label", `Full-body ${outfitGender === "women" ? "woman" : "man"} in a ${colorName} ${outfitName}`);
  outfitAccessoryPreview.textContent = outfitAccessory.value;
  outfitPreviewTitle.textContent = `${colorName} ${outfitName}`;
  outfitStatus.textContent = `Your ${colorName} ${outfitName} with ${outfitAccessory.options[outfitAccessory.selectedIndex].text.toLowerCase()} is ready for the celebration!`;
}

function setOutfitCollection(gender) {
  outfitGender = gender;
  outfitStyle.replaceChildren(...outfitCollections[gender].map(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    return option;
  }));
  document.querySelectorAll(".outfit-gender").forEach(button => {
    const selected = button.dataset.gender === gender;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  updateOutfitPreview();
}

document.querySelectorAll(".outfit-gender").forEach(button => {
  button.addEventListener("click", () => setOutfitCollection(button.dataset.gender));
});
setOutfitCollection("women");
document.querySelectorAll(".outfit-color").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".outfit-color").forEach(colorButton => {
      const selected = colorButton === button;
      colorButton.classList.toggle("active", selected);
      colorButton.setAttribute("aria-pressed", String(selected));
    });
    updateOutfitPreview();
  });
});
outfitStyle.addEventListener("change", updateOutfitPreview);
outfitAccessory.addEventListener("change", updateOutfitPreview);


});