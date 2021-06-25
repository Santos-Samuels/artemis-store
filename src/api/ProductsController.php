<?php

$method = $_SERVER['REQUEST_METHOD'];
$request = explode("/", substr(@$_SERVER['PATH_INFO'], 1));

switch ($method) {
    case 'POST':
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
    case 'DELETE':
        if(isset($_GET["productId"])){
            deleteProductWithId();
        }
        break;
    case 'PUT':
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
    $color = $_POST["product-color"];
    $size = $_POST["product-size"];

    $sql = "INSERT INTO products values (NULL, 
                                        '$p_name', 
                                        '$p_images', 
                                        '$description',
                                        '$color',
                                        '$size',
                                        '$type',
                                        '$category', 
                                        '$quantity', 
                                        '$price',
                                        '$promo'
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

    $sql = "SELECT * FROM products";

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
    $retorno["item"] = $tmp_array;

    $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit($json);
}

function getProductWithFilters($type, $category, $orderby){
    include './database/conexao.php';

    $sql = "SELECT * FROM products WHERE true";

    if(!empty($type)) {
        $sql .= " AND type='$type' ";
    }
    if(!empty($category)) {
        $sql .= " AND type='$category' ";
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

function deleteProductWithId(){
    include './database/conexao.php';

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
    $color = $_POST["product-color"];
    $size = $_POST["product-size"];

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
            color='$color', size='$size'
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