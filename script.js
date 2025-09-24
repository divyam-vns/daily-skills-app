const draggables = document.querySelectorAll('.draggable');
const dropzone = document.getElementById('dropzone');
const feedback = document.getElementById('feedback');
const speakBtn = document.getElementById('speakBtn');
const promptEl = document.getElementById('prompt');

// Available colors
const colors = ["red", "blue", "green"];
let correctAnswer = "";

// Pick a random color question
function newRound() {
  correctAnswer = colors[Math.floor(Math.random() * colors.length)];
  promptEl.innerHTML = `Which one is <strong>${correctAnswer}</strong>?`;
  feedback.textContent = "";
  dropzone.textContent = "Drop your answer here";
}
newRound();

// Enable drag
draggables.forEach(draggable => {
  draggable.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', draggable.id);
  });
});

// Allow drop
dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
});

// Handle drop
dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  const id = e.dataTransfer.getData('text/plain');

  if (id === correctAnswer) {
    feedback.textContent = `✅ Correct! That is ${correctAnswer}.`;
    feedback.style.color = "green";

    // Start a new round after 2 seconds
    setTimeout(newRound, 2000);
  } else {
    feedback.textContent = "❌ Try again!";
    feedback.style.color = "red";
  }
});

// Voice prompt
speakBtn.addEventListener('click', () => {
  const utterance = new SpeechSynthesisUtterance(`Which one is ${correctAnswer}?`);
  speechSynthesis.speak(utterance);
});
