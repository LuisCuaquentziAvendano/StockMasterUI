const API_URL = 'https://stockmaster-xvke.onrender.com/api/';

function request(callback, method, route, headers={}, body={}, isFormData=false) {
    if (method != 'GET') {
        if (isFormData) {
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
        } else {
            headers['Content-Type'] = 'application/json';
        }
    }
    let status;
    fetch(`${API_URL}${route.replace(/^\//, '')}`, {
        method,
        headers,
        body: (isFormData ? body : JSON.stringify(body))
    }).then((response) => {
        status = response.status;
        return Promise.all([response, response.json()]);
    }).then(([response, data]) => {
        if (response.ok) {
            callback(data);
        } else {
            alert(data.error);
        }
    }).catch((error) => {
        if (!status) {
            return;
        }
        if (status == 401) {
            alert('Unauthorized');
        } else if (status == 403) {
            alert('Forbidden');
        } else if (status == 404) {
            alert('Not found');
        } else if (status == 500) {
            alert('Server error');
        } else {
            alert(error);
        }
    });
}