const inventoryF = JSON.parse(localStorage.getItem('fields'));
let formDataUpdate = new FormData();
let formDataCreate = new FormData();
const CREATE = 'create-section';
const READ = 'read-section';
const UPDATE = 'update-section';
renderCreateSection();

function renderCreateSection() {
    formDataCreate = new FormData();
    renderProduct(undefined, true, 'Create product', CREATE)
    .then(html => {
        document.getElementById('create-product')
        .innerHTML = html;
    });
}

function searchProducts(event) {
    event.preventDefault();
    const query = document.getElementById('query').value;
    request(
        (data) => { renderProducts(data); },
        'GET',
        `products/getProductsByQuery?query=${encodeURIComponent(query)}`
    );
}

function searchProductId(event) {
    let id;
    if (event) {
        event.preventDefault();
        id = document.getElementById('id').value;
        localStorage.setItem('product', id);
    } else {
        id = localStorage.getItem('product');
    }
    request(
        (data) => {
            renderProduct(data, true, 'Edit product', UPDATE)
            .then(html => {
                document.getElementById('result-id').innerHTML = html[0];
            });
        },
        'GET',
        'products/getProductById'
    );
}

function renderProducts(results) {
    Promise.all(results.products.map(product => renderProduct(product, false, undefined, READ)))
    .then(html => {
        document.getElementById('results-query')
        .innerHTML = /*html*/`
            <div>
                <p>Page ${results.currentPage + 1}/${results.lastPage + 1}</p>
                <br>
                <p>Total products found: ${results.totalProducts}</p>
            </div>
            ${html.join('')}`;
    });
}

async function renderProduct(item={}, canEdit, buttonText, sectionId) {
    const productF = item.fields;
    return requestImages(productF)
    .then(imagesData => {
        return prepareImages(imagesData);
    }).then(images => {
        prepareUrls(productF, images);
        return Promise.all([/*html*/`
            <div id="${sectionId}" class="flex-vertical product-container">
                ${
                    item.product
                    ? /*html*/`<div class="flex-horizontal product-field">
                        <p>ID</p>
                        <p>${item.product}</p>
                    </div>`
                    : ''
                }
                ${
                    Object.keys(inventoryF).map(field => {
                        return renderField(productF, field, sectionId);
                    }).join('')
                }
                ${
                    canEdit ? /*html*/`<button data-editing="false"
                                                id="button-${sectionId}"
                                                class="button"
                                                onclick="startEndEdition('${sectionId}', 'button-${sectionId}')">${buttonText}</button>`
                    : ''
                }
                ${
                    sectionId == UPDATE
                    ? /*html*/`
                        <br>
                        <button class="button danger-button" onclick="deleteProduct()">Delete product</button>
                        `
                    : ''
                }
            </div>`]);
    });
}

function requestImages(productF={}) {
    return Promise.all(Object.keys(productF).map(field => {
        if (inventoryF[field].type != 'image' || !productF[field]) {
            return undefined;
        }
        return request(
            undefined,
            'GET',
            `images/getImage?field=${productF[field]}`
        );
    }));
}

function prepareImages(imagesData) {
    return Promise.all(imagesData.flatMap(response => {
        if (response) {
            return [response.url.split('=').pop(), response.blob()];
        }
        return [undefined, undefined];
    }));
}

function prepareUrls(productF={}, imagesData) {
    for (let i = 0; i < imagesData.length; i += 2) {
        if (!imagesData[i]) {
            continue;
        }
        const field = imagesData[i];
        const image = imagesData[i+1];
        productF[field] = URL.createObjectURL(image);
    };
}

function renderField(productF={}, field, sectionId) {
    let html;
    if (inventoryF[field].type == 'image') {
        html = renderImage(productF, field, sectionId);
    } else if (inventoryF[field].type == 'array') {
        html = renderArray(productF, field, sectionId);
    } else {
        html = renderText(productF, field, sectionId);
    }
    return /*html*/`
        <div class="flex-horizontal product-field">
            <p class="product-key">${field}</p>
            ${html}
        </div>`;
}

function renderImage(productF={}, field, sectionId) {
    let img = '';
    const url = productF[field];
    if (url) {
        img = /*html*/`<img src="${url}"
                            class="product-image"
                            id="${sectionId}-${field}"/>
                        <br>
                        ${
                            sectionId == UPDATE
                            ? /*html*/`<button class="hide button" onclick="removeImage('${sectionId}-${field}', '${field}')">Remove this image</button>`
                            : ''
                        }
                        <br>`;
    }
    return /*html*/`
        <div class="flex-vertical product-image-container">
            ${img}
            ${
                sectionId != READ
                ? /*html*/`
                    <input class="input-file"
                            type="file"
                            accept="image/*"
                            id="${sectionId}-upload-${field}"
                            disabled
                            onchange="updateField('${sectionId}-upload-${field}', '${sectionId}', '${field}', 'image')">`
                : ''
            }
        </div>`;
}

function renderArray(productF={}, field, sectionId) {
    let values = '';
    const array = productF[field];
    if (array) {
        values = array.join('\n');
    }
    return /*html*/`
        <textarea id="${sectionId}-${field}"
                class="array-textarea"
                disabled
                placeholder="${inventoryF[field].type}"
                onchange="updateField('${sectionId}-${field}', '${sectionId}', '${field}', 'array')">${values}</textarea>
    `;
}

function renderText(productF={}, field, sectionId) {
    const value = productF[field];
    return /*html*/`<input class="product-value"
                            type="text"
                            value="${[undefined, null].includes(value) ? '' : value}"
                            id="${sectionId}-${field}"
                            disabled
                            placeholder="${inventoryF[field].type}"
                            onchange="updateField('${sectionId}-${field}', '${sectionId}', '${field}', 'text')">`;
}

function startEndEdition(sectionId, buttonId) {
    document.querySelectorAll(`#${sectionId} :is(input, textarea)`)
    .forEach(element => {
        element.disabled = false;
        if (element.getAttribute('type') != 'file') {
            element.classList.add('product-value-edition');
        }
    });
    document.querySelector(`#${sectionId} button`).classList.remove('hide');
    const button = document.getElementById(buttonId);
    const isEditing = button.getAttribute('data-editing') == 'true';
    if (isEditing) {
        if (sectionId == UPDATE) {
            updateProduct();
        } else {
            createProduct();
        }
    } else {
        button.innerHTML = 'Save';
        button.classList.add('save-button');
        button.setAttribute('data-editing', 'true');
    }
}

function removeImage(imageId, field) {
    document.getElementById(imageId).src = "";
    formDataUpdate.set(field, '');
}

function updateField(containerId, sectionId, field, type) {
    let value;
    if (type == 'text') {
        value = document.getElementById(containerId).value;
    } else if (type == 'image') {
        value = document.getElementById(containerId).files[0];
    } else {
        value = JSON.stringify(document.getElementById(containerId).value
                    .split('\n')
                    .filter(word => word)
                    .map(word => word.trim()));
    }
    if (sectionId == UPDATE) {
        formDataUpdate.set(field, value);
    } else {
        formDataCreate.set(field, value);
    }
}

function updateProduct() {
    request(
        () => { searchProductId(); },
        'PUT',
        'products/updateProduct',
        formDataUpdate,
        true
    );
}

function createProduct() {
    request(
        () => { renderCreateSection(); },
        'POST',
        'products/createProduct',
        formDataCreate,
        true
    );
}

function deleteProduct() {
    request(
        () => {
            document.getElementById('result-id').innerHTML = '';
        },
        'DELETE',
        'products/deleteProduct'
    )
}