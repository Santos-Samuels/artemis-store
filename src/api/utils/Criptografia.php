<?php

function criptografar($senha){
    $valor_criptografado = base64_encode($senha);
    return $valor_criptografado;
}

function descriptografar($valor_criptografado){
    $valor_descriptografado = base64_decode($valor_criptografado);
    return $valor_descriptografado;
}