const storedTheme = localStorage.getItem('bs-theme')
const getPreferredTheme = () => {
    if (storedTheme) {
        return storedTheme
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const setTheme = theme => {
    if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-bs-theme', 'dark')
    } else {
        document.documentElement.setAttribute('data-bs-theme', theme)
    }
}

const setDarkMode = () => {
    localStorage.setItem('bs-theme', 'dark');
    setTheme('dark');
    window.location.reload();
}

const setLightMode = () => {
    localStorage.setItem('bs-theme', 'light');
    setTheme('light');
    window.location.reload();
}

const swithTheme = () => {
    const theme = localStorage.getItem('bs-theme');
    if (theme == 'dark') return setLightMode();
    return setDarkMode();
}

setTheme(getPreferredTheme())