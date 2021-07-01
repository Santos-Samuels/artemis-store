/*
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

*/