const API_URL = 'https://stockmaster-xvke.onrender.com/api/';
const HTTP_STATUS = {
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not found',
    500: 'Server error'
};
renderNavbar();

function request(callback, method, route, body={}, isFormData=false) {
    const headers = {
        authorization: localStorage.getItem('authorization'),
        inventory: localStorage.getItem('inventory'),
        product: localStorage.getItem('product')
    };
    const options = {};
    if (method != 'GET') {
        if (isFormData) {
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
        } else {
            headers['Content-Type'] = 'application/json';
        }
        options.body = isFormData ? body : JSON.stringify(body);
    }
    options.method = method;
    options.headers = headers;
    fetch(`${API_URL}${route.replace(/^\//, '')}`, options)
    .then(response => {
        if (response.status in HTTP_STATUS) {
            alert(HTTP_STATUS[response.status]);
            throw new Error('');
        }
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            return Promise.all([response, response.json()]);
        }
        return Promise.all([response, undefined]);
    }).then(([response, data]) => {
        if (data && data.error) {
            alert(data.error);
        } else if (response.ok) {
            callback(data);
        } else {
            alert(`Status: ${response.status}, data: ${data}`);
        }
    }).catch(error => {
        if (error.message != '') {
            alert(error.message);
        }
    });
}

function renderNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) {
        return;
    }
    navbar.innerHTML = /*html*/`
        <div class="flex-horizontal navbar-container">
            <h2>Stock Master</h2>
            <a href="/inventories">Inventories</a>
            <a href="/profile">Profile</a>
        </div>
    `;
}