document.addEventListener('DOMContentLoaded', (event) => {
    const barteButton = document.getElementsByClassName('barte');
    barteButton[0] && barteButton[0].addEventListener('click', () => window.location.href = '/');

    const productsButton = document.getElementById('products');
    productsButton && productsButton.addEventListener('click', () => window.location.href = '/products');

    const initButton = document.getElementById('init');
    initButton && initButton.addEventListener('click', () => window.location.href = '/');

    const createProfileButton = document.getElementById('createProfile');
    createProfileButton && createProfileButton.addEventListener('click', () => window.location.href = '/clients/profile/register');

    const loginButton = document.getElementById('login');
    loginButton && loginButton.addEventListener('click', () => window.location.href = '/clients/session/login');

    const logoutButton = document.getElementById('logout');
    logoutButton && logoutButton.addEventListener('click', () => window.location.href = '/clients/session/logout');
});