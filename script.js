document.addEventListener('DOMContentLoaded', () => {
    // Request notification permission
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }

    loadTasks();
});

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        addTaskToDOM(task.text, task.completed);
    });
}

function addTask() {
    const newTaskInput = document.getElementById('new-task');
    const taskText = newTaskInput.value.trim();
    if (taskText) {
        addTaskToDOM(taskText);
        saveTask(taskText);
        newTaskInput.value = '';
        showNotification('Task added successfully!');
    }
}

function addTaskToDOM(taskText, completed = false) {
    const taskList = document.getElementById('task-list');
    const li = document.createElement('li');
    if (completed) li.classList.add('completed');
    li.innerHTML = `${taskText} <button class="delete" onclick="deleteTask(this)">Delete</button>`;
    li.onclick = () => {
        li.classList.toggle('completed');
        updateTask(taskText, li.classList.contains('completed'));
        showNotification('Task status updated!');
    };
    taskList.appendChild(li);
}

function saveTask(taskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text: taskText, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTask(taskText, completed) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => {
        if (task.text === taskText) {
            return { text: taskText, completed };
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteTask(button) {
    const li = button.parentElement;
    const taskText = li.firstChild.textContent;
    li.remove();
    removeTask(taskText);
    showNotification('Task deleted!');
}

function removeTask(taskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}