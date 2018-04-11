document.addEventListener('DOMContentLoaded', () => {
  if (localStorage && localStorage.getItem('all-tasks')) {
    const taskArray = JSON.parse(localStorage.getItem('all-tasks'));
    for (let i = 0; i < taskArray.length; i++) {
      const task = taskArray[i];
      const newEl = document.createElement('span');
      newEl.classList.add('task');
      if (task.isCrossed) {
        newEl.classList.add('done-task');
      }
      newEl.textContent = (i + 1) + '- ' + task.taskText;
      $taskContainer.appendChild(newEl);
    }
  }
});
