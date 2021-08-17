<?php
 header('Access-Control-Allow-Origin: *'); 
 header("Access-Control-Allow-Credentials: true");
 header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
 header('Access-Control-Max-Age: 1000');
 header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

$method = $_SERVER['REQUEST_METHOD'];
$request = explode("/", substr(@$_SERVER['PATH_INFO'], 1));

switch ($method) {
    case 'POST':
        if(isset($_POST["productId"]) and isset($_POST["methodType"]) and $_POST["methodType"] == "delete"){
            echo "delete";
            disableProductWithId();
        }
        if(isset($_POST["productId"]) and isset($_POST["methodType"]) and $_POST["methodType"] == "update"){
            activateProductWithId();
        }
        
        if(isset($_POST["productId"])){
            updateProductWithId();
        }else{
            createNewProduct();  
        }
        break;
    case 'GET':
        $id = isset($_GET["id"]) ? $_GET["id"] : null;
        
        if($id){
            getProductById($id);
        }elseif(isset($_GET["type"]) || isset($_GET["category"]) || isset($_GET["orderby"])){

            $type = isset($_GET["type"]) ? $_GET["type"] : null;
            $category = isset($_GET["category"]) ? $_GET["category"] : null;
            $orderby = isset($_GET["orderby"]) ? $_GET["orderby"] : null;

            getProductWithFilters($type, $category, $orderby);
        }else{
            getAllProducts();
        }

        break;
}


function createNewProduct(){
    include './database/conexao.php';
    include './utils/FileController.php';

    $p_name = $_POST["product-name"];
    $p_images = UploadFiles();
    $description = $_POST["product-info"];
    $category = $_POST["product-category"];
    $type = $_POST["product-type"];
    $quantity =  floatval($_POST["product-quantity"]);
    $price = floatval($_POST["product-price"]);
    $promo = floatval($_POST["product-promo"]);
    $color = $_POST["color_pt"];
    $color_en = $_POST["color_en"];
    $size = $_POST["size"];

    $sql = "INSERT INTO products values (NULL, 
                                        '$p_name', 
                                        '$p_images', 
                                        '$description',
                                        '$color',
                                        '$color_en',
                                        '$size',
                                        '$type',
                                        '$category', 
                                        '$quantity', 
                                        '$price',
                                        '$promo',
                                        0
    )";
    

    $resultado = $conexao->query($sql);
        
    if($resultado){
        $retorno["msg"] = "Funfou";
    }else{
        $retorno["msg"] = "N funfou";
    }

    $json = json_encode($retorno);
    exit($json);
}

function getAllProducts(){
    include './database/conexao.php';

    $sql = "SELECT * FROM products where active = 0";

    $resultado = $conexao->query($sql);

    $tmp_array = array();
    $retorno["status"] = 1;
    $retorno["qtd"] = $resultado->num_rows;
    while($list = $resultado->fetch_assoc()){
        $img_temp = array();
        $dir = $list["product_images"];
        if (!file_exists($dir)) {
            array_push($tmp_array, $list);
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
        $list["product_images"] = $img_temp;
        array_push($tmp_array, $list);
    }
    $retorno["item"] = $tmp_array;

    $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit($json);
}

function getProductById($id){
    include './database/conexao.php';

    $sql = "SELECT * FROM products where id = '$id'";

    $resultado = $conexao->query($sql);

    $tmp_array = array();
    $retorno["status"] = 1;
    $retorno["qtd"] = $resultado->num_rows;
    while($list = $resultado->fetch_assoc()){
        $img_temp = array();
        $dir = $list["product_images"];
        if (!file_exists($dir)) {
            array_push($tmp_array, $list);
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
        $list["product_images"] = $img_temp;
        array_push($tmp_array, $list);
    }

    if(isset($_COOKIE["userToken"])){
        include "./utils/JWT.php";

        $userId = JWT_decode($_COOKIE["userToken"])["userId"];
        $sql = "SELECT * FROM wishlist
            INNER JOIN products
            ON wishlist.product_id = products.id
            WHERE wishlist.user_id = '$userId'
            AND wishlist.product_id = '$id'
        ";

        $resultado = $conexao->query($sql);

        if($resultado->num_rows != 0){
            $retorno["wishListed"] = true;
        }else {
            $retorno["wishListed"] = false;
        }

    }

    $retorno["item"] = $tmp_array;

    $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit($json);
}

function getProductWithFilters($type, $category, $orderby){
    include './database/conexao.php';

    $sql = "SELECT * FROM products WHERE true";

    if($type == "disabled"){
        $sql .= " AND active = 1";
    }else{
        $sql .= " AND active = 0";
    }
    if(!empty($type) and $type != "disabled") {
        $sql .= " AND type='$type' ";
    }
    if(!empty($category)) {
        $sql .= " AND category='$category' ";
    }
    if(!empty($orderby)) {
        if($orderby == "ASC"){
            $sql .= " ORDER BY price ASC ";
            
        }elseif($orderby == "DSC"){
            $sql .= " ORDER BY price DESC ";
        }
        elseif($orderby == "promo"){
            $sql .= " AND promotion > 0 ";
        }
    }


    $sql = str_replace('"', '', $sql);

    $resultado = $conexao->query($sql);

    $tmp_array = array();
    $retorno["status"] = 1;
    $retorno["qtd"] = $resultado->num_rows;
    while($list = $resultado->fetch_assoc()){
        $img_temp = array();
        $dir = $list["product_images"];
        if (!file_exists($dir)) {
            array_push($tmp_array, $list);
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
        $list["product_images"] = $img_temp;
        array_push($tmp_array, $list);
    }
    $retorno["item"] = $tmp_array;

    $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit($json);
}

/*
function deleteProductWithId(){
    include './database/conexao.php';

    echo "algo";

    $id = $_GET["productId"];

    $sql = "SELECT * FROM products where id = '$id'";

    $resultado = $conexao->query($sql);

    if(!$resultado or $resultado->num_rows == 0){
        $retorno["msg"] = "O produto com o id `$id` não existe";

        $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
        exit($json);
    }

    $produto = $resultado->fetch_assoc();

    $sql = "DELETE FROM products where id = '$id'";
    $resultado = $conexao->query($sql);

    if(!$resultado){
        $retorno["msg"] = "O produto com o id `$id` está selecioado como um banner";

        $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
        exit($json);
    }

    try {
        @delete_files($produto["product_images"]);
    } catch (Exception $e) {
        echo 'Exceção capturada: ',  $e->getMessage(), "\n";
    }
    

    $retorno["msg"] = "O produto com o id `$id` foi deletado";

    $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit($json);
}
*/

function disableProductWithId(){
    include './database/conexao.php';

    $id = $_POST["productId"];

    $sql = "SELECT * FROM products where id = '$id'";

    $resultado = $conexao->query($sql);

    if(!$resultado or $resultado->num_rows == 0){
        $retorno["msg"] = "O produto com o id `$id` não existe";

        $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
        exit($json);
    }

    $sql = "UPDATE products
        SET active = 1
        WHERE id =  '$id' 
    ";
    $resultado = $conexao->query($sql);

    if(!$resultado){
        $retorno["msg"] = "O produto com o id `$id` está selecioado como um banner";

        $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
        exit($json);
    }
    

    $retorno["msg"] = "O produto com o id `$id` foi deletado";

    $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit($json);
}

function activateProductWithId(){
    include './database/conexao.php';

    $id = $_POST["productId"];

    $sql = "SELECT * FROM products where id = '$id'";

    $resultado = $conexao->query($sql);

    if(!$resultado or $resultado->num_rows == 0){
        $retorno["msg"] = "O produto com o id `$id` não existe";

        $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
        exit($json);
    }

    $produto = $resultado->fetch_assoc();

    $sql = "UPDATE products
        SET active = 0
        WHERE id =  '$id' 
    ";
    $resultado = $conexao->query($sql);

    if(!$resultado){
        $retorno["msg"] = "O produto com o id `$id` está selecioado como um banner";

        $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
        exit($json);
    }
    

    $retorno["msg"] = "O produto com o id `$id` foi deletado";

    $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit($json);
}

function updateProductWithId(){
    include './database/conexao.php';

    $id = $_POST["productId"];

    $p_name = $_POST["product-name"];
    $description = $_POST["product-info"];
    $category = $_POST["product-category"];
    $type = $_POST["product-type"];
    $quantity =  floatval($_POST["product-quantity"]);
    $price = floatval($_POST["product-price"]);
    $promo = floatval($_POST["product-promo"]);
    $color = $_POST["color_pt"];
    $color_en = $_POST["color_en"];
    $size = $_POST["size"];

    $sql = "SELECT * FROM products where id = '$id'";

    $resultado = $conexao->query($sql);

    if(!$resultado or $resultado->num_rows == 0){
        $retorno["msg"] = "O produto com o id `$id` não existe";

        $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
        exit($json);
    }

    $sql = "UPDATE products
        SET product_name='$p_name', description='$description', category='$category',
            type='$type', quantity='$quantity', price='$price', promotion='$promo', 
            color_pt='$color', color_en='$color_en',size='$size'
        WHERE id =  '$id' 
    ";

    $resultado = $conexao->query($sql);

    if(!$resultado){
        $retorno["msg"] = "Deu algo errado";

        $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
        exit($json);
    }

    $retorno["msg"] = "O produto com o id `$id` foi atualizado";

    $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit($json);
}

function delete_files($target) {
    if(is_dir($target)){
        $files = glob( $target . '*', GLOB_MARK ); //GLOB_MARK adds a slash to directories returned

        foreach( $files as $file ){
            delete_files( $file );      
        }

        rmdir( $target . "/" );
    } elseif(is_file($target)) {
        unlink( $target );  
    }
}
?>