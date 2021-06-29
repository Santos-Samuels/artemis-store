<?php

$method = $_SERVER['REQUEST_METHOD'];
$request = explode("/", substr(@$_SERVER['PATH_INFO'], 1));

switch ($method) {
    case 'POST':
        if(isset($_COOKIE["userToken"]) and isset($_POST["deletedProductId"])){
            deleteWishlistProduct();
        }else if(isset($_COOKIE["userToken"]) and isset($_POST["productId"])){
            addProductOnWishlist();
        }else{
            $retorno["msg"] = "Você não está logado";

            $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
            exit($json);
        }

        break;
    case 'GET':
        if(isset($_COOKIE["userToken"])){
            getAllProductsByUser();
        }
        break;
}

function getAllProductsByUser(){
    include "./utils/JWT.php";
    include "./database/conexao.php";

    $userId = JWT_decode($_COOKIE["userToken"])["userId"];

    $sql = "SELECT * FROM wishlist
            INNER JOIN products
            ON wishlist.product_id = products.id
            WHERE wishlist.user_id = '$userId'
    ";

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

function getProductOfWishlistById(){
    include "./utils/JWT.php";
    include "./database/conexao.php";

    $user = JWT_decode($_COOKIE["userToken"]);
}

function addProductOnWishlist(){
    include "./utils/JWT.php";
    include "./database/conexao.php";

    $userId = JWT_decode($_COOKIE["userToken"])["userId"];
    $productId = $_POST["productId"];

    $sql = "INSERT INTO wishlist VALUES(null, '$userId', '$productId')";

    $resultado = $conexao->query($sql);

    if($resultado){
        $retorno["msg"] = "Produto Adicionado na Wishlist";

        $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
        exit($json);
    }else{
        $retorno["msg"] = "Deu algo errado no server";

        $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
        exit($json);
    }

}

function deleteWishlistProduct(){
    include "./utils/JWT.php";
    include "./database/conexao.php";

    $userId = JWT_decode($_COOKIE["userToken"])["userId"];
    $productId = $_POST["deletedProductId"];

    $sql = "DELETE FROM wishlist WHERE user_id = '$userId' AND product_id = '$productId'";

    $resultado = $conexao->query($sql);

    if($resultado){
        $retorno["msg"] = "Produto Removido na Wishlist";

        $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
        exit($json);
    }else{
        $retorno["msg"] = "Deu algo errado no server";

        $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
        exit($json);
    }
}