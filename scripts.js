document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser');
    const authButtons = document.getElementById('authButtons');
    const userActions = document.getElementById('userActions');
    const usernameDisplay = document.getElementById('usernameDisplay');
    
    if (currentUser) {
        if (authButtons) authButtons.style.display = 'none';
        if (userActions) userActions.style.display = 'block';
        if (usernameDisplay) usernameDisplay.textContent = currentUser;
        loadNotes(currentUser);
    } else {
        if (authButtons) authButtons.style.display = 'block';
        if (userActions) userActions.style.display = 'none';
    }
});

    function openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    function closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    function redirectToHomeAndRegister() {
        sessionStorage.setItem('action', 'register');
        window.location.href = 'index.html';
    }

    function redirectToHomeAndLogin() {
        sessionStorage.setItem('action', 'login');
        window.location.href = 'index.html';
    }

    document.addEventListener('DOMContentLoaded', function() {
        const action = sessionStorage.getItem('action');
        if (action === 'register') {
            openModal('registerModal');
        } else if (action === 'login') {
            openModal('loginModal');
        }
        sessionStorage.removeItem('action');
    });


function loadNotes(username) {
    const notesContainer = document.getElementById('notes-container');
    if (!notesContainer) return;

    notesContainer.innerHTML = '';
    const notes = JSON.parse(localStorage.getItem(`notes_${username}`)) || [];

    notes.forEach((note, index) => {
        const noteElement = createNoteElement(note, index);
        notesContainer.appendChild(noteElement);
    });
}
function scrollToInfo() {
    const infoSection = document.getElementById('infoSection');
    if (infoSection) {
        infoSection.scrollIntoView({ behavior: 'smooth' });
    }
}


function createNoteElement(note, index) {
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note');

    const title = document.createElement('div');
    title.classList.add('title');
    title.textContent = note.title;
    title.addEventListener('click', function() {
        noteDiv.classList.toggle('open');
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

function editNote(index) {
    const currentUser = localStorage.getItem('currentUser');
    const notes = JSON.parse(localStorage.getItem(`notes_${currentUser}`)) || [];
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
    const currentUser = localStorage.getItem('currentUser');
    const titleInput = document.getElementById('note-title');
    const contentInput = document.getElementById('note-content');

    const notes = JSON.parse(localStorage.getItem(`notes_${currentUser}`)) || [];

    notes[index] = {
        title: titleInput.value,
        content: `<p>${
    contentInput.value.replace(/\n/g, '</p><p>')}</p>`
    };

    localStorage.setItem(`notes_${currentUser}`, JSON.stringify(notes));

    loadNotes(currentUser);

    titleInput.value = '';
    contentInput.value = '';

    const addButton = document.querySelector('#note-form button');
    addButton.textContent = 'Добавить';
    addButton.onclick = addNote;
}

function deleteNote(index) {
    const currentUser = localStorage.getItem('currentUser');
    const notes = JSON.parse(localStorage.getItem(`notes_${currentUser}`)) || [];

    notes.splice(index, 1);
    localStorage.setItem(`notes_${currentUser}`, JSON.stringify(notes));

    loadNotes(currentUser);
}

function addNote() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert('Вы должны войти, чтобы добавить заметку.');
        return;
    }

    const titleInput = document.getElementById('note-title');
    const contentInput = document.getElementById('note-content');

    const notes = JSON.parse(localStorage.getItem(`notes_${currentUser}`)) || [];

    const newNote = {
        title: titleInput.value,
        content: `<p>${contentInput.value.replace(/\n/g, '</p><p>')}</p>`
    };

    notes.push(newNote);
    localStorage.setItem(`notes_${currentUser}`, JSON.stringify(notes));

    loadNotes(currentUser);

    titleInput.value = '';
    contentInput.value = '';
}

function register() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    // Проверка имени пользователя на английские буквы и минимальную длину
    if (!/^[a-zA-Z0-9]{6,}$/.test(username)) {
        alert('Имя пользователя должно состоять только из английских букв и цифр и быть не менее 6 символов.');
        return;
    }

    if (localStorage.getItem(username)) {
        alert('Пользователь уже существует.');
        return;
    }

    localStorage.setItem(username, JSON.stringify({ password }));
    alert('Регистрация успешна! Теперь вы можете войти.');
    closeModal('registerModal');
}

function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    // Проверка имени пользователя на английские буквы и минимальную длину
    if (!/^[a-zA-Z0-9]{6,}$/.test(username)) {
        alert('Имя пользователя должно состоять только из английских букв и цифр и быть не менее 6 символов.');
        return;
    }

    const user = JSON.parse(localStorage.getItem(username));

    if (user && user.password === password) {
        localStorage.setItem('currentUser', username);
        alert('Вход выполнен успешно!');
        const authButtons = document.getElementById('authButtons');
        const userActions = document.getElementById('userActions');
        const usernameDisplay = document.getElementById('usernameDisplay');

        if (authButtons) authButtons.style.display = 'none';
        if (userActions) userActions.style.display = 'block';
        if (usernameDisplay) usernameDisplay.textContent = username;

        loadNotes(username);
        closeModal('loginModal');
    } else {
        alert('Неправильное имя пользователя или пароль.');
    }
}


function logout() {
    localStorage.removeItem('currentUser');
    alert('Вы вышли из системы.');
    const authButtons = document.getElementById('authButtons');
    const userActions = document.getElementById('userActions');
    const notesContainer = document.getElementById('notes-container');
    const usernameDisplay = document.getElementById('usernameDisplay');

    if (authButtons) authButtons.style.display = 'block';
    if (userActions) userActions.style.display = 'none';
    if (notesContainer) notesContainer.innerHTML = '';
    if (usernameDisplay) usernameDisplay.textContent = '';
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'block';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}
