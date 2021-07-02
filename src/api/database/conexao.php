<?php
$servidor = "localhost";
$userName = "root";
$password = "";

$dbName = "loja_artemis";
$conexao = new mysqli($servidor, $userName, $password, $dbName);


if (mysqli_connect_errno()){
    trigger_error((mysqli_connect_error()));
    exit();
}

mysqli_set_charset($conexao, "utf8");

?>