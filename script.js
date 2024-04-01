const newTaskBtn = document.getElementById("new-task-btn");
const managingTaskEl = document.getElementById("task-modal");
const taskInputEl = document.getElementById("task-input");
const closeBtn = document.getElementById("close-btn");
const confirmBtn = document.getElementById("confirm-btn");
const ongoingBtn = document.getElementById("ongoing-btn");
const archiveBtn = document.getElementById("archive-btn");
const taskList = document.getElementById("ongoing-list");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = ongoingBtn.classList.contains("active")
    ? tasks.filter((task) => task.status !== "archived")
    : tasks.filter((task) => task.status === "archived");

  if (filteredTasks.length === 0) {
    taskList.innerHTML = "<p style='text-align:center;'>No tasks found.</p>";
  } else {
    filteredTasks.forEach((task) => {
      const taskElement = document.createElement("li");
      taskElement.textContent = task.title;
      taskElement.classList.add("task", task.status);

      const controlsDiv = document.createElement("div");
      controlsDiv.classList.add("task-controls");
      controlsDiv.appendChild(createDeleteButton(task));
      controlsDiv.appendChild(createArchiveButton(task));
      controlsDiv.appendChild(createEditButton(task));
      controlsDiv.style.display = "none";

      taskElement.appendChild(controlsDiv);

      let isContextMenuOpen = false;
      let clickStartTime;

      taskElement.addEventListener("touchstart", (e) => {
        clickStartTime = Date.now();
      });

      taskElement.addEventListener("touchend", (e) => {
        const clickDuration = Date.now() - clickStartTime;
        if (clickDuration < 400 && isContextMenuOpen == false) {
          toggleTaskStatus(task, taskElement);
        } else if (isContextMenuOpen == true) {
          isContextMenuOpen = false;
          controlsDiv.style.display = "none";
        } else {
          isContextMenuOpen = true;
          controlsDiv.style.display = "flex";
        }
      });

      // taskElement.addEventListener("touchcancel", () => {
      //   clearTimeout(pressTimer);
      // });

      taskElement.addEventListener("mousedown", () => {
        clickStartTime = Date.now();
      });

      taskElement.addEventListener("mouseup", (e) => {
        const clickDuration = Date.now() - clickStartTime;
        if (clickDuration < 400 && isContextMenuOpen == false) {
          toggleTaskStatus(task, taskElement);
        } else if (isContextMenuOpen == true) {
          isContextMenuOpen = false;
          controlsDiv.style.display = "none";
        } else {
          isContextMenuOpen = true;
          controlsDiv.style.display = "flex";
        }
      });

      // taskElement.addEventListener("mouseleave", () => {
      //   clearTimeout(pressTimer);
      // });

      // taskElement.addEventListener("click", (e) => {
      //   if (isContextMenuOpen) {
      //     isContextMenuOpen = false;
      //     controlsDiv.style.display = "none";
      //   } else {
      //     toggleTaskStatus(task, taskElement);
      //   }
      // });

      taskList.appendChild(taskElement);
    });
  }
}

function toggleTaskStatus(task, taskElement) {
  if (task.status === "pending") {
    task.status = "ongoing";
  } else if (task.status === "ongoing") {
    task.status = "completed";
  } else if (task.status === "completed") {
    task.status = "pending";
  }
  taskElement.classList.remove("pending", "ongoing", "completed");
  taskElement.classList.add(task.status);
  saveTasks();
  renderTasks();
}

function addTask(title) {
  tasks.push({ title, status: "pending" });
  saveTasks();
  renderTasks();
}

function deleteTask(task) {
  const index = tasks.indexOf(task);
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function archiveTask(task) {
  const index = tasks.indexOf(task);
  tasks[index].status =
    tasks[index].status === "archived" ? "pending" : "archived";
  saveTasks();
  renderTasks();
}

function editTask(task, newTitle) {
  const index = tasks.indexOf(task);
  tasks[index].title = newTitle;
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function createDeleteButton(task) {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("btn-delete");
  deleteButton.addEventListener("click", (e) => {
    e.stopPropagation();
    deleteTask(task);
  });
  return deleteButton;
}

function createArchiveButton(task) {
  const archiveButton = document.createElement("button");
  archiveButton.textContent =
    task.status === "archived" ? "Unarchive" : "Archive";
  archiveButton.classList.add("btn-archive");
  archiveButton.addEventListener("click", (e) => {
    e.stopPropagation();
    archiveTask(task);
  });
  return archiveButton;
}

function createEditButton(task) {
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.classList.add("btn-edit");
  editButton.addEventListener("click", (e) => {
    e.stopPropagation();
    const newTitle = prompt("Edit task:", task.title);
    if (newTitle) {
      editTask(task, newTitle);
    }
  });
  return editButton;
}

newTaskBtn.addEventListener("click", () => {
  taskInputEl.value = "";
  managingTaskEl.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  managingTaskEl.style.display = "none";
});

taskInputEl.addEventListener("input", () => {
  confirmBtn.style.display = taskInputEl.value.trim() !== "" ? "block" : "none";
});

confirmBtn.addEventListener("click", () => {
  const newTask = taskInputEl.value.trim();
  if (newTask !== "") {
    addTask(newTask);
    taskInputEl.value = "";
    managingTaskEl.style.display = "none";
  }
});

ongoingBtn.addEventListener("click", () => {
  ongoingBtn.classList.add("active");
  archiveBtn.classList.remove("active");
  renderTasks();
});

archiveBtn.addEventListener("click", () => {
  archiveBtn.classList.add("active");
  ongoingBtn.classList.remove("active");
  renderTasks();
});

renderTasks();
