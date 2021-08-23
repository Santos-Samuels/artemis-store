const updateBanners = async () =>{
    await axios({
        method: "get",
        url: `${window.location.protocol}`+ "//" + `${window.location.host}` + "/api/banners/",
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
            <a href="/descricao/?${product.id}" class="col-6 col-md-3 col-lg-3 offer-container text-decoration-none">
                <img class="w-100 rounded-top" src="${product.product_images[0]}" alt="${product.product_name}">
                <div class="offer-label p-2 text-center rounded-bottom w-100">
                    <h6 class="mb-0">${product.product_name}</h6>
                    <p class="mb-0 fs-6">a partir de <span class="fw-bold price">${product.price}</span></p>
                </div>
            </a>
        `
    })
    updatePromotions();
}

const updatePromotions = async () => {

    await axios({
        method: "get",
       url: `${window.location.protocol}`+ "//" + `${window.location.host}` + `/api/produtos?orderby=promo`,
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
        if(index >= 4){
            return;
        }

        const html = `
            <article class="m-4 product">
                <img class="rounded w-100" src="${product.product_images[0]}" alt="${product.product_name}">
                <h5 class="pt-2 product-title">${product.product_name}</h5>
                <p class="mb-0 ${product.promotion == 0 ? "hide" : ""}">De: <span class="fs-6 text-decoration-line-through ${product.promotion == 0 ? "hide" : ""}">${product.promotion.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span></p>
                <p>Por: <span class="fw-bold price fs-2">${product.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span></p>
                <a class="btn btn-primary w-100 text-center" href="/descricao/?${product.id}">COMPRAR</a>
            </article>
        `

        productsContainer.insertAdjacentHTML('beforeend', html)
    });
}

$( document ).ready(function() {
    updateBanners();
});