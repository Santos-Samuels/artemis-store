const loadHeader = () => {
    const headerContainer = document.querySelector('header')

    const html = `
        <section class="w-100 h-100 position-absolute hide account-modal-container" id="login-container">
            <div class="position-fixed center p-5 top-50 start-50 translate-middle account-modal-content" id="login-content">
            <i class="bi bi-x-lg position-absolute cursor-pointer" onclick="ToggleModal('#login-container')"></i>
            <img class="mb-4" src="/assets/img/logo-acme.png" id="login-logo">

            <form id="login-form">
                <input class="form-control mt-3" type="email" name="login-email" id="login-email" placeholder="Email">  
                <input class="form-control mt-3" type="password" name="login-password" id="login-password" placeholder="Senha">
                <button class="btn btn-primary mt-3 w-100">ENTRAR</button>
            </form>

            <p class="mt-4">Não tem uma conta? <span class="cursor-pointer text-primary link" onclick="ToggleModal('#login-container'), ToggleModal('#signup-container')">Cadastre-se</span></p>
            </div>
        </section>

        <section class="w-100 h-100 position-absolute hide account-modal-container" id="signup-container">
            <div class="position-fixed center p-5 top-50 start-50 translate-middle account-modal-content" id="signup-content">
            <i class="bi bi-x-lg position-absolute cursor-pointer" onclick="ToggleModal('#signup-container')"></i>
            <img class="mb-4" src="/assets/img/logo-acme.png" id="signup-logo">

            <form id="signup-form">
                <input class="form-control mt-3" type="text" name="signup-first-name" id="signup-first-name" placeholder="Primeiro nome">
                <input class="form-control mt-3" type="text" name="signup-last-name" id="signup-last-name" placeholder="Último nome">
                <input class="form-control mt-3" type="email" name="signup-email" id="signup-email" placeholder="Email">
                <input class="form-control mt-3" type="password" name="signup-password" id="signup-password" placeholder="Senha">
                <input class="form-control mt-3" type="password" name="signup-password-2" id="signup-password-2" placeholder="Confirmar senha">
                <button class="btn btn-primary mt-3 w-100">EFETUAR CADASTRO</button>
            </form>

            <p class="mt-4">Já tem uma conta? <span class="cursor-pointer link text-primary" onclick="ToggleModal('#signup-container'), ToggleModal('#login-container')">Entrar</span></p>
            </div>
        </section>

        <nav class="navbar navbar-expand-lg navbar-light p-4">
            <a class="navbar-brand fw-bold" href=""><img class="zoom" id="logo" src="/assets/img/logo-acme.png" alt="logo"> ACME</a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarText">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                <a class="nav-link" href="/">Inicio</a>
                </li>
                <li class="nav-item">
                <a class="nav-link" href="/sobre">Sobre</a>
                </li>
                <li class="nav-item">
                <div class="dropdown">
                    <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-box-seam"></i>  Produtos</a>
                    
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <a class="list-group-item list-group-item-action list-group-item-light">Jóia</a>
                    <a class="list-group-item list-group-item-action list-group-item-light">Seminóia</a>
                    <a class="list-group-item list-group-item-action list-group-item-light">Bijuteria</a>
                    </ul>
                </div>
                </li>
                <li class="nav-item">
                <a class="nav-link" href="/contato">Contato</a>
                </li>
            </ul>

            <span class="input-group d-flex w-50 me-auto">
                <input class="form-control" type="search" name="search" id="search" placeholder="Pesquisar produtos ...">
                <button class="btn btn-outline-secondary"><i class="bi bi-search"></i></button>
            </span>
            
            <div class="navbar-text d-flex align-items-center fs-4">
                <i class="bi bi-bag pe-4 zoom"></i>
                <i class="bi bi-heart pe-4 zoom"></i>
                <i class="bi bi-person-fill rounded-circle zoom" id="user" onclick="ToggleModal('#login-container')"></i>
            </div>
            </div>
        </nav>
    `

    headerContainer.insertAdjacentHTML('beforeend', html)
}