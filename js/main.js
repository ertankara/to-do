const $addTaskInput = document.querySelector('#add-task');
const $addTaskButton = document.querySelector('#add-task-button');
const $taskContainer = document.querySelector('#task-container');
const $renewListButton = document.querySelector('#renew-list-button');

class Task {
  constructor(taskText, isCrossed = false) {
    this.taskText = taskText;
    this.isCrossed = isCrossed;
  }
}


function addTask() {
  "use strict";

  // Check if it has valid length and if the number of tasks don't have more than 9 items
  if (
    localStorage.getItem('all-tasks') &&
    JSON.parse(localStorage.getItem('all-tasks')).length >= 9 ||
    $addTaskInput.length > 70
  ) {
    $addTaskInput.value = "";
    return;
  }

  const task = new Task($addTaskInput.value);

  // If it comes this far it means task is valid
  const $tasks = document.querySelectorAll('.task');
  let numberOfTasks = $tasks.length;
  numberOfTasks++;


  // Create a span to store task
  const newEl = document.createElement('span');
  // Append the increasing number to the task
  newEl.textContent = numberOfTasks + '- ' + task.taskText;
  newEl.classList.add('task');

  $taskContainer.appendChild(newEl);

  $addTaskInput.value = "";

  // Call taskAdded function to add task to the localStorage
  taskAdded(task);
  taskCounter++;

  if (taskCounter >= 9) {
    $renewListButton.style.display = 'block';
  }

  if (localStorage && !localStorage.getItem('starting-time')) {
    // Display modal after entering nine tasks
    if (JSON.parse(localStorage.getItem('all-tasks')).length === 9)
      $inputModal.style.display = 'block';
  }
}



$taskContainer.addEventListener('click', event => {
  // If the to-do item in the container is clicked
  if (event.target.nodeName === 'SPAN') {
    // Retrieve the task array from the localStorage
    const taskArray = JSON.parse(localStorage.getItem('all-tasks'));
    // If the clicked element has not crossed over
    if (!event.target.className.match(/done-task/g)) {
      // Cross over
      event.target.classList.add('done-task');
      // And also mark it as crossed so on page reload it will remain crossed over
      for (let i = 0; i < taskArray.length; i++) {
        if (event.target.textContent.replace(/[0-9]- /g, '') === taskArray[i].taskText) {
          taskArray[i].isCrossed = true;
          break;
        }
      }
      // Store task array back after the updates
      localStorage.setItem('all-tasks', JSON.stringify(taskArray));
    } else {
      // Remove cross over
      event.target.classList.remove('done-task');
      // Also update the object so it won't be crossed over when page reloads
      for (let i = 0; i < taskArray.length; i++) {
        if (event.target.textContent.replace(/[0-9]- /g, '') === taskArray[i].taskText) {
          taskArray[i].isCrossed = false;
          break;
        }
      }
      // Store task array back after the updates
      localStorage.setItem('all-tasks', JSON.stringify(taskArray));
    }
  }
});

// If more than 9 items are added
$renewListButton.addEventListener('click', () => {
  taskCounter = 0;
  localStorage.clear();
  while ($taskContainer.firstElementChild) {
    $taskContainer.firstElementChild.remove();
  }
  $renewListButton.style.display = 'none';

  updateTimer(0); // Call function with totalMiliSeconds set to 0
  clearInterval(interval);
});

// Click event for the button
$addTaskButton.addEventListener('click', addTask);

// Enter key will also work to add tasks to the list
document.addEventListener('keydown', event => {
  // If the 'enter' key is pushed while input area is focused
  if (event.keyCode === 13 && document.activeElement === $addTaskInput) {
    addTask();
  }
});
