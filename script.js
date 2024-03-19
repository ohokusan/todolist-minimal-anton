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

let clickStartTime;

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
      const controlsDiv = document.createElement("div");
      controlsDiv.classList.add("li-controls"); // Add the class 'li-controls'
      controlsDiv.appendChild(createDeleteButton(taskElement, index)); // Append the delete button
      controlsDiv.appendChild(createArchiveButton(taskElement, index)); // Append the delete button
      controlsDiv.appendChild(createEditButton(taskElement, index)); // Append the delete button
      controlsDiv.style.display = "none";
      taskElement.appendChild(controlsDiv);

      taskElement.addEventListener("pointerdown", (event) => {
        clickStartTime = Date.now();
      });

      taskElement.addEventListener("pointerup", () => {
        const clickDuration = Date.now() - clickStartTime;
        if (clickDuration < 500) {
          if (controlsDiv.style.display == "flex") {
            controlsDiv.style.display = "none";
          } else if (taskElement.classList.contains("pending")) {
            taskElement.classList.add("ongoing");
            taskElement.classList.remove("pending");
            tasks[index].status = "ongoing";
            localStorage.setItem("ongoingTasks", JSON.stringify(tasks));
          } else if (taskElement.classList.contains("ongoing")) {
            taskElement.classList.add("completed");
            taskElement.classList.remove("ongoing");
            tasks[index].status = "completed";
            localStorage.setItem("ongoingTasks", JSON.stringify(tasks));
          } else {
            taskElement.classList.add("pending");
            taskElement.classList.remove("completed");
            tasks[index].status = "pending";
            localStorage.setItem("ongoingTasks", JSON.stringify(tasks));
          }
        } else {
          controlsDiv.style.display = "flex";
        }
      });
      // Add event listener for long press (you can customize the duration)
      // taskElement.addEventListener("mousedown", (e) => {
      //   const timeout = setTimeout(() => {
      //     // Show controls (delete, archive, edit)
      //     // You can create buttons here and attach event listeners

      //     // createArchiveButton(taskElement, index);
      //     // createEditButton(taskElement, index);
      //     controlsDiv.style.display = "flex";
      //   }, 500); // 1 second for long press
      //   taskElement.addEventListener("mouseup", () => clearTimeout(timeout));
      // });

      // taskElement.addEventListener("click", () => {
      //   if (controlsDiv.style.display == "flex") {
      //     controlsDiv.style.display = "none";
      //   } else if (taskElement.classList.contains("pending")) {
      //     taskElement.classList.add("ongoing");
      //     taskElement.classList.remove("pending");
      //     tasks[index].status = "ongoing";
      //     localStorage.setItem("ongoingTasks", JSON.stringify(tasks));
      //   } else if (taskElement.classList.contains("ongoing")) {
      //     taskElement.classList.add("completed");
      //     taskElement.classList.remove("ongoing");
      //     tasks[index].status = "completed";
      //     localStorage.setItem("ongoingTasks", JSON.stringify(tasks));
      //   } else {
      //     taskElement.classList.add("pending");
      //     taskElement.classList.remove("completed");
      //     tasks[index].status = "pending";
      //     localStorage.setItem("ongoingTasks", JSON.stringify(tasks));
      //   }
      // });

      taskList.appendChild(taskElement);
    });
  }
}

// Function to add a new task
function addTask(title) {
  tasks.push({ title, status: "pending" }); // You can add more properties as needed
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
  return deleteButton;
  // taskElement.appendChild(deleteButton);
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
  // taskElement.appendChild(archiveButton);
  return archiveButton;
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
  // taskElement.appendChild(editButton);
  return editButton;
}

// Initial rendering
renderTasks();
