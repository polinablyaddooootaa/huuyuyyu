document.addEventListener('DOMContentLoaded', function() {
    const groupSelector = document.getElementById('groupSelector');
    const scheduleContainer = document.getElementById('scheduleContainer');

    // Слушатель события для изменения выбора группы
    groupSelector.addEventListener('change', function() {
        const selectedGroup = groupSelector.value;

        // Проверка, выбрана ли группа
        if (selectedGroup) {
            // Загрузка данных расписания из schedule.txt
            fetch('schedule.txt')
                .then(response => response.text())
                .then(data => {
                    // Разделение данных по группам на основе двойного переноса строки
                    const groupsData = data.split('\n\n');

                    // Поиск данных расписания для выбранной группы
                    let selectedGroupData = '';
                    for (let groupData of groupsData) {
                        const lines = groupData.trim().split('\n');
                        if (lines[0].trim() === selectedGroup) {
                            selectedGroupData = groupData.trim();
                            break;
                        }
                    }

                    // Если данные найдены для выбранной группы, генерация HTML для расписания
                    if (selectedGroupData) {
                        const scheduleLines = selectedGroupData.split('\n');
                        let scheduleHTML = '<table>';
                        scheduleLines.forEach((line, index) => {
                            if (index === 0) return; // Пропуск строки с названием группы
                            const [day, subjects] = line.split(': ');
                            scheduleHTML += '<tr>';
                            scheduleHTML += `<th>${day}</th>`;
                            scheduleHTML += `<td>${subjects}</td>`;
                            scheduleHTML += '</tr>';
                        });
                        scheduleHTML += '</table>';

                        // Обновление контейнера расписания с сгенерированным HTML
                        scheduleContainer.innerHTML = scheduleHTML;
                    } else {
                        scheduleContainer.innerHTML = '<p>Расписание не найдено для выбранной группы.</p>';
                    }
                })
                .catch(error => {
                    console.error('Ошибка загрузки данных расписания:', error);
                    scheduleContainer.innerHTML = '<p>Ошибка загрузки данных расписания.</p>';
                });
        } else {
            // Если группа не выбрана, очистка контейнера расписания
            scheduleContainer.innerHTML = '';
        }
    });
});
