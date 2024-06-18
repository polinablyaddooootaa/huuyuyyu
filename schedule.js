// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const groupSelector = document.getElementById('groupSelector');
    const scheduleContainer = document.getElementById('scheduleContainer');

    // Event listener for when the group selection changes
    groupSelector.addEventListener('change', function() {
        const selectedGroup = groupSelector.value;

        // Fetch the schedule data from schedule.txt
        fetch('schedule.txt')
            .then(response => response.text())
            .then(data => {
                // Split the data by groups based on double new lines
                const groupsData = data.split('\n\n');

                // Find the schedule data for the selected group
                let selectedGroupData = '';
                for (let groupData of groupsData) {
                    if (groupData.startsWith(selectedGroup)) {
                        selectedGroupData = groupData.trim();
                        break;
                    }
                }

                // If data found for the selected group, generate the schedule HTML
                if (selectedGroupData) {
                    const scheduleLines = selectedGroupData.split('\n');
                    let scheduleHTML = '<table>';
                    scheduleLines.forEach(line => {
                        scheduleHTML += '<tr>';
                        const [day, subjects] = line.split(': ');
                        scheduleHTML += `<th>${day}</th>`;
                        scheduleHTML += `<td>${subjects}</td>`;
                        scheduleHTML += '</tr>';
                    });
                    scheduleHTML += '</table>';

                    // Update the schedule container with the generated HTML
                    scheduleContainer.innerHTML = scheduleHTML;
                } else {
                    scheduleContainer.innerHTML = '<p>Расписание не найдено для выбранной группы.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching schedule data:', error);
                scheduleContainer.innerHTML = '<p>Ошибка загрузки данных расписания.</p>';
            });
    });
});
