const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Função para carregar as tarefas do arquivo JSON
const loadTasks = () => {
    if (fs.existsSync('src/data.json')) {
        const data = fs.readFileSync('src/data.json', 'utf8');
        return JSON.parse(data);
    }
    return []; // Retornar um array vazio se o arquivo não existir
};

// Função para salvar as tarefas no arquivo JSON
const saveTasks = (tasks) => {
    fs.writeFileSync('src/data.json', JSON.stringify(tasks, null, 2));
};

let tasks = loadTasks(); // Carregar tarefas ao iniciar

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: true
        }
    });

    win.loadFile('src/index.html');
}

// Manipular adição de tarefa
ipcMain.handle('add-task', (event, title) => {
    const newTask = { id: tasks.length + 1, title, completed: false };
    tasks.push(newTask);
    saveTasks(tasks);
});

// Manipular solicitação de tarefas
ipcMain.handle('get-tasks', () => {
    return tasks; // Retornar as tarefas para o renderer process
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

