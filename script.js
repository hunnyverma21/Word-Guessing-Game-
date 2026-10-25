const WORDS = [
  "apple", "beach", "brain", "brave", "bread", "brick", "chair", "charm",
  "clean", "cloud", "dance", "dream", "earth", "flame", "flute", "fruit",
  "ghost", "globe", "grape", "green", "heart", "honey", "house", "juice",
  "light", "magic", "maple", "metal", "music", "night", "ocean", "olive",
  "paint", "peace", "piano", "plant", "queen", "quiet", "radio", "river",
  "robot", "round", "smile", "snake", "solar", "space", "spice", "sport",
  "storm", "story", "sunny", "table", "tiger", "train", "under", "vivid",
  "water", "whale", "world", "write", "youth", "zebra"
];

const board = document.getElementById("board");
const input = document.getElementById("guess-input");
const form = document.getElementById("guess-form");
const message = document.getElementById("message");
const attemptLabel = document.getElementById("attempt-label");
const guessButton = document.getElementById("guess-button");
const hintButton = document.getElementById("hint-button");
const newButton = document.getElementById("new-button");
const winsLabel = document.getElementById("wins");

let answer = "";
let attempts = 0;
let finished = false;
let wins = Number(localStorage.getItem("wordGuessWins") || 0);

function buildBoard() {
  board.innerHTML = "";
  for (let r = 0; r < 6; r++) {
    const row = document.createElement("div");
    row.className = "board-row";
    for (let c = 0; c < 5; c++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.id = `tile-${r}-${c}`;
      row.appendChild(tile);
    }
    board.appendChild(row);
  }
}

function setMessage(text, type = "") {
  message.textContent = text;
  message.className = `message ${type}`;
}

function startGame() {
  answer = WORDS[Math.floor(Math.random() * WORDS.length)];
  attempts = 0;
  finished = false;
  buildBoard();
  input.value = "";
  input.disabled = false;
  guessButton.disabled = false;
  hintButton.disabled = false;
  attemptLabel.textContent = "Attempt 1 of 6";
  setMessage("Type a 5-letter word to begin.");
  input.focus();
}

function submitGuess(event) {
  event.preventDefault();
  if (finished) return;

  const guess = input.value.trim().toLowerCase();
  if (!/^[a-z]{5}$/.test(guess)) {
    setMessage("Please enter exactly 5 letters.", "error");
    return;
  }

  // Accept only words in the game's built-in word list.
  if (!WORDS.includes(guess)) {
    setMessage("That word isn't in this game's word list. Try another.", "error");
    return;
  }

  const result = Array(5).fill("absent");
  const remaining = answer.split("");
  // Mark exact matches first, so duplicate letters are handled correctly.
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answer[i]) {
      result[i] = "correct";
      remaining[i] = null;
    }
  }
  for (let i = 0; i < 5; i++) {
    if (result[i] !== "correct") {
      const index = remaining.indexOf(guess[i]);
      if (index !== -1) {
        result[i] = "present";
        remaining[index] = null;
      }
    }
    const tile = document.getElementById(`tile-${attempts}-${i}`);
    tile.textContent = guess[i];
    tile.classList.add(result[i]);
  }

  attempts++;
  input.value = "";
  attemptLabel.textContent = `Attempt ${Math.min(attempts + 1, 6)} of 6`;

  if (guess === answer) {
    finished = true;
    wins++;
    localStorage.setItem("wordGuessWins", String(wins));
    winsLabel.textContent = wins;
    setMessage(`Brilliant! You guessed "${answer.toUpperCase()}" in ${attempts} ${attempts === 1 ? "try" : "tries"}!`, "success");
    endRound();
  } else if (attempts === 6) {
    finished = true;
    setMessage(`Game over! The word was ${answer.toUpperCase()}. Try again!`, "error");
    endRound();
  } else {
    setMessage("Good try! Green = exact, yellow = misplaced.");
    input.focus();
  }
}

function endRound() {
  input.disabled = true;
  guessButton.disabled = true;
  hintButton.disabled = true;
  attemptLabel.textContent = `Finished in ${attempts} ${attempts === 1 ? "try" : "tries"}`;
}

hintButton.addEventListener("click", () => {
  if (finished) return;
  const revealed = answer[Math.floor(Math.random() * 5)].toUpperCase();
  setMessage(`Hint: the word contains the letter "${revealed}".`);
});
form.addEventListener("submit", submitGuess);
newButton.addEventListener("click", startGame);
winsLabel.textContent = wins;
startGame();
