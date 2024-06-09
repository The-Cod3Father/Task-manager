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
        if (task.completed) {
            addTaskToDOM(task.text, task.timestamp, task.date, true);
        } else {
            addTaskToDOM(task.text, task.timestamp, task.date);
        }
    });
}

function addTask() {
    const newTaskInput = document.getElementById('new-task');
    const taskDateInput = document.getElementById('task-date');
    const taskText = newTaskInput.value.trim();
    const taskDate = taskDateInput.value;
    const timestamp = new Date().toLocaleString();
    if (taskText) {
        addTaskToDOM(taskText, timestamp, taskDate);
        saveTask(taskText, timestamp, taskDate);
        newTaskInput.value = '';
        taskDateInput.value = '';
        showNotification('Task added successfully!');
    }
}

function addTaskToDOM(taskText, timestamp, taskDate, completed = false) {
    const taskList = completed ? document.getElementById('completed-task-list') : document.getElementById('task-list');
    const li = document.createElement('li');
    if (completed) li.classList.add('completed');
    li.innerHTML = `
        ${taskText}
        <span class="timestamp">${timestamp}</span>
        <button class="delete" onclick="confirmDeleteTask(this)">Delete</button>
        <div class="notes">
            <textarea placeholder="Add notes..."></textarea>
        </div>`;
    li.onclick = () => {
        if (!completed) {
            li.classList.toggle('completed');
            updateTask(taskText, timestamp, taskDate, li.classList.contains('completed'));
            showNotification('Task status updated!');
        }
    };
    taskList.appendChild(li);
}

function saveTask(taskText, timestamp, taskDate) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text: taskText, timestamp, date: taskDate, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTask(taskText, timestamp, taskDate, completed) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => {
        if (task.text === taskText && task.timestamp === timestamp) {
            return { text: taskText, timestamp, date: taskDate, completed };
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    if (completed) {
        moveToCompleted(taskText, timestamp, taskDate);
    }
}

function moveToCompleted(taskText, timestamp, taskDate) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const completedTasks = tasks.filter(task => task.completed);
    const activeTasks = tasks.filter(task => !task.completed);
    localStorage.setItem('tasks', JSON.stringify(activeTasks));
    completedTasks.forEach(task => {
        addTaskToDOM(task.text, task.timestamp, task.date, true);
    });
}

function confirmDeleteTask(button) {
    if (confirm('Are you sure you want to delete this task?')) {
        deleteTask(button);
    }
}

function deleteTask(button) {
    const li = button.parentElement;
    const taskText = li.childNodes[0].nodeValue.trim();
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