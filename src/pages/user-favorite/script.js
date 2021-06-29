const updateFavorites = async () => {
    await axios({
        method: "get",
        url: `/api/favoritos`,
        headers: { "Content-Type": "multipart/form-data" },
    }).then(function (response) {
        console.log(response.data)
        loadFavorite(response.data.item)
    })
    .catch(function (error) {
        console.log(error);
    });
    
    
}


const loadFavorite = (favorites) => {
    const productsContainer = document.querySelector('#favorite-container')
    

    favorites.forEach(product => {
        const html = `
            <article class="m-4 product">
                <img class="rounded" src="${product.product_images[0]}" alt="${product.product_name}">
                <h5 class="pt-2">${product.product_name}</h5>
                <p>Por: <span class="fw-bold price fs-2">${product.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span></p>
                <a class="btn btn-primary w-100 text-center" onclick="addProductBag(bag)" data-bs-toggle="offcanvas" data-bs-target="#userBag" aria-controls="userBag">COMPRAR</a>
            </article>
        `

        productsContainer.insertAdjacentHTML('beforeend', html)
    });
}

window.onload = updateFavorites();