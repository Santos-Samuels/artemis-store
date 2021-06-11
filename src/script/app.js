const loadAccessoryOffer = (products) => {
    const accessoryOfferContainer = document.querySelector('#accessory-offer-container')

    for(i=0; i<products.length;  i++) {
        if(products[i].type == "calsinha") {
            const html = `
                <article class="col mb-5">
                    <img class="w-100 rounded" src="${products[i].image}" alt="${products[i].title}">
                    <h5 class="pt-2">${products[i].title}</h5>
                    <p>Por: <span class="fw-bold price fs-2">${products[i].price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span></p>
                    <a class="btn btn-primary w-100 text-center">COMPRAR</a>
                </article>
            `

            accessoryOfferContainer.insertAdjacentHTML('beforeend', html)
        }
    }
}

const loadProducts = (products) => {
    const productsContainer = document.querySelector('#products-container')
    

    products.forEach(product => {
        const html = `
            <article class="m-4 product">
                <img class="rounded" src="${product.image}" alt="${product.title}">
                <h5 class="pt-2">${product.title}</h5>
                <p>Por: <span class="fw-bold price fs-2">${product.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span></p>
                <a class="btn btn-primary w-100 text-center" onclick="addProductBag(bag, ${product.id}, '${product.title}', ${product.price}, '${product.image}', ${product.stock}, ${1})" data-bs-toggle="offcanvas" data-bs-target="#userBag" aria-controls="userBag">COMPRAR</a>
            </article>
        `

        productsContainer.insertAdjacentHTML('beforeend', html)
    });
}


const loadBag = (bag) => {
    const bagContainer = document.querySelector('#bag-container-products')
    const bagFooterContainer = document.querySelector('#bag-container-footer')

    bagContainer.querySelectorAll('article').forEach(item => {
        item.remove()
    })

    bagFooterContainer.querySelectorAll('payment').forEach(content => {
        content.remove()
    })

    

    if(bag.length == 0) {
        const html = `
            <article class="text-center mt-5 text-secondary">
                <i class="bi bi-info-circle fs-1"></i>
                <h3 class="">Seu carrinho está vazio</h3>
            </article>
        `
        bagContainer.insertAdjacentHTML('beforeend', html)
    }
    else {
        let bagTotalPrice = 0

        bag.forEach(item => {
            const html = `
                <article class="row g-2 mb-3 me-1">
                    <div class="col-3 me-2">
                        <img class="bag-product-image rounded me-3" src="${item.image}" alt="">
                    </div>
                    <div class="me-4 col">
                        <h6>${item.title}</h6>
                        <input class="bag-product-quantity form-control" type="number" name="bag-product-quantity" id="" min="0" max="${item.stock}" value="${item.quantity}">
                    </div>
                    <div class="col-2">
                        <p class="mb-0 bag-product-price">${item.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</p>
                        <span class="primary-text primary-text-hover cursor-pointer bag-trash-button" id="${item.id}" onclick="removeProductBag(bag, ${item.id})"><i class="bi bi-trash-fill fs-4"></i></span>
                    </div>
                </article>
            `
            bagTotalPrice += item.price
            bagContainer.insertAdjacentHTML('beforeend', html)
        });
        
        bagFooterContainer.innerHTML = `
            <payment class="row pt-3">
                <h5 class="col text-secondary">Total</h5>
                <h5 class="col text-end fw-bold">${bagTotalPrice.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</h5>
            </payment>
            <payment class="mt-4">
                <button class="btn btn-primary w-100" id="bag-button-finalizar-compra">Finalizar Compra</button>
            </payment>
        `
    }
}


const addProductBag = (bag, productId, productTitle, productPrice, productImage, productStock, productQuantity) => {
    let valid = bag.find(item => { return item.id === productId })

    if(valid != undefined && productQuantity < productStock) {
        bag.forEach(item => {
            if(item.id == productId) {
                item.quantity += 1
            }
        });
    }
    else bag.push({'id': productId, 'title': productTitle, 'price': productPrice, 'image': productImage, 'stock': productStock, 'quantity': productQuantity})
    
    loadBag(bag)
}

const removeProductBag = (bag, productId) => {
    if(bag.length != 0) {
        bag.forEach((item, index) => {
            if(item.id == productId) {
                bag.splice(index, 1)
            }
         })
    }

    loadBag(bag)
}


const searchProduct = (products, searchTerm) => products.filter(product => product.title.includes(`${searchTerm}`))

