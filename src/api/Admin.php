<?php
 header('Access-Control-Allow-Origin: *'); 
 header("Access-Control-Allow-Credentials: true");
 header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
 header('Access-Control-Max-Age: 1000');
 header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

$method = $_SERVER['REQUEST_METHOD'];
$request = explode("/", substr(@$_SERVER['PATH_INFO'], 1));

switch ($method) {
    case 'POST':
        if(isset($_POST["login"]) and isset($_POST["password"])){
            loginIn();
        }

        break;
    case 'GET':
        if(isset($_COOKIE["adminToken"]) and isset($_GET["panel"])){
            loadPainel();
        }else if(isset($_COOKIE["adminToken"])){
            verifyLogin();
        }else {
            $retorno["msg"] = "Token não é valido";
            $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
            exit($json);
        }

        break;
    case 'DELETE':
        if (isset($_COOKIE['adminToken'])) {
            unset($_COOKIE['adminToken']); 
            setcookie('adminToken', null, -1, '/api/admin'); 
        }
        break;
}

function createNewAdmin(){
    include "./database/conexao.php";
    include './utils/Criptografia.php';

    $admin = "admin";
    $password = criptografar("123456");

    $sql = "INSERT INTO 
                    admin 
                values 
                    (NULL,
                    '$admin', 
                    '$password'
                )";

    $resultado = $conexao->query($sql);
    echo $conexao->error;
    if($resultado){
        echo "Funfou";
    }else{
        echo "N funfou";
    }
}

function loginIn(){
    include "./database/conexao.php";
    include './utils/Criptografia.php';
    include "./utils/JWT.php";

    $login = $_POST["login"];
    $password = criptografar($_POST["password"]);

    $sql = "SELECT id FROM admin WHERE name='$login' and password='$password'";

    $resultado = $conexao->query($sql);
    
    if($resultado->num_rows == 0){
        $retorno["msg"] = "Login ou Senha errados";

        $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
        exit($json);
    }
    
    $user_data = $resultado->fetch_assoc();

    $jwt_token = JWT_encode($user_data["id"], "admin");

    setcookie("adminToken", $jwt_token, time()+3600, "/api/admin");
    
    $retorno["msg"] = "Login concluido";

    $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit($json);
}

function verifyLogin(){
    include "./utils/JWT.php";

    try{
        $userName = JWT_decode($_COOKIE["adminToken"]);
    }catch(Exception $e){
        $retorno["msg"] = "Token não é valido";
        $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
        exit($json);
    }

    $retorno["msg"] = "Token é valido";
    $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit($json);
}

function loadPainel(){
    include "./database/conexao.php";

    $sql = "SELECT * FROM requests WHERE status = 'Pedido Feito'";
    $resultado = $conexao->query($sql);
    $retorno["newSales"] = $resultado->num_rows;

    $sql = "SELECT * FROM requests WHERE status = 'Pedido Entregue'";
    $resultado = $conexao->query($sql);
    $retorno["finishedSales"] = $resultado->num_rows;

    $sql = "SELECT * FROM products WHERE active = 0";
    $resultado = $conexao->query($sql);
    $retorno["activeProducts"] = $resultado->num_rows;

    $sql = "SELECT * FROM products WHERE promotion > 0";
    $resultado = $conexao->query($sql);
    $retorno["promoProducts"] = $resultado->num_rows;

    $sql = "SELECT * FROM products WHERE active = 1";
    $resultado = $conexao->query($sql);
    $retorno["disabledProducts"] = $resultado->num_rows;

    $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit($json);
}

?>