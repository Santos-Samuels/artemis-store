const loadOrders = async () => {
    await axios({
        method: "get",
        url: "api/request?quant=all",
        headers: { "Content-Type": "multipart/alternative" },
    }).then(function (response) {
        console.log(response.data);
        _loadOrders(response.data.item);
    })
    .catch(function (error) {
        console.log(error);
    });

}

const _loadOrders = (orders) => {
    const productsContainer = document.querySelector('#order-container')

    
    if(orders.length == 0) {
        const html = `
            <div class="text-center mt-5 text-secondary border-0">
                <i class="bi bi-info-circle fs-1"></i>
                <h3 class="">Você ainda não fe pedidos</h3>
            </div>
        `

        productsContainer.insertAdjacentHTML('beforeend', html)
    }
    else {
        orders.forEach(order => {

            var oldDate = order.purchase_date.split("-");
            var newDate = "";
    
            for(i = oldDate.length; i > 0; i--){
                newDate += `${oldDate[i-1]}/`;
            }
    
            newDate = newDate.substring(0, newDate.length - 1);
            
    
            const html = `
                <div class="border mb-2 p-1 order-item-conteiner row">
                    <i class="bi bi-chevron-down fs-5 ms-1 col-4" data-bs-toggle="collapse" href="#${order.type}-${order.id}" role="button" aria-expanded="false" aria-controls="${order.type}-${order.id}">
                        <span>Detalhes do pedido</span>
                    </i>
    
                    <div class="col d-flex justify-content-between">
                        <div>
                            <h5>${""}</h5>
                        </div>
                        
                        <div class="ms-2 me-2">
                            <span>${newDate}</span>
                        </div>
                    </div>
                </div>
                <div class="collapse" id="${order.type}-${order.id}">
                    <div class="card card-body">
                    <div class="row">
                        <div class="col text-start">
                            <p class="fw-bold text-secondary ps-3">Número do pedido: ${order.id}</p>
                        </div>
                        <div class="col text-end">
                            <p class="fw-bold text-secondary ps-3">${newDate}</p>
                        </div>
                    </div>
                    
                    ${order.products.map((product) => {
                        return `
                        <article class="d-flex ps-3 border-bottom pb-3 pt-3">
                            <div>
                                <img src="${product.product_images[0]}" class="sale-image rounded me-3">
                            </div>
                            <div>
                                <h5>${product.product_name}</h5>
                                <span>${product.quantity} unidade | </span> <span class="fw-bold text-secondary">${product.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span><br>
    
                                <div>
                                    <i class="bi bi-info-circle me-1"></i>
                                    <span class="me-1 pe-2 border-end">${titleize(product.selected_color_pt)}</span>
                                    <span>${titleize(product.selected_size)}</span>
                                </div>
                            </div>
                        </article>
    
                        `;
                    })}
    
                    <div class="row text-center mt-4 border-bottom pb-4">
                        <div class="col">
                            <i class="bi bi-check-lg fs-4 primary-text"></i>
                            <p class="fs-5 fw-bold">Pedido recebido</p>
                        </div>
                        
                        <div class="col">
                            <i ${order.status == "Preparando o pedido" || order.status == "Pedido Entregue" ? 'class="bi bi-check-lg fs-4 primary-text"' : 'class="bi bi-clock fs-4 text-secondary"'}></i>
                            <p class="fs-5 fw-bold">Preparando pedido</p>
                        </div>
                        <div class="col">
                        <i ${order.status == "Pedido Entregue" ? 'class="bi bi-check-lg fs-4 primary-text"' : 'class="bi bi-clock fs-4 text-secondary"'}></i>
                            <p class="fs-5 fw-bold">Pedido entregue</p>
                        </div>
    
                        <div class="border-top pt-3">
                            <label for="sale-status" class="form-label fw-bold">Alterar o status: </label>
                            <select class="form-select" name="banner-select-3" id="banner-select-3">
                                <option value="1" data-default disabled selected>Pedido Feito</option>
                                <option value="2">Preparando Produto</option>
                                <option value="3">Pedido Entregue</option>
                            </select>
                        </div>
                    </div>
    
                    <div class="row mt-5 ps-3">
                        <div class="col-12 col-lg-4">
                            <p class="fs-6 fw-bold">Pagamento:</p>
                            <p class="fs-5">${order.payment_type == "1" ? '<i class="bi bi-cash-coin fs-4"></i>' : '<i class="bi bi-credit-card fs-4"></i>'} ${(order.payment_type == 1) ? "Dinheiro" : "Cartão"}</p>
                        </div>
    
                        <div class="col-12 col-lg-4">
                            <p class="fs-6 fw-bold">Valor total:</p>
                            <p class="mb-0 pb-2">subtotal: <span class="fw-bold ms-3 primary-text">${order.total_price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span> <br>
                            desconto: <span class="fw-bold ms-3 primary-text">${(order.discounted_price).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span></p>
                            <p class="fs-6 fw-bold mb-0 pb-3 primary-text">total: <span class="fw-bold ms-3">${(order.total_price - order.discounted_price).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span></p>
                        </div>
    
                        <div class="col-12 col-lg-4">
                            <p>Comprador: ${titleize(order.name) + " " + titleize(order.surname)}</p>
                            <p class="fs-6 fw-bold">Endereço:</p>
                            <p>${order.adress} - ${order.number} - ${order.district} <br>
                            ${order.reference_point} <br> ${order.city} - ${order.uf}</p>
                            <p><i class="bi bi-whatsapp"></i> ${order.whatsapp}</p>
    
                        </div>
                    </div>
                </div>
            </div>
    
            `
    
            productsContainer.insertAdjacentHTML('beforeend', html)
        });
    }
}

const titleize = (text) => {
    var words = text.toLowerCase().split(" ");
    for (var a = 0; a < words.length; a++) {
        var w = words[a];
        words[a] = w[0].toUpperCase() + w.slice(1);
    }
    return words.join(" ");
}

window.onload = loadOrders()


/*
        const html = `
                <div id="${order.type}-${order.id}">
                    <div class="card card-body">
                        <div class="row">
                            <div class="col text-start">
                                <p class="fw-bold text-secondary ps-3">Número do pedido: ${order.id}</p>
                            </div>
                            <div class="col text-end">
                                <p class="fw-bold text-secondary ps-3">${order.purchase_date}</p>
                            </div>
                        </div>
                        
                        ${order.products.map((product) => {
                            return `
                            <article class="d-flex ps-3 border-bottom pb-3 pt-3">
                                <div>
                                    <img src="${product.product_images[0]}" class="sale-image rounded me-3">
                                </div>
                                <div>
                                    <h5>${product.product_name}</h5>
                                    <span>${product.quantity} unidade | </span> <span class="fw-bold text-secondary">${product.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span><br>

                                    <div>
                                        <i class="bi bi-info-circle me-1"></i>
                                        <span class="me-1 pe-2 border-end">${titleize(product.selected_color_pt)}</span>
                                        <span>${titleize(product.selected_size)}</span>
                                    </div>
                                </div>
                            </article>

                            `;
                        })}

                        <div class="row text-center mt-4 border-bottom pb-4">
                            <div class="col">
                                <i class="bi bi-check-lg fs-4 primary-text"></i>
                                <p class="fs-5 fw-bold">Pedido recebido</p>
                            </div>
                            
                            <div class="col">
                                <i ${order.status == "Preparando o pedido" || order.status == "Pedido Entregue" ? 'class="bi bi-check-lg fs-4 primary-text"' : 'class="bi bi-clock fs-4 text-secondary"'}></i>
                                <p class="fs-5 fw-bold">Preparando pedido</p>
                            </div>
                            <div class="col">
                            <i ${order.status == "Pedido Entregue" ? 'class="bi bi-check-lg fs-4 primary-text"' : 'class="bi bi-clock fs-4 text-secondary"'}></i>
                                <p class="fs-5 fw-bold">Pedido entregue</p>
                            </div>

                            <div class="border-top pt-3">
                                <label for="sale-status" class="form-label fw-bold">Alterar o status: </label>
                                <select class="form-select" name="banner-select-3" id="banner-select-3">
                                    <option value="1" data-default disabled selected>Pedido Feito</option>
                                    <option value="2">Preparando Produto</option>
                                    <option value="3">Pedido Entregue</option>
                                </select>
                            </div>
                        </div>

                        <div class="row mt-5 ps-3">
                            <div class="col-12 col-lg-4">
                                <p class="fs-6 fw-bold">Pagamento:</p>
                                <p class="fs-5">${order.payment_type == "1" ? '<i class="bi bi-cash-coin fs-4"></i>' : '<i class="bi bi-credit-card fs-4"></i>'} ${(order.payment_type == 1) ? "Dinheiro" : "Cartão"}</p>
                            </div>

                            <div class="col-12 col-lg-4">
                                <p class="fs-6 fw-bold">Valor total:</p>
                                <p class="mb-0 pb-2">subtotal: <span class="fw-bold ms-3 primary-text">${order.total_price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span> <br>
                                desconto: <span class="fw-bold ms-3 primary-text">${(order.discounted_price).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span></p>
                                <p class="fs-6 fw-bold mb-0 pb-3 primary-text">total: <span class="fw-bold ms-3">${(order.total_price - order.discounted_price).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span></p>
                            </div>

                            <div class="col-12 col-lg-4">
                                <p>Comprador: ${titleize(order.name) + " " + titleize(order.surname)}</p>
                                <p class="fs-6 fw-bold">Endereço:</p>
                                <p>${order.adress} - ${order.number} - ${order.district} <br>
                                ${order.reference_point} <br> ${order.city} - ${order.uf}</p>
                                <p><i class="bi bi-whatsapp"></i> ${order.whatsapp}</p>

                            </div>
                        </div>
                    </div>
                </div>
            `


*/