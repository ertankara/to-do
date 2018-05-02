(function () {
  /* ============= MODEL ============= */
  const model = {
    currentId: null,

    init() {
      if (!localStorage.allTasks) {
        localStorage.allTasks = JSON.stringify([]);
      }
      this.setCurrentId();
    },

    add(obj) {
      const allTasks = JSON.parse(localStorage.allTasks);
      allTasks.push(obj);
      localStorage.allTasks = JSON.stringify(allTasks);
      // Update current id after adding the task
      this.setCurrentId();
    },

    get() {
      return JSON.parse(localStorage.allTasks);
    },

    getCurrentId() {
      return this.currentId;
    },

    setCurrentId() {
      // When array length is 0, adding one makes it human friendly
      this.currentId = this.get().length + 1;
    },

    updateStorage(taskList) {
      localStorage.allTasks = JSON.stringify(taskList);
    },

    getRemainingTime() {
      return localStorage.remainingTime;
    },

    setRemainingTime(time) {
      localStorage.remainingTime = time;
    },

    emptyStorage() {
      localStorage.clear();
      this.init();
    },

    crossState(task) {
      const tasks = model.get();
      for (let i = 0; i < tasks.length; i++) {
        if (task.id === tasks[i].id) {
          if (tasks[i].isCrossed)
            tasks[i].isCrossed = false;
          else
            tasks[i].isCrossed = true;
        }
      }
      this.updateStorage(tasks)
    }
  };

  /* ============= CONTROL ============= */
  const control = {
    init() {
      console.log('Awesome app being initialized!!!');
      model.init();
      taskListView.init();
      setTimeView.init();
      addTaskView.init();
      renewButtonView.init();
      remainingTimeView.init();

      // Add functionality for some keys
      document.addEventListener('keydown', e => {
        if (e.keyCode === 13 && document.activeElement === addTaskView.newTaskInputField) {
          control.addNewTask(addTaskView.newTaskInputField.value);
          addTaskView.render();
        }
        else if (
          e.keyCode === 13 &&
          (document.activeElement === setTimeView.hourInput ||
            document.activeElement === setTimeView.minuteInput)
        ) {
          setTimeView.timeInputHandler();
        }
        else if (e.keyCode === 27 && remainingTimeView.timeModal.style.display === 'block') {
          remainingTimeView.timeModal.style.display = 'none';
        }
        else if (e.keyCode === 27 && setTimeView.inputModal.style.display === 'block') {
          setTimeView.inputModal.style.display = 'none';
        }
      });
    },

    getTaskList() {
      return model.get();
    },

    addNewTask(taskText) {
      model.add({
        id: model.getCurrentId(),
        task: taskText,
        isCrossed: false
      });
      // Update list visually after adding the task
      taskListView.render();
      addTaskView.render();
      renewButtonView.render();
    },

    changeCrossState(task) {
      model.crossState(task);
      taskListView.render();
    },

    getTime() {
      return model.getRemainingTime();
    },

    setTime(newTime) {
      model.setRemainingTime(newTime + Date.now());
      remainingTimeView.render();
    },

    displayProperModal() {
      if (control.getTime()) {
        remainingTimeView.timeModal.style.display = 'block';
      } else {
        setTimeView.inputModal.style.display = 'block';
      }
    },

    clearStorage() {
      model.emptyStorage();
      taskListView.render();
      renewButtonView.render();
    }
  };

  /* ============= TASK LIST VIEW ============= */
  const taskListView = {
    init() {
      this.containerElement = document.querySelector('#task-container');

      this.spanEventHandler = e => {
        const allTasks = control.getTaskList();
        for (let i = 0; i < allTasks.length; i++) {
          if (
            e.target.textContent === (allTasks[i].id) +
            '- ' + allTasks[i].task
          ) {
            control.changeCrossState(allTasks[i]);
            break;
          }
        }
      }
      this.render();
    },

    render() {
      // Clear the contents of the element then add them with the updated ones
      while (this.containerElement.firstElementChild) {
        this.containerElement.firstElementChild.remove();
      }

      const allTasks = control.getTaskList();
      // Create span element for each task and then add them to the DOM
      const fragment = document.createDocumentFragment();
      allTasks.forEach(task => {
        const span = document.createElement('span');
        span.classList.add('task');
        span.textContent = task.id + '- ' + task.task;
        if (task.isCrossed) {
          span.classList.add('done-task');
        }
        span.addEventListener('click', this.spanEventHandler);
        fragment.appendChild(span);
      });
      this.containerElement.appendChild(fragment);
    }
  };

  /* ============= ADD TASK VIEW ============= */
  const addTaskView = {
    init() {
      this.newTaskInputField = document.querySelector('#add-task');
      this.addTaskButton = document.querySelector('#add-task-button');

      this.addTaskButton.addEventListener('click', () => {
        // Add the provided string as a task
        control.addNewTask(this.newTaskInputField.value);
      });
      this.render();
    },

    render() {
      // Remove remenants of the previously added task
      this.newTaskInputField.value = '';
    }
  };

  /* ============= REMAINING TIME VIEW ============= */
  const remainingTimeView = {
    init() {
      this.timeModalDisplayButton = document.querySelector('#display-modal');
      this.timeModal = document.querySelector('.modal');
      this.modalCloseButton = document.querySelector('#close-button');
      this.remainingHours = document.querySelector('#modal-hours');
      this.remaningMinutes = document.querySelector('#modal-minutes');

      this.modalCloseButton.addEventListener('click', () => {
        this.timeModal.style.display = 'none';
      });

      this.timeModalDisplayButton.addEventListener('click', () => {
        control.displayProperModal();
      });

      if (control.getTime())
        this.render();
    },

    render() {
      let interval;
      const calculateReaminingTime = () => {
        const targetTime = control.getTime();
        const currentTime = Date.now();

        const seconds = (targetTime - currentTime) / 1000;
        const hours = Math.floor(seconds / (60 * 60));
        const hoursExtracted = seconds % (60 * 60);
        const minutes = Math.floor(hoursExtracted / 60);
        //if (targetTime - currentTime > 0) {
        this.remainingHours.textContent = String(hours).padStart(2, '0');
        this.remaningMinutes.textContent = String(minutes).padStart(2, '0');
        //}

        // End condition
        if (targetTime - currentTime <= 0) {
          if (this.timeModal.style.display === 'block') {
            this.timeModal.style.display = 'none';
          }
          if (interval) {
            clearInterval(interval);
          }
          const tasks = control.getTaskList();
          let isFailed = false;
          for (let i = 0; i < tasks.length; i++) {
            // If there is an undone task
            if (!tasks[i].isCrossed) {
              alert('Failed to accomplish tasks...');
              isFailed = true;
              break;
            }
          }
          if (!isFailed) {
            alert('Successfully completed all tasks!');
          }
          control.clearStorage();
          return;
        }

      };
      setTimeout(() => {
        calculateReaminingTime();
      }, 200)
      interval = setInterval(() => calculateReaminingTime(), 6000);
      // For the instant view for the modal


      // Check remaining time every six seconds
    }
  };

  /* ============= SET NEW TIMER ============= */
  const setTimeView = {
    init() {
      this.inputModal = document.querySelector('#input-modal');
      this.hourInput = document.querySelector('#hour-input');
      this.minuteInput = document.querySelector('#minute-input');
      this.setTimeButton = document.querySelector('#set-time');

      this.timeInputHandler = () => {
        if (this.hourInput.value === '') {
          this.hourInput.value = 0;
        }

        if (this.minuteInput.value === '') {
          this.minuteInput.value = 0;
        }

        if (
          !validateNumbers(
            Number(this.hourInput.value),
            Number(this.minuteInput.value)
          )
        ) {
          return;
        }

        // Convert values into miliseconds then save into localStorage
        const hours = this.hourInput.value * (60 * 60 * 1000);
        const minutes = this.minuteInput.value * (60 * 1000);
        control.setTime(hours + minutes);
        this.render();
      };
      this.setTimeButton.addEventListener('click', this.timeInputHandler);
    },

    render() {
      this.hourInput.value = '';
      this.minuteInput.value = '';
      this.inputModal.style.display = 'none';
    }
  };

  /* ============= RENEW BUTTON VIEW ============= */
  const renewButtonView = {
    init() {
      this.renewButton = document.querySelector('#renew-list-button');
      this.renewButton.addEventListener('click', () => {
        control.clearStorage();
        this.renewButton.style.display = 'none';
      });
      this.render();
    },

    render() {
      const tasks = control.getTaskList();
      console.log(tasks.length);
      if (tasks.length > 0) {
        this.renewButton.style.display = 'block';
      }
      else {
        this.renewButton.style.display = 'none';
      }
    }
  };

  // Check input numbers if they are valid
  function validateNumbers(firstInput, secondInput) {
    if (
      (!Number.isNaN(firstInput) &&
        typeof firstInput === 'number' &&
        Number.isInteger(firstInput)) &&
      (!Number.isNaN(secondInput) &&
        typeof secondInput === 'number' &&
        Number.isInteger(secondInput))
    ) {
      return true;
    }
    return false;
  }

  // Polyfill for padStart function
  if (!(''.padStart)) {
    String.prototype.padStart = function (numberOfCharactersToFill, character) {
      if (this.length < numberOfCharactersToFill) {
        let str = '';
        let times = numberOfCharactersToFill - this.length;
        for (let i = 0; i < times; i++) {
          str += character;
        }
        return String(str + this);
      }
      return String(this);
    };
  }

  control.init();
})();
