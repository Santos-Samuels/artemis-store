const loadAccessoryOffer = (products) => {
    const accessoryOfferDiv = document.querySelector('#accessory-offer-container')

    for(i=0; i<products.length;  i++) {
        if(products[i].category == "calsinha") {
            html = `
                <div class="col">
                    <img class="w-100" src="${products[i].image}" alt="${products[i].title}">
                    <h5 class="pt-2">${products[i].title}</h5>
                    <p>Por: <span class="fw-bold price fs-2">${products[i].price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span></p>
                    <a class="btn btn-primary w-100 text-center">COMPRAR</a>
                </div>
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



loadAccessoryOffer(products)