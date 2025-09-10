document.addEventListener('DOMContentLoaded', (event) => {
    const discoverButton = document.getElementById('discover');
    discoverButton && discoverButton.addEventListener('click', () => window.location.href = '/clients/profile/register');
});