const loadAccessoryOffer = (products) => {
    const accessoryOfferDiv = document.querySelector('#accessory-offer-container')

    for(i=0; i<products.length;  i++) {
        if(products[i].category == "calsinha") {
            const html = `
                <article class="col mb-5">
                    <img class="w-100" src="${products[i].image}" alt="${products[i].title}">
                    <h5 class="pt-2">${products[i].title}</h5>
                    <p>Por: <span class="fw-bold price fs-2">${products[i].price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span></p>
                    <a class="btn btn-primary w-100 text-center">COMPRAR</a>
                </article>
            `

            accessoryOfferDiv.insertAdjacentHTML('beforeend', html)
        }
    }
}


const ToggleModal = (modalContainer) => {
    const modal = document.querySelector(modalContainer)
    const body = document.querySelector('body')

    if(modal.classList.contains('hide') == true) {
        modal.classList.remove('hide')
        body.style.overflow = "hidden"
    }
    else {
        modal.classList.add('hide')
        body.style.overflow = "auto"
    }
}


const loadProducts = (products) => {
    const productsDiv = document.querySelector('#products-container')

    products.forEach(product => {
        const html = `
            <article class="m-4 product">
                <img src="${product.image}" alt="${product.title}">
                <h5 class="pt-2">${product.title}</h5>
                <p>Por: <span class="fw-bold price fs-2">${product.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span></p>
                <a class="btn btn-primary w-100 text-center">COMPRAR</a>
            </article>
        `

        productsDiv.insertAdjacentHTML('beforeend', html)
    });
}


// const loadSales = () => {

// }