<?php

include "./utils/JWT.php";

try{
    $userName = JWT_decode($_COOKIE["adminToken"]);
    
    include '../pages/admin/index.html';

}catch(Exception $e){
    header("location: /admin-login/");
    
    exit(0);
}

exit(0);