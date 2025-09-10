document.addEventListener('DOMContentLoaded', (event) => {
    const closeButton = document.getElementsByClassName('material-symbols-outlined');
    closeButton[0] && closeButton[0].addEventListener('click', () => window.location.href = '/');
});