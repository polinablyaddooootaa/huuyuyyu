async function initSqlJs() {
    const SQL = await window.initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.1/sql-wasm.wasm` });
    return SQL;
}

async function loadDatabase() {
    const response = await fetch('schedule.db');
    const buffer = await response.arrayBuffer();
    return new Uint8Array(buffer);
}

async function loadSchedule() {
    const group = document.getElementById('groupSelect').value;
    if (!group) {
        document.getElementById('scheduleContainer').innerHTML = '<p>Пожалуйста, выберите группу.</p>';
        return;
    }

    const SQL = await initSqlJs();
    const databaseBytes = await loadDatabase();
    const db = new SQL.Database(databaseBytes);

    const query = `SELECT * FROM schedule WHERE group_name = ? ORDER BY day, time`;
    const stmt = db.prepare(query);
    stmt.bind([group]);

    let scheduleHtml = '<table><tr><th>День</th><th>Время</th><th>Предмет</th></tr>';
    while (stmt.step()) {
        const row = stmt.getAsObject();
        scheduleHtml += `<tr>
                            <td>${row.day}</td>
                            <td>${row.time}</td>
                            <td>${row.subject}</td>
                         </tr>`;
    }
    scheduleHtml += '</table>';

    document.getElementById('scheduleContainer').innerHTML = scheduleHtml;
}
