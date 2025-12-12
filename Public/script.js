const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api/tasks'
    : 'https://todobymanis.up.railway.app/api/tasks';

// Display the form
const display = () => {
    document.getElementById('fild').style.display = 'block';
};

// Hide the form
document.getElementById('cancel').addEventListener('click', () => {
    document.getElementById('fild').style.display = 'none';
    clearForm();
});


function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('date').value = '';
    document.getElementById('des').value = '';
    
    // Clear image
    const imgFeild = document.getElementById('img-feild');
    imgFeild.innerHTML = '';
    const img = document.createElement('img');
    img.src = './search-icon.png';
    img.alt = 'Search Icon';
    img.width = 24;
    img.height = 24;
    img.style.cursor = 'pointer';
    imgFeild.appendChild(img);
}


async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        displayTasks(data.tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}


let uploadedImage = null; // Store image globally

const fileInput = document.getElementById('fileInput');
const imgFeild = document.getElementById('img-feild');

// Create image element
if (imgFeild) {
    const img = document.createElement('img');
    img.id = 'preview-img';
    img.src = 'https://img.icons8.com/?size=100&id=cDnEsiNX3cmm&format=png&color=000000'; // Placeholder image
    img.width = 100;
    img.height = 100;
    img.style.cursor = 'pointer';
    img.style.borderRadius = '8px';
    img.style.objectFit = 'cover';
    imgFeild.appendChild(img);
    
    imgFeild.addEventListener('click', () => {
        fileInput.click();
    });
}

// Handle file upload and convert to Base64
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            uploadedImage = event.target.result; // Store Base64
            const img = imgFeild.querySelector('img');
            if (img) {
                img.src = uploadedImage;
                img.style.width = '200px';
                img.style.height = '200px';
            }
            console.log('Image uploaded (Base64)');
        };
        reader.readAsDataURL(file); // Convert to Base64
    }
});

// Submit task with image
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
        completed: false,
        image: uploadedImage // Include Base64 image
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
            console.log('Task created with image:', createdTask);
            uploadedImage = null; // Reset
            clearForm();
            document.getElementById('fild').style.display = 'none';
            fetchTasks(); 
        } else {
            alert('Error creating task');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error creating task');
    }
});


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
            fetchTasks(); 
        } else {
            alert('Error deleting task');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error deleting task');
    }
}


window.addEventListener('load', () => {
    fetchTasks();
});

const searchInput = document.getElementById('Search');
let todologo = document.getElementById('todologo');
const mediaQuery = window.matchMedia('(max-width: 568px)');

if (mediaQuery.matches) {
    searchInput.addEventListener('focus', () => {
        todologo.style.display = 'none';
    });
}

// Display tasks with images
function displayTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    if (!tasks || tasks.length === 0) {
        taskList.innerHTML = '<li style="text-align:center; padding:20px;">No tasks yet</li>';
        return;
    }

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        
        // Add image if exists
        const imageHTML = task.image ? `<a href="${task.image}" target="_blank"><img src="${task.image}" alt="Task image" style="width:80px; height:80px; border-radius:8px; margin-right:15px; object-fit:cover;"></a>` : '';
        
        li.innerHTML = `
            <div style="display:flex; align-items:flex-start;">
                ${imageHTML}
                <div style="flex:1;">
                    <div class="task-header">
                        <h3>${task.title}</h3>
                        <span class="task-date">${task.date}</span>
                    </div>
                    <p>${task.description}</p>
                    <div class="task-actions">
                        <button onclick="deleteTask(${task.id})" class="delete-btn">Delete</button>
                    </div>
                </div>
            </div>
        `;
        taskList.appendChild(li);
    });
}