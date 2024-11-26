window.onload = renderRecords();

function createSaleRecord() {
    const container = document.getElementById('create-record');
    container.innerHTML = `
        <div class="flex-vertical" style="gap: 1rem" id="to-delete">
            <div class="flex-horizontal" style="gap: 1rem">
                <label for="filter-select">Record type:</label>
                <select id="filter-select">
                    <option value="inventory">Inventory</option>
                    <option value="product">Product</option>
                    <option value="customer">Customer</option>
                </select>
                <button onclick="selectType()" class="select-button" id="selector">Select type</button>
            </div>
            <div class="flex-horizontal" style="gap: 1rem" id="record-creation"></div>
        </div>
        <button onclick="cancelRecord()" class="cancel-action cancel-button" id="canceler">Cancel record creation</button>
    `;
}

function cancelRecord() {
    const creator = document.getElementById('to-delete');
    const canceler = document.getElementById('canceler');
    creator.remove();
    canceler.remove()
}

function createRecord() {
    const type = document.getElementById('filter-select').value;
    const parameter = document.getElementById('parameter-select').value;

    const body = {
        parameterType: type,
        parameterId: parameter
    }

    request(
        () => {
            cancelRecord();
            renderRecords();
        },
        'POST',
        `salesRecords/createSalesRecord`,
        body
    );
}

function selectType() {
    const typeSelect = document.getElementById('filter-select');
    const type = typeSelect.value;
    if(type) {
        typeSelect.disabled = true;
        const container = document.getElementById('record-creation');
        const newElement = document.createElement('select');
        const label = document.createElement('label');

        label.innerText = "Select parameter: ";
        container.appendChild(label);

        newElement.setAttribute('id', 'parameter-select');
        container.appendChild(newElement);
        const selectElement = document.getElementById('parameter-select');

        const button = document.getElementById('selector');
        button.classList.add('disabled-action');
        button.disabled = true;

        const create = document.createElement("button");
        create.textContent = "Create";
        create.classList.add("select-button");
        create.addEventListener("click", createRecord);

        if(type === "customer") {
            request(
                (data) => { 
                    let customers = []; 
                    data.forEach(sale => {
                        const current_customer = sale.customer;
                        if (customers.includes(current_customer)) {
                            return;
                        }
                        customers.push(current_customer);
                        const option = document.createElement('option');
                        option.value = current_customer;
                        option.textContent = `${current_customer}`;
                        selectElement.appendChild(option);
                    });
                },
                'GET',
                `sales/getSalesByInventory`
            );
        } else if(type === "product") {
            request(
                (data) => { 
                    let products = []; 
                    data.forEach(sale => {
                        sale.products.forEach(product => {
                            const current_product = product.product_id;
                            if (products.includes(current_product)) {
                                return;
                            }
                            products.push(current_product);
                            const option = document.createElement('option');
                            option.value = current_product;
                            option.textContent = `${current_product}`;
                            selectElement.appendChild(option);
                        });
                    });
                },
                'GET',
                `sales/getSalesByInventory`
            );
        } else if(type === "inventory") {
            const option = document.createElement('option');
            const inventory = localStorage.getItem('inventory');
            option.value = inventory
            option.textContent = `${inventory}`;
            selectElement.appendChild(option);
        }
        container.appendChild(create);
    }
}

function renderRecords() {
    request(
        (data) => {
            const salesContainer = document.getElementById('sales-records');
            salesContainer.innerHTML = data.map(record => renderRecord(record)).join('');
        },
        'GET',
        `salesRecords/getAllSalesRecords`
    );
    
}

function renderRecord(saleRecord) {
    return `
    <div class="sale-record">
        <h4>Sale Record ID: ${saleRecord._id}</h4>
        <strong>Parameter Type:</strong> ${saleRecord.parameterType}
        <strong>Parameter ID:</strong> ${saleRecord.parameterId}
        <strong>Total Sales Amount:</strong> $${(parseFloat(saleRecord.totalSalesAmount) / 100).toFixed(2)}
        <strong>Products Sold:</strong>
            <ul style="padding-left: 1.5rem;">
                ${saleRecord.entityId.map(id => `<li>${id}</li>`).join('')}
            </ul>
        <strong>Created At:</strong> ${new Date(saleRecord.createdAt).toLocaleString()}
        <strong>Updated At:</strong> ${new Date(saleRecord.updatedAt).toLocaleString()}
        <center style="margin-top: 1rem"><button onclick="updateRecord('${saleRecord._id}', '${saleRecord.parameterType}', '${saleRecord.parameterId}')" class="cancel-button" id="updater">Update record</button></center>
        <center style="margin-top: 0.4rem"><button onclick="deleteRecord('${saleRecord._id}')" class="cancel-action cancel-button" id="deleter">Delete record</button></center>
    </div>
    `;
}

function deleteRecord(salesRecordId) {
    request(
        () => {
            renderRecords();
        },
        'DELETE',
        `salesRecords/deleteSalesRecord`,
        { salesRecordId }
    );
}

function updateRecord(salesRecordId, parameterType, parameterId) {
    request(
        () => {
            renderRecords();
        },
        'PUT',
        `salesRecords/updateSalesRecord`,
        { salesRecordId, parameterType, parameterId}
    );
}
