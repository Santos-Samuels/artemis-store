<?php

$method = $_SERVER['REQUEST_METHOD'];
$request = explode("/", substr(@$_SERVER['PATH_INFO'], 1));

switch ($method) {
    case 'POST':
        if(isset($_POST["name"]) and  $_POST["email"] and $_POST["password"]){
            createNewUser();
        } else{
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
    $email = $_POST["email"];
    $password = criptografar($_POST["password"]);

    $sql = "INSERT INTO users values (NULL, '$name', '$email', '$password')";

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