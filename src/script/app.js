const loadAccessoryOffer = (products) => {
    const accessoryOfferDiv = document.querySelector('#accessory-offer-container')

    for(i=0; i<products.length;  i++) {
        if(products[i].category == "calsinha") {
            html = `
                <div class="col">
                    <img class="w-100" src="${products[i].image}" alt="${products[i].title}">
                    <h5>${products[i].title}</h5>
                    <p>Por: <span class="fw-bold price fs-2">${products[i].price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span></p>
                    <a class="btn btn-primary w-100 text-center">COMPRAR</a>
                </div>
            `

            accessoryOfferDiv.insertAdjacentHTML('beforeend', html)
        }
    }
}

loadAccessoryOffer(products)