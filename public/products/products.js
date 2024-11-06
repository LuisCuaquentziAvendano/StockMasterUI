function searchProducts(event) {
    event.preventDefault();
    const query = document.getElementById('query').value;
    request(
        (data) => { renderProducts(data); },
        'GET',
        `products/getProductsByQuery?query=${encodeURIComponent(query)}`
    );
}

function renderProducts(results) {
    document.getElementById('results-query')
    .innerHTML = /*html*/`
        <div>
            <p>Page ${results.currentPage + 1}/${results.lastPage + 1}</p>
            <br>
            <p>Total products: ${results.totalProducts}</p>
        </div>
        ${results.products.map(product => renderProduct(product, false))}
    `;
}

function searchProductId(event) {
    event.preventDefault();
    const id = document.getElementById('id').value;
    localStorage.setItem('product', id);
    request(
        (data) => {
            document.getElementById('result-id')
            .innerHTML = renderProduct(data, true);
        },
        'GET',
        'products/getProductById'
    );
}

function renderProduct(item, edition) {
    const fields = item.fields;
    return /*html*/`
        <div class="flex-vertical product-container">
            <div class="flex-horizontal product-field">
                <p>ID</p>
                <p>${item.product}</p>
            </div>
            ${Object.keys(fields).map(field => {
                return /*html*/`
                    <div class="flex-horizontal product-field">
                        <p class="product-key">${field}</p>
                        <input class="product-value" type="text" value="${fields[field] === null ? '' : fields[field]}" disabled>
                    </div>
                `;
            }).join('')}
            ${
                edition ? /*html*/`<button class="button-update" onclick="updateProduct()">Update product</button>`
                : ''
            }
        </div>
    `;
}

function updateProduct() {
    document.querySelectorAll('#result-id input')
    .forEach(element => {
        element.disabled = false;
        element.classList.add('product-value-edition');
    });
}