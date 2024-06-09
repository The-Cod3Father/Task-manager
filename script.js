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
        addTaskToDOM(task.text, task.timestamp, task.completed);
    });
}

function addTask() {
    const newTaskInput = document.getElementById('new-task');
    const taskText = newTaskInput.value.trim();
    const timestamp = new Date().toLocaleString();
    if (taskText) {
        addTaskToDOM(taskText, timestamp);
        saveTask(taskText, timestamp);
        newTaskInput.value = '';
        showNotification('Task added successfully!');
    }
}

function addTaskToDOM(taskText, timestamp, completed = false) {
    const taskList = document.getElementById('task-list');
    const li = document.createElement('li');
    if (completed) li.classList.add('completed');
    li.innerHTML = `${taskText} <span class="timestamp">${timestamp}</span> <button class="delete" onclick="confirmDeleteTask(this)">Delete</button>`;
    li.onclick = () => {
        li.classList.toggle('completed');
        updateTask(taskText, timestamp, li.classList.contains('completed'));
        showNotification('Task status updated!');
    };
    taskList.appendChild(li);
}

function saveTask(taskText, timestamp) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text: taskText, timestamp, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTask(taskText, timestamp, completed) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => {
        if (task.text === taskText && task.timestamp === timestamp) {
            return { text: taskText, timestamp, completed };
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function confirmDeleteTask(button) {
    if (confirm('Are you sure you want to delete this task?')) {
        deleteTask(button);
    }
}

function deleteTask(button) {
    const li = button.parentElement;
    const taskText = li.firstChild.textContent;
    const timestamp = li.querySelector('.timestamp').textContent;
    li.remove();
    removeTask(taskText, timestamp);
    showNotification('Task deleted!');
}

function removeTask(taskText, timestamp) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.text !== taskText || task.timestamp !== timestamp);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function showNotification(message) {
    if (Notification.permission === 'granted') {
        new Notification(message);
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(message);
            }
        });
    }
}