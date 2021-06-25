<?php

$method = $_SERVER['REQUEST_METHOD'];
$request = explode("/", substr(@$_SERVER['PATH_INFO'], 1));

switch ($method) {
    case 'POST':
        if(isset($_POST["login"]) and isset($_POST["password"])){
            loginIn();
        }else{
            $retorno["msg"] = "Login ou Senha não digitados";

            $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
            exit($json);
        }

        break;
    case 'GET':
        echo $_COOKIE["userToken"];

        break;
}

function loginIn(){
    include "./database/conexao.php";
    include './utils/Criptografia.php';
    include "./utils/JWT.php";

    $login = $_POST["login"];
    $password = criptografar($_POST["password"]);

    $sql = "SELECT id, name FROM users WHERE email='$login' and password='$password'";

    $resultado = $conexao->query($sql);
    
    if($resultado->num_rows == 0){
        $retorno["msg"] = "Login ou Senha errados";

        $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
        exit($json);
    }
    
    $user_data = $resultado->fetch_assoc();

    $jwt_token = JWT_encode($user_data["id"], $user_data["name"]);

    setcookie("userToken", $jwt_token, 0, "/");
    
    $retorno["msg"] = "Login concluido";

    $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit($json);

}