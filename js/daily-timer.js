const $modal = document.querySelector('.modal');
const $modalSwitch = document.querySelector('#display-modal');
const $modalHours = $modal.querySelector('#modal-hours');
const $modalMinutes = $modal.querySelector('#modal-minutes');
const $modalCloseButton = $modal.querySelector('#close-button');


function startTimer() {
  const miliSecondsInADay = 86400 * 1000;

  let startingTime, timeLeft;


  // If there is any previous timer retrieve it
  if (localStorage.length && localStorage.getItem('starting-time')) {
    startingTime = Number(localStorage.getItem('starting-time'));
  } else {
    // Else assign current moment
    startingTime = new Date().getTime();
    localStorage.setItem('starting-time', startingTime);
  }

  // Calculate ending date
  const endingTime = startingTime + miliSecondsInADay;
  let now = new Date().getTime();
  // Update the timer visually
  updateTimer(endingTime - now);

  let interval = setInterval(() => {
    // Get current time
    now = new Date().getTime();
    // Get how much time left between now and ending date
    timeLeft = endingTime - now;
    // Update the timer with new values
    updateTimer(timeLeft);

    if (timeLeft <= 0) {
      clearInterval(interval);
      checkState();
      localStorage.removeItem('starting-time');
      localStorage.removeItem('all-tasks');
    }
  }, 40000);
}


function updateTimer(totalMiliSeconds) {
  if (totalMiliSeconds < 0 || typeof totalMiliSeconds !== 'number')
    return;
  const seconds = Math.floor(totalMiliSeconds / 1000);
  const hours = Math.floor(seconds / (60 * 60));
  const extractHours = seconds % (60 * 60);
  const minutes = Math.floor(extractHours / 60);


  $modalHours.textContent = String(hours).padStart(2, '0');
  $modalMinutes.textContent = String(minutes).padStart(2, '0');
}


function checkState() {
  if (!localStorage.getItem('all-tasks')) {
    return;
  }
  const taskList = JSON.parse(localStorage.getItem('all-tasks'));
  $renewListButton.style.display = 'block';

  for (let i = 0; i < taskList.length; i++) {
    if (!taskList[i].isCrossed) {
      alert('Failed to fulfill goal');
      return;
    }
  }
  alert('You\'ve successfully completed your tasks');
}


$modalSwitch.addEventListener('click', () => {
  $modal.style.display = 'block';
});


$modalCloseButton.addEventListener('click', event => {
  $modal.style.display = 'none';
});


document.addEventListener('keydown', event => {
  if (event.keyCode === 27 && $modal.style.display === 'block') {
    $modal.style.display = 'none';
  }
});
