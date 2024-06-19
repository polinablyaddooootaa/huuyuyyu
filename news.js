document.addEventListener('DOMContentLoaded', function() {
    const modal = document.querySelector('.modal');
    const modalImg = document.querySelector('.modal img');
    const modalCaption = document.querySelector('.modal-caption');
    const photoItems = document.querySelectorAll('.photo-item');
    const currentUser = localStorage.getItem('currentUser');
    const authButtons = document.getElementById('authButtons');
    const userActions = document.getElementById('userActions');
    const usernameDisplay = document.getElementById('usernameDisplay');
    

    function loadNotes(username) {

        console.log(`Loading notes for ${username}`);
    }
    

    if (currentUser) {

        if (authButtons) authButtons.style.display = 'none';
        if (userActions) userActions.style.display = 'block';
        if (usernameDisplay) usernameDisplay.textContent = currentUser;

        loadNotes(currentUser);
    } else {

        if (authButtons) authButtons.style.display = 'block';
        if (userActions) userActions.style.display = 'none';
    }


    photoItems.forEach(item => {
        item.addEventListener('click', function() {
            modal.style.display = 'block';
            const imgSrc = item.querySelector('img').getAttribute('src');
            const imgAlt = item.querySelector('img').getAttribute('alt');
            modalImg.setAttribute('src', imgSrc);
            modalImg.setAttribute('alt', imgAlt);
            modalCaption.textContent = item.querySelector('p').textContent;
        });
    });


    const closeBtn = document.querySelector('.close-btn');
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });


    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});
