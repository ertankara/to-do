let numberOfTasks = 0;
function taskAdded(taskContent) {
  const tasks = [...document.querySelectorAll('.task')];
  numberOfTasks = tasks.length;
  for (let i = 0; i < numberOfTasks; i++) {
    localStorage.setItem(`task-${i}`, tasks[i].textContent);
  }
}
