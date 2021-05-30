<?php

$algo["status"] = 1;
$algo["nome"] = "Nome";
$algo["mensagem"] = "Retornando Mensagem em json";

$json = json_encode($algo);
exit($json);

?>