<?php

if (isset($_COOKIE['userToken'])) {
    unset($_COOKIE['userToken']); 
    setcookie('userToken', null, -1, '/'); 
}