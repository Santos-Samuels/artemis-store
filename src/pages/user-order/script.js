const loadFavorite = (orders) => {
    const productsContainer = document.querySelector('#order-container')
    

    orders.forEach(order => {
        const html = `
            <div class="border mb-2 p-1 order-item-conteiner row">
                <i class="bi bi-chevron-down fs-5 ms-1 col-4" data-bs-toggle="collapse" href="#${order.type}-${order.id}" role="button" aria-expanded="false" aria-controls="${order.type}-${order.id}">
                    <span>Detalhes do pedido</span>
                </i>

                <div class="col d-flex justify-content-between">
                    <div>
                        <h5>${order.title}</h5>
                    </div>
                    
                    <div class="ms-2 me-2">
                        <span>comprado dia 25/jun</span>
                    </div>
                </div>
            </div>
            <div class="collapse" id="${order.type}-${order.id}">
                <div class="card card-body mb-4">
                    <p class="fw-bold text-secondary ps-3">Número do pedido: ${order.id}</p>
                    
                    <article class="d-flex ps-3 border-bottom pb-4">
                        <div>
                            <img src="${order.image}" class="order-image rounded me-3">
                        </div>
                        <div>
                            <h5>${order.title}</h5>
                            <span>1 unidade</span>
                        </div>
                    </article>

                    <div class="row text-center mt-4 border-bottom pb-4">
                        <div class="col">
                            <i class="bi bi-check-lg fs-4 primary-text"></i>
                            <p class="fs-5 fw-bold">Pedido recebido</p>
                        </div>
                        <div class="col">
                            <i class="bi bi-clock fs-4 text-secondary"></i>
                            <p class="fs-5 fw-bold">Preparando pedido</p>
                        </div>
                        <div class="col">
                            <i class="bi bi-clock fs-4 text-secondary"></i>
                            <p class="fs-5 fw-bold">Pedido entregue</p>
                        </div>
                    </div>

                    <div class="row mt-5 ps-3">
                        <div class="col-12 col-lg-4">
                            <p class="fs-6 fw-bold">Pagamento:</p>
                            <p class="fs-5"><i class="bi bi-cash-coin fs-4"></i> Dinheiro</p>
                        </div>

                        <div class="col-12 col-lg-4">
                            <p class="fs-6 fw-bold">Valor total:</p>
                            <p class="mb-0 pb-2">subtotal: <span class="fw-bold ms-3 primary-text">${order.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span> <br>
                            desconto: <span class="fw-bold ms-3 primary-text">${order.promo.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span></p>
                            <p class="fs-6 fw-bold mb-0 pb-3 primary-text">total: <span class="fw-bold ms-3">${order.promo.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span></p>
                        </div>

                        <div class="col-12 col-lg-4">
                            <p class="fs-6 fw-bold">Endereço:</p>
                            <p>Nome Sobrenome do Comprador</p>
                            <p>Rua Tal, nº XXX - Bairro Tal <br>
                            Cidade Tal - UF / Próximo à preça</p>
                        </div>
                    </div>
                </div>
            </div>
        `

        productsContainer.insertAdjacentHTML('beforeend', html)
    });
}

window.onload = loadFavorite(orders)