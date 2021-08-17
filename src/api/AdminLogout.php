<?php

unset($_COOKIE['adminToken']); 
setcookie('adminToken', null, -1, '/api/admin'); 
setcookie('adminToken', null, -1, '/admin'); 

