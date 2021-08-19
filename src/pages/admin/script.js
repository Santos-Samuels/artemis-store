var _orders;
var current_id;

const checkAdminLogin = async () => {
    await axios({
        method: "get",
        url: `api/admin/`,
        headers: { "Content-Type": "multipart/alternative" },
    }).then(function (response) {
        console.log(response);
        if(response.data.msg == "Token não é valido"){
            window.location = "/admin-login";
            console.log("Funfou")
        }
        console.log("Funfou2")
    })
}

const updatePanel = async () => {
    const newSales = document.getElementById("newSales")
    const finishedSales = document.getElementById("finishedSales")
    const activeProducts = document.getElementById("activeProducts")
    const promoProducts = document.getElementById("promoProducts")
    const disabledProducts = document.getElementById("disabledProducts")

    await axios({
        method: "get",
        url: "api/admin?panel=y",
        headers: { "Content-Type": "multipart/alternative" },
    }).then(function (response) {
        console.log(response.data);
        if(response.data.newSales >= 0){
            const panel = response.data;
            newSales.innerText = panel.newSales;
            finishedSales.innerText = panel.finishedSales;
            activeProducts.innerText = panel.activeProducts;
            promoProducts.innerText = panel.promoProducts;
            disabledProducts.innerText = panel.disabledProducts;
        }
    })
    .catch(function (error) {
        console.log(error);
    });

}

const add_new_product_form = document.getElementById('new-product-form')
add_new_product_form.addEventListener('submit', function(e) {
    e.preventDefault()
    
    ValidateColors()
});

const edit_product_form = document.getElementById("edit-product-modal-container");
edit_product_form.addEventListener('submit', function(e) {
    e.preventDefault()
    
    console.log("Funcionou");
    updateProduct()
});

const ValidateColors = async () => {
    var colors = [];
    var sizes = [];

    var color_pt = "";
    var color_hex = "";
    var size_str = "";

    const colors_container = document.querySelector('#colors-container');
    colors_container.querySelectorAll('article').forEach((art) => {
        let color = {};
        const inputs = art.querySelectorAll('input');
        color.name = inputs[0].value;
        color.hex = inputs[1].value;

        colors.push(color);
    })

    const sizes_container = document.querySelector('#sizes-container');
    sizes_container.querySelectorAll('article').forEach((art) => {
        let size = {};
        const inputs = art.querySelectorAll('input');
        size.size = inputs[0].value;
        sizes.push(size);
    })

    for(i = 0; i < colors.length; i ++){
        color_pt += colors[i].name + ",";
        color_hex += colors[i].hex + ",";
    }

    for(i = 0; i < sizes.length; i ++){
        size_str += sizes[i].size + ",";
    }

    color_pt = color_pt.substring(0, color_pt.length - 1);
    color_hex = color_hex.substring(0, color_hex.length - 1);
    size_str = size_str.substring(0, size_str.length - 1);

    console.log(color_pt);
    console.log(color_hex);
    console.log(size_str);

    createProduct(color_pt, color_hex, size_str);
}

const ValidateColors2 = async () => {
    var colors = [];
    var sizes = [];

    var color_pt = "";
    var color_hex = "";
    var size_str = "";

    const colors_container = document.querySelector('#color-input-form-container');
    colors_container.querySelectorAll('article').forEach((art) => {
        let color = {};
        const inputs = art.querySelectorAll('input');
        color.name = inputs[0].value;
        color.hex = inputs[1].value;

        colors.push(color);
    })

    const sizes_container = document.querySelector('#size-input-form-container');
    sizes_container.querySelectorAll('article').forEach((art) => {
        let size = {};
        const inputs = art.querySelectorAll('input');
        size.size = inputs[0].value;
        sizes.push(size);
    })

    for(i = 0; i < colors.length; i ++){
        color_pt += colors[i].name + ",";
        color_hex += colors[i].hex + ",";
    }

    for(i = 0; i < sizes.length; i ++){
        size_str += sizes[i].size + ",";
    }

    color_pt = color_pt.substring(0, color_pt.length - 1);
    color_hex = color_hex.substring(0, color_hex.length - 1);
    size_str = size_str.substring(0, size_str.length - 1);

    updateProduct(color_pt, color_hex, size_str);
}

const createProduct = async (color_pt, color_hex, size_str) => {
    var data = new FormData(document.getElementById("new-product-form"));
    var p_name = document.getElementById("product-name").value;

    data.append("color_en", color_hex);
    data.append("color_pt", color_pt);
    data.append("size", size_str);

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
    const animationDiv = document.querySelector('#edit-product-load-animation')
    
    editContainer.innerHTML = ""
    editContainerHeaderScope.innerHTML = ""
    animationDiv.innerHTML = ""

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
                    <td><i class="bi bi-pencil-fill me-1 primary-text-hover cursor-pointer" onclick="editProductModal(${product.id})" title="Editar" data-bs-toggle="modal" data-bs-target="#editProductModal"></i> <i class="bi bi-eye-slash-fill me-1 primary-text-hover cursor-pointer" onclick="disableProduct(${product.id}), actionFeedback('#success-disabled-product')" title="Desativar"></i></td>
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
    count = 0;
    count2 = 0;
    sizeCount = 0;
    var color_pt = product.color_pt.split(",")

    editContainer.innerHTML = ""
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
                        <div class="d-flex  justify-content-between flex-nowrap">
                            <label class="form-label" for="product-color">Cor <span class="text-danger" title="Campo obrigatório">*</span></label>
                            <i class="bi bi-plus-circle new-button me-2" onclick="newColorField()" title="Adicionar campo" style="cursor: pointer;"> Novo</i>
                        </div>
    
                        <div class="row" id="color-input-form-container">
                            ${product.color_en.split(",").map((color) => {return `
                                <article class="col-12 d-flex align-items-center flex-nowrap" id="color-field${++count}">
                                    <input class="form-control mt-2" type="text" name="product-color" id="product-color-name${count}" placeholder="Ex: Amarelo" value="${color_pt[count2++]}" required>
                                    <input class="form-control product-color-input ms-2" type="color" id="product-color-${count}" value="${color}" required>
                                    <i class="bi bi-trash new-button ms-2 me-1 mt-1" onclick="removeField('#color-field${count}')" title="Remover campo" style="cursor: pointer;"></i>
                                </article>`}).join('')}
                        </div>
                        </div>
    
                        <div class="col-6">
                        <div class="d-flex  justify-content-between flex-nowrap">
                            <label class="form-label" for="product-size">Tamanho (cm) <span class="text-danger" title="Campo obrigatório">*</span></label>
                            <i class="bi bi-plus-circle new-button me-2" onclick="newSizeField()" title="Adicionar campo" style="cursor: pointer;"> Novo</i>
                        </div>
                        
                        <div class="row" id="size-input-form-container">
                            ${product.size.split(",").map((size) => {
                                return `                        
                                    <article class="col-12 d-flex align-items-center flex-nowrap" id="size-field${sizeCount}">
                                        <input class="form-control mt-2" type="text" name="product-size" id="product-size-name${sizeCount}" placeholder="Ex: 23" value="${size}">
                                        <i class="bi bi-trash new-button ms-2 me-1 mt-1 pointer" onclick="removeField('#size-field${sizeCount++}')" title="Remover campo" style="cursor: pointer;"></i>
                                    </article>
                                `}).join('')}
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
                        <option value="Tiara">Tiara</option>
                        <option value="Pingente">Pingente</option>
                        </select>
                    </div>
                    <div class="col-6">
                        <label class="form-label" for="product-type">Categoria <span class="text-danger" title="Campo obrigatório">*</span></label>
                        <select class="form-select" name="product-category" id="product-category" required>
                        <option value="" data-default disabled selected></option>
                        <option value="Joia">Jóia</option>
                        <option value="Semijoia">Semijóias</option>
                        <option value="Bijuteria">Bijuterias</option>
                        
                        </select>
                    </div>
                    </div>
            </form>
        `;
    
    localStorage.setItem("EditingProduct", product.id);
}

const updateProduct = async (color_pt, color_hex, size_str) => {
    const data = new FormData(document.getElementById("edit-product-modal-container"));
    var id = localStorage.getItem("EditingProduct")
    data.set("productId", id)

    if(data.get("product-type") == null){
        actionFeedback('#error-void-field')
        return
    }
    if(data.get("product-category") == null){
        actionFeedback('#error-void-field')
        return
    }

    data.append("color_en", color_hex);
    data.append("color_pt", color_pt);
    data.append("size", size_str);

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

const disableProduct = async (productId) => {
    var data = new FormData();

    data.set("productId", productId);
    data.set("methodType", "delete");

    await axios({
        method: "POST",
        data,
        url: `api/produtos/`,
        headers: { "Content-Type": "multipart/alternative" },
    }).then(function (response) {
        console.log(response.data);
        loadProducts();
    })
    .catch(function (error) {
        console.log(error);
    });//
}

const deleteProduct = async (productId) => {
    return
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

    if(sidebarContainer.classList.contains('toggle-sidebar')) {
        sidebarContainer.classList.remove('toggle-sidebar')
        document.body.style.overflowX = "hidden"
    }
    else if(!sidebarContainer.classList.contains('toggle-sidebar')) {
        sidebarContainer.classList.add('toggle-sidebar')
        document.body.style.overflowX = "initial"
    }

    // sidebarContainer.classList.contains('toggle-sidebar') ? sidebarContainer.classList.remove('toggle-sidebar') : sidebarContainer.classList.add('toggle-sidebar')
    // sidebarContainer.classList.contains('toggle-sidebar') ? document.body.style.overflowX = "initial" : document.body.style.overflowX = "hidden"
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
        _loadNewSale(response.data.item);
    })
    .catch(function (error) {
        console.log(error);
    });
}

const _loadNewSale = (orders) => {
    const saleContainer = document.querySelector('#sale-header-body')
    const saleContainerHeaderScope = document.querySelector('#sale-header-scope-table')
    const animationDiv = document.querySelector('#new-sale-load-animation')
    

    saleContainerHeaderScope.innerHTML = ""
    saleContainer.innerHTML = ""
    animationDiv.innerHTML = ""

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
    
            saleContainer.insertAdjacentHTML('beforeend', html)
        })
        _orders = orders;
    }
    
}

const loadCompletedSales = async () => {
    await axios({
        method: "get",
        url: "api/request?completed=yes",
        headers: { "Content-Type": "multipart/alternative" },
    }).then(function (response) {
        console.log(response.data);
        _loadCompletedSales(response.data.item);
    })
    .catch(function (error) {
        console.log(error);
    });
}

const _loadCompletedSales = (orders) => {
    console.table(orders)
    const doneSaleContainer = document.querySelector('#done-sale-header-body')
    const doneSaleContainerHeaderScope = document.querySelector('#done-sale-header-scope-table')
    const animationDiv = document.querySelector('#done-sale-load-animation')
    
    doneSaleContainer.innerHTML = ""
    doneSaleContainerHeaderScope.innerHTML = ""
    animationDiv.innerHTML = ""

    if(orders.length == 0) {
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
        orders.forEach(order => {
            const html = `
                <tr>
                    <th scope="row">${order.id}</th>
                    <td>${titleize(order.name + " " + order.surname)}</td>
                    <td>${order.status}</td>
                    <td class="order-price">${order.total_price}</td>
                    <td>${order.purchase_date}</td>
                    <td><i class="bi bi-eye-fill me-2 primary-text-hover cursor-pointer" title="Ver mais" data-bs-toggle="modal" data-bs-target="#ViewDoneOrderModal" onclick="loadViewDoneOrderModal(${order.id})"></i></td>
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
                                ${order.reference_point} <br> ${order.city} - ${order.uf} <br>
                                CEP: ${order.cep}</p>
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

const loadViewDoneOrderModal = (orderID) => {
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
                        }).join('')}

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
                                ${order.reference_point} <br> ${order.city} - ${order.uf} <br>
                                CEP: ${order.cep}</p>
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
            actionFeedback('#success-updated-product')
            loadNewSales();
            loadCompletedSales();
        }
    })
    .catch(function (error) {
        console.log(error);
    });

    // if(isset($_POST["request_id"]) and isset($_POST["status"])){

}

const titleize = (text) => {
    var words = text.toLowerCase().trimEnd().split(" ");
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

var colorFieldIndex = 1;
var sizeFieldIndex = 1;

function newColorField() {
    colorFieldIndex++
    let colorDiv = document.querySelector('#color-input-form-container')

    const html  = `
        <article class="col-12 d-flex align-items-center flex-nowrap" id="color-field-${colorFieldIndex}">
            <input class="form-control mt-2" type="text" name="product-color" id="product-color-name-${colorFieldIndex}" placeholder="Ex: Amarelo" required>
            <input class="form-control product-color-input ms-2" type="color" id="product-color-${colorFieldIndex}" value="#FFD700" required>
            <i class="bi bi-trash new-button ms-2 me-1 mt-1 pointer" onclick="removeField('#color-field-${colorFieldIndex}')" title="Remover campo" style="cursor: pointer;"></i>
        </article>
    `
    colorDiv.insertAdjacentHTML('beforeend', html)
}

function newSizeField() {
    sizeFieldIndex++
    let sizeDiv = document.querySelector('#size-input-form-container')

    const html  = `
        <article class="col-12 d-flex align-items-center flex-nowrap" id="size-field-${sizeFieldIndex}">
            <input class="form-control mt-2" type="text" name="product-size" id="product-size-name-${sizeFieldIndex}" placeholder="Ex: 23">
            <i class="bi bi-trash new-button ms-2 me-1 mt-1 pointer" onclick="removeField('#size-field-${sizeFieldIndex}')" title="Remover campo" style="cursor: pointer;"></i>
        </article>
    `

    sizeDiv.insertAdjacentHTML('beforeend', html)
}

function removeField(id) {
    document.querySelector(id).remove()
}

const loadDisabledProducts = async () => {
    await axios({
        method: "get",
        url: "api/produtos?type=disabled",
        headers: { "Content-Type": "multipart/alternative" },
    }).then(function (response) {
        console.log(response.data);
        _loadDisabledProducts(response.data.item);
    })
    .catch(function (error) {
        console.log(error);
    });
}

const _loadDisabledProducts = (disabledList) => {
    const disabledContainer = document.querySelector('#disabled-body-table')
    const disabledContainerHeaderScope = document.querySelector('#disabled-header-scope-table')
    const animationDiv = document.querySelector('#disabled-product-load-animation')
    
    disabledContainer.innerHTML = ""
    disabledContainerHeaderScope.innerHTML = ""
    animationDiv.innerHTML = ""


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
                    <td>${product.product_name}</td>
                    <td>${product.type}</td>
                    <td class="order-price">${product.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                    <td>${product.promotion.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                    <td><i class="bi bi-eye-fill me-2 primary-text-hover cursor-pointer" data-bs-toggle="modal" data-bs-target="#viewDisabledProductModal" onclick="loadViewDisabledProductModal(${product.id})" title="Ver mais"></i> <i class="bi bi-eye me-2 primary-text-hover cursor-pointer" onclick="activateProduct(${product.id}),actionFeedback('#success-actived')" title="Ativar"></i></i></td>
                </tr>
            `
    
            disabledContainer.insertAdjacentHTML('beforeend', html)
        });
    }
}

const activateProduct = async (productId) =>{
    var data = new FormData();

    data.set("productId", productId);
    data.set("methodType", "update");

    await axios({
        method: "POST",
        data,
        url: `api/produtos/`,
        headers: { "Content-Type": "multipart/alternative" },
    }).then(function (response) {
        console.log(response.data);
        loadDisabledProducts();
    })
    .catch(function (error) {
        console.log(error);
    });
}

const loadViewDisabledProductModal = async (productId) =>{
    await axios({
        method: "get",
        url: `api/produtos?id=${productId}`,
        headers: { "Content-Type": "multipart/alternative" },
    }).then(function (response) {
        _loadViewDisabledProductModal(response.data.item[0]);
    })
    .catch(function (error) {
        console.log(error);
    });//productId
}

const _loadViewDisabledProductModal = (item) => {
    const viewDisabledProductContainer = document.querySelector('#view-disabled-product-container')
    
    viewDisabledProductContainer.innerHTML = ""
    var color_pt = item.color_pt.split(",");
    const html = `
        <div id="${item.type}-${item.id}">
            <article class="d-flex ps-3 border-bottom pb-3 pt-3">
                <div>
                    <img src="${item.product_images[0]}" class="sale-image rounded me-3">
                </div>
                <div>
                    <h5 class="mb-0">${item.product_name}</h5>
                    <div>
                        <i class="bi bi-info-circle"></i>
                        <span class="me-1">${item.type.toUpperCase()} | </span>
                        <span>${item.category.toUpperCase()}</span>
                    </div>
                    <span>Estoque: ${item.quantity}</span><br>
                    ${item.promotion == 0.00 ? `<span class="fw-bold text-secondary h4">${item.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span>` : `<span class="text-secondary text-decoration-line-through">${item.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span> <span class="fw-bold text-secondary h4">${item.promotion.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span>`}
                </div>
            </article>


            <div class="row ms-2 mt-2">
                <div class="col">
                    <h5>Cores</h5>
                    ${item.color_en.split(",").map((colorName, index) => {
                        return `
                            <div class="mb-2">
                                <span class="rounded border" style="background-color: ${colorName}; padding: 3px 12px;"></span>
                                <span class="ms-2 ps-2">${color_pt[index].toUpperCase()}</span> <br>
                            </div>
                        `
                    }).join('')}
                </div>

                <div class="col">
                    <h5>Tamanhos</h5>
                    ${item.size.split(",").map((size) => {
                        return `
                            <div class="mb-2">
                                <span class="me-1">${size}</span>
                                <span> cm</span>
                            </div>
                        `
                    }).join('')}
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

const updateBanners = async () => {
    await axios({
        method: "get",
        url: "api/produtos/",
        headers: { "Content-Type": "multipart/alternative" },
    }).then(function (response) {
        console.log(response.data);
        updateBanners2(response.data.item);
    })
    .catch(function (error) {
        console.log(error);
    });
}

const updateBanners2 = async (products) =>{
    await axios({
        method: "get",
        url: "api/banners/",
        headers: { "Content-Type": "multipart/alternative" },
    }).then(function (response) {
        console.log(response.data);
        loadBanners(response.data.item, products);
    })
    .catch(function (error) {
        console.log(error);
    });
}

const _updateBanners = (p) => {
    const bannerSelect1 = document.getElementById("banner-select-1");
    const bannerSelect2 = document.getElementById("banner-select-2");
    const bannerSelect3 = document.getElementById("banner-select-3");
    const bannerSelect4 = document.getElementById("banner-select-4");

    bannerSelect1.innerHTML = `${p.map((_p) => { return `<option value="${_p.id}">${_p.product_name}</option>` }).join("")}`
    bannerSelect2.innerHTML = `${p.map((_p) => { return `<option value="${_p.id}">${_p.product_name}</option>` }).join("")}`
    bannerSelect3.innerHTML = `${p.map((_p) => { return `<option value="${_p.id}">${_p.product_name}</option>` }).join("")}`
    bannerSelect4.innerHTML = `${p.map((_p) => { return `<option value="${_p.id}">${_p.product_name}</option>` }).join("")}`

    console.log("Funfou")                  //<option value="">Produto 1</option>
}


const loadBanners = (banners, products) => {
    const currentBannersContainer = document.getElementById("current-banners-container");
    const animationDiv = document.querySelector('#banners-load-animation')
    const bannerSelect1 = document.getElementById("banner-select-1");
    const bannerSelect2 = document.getElementById("banner-select-2");
    const bannerSelect3 = document.getElementById("banner-select-3");
    const bannerSelect4 = document.getElementById("banner-select-4");

    currentBannersContainer.innerHTML = ""
    animationDiv.innerHTML = ""

    banners.forEach((banner, index) => {
        const html = `
        <article class="col-6 col-lg-3 offer-container">
        <div class="position-absolute pt-1">
            <span class="fw-bold banner-index rounded">${index + 1}</span>
        </div>
        <img class="w-100 h-100 rounded" src="${banner.product_images[0]}" alt="${banner.product_name}">
        </article>
        `
        currentBannersContainer.insertAdjacentHTML('beforeend', html)
    });

    console.log(products);

    bannerSelect1.innerHTML = `${products.map((product) => { return currentBanners[0].title == product.title ? `<option value="${product.id}" data-default disabled selected>${product.product_name}</option>` : `<option value="${product.id}">${product.product_name}</option>` }).join("")}`
    bannerSelect2.innerHTML = `${products.map((product) => { return currentBanners[1].title == product.title ? `<option value="${product.id}" data-default disabled selected>${product.product_name}</option>` : `<option value="${product.id}">${product.product_name}</option>` }).join("")}`
    bannerSelect3.innerHTML = `${products.map((product) => { return currentBanners[2].title == product.title ? `<option value="${product.id}" data-default disabled selected>${product.product_name}</option>` : `<option value="${product.id}">${product.product_name}</option>` }).join("")}`
    bannerSelect4.innerHTML = `${products.map((product) => { return currentBanners[3].title == product.title ? `<option value="${product.id}" data-default disabled selected>${product.product_name}</option>` : `<option value="${product.id}">${product.product_name}</option>` }).join("")}`
}

const updateBannerProducts = async () => {
    const data = new FormData(document.getElementById("bannerSelect"));

    console.log(data.get("productId1"))
    console.log(data.get("productId2"))
    console.log(data.get("productId3"))
    console.log(data.get("productId4"))

    await axios({
        method: "post",
        data: data,
        url: "api/banners/",
        headers: { "Content-Type": "multipart/alternative" },
    }).then(function (response) {
        console.log(response.data);
        if(response.data.msg != "Deu algo errado"){
            actionFeedback('#success-updated-banner')
            updateBanners();
        }else{
            actionFeedback('#error-something-wrong')
        }
    })
    .catch(function (error) {
        console.log(error);
    });
}

const adminLogout = async () => {
    await axios({
        method: "POST",
        url: "api/adminlogout/",
        headers: { "Content-Type": "multipart/alternative" },
    }).then(function (response) {
        window.location.reload();
    })
    .catch(function (error) {
        console.log(error);
    });
}

window.onload = async () => {
    await checkAdminLogin().then( async () => {
        await updatePanel();
    });
}