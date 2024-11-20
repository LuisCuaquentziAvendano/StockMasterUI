const API_URL = 'https://stockmaster-xvke.onrender.com/api/'; 
const socket = io.connect('https://stockmaster-xvke.onrender.com/');
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
            options.body = body;
        } else {
            headers['Content-Type'] = 'application/json';
            options.body = isFormData ? body : JSON.stringify(body);
        }
    }
    options.method = method;
    options.headers = headers;
    if (!callback) {
        return fetch(`${API_URL}${route.replace(/^\//, '')}`, options);
    }
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
        return Promise.all([response, response]);
    }).then(([response, data]) => {
        if (data && data.error) {
            alert(data.error);
        } else if (response.ok) {
            return callback(data);
        } else {
            alert(`Status: ${response.status}, data: ${data}`);
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

socket.on('connect', () => {
    console.log('Connected to server:', socket.id);

    const token = localStorage.getItem('authorization').replace('Bearer ', '');

    if (token) {
        socket.emit('joinRoom', token); 
    }

    socket.on('roomJoined', (data) => {
        console.log(`Successfully joined room: ${data.room}`);
    });

    socket.on('largeSaleNotification', (data) => {
        console.log("Message received: ", data.message);
    
        const notificationContainer = document.getElementById('notification-container');
    
        const notification = document.createElement('div');
        notification.className = 'notification';

        const message = document.createElement('span');
        message.innerText = data.message;
    
        const closeButton = document.createElement('button');
        closeButton.innerText = '×'; 
        closeButton.onclick = () => {
            notificationContainer.removeChild(notification);
        };
    
        notification.appendChild(message);
        notification.appendChild(closeButton);
        notificationContainer.appendChild(notification);
    });
});


