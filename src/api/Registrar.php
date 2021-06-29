<?php

$method = $_SERVER['REQUEST_METHOD'];
$request = explode("/", substr(@$_SERVER['PATH_INFO'], 1));

switch ($method) {
    case 'POST':
        if(isset($_POST["name"]) and  $_POST["email"] and $_POST["password"]){
            createNewUser();
        }else if(
            isset($_POST["whatsapp"])
            and isset($_POST["address"])
            and isset($_POST["number"])
            and isset($_POST["district"])
            and isset($_POST["city"])
            and isset($_POST["uf"])
            and isset($_POST["reference-point"])
            and isset($_COOKIE["userToken"])
        ){
            updateUser();
        }
        else{
            $retorno["msg"] = "Algum dos dados não foi digitado";

            $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
            exit($json);
        }

        break;
    case 'GET':
        break;
}


function createNewUser(){
    include "./database/conexao.php";
    include './utils/Criptografia.php';

    $name = $_POST["name"];
    $surname = $_POST["surname"];
    $email = $_POST["email"];
    $password = criptografar($_POST["password"]);

    $sql = "INSERT INTO users(name, surname, email, password) values ('$name', '$surname', '$email', '$password')";

    $resultado = $conexao->query($sql);
    
    if($resultado){
        $retorno["msg"] = "Registro Concluido";

        $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
        exit($json);
    }else{
        $retorno["msg"] = "Deu algo errado no server";

        $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
        exit($json);
    }

}

function updateUser(){
    include "./database/conexao.php";
    include "./utils/JWT.php";

    $userId = JWT_decode($_COOKIE["userToken"])["userId"];

    $whatsapp = $_POST["whatsapp"];
    $address = $_POST["address"];
    $number = $_POST["number"];
    $district = $_POST["district"];
    $city = $_POST["city"];
    $uf = $_POST["uf"];
    $reference_point = $_POST["reference-point"];

    $sql = "UPDATE users
            SET 
                whatsapp = '$whatsapp',
                adress = '$address',
                number = '$number',
                district = '$district',
                city = '$city',
                uf = '$uf',
                reference_point = '$reference_point'
            WHERE id = '$userId'
            ";

            
    $resultado = $conexao->query($sql);
    
    if(!$resultado){
        $retorno["msg"] = "Deu algo de errado no server";

        $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
        exit($json);
    }
    $retorno["msg"] = "Informações atualizadas";

    $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit($json);
}

function getAllUsers(){
    include '../conexao.php';
    $sql = "SELECT * FROM users";

    $resultado = $conexao->query($sql);

    $tmp_array = array();
    $retorno["status"] = 1;
    $retorno["qtd"] = $resultado->num_rows;
    while($list = $resultado->fetch_assoc()){
        array_push($tmp_array, $list);
    }
    $retorno["item"] = $tmp_array;

    $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit($json);
}


?>