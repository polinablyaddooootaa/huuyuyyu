document.addEventListener('DOMContentLoaded', () => {
    loadSchedule();
});

function loadSchedule() {
    const group = document.getElementById('groupSelect').value;
    const scheduleContainer = document.getElementById('scheduleContainer');

    if (!group) {
        scheduleContainer.innerHTML = '<p>Пожалуйста, выберите группу.</p>';
        return;
    }

    fetch('schedule.txt')
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            let scheduleHTML = '<table><tr><th>День</th><th>Время</th><th>Предмет</th></tr>';

            lines.forEach(line => {
                const [grp, day, time, subject] = line.split(';');
                if (grp === group) {
                    scheduleHTML += `<tr><td>${day}</td><td>${time}</td><td>${subject}</td></tr>`;
                }
            });

            scheduleHTML += '</table>';
            scheduleContainer.innerHTML = scheduleHTML;
        })
        .catch(error => {
            console.error('Ошибка при загрузке расписания:', error);
            scheduleContainer.innerHTML = '<p>Не удалось загрузить расписание. Попробуйте позже.</p>';
        });
}
