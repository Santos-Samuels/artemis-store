<?php
$servidor = "sql202.epizy.com";
$userName = "epiz_29082049";
$password = "0L2K1AaBYpIfD9";

$dbName = "epiz_29082049_loja_artemis";
$conexao = new mysqli($servidor, $userName, $password, $dbName);


if (mysqli_connect_errno()){
    trigger_error((mysqli_connect_error()));
    exit();
}

mysqli_set_charset($conexao, "utf8");

?>