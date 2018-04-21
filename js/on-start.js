let taskCounter = 0;
document.addEventListener('DOMContentLoaded', () => {
  // If localStorage exists in the browser and there are some previous tasks
  if (localStorage.length && localStorage.getItem('all-tasks')) {
    // Retrieve the task array
    const taskArray = JSON.parse(localStorage.getItem('all-tasks'));
    taskCounter = taskArray.length;
    // And create span elements for each task
    for (let i = 0; i < taskArray.length; i++) {
      const task = taskArray[i];
      const newEl = document.createElement('span');
      newEl.classList.add('task');
      // If task was previously crossed over then cross it over again
      if (task.isCrossed) {
        newEl.classList.add('done-task');
      }
      newEl.textContent = (i + 1) + '- ' + task.taskText;
      $taskContainer.appendChild(newEl);
    }

    if (taskCounter >= 9) {
      document.querySelector('#renew-list-button').style.display = 'block';
    }
  }

  if (localStorage && localStorage.getItem('starting-time')) {
    startTimer(
      Number(localStorage.getItem('hour-storage')),
      Number(localStorage.getItem('minute-storage'))
    );
  }
});
