const todoList = document.getElementById("todo-list");
const footer = document.getElementById("footer");
const addForm = document.getElementById("add-form");
const searchInput = document.getElementById("search");

let todos = loadFromLocalStorage() || [];

async function fetchTodos() {
  try {
    const response = await fetch("https://dummyjson.com/todos");
    const data = await response.json();
    todos = data.todos;
    renderTodos();
  } catch (error) {
    console.error("Error fetching TODO list:", error);
  }
}

function renderTodoItem(item) {
    return `
      <tr>
        <td>${item.id}</td>
        <td>
          <span class="todo-text">${item.todo}</span>
          <input class="edit-input" type="text" value="${item.todo}" style="display: none;">
        </td>
        <td>${item.userId}</td>
        <td>${item.completed ? "Completed" : "Pending"}</td>
        <td>
          <button class="delete-button">Delete</button>
          <button class="done-button">Done</button>
          <button class="edit-button">Edit</button>
          <button class="save-button" style="display: none;">Save</button>
        </td>
      </tr>
    `;
  }
  

function renderTodos(filteredTodos = todos) {
  todoList.innerHTML = filteredTodos.map(renderTodoItem).join("");
  updateFooter();
}

function addNewTodo(newTask) {
  const lastId = todos.length > 0 ? todos[todos.length - 1].id : 0;
  const newTodo = {
    id: lastId + 1,
    todo: newTask,
    userId: generateUniqueId(),
    completed: false,
  };

  todos.push(newTodo);
  updateLocalStorage();
}

function updateLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

addForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const newTaskInput = document.getElementById("newTask");
  const newTask = newTaskInput.value.trim();

  if (newTask !== "") {
    addNewTodo(newTask);
    renderTodos();
    newTaskInput.value = "";
  }
});

todoList.addEventListener("click", function (event) {
  const row = event.target.closest("tr");
  if (!row) return;

  const taskId = parseInt(row.querySelector("td:first-child").textContent);

  if (event.target.classList.contains("delete-button")) {
    if (confirm("Are you sure you want to delete this task?")) {
      todos = todos.filter((todo) => todo.id !== taskId);
      updateLocalStorage();
      renderTodos();
    }
  } else if (event.target.classList.contains("done-button")) {
    const task = todos.find((todo) => todo.id === taskId);
    task.completed = !task.completed;
    updateLocalStorage();
    renderTodos();
  }
});

searchInput.addEventListener("input", function (event) {
  const searchTerm = event.target.value.trim().toLowerCase();
  const filteredTodos = todos.filter((todo) =>
    todo.todo.toLowerCase().includes(searchTerm)
  );
  renderTodos(filteredTodos);
});

todoList.addEventListener("click", function (event) {
    const row = event.target.closest("tr");
    if (!row) return;
  
    const taskId = parseInt(row.querySelector("td:first-child").textContent);
  
    if (event.target.classList.contains("edit-button")) {
      const todoText = row.querySelector(".todo-text");
      const editInput = row.querySelector(".edit-input");
      const saveButton = row.querySelector(".save-button");
  
      todoText.style.display = "none";
      editInput.style.display = "inline-block";
      saveButton.style.display = "inline-block";
  
      editInput.focus();
    } else if (event.target.classList.contains("save-button")) {
      const editInput = row.querySelector(".edit-input");
      const updatedTodo = editInput.value.trim();
  
      if (updatedTodo !== "") {
        const task = todos.find((todo) => todo.id === taskId);
        task.todo = updatedTodo;
        updateLocalStorage();
        renderTodos();
      }
    }
  });
  
function generateUniqueId() {
  return Math.floor(Math.random() * 50);
}

function loadFromLocalStorage() {
  const storedTodos = localStorage.getItem("todos");
  return storedTodos ? JSON.parse(storedTodos) : null;
}
function updateFooter() {
  footer.textContent = `Total Tasks: ${todos.length}`;
}
if (todos.length === 0) {
  fetchTodos();
} else {
  renderTodos();
}
