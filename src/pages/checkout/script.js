const loadCheckout = () => {
    const bagContainer = document.querySelector('#checkout-bag-container')

    const myProductsContainer = document.querySelector('#checkout-summary-items-container')

    myProductsContainer.querySelectorAll('article').forEach(item => {
        item.remove()
    })

    bagContainer.querySelectorAll('article').forEach(item => {
        item.remove()
    })
    bagContainer.querySelectorAll('div').forEach(item => {
        item.remove()
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
    }
    else {
        let cartTotalPrice = 0;

        console.log(cart);
        
        for(i = 0; i < cart.length; i++){
            item = cart[i];
            var cores = item.product.color_pt.split(",");
            var tamanhos = item.product.size.split(",");
            const html = `
                <div class="row mt-8">
                    <div class="checkout-header-type-info mb-2"><span class="fw-bold">Produto</span></div>
                        <div class="col-12 col-lg-8 product d-flex flex-row flex-nowrap align-items-center mb-3">
                            <div class="me-4">
                                <img class="rounded" src="${item.product.product_images[0]}" alt="">
                            </div>

                            <div>
                                <h5 class="text-secondary">${item.product.product_name}</h5>
                                <div class="text-secondary">
                                    <div class="d-flex flex-row flex-nowrap">
                                    <div>
                                        <i class="bi bi-info-circle"></i>
                                        <span class="me-1">${item.selectedColor} | </span>
                                        <span>${item.selectedSize}</span>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-6 col-lg-2 product mb-3">
                            <div class="checkout-header-type-info mb-2"><span class="fw-bold">Quantidade</span></div>
                            <input onchange="ChangeQuantityCheckout (${item.product.id}, 'checkout-${item.itemId}' ,${item.itemId})" id="checkout-${item.itemId}" class="bag-product-quantity form-control" type="number" name="bag-product-quantity" id="" min="1" value="${item.quantity}">
                            <span class="link ps-2">remover</span>
                        </div>

                        <div class="col-6 col-lg-2 product mb-3">
                            <div class="checkout-header-type-info mb-2"><span class="fw-bold">Preço</span></div>
                            <h5 class="text-secondary">${(parseFloat(item.product.price) * parseInt(item.quantity)).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</h5>
                        </div>
                        </div>

            `

            myProductsContainer.innerHTML += `
                <article class="row">
                    <span class="col text-start">${item.quantity} produtos</span>
                    <span class="col text-end">${(parseFloat(item.product.price) * parseInt(item.quantity)).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span>
                </article>
            `

            cartTotalPrice += parseFloat(item.product.price) * parseInt(item.quantity);
            bagContainer.insertAdjacentHTML('beforeend', html)
        };
        
        document.getElementById("total-price").innerText = cartTotalPrice.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    }
}

const ChangeQuantityCheckout = (id, input_id, itemId) =>{
    const input = document.getElementById(input_id);
    console.log(id)
    console.log(input.value);
    var cart = localStorage.getItem("cart");
    cart = JSON.parse(cart);

    for(i = 0; i < cart.length; i++){
        item = cart[i];
        if(item.itemId == itemId) {
            item.quantity = input.value;
        }
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCheckout();
}

const createRequest = async () => {
    var data = new FormData();
    const date = new Date();
 
    var cart = JSON.parse(localStorage.getItem("cart"));

    var payment_type = document.getElementById("payment_type").value;
    var errorPaymentType = document.querySelector('#error-payment-type')
    if(payment_type == ""){
        errorPaymentType.innerHTML = "Selecione uma forma de pagamento!"
        return
    } 
    else
        errorPaymentType.innerHTML = ""

    var quantity_s = "", color_s = "", size_s = "", productId_s = "";
    var cartTotalPrice = 0;

    var dateNow = `${date.getFullYear().toString()}-${((date.getUTCMonth() + 1) < 10) ? "0" + (date.getUTCMonth() + 1).toString() : (date.getUTCMonth() + 1).toString()}-${(date.getUTCDate() < 10) ? "0" + date.getUTCDate().toString() : date.getUTCDate().toString()}`;
    
    for(i = 0; i < cart.length; i++){
        item = cart[i];

        quantity_s += `${item.quantity}, `;
        color_s += `${item.selectedColor}, `;
        size_s += `${item.selectedSize}, `;
        productId_s += `${item.product.id}, `;

        cartTotalPrice += parseFloat(item.quantity) * parseFloat(item.product.price);
    }

    quantity_s = quantity_s.slice(0, -2);
    color_s = color_s.slice(0, -2);
    size_s = size_s.slice(0, -2);
    productId_s = productId_s.slice(0, -2);
    /*
    $products_id = isset($_POST["products_id"]);
    $quantity = isset($_POST["quantity"]);
    $payment_type = isset($_POST["payment_type"]);
    $total_price = isset($_POST["total_price"]);
    $discounted_price = isset($_POST["discounted_price"]);
    $selected_color_pt = isset($_POST["selected_color_pt"]);
    $selected_size = isset($_POST["selected_size"]);
    $date = isset($_POST["date"]);
    */
   
    data.append("products_id", productId_s);
    data.append("quantity", quantity_s);
    data.append("payment_type", payment_type);
    data.append("total_price", cartTotalPrice);
    data.append("discounted_price", 0);
    data.append("selected_color_pt", color_s);
    data.append("selected_size", size_s);
    data.append("date", dateNow);

    await axios({
        method: "post",
        url: "api/request/",
        data: data,
        headers: { "Content-Type": "multipart/alternative" },
    }).then(function (response) {
        if(response.data.msg == "tudo certo"){
            alert("Pedido Concluido");
            var temp = [];
            localStorage.setItem("cart", JSON.stringify(temp));
            window.location.href = window.location.origin + "/compra-finalizada/?" + response.data.requestId;
        }else if(response.data.msg == "Você não está logado"){
            alert("Você não está logado !");
        }
    })
    .catch(function (error) {
        console.log(error);
    });
}

$( document ).ready(function() {
    loadCheckout();
});