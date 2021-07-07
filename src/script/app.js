// const loadAccessoryOffer = (products) => {
//     const accessoryOfferContainer = document.querySelector('#accessory-offer-container')

//     for(i=0; i<products.length;  i++) {
//         if(products[i].type == "calsinha") {
//             const html = `
//                 <article class="col mb-5">
//                     <img class="w-100 rounded" src="${products[i].image}" alt="${products[i].title}">
//                     <h5 class="pt-2">${products[i].title}</h5>
//                     <p>Por: <span class="fw-bold price fs-2">${products[i].price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span></p>
//                     <a class="btn btn-primary w-100 text-center">COMPRAR</a>
//                 </article>
//             `

//             accessoryOfferContainer.insertAdjacentHTML('beforeend', html)
//         }
//     }
// }

const register_form = document.getElementById('signup-form');
register_form.addEventListener('submit', function(e) {
    e.preventDefault()
    
    console.log("Funcionou");

    registrar()
});

const GoToCheckout = () =>{
    console.log("Funfando")
    window.location.assign('/checkout');
}

// const loadProducts = (products) => {
//     const productsContainer = document.querySelector('#products-container')
    

//     products.forEach(product => {
//         const html = `
//             <article class="m-4 product">
//                 <img class="rounded" src="${product.image}" alt="${product.title}">
//                 <h5 class="pt-2">${product.title}</h5>
//                 <p>Por: <span class="fw-bold price fs-2">${product.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span></p>
//                 <a class="btn btn-primary w-100 text-center" onclick="addProductBag(bag, ${product.id}, '${product.title}', ${product.price}, '${product.image}', ${product.stock}, ${1})" data-bs-toggle="offcanvas" data-bs-target="#userBag" aria-controls="userBag">COMPRAR</a>
//             </article>
//         `

//         productsContainer.insertAdjacentHTML('beforeend', html)
//     });
// }

const loadCart = () => {
    const bagContainer = document.querySelector('#bag-container-products')
    const bagFooterContainer = document.querySelector('#bag-container-footer')

    bagContainer.querySelectorAll('article').forEach(item => {
        item.remove()
    })

    bagFooterContainer.querySelectorAll('payment').forEach(content => {
        content.remove()
    })

    var cart = JSON.parse(localStorage.getItem("cart"));
    

    if(cart.length == 0 || cart == "") {
        const html = `
            <article class="text-center mt-5 text-secondary">
                <i class="bi bi-info-circle fs-1"></i>
                <h3 class="">Seu carrinho está vazio</h3>
            </article>
        `
        bagContainer.insertAdjacentHTML('beforeend', html)
        
        bagFooterContainer.innerHTML = `
        <payment class="row pt-3">
            <h5 class="col text-secondary">Total</h5>
            <h5 class="col text-end fw-bold">${"0".toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</h5>
        </payment>
        <payment class="mt-4">
            <button type="button" onclick="GoToCheckout()" class="btn btn-primary w-100" id="bag-button-finalizar-compra">Finalizar Compra</button>
        </payment>
    `
    }
    else {
        let bagTotalPrice = 0

        cart.forEach(item => {
            const html = `
                <article class="row g-2 mb-3 me-1">
                    <div class="col-3 me-2">
                        <img class="bag-product-image rounded me-3" src="${item.product.product_images[0]}" alt="">
                    </div>
                    <div class="me-4 col">
                        <h6>${item.product.product_name}</h6>
                        <div class="mb-1">
                            <i class="bi bi-info-circle me-1"></i>
                            <span class="me-1 pe-2 border-end">${item.selectedColor}</span>
                            <span>${item.selectedSize}</span>
                        </div>
                        <input onchange="ChangeQuantity(${item.product.id}, 'cart-${item.itemId}' ,${item.itemId})" id="cart-${item.itemId}" class="bag-product-quantity form-control" type="number" name="bag-product-quantity" id="${item.product.id}" min="0" max="${item.stock}" value="${item.quantity}">
                    </div>
                    <div class="col-2">
                        <p class="mb-0 bag-product-price">${item.product.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</p>
                        <span class="primary-text primary-text-hover cursor-pointer bag-trash-button" id="${item.product.id}" onclick="removeFromCart(${item.product.id}, '${item.selectedColor}', '${item.selectedSize}')"><i class="bi bi-trash-fill fs-4"></i></span>
                    </div>
                </article>
            `
            bagTotalPrice += (parseFloat(item.product.price) * parseInt(item.quantity));
            bagContainer.insertAdjacentHTML('beforeend', html)
        });
        
        bagFooterContainer.innerHTML = `
            <payment class="row pt-3">
                <h5 class="col text-secondary">Total</h5>
                <h5 class="col text-end fw-bold">${bagTotalPrice.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</h5>
            </payment>
            <payment class="mt-4">
                <button type="button" onclick="GoToCheckout()" class="btn btn-primary w-100" id="bag-button-finalizar-compra">Finalizar Compra</button>
            </payment>
        `
    }
}

const addOnCart = (product, quantity, selectedColor, selectedSize) => {
    var cart = localStorage.getItem("cart");

    if(cart == null){
        var temp = [];
        localStorage.setItem("cart", JSON.stringify(temp));
        addOnCart(product, quantity, selectedColor, selectedSize);
    }
    
    cart = JSON.parse(cart);

    var newOrder = {product, quantity, selectedColor, selectedSize, itemId : cart.length + 1}; 

    for(i=0;i<cart.length; i++){
        item = cart[i];
        if( 
            item.product.id == newOrder.product.id
            && item.selectedColor == newOrder.selectedColor
            && item.selectedSize == newOrder.selectedSize
        ){
            console.log("Ja existe um item no carrinho igual a esse !")
            return;
        }
    }

    cart.push(newOrder);
    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
}

const removeFromCart = (productId, selectedColor, selectedSize) =>{
    var cart = localStorage.getItem("cart");

    cart = JSON.parse(cart);

    for(i=0;i<cart.length; i++){
        item = cart[i];
        if( 
            item.product.id == productId
            && item.selectedColor == selectedColor
            && item.selectedSize == selectedSize
        ){
            cart.splice(i, 1);
        }
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
}

const loadBag = (bag) => {
    loadCart();
    return
    const bagContainer = document.querySelector('#bag-container-products')
    const bagFooterContainer = document.querySelector('#bag-container-footer')

    bagContainer.querySelectorAll('article').forEach(item => {
        item.remove()
    })

    bagFooterContainer.querySelectorAll('payment').forEach(content => {
        content.remove()
    })

    

    if(bag.length == 0) {
        const html = `
            <article class="text-center mt-5 text-secondary">
                <i class="bi bi-info-circle fs-1"></i>
                <h3 class="">Seu carrinho está vazio</h3>
            </article>
        `
        bagContainer.insertAdjacentHTML('beforeend', html)
    }
    else {
        let bagTotalPrice = 0

        bag.forEach(item => {
            const html = `
                <article class="row g-2 mb-3 me-1">
                    <div class="col-3 me-2">
                        <img class="bag-product-image rounded me-3" src="${item.image}" alt="">
                    </div>
                    <div class="me-4 col">
                        <h6>${item.title}</h6>
                        <input class="bag-product-quantity form-control" type="number" name="bag-product-quantity" id="" min="0" max="${item.stock}" value="${item.quantity}">
                    </div>
                    <div class="col-2">
                        <p class="mb-0 bag-product-price">${item.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</p>
                        <span class="primary-text primary-text-hover cursor-pointer bag-trash-button" id="${item.id}" onclick="removeProductBag(bag, ${item.id})"><i class="bi bi-trash-fill fs-4"></i></span>
                    </div>
                </article>
            `
            bagTotalPrice += item.price
            bagContainer.insertAdjacentHTML('beforeend', html)
        });
        
        bagFooterContainer.innerHTML = `
            <payment class="row pt-3">
                <h5 class="col text-secondary">Total</h5>
                <h5 class="col text-end fw-bold">${bagTotalPrice.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</h5>
            </payment>
            <payment class="mt-4">
                <button class="btn btn-primary w-100" id="bag-button-finalizar-compra">Finalizar Compra</button>
            </payment>
        `
    }
}

const addProductBag = (bag, productId, productTitle, productPrice, productImage, productStock, productQuantity) => {
    let valid = bag.find(item => { return item.id === productId })

    if(valid != undefined && productQuantity < productStock) {
        bag.forEach(item => {
            if(item.id == productId) {
                item.quantity += 1
            }
        });
    }
    else bag.push({'id': productId, 'title': productTitle, 'price': productPrice, 'image': productImage, 'stock': productStock, 'quantity': productQuantity})
    
    loadBag(bag)
}

const removeProductBag = (bag, productId) => {
    if(bag.length != 0) {
        bag.forEach((item, index) => {
            if(item.id == productId) {
                bag.splice(index, 1)
            }
         })
    }

    loadBag(bag)
}

const ChangeQuantity = (id, input_id, itemId) =>{
    const input = document.getElementById(input_id);
    var cart = localStorage.getItem("cart");
    cart = JSON.parse(cart);

    for(i = 0; i < cart.length; i++){
        item = cart[i];
        if(item.itemId == itemId) {
            item.quantity = input.value;
        }
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
}

const searchProduct = (products, searchTerm) => products.filter(product => product.title.includes(`${searchTerm}`))


document.getElementById("login-button").addEventListener("click", () =>{
    login()
});
document.getElementById("cart-button-1").addEventListener("click", () =>{
    loadCart()
});

const login = async () => {
    const login = document.getElementById("login-email").value.toLowerCase();
    const password = document.getElementById("login-password").value;

    var data = new FormData();

    data.append("login", login);
    data.append("password", password);

    await axios({
        method: "post",
        url: "api/login/",
        data: data,
        headers: { "Content-Type": "multipart/alternative" },
    }).then(function (response) {
        console.log(response.data);
        if(response.data.msg == "Login concluido"){
            alert("Login Concluido")
            location.reload()
        }
    })
    .catch(function (error) {
        console.log(error);
    });
}

const registrar = async () => {
    const name = document.getElementById("signup-first-name").value;
    const surname = document.getElementById("signup-last-name").value;
    const login = document.getElementById("signup-email").value.toLowerCase();
    const password = document.getElementById("signup-password").value;
    const password2 = document.getElementById("signup-password2").value;
    const uf = document.getElementById("uf").value;

    if(password2 != password){
        alert("Senhas não coincidem");
        return;
    }

    if(!validateEmail(login)){
        alert("Email Invalido");
        return;
    }

    if(uf.length != 2){
        alert("Estado só pode ter 2 letras");
        return;
    }

    var data = new FormData(document.getElementById("signup-form"));

    data.append("name", name);
    data.append("surname", surname);
    data.append("email", login);
    data.append("password", password);

    await axios({
        method: "post",
        url: "api/registro/",
        data: data,
        headers: { "Content-Type": "multipart/alternative" },
    }).then(function (response) {
        console.log(response.data);
        if(response.data.msg == "Registro Concluido"){
            alert("Registro Concluido")
            location.reload()
        }
    })
    .catch(function (error) {
        console.log(error);
    });

}

const logout = async () => {
    await axios({
        method: "get",
        url: "api/logout/",
        headers: { "Content-Type": "multipart/alternative" },
    }).then(function (response) {
        location.reload()
    })
    .catch(function (error) {
        console.log(error);
    });

}

const verifyLogin = async () => {
    await axios({
        method: "post",
        url: `http://${window.location.hostname}/api/login/`,
        headers: { "Content-Type": "multipart/alternative" },
    }).then(function (response) {
        console.log(response);
        if(response.data.userName){
            connectedDiv = document.querySelector('#userDropdownConectedOptions')
            disconnectedDiv =  document.querySelector('#user')
        
            connectedDiv.classList.remove('hide')
            disconnectedDiv.classList.add('hide')

            connectedDiv.querySelector('#dropdownMenuLink').innerHTML = response.data.userName;
        }
    })
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function actionFeedback(div) {
    $(div).fadeIn(700, function(){
        setTimeout(function(){
            $(div).fadeOut();
        }, 2000);
    });
}

window.onload = () => {
    verifyLogin();
    loadCart();
}