var searchWord = "";

const loadProducts = async () => {
    var data = new FormData(document.getElementById("filter-form"));
    teste = data;
    
    await axios({
        method: "get",
        url: `${window.location.protocol}`+ "//" + `${window.location.host}` + "/api/produtos/",
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
    document.getElementById("searchWord").innerHTML = searchWord == "" ? "" : '<span class="text-light">Procurou por: </span>' + searchWord;
    
    products = search(products);

    const productsContainer = document.querySelector('#products-container')
    
    productsContainer.innerHTML = ""
    products.forEach(product => {
        const html = `
            <article class="m-4 product">
                <img class="rounded" src="${product.product_images[0]}" alt="${product.product_name}">
                <h5 class="pt-2 product-title">${product.product_name}</h5>
                <p class="mb-0 ${product.promotion == 0 ? "hide" : ""}">De: <span class="fs-6 text-decoration-line-through ${product.promotion == 0 ? "hide" : ""}">${product.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span></p>
                <p>Por: <span class="fw-bold price fs-2">${product.promotion == 0 ? product.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}) : product.promotion.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span></p>
                <a class="btn btn-primary w-100 text-center" href="/descricao/?${product.id}">COMPRAR</a>
            </article>
        `

        productsContainer.insertAdjacentHTML('beforeend', html)
    });
}

const search = (products) => {
    var temp = []

    products.map((product) => {
        if(product.product_name.toLowerCase().includes(searchWord) || product.description.toLowerCase().includes(searchWord)){
            temp.push(product);
        }
    })

    return temp;
}

const filterProducts = async () => {
    const category = document.getElementById("category-filter").value;
    const type = document.getElementById("type-filter").value;
    const orderby = document.getElementById("price-filter").value;

    console.log({category, type, orderby})

    await axios({
        method: "get",
       url: `${window.location.protocol}`+ "//" + `${window.location.host}` + `/api/produtos?category=${category}&type=${type}&orderby=${orderby}`,
        headers: { "Content-Type": "multipart/alternative" },
    }).then(function (response) {
        console.log(response.data);
        document.getElementById("products-container").innerHTML = "";
        _loadProducts(response.data.item);
    })
    .catch(function (error) {
        console.log(error);
    });
}

$( document ).ready(function() {
    searchWord = window.location.search.substring(1).toLowerCase();
    loadProducts();
});