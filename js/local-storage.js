function taskAdded(taskObject) {
  let taskArray = [];
  // Check if there is previous tasks
  if (localStorage && localStorage.getItem('all-tasks')) {
    taskArray = JSON.parse(localStorage.getItem('all-tasks'));
  }
  // Add new task to the array
  taskArray.push(taskObject);
  // Store back the task
  const stringified = JSON.stringify(taskArray);
  localStorage.setItem(`all-tasks`, stringified);
}
