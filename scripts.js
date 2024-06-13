document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    loadNotes();
});

function checkLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        document.getElementById('authButtons').style.display = 'none';
        document.getElementById('userActions').style.display = 'flex';
        document.getElementById('usernameDisplay').textContent = currentUser;
    } else {
        document.getElementById('authButtons').style.display = 'flex';
        document.getElementById('userActions').style.display = 'none';
    }
}

function register() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.find(user => user.username === username)) {
        alert('Пользователь с таким именем уже существует.');
        return;
    }

    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    closeModal('registerModal');
    alert('Регистрация прошла успешно.');
}

function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        localStorage.setItem('currentUser', username);
        closeModal('loginModal');
        checkLoginStatus();
    } else {
        alert('Неверное имя пользователя или пароль.');
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    checkLoginStatus();
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Functions for loading, adding, editing, and deleting notes remain the same
function loadNotes() {
    const notesContainer = document.getElementById('notes-container');
    if (notesContainer) {
        notesContainer.innerHTML = '';

        const notes = getNotesFromLocalStorage();
        notes.forEach((note, index) => {
            const noteElement = createNoteElement(note, index);
            notesContainer.appendChild(noteElement);
        });
    }
}

function createNoteElement(note, index) {
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note');

    const title = document.createElement('h2');
    title.classList.add('title');
    title.textContent = note.title;
    title.addEventListener('click', function() {
        const content = this.nextElementSibling;
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
    });

    const content = document.createElement('div');
    content.classList.add('content');
    content.innerHTML = note.content;

    const actions = document.createElement('div');
    actions.classList.add('actions');
    actions.innerHTML = `
        <button class="edit" onclick="editNote(${index})">Редактировать</button>
        <button class="delete" onclick="deleteNote(${index})">Удалить</button>
    `;

    noteDiv.appendChild(title);
    noteDiv.appendChild(content);
    noteDiv.appendChild(actions);

    return noteDiv;
}

function addNote() {
    const titleInput = document.getElementById('note-title');
    const contentInput = document.getElementById('note-content');

    const newNote = {
        title: titleInput.value,
        content: `<p>${contentInput.value.replace(/\n/g, '</p><p>')}</p>`
    };

    const notes = getNotesFromLocalStorage();
    notes.push(newNote);
    saveNotesToLocalStorage(notes);

    titleInput.value = '';
    contentInput.value = '';

    loadNotes();
}

function editNote(index) {
    const notes = getNotesFromLocalStorage();
    const note = notes[index];

    const titleInput = document.getElementById('note-title');
    const contentInput = document.getElementById('note-content');

    titleInput.value = note.title;
    contentInput.value = note.content.replace(/<\/?p>/g, '\n').trim();

    const addButton = document.querySelector('#note-form button');
    addButton.textContent = 'Сохранить';
    addButton.onclick = function() {
        saveEditedNote(index);
    };
}

function saveEditedNote(index) {
    const notes = getNotesFromLocalStorage();

    const titleInput = document.getElementById('note-title');
    const contentInput = document.getElementById('note-content');

    notes[index].title = titleInput.value;
    notes[index].content = `<p>${contentInput.value.replace(/\n/g, '</p><p>')}</p>`;

    saveNotesToLocalStorage(notes);

    titleInput.value = '';
    contentInput.value = '';

    const addButton = document.querySelector('#note-form button');
    addButton.textContent = 'Добавить';
    addButton.onclick = addNote;

    loadNotes();
}

function deleteNote(index) {
    const notes = getNotesFromLocalStorage();
    notes.splice(index, 1);
    saveNotesToLocalStorage(notes);
    loadNotes();
}

function getNotesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('notes')) || [];
}

function saveNotesToLocalStorage(notes) {
    localStorage.setItem('notes', JSON.stringify(notes));
}
