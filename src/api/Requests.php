<?php

$method = $_SERVER['REQUEST_METHOD'];
$request = explode("/", substr(@$_SERVER['PATH_INFO'], 1));

switch ($method) {
    case 'POST':
        if(
            isset($_POST["products_id"]) and 
            isset($_POST["quantity"]) and 
            isset($_POST["payment_type"]) and
            isset($_POST["total_price"]) and
            isset($_POST["discounted_price"]) and
            isset($_POST["selected_color_pt"]) and
            isset($_POST["selected_size"]) and
            isset($_POST["date"]) and
            isset($_COOKIE["userToken"])
            
        ){
            CreateRequest();
        }else if(
            isset($_POST["products_id"]) and 
            isset($_POST["quantity"]) and 
            isset($_POST["payment_type"]) and
            isset($_POST["total_price"]) and
            isset($_POST["discounted_price"]) and
            isset($_POST["selected_color_pt"]) and
            isset($_POST["selected_size"]) and
            isset($_POST["date"]) and
            !isset($_COOKIE["userToken"])
        ){
            $retorno["msg"] = "Você não está logado";
            $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
            exit($json);
        }
        else if(isset($_POST["request_id"]) and isset($_POST["status"])){
            updateStatus();
        }
        break;
    case 'GET':
        if(isset($_GET["quant"]) and isset($_COOKIE["userToken"])){
            getUserOrders();
            break;
        }

        if(isset($_GET["completed"])){
            getAllCompletedRequests();
        }

        getAllRequests();

        break;
}


function CreateRequest(){
    include "./utils/JWT.php";
    include "./database/conexao.php";

    $userId = JWT_decode($_COOKIE["userToken"])["userId"];

    $products_id = $_POST["products_id"];
    $quantity = $_POST["quantity"];
    $payment_type = $_POST["payment_type"];
    $total_price = floatval($_POST["total_price"]);
    $discounted_price = floatval($_POST["discounted_price"]);
    $selected_color_pt = $_POST["selected_color_pt"];
    $selected_size = $_POST["selected_size"];
    $date = $_POST["date"];
    $status = "Pedido Feito";

    $sql = "INSERT INTO requests values (
                                            NULL,
                                            '$userId',
                                            '$date',
                                            '$status',
                                            '$payment_type',
                                            '$total_price',
                                            '$discounted_price'
    )";

    $resultado = $conexao->query($sql);
            
    if(!$resultado){
        $retorno["msg"] = "Deu algo de errado no 1";
        $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
        exit($json);
    }else{
        $retorno["msg"] = "não Deu algo de errado no 1";
    }


    $requestId = $conexao->insert_id;

    $products_id = explode(",", str_replace(" ", "", $products_id));
    $quantity = explode(",", str_replace(" ", "", $quantity));
    $selected_color_pt = explode(",", str_replace(" ", "", $selected_color_pt));
    $selected_size = explode(",", str_replace(" ", "", $selected_size));

    for($i = 0; $i < count($products_id); $i++){
        $p = intval($products_id[$i]);
        $q = intval($quantity[$i]);
        $c = $selected_color_pt[$i];
        $s = $selected_size[$i];

        $sql = "INSERT INTO request_products values (
                                            NULL,
                                            '$requestId',
                                            '$p',
                                            '$q',
                                            '$c',
                                            '$s'
        )";
       
       $resultado = $conexao->query($sql);
        
        if(!$resultado){
            $retorno["msg"] = "Deu algo de errado no 2";
            $retorno["1"] = $p;
            $retorno["2"] = $q;
            $retorno["3"] = $c;
            $retorno["4"] = $s;
            $retorno["5"] = $requestId;
            $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
            exit($json);
        }
    }    



    // $retorno["1"] = $products_id;
    // $retorno["2"] = $quantity;
    // $retorno["3"] = $payment_type;
    // $retorno["4"] = $total_price;
    // $retorno["5"] = $discounted_price;
    // $retorno["6"] = $selected_color_pt;
    // $retorno["7"] = $selected_size;
    // $retorno["8"] = $date;

    $retorno["msg"] = "tudo certo";
    $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit($json);
}

function getAllRequests() {
    include "./database/conexao.php";

    $sql = "SELECT 
                    requests.*, 
                    users.name,
                    users.surname,
                    users.adress,
                    users.number,
                    users.district,
                    users.reference_point,
                    users.city,
                    users.uf,
                    users.whatsapp
            FROM requests 
            INNER JOIN users 
            ON requests.user_id = users.id
            WHERE requests.status != 'Pedido Entregue'
            ORDER BY requests.id DESC
    ";

    $resultado = $conexao->query($sql);

    $tmp_array = array();
    $retorno["status"] = 1;
    $retorno["qtd"] = $resultado->num_rows;
    while($list = $resultado->fetch_assoc()){
        array_push($tmp_array, $list);
    }

    for($i = 0; $i < count($tmp_array); $i++){

        $req_id = $tmp_array[$i]["id"];
        $sql = "SELECT 
                    request_products.*, products.price, products.product_images, products.product_name 
                FROM request_products
                INNER JOIN products ON request_products.product_id = products.id
                WHERE request_id = '$req_id'";
        $resultado2 = $conexao->query($sql);
        $tmp_array2 = array();
        while($list2 = $resultado2->fetch_assoc()){
            $img_temp = array();
            $dir = $list2["product_images"];
            if (!file_exists($dir)) {
                array_push($tmp_array2, $list2);
                continue;
            }
            $new_dir = str_replace($_SERVER["DOCUMENT_ROOT"], "", $dir);
            
            if ($handle = opendir($dir)) {
                while (false !== ($entry = readdir($handle))) {
                    if ($entry != "." && $entry != "..") {
                        array_push($img_temp, $new_dir . "/" . "$entry");
                    }
                }
                closedir($handle);
            
            }
            $list2["product_images"] = $img_temp;

            array_push($tmp_array2, $list2);
        }
        $tmp_array[$i]["products"] = $tmp_array2;

    }

    $retorno["item"] = $tmp_array;

    $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit($json);
}

function getAllCompletedRequests(){
    include "./database/conexao.php";

    $sql = "SELECT 
                    requests.*, 
                    users.name,
                    users.surname,
                    users.adress,
                    users.number,
                    users.district,
                    users.reference_point,
                    users.city,
                    users.uf,
                    users.whatsapp
            FROM requests 
            INNER JOIN users 
            ON requests.user_id = users.id
            WHERE requests.status = 'Pedido Entregue'
            ORDER BY requests.id DESC
    ";

    $resultado = $conexao->query($sql);

    $tmp_array = array();
    $retorno["status"] = 1;
    $retorno["qtd"] = $resultado->num_rows;
    while($list = $resultado->fetch_assoc()){
        array_push($tmp_array, $list);
    }

    for($i = 0; $i < count($tmp_array); $i++){

        $req_id = $tmp_array[$i]["id"];
        $sql = "SELECT 
                    request_products.*, products.price, products.product_images, products.product_name 
                FROM request_products
                INNER JOIN products ON request_products.product_id = products.id
                WHERE request_id = '$req_id'";
        $resultado2 = $conexao->query($sql);
        $tmp_array2 = array();
        while($list2 = $resultado2->fetch_assoc()){
            $img_temp = array();
            $dir = $list2["product_images"];
            if (!file_exists($dir)) {
                array_push($tmp_array2, $list2);
                continue;
            }
            $new_dir = str_replace($_SERVER["DOCUMENT_ROOT"], "", $dir);
            
            if ($handle = opendir($dir)) {
                while (false !== ($entry = readdir($handle))) {
                    if ($entry != "." && $entry != "..") {
                        array_push($img_temp, $new_dir . "/" . "$entry");
                    }
                }
                closedir($handle);
            
            }
            $list2["product_images"] = $img_temp;

            array_push($tmp_array2, $list2);
        }
        $tmp_array[$i]["products"] = $tmp_array2;

    }

    $retorno["item"] = $tmp_array;

    $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit($json);
}

function getUserOrders() {
    include "./utils/JWT.php";
    include "./database/conexao.php";

    $userId = JWT_decode($_COOKIE["userToken"])["userId"];

    $sql = "SELECT 
                    requests.*, 
                    users.name,
                    users.surname,
                    users.adress,
                    users.number,
                    users.district,
                    users.reference_point,
                    users.city,
                    users.uf,
                    users.whatsapp,
                    users.cep
            FROM requests 
            INNER JOIN users 
            ON requests.user_id = users.id
            WHERE requests.user_id = '$userId'
            ORDER BY requests.id DESC
    ";

    $resultado = $conexao->query($sql);

    $tmp_array = array();
    $retorno["status"] = 1;
    $retorno["qtd"] = $resultado->num_rows;
    while($list = $resultado->fetch_assoc()){
        array_push($tmp_array, $list);
    }

    for($i = 0; $i < count($tmp_array); $i++){

        $req_id = $tmp_array[$i]["id"];
        $sql = "SELECT 
                    request_products.*, products.price, products.product_images, products.product_name 
                FROM request_products
                INNER JOIN products ON request_products.product_id = products.id
                WHERE request_id = '$req_id'";
        $resultado2 = $conexao->query($sql);
        $tmp_array2 = array();
        while($list2 = $resultado2->fetch_assoc()){
            $img_temp = array();
            $dir = $list2["product_images"];
            if (!file_exists($dir)) {
                array_push($tmp_array2, $list2);
                continue;
            }
            $new_dir = str_replace($_SERVER["DOCUMENT_ROOT"], "", $dir);
            
            if ($handle = opendir($dir)) {
                while (false !== ($entry = readdir($handle))) {
                    if ($entry != "." && $entry != "..") {
                        array_push($img_temp, $new_dir . "/" . "$entry");
                    }
                }
                closedir($handle);
            
            }
            $list2["product_images"] = $img_temp;

            array_push($tmp_array2, $list2);
        }
        $tmp_array[$i]["products"] = $tmp_array2;

    }

    $retorno["item"] = $tmp_array;

    $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit($json);
}

function updateStatus(){
    include "./database/conexao.php";

    $status = $_POST["status"];
    $request_id = $_POST["request_id"];

    if($status == 2){
        $s = "Preparando o pedido";
    }else if($status == 3) {
        $s = "Pedido Entregue";
    }else{
        return;
    }

    $sql = "UPDATE requests SET status = '$s' WHERE id = '$request_id'";

    $resultado = $conexao->query($sql);

    if($resultado){
        $retorno["msg"] = "Funfou";
    }else{
        $retorno["msg"] = "Não funfou";
    }

    $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit($json);
}

// UPDATE table_name
// SET column1 = value1, column2 = value2, ...
// WHERE condition;
//Select * from requests inner join request_products where requests.id = request_products.request_id;