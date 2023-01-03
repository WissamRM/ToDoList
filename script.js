// select elements
const form = document.getElementById("todoform");
const todoInput = document.getElementById("newtodo");
const todosListEl = document.getElementById("todos-list");
const notificationEl = document.querySelector(".notification");

// vars
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let EditTodoID = -1;

// 1st render
renderTodos();

// form submit
form.addEventListener("submit", function (event) {
  event.preventDefault();

  saveTodo();
  renderTodos();
  localStorage.setItem("todos", JSON.stringify(todos));
});

// Save todo
function saveTodo() {
  const todoValue = todoInput.value;

  // check if todo is empty
  const isEmpty = todoValue === "";

  // check for duplicate todo
  const isDuplicate = todos.some(
    (todo) => todo.value.toUpperCase() === todoValue.toUpperCase()
  );
  if (isEmpty) {
    showNotification("Please enter a todo");
  } else if (isDuplicate) {
    showNotification("Todo already exists");
  } else {
    if (EditTodoID >= 0) {
      // update the edit todo
      todos = todos.map((todo, index) => ({
        ...todo,
        value: index === EditTodoID ? todoValue : todo.value,
      }));
      EditTodoID = -1;
    } else {
      todos.push({
        value: todoValue,
        checked: false,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      });
    }

    todoInput.value = "";
  }
}

// Render todos
function renderTodos() {
  if (todos.length === 0) {
    todosListEl.innerHTML = "<center>Nothing to do! </center>";
    return;
  }

  // clear element before a re render
  todosListEl.innerHTML = "";

  // Rener todos
  todos.forEach((todo, index) => {
    todosListEl.innerHTML += `
                    <div class="todo" id=${index}>
                <i 
                class="bi ${
                  todo.checked ? "bi-check-circle-fill" : "bi-circle"
                }" 
                style="color: ${todo.color}"
                data-action="check"
                ></i>
                <p class="${
                  todo.checked ? "checked" : ""
                }" data-action="check">${todo.value}</p>
                <i class="bi bi-pencil-square" data-action="edit"></i>
                <i class="bi bi-trash" data-action="delete"></i>
            </div>
        `;
  });
}

// click event listner for all the todos
todosListEl.addEventListener("click", (event) => {
  const target = event.target;
  const parentElement = target.parentNode;

  if (parentElement.className !== "todo") return;

  // to do id
  const todo = parentElement;
  const todoId = Number(todo.id);
  // target action
  const action = target.dataset.action;

  action === "check" && checkTodo(todoId);
  action === "edit" && editTodo(todoId);
  action === "delete" && deleteTodo(todoId);
});

// check todo
function checkTodo(todoId) {
  todos = todos.map((todo, index) => ({
    ...todo,
    checked: index === todoId ? !todo.checked : todo.checked,
  }));
  renderTodos();
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Edit a todo
function editTodo(todoId) {
  todoInput.value = todos[todoId].value;
  EditTodoID = todoId;
}

// Delete a todo
function deleteTodo(todoId) {
  todos = todos.filter((todo, index) => index !== todoId);
  EditTodoID = -1;

  // re-render todos
  renderTodos();
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Show a notification
function showNotification(msg) {
  // Change the message
  notificationEl.innerHTML = msg;

  // Show the notification
  notificationEl.classList.add("notif-enter");

  // Hide the notification
  setTimeout(() => {
    notificationEl.classList.remove("notif-enter");
  }, 2000);
}
