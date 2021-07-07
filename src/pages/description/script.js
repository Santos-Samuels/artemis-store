var _product;

/*
document.getElementById("cartButton").addEventListener("click", () =>{
    toggleCart()
});
*/

document.getElementById("heartButton").addEventListener("click", () =>{
    toggleHeart()
});

var toggleCart = async () => {
    const cartIcon = document.getElementById("cartIcon");

    if(cartIcon.classList.contains("bi-bag")){
        cartIcon.classList.remove("bi-bag");
        cartIcon.classList.add("bi-bag-fill");
    }else if(cartIcon.classList.contains("bi-bag-fill")){
        cartIcon.classList.remove("bi-bag-fill");
        cartIcon.classList.add("bi-bag");
    }
}

var toggleHeart = async () => {
    const cartIcon = document.getElementById("heartIcon");

    if(cartIcon.classList.contains("bi-heart")){
        aux = toggleHeart;
        toggleHeart = JustWait;

        await addOnWishList().then((response) => {
            toggleHeart = aux;
        });

    }else if(cartIcon.classList.contains("bi-heart-fill")){
        aux = toggleHeart;
        toggleHeart = JustWait;

        await removeOfWishList().then((response) => {
            toggleHeart = aux;
        });

    }
}

const JustWait = () => {
    alert("Aguarde");
}

const addOnWishList = async () => {
    var id = window.location.search.replace("?", "");

    if(id == ""){
        return;
    }

    var data = new FormData();
    data.append("productId", id);

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

        if(response.data.msg == "Produto Adicionado na Wishlist"){
            const cartIcon = document.getElementById("heartIcon");
            cartIcon.classList.remove("bi-heart");
            cartIcon.classList.add("bi-heart-fill");
        }else{
            return false;
        }
    })
    .catch(function (error) {
        console.log(error);
    });

}

const removeOfWishList = async () => {
    var id = window.location.search.replace("?", "");

    if(id == ""){
        return;
    }

    var data = new FormData();
    data.append("deletedProductId", id);

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
            const cartIcon = document.getElementById("heartIcon");
            cartIcon.classList.remove("bi-heart-fill");
            cartIcon.classList.add("bi-heart");
        }else{
            return false;
        }
    })
    .catch(function (error) {
        console.log(error);
    });

}

const updateData = async () => {
    var id = window.location.search.replace("?", "");

    if(id == ""){
        window.location.href = "/404";
        return;
    }

    await axios({
        method: "get",
        url: `/api/produtos?id=${id}`,
        headers: { "Content-Type": "multipart/form-data" },
    }).then(function (response) {
        if(response.data.qtd == 0){
            window.location.href = "/404";
            return
        }

        if(response.data.wishListed){
            const cartIcon = document.getElementById("heartIcon");
            cartIcon.classList.remove("bi-heart");
            cartIcon.classList.add("bi-heart-fill");
        }

    _product = response.data.item[0];

        updatingData(response.data.item[0])
    })
    .catch(function (error) {
        console.log(error);
    });


}

const updatingData = async (product) => {
    document.getElementById("product-name").innerHTML = product.product_name;
    document.getElementById("price").innerHTML = "R$ " + product.price.replace(".", ",");
    document.getElementById("description").innerHTML = product.description;

    var active = false
    var i = 0


    if(product.product_images != ""){
        product.product_images.map((product_image) => {
            console.log(active)
            document.getElementById("indicators").innerHTML += `
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${i}" class="active" aria-current="true" aria-label="Slide ${i + 1}"></button>
            `
            
            document.getElementById("images").innerHTML += `<div class="carousel-item ${active == false ? "active" : ""}">
                <img src="${product_image}" class="d-block w-100 rounded" alt="...">
            </div>`
            active = true;
            i++;
        })
    }
    var contador = 0;
    product.size.replace(" ", "").split(",").map((tamanho) => {
        const container = document.getElementById("size-container");


        container.innerHTML += `<input class="hide" type="radio" value="${tamanho}" name="size-button" id="${tamanho}" ${(contador == 0) ? "checked" : ""} required>
        <label class="pruduct-button rounded-circle text-center border border-2 border-dark primary-text me-1 h6 zoom cursor-pointer" for="${tamanho}">${tamanho}</label>`;
        
        contador += 1;
    })

    
    var cores = product.color_en.split(", ").join(",");
    cores = product.color_en.split(" ,").join(",");
    cores = product.color_en.split(",");
    
    var cores_pt = product.color_pt.split(", ").join(",");
    cores_pt = product.color_pt.split(" ,").join(",");
    cores_pt = product.color_pt.split(",");
    
    contador = 0;

    for(i = 0; i < cores.length; i++){
        cor = cores[i];
        cor_pt = cores_pt[i];

        const container = document.getElementById("color-container");
                
        container.innerHTML += `<input class="hide" type="radio" value="${cor_pt}" name="color-button" id="${cor_pt}" ${(contador == 0) ? "checked" : ""}>
        <label class="pruduct-button rounded-circle text-center border border-2 border-dark primary-text me-1 zoom cursor-pointer" style="background-color: ${cor};" for="${cor_pt}"><i class="bi bi-check-lg"></i></label>`
        contador += 1;
    }
}

const BuyItem = () => {
    var colorRadio = document.getElementsByName("color-button");
    var sizeRadio = document.getElementsByName("size-button");
    var selectedColor;
    var selectedSize;

    for(i = 0; i < colorRadio.length; i++){
        if(colorRadio[i].checked){
            selectedColor = colorRadio[i].id;
        }
    }
    for(i = 0; i < sizeRadio.length; i++){
        if(sizeRadio[i].checked){
            selectedSize = sizeRadio[i].id;
        }
    }

    console.log(selectedColor, selectedSize);

    addOnCart(_product, 1, selectedColor, selectedSize);

    loadCart()
}


function isColor(strColor){
    var s = new Option().style;
    s.color = strColor;
    return s.color == strColor;
}


$( document ).ready(function() {
    updateData();
});
