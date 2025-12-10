const API_URL = 'http://localhost:3000/api/tasks';

// Display the form
const display = () => {
    document.getElementById('fild').style.display = 'block';
};

// Hide the form
document.getElementById('cancel').addEventListener('click', () => {
    document.getElementById('fild').style.display = 'none';
    clearForm();
});

// Clear form inputs
function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('date').value = '';
    document.getElementById('des').value = '';
}

// Fetch all tasks from API
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        displayTasks(data.tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

// Display tasks on the page
function displayTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <div class="task-header">
                <h3>${task.title}</h3>
                <span class="task-date">${task.date}</span>
            </div>
            <p>${task.description}</p>
            <div class="task-actions">
                <button onclick="deleteTask(${task.id})" class="delete-btn">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

// Submit form to create a new task
document.getElementById('submit').addEventListener('click', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;
    const des = document.getElementById('des').value;

    if (!name || !date || !des) {
        alert('Please fill in all fields');
        return;
    }

    const newTask = {
        title: name,
        date: date,
        description: des,
        completed: false
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTask)
        });

        if (response.ok) {
            const createdTask = await response.json();
            console.log('Task created:', createdTask);
            clearForm();
            document.getElementById('fild').style.display = 'none';
            fetchTasks(); // Refresh the task list
        } else {
            alert('Error creating task');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error creating task');
    }
});

// Delete a task
async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log('Task deleted');
            fetchTasks(); // Refresh the task list
        } else {
            alert('Error deleting task');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error deleting task');
    }
}

// Load tasks on page load
window.addEventListener('load', () => {
    fetchTasks();
});
