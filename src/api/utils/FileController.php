<?php

function UploadFiles(){
    if (isset($_FILES['product-images']) and isset($_POST["folder_name"])) {
        $newfoldername = $_SERVER["DOCUMENT_ROOT"] . "/public" . "\\" .$_POST["folder_name"];
        $newfoldername = str_replace('\\', "/", $newfoldername);

        if (!file_exists($newfoldername)) {
            mkdir($newfoldername, 0777, true);
        }

        $count = 1;

        foreach ($_FILES["product-images"]["error"] as $key => $error) {
            if ($error == UPLOAD_ERR_OK) {
                $tmp_name = $_FILES["product-images"]["tmp_name"][$key];
                $_name = explode(".", basename($_FILES["product-images"]["name"][$key]));


                $name = $count . "." . $_name[count($_name) - 1];
                @img_resize( $tmp_name , 250 , $newfoldername , $name);
            
                
                //move_uploaded_file($tmp_name, $newfoldername . "/" . $name);
                $count++;
            }
        }

        return $newfoldername;
    }
}




function img_resize( $tmpname, $size, $save_dir, $save_name, $maxisheight = 0 )
    {
    $save_dir     .= ( substr($save_dir,-1) != "/") ? "/" : "";
    $gis        = getimagesize($tmpname);
    $type        = $gis[2];
    switch($type)
        {
        case "1": $imorig = imagecreatefromgif($tmpname); break;
        case "2": $imorig = imagecreatefromjpeg($tmpname);break;
        case "3": $imorig = imagecreatefrompng($tmpname); break;
        default:  $imorig = imagecreatefromjpeg($tmpname);
        }

        $x = imagesx($imorig);
        $y = imagesy($imorig);
       
        $woh = (!$maxisheight)? $gis[0] : $gis[1] ;   
        $aw = 250;
        $ah = 250;
       /*
        if($woh <= $size)
        {
        $aw = $x;
        $ah = $y;
        }
            else
        {
            if(!$maxisheight){
                $aw = $size;
                $ah = $size * $y / $x;
            } else {
                $aw = $size * $x / $y;
                $ah = $size;
            }
        }  */
        $im = imagecreatetruecolor($aw,$ah);
    if (imagecopyresampled($im,$imorig , 0,0,0,0,$aw,$ah,$x,$y))
        if (imagejpeg($im, $save_dir.$save_name))
            return true;
            else
            return false;
    }
?>