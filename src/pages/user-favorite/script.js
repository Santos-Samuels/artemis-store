const loadFavorite = (favorites) => {
    const productsContainer = document.querySelector('#favorite-container')
    

    favorites.forEach(product => {
        const html = `
            <article class="m-4 product">
                <img class="rounded" src="${product.image}" alt="${product.name}">
                <h5 class="pt-2">${product.title}</h5>
                <p>Por: <span class="fw-bold price fs-2">${product.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span></p>
                <a class="btn btn-primary w-100 text-center" onclick="addProductBag(bag, ${product.id}, '${product.title}', ${product.price}, '${product.image}', ${product.stock}, ${1})" data-bs-toggle="offcanvas" data-bs-target="#userBag" aria-controls="userBag">COMPRAR</a>
            </article>
        `

        productsContainer.insertAdjacentHTML('beforeend', html)
    });
}

window.onload = loadFavorite(favorites)