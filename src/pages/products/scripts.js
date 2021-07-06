const loadProducts = async () => {
    var data = new FormData(document.getElementById("filter-form"));
    console.log("Algo")
    teste = data;
    
    await axios({
        method: "get",
        url: "api/produtos/",
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
    const productsContainer = document.querySelector('#products-container')
    

    products.forEach(product => {
        const html = `
            <article class="m-4 product">
                <img class="rounded" src="${product.product_images[0]}" alt="${product.product_name}">
                <h5 class="pt-2 product-title">${product.product_name}</h5>
                <p>Por: <span class="fw-bold price fs-2">${product.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span></p>
                <a class="btn btn-primary w-100 text-center" onclick="addProductBag(bag, ${product.id}, '${product.title}', ${product.price}, '${product.image}', ${product.stock}, ${1})" data-bs-toggle="offcanvas" data-bs-target="#userBag" aria-controls="userBag">COMPRAR</a>
            </article>
        `

        productsContainer.insertAdjacentHTML('beforeend', html)
    });
}

const filterProducts = async () => {
    const category = document.getElementById("category-filter").value;
    const type = document.getElementById("type-filter").value;
    const orderby = document.getElementById("price-filter").value;

    console.log({category, type, orderby})

    await axios({
        method: "get",
        url: `api/produtos?category=${category}&type=${type}&orderby=${orderby}`,
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

// function logout() {
//     conectedDiv = querySelector('#userDropdownConectedOptions')
//     desconectedDiv =  querySelector('#user')

//     conectedDiv.classList.add('hide')
//     desconectedDiv.classList.remove('hide')
// }

// function login() {
//     conectedDiv = querySelector('#userDropdownConectedOptions')
//     desconectedDiv =  querySelector('#user')

//     conectedDiv.classList.remove('hide')
//     desconectedDiv.classList.add('hide')
// }




window.onload = loadProducts();