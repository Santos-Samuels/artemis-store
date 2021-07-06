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
    
    productsContainer.innerHTML = ""
    if(favorites.length == 0) {
        const html = `
            <div class="text-center mt-5 text-secondary border-0">
                <i class="bi bi-info-circle fs-1"></i>
                <h3 class="">Você ainda não tem favoritos</h3>
            </div>
        `

        productsContainer.insertAdjacentHTML('beforeend', html)
    }
    else {
        favorites.forEach(product => {
            const html = `
                <article class="m-4 product">
                    <img class="rounded" src="${product.product_images[0]}" alt="${product.product_name}">
                    <h5 class="pt-2">${product.product_name}</h5>
                    <p class="mb-0">De: <span class="fs-6 text-decoration-line-through">${product.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span></p>
                    <p>Por: <span class="fw-bold price fs-2">${product.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span></p>
                    <a class="btn btn-primary w-100 text-center" onclick="addProductBag(bag)" data-bs-toggle="offcanvas" data-bs-target="#userBag" aria-controls="userBag">COMPRAR</a>
                    <div class="mt-2">
                        <div onclick="removeOfWishList(${product.id})" class="d-flex align-items-center border border-2 rounded p-0 cursor-pointer text-secondary justify-content-center heartButton" style="background-color: white;">
                            <i class="bi fs-4 me-2 ms-3 bi-trash-fill" id="heartIcon"></i>
                            <p class="mb-0 h6">REMOVER</p>
                        </div>
                    </div>
                </article>
            `
    
            productsContainer.insertAdjacentHTML('beforeend', html)
        });
    }

    
}

const removeOfWishList = async (favoriteId) => {
    var data = new FormData();
    data.append("deletedProductId", favoriteId);

    await axios({
        method: "post",
        data: data,
        url: `/api/favoritos`,
        headers: { "Content-Type": "multipart/form-data" },
    }).then(function (response) {
        console.log(response.data)
        if(response.data.qtd == 0){
            window.location.href = "/404";
            return
        }

        if(response.data.msg == "Produto Removido na Wishlist"){
            updateFavorites()
        }else{
            return false;
        }
    })
    .catch(function (error) {
        console.log(error);
    });

}

window.onload = updateFavorites();