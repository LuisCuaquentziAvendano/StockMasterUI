function generateExampleDataset() {
    request(
        (data) => {
            localStorage.setItem('inventory', data.inventory);
            createInventoryFields();
        },
        'POST',
        'inventories/createInventory',
        { name: 'Amazon Inventory' }
    );
}

function createInventoryFields() {
    request(
        () => {
            createProducts();
            setPermission();
        },
        'PUT',
        'inventories/createField',
        [
            { field: "name", type: "STRING", visible: true },
            { field: "description", type: "STRING", visible: true },
            { field: "price", type: "FLOAT", visible: true },
            { field: "category", type: "STRING", visible: true },
            { field: "tags", type: "ARRAY", visible: true },
            { field: "is_discounted", type: "BOOLEAN", visible: true },
            { field: "average_rating", type: "FLOAT", visible: true },
            { field: "shipping_weight", type: "FLOAT", visible: true },
            { field: "product_image", type: "IMAGE", visible: true },
            { field: "stock", type: "INTEGER", visible: false },
            { field: "sold_units", type: "INTEGER", visible: false },
            { field: "discount_percentage", type: "FLOAT", visible: false },
            { field: "date_added", type: "DATETIME", visible: false },
            { field: "last_purchased", type: "DATETIME", visible: false },
            { field: "is_featured", type: "BOOLEAN", visible: false }
        ]
    );
}

function createProducts() {
    DATA.forEach(product => {
        const body = new FormData();
        Object.keys(product).forEach(field => {
            body.set(field, product[field]);
        });
        request(
            () => {},
            'POST',
            'products/createProduct',
            body,
            true
        );
    });
}

function setPermission() {
    request(
        () => {},
        'PUT',
        'inventories/modifyPermission',
        { email: 'jane.smith@gmail.com', role: 'query' }
    );
}