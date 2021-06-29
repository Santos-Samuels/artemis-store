document.getElementById("cartButton").addEventListener("click", () =>{
    toggleCart()
});

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

        await addOnWishList();

        toggleHeart = aux;
    }else if(cartIcon.classList.contains("bi-heart-fill")){
        aux = toggleHeart;
        toggleHeart = JustWait;

        await removeOfWishList().then((response) => {
            if(response){
                
            }
        });

        toggleHeart = aux;
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
        console.log(response.data)
        if(response.data.qtd == 0){
            window.location.href = "/404";
            return
        }

        if(response.data.wishListed){
            const cartIcon = document.getElementById("heartIcon");
            cartIcon.classList.remove("bi-heart");
            cartIcon.classList.add("bi-heart-fill");
        }

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
    return;
    var cores = product.color.split(",");
    await validateColor(cores)
    
    product.size.replace(" ", "").split(",").map((tamanho) => {
        const container = document.getElementById("size-container");

        container.innerHTML += `<input class="hide" type="radio" name="size-button" id="${tamanho}" required>
        <label class="pruduct-button rounded-circle text-center border border-2 border-dark primary-text me-1 h6 zoom cursor-pointer" for="${tamanho}">${tamanho}</label>`;
    })

}

const validateColor = async (colors) => {
    colors.map( async (cor) =>{
        await axios({
            method: "get",
            url: `/api/tslt?text=${cor}`,
            headers: { "Content-Type": "multipart/alternative" },
        }).then(function (response) {
            t_color = response.data.texto_traduzido.replace(" ", "").toLocaleLowerCase()
            if(!isColor(t_color)){
                return false
            }
            const container = document.getElementById("color-container");
            
            container.innerHTML += `<input class="hide" type="radio" name="color-button" id="${t_color}">
            <label class="pruduct-button rounded-circle text-center border border-2 border-dark primary-text me-1 zoom cursor-pointer" style="background-color: ${t_color};" for="${t_color}"><i class="bi bi-check-lg"></i></label>`
        
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    )
    return true;
}

function isColor(strColor){
    var s = new Option().style;
    s.color = strColor;
    return s.color == strColor;
}



window.onload = updateData();