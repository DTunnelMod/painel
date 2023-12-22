const openNav = document.getElementById('openNav');
const closeNav = document.getElementById('closeNav');
const sidebar = document.querySelector('.sidebar');

openNav.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

closeNav.addEventListener('click', () => {
    sidebar.classList.remove('active');
});