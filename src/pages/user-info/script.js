const updateUserData = async () => {
    await axios({
        method: "get",
        url: `/api/login`,
        headers: { "Content-Type": "multipart/form-data" },
    }).then(function (response) {
        console.log(response.data)
        Dados = response.data.user_data;
        loadUserData(response.data.user_data)
    })
    .catch(function (error) {
        console.log(error);
    });
}

const loadUserData = (user) => {
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
                <h5 class="text-secondary pt-2">${user.name}</h5>
                
                <label class="mt-3 text-secondary">Último Nome</label>
                <h5 class="text-secondary pt-2">${user.surname}</h5>
            </div>
            <div class="col-12 col-lg-4">
                <label class="text-secondary">Email</label>
                <h5 class="text-secondary pt-2">${user.email}</h5>
                <label class="mt-3 text-secondary">Whatsapp</label>
                <h5 class="text-secondary pt-2">${(user.whatsapp == null) ? "" : user.whatsapp}</h5>
            </div>
            <div class="col-12 col-lg-4">
                <label class="text-secondary">Endereço</label>
                <h5 class="pb-1 text-secondary pt-2">${(user.adress == null) ? "-----------" : user.adress} - n° ${(user.number == null) ? "--" : user.number} <br> Bairro: ${(user.district == null) ? "---------" : user.district} <br> Cidade: ${(user.city == null) ? "---------" : user.city} - ${(user.uf == null) ? "--" : user.uf} <br>${(user.reference_point == null) ? "--------------" : user.reference_point} <br> CEP: ${(user.cep == null) ? "--------------" : user.cep}</h5>
            </div>
        </div>

        <div class="border shadow-sm p-3 rounded row mt-3">
            <div class="col">
                <h5 class="pt-1">ALTERAR SENHA</h5>  
            </div>  
            <div class="col text-end">
                <button class="btn btn-primary"onclick="loadUserPasswordModal()" data-bs-toggle="modal" data-bs-target="#userSignupEditPassword" data-bs-dismiss="modal">Editar</button> 
            </div>  
        </div>
    `

    userDataContainer.insertAdjacentHTML('beforeend', html)
}

const editarInformacoesDeUsuario = async () => {
    var data = new FormData(document.getElementById("signup-form-edit"));
    
    await axios({
        method: "post",
        data,
        url: `/api/registro`,
        headers: { "Content-Type": "multipart/form-data" },
    }).then(function (response) {
        console.log(response.data)
        if(response.data.msg == "Informações atualizadas"){
            alert("Informações Atualizadas");
            window.location.reload();
        }
    })
    .catch(function (error) {
        console.log(error);
    });
}

var Dados;

const loadUserDataModal = () => {
    const userDataContainer = document.getElementById('signup-form-edit')
    
    userDataContainer.innerHTML = `
        <input class="form-control mt-3" type="tel" name="whatsapp" id="whatsapp" placeholder="Whatsapp" value="${(Dados.whatsapp == null) ? "" : Dados.whatsapp}" required>
        
        <div class="row">
            <div class="col">
                <input class="form-control mt-3" type="text" name="address" id="address" placeholder="Endereço" value="${(Dados.adress == null) ? "" : Dados.adress}">
            </div>
            <div class="col-3">
                <input class="form-control mt-3" type="text" name="number" id="number" placeholder="Nº" value="${(Dados.number == null) ? "" : Dados.number}">
            </div>
        </div>
        <input class="form-control mt-3" type="text" name="district" id="district" placeholder="Bairro" value="${(Dados.district == null) ? "" : Dados.district}">
        <div class="row">
            <div class="col">
                <input class="form-control mt-3" type="text" name="city" id="city" placeholder="Cidade" value="${(Dados.city == null) ? "" : Dados.city}">
            </div>
            <div class="col-3">
                <input class=" form-control mt-3" type="text" name="uf" id="uf" placeholder="Estado" value="${(Dados.uf == null) ? "" : Dados.uf}">
            </div>
        </div>
        <input class="form-control mt-3" type="text" name="reference-point" id="reference-point" placeholder="Ponto de referência" value="${(Dados.reference_point == null) ? "" : Dados.reference_point}">
        <input class="form-control mt-3" type="text" name="cep" id="cep" placeholder="CEP"  value="${(Dados.cep == null) ? "" : Dados.cep}">
    `;
}


const loadUserPasswordModal = () => {
    const userPasswordContainer = document.getElementById('signup-form-edit-password')
    
    userPasswordContainer.innerHTML = `
        <label class="form-label" for="user-old-password">Senha atual <span class="primary-text">*</span></label>
        <input class="form-control mb-5" type="password" name="user-old-password" id="user-old-password">
        <label class="form-label" for="user-old-password">Nova senha <span class="primary-text">*</span></label>
        <input class="form-control mb-2" type="password" name="user-new-password" id="user-new-password">
        <label class="form-label" for="user-old-password">Confirmar nova senha <span class="primary-text">*</span></label>
        <input class="form-control" type="password" name="user-new-password-2" id="user-new-password-2">
    `
}


window.onload = updateUserData()