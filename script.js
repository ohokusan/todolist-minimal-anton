const newTaskBtn = document.querySelector(".btn-float");
const managingTaskEl = document.querySelector(".managing-task");
const taskEl = document.getElementById("task");
const closeBtn = document.querySelector(".btn-close");
const confirmBtn = document.querySelector(".btn-confirm");

newTaskBtn.addEventListener("click", function () {
  managingTaskEl.style.display = "block";
});

closeBtn.addEventListener("click", function () {
  managingTaskEl.style.display = "none";
  taskEl.value = "";
});

taskEl.addEventListener("input", function () {
  confirmBtn.style.display = taskEl.value ? "block" : "none";
});
