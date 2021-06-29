<?php 

declare(strict_types=1);
use Firebase\JWT\JWT;
require_once __DIR__ . '../../../../vendor/autoload.php';



function JWT_encode($id, $name){
    $secretKey  = 'secretPassword/z';
    $issuedAt   = new DateTimeImmutable();
    $expire     = $issuedAt->modify('+6 minutes')->getTimestamp();      // Add 60 seconds
    $serverName = "localhost/testebd/";

    $data = [
        //'iat'  => $issuedAt->getTimestamp(),         // Issued at: time when the token was generated
        //'iss'  => $serverName,                       // Issuer
        //'nbf'  => $issuedAt->getTimestamp(),         // Not before
        //'exp'  => $expire,                           // Expire
        'userName' => $name,                     // User name
        'userId' => $id,
    ];


    // Encode the array to a JWT string.
    $token = JWT::encode(
        $data,
        $secretKey
    );

    return $token;
}

function JWT_decode($token){
    $secretKey  = 'secretPassword/z';
    
    $decoded_token = (array) JWT::decode(
        $token, 
        $secretKey, 
        array('HS256')
    );

    return $decoded_token;
}