<?php 

use Statickidz\GoogleTranslate;

require_once __DIR__ . '../../../../vendor/autoload.php';

$tr = new GoogleTranslate();

$text_to_translate = $_POST["colors"];

$text_to_translate = explode(",", $text_to_translate);

$translated = array();

for($i = 0; $i < count($text_to_translate); $i++){
    array_push($translated, $tr->translate('pt', 'en', $text_to_translate[$i]));
}

$retorno = $translated;

$json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
exit($json);