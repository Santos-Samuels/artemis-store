const updateBanners = async () =>{
    await axios({
        method: "get",
        url: "api/banners/",
        headers: { "Content-Type": "multipart/alternative" },
    }).then(function (response) {
        console.log(response.data);
        _updateBanners(response.data.item);
    })
    .catch(function (error) {
        console.log(error);
    });
}

const _updateBanners = (products) =>{
    const allBanners = document.getElementById("MainBanner");

    allBanners.innerHTML = ""
    products.map((product) => {

        allBanners.innerHTML += `
        <a href="/descricao/?${product.id}" class="col-6 col-lg-3 offer-container">
            <div class="position-absolute offer-label">
                <h3>${product.product_name}</h3>
                    <p>a partir de <span class="fw-bold price">${product.price}</span></p>
                </div>
            <img class="w-100 rounded" src="${product.product_images[0]}" alt="Colar blue stone">
            
        </a>`
    })
    updatePromotions();
}

const updatePromotions = async () => {

    await axios({
        method: "get",
        url: `api/produtos?orderby=promo`,
        headers: { "Content-Type": "multipart/alternative" },
    }).then(function (response) {
        console.log(response.data);
        _loadProducts(response.data.item);
    })
    .catch(function (error) {
        console.log(error);
    });
}

const _loadProducts = (products) => {
    const productsContainer = document.querySelector('#accessory-offer-container')
    
    productsContainer.innerHTML = ""
    products.forEach((product, index) => {
        if(index >= 7){
            return;
        }

        const html = `
            <article class="m-4 product">
                <img class="rounded" src="${product.product_images[0]}" alt="${product.product_name}">
                <h5 class="pt-2 product-title">${product.product_name}</h5>
                <p class="mb-0">De: <span class="fs-6 text-decoration-line-through">${product.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span></p>
                <p>Por: <span class="fw-bold price fs-2">${product.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span></p>
                <a class="btn btn-primary text-center" style="width= 250px; !important" href="/descricao/?${product.id}">COMPRAR</a>
            </article>
        `

        productsContainer.insertAdjacentHTML('beforeend', html)
    });
}

$( document ).ready(function() {
    updateBanners();
});