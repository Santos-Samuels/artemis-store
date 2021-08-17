const updateData = async () => {
    var id = window.location.search.replace("?", "");

    if(id == ""){
        window.location.href = "/404";
        return;
    }

    document.getElementById("order-id").innerHTML = `Número do pedido: ${id}`;
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
    const productsContainer = document.querySelector('#offers-container')
    
    productsContainer.innerHTML = ""
    products.forEach((product, index) => {
        if(index >= 7){
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
    window.onload = () => {
        updateData();
        updatePromotions();
    }
});