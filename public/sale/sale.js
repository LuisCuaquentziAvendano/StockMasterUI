let cart = [];

window.onload = request(
    (data) => { renderProducts(data); },
    'GET',
    `products/getProductsByQuery?query=`
);

function renderProducts(results) {
    const selectElement = document.getElementById('product-select');

    results.products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.product;
        option.textContent = `${product.fields.name} (${product.fields.price})`;
        selectElement.appendChild(option);
    });

    document.getElementById('product-add').onclick = () => {
        const quantityInput = document.getElementById('product-quantity');
        if (quantityInput.value) {
            const selectedProductId = selectElement.value;
            const selectedProduct = results.products.find(p => p.product === selectedProductId);

            const productData = {
                product_id: selectedProductId,
                name: selectedProduct.fields.name,
                price: selectedProduct.fields.price,
                amount: quantityInput.value
            };
            cart.push(productData);

            renderCart(cart);
        }
    }
}

function renderCart(cart) {
    const cartContainer = document.getElementById('cart');
    cartContainer.innerHTML = cart.map((item, index) => `
        <div class="flex-horizontal" style="gap: 1rem;">
            <p>${item.name} - ${item.price} x ${item.amount}</p>
            <button onclick="removeFromCart(${index})" class="remove-button cancel-action">Remove Product</button>
        </div>
    `).join('');
}

function removeFromCart(index) {
    cart.splice(index, 1); 
    renderCart(cart); 
}

function createSale () {
    const customerInput = document.getElementById('customer-input');
    const customer = customerInput.value;
    const products = cart.map(({ name, ...rest }) => rest);
    if(cart.length > 0 && customer) {
        const body = {
            customer,
            paymentMethodId: "pm_card_visa",
            products
        }
        console.log(body);
        request(
            () => {
                cart = [];
                customerInput.value = "";
                window.location.href = '/sales';
            },
            'POST',
            `sales/makePurchase`,
            body
        );
    }
}