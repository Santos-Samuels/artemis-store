<?php

include "../../api/utils/JWT.php";

try{
    $userName = JWT_decode($_COOKIE["userToken"]);
    
    include 'index.html';

}catch(Exception $e){
    header("location: /");
    
    exit(0);
}

exit(0);