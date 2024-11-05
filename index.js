let isLogin = true;
setVisibleElements();

document.getElementById('toRegister')
.addEventListener('click', (event) => {
    event.preventDefault();
    isLogin = false;
    setVisibleElements();
});

document.getElementById('toLogin')
.addEventListener('click', (event) => {
    event.preventDefault();
    isLogin = true;
    setVisibleElements();
});

document.getElementById('form')
.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (isLogin) {
        request(() => {alert('logged')}, 'POST', 'users/login', {}, { email, password });
    } else {
        request(() => {alert('registered')}, 'POST', 'users/register', {}, { name, email, password });
    }
});

function setVisibleElements() {
    const toHide = isLogin ? 'register' : 'login';
    const toShow = isLogin ? 'login' : 'register';
    document.querySelectorAll(`.${toHide}`)
        .forEach(element => {
            element.classList.add('hide');
            element.classList.remove('show');
        });
    document.querySelectorAll(`.${toShow}`)
        .forEach(element => {
            element.classList.add('show');
            element.classList.remove('hide');
        });
}