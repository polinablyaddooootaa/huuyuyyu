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

    const groupSelector = document.getElementById('groupSelector');
    const weekTypeSelector = document.getElementById('weekTypeSelector');
    const editScheduleBtn = document.getElementById('editScheduleBtn');
    const saveScheduleBtn = document.getElementById('saveScheduleBtn');

    groupSelector.addEventListener('change', toggleEditButtonVisibility);
    weekTypeSelector.addEventListener('change', toggleEditButtonVisibility);

    function toggleEditButtonVisibility() {
        if (groupSelector.value && weekTypeSelector.value) {
            editScheduleBtn.style.display = 'inline-block';
        } else {
            editScheduleBtn.style.display = 'none';
        }
    }

    saveScheduleBtn.style.display = 'none';
});

const schedules = {
    "Т-191": {
        "Верхняя неделя": {
            "Понедельник": ["ТПО", "ТРПО", "ЗКИ"],
            "Вторник": ["ПССИП", "БД И СУБД", "КПИЯП"],
            "Среда": ["ОКП", "ТПО", "АУДО"],
            "Четверг": ["ЗКИ", "ПССИП", "УП ПО ВЕБ"],
            "Пятница": ["КПИЯП", "ОКП", "ТПО"],
            "Суббота": ["УП ПО ПРОГРАММИРОВАНИЮ", "БД И СУБД", "ЗКИ"]
        },
        "Нижняя неделя": {
            "Понедельник": ["ПССИП", "ТРПО", "УП ПО ВЕБ"],
            "Вторник": ["ТПО", "ЗКИ", "КПИЯП"],
            "Среда": ["ОКП", "БД И СУБД", "АУДО"],
            "Четверг": ["ТРПО", "КПИЯП", "ПССИП"],
            "Пятница": ["ЗКИ", "УП ПО ПРОГРАММИРОВАНИЮ", "ТПО"],
            "Суббота": ["ТРПО", "АУДО", "БД И СУБД"]
        }
    },
    "Т-211": {
        "Верхняя неделя": {
            "Понедельник": ["БД И СУБД", "ПССИП", "ТРПО"],
            "Вторник": ["ТПО", "ЗКИ", "ОКП"],
            "Среда": ["КПИЯП", "УП ПО ВЕБ", "ПССИП"],
            "Четверг": ["АУДО", "БД И СУБД", "ТРПО"],
            "Пятница": ["ОКП", "ТПО", "КПИЯП"],
            "Суббота": ["УП ПО ПРОГРАММИРОВАНИЮ", "ПССИП", "АУДО"]
        },
        "Нижняя неделя": {
            "Понедельник": ["ТРПО", "БД И СУБД", "ТПО"],
            "Вторник": ["ПССИП", "ОКП", "КПИЯП"],
            "Среда": ["УП ПО ВЕБ", "АУДО", "ТПО"],
            "Четверг": ["ЗКИ", "ПССИП", "ТРПО"],
            "Пятница": ["БД И СУБД", "ОКП", "КПИЯП"],
            "Суббота": ["ТРПО", "УП ПО ПРОГРАММИРОВАНИЮ", "ЗКИ"]
        }
    },
    "Т-312": {
        "Верхняя неделя": {
            "Понедельник": ["ТПО", "ОКП", "УП ПО ВЕБ"],
            "Вторник": ["БД И СУБД", "ТРПО", "ЗКИ"],
            "Среда": ["ПССИП", "АУДО", "КПИЯП"],
            "Четверг": ["ТПО", "ЗКИ", "ОКП"],
            "Пятница": ["КПИЯП", "БД И СУБД", "ПССИП"],
            "Суббота": ["УП ПО ПРОГРАММИРОВАНИЮ", "ТРПО", "АУДО"]
        },
        "Нижняя неделя": {
            "Понедельник": ["ОКП", "ЗКИ", "ТПО"],
            "Вторник": ["ТРПО", "БД И СУБД", "ПССИП"],
            "Среда": ["АУДО", "УП ПО ВЕБ", "КПИЯП"],
            "Четверг": ["ПССИП", "ТРПО", "ЗКИ"],
            "Пятница": ["УП ПО ПРОГРАММИРОВАНИЮ", "ОКП", "ТПО"],
            "Суббота": ["БД И СУБД", "ПССИП", "КПИЯП"]
        }
    },
    "Т-311": {
        "Верхняя неделя": {
            "Понедельник": ["ТРПО", "БД И СУБД", "ТПО"],
            "Вторник": ["ПССИП", "ОКП", "КПИЯП"],
            "Среда": ["УП ПО ВЕБ", "АУДО", "ТПО"],
            "Четверг": ["ЗКИ", "ПССИП", "ТРПО"],
            "Пятница": ["БД И СУБД", "ОКП", "КПИЯП"],
            "Суббота": ["ТРПО", "УП ПО ПРОГРАММИРОВАНИЮ", "ЗКИ"]
        },
        "Нижняя неделя": {
            "Понедельник": ["ТПО", "ОКП", "УП ПО ВЕБ"],
            "Вторник": ["БД И СУБД", "ТРПО", "ЗКИ"],
            "Среда": ["ПССИП", "АУДО", "КПИЯП"],
            "Четверг": ["ТПО", "ЗКИ", "ОКП"],
            "Пятница": ["КПИЯП", "БД И СУБД", "ПССИП"],
            "Суббота": ["УП ПО ПРОГРАММИРОВАНИЮ", "ТРПО", "АУДО"]
        }
    }
};

document.getElementById('groupSelector').addEventListener('change', updateSchedule);
document.getElementById('weekTypeSelector').addEventListener('change', updateSchedule);

function updateSchedule() {
    const group = document.getElementById('groupSelector').value;
    const weekType = document.getElementById('weekTypeSelector').value;
    const scheduleContainer = document.getElementById('scheduleContainer');
    scheduleContainer.innerHTML = '';

    if (group && weekType) {
        const schedule = schedules[group][weekType];
        for (const day in schedule) {
            const daySchedule = schedule[day];
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day-schedule';

            const dayTitle = document.createElement('h3');
            dayTitle.innerText = day;
            dayDiv.appendChild(dayTitle);

            const subjectsList = document.createElement('ul');
            daySchedule.forEach(subject => {
                const listItem = document.createElement('li');
                listItem.innerText = subject;
                subjectsList.appendChild(listItem);
            });

            dayDiv.appendChild(subjectsList);
            scheduleContainer.appendChild(dayDiv);
        }

        // Toggle visibility of editScheduleBtn based on selection
        const editScheduleBtn = document.getElementById('editScheduleBtn');
        if (editScheduleBtn) {
            editScheduleBtn.style.display = 'inline-block';
        }
    } else {
        // Hide editScheduleBtn if group or weekType is not selected
        const editScheduleBtn = document.getElementById('editScheduleBtn');
        if (editScheduleBtn) {
            editScheduleBtn.style.display = 'none';
        }
    }
}

function editSchedule() {
    const group = document.getElementById('groupSelector').value;
    const weekType = document.getElementById('weekTypeSelector').value;

    if (group && weekType) {
        const schedule = schedules[group][weekType];
        const scheduleContainer = document.getElementById('scheduleContainer');
        scheduleContainer.innerHTML = '';

        for (const day in schedule) {
            const daySchedule = schedule[day];
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day-schedule';

            const dayTitle = document.createElement('h3');
            dayTitle.innerText = day;
            dayDiv.appendChild(dayTitle);

            const subjectsList = document.createElement('ul');
            daySchedule.forEach((subject, index) => {
                const listItem = document.createElement('li');
                const input = document.createElement('input');
                input.type = 'text';
                input.value = subject;
                input.dataset.day = day;
                input.dataset.index = index;
                listItem.appendChild(input);
                subjectsList.appendChild(listItem);
            });

            dayDiv.appendChild(subjectsList);
            scheduleContainer.appendChild(dayDiv);
        }

        const editScheduleBtn = document.getElementById('editScheduleBtn');
        if (editScheduleBtn) {
            editScheduleBtn.style.display = 'none';
        }

        const saveScheduleBtn = document.getElementById('saveScheduleBtn');
        if (saveScheduleBtn) {
            saveScheduleBtn.style.display = 'inline-block';
        }
    }
}

function saveSchedule() {
    const inputs = document.querySelectorAll('#scheduleContainer input');

    inputs.forEach(input => {
        const day = input.dataset.day;
        const index = input.dataset.index;
        const group = document.getElementById('groupSelector').value;
        const weekType = document.getElementById('weekTypeSelector').value;
        schedules[group][weekType][day][index] = input.value;
    });

    const editScheduleBtn = document.getElementById('editScheduleBtn');
    if (editScheduleBtn) {
        editScheduleBtn.style.display = 'inline-block';
    }

    const saveScheduleBtn = document.getElementById('saveScheduleBtn');
    if (saveScheduleBtn) {
        saveScheduleBtn.style.display = 'none';
    }

    updateSchedule();
}

updateSchedule();
