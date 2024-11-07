renderData();

function renderData() {
    request(
        (data) => {
            const { name, email } = data;
            document.getElementById('name').innerHTML = name;
            document.getElementById('email').innerHTML = email;
            document.getElementById('token').innerHTML = localStorage.getItem('authorization');
        },
        'GET',
        'users/getData'
    );
}

function updateData() {
    const name = document.getElementById('new-name').value;
    request(
        () => { renderData(); },
        'PUT',
        'users/updateData',
        { name }
    );
}

function generateNewToken() {
    request(
        () => { window.location.href = '/'; },
        'PUT',
        'users/generateNewToken'
    );
}

function updatePassword() {
    const password = document.getElementById('new-password').value;
    const confirmedPassword = document.getElementById('confirm-new-password').value;
    if (password != confirmedPassword) {
        alert('The passwords don\'t match');
        return;
    }
    request(
        () => { window.location.href = '/'; },
        'PUT',
        'users/updatePassword',
        { password }
    );
}

function deleteAccount() {
    request(
        () => { window.location.href = '/'; },
        'DELETE',
        'users/deleteUser'
    );
}