const taskList = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');
const themeSelector = document.getElementById('themeSelector');

// Função para adicionar tarefa
document.getElementById('addTaskBtn').addEventListener('click', () => {
    const taskTitle = taskInput.value.trim();

    if (taskTitle) {
        addTask(taskTitle);
        taskInput.value = ''; // Limpar o campo de entrada
    } else {
        alert('Por favor, digite o título da tarefa!');
    }
});

// Função para criar um item de tarefa
function createTaskItem(title) {
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item list-group-item fade-in';

    const taskText = document.createElement('span');
    taskText.textContent = title;
    taskItem.appendChild(taskText);

    const completeBtn = document.createElement('button');
    completeBtn.textContent = 'Concluir';
    completeBtn.className = 'btn btn-success btn-sm';
    completeBtn.onclick = () => {
        taskText.classList.toggle('completed');
    };
    taskItem.appendChild(completeBtn);

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-danger btn-sm';
    removeBtn.textContent = 'Remover';
    removeBtn.onclick = () => {
        taskList.removeChild(taskItem);
        taskItem.classList.add('fade-out');
        setTimeout(() => taskList.removeChild(taskItem), 500); // Remover após animação
        removeTaskFromStorage(title); // Remover do localStorage
    };
    taskItem.appendChild(removeBtn);

    return taskItem;
}

// Função para adicionar tarefa e salvá-la no localStorage
function addTask(taskTitle) {
    const taskItem = createTaskItem(taskTitle);
    taskList.appendChild(taskItem);
    saveTaskToStorage(taskTitle); // Salvar tarefa no localStorage
}

// Função para salvar tarefa no localStorage
function saveTaskToStorage(taskTitle) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(taskTitle);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para remover tarefa do localStorage
function removeTaskFromStorage(taskTitle) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task !== taskTitle);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para carregar tarefas do localStorage
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(taskTitle => {
        const taskItem = createTaskItem(taskTitle);
        taskList.appendChild(taskItem);
    });
}

document.getElementById('showAllBtn').addEventListener('click', () => {
    const tasks = taskList.children;
    for (let task of tasks) {
        task.style.display = 'flex';
    }
});

document.getElementById('showCompletedBtn').addEventListener('click', () => {
    const tasks = taskList.children;
    for (let task of tasks) {
        if (task.querySelector('span').classList.contains('completed')) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    }
});

document.getElementById('showPendingBtn').addEventListener('click', () => {
    const tasks = taskList.children;
    for (let task of tasks) {
        if (task.querySelector('span').classList.contains('completed')) {
            task.style.display = 'none';
        } else {
            task.style.display = 'flex';
        }
    }
});

document.getElementById('clearTasksBtn').addEventListener('click', () => {
    while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
    }
    localStorage.removeItem('tasks'); // Limpar localStorage
});

// Função para aplicar o tema
function applyTheme(theme) {
    document.body.className = theme; // Muda a classe do body com base no tema
}

// Carregar tarefas e tema ao iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();

    // Configurar o tema inicial
    themeSelector.value = localStorage.getItem('theme') || 'default'; // Define o tema padrão
    applyTheme(themeSelector.value);

    themeSelector.addEventListener('change', (e) => {
        const selectedTheme = e.target.value;
        localStorage.setItem('theme', selectedTheme); // Salvar tema no localStorage
        applyTheme(selectedTheme);
    });
});

// Adiciona evento para pressionar "Enter"
taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const taskTitle = taskInput.value.trim();
        if (taskTitle) {
            addTask(taskTitle);
            taskInput.value = ''; // Limpar o campo de entrada
        } else {
            alert('Por favor, digite o título da tarefa!');
        }
    }
});
