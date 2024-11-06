let editing = false;
getInventory();
getPermissions();

function getInventory() {
    request(
        (data) => { renderInventory(data); },
        'GET',
        'inventories/getInventory'
    );
}

function renderInventory(inventory) {
    const editButtonId = 'edit-button';
    const cancelButtonId = 'cancel-button';
    document.getElementById('inventory-data')
    .innerHTML = /*html*/`
        <div class="flex-horizontal">
            <b>Name:</b>
            <input id="inventory-name" class="${editButtonId}" type="text" value="${inventory.name}" disabled>
            <button id="${editButtonId}" onclick="editInventory('${editButtonId}', '${cancelButtonId}')">Edit</button>
            <button id="${cancelButtonId}" onclick="cancelEdition()" class="hide cancel-action">Cancel</button>
        </div>
        <div class="flex-horizontal">
            <b>Role:</b>
            <p>${inventory.role}</p>
        </div>
    `;
    document.getElementById('inventory-fields')
    .innerHTML = /*html*/`
        <table>
            <thead>
                <tr>
                    <th>Field</th>
                    <th>Type</th>
                    <th>Visible</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${Object.keys(inventory.fields).map(field =>
                    renderField(inventory.fields, field)
                ).join('')}
            </tbody>
        </table>
    `;
}

function renderField(fields, field) {
    const isVisible = fields[field].visible;
    const editButtonId = `edit-button-${field}`;
    const cancelButtonId = `cancel-button-${field}`;
    return /*html*/`
        <tr>
            <td>
                <input class="field-data ${editButtonId}" type="text" value="${field}" disabled>
            </td>
            <td>
                <p class="field-data" >${fields[field].type}</p>
            </td>
            <td>
                <select class="field-data ${editButtonId}" disabled>
                    <option value="true" ${isVisible ? 'selected' : ''}>true</option>
                    <option value="false" ${isVisible ? '' : 'selected'}>false</option>
                </select>
            </td>
            <td>
                <button id="${editButtonId}" onclick="editInventory('${editButtonId}', '${cancelButtonId}')">Edit</button>
                <button id="${cancelButtonId}" onclick="cancelEdition()" class="hide cancel-action">Cancel</button>
            </td>
        </tr>
    `;
}

function editInventory(editButtonId, cancelButtonId) {
    const editButton = document.getElementById(editButtonId);
    const cancelButton = document.getElementById(cancelButtonId);
    if (editing) {
        updateInventory(editButtonId);
    } else {
        editButton.innerHTML = 'Save';
        editButton.classList.add('save-action');
        cancelButton.classList.remove('hide');
        cancelButton.classList.add('show');
        document.querySelectorAll(`.${editButtonId}, .${editButtonId}`)
        .forEach(element => {
            element.disabled = false;
            element.classList.add('edit-input');
        });
    }
    editing = !editing;
}

function cancelEdition() {
    getInventory();
    editing = false;
}

function updateInventory(editButtonId) {
    const words = editButtonId.split('-');
    if (words.length == 2) {
        const name = document.querySelector(`.${editButtonId}`).value;
        request(
            () => { getInventory(); },
            'PUT',
            'inventories/updateData',
            { name }
        );
    } else {
        const field = words[2];
        const newName = document.querySelector(`input.${editButtonId}`).value;
        const visible = document.querySelector(`select.${editButtonId}`).value == 'true';
        request(
            () => { getInventory(); },
            'PUT',
            'inventories/updateField',
            { field, newName, visible }
        );
    }
}

function createField() {
    const field = document.getElementById('create-field-field').value;
    const type = document.getElementById('create-field-type').value;
    const visible = document.getElementById('create-field-visible').value == 'true';
    request(
        () => { getInventory(); },
        'PUT',
        'inventories/createField',
        [{ field, type, visible }]
    );
}

function deleteField() {
    const field = document.getElementById('delete-field-field').value;
    request(
        () => { getInventory(); },
        'PUT',
        'inventories/deleteField',
        { field }
    );
}

function deleteInventory() {
    request(
        () => { window.location.href = '/inventories'; },
        'DELETE',
        'inventories/deleteInventory'
    );
}

function getPermissions() {
    request(
        (data) => { renderPermissions(data); },
        'GET',
        'inventories/getPermissions'
    );
}

function renderPermissions(permissions) {
    document.getElementById('permissions')
    .innerHTML = /*html*/`
        <table>
            <thead>
                <tr>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Role</th>
                </tr>
            </thead>
            <tbody>
                ${permissions.map(permission => /*html*/`
                    <tr>
                        <td>${permission.email}</td>
                        <td>${permission.name}</td>
                        <td>${permission.role}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function modifyPermission() {
    const email = document.getElementById('permission-email').value;
    const role = document.getElementById('permission-role').value;
    request(
        () => { getPermissions(); },
        'PUT',
        'inventories/modifyPermission',
        { email, role }
    );
}