const inputToDoEl = document.getElementById("to-do-input");
const btnAddToDoEl = document.getElementById("add-to-do");
const btnUpdateToDoEl = document.getElementById("update-to-do");
const toDoDiv = document.getElementById("to-do-list");
const completedEl = document.getElementById("completed");
const idEl = document.getElementById("id");
const formEl = document.getElementById("todoForm");
const filterSelect = document.getElementById("filterSelect");

let todos = [];
let todosIndex = null;
let isEdit = false;
let currentFilter = "pending";

btnUpdateToDoEl.style.display = "none";
formEl.addEventListener("submit", handleSave);
loadFromLocalStorage();
currentFilter = "pending";
renderToDo();
function reindexTodos() {
  todos.forEach((todo, index) => {
    todo.id = index + 1;
  });
}
function searchToDo() {}
function undoCompleted(index) {
  todos[index].completed = false;
  saveToLocalStorage();
  renderToDo();
}

function newTask(event) {
  event.preventDefault();
  const input = inputToDoEl.value.trim();
  if (input === "") {
    alert("please input a task");
    return;
  }
  const to_do_object = {
    id: 0,
    title: input,
    date: new Date().toLocaleDateString(),
    completed: false,
  };

  todos.push(to_do_object);
  reindexTodos();
  saveToLocalStorage();
  renderToDo();
  clearInput();
}
function renderToDo() {
  toDoDiv.innerHTML = "";

  let filteredTodos = [];

  if (currentFilter === "completed") {
    filteredTodos = todos.filter((todo) => todo.completed);
  } else if (currentFilter === "pending") {
    filteredTodos = todos.filter((todo) => !todo.completed);
  } else {
    filteredTodos = todos;
  }

  filteredTodos.forEach((task) => {
    const index = todos.findIndex((t) => t.id === task.id);

    const h1 = document.createElement("h1");

    h1.innerHTML = `
    <div class="max-w-3xl mx-auto w-full">
      <div class="flex flex-col p-4 shadow-md border-l-4 rounded-r-lg mb-4 gap-4
        ${task.completed ? "bg-emerald-100 border-emerald-500" : "bg-white border-blue-500"}">

        <div>
          <span class="text-xs font-bold text-slate-400">#${task.id}</span>
          <h2 class="text-xl font-semibold
            ${task.completed ? "line-through text-emerald-800" : "text-slate-800"}">
            ${task.title}
          </h2>
        </div>

        <div class="flex gap-2 pt-3 border-t">
          <button onclick="editTask(${index})"
            class="bg-indigo-100 px-3 py-2 rounded-md">
            Edit
          </button>

          <button onclick="deleteTask(${index})"
            class="bg-red-100 px-3 py-2 rounded-md">
            Delete
          </button>

          ${
            task.completed
              ? `<button onclick="undoCompleted(${index})"
                   class="bg-yellow-100 px-3 py-2 rounded-md">
                   Undo
                 </button>`
              : `<button onclick="taskComplete(${index})"
                   class="bg-emerald-100 px-3 py-2 rounded-md">
                   Complete
                 </button>`
          }
        </div>
      </div>
    </div>
    `;

    toDoDiv.append(h1);
  });
}

function taskComplete(index) {
  todos[index].completed = true;
  saveToLocalStorage();
  renderToDo();
}
function editTask(index) {
  isEdit = true;
  todosIndex = index;
  const task = todos[index];
  console.log(task);

  inputToDoEl.value = task.title;

  btnAddToDoEl.style.display = "none";
  btnUpdateToDoEl.style.display = "inline-block";
}
function updateTask(event, index) {
  event.preventDefault();
  const input = inputToDoEl.value.trim();
  if (input === "") {
    alert("please input a task");
    return;
  }
  const update_task = {
    id: todos[todosIndex].id,
    title: inputToDoEl.value,
    date: new Date().toLocaleDateString(),
    completed: todos[todosIndex].completed,
  };

  todos[todosIndex] = update_task;
  saveToLocalStorage();
  renderToDo();
  clearInput();
  isEdit = false;
  todosIndex = null;

  btnAddToDoEl.style.display = "inline-block";
  btnUpdateToDoEl.style.display = "none";
}
function clearInput() {
  inputToDoEl.value = "";
}

function deleteTask(index) {
  console.log(index);
  // const sure = confirm("are you sure!");
  // if (!sure) return;
  todos.splice(index, 1);
  console.log(todos);
  reindexTodos();
  saveToLocalStorage();
  renderToDo();
}
function saveToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}
function loadFromLocalStorage() {
  const data = localStorage.getItem("todos");
  if (data) {
    todos = JSON.parse(data);
    renderToDo();
  }
}

function handleSave(event) {
  event.preventDefault();

  if (isEdit) {
    updateTask(event);
  } else {
    newTask(event);
  }
}
function filterTodos() {
  currentFilter = filterSelect.value;
  renderToDo();
}
