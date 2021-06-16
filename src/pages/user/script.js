const loadUserData = (/*user*/) => {
    const userDataContainer = document.querySelector('#user-data')
    
    const html = `
        <div class="border shadow-sm p-3 pt-0 rounded row">
            <div class="row border-bottom mb-4 g-2 pb-2">
                <div class="col">
                    <h5 class="pt-1">MEUS DADOS</h5>
                </div>  
                <div class="col text-end">
                    <button class="btn btn-primary" onclick="loadUserDataModal()" data-bs-toggle="modal" data-bs-target="#userSignupEditInfo" data-bs-dismiss="modal">Editar</button> 
                </div>  
            </div>

            <div class="col-12 col-lg-4">
                <label class="text-secondary">Primeiro Nome</label>
                <h5 class="text-secondary pt-2">Nome</h5>
                
                <label class="mt-3 text-secondary">Último Nome</label>
                <h5 class="text-secondary pt-2">Sobrenome</h5>
            </div>
            <div class="col-12 col-lg-4">
                <label class="text-secondary">Email</label>
                <h5 class="text-secondary pt-2">email@email.com</h5>
                <label class="mt-3 text-secondary">Celular</label>
                <h5 class="text-secondary pt-2">XX X XXXX-XXXX</h5>
            </div>
            <div class="col-12 col-lg-4">
                <label class="text-secondary">Endereço</label>
                <h5 class="pb-1 text-secondary pt-2">Rua Tal, nº XXX <br> Bairro Tal <br> Cidade Tal - UF <br> Próximo à preça</h5>
            </div>
        </div>

        <div class="border shadow-sm p-3 rounded row mt-3">
            <div class="col">
                <h5 class="pt-1">ALTERAR SENHA</h5>  
            </div>  
            <div class="col text-end">
                <button class="btn btn-primary">Editar</button> 
            </div>  
        </div>
    `

    userDataContainer.insertAdjacentHTML('beforeend', html)
}

const loadUserDataModal = (/*user*/) => {
    const userDataContainer = document.querySelector('#signup-form-edit')
    
    const html = `
        <input class="form-control mt-3" type="text" name="signup-first-name" id="signup-first-name" placeholder="Primeiro nome" value="${'Nome'}" required>
        <input class="form-control mt-3" type="text" name="signup-last-name" id="signup-last-name" placeholder="Último nome" value="${'Sobrenome'}" required>
        <input class="form-control mt-3" type="email" name="signup-email" id="signup-email" placeholder="Email" value="${'email@email.com'}" required>
        <input class="form-control mt-3" type="tel" name="signup-phone" id="signup-phone" placeholder="Celular" value="${'XX X XXXX-XXXX'}" required>
        <input class="form-control mt-3" type="text" name="signup-address" id="signup-address" placeholder="Endereço" value="${'Rua Tal, nº XXX'}">
        <input class="form-control mt-3" type="text" name="signup-district" id="signup-district" placeholder="Bairro" value="${'Bairro Tal'}">
        <input class="form-control mt-3" type="text" name="signup-city" id="signup-city" placeholder="Cidade" value="${'Cidade Tal - UF'}">
        <input class="form-control mt-3" type="text" name="signup-reference-point" id="signup-reference-point" placeholder="Ponto de referência" value="${'Próximo à preça'}">
    `

    userDataContainer.insertAdjacentHTML('beforeend', html)
}