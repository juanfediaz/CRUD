// Estado inicial cargado desde localStorage
let tasks = JSON.parse(localStorage.getItem('agile_tasks')) || [];

// Referencias al DOM
const taskForm = document.getElementById('task-form');
const taskIdInput = document.getElementById('task-id');
const titleInput = document.getElementById('title');
const assigneeInput = document.getElementById('assignee');
const statusInput = document.getElementById('status');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-title');
const taskList = document.getElementById('task-list');
const searchInput = document.getElementById('search-input');

// Guardar en localStorage
function saveToStorage() {
    localStorage.setItem('agile_tasks', JSON.stringify(tasks));
}

// READ: Renderizar tareas en la tabla
function renderTasks(filter = '') {
    taskList.innerHTML = '';
    const filteredTasks = tasks.filter(t => 
        t.title.toLowerCase().includes(filter.toLowerCase()) || 
        t.assignee.toLowerCase().includes(filter.toLowerCase())
    );

    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<tr><td colspan="4" style="text-align:center;">No hay tareas registradas.</td></tr>';
        return;
    }

    filteredTasks.forEach(task => {
        const badgeClass = `badge-${task.status.toLowerCase().replace(' ', '-')}`;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.title}</td>
            <td>${task.assignee}</td>
            <td><span class="badge ${badgeClass}">${task.status}</span></td>
            <td>
                <button class="btn btn-edit" onclick="editTask('${task.id}')">Editar</button>
                <button class="btn btn-delete" onclick="deleteTask('${task.id}')">Eliminar</button>
            </td>
        `;
        taskList.appendChild(row);
    });
}

// CREATE & UPDATE: Manejar envío del formulario
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = taskIdInput.value;
    const title = titleInput.value.trim();
    const assignee = assigneeInput.value.trim();
    const status = statusInput.value;

    if (!title || !assignee) return alert('Por favor completa los campos obligatorios.');

    if (id) {
        // UPDATE: Actualizar registro existente
        const index = tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            tasks[index] = { id, title, assignee, status };
        }
        resetForm();
    } else {
        // CREATE: Crear nuevo registro
        const newTask = {
            id: Date.now().toString(),
            title,
            assignee,
            status
        };
        tasks.push(newTask);
        taskForm.reset();
    }

    saveToStorage();
    renderTasks(searchInput.value);
});

// Preparar formulario para edición
window.editTask = function(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    taskIdInput.value = task.id;
    titleInput.value = task.title;
    assigneeInput.value = task.assignee;
    statusInput.value = task.status;

    formTitle.textContent = 'Editar Tarea';
    submitBtn.textContent = 'Actualizar Tarea';
    cancelBtn.classList.remove('hidden');
};

// Cancelar edición
cancelBtn.addEventListener('click', resetForm);

function resetForm() {
    taskForm.reset();
    taskIdInput.value = '';
    formTitle.textContent = 'Nueva Tarea';
    submitBtn.textContent = 'Guardar Tarea';
    cancelBtn.classList.add('hidden');
}

// DELETE: Eliminar registro
window.deleteTask = function(id) {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveToStorage();
        renderTasks(searchInput.value);
    }
};

// Filtro de búsqueda en tiempo real
searchInput.addEventListener('input', (e) => {
    renderTasks(e.target.value);
});

// Inicializar aplicación
renderTasks();