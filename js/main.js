const $addTaskInput = document.querySelector('#add-task');
const $addTaskButton = document.querySelector('#add-task-button');
const $taskContainer = document.querySelector('#task-container');
let $tasks = [...document.querySelectorAll('.task')];

class Task {
  constructor(taskText, isCrossed = false) {
    this.taskText = taskText;
    this.isCrossed = isCrossed;
  }
}


function addTask() {
  "use strict";
  //const task = $addTaskInput.value;
  const task = new Task($addTaskInput.value);
  // Check if it has valid length
  if (task.taskText.length > 50) {
    return;
  }

  // If it comes this far it means task is valid
  $tasks = document.querySelectorAll('.task');
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
}



$taskContainer.addEventListener('click', event => {
  if (event.target.nodeName === 'SPAN') {
    const taskArray = JSON.parse(localStorage.getItem('all-tasks'));
    if (!event.target.className.match(/done-task/g)) {
      event.target.classList.add('done-task');
      for (let i = 0; i < taskArray.length; i++) {
        // event.target.textContent.replace(/[^a-zA-Z ]/g, '').trim
        if (event.target.textContent.replace(/[0-9]- /g, '') ===  taskArray[i].taskText) {
          taskArray[i].isCrossed = true;
          break;
        }
      }
      localStorage.setItem('all-tasks', JSON.stringify(taskArray));
    } else {
      event.target.classList.remove('done-task');
      for (let i = 0; i < taskArray.length; i++) {
        if (event.target.textContent.replace(/[0-9]- /g, '') === taskArray[i].taskText) {
          taskArray[i].isCrossed = false;
          break;
        }
      }
      localStorage.setItem('all-tasks', JSON.stringify(taskArray));
    }
  }
});




$addTaskButton.addEventListener('click', addTask);

document.addEventListener('keydown', event => {
  // If the 'enter' key is pushed while input area is focused
  if (event.keyCode === 13 && document.activeElement === $addTaskInput) {
    addTask();
  }
});
