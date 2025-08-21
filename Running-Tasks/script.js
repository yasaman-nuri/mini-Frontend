let isPageVisible = true;
document.addEventListener("visibilitychange", function () {
  isPageVisible = document.visibilityState === "visible";
});

document.addEventListener("DOMContentLoaded", function () {
  Notification.requestPermission();

  const form = document.getElementById("taskForm");
  const taskList = document.getElementById("taskList");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    addTask();
  });

  function addTask() {
    const taskName = document.getElementById("taskName").value;
    const taskTime = new Date(document.getElementById("taskTime").value);
    const taskDuration =
      parseInt(document.getElementById("taskDuration").value, 10) * 1000;
    const taskDependency = document.getElementById("taskDependency").value;

    const now = new Date();
    const start = taskTime.getTime() - now.getTime();
    if (start < 0) {
      console.log("Task start time cannot be in the past.");
      return;
    }

    const task = {
      name: taskName,
      time: taskTime,
      duration: taskDuration,
      dependency: taskDependency,
      status: "Scheduled",
    };

    appendTaskToList(task);
    saveTaskToLocalStorage(task);
    scheduleTask(task, start);
  }

  function scheduleTask(task, start) {
    setTimeout(() => {
      checkDependenciesAndStart(task);
    }, start);
  }

  function checkDependenciesAndStart(task) {
    if (task.dependency && isTaskPending(task.dependency)) {
      setTimeout(() => {
        checkDependenciesAndStart(task);
      }, 1000);
    } else {
      startTask(task);
    }
  }

  function startTask(task) {
    const message = `Task '${task.name}' has started.`;
    task.status = "Running";
    updateTaskInDOMAndStorage(task);
    showNotification(message);

    // همیشه تلاش برای نمایش Notification
    try {
      new Notification("Task Started", {
        body: message,
        icon: "./assets/icon.png",
      });
    } catch (e) {
      console.log("Browser notification not supported in this environment");
    }

    setTimeout(() => {
      completeTask(task);
    }, task.duration);
  }

  function completeTask(task) {
    task.status = "Done";
    updateTaskInDOMAndStorage(task);
  }

  function showNotification(message) {
    const notification = document.createElement("div");
    notification.classList.add("notification");
    const msg = document.createElement("p");
    msg.textContent = message;
    const image = document.createElement("img");
    image.src = "./assets/icon.png";
    image.width = 20;
    image.height = 20;
    notification.appendChild(msg);
    notification.appendChild(image);

    document
      .getElementById("notifications-container")
      .appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  function isTaskPending(depenTask) {
    const tasks = localStorage.getItem("tasks")
      ? JSON.parse(localStorage.getItem("tasks"))
      : [];
    const dependencyTask = tasks.find((task) => task.name === depenTask);
    return dependencyTask && dependencyTask.status !== "Done";
  }

  function appendTaskToList(task) {
    const row = document.createElement("tr");
    row.id = task.name;

    const nameCell = document.createElement("td");
    nameCell.textContent = task.name;

    const timeCell = document.createElement("td");
    timeCell.textContent = new Date(task.time).toLocaleString();

    const statusCell = document.createElement("td");
    statusCell.textContent = task.status;

    const dependencyCell = document.createElement("td");
    dependencyCell.textContent = task.dependency;

    const actionCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.style =
      "font-size:16px;background-color:#a83236;background-image:none;color:#fff;cursor:pointer";
    deleteButton.textContent = "Delete";

    deleteButton.onclick = function () {
      removeTask(row, task);
    };
    actionCell.appendChild(deleteButton);

    row.appendChild(nameCell);
    row.appendChild(timeCell);
    row.appendChild(statusCell);
    row.appendChild(dependencyCell);
    row.appendChild(actionCell);

    taskList.appendChild(row);
  }

  function updateTaskInDOMAndStorage(task) {
    const row = document.getElementById(task.name);
    const cells = row.getElementsByTagName("td");
    cells[0].textContent = task.name;
    cells[1].textContent = new Date(task.time).toLocaleString();
    cells[2].textContent = task.status;
    cells[3].textContent = task.dependency;

    updateTaskInLocalStorage(task);
  }

  function updateTaskInLocalStorage(updatedTask) {
    let tasks = localStorage.getItem("tasks")
      ? JSON.parse(localStorage.getItem("tasks"))
      : [];
    tasks = tasks.map((task) =>
      task.name === updatedTask.name ? updatedTask : task
    );
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function removeTaskFromLocalStorage(taskName) {
    let tasks = localStorage.getItem("tasks")
      ? JSON.parse(localStorage.getItem("tasks"))
      : [];
    tasks = tasks.filter((task) => task.name !== taskName);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function saveTaskToLocalStorage(task) {
    const taskList = localStorage.getItem("tasks")
      ? JSON.parse(localStorage.getItem("tasks"))
      : [];
    taskList.push(task);
    localStorage.setItem("tasks", JSON.stringify(taskList));
  }

  function loadTasksFromLocalStorage() {
    const tasks = localStorage.getItem("tasks")
      ? JSON.parse(localStorage.getItem("tasks"))
      : [];
    tasks.forEach((task) => {
      appendTaskToList(task);
      if (task.status === "Scheduled") {
        const now = new Date();
        const start = new Date(task.time).getTime() - now.getTime();
        if (start > 0) {
          scheduleTask(task, start);
        } else if (!task.dependency || !isTaskPending(task.dependency)) {
          startTask(task);
        }
      }
    });
  }

  function removeTask(row, task) {
    taskList.removeChild(row);
    removeTaskFromLocalStorage(task.name);
  }

  function createNotificationContainer() {
    const container = document.createElement("div");
    container.setAttribute("id", "notifications-container");
    document.body.appendChild(container);
  }

  loadTasksFromLocalStorage();
  createNotificationContainer();
});