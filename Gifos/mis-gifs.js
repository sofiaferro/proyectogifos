
//variables del tema
const dayTheme = document.getElementById('day-theme');
const nightTheme = document.getElementById('night-theme');
const themeChange = document.getElementById('themeChange');
const theme = localStorage.getItem('theme');
const favicon = localStorage.getItem('favicon');
const faviconImg = document.querySelector('.favicon');
const logo = localStorage.getItem('logo');
const logoImg = document.querySelector('.logo');




const initTheme = () => {
    window.localStorage.getItem('theme');
    window.localStorage.getItem('favicon');

    if (theme) {
        themeChange.href = theme;
    } else {
        themeChange.href = 'style-day.css';
    }
    if (logo) {
        logoImg.src = logo;
    } else {
        logoImg.src = '/img/gifOF_logo.png';
    }
    if (favicon) {
        faviconImg.href = favicon;
    } else {
        faviconImg.href = '/img/gifOF_logo.png';
    }

};