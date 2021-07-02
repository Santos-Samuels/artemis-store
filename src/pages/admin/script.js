var _orders;
var current_id;

const ValidateColors = async () => {
    var data = new FormData(document.getElementById("new-product-form"));

    var colors = data.get("product-color");

    var coresData = new FormData();
    coresData.append("colors", colors);

    await axios({
        method: "post",
        data: coresData,
        url: `/api/tslt`,
        headers: { "Content-Type": "multipart/alternative" },
    }).then(function (response) {
        var cores = [... response.data];
        console.log(cores);

        for(i = 0; i < cores.length; i++){
            var color = cores[i];
            if(!isColor(color.toLowerCase())){
                alert(color + " não é uma cor !");
                return;
            }
        }

        createProduct(response.data)
    })
    .catch(function (error) {
        console.log(error);
    });
}

const createProduct = async (_colors) => {
    var data = new FormData(document.getElementById("new-product-form"));
    var p_name = document.getElementById("product-name").value;
    var colors = _colors.join(", ")

    data.append("color_en", colors.toLowerCase());
    data.append('folder_name', p_name.toLowerCase().split(" ").join("-"));


    await axios({
        method: "post",
        url: "api/produtos/",
        data: data,
        headers: { "Content-Type": "multipart/alternative" },
    }).then(function (response) {
        console.log(response.data);
        if(response.data.msg == "Funfou"){
            alert("Produto cadastrado com sucesso !");

            document.getElementById("new-product-form").reset();
        }
    })
    .catch(function (error) {
        console.log(error);
    });
}

const loadProducts = async () => {
    await axios({
        method: "get",
        url: "api/produtos/",
        headers: { "Content-Type": "multipart/alternative" },
    }).then(function (response) {
        console.log(response.data);
        _loadEditProducts(response.data.item);
    })
    .catch(function (error) {
        console.log(error);
    });
}

const _loadEditProducts = (products) => {
    const editContainer = document.querySelector('#edit-body-table')
    const editContainerHeaderScope = document.querySelector('#edit-header-scope-table')
    
    editContainer.querySelectorAll('tr').forEach(element => {
        element.remove()
    })

    editContainerHeaderScope.querySelectorAll('th').forEach(element => {
        element.remove()
    })

    if(products.length == 0) {
        const html = `
            <th class="text-center mt-5 text-secondary border-0">
                <i class="bi bi-info-circle fs-1"></i>
                <h3 class="">Nenhum produto cadastrado</h3>
            </th>
        `
        editContainerHeaderScope.insertAdjacentHTML('beforeend', html)
    }
    else {
        editContainerHeaderScope.innerHTML = `
            <th scope="col">ID</th>
            <th scope="col">Produto</th>
            <th scope="col">Tipo</th>
            <th scope="col">Valor</th>
            <th scope="col">Promoção</th>
            <th class="primary-text border-dark" scope="col">Ação</th>
        `

        products.forEach(product => {
            const html = `
                <tr>
                    <th scope="row">${product.id}</th>
                    <td>${product.product_name}</td>
                    <td>${product.type}</td>
                    <td class="order-price">${product.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                    <td>${product.promotion.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                    <td><i class="bi bi-pencil-fill me-2 primary-text-hover cursor-pointer" onclick="editProductModal(${product.id})" title="Editar" data-bs-toggle="modal" data-bs-target="#editProductModal"></i> <i class="bi bi-trash-fill primary-text-hover cursor-pointer" onclick="removeProduct(${product.id}), actionFeedback('#success-remove')" title="Excluir"></i></td>
                </tr>
            `
    
            editContainer.insertAdjacentHTML('beforeend', html)
        });
    }
}

const editProductModal = async (productsId) => {
    await axios({
        method: "get",
        url: `api/produtos?id=${productsId}`,
        headers: { "Content-Type": "multipart/alternative" },
    }).then(function (response) {
        createModal(response.data.item[0]);
    })
    .catch(function (error) {
        console.log(error);
    });//productId
  
}

const createModal = (product) => {
    const editContainer = document.querySelector('#edit-product-modal-container')

    editContainer.innerHTML = `
            <form class="m-3" action="">    
                <div class="row mt-2 g-2">
                    <div class="col-12 col-lg-6">
                        <label class="form-label" for="product-name">Nome do produto <span class="text-danger" title="Obrigatório">*</span></label>
                        <input class="form-control" type="text" name="product-name" id="product-name" placeholder="Ex: Pingente de Ouro Branco" value="${product.product_name}" required>
                    </div>
                    <div class="col-6 col-lg-3">
                    <label class="form-label" for="product-price">Preço <span class="text-danger" title="Obrigatório">*</span></label>
                    <input class="form-control" type="number" name="product-price" id="product-price" min="0" placeholder="Ex: 29.90" value="${product.price}" required> 
                    </div>
                    <div class="col-6 col-lg-3">
                    <label class="form-label" for="product-promo">Promoção <span class="primary-text"></span></label>
                    <input class="form-control" type="number" name="product-promo" id="product-promo" min="0" placeholder="Ex: 24.90" value="${product.promotion}" required> 
                    </div>
                </div>
    
                <div class="row mt-2 g-2">
                    <div class="col">
                        <label class="form-label" for="product-info">Descrição <span class="text-danger" title="Obrigatório">*</span></label>
                        <input class="form-control" type="text" name="product-info" id="product-info" placeholder="Especificações, Detalhes do produto..." value="${product.description}" required>
                    </div>
                    <div class="col-4 col-lg-3">
                    <label class="form-label" for="product-quantity">Quantidade <span class="text-danger" title="Obrigatório">*</span></label>
                    <input class="form-control" type="number" name="product-quantity" id="product-quantity"  min="0" placeholder="Ex: 3" value="${product.quantity}" required>
                    </div>
                    </div>
                    
                    <div class="row mt-2 g-2">
                    <div class="col-6 col-md-3 col-lg-3">
                    <label class="form-label" for="product-color">Cor <span class="text-danger" title="Obrigatório">*</span></label>
                    <input class="form-control" type="text" name="product-color" id="product-color" placeholder="Ex: Azul, Branco" value="${product.color}" required>
                    </div>
                    <div class="col-6 col-md-3 col-lg-3">
                    <label class="form-label" for="product-size">Tamanho <span class="text-danger" title="Obrigatório">*</span></label>
                    <input  class="form-control" type="text" name="product-size" id="product-size" placeholder="Ex: 23cm, 32cm" value="${product.size}" required>
                    </div>
                    <div class="col-6 col-md-3 col-lg-3">
                        <label class="form-label" for="product-type">Tipo <span class="text-danger" title="Obrigatório">*</span></label>
                        <select class="form-select" name="product-type" id="product-type" value=${product.type} required>
                        <option value="" data-default disabled selected></option>
                        <option value="Anel">Anel</option>
                        <option value="Colar">Colar</option>
                        <option value="Brinco">Brinco</option>
                        <option value="Pulseira">Pulseira</option>
                        <option value="Lingerie">Lingerie</option>
                        </select>
                    </div>
                    <div class="col-6 col-md-3 col-lg-3">
                        <label class="form-label" for="product-type">Categoria <span class="text-danger" title="Obrigatório">*</span></label>
                        <select class="form-select" name="product-category" id="product-category" value=${product.category}required>
                        <option value="" data-default disabled selected></option>
                        <option value="Joia">Jóia</option>
                        <option value="Semijoias">Semijóias</option>
                        <option value="Bijuterias">Bijuterias</option>
                        <option value="Lingerie">Lingerie</option>
                        </select>
                    </div>
                </div>
            </form>
        `;
    
    localStorage.setItem("EditingProduct", product.id);
}

const updateProduct = async () => {
    var productId = localStorage.getItem("EditingProduct");
    localStorage.removeItem("EditingProduct");

    const data = new FormData(document.getElementById("edit-product-modal-container"));
    data.set("productId", productId)
    var cores = data.get("product-color");

    if(data.get("product-type") == null){
        alert("Tipo está vazio");
        return
    }
    if(data.get("product-category") == null){
        alert("Categoria está vazio");
    }

    cores = cores.toLocaleLowerCase().replace(" ", "").split(",");
    if(! await validateColor(cores)){
        return;
    }

    await axios({
        method: "POST",
        url: `api/produtos/`,
        data: data,
        headers: { "Content-Type": "multipart/alternative" },
    }).then(function (response) {
        console.log(response.data);
        loadProducts();
    })
    .catch(function (error) {
        console.log(error);
    });

}

const removeProduct = async (productId) => {
    await axios({
        method: "DELETE",
        url: `api/produtos?productId=${productId}`,
        headers: { "Content-Type": "multipart/alternative" },
    }).then(function (response) {
        _loadEditProducts(response.data.item);
    })
    .catch(function (error) {
        console.log(error);
    });//

    loadProducts(products)

    $("#success-edit-remove").fadeIn(700, function(){
        setTimeout(function(){
            $('#success-edit-remove').fadeOut();
        }, 2000);
    });
}

const toggleDropDown = () => {
    const links = document.querySelectorAll('.dropdown-link')

    links.forEach(link => {
        link.classList.contains('hide') ? link.classList.remove('hide') : link.classList.add('hide')
    });
}

const setContainerOption = (optionContainer, linkId) => {
    const container = document.querySelector(optionContainer)
    const link = document.querySelector(linkId)
    const containers = document.querySelectorAll('.option-container')
    const optionLinks = document.querySelectorAll('.option-link')
    
    containers.forEach(container => {
        container.classList.add('hide')
    });
    
    optionLinks.forEach(container => {
        container.classList.remove('active')
    });
    
    if(container.classList.contains('hide') == true) {
        link.classList.add('active')
        container.classList.remove('hide')
    }

    toggleSidebar();
}

const toggleSidebar = () => {
    const sidebarContainer = document.querySelector('#sidebar-container')

    sidebarContainer.classList.contains('toggle-sidebar') ? sidebarContainer.classList.remove('toggle-sidebar') : sidebarContainer.classList.add('toggle-sidebar')
}

function isColor(strColor){
    var s = new Option().style;
    s.color = strColor;
    return s.color == strColor;
}

const loadSales = async () => {
    await axios({
        method: "get",
        url: "api/request/",
        headers: { "Content-Type": "multipart/alternative" },
    }).then(function (response) {
        console.log(response.data);
        loadSale(response.data.item);
    })
    .catch(function (error) {
        console.log(error);
    });
}



const loadSale = (orders) => {
    const salseContainer = document.querySelector('#sale-header-body')
    const saleContainerHeaderScope = document.querySelector('#sale-header-scope-table')
    
    salseContainer.querySelectorAll('tr').forEach(element => {
        element.remove()
    })

    saleContainerHeaderScope.querySelectorAll('th').forEach(element => {
        element.remove()
    })

    if(orders.length == 0) {
        const html = `
            <th class="text-center mt-5 text-secondary border-0">
                <i class="bi bi-info-circle fs-1"></i>
                <h3 class="">Nenhuma venda</h3>
            </th>
        `
        saleContainerHeaderScope.insertAdjacentHTML('beforeend', html)
    }
    else {

        saleContainerHeaderScope.innerHTML = `
            <th scope="col">Nº do Pedido</th>
            <th scope="col">Cliente</th>
            <th scope="col">Status</th>
            <th scope="col">Total</th>
            <th scope="col">Data da Compra</th>
            <th class="primary-text border-dark" scope="col">Ação</th>
        `
        orders.forEach(order => {
            var date = new Date(order.purchase_date);
            console.log(order);
            var dateNow = `${(date.getUTCDate() < 10) ? "0" + date.getUTCDate().toString() : date.getUTCDate().toString()}/${((date.getUTCMonth() + 1) < 10) ? "0" + (date.getUTCMonth() + 1).toString() : (date.getUTCMonth() + 1).toString()}/${date.getFullYear().toString()}`;
            order.purchase_date = dateNow;
            const html = `
                <tr>
                    <th scope="row">${order.id}</th>
                    <td>${titleize(order.name) + " " + titleize(order.surname)}</td>
                    <td>${order.status}</td>
                    <td class="order-price">${order.total_price}</td>
                    <td>${dateNow}</td>
                    <td><i class="bi bi-eye-fill me-2 primary-text-hover cursor-pointer" title="Ver mais" data-bs-toggle="modal" data-bs-target="#viewOrderModal" onclick="loadViewOrderModal(${order.id})"></i> <i class="bi bi-cart-check-fill primary-text-hover cursor-pointer" onclick="removeSale(${order.id}), actionFeedback('success-sale')" title="Concluir venda"></i></td>
                </tr>
            `
    
            salseContainer.insertAdjacentHTML('beforeend', html)
        })
        _orders = orders;
    }
    
}

const loadViewOrderModal = (orderID) => {
    const orders = _orders;
    const viewSaleContainer = document.querySelector('#view-order-container')
    
    viewSaleContainer.innerHTML = ""
    orders.forEach(order => {
        if(order.id == orderID) {
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

            viewSaleContainer.insertAdjacentHTML('beforeend', html)
        }
    })

    current_id = orderID;
}

const updateOrder = async () => {
    const status = document.getElementById("banner-select-3").value;
    console.log(current_id);

    if(status == 1){
        return;
    }

    var data = new FormData();

    data.append("request_id", current_id);
    data.append("status", status);

    await axios({
        method: "post",
        url: "api/request/",
        data: data,
        headers: { "Content-Type": "multipart/alternative" },
    }).then(function (response) {
        console.log(response.data);
        if(response.data.msg == "Funfou"){
            alert("Produto atualizado com sucesso !");
            loadSales();
        }
    })
    .catch(function (error) {
        console.log(error);
    });

    // if(isset($_POST["request_id"]) and isset($_POST["status"])){

}

const titleize = (text) => {
    var words = text.toLowerCase().split(" ");
    for (var a = 0; a < words.length; a++) {
        var w = words[a];
        words[a] = w[0].toUpperCase() + w.slice(1);
    }
    return words.join(" ");
}

const removeSale = (orders, orderID) => {
    if(orders.length != 0) {
        orders.forEach((order, index) => {
            if(order.id == orderID) {
                orders.splice(index, 1)
            }
         })
    }

    loadSale(orders)
}

function actionFeedback(div) {
    $(div).fadeIn(700, function(){
        setTimeout(function(){
            $(div).fadeOut();
        }, 2000);
    });
}