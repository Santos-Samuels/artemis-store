<?php

$method = $_SERVER['REQUEST_METHOD'];
$request = explode("/", substr(@$_SERVER['PATH_INFO'], 1));

switch ($method) {
    case 'POST':
        if(isset($_POST["login"]) and isset($_POST["password"])){
            loginIn();
        }else if(!isset($_POST["login"]) and !isset($_POST["password"]) and isset($_COOKIE["userToken"])){
            verifyLogin();
        }else if(!isset($_POST["login"]) and !isset($_POST["password"]) and !isset($_COOKIE["userToken"])){
            echo "algumacoisa";
            break;
        }else{
            $retorno["msg"] = "Login ou Senha não digitados";

            $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
            exit($json);
        }

        break;
    case 'GET':
        getUserData();

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

    setcookie("userToken", $jwt_token, time()+3600, "/");
    
    $retorno["msg"] = "Login concluido";

    $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit($json);
}

function getUserData(){
    include "./database/conexao.php";
    include "./utils/JWT.php";

    $userId = JWT_decode($_COOKIE["userToken"])["userId"];

    $sql = "SELECT 
                    name, 
                    surname,
                    email, 
                    whatsapp, 
                    adress,
                    number, 
                    district, 
                    city, 
                    uf,
                    reference_point,
                    cep
            FROM users 
            WHERE id = '$userId'";

    $resultado = $conexao->query($sql);

    if($resultado->num_rows == 0) {
        $retorno["msg"] = "Não foi achado um usuario com esse id";

        $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
        exit($json);
    }
    
    $user_data = $resultado->fetch_assoc();

    $retorno["user_data"] = $user_data;

    $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit($json);
}

function verifyLogin(){
    include "./utils/JWT.php";

    if(!isset($_COOKIE["userToken"])){
        return;
    }

    try{
        $userName = JWT_decode($_COOKIE["userToken"])["userName"];
    }catch(Exception $e){
        $retorno["msg"] = "Token não é valido";
        $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
        exit($json);
    }

    $retorno["userName"] = $userName;
    $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit($json);
}