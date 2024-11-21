if (!localStorage.getItem('authorization')) {
    const authorization = window.location.href.split('/').pop().split('=').pop();
    localStorage.setItem('authorization', `Bearer ${authorization}`);
    window.location.href = '/inventories';
}
getInventories();

function getInventories() {
    request(
        (data) => { renderInventories(data); },
        'GET',
        'users/getInventories'
    );
}

function renderInventories(inventories) {
    document.getElementById('inventories')
    .innerHTML = inventories.map(item => /*html*/`
        <div class="flex-vertical inventory-card">
            <img class="inventory-image"
                src="/../images/checklist.png"
                alt="inventory">
            <p><b>Name:</b> ${item.name}</p>
            <p><b>Role:</b> ${item.role}</p>
            <button class="inventory-button" onclick="goToInventory('${item.inventory}')">Go to inventory</button>
            <button class="inventory-button" onclick="goToProducts('${item.inventory}')">Go to products</button>
        </div>
    `).join('');
}

function goToInventory(inventoryId) {
    localStorage.setItem('inventory', inventoryId);
    window.location.href = '/inventory';
}

function goToProducts(inventoryId) {
    localStorage.setItem('inventory', inventoryId);
    request(
        (inventory) => {
            localStorage.setItem('fields', JSON.stringify(inventory.fields));
            window.location.href = '/products';
        },
        'GET',
        'inventories/getInventory'
    );
}

function createInventory() {
    const name = document.getElementById('name').value;
    if (!name) {
        alert('The new inventory\'s name is needed');
        return;
    }
    request(
        async () => { getInventories(); },
        'POST',
        'inventories/createInventory',
        { name }
    );
}