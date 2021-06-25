<?php 

use Statickidz\GoogleTranslate;

require_once __DIR__ . '../../../../vendor/autoload.php';

$text_to_translate = $_GET["text"];

$tr = new GoogleTranslate();

$translated_text = $tr->translate('pt', 'en', $text_to_translate);

$retorno["texto"] = $text_to_translate;
$retorno["texto_traduzido"] = $translated_text;

$json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
exit($json);
