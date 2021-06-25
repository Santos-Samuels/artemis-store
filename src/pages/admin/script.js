const createProduct = async () => {
    var data = new FormData(document.getElementById("new-product-form"));
    var p_name = document.getElementById("product-name").value;

    data.append('folder_name', p_name.toLowerCase().split(" ").join("-"));

    teste = data;

    var cores = data.get("product-color");
    
    cores = cores.toLocaleLowerCase().replace(" ", "").split(",");
    if(!validateColor(cores)){
        return;
    }

    
    await axios({
        method: "post",
        url: "api/produtos/",
        data: data,
        headers: { "Content-Type": "multipart/alternative" },
    }).then(function (response) {
        console.log(response.data);
        if(response.data.msg == "Funfou"){
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
    });//productId
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
                    <td><i class="bi bi-pencil-fill me-2 primary-text-hover cursor-pointer" onclick="editProductModal(${product.id})" title="Editar" data-bs-toggle="modal" data-bs-target="#editProductModal"></i> <i class="bi bi-trash-fill primary-text-hover cursor-pointer" onclick="removeProduct(${product.id})" title="Excluir"></i></td>
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
                alert(response.data.texto + " não é uma cor !");
                return false
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    )
    return true;
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
