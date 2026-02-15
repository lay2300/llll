// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Create floating heart elements
 */
function createHeart() {
  const heart = document.createElement("div");
  heart.innerHTML = "💖";
  heart.className = "floating-heart";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = Math.random() * 20 + 15 + "px";
  heart.style.animationDuration = Math.random() * 5 + 5 + "s";
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 8000);
}

/**
 * Update clock display
 */
function updateClock() {
  const now = new Date();
  const timeEl = document.getElementById("time");
  if (timeEl) {
    timeEl.innerText =
      now.getHours().toString().padStart(2, "0") +
      ":" +
      now.getMinutes().toString().padStart(2, "0");
  }
}

// ========================================
// SCREEN MANAGEMENT
// ========================================

/**
 * Switch between screens
 */
function switchScreen(from, to) {
  document.getElementById(from).classList.remove("active");
  document.getElementById(to).classList.add("active");
}

// ========================================
// LOCK SCREEN - PASSCODE
// ========================================

const PASS = "1166";
let input = "";

/**
 * Handle number key press
 */
function press(n) {

  const click = document.getElementById("sfxClick");
  click.currentTime = 0;
  click.play();

  if (input.length < 4) {
    input += n;
    const dot = document.querySelectorAll(".dot")[input.length - 1];
    dot.classList.add("fill");
    dot.innerText = n;
  }

  if (input.length === 4) {
    if (input === PASS) {
      document.getElementById("sfxSuccess").play();
      goCountdown();
    } else {
      document.getElementById("sfxError").play();
      input = "";
      document
        .querySelectorAll(".dot")
        .forEach((d) => {
          d.classList.remove("fill");
          d.innerText = "";
        });
    }
  }
}

// ========================================
// COUNTDOWN SCREEN
// ========================================

/**
 * Transition to countdown screen
 */
function goCountdown() {
  switchScreen("lock", "countdown");

  const tick = document.getElementById("sfxTick");
  tick.currentTime = 0;
  tick.play();

  let c = 3;
  const el = document.getElementById("count");
  const timer = setInterval(() => {
    c--;
    if (c > 0) {
      tick.currentTime = 0;
      tick.play();
    }
    el.innerText = c;
    if (c === 0) {
      clearInterval(timer);
      goMemory();
    }
  }, 1000);
}

// ========================================
// MEMORY SCREEN
// ========================================

const memories = [
  { url: "3.jpg", text: "จำวันแรกที่เราเจอกันได้ไหม? 🥰" },
  { url: "2.jpg", text: "ทุกที่ที่มีเธอคือความสุข 🌈" },
  { url: "4.jpg", text: "ขอบคุณที่รักกันนะ 💖" },
];

/**
 * Transition to memory screen and show photos
 */
function goMemory() {
  const music = document.getElementById("bgMusic");
  music.volume = 1.0;
  music.play().catch((e) => console.log(e));
  switchScreen("countdown", "memory");
  let i = 0;
  const polaroid = document.getElementById("polaroid");
  const img = document.getElementById("memoryImg");
  const caption = document.getElementById("memoryCaption");

  function show() {
    if (i >= memories.length) {
      goSurprise();
      return;
    }

    polaroid.classList.remove("active");
    setTimeout(() => {
      const shutter = document.getElementById("sfxShutter");
      shutter.currentTime = 0;
      shutter.play();
      img.src = memories[i].url;
      caption.innerText = memories[i].text;
      polaroid.classList.add("active");
      i++;
      setTimeout(show, 4000);
    }, 800);
  }

  show();
}

// ========================================
// SURPRISE SCREEN
// ========================================

/**
 * Transition to surprise screen
 */
function goSurprise() {
  switchScreen("memory", "surprise");
}

/**
 * Transition to final screen
 */
function goFinal() {
  document.getElementById("sfxClick").play();
  switchScreen("surprise", "final");
  setTimeout(() => {
    document.getElementById("card").classList.add("open");
    document.getElementById("sfxPop").play();
    createConfetti();
  }, 300);
}

// ========================================
// CONFETTI EFFECT
// ========================================

/**
 * Create confetti particles
 */
function createConfetti() {
  for (let i = 0; i < 50; i++) {
    const c = document.createElement("div");
    c.style.position = "fixed";
    c.style.left = Math.random() * 100 + "vw";
    c.style.top = "-10px";
    c.style.width = "8px";
    c.style.height = "8px";
    const colors = ["#ff4d6d", "#ffd700", "#00ffff", "#ff00ff"];
    c.style.backgroundColor = colors[Math.floor(Math.random() * 4)];
    c.style.animation = "fall " + (Math.random() * 3 + 2) + "s linear forwards";
    document.body.appendChild(c);
  }
}

// ========================================
// FINAL SCREEN - REPLAY
// ========================================

/**
 * Reset and replay from start
 */
function goReplay() {
  document.getElementById("sfxClick").play();
  switchScreen("final", "lock");
  input = "";
  document
    .querySelectorAll(".dot")
    .forEach((d) => {
      d.classList.remove("fill");
      d.innerText = "";
    });
  document.getElementById("card").classList.remove("open");
  document.getElementById("noBtn").style.position = "static";
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  setInterval(createHeart, 800);
  setInterval(updateClock, 1000);
  updateClock();

  const noBtn = document.getElementById("noBtn");
  if (noBtn) {
    noBtn.addEventListener("mouseover", () => {
      noBtn.style.position = "absolute";
      noBtn.style.left = Math.random() * 250 + "px";
      noBtn.style.top = Math.random() * 400 + "px";
    });
  }
});