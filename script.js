const draggables = document.querySelectorAll('.draggable');
const dropzone = document.getElementById('dropzone');

draggables.forEach(draggable => {
  draggable.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', draggable.id);
  });
});

dropzone.addEventListener('dragover', (e) => {
  e.preventDefault(); // allow drop
});

dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  const id = e.dataTransfer.getData('text/plain');
  const draggable = document.getElementById(id);
  dropzone.appendChild(draggable);
});
