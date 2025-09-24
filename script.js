const dropzone = document.getElementById('dropzone');
const feedback = document.getElementById('feedback');
const speakBtn = document.getElementById('speakBtn');
const promptEl = document.getElementById('prompt');
const optionsContainer = document.getElementById('options');
const scoreEl = document.getElementById('score');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const progressEl = document.getElementById('progress');

// Audio
const correctSound = new Audio('correct.mp3'); // Upload this file to your repo
const wrongSound = new Audio('wrong.mp3'); // Upload this file to your repo

const colors = {
  black: "#000000",
  blue: "#0000FF",
  gray: "#808080",
  green: "#008000",
  orange: "#FFA500",
  purple: "#800080",
  red: "#FF0000",
  white: "#FFFFFF",
  yellow: "#FFFF00",
  pink: "#FFC0CB",
  brown: "#8B4513"
};

let correctAnswer = "";
let score = 0;
let attempts = 0;
let round = 0;
const totalRounds = 10;

// Utility: pick N random unique items
function getRandomChoices(array, n) {
  let shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

// Start new round
function newRound() {
  if (round >= totalRounds) {
    feedback.textContent = `🎉 Game over! Final Score: ${score} / ${attempts}`;
    feedback.style.color = "blue";
    optionsContainer.innerHTML = "";
    dropzone.textContent = "Game Finished!";
    nextBtn.style.display = "none";
    restartBtn.style.display = "inline-block";
    promptEl.textContent = "";
    return;
  }

  round++;
  progressEl.textContent = `Round: ${round} / ${totalRounds}`;
  correctAnswer = Object.keys(colors)[Math.floor(Math.random() * Object.keys(colors).length)];

  let wrongs = Object.keys(colors).filter(c => c !== correctAnswer);
  let choices = [correctAnswer, ...getRandomChoices(wrongs, 2)];
  choices = choices.sort(() => 0.5 - Math.random());

  promptEl.innerHTML = `Which one is <strong>${correctAnswer}</strong>?`;
  feedback.textContent = "";
  dropzone.textContent = "Drop your answer here";
  nextBtn.style.display = "none";

  // Render color options
  optionsContainer.innerHTML = "";
  choices.forEach(color => {
    const div = document.createElement("div");
    div.classList.add("draggable");
    div.id = color;
    div.style.backgroundColor = colors[color];
    div.setAttribute("draggable", "true");

    const label = document.createElement("span");
    label.textContent = color.charAt(0).toUpperCase() + color.slice(1);
    label.style.color = (color === "black" || color === "brown" || color === "purple") ? "white" : "black";
    label.style.fontWeight = "bold";
    div.appendChild(label);

    optionsContainer.appendChild(div);

    // Drag event
    div.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', div.id);
    });

    // Click / Tap event
    div.addEventListener('click', () => handleAnswer(color));
  });
}

// Handle answer (drag or click)
function handleAnswer(selectedColor) {
  attempts++;
  if (selectedColor === correctAnswer) {
    score++;
    feedback.textContent = `✅ Correct! That is ${correctAnswer}.`;
    feedback.style.color = "green";
    correctSound.play();
    nextBtn.style.display = "inline-block";
  } else {
    feedback.textContent = "❌ Try again!";
    feedback.style.color = "red";
    wrongSound.play();
  }
  updateScore();
}

// Drag & Drop
dropzone.addEventListener('dragover', (e) => e.preventDefault());
dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  const id = e.dataTransfer.getData('text/plain');
  handleAnswer(id);
});

// Update score display
function updateScore() {
  scoreEl.textContent = `Score: ${score} / ${attempts}`;
}

// Voice prompt
speakBtn.addEventListener('click', () => {
  const utterance = new SpeechSynthesisUtterance(`Which one is ${correctAnswer}?`);
  speechSynthesis.speak(utterance);
});

// Next Question button
nextBtn.addEventListener('click', () => {
  newRound();
});

// Restart Game button
restartBtn.addEventListener('click', () => {
  score = 0;
  attempts = 0;
  round = 0;
  restartBtn.style.display = "none";
  newRound();
  updateScore();
});

// Start first round
newRound();
updateScore();
