var _orders;
var current_id;

const add_new_product_form = document.getElementById('new-product-form')
add_new_product_form.addEventListener('submit', function(e) {
    e.preventDefault()
    
    ValidateColors()
});

const edit_product_form = document.getElementById("edit-product-modal-container");
edit_product_form.addEventListener('submit', function(e) {
    e.preventDefault()
    
    console.log("Funcionou");
    //updateProduct()
});

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
                actionFeedback('#error-new-product-color')
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
            actionFeedback('#success-new-product')

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

    console.log(products);

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
                    <input class="form-control" type="number" step="0.01" name="product-price" id="product-price" min="0" placeholder="Ex: 29.90" value="${product.price}" required> 
                    </div>
                    <div class="col-6 col-lg-3">
                    <label class="form-label" for="product-promo">Promoção <span class="primary-text"></span></label>
                    <input class="form-control" type="number" step="0.01" name="product-promo" id="product-promo" min="0" placeholder="Ex: 24.90" value="${product.promotion}" required> 
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
                        <div class="col-6">
                        <label class="form-label" for="product-color">Cor <span class="text-danger" title="Campo obrigatório">*</span></label>
                        <div class="row g-0">
                            <div class="col-12 d-flex align-items-center flex-nowrap">
                            <input class="form-control col" type="text" name="product-color" id="product-color-name" placeholder="Ex: Amarelo" required>
                            <input class="form-control product-color-input ms-2" type="color" id="product-color" value="#FFD700" required>
                            <i class="bi bi-plus-circle new-button ms-2 me-1" onclick="newColorField()" title="Adicionar campo"></i>
                            </div>
                        </div>
    
                        <div class="row" id="color-input-form-container">
                        </div>
                        </div>
    
                        <div class="col-6">
                        <label class="form-label" for="product-size">Tamanho (cm) <span class="text-danger" title="Campo obrigatório">*</span></label>
                        <div class="row g-0">
                            <div class="col-12 d-flex align-items-center flex-nowrap">
                            <input class="form-control col" type="text" name="product-size" id="product-size-name" min="0" placeholder="Ex: 23" required>
                            <i class="bi bi-plus-circle new-button ms-2 me-1" onclick="newSizeField()" title="Adicionar campo"></i>
                            </div>
                        </div>
                        
                        <div class="row" id="size-input-form-container">
                        </div>
                        </div>
                    </div>
    
                    <div class="row mt-2 g-2">
                    <div class="col-6">
                        <label class="form-label" for="product-type">Tipo <span class="text-danger" title="Campo obrigatório">*</span></label>
                        <select class="form-select" name="product-type" id="product-type" required>
                        <option value="" data-default disabled selected></option>
                        <option value="Anel">Anel</option>
                        <option value="Colar">Colar</option>
                        <option value="Brinco">Brinco</option>
                        <option value="Pulseira">Pulseira</option>
                        <option value="Calcinha">Lingerie</option>
                        </select>
                    </div>
                    <div class="col-6">
                        <label class="form-label" for="product-type">Categoria <span class="text-danger" title="Campo obrigatório">*</span></label>
                        <select class="form-select" name="product-category" id="product-category" required>
                        <option value="" data-default disabled selected></option>
                        <option value="Joia">Jóia</option>
                        <option value="Semijoia">Semijóias</option>
                        <option value="Bijuteria">Bijuterias</option>
                        <option value="Lingerie">Lingerie</option>
                        </select>
                    </div>
                    </div>
    
                <div class="row g-2 mt-3 justify-content-end">
                    <button class="btn btn-primary col-12 col-lg-3" type="submit">Cadastrar</button>
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
        actionFeedback('#error-void-field')
        return
    }
    if(data.get("product-category") == null){
        actionFeedback('#error-void-field')
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
        console.log(response)
        loadProducts();
    })
    .catch(function (error) {
        console.log(error);
    });//
}

const toggleDropDown = (linksClass) => {
    const links = document.querySelectorAll(linksClass)

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

const loadNewSales = async () => {
    await axios({
        method: "get",
        url: "api/request/",
        headers: { "Content-Type": "multipart/alternative" },
    }).then(function (response) {
        console.log(response.data);
        loadNewSale(response.data.item);
    })
    .catch(function (error) {
        console.log(error);
    });
}



const loadNewSale = (orders) => {
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
                <h3 class="">Nenhum venda nova</h3>
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
                    <td><i class="bi bi-eye-fill me-2 primary-text-hover cursor-pointer" title="Ver mais" data-bs-toggle="modal" data-bs-target="#viewOrderModal" onclick="loadViewOrderModal(${order.id})"></i> <i class="bi bi-cart-check-fill primary-text-hover cursor-pointer" onclick="removeSale(${order.id}), actionFeedback('#success-sale')" title="Concluir venda"></i></td>
                </tr>
            `
    
            salseContainer.insertAdjacentHTML('beforeend', html)
        })
        _orders = orders;
    }
    
}

const loadDoneSale = (disabledList) => {
    const doneSaleContainer = document.querySelector('#done-sale-header-body')
    const doneSaleContainerHeaderScope = document.querySelector('#done-sale-header-scope-table')
    
    doneSaleContainer.querySelectorAll('tr').forEach(element => {
        element.remove()
    })

    doneSaleContainerHeaderScope.querySelectorAll('th').forEach(element => {
        element.remove()
    })

    if(disabledList.length == 0) {
        const html = `
            <th class="text-center mt-5 text-secondary border-0">
                <i class="bi bi-info-circle fs-1"></i>
                <h3 class="">Nenhuma venda concluída</h3>
            </th>
        `
        doneSaleContainerHeaderScope.insertAdjacentHTML('beforeend', html)
    }
    else {

        doneSaleContainerHeaderScope.innerHTML = `
            <th scope="col">Nº do Pedido</th>
            <th scope="col">Cliente</th>
            <th scope="col">Status</th>
            <th scope="col">Total</th>
            <th scope="col">Data da Compra</th>
            <th class="primary-text border-dark" scope="col">Ação</th>
        `
        disabledList.forEach(order => {
            const html = `
                <tr>
                    <th scope="row">${order.id}</th>
                    <td>${titleize(order.title)}</td>
                    <td>${order.status}</td>
                    <td class="order-price">Null</td>
                    <td>${order.date}</td>
                    <td><i class="bi bi-eye-fill me-2 primary-text-hover cursor-pointer" title="Ver mais" data-bs-toggle="modal" data-bs-target="#viewOrderModal" onclick="loadViewOrderModal(${order.id})"></i></td>
                </tr>
            `
    
            doneSaleContainer.insertAdjacentHTML('beforeend', html)
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
            loadNewSales();
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

    loadNewSale(orders)
}

function actionFeedback(div) {
    $(div).fadeIn(700, function(){
        setTimeout(function(){
            $(div).fadeOut();
        }, 2000);
    });
}

var colorFieldIndex = 0;
var sizeFieldIndex = 0;

function newColorField() {
    colorFieldIndex++
    let colorDiv = document.querySelector('#color-input-form-container')

    const html  = `
        <article class="col-12 d-flex align-items-center flex-nowrap" id="color-field${colorFieldIndex}">
            <input class="form-control mt-2" type="text" name="product-color" id="product-color-name${colorFieldIndex}" placeholder="Ex: Amarelo" required>
            <input class="form-control product-color-input ms-2" type="color" id="product-color" value="#FFD700" required>
            <i class="bi bi-trash new-button ms-2 me-1 mt-1 pointer" onclick="removeField('#color-field${colorFieldIndex}')" title="Remover campo"></i>
        </article>
    `

    colorDiv.insertAdjacentHTML('beforeend', html)
}

function newSizeField() {
    sizeFieldIndex++
    let sizeDiv = document.querySelector('#size-input-form-container')

    const html  = `
        <article class="col-12 d-flex align-items-center flex-nowrap" id="size-field${sizeFieldIndex}">
            <input class="form-control mt-2" type="text" name="product-size" id="product-size-name${sizeFieldIndex}" placeholder="Ex: 23">
            <i class="bi bi-trash new-button ms-2 me-1 mt-1 pointer" onclick="removeField('#size-field${sizeFieldIndex}')" title="Remover campo"></i>
        </article>
    `

    sizeDiv.insertAdjacentHTML('beforeend', html)
}

function removeField(id) {
    document.querySelector(id).remove()
}

const loadDisabledProducts = (disabledList) => {
    const disabledContainer = document.querySelector('#disabled-body-table')
    const disabledContainerHeaderScope = document.querySelector('#disabled-header-scope-table')
    
    disabledContainer.querySelectorAll('tr').forEach(element => {
        element.remove()
    })

    disabledContainerHeaderScope.querySelectorAll('th').forEach(element => {
        element.remove()
    })


    if(disabledList.length == 0) {
        const html = `
            <th class="text-center mt-5 text-secondary border-0">
                <i class="bi bi-info-circle fs-1"></i>
                <h3 class="">Nenhum produto desativado</h3>
            </th>
        `
        disabledContainerHeaderScope.insertAdjacentHTML('beforeend', html)
    }
    else {
        disabledContainerHeaderScope.innerHTML = `
            <th scope="col">ID</th>
            <th scope="col">Produto</th>
            <th scope="col">Tipo</th>
            <th scope="col">Valor</th>
            <th scope="col">Promoção</th>
            <th class="primary-text border-dark" scope="col">Ação</th>
        `

        disabledList.forEach(product => {
            const html = `
                <tr>
                    <th scope="row">${product.id}</th>
                    <td>${product.title}</td>
                    <td>${product.type}</td>
                    <td class="order-price">${product.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                    <td>${product.promo.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                    <td><i class="bi bi-eye-fill me-2 primary-text-hover cursor-pointer" data-bs-toggle="modal" data-bs-target="#viewDisabledProductModal" onclick="loadViewDisabledProductModal(${product.id}, disabledList)" title="Ver mais"></i> <i class="bi bi-eye me-2 primary-text-hover cursor-pointer" onclick="actionFeedback('#success-actived')" title="Ativar"></i></i></td>
                </tr>
            `
    
            disabledContainer.insertAdjacentHTML('beforeend', html)
        });
    }
}


const loadViewDisabledProductModal = (productID, disabledList) => {
    const viewDisabledProductContainer = document.querySelector('#view-disabled-product-container')
    
    viewDisabledProductContainer.innerHTML = ""
    disabledList.forEach(item => {
        if(item.id == productID) {
            const html = `
                <div id="${item.type}-${item.id}">
                    <article class="d-flex ps-3 border-bottom pb-3 pt-3">
                        <div>
                            <img src="${item.image}" class="sale-image rounded me-3">
                        </div>
                        <div>
                            <h5 class="mb-0">${item.title}</h5>
                            <div>
                                <i class="bi bi-info-circle"></i>
                                <span class="me-1">${item.type.toUpperCase()} | </span>
                                <span>${item.category.toUpperCase()}</span>
                            </div>
                            <span>Estoque: ${item.stock}</span><br>
                            <span class="text-secondary text-decoration-line-through">${item.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span>
                            <span class="fw-bold text-secondary h4">${item.promo.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span>
                        </div>
                    </article>


                    <div class="row ms-2 mt-2">
                        <div class="col">
                            <h5>Cores</h5>
                            ${item.colorNameList.map((colorName, index) => {
                                return `
                                    <div class="mb-2">
                                        <span class="me-2 pe-2">${colorName.toUpperCase()}</span>
                                        <span class="rounded border" style="background-color: ${item.colorHexList[index]}; padding: 3px 12px;"></span> <br>
                                    </div>
                                `
                            })}
                        </div>

                        <div class="col">
                            <h5>Tamanhos</h5>
                            ${item.sizeList.map((size) => {
                                return `
                                    <div class="mb-2">
                                        <span class="me-1">${size}</span>
                                        <span> cm</span>
                                    </div>
                                `
                            })}
                        </div>
                    </div>

                    <div class="m-3 border-top pt-2">
                        <h5>Descrição</h5>
                        <p class="">${item.description}</p>
                    </div>
                </div>
            </div>
            `

            viewDisabledProductContainer.insertAdjacentHTML('beforeend', html)
        }
    })
}