document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('groupSelect').addEventListener('change', loadSchedule);
});

async function loadSchedule() {
    const group = document.getElementById('groupSelect').value;
    const scheduleContainer = document.getElementById('scheduleContainer');

    if (!group) {
        scheduleContainer.innerHTML = '<p>Пожалуйста, выберите группу.</p>';
        return;
    }

    const sqlPromise = initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.1/sql-wasm.wasm`
    });

    const dataPromise = fetch('schedule.db').then(res => res.arrayBuffer());

    const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);

    const db = new SQL.Database(new Uint8Array(buf));
    const stmt = db.prepare(`SELECT day, time, subject FROM schedule WHERE group_name = ?`);
    stmt.bind([group]);

    let scheduleHTML = '<table><tr><th>День</th><th>Время</th><th>Предмет</th></tr>';
    while (stmt.step()) {
        const row = stmt.get();
        scheduleHTML += `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td></tr>`;
    }
    scheduleHTML += '</table>';

    scheduleContainer.innerHTML = scheduleHTML;
}
