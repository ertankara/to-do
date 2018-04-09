const $addTaskInput = document.querySelector('#add-task');
const $addTaskButton = document.querySelector('#add-task-button');

function addTask() {
  "use strict";
  const task = $addTaskInput.value;
  // Check if it has valid length
  if (task.length > 50) {
    return;
  }

  // If it comes this far it means task is valid
  const $task = document.querySelectorAll('.task');
  let numberOfTasks = $task.length;
  numberOfTasks++;


  const $taskContainer = document.querySelector('#task-container');
  // Create a span to store task
  const newEl = document.createElement('span');
  // Append the increasing number to the task
  newEl.textContent = numberOfTasks + '- ' + task;
  newEl.classList.add('task');

  $taskContainer.appendChild(newEl);

  $addTaskInput.value = "";
}


$addTaskButton.addEventListener('click', addTask);


document.addEventListener('keydown', (event) => {
  // If the 'enter' key is pushed while input area is focused
  if (event.keyCode === 13 && document.activeElement === $addTaskInput) {
    addTask();
  }
});

