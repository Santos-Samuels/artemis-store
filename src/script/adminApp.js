const loadEditProducts = (products) => {
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
                    <td>${product.title}</td>
                    <td>${product.type}</td>
                    <td class="order-price">${product.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                    <td>${product.promo.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                    <td><i class="bi bi-pencil-fill me-2 primary-text-hover cursor-pointer" onclick="editProductModal(products, ${product.id})" title="Editar" data-bs-toggle="modal" data-bs-target="#editProductModal"></i> <i class="bi bi-trash-fill primary-text-hover cursor-pointer" onclick="removeProduct(products, ${product.id})" title="Excluir"></i></td>
                </tr>
            `
    
            editContainer.insertAdjacentHTML('beforeend', html)
        });
    }
}

const editProductModal = (products, productsId) => {
    const editContainer = document.querySelector('#edit-product-modal-container')

    if(products.length != 0) {
        let product = products.find(item => { if(item.id == productsId) return item });

        editContainer.innerHTML = `
            <form class="m-3" action="">
                <div class="row g-2">
                    <div class="col-12 col-lg-4">
                    <label class="form-label" for="product-image-1">Imagem 1 <span class="text-danger" title="Obrigatório">*</span></label>
                    <input class="form-control" type="file" accept="image/*" id="product-image-1" src="${product.image}" required>
                    </div>
                    <div class="col-12 col-lg-4">
                    <label class="form-label" for="product-image-2">Imagem 2</label>
                    <input class="form-control" type="file"  accept="image/*"id="product-image-2" src="">
                    </div>
                    <div class="col-12 col-lg-4">
                    <label class="form-label" for="product-image-3">Imagem 3</label>
                    <input class="form-control" type="file" accept="image/*" id="product-image-3" src="">
                    </div>
                </div>
    
                <div class="row mt-2 g-2">
                    <div class="col-12 col-lg-6">
                        <label class="form-label" for="product-name">Nome do produto <span class="text-danger" title="Obrigatório">*</span></label>
                        <input class="form-control" type="text" name="product-name" id="product-name" placeholder="Ex: Pingente de Ouro Branco" value="${product.title}" required>
                    </div>
                    <div class="col-6 col-lg-3">
                    <label class="form-label" for="product-price">Preço <span class="text-danger" title="Obrigatório">*</span></label>
                    <input class="form-control" type="number" name="product-price" id="product-price" min="0" placeholder="Ex: 29.90" value="${product.price}" required> 
                    </div>
                    <div class="col-6 col-lg-3">
                    <label class="form-label" for="product-promo">Promoção <span class="primary-text"></span></label>
                    <input class="form-control" type="number" name="product-promo" id="product-promo" min="0" placeholder="Ex: 24.90" value="${product.promo}" required> 
                    </div>
                </div>
    
                <div class="row mt-2 g-2">
                    <div class="col">
                        <label class="form-label" for="product-info">Descrição <span class="text-danger" title="Obrigatório">*</span></label>
                        <input class="form-control" type="text" name="product-info" id="product-info" placeholder="Especificações, Detalhes do produto..." value="${product.description}" required>
                    </div>
                    <div class="col-4 col-lg-3">
                    <label class="form-label" for="product-quantity">Quantidade <span class="text-danger" title="Obrigatório">*</span></label>
                    <input class="form-control" type="number" name="product-quantity" id="product-quantity"  min="0" placeholder="Ex: 3" value="${product.stock}" required>
                    </div>
                    </div>
                    
                    <div class="row mt-2 g-2">
                    <div class="col-6 col-md-3 col-lg-3">
                    <label class="form-label" for="product-color">Cor <span class="text-danger" title="Obrigatório">*</span></label>
                    <input class="form-control" type="text" name="product-color" id="product-color" placeholder="Ex: Azul, Branco" value="${product.colorList}" required>
                    </div>
                    <div class="col-6 col-md-3 col-lg-3">
                    <label class="form-label" for="product-size">Tamanho <span class="text-danger" title="Obrigatório">*</span></label>
                    <input  class="form-control" type="text" name="product-size" id="product-size" placeholder="Ex: 23cm, 32cm" value="${product.sizeList}" required>
                    </div>
                    <div class="col-6 col-md-3 col-lg-3">
                        <label class="form-label" for="product-type">Tipo <span class="text-danger" title="Obrigatório">*</span></label>
                        <select class="form-select" name="product-type" id="product-type" required>
                        <option value="" data-default disabled selected></option>
                        <option value="anel">Anel</option>
                        <option value="colar">Colar</option>
                        <option value="brinco">Brinco</option>
                        <option value="pulseira">Pulseira</option>
                        <option value="calcinha">Lingerie</option>
                        </select>
                    </div>
                    <div class="col-6 col-md-3 col-lg-3">
                        <label class="form-label" for="product-type">Categoria <span class="text-danger" title="Obrigatório">*</span></label>
                        <select class="form-select" name="product-type" id="product-type" required>
                        <option value="" data-default disabled selected></option>
                        <option value="">Jóia</option>
                        <option value="">Semijóias</option>
                        <option value="">Bijuterias</option>
                        <option value="">Lingerie</option>
                        </select>
                    </div>
                </div>
            </form>
        `
    }
    
}

const removeProduct = (products, productId) => {
    if(products.length != 0) {
        products.forEach((item, index) => {
            if(item.id == productId) {
                products.splice(index, 1)
            }
         })
    }

    loadEditProducts(products)
}