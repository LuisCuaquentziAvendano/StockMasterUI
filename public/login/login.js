let isLogin = true;
localStorage.clear();
setVisibleElements();

function toRegister(event) {
    event.preventDefault();
    isLogin = false;
    setVisibleElements();
};

function toLogin(event) {
    event.preventDefault();
    isLogin = true;
    setVisibleElements();
};

function sendForm(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    if (!isLogin && password != confirmPassword) {
        alert('The passwords don\'t match');
        return;
    }
    if (isLogin) {
        request(
            (data) => {
                const { authorization } = data;
                localStorage.setItem('authorization', `Bearer ${authorization}`);
                window.location.href = '/inventories';
            },
            'POST',
            'users/login',
            { email, password }
        );
    } else {
        request(
            () => {
                isLogin = true;
                document.getElementById('login').click();
            },
            'POST',
            'users/register',
            { name, email, password }
        );
    }
};

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