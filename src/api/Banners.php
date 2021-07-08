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
        if(isset($_POST["productId1"]) and isset($_POST["productId2"]) and isset($_POST["productId3"]) and isset($_POST["productId4"])){
            updateBanner();
        }

        break;
    case 'GET':
        getBanners();
        break;

}

function updateBanner(){
    include './database/conexao.php';

    $productId1 = $_POST["productId1"];
    $productId2 = $_POST["productId2"];
    $productId3 = $_POST["productId3"];
    $productId4 = $_POST["productId4"];


    $sql = "UPDATE frontpagebanners
        SET product_id='$productId1'
        WHERE id =  1 
    ";

    $resultado = $conexao->query($sql);

    if(!$resultado){
        $retorno["msg"] = "Deu algo errado";

        $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
        exit($json);
    }

    $sql = "UPDATE frontpagebanners
        SET product_id='$productId2'
        WHERE id =  2
    ";

    $resultado = $conexao->query($sql);

    if(!$resultado){
        $retorno["msg"] = "Deu algo errado";

        $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
        exit($json);
    }
    $sql = "UPDATE frontpagebanners
        SET product_id='$productId3'
        WHERE id = 3
    ";

    $resultado = $conexao->query($sql);

    if(!$resultado){
        $retorno["msg"] = "Deu algo errado";

        $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
        exit($json);
    }
    $sql = "UPDATE frontpagebanners
        SET product_id='$productId4'
        WHERE id =  4
    ";

    $resultado = $conexao->query($sql);

    if(!$resultado){
        $retorno["msg"] = "Deu algo errado";

        $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
        exit($json);
    }
    
    $retorno["msg"] = "Os banners foram atualizados ";

    $json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit($json);
}

function getBanners(){
    include './database/conexao.php';

    $sql = "SELECT 
                    frontpagebanners.product_id,
                    products.* 
            FROM frontpagebanners 
            INNER JOIN products ON frontpagebanners.product_id = products.id";

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