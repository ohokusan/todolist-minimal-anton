const newTaskBtn = document.querySelector(".btn-float");
const managingTaskEl = document.querySelector(".managing-task");
const taskInputEl = document.getElementById("task-input");
const closeBtn = document.querySelector(".btn-close");
const confirmBtn = document.querySelector(".btn-confirm");
const ongoingBtn = document.getElementById("ongoing");
const archiveBtn = document.getElementById("archive");
const taskList = document.querySelector(".ongoing-task-list");
const tasks = JSON.parse(localStorage.getItem("ongoingTasks")) || [];
const archiveTasks = JSON.parse(localStorage.getItem("archiveTasks")) || [];

function renderTasks() {
  taskList.innerHTML = ""; // Clear existing tasks
  if (tasks.length === 0) {
    // Display "Add your first task..." message
    taskList.innerHTML =
      "<p style='text-align:center;'>Add your first task...</p>";
  } else {
    tasks.forEach((task, index) => {
      const taskElement = document.createElement("li");
      taskElement.textContent = task.title;
      taskElement.classList.add("task", task.status); // Add appropriate class (e.g., 'ongoing', 'completed')
      taskElement.dataset.index = index; // Store task index for later reference

      // Add event listener for long press (you can customize the duration)
      taskElement.addEventListener("mousedown", (e) => {
        const timeout = setTimeout(() => {
          // Show controls (delete, archive, edit)
          // You can create buttons here and attach event listeners
          createDeleteButton(taskElement, index);
          createArchiveButton(taskElement, index);
          createEditButton(taskElement, index);
        }, 1000); // 1 second for long press
        taskElement.addEventListener("mouseup", () => clearTimeout(timeout));
      });

      taskList.appendChild(taskElement);
    });
  }
}

// Function to add a new task
function addTask(title) {
  tasks.push({ title, status: "ongoing" }); // You can add more properties as needed
  localStorage.setItem("ongoingTasks", JSON.stringify(tasks));
  renderTasks();
}

// You can similarly handle editing, archiving, and deleting tasks.

newTaskBtn.addEventListener("click", () => {
  taskInputEl.value = ""; // Clear task input value
  managingTaskEl.style.display = "block"; // Make managing task element visible
});

closeBtn.addEventListener("click", () => {
  // Clear task input value
  managingTaskEl.style.display = "none"; // Make managing task element visible
});

taskInputEl.addEventListener("input", () => {
  if (taskInputEl.value.trim() !== "") {
    confirmBtn.style.display = "block";
  } else {
    confirmBtn.style.display = "none";
  }
});

confirmBtn.addEventListener("click", () => {
  const newTask = taskInputEl.value;
  if (newTask) {
    addTask(newTask);
  }
  taskInputEl.value = "";
  managingTaskEl.style.display = "none";
});

function createDeleteButton(taskElement, index) {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("btn", "btn-delete");
  deleteButton.addEventListener("click", () => {
    tasks.splice(index, 1); // Remove task from array
    localStorage.setItem("ongoingTasks", JSON.stringify(tasks)); // Update localStorage
    renderTasks(); // Re-render the task list
  });
  taskElement.appendChild(deleteButton);
}

function createArchiveButton(taskElement, index) {
  const archiveButton = document.createElement("button");
  archiveButton.textContent = "Archive";
  archiveButton.classList.add("btn", "btn-archive");
  archiveButton.addEventListener("click", () => {
    const archivedTask = tasks[index]; // Get the task to be archived
    tasks.splice(index, 1);
    archiveTasks.push(archivedTask); // Add task to archiveTasks
    localStorage.setItem("archiveTasks", JSON.stringify(archiveTasks));
    localStorage.setItem("ongoingTasks", JSON.stringify(tasks)); // Update localStorage

    renderTasks(); // Re-render the task list
  });
  taskElement.appendChild(archiveButton);
}

function createEditButton(taskElement, index) {
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.classList.add("btn", "btn-edit");
  editButton.addEventListener("click", () => {
    const newTitle = prompt("Edit task:", tasks[index].title);
    if (newTitle) {
      tasks[index].title = newTitle; // Update task title
      localStorage.setItem("ongoingTasks", JSON.stringify(tasks)); // Update localStorage
      renderTasks(); // Re-render the task list
    }
  });
  taskElement.appendChild(editButton);
}

// Initial rendering
renderTasks();
