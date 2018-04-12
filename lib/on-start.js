'use strict';

document.addEventListener('DOMContentLoaded', function () {
  // If localStorage exists in the browser and there are some previous tasks
  if (localStorage && localStorage.getItem('all-tasks')) {
    // Retrieve the task array
    var taskArray = JSON.parse(localStorage.getItem('all-tasks'));
    // And create span elements for each task
    for (var i = 0; i < taskArray.length; i++) {
      var task = taskArray[i];
      var newEl = document.createElement('span');
      newEl.classList.add('task');
      // If task was previously crossed over then cross it over again
      if (task.isCrossed) {
        newEl.classList.add('done-task');
      }
      newEl.textContent = i + 1 + '- ' + task.taskText;
      $taskContainer.appendChild(newEl);
    }
  }
});