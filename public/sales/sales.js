window.onload = request(
    (data) => { renderSales(data); },
    'GET',
    `sales/getSalesByInventory`
);

function renderSales(results) {
    const salesContainer = document.getElementById('sales');
    salesContainer.innerHTML = results.map(sale => renderSale(sale)).join('');
}

function renderSale(sale) {
    const productsHtml = sale.products.map(product => `
        <li style="margin-left: 1.5rem;">
            <strong>Product ID:</strong> ${product.product_id} <br>
            <strong>Amount:</strong> ${product.amount} <br>
            <strong>Price:</strong> $${product.price} <br>
        </li>
    `).join('');

    if (sale.status === "refunded") {
        return `
            <div class="sale-container" id="${sale._id}">
                <p><strong>Customer:</strong> ${sale.customer}</p>
                <p class="status"><strong>Status:</strong> ${sale.status}</p>
                <p><strong>Total Amount:</strong> $${(parseFloat(sale.totalAmount) / 100).toFixed(2)}</p>
                <p><strong>Products:</strong></p>
                <ul>
                    ${productsHtml}
                </ul>
                <center><button class="disabled-action" onclick="refundSale('${sale._id}')" disabled>Refund</button></center>
            </div>
        `;
    }

    return `
        <div class="sale-container" id="${sale._id}">
            <p><strong>Customer:</strong> ${sale.customer}</p>
            <p class="status"><strong>Status:</strong> ${sale.status}</p>
            <p><strong>Total Amount:</strong> $${(parseFloat(sale.totalAmount) / 100).toFixed(2)}</p>
            <p><strong>Products:</strong></p>
            <ul>
                ${productsHtml}
            </ul>
            <center><button class="cancel-action" onclick="refundSale('${sale._id}')">Refund</button></center>
        </div>
    `;
}

function refundSale(saleId) {
    request(
        () => {
            const sale = document.getElementById(saleId);
            const status = sale.querySelector('.status');
            const button = sale.querySelector('.cancel-action');
            status.innerHTML = `<strong>Status:</strong> refunded`;
            button.classList.add('disabled-action');
            button.classList.remove('cancel-action');
        },
        'POST',
        `sales/refundPurchase`,
        { saleId }
    );
}