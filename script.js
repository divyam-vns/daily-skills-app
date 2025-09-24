const dropzone = document.getElementById('dropzone');
const feedback = document.getElementById('feedback');
const speakBtn = document.getElementById('speakBtn');
const promptEl = document.getElementById('prompt');
const optionsContainer = document.getElementById('options');
const scoreEl = document.getElementById('score');

// Color list with hex codes
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

// Utility: pick N random unique items from array
function getRandomChoices(array, n) {
  let shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

// Start a new round
function newRound() {
  // Pick correct answer
  const colorNames = Object.keys(colors);
  correctAnswer = colorNames[Math.floor(Math.random() * colorNames.length)];

  // Pick 2 wrong answers
  let wrongs = colorNames.filter(c => c !== correctAnswer);
  let choices = [correctAnswer, ...getRandomChoices(wrongs, 2)];
  choices = choices.sort(() => 0.5 - Math.random()); // shuffle

  // Update prompt
  promptEl.innerHTML = `Which one is <strong>${correctAnswer}</strong>?`;
  feedback.textContent = "";
  dropzone.textContent = "Drop your answer here";

  // Render options
  optionsContainer.innerHTML = "";
  choices.forEach(color => {
    const div = document.createElement("div");
    div.classList.add("draggable");
    div.id = color;
    div.style.backgroundColor = colors[color];
    div.setAttribute("draggable", "true");
    optionsContainer.appendChild(div);

    // Drag start event
    div.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', div.id);
    });
  });
}

// Allow drop
dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
});

// Handle drop
dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  const id = e.dataTransfer.getData('text/plain');
  attempts++;

  if (id === correctAnswer) {
    score++;
    feedback.textContent = `✅ Correct! That is ${correctAnswer}.`;
    feedback.style.color = "green";
    updateScore();

    // Start new round after 2 sec
    setTimeout(newRound, 2000);
  } else {
    feedback.textContent = "❌ Try again!";
    feedback.style.color = "red";
    updateScore();
  }
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

// Start first round
newRound();
updateScore();
