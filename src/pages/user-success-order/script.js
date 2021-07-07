const updateData = async () => {
    var id = window.location.search.replace("?", "");

    if(id == ""){
        window.location.href = "/404";
        return;
    }

    document.getElementById("order-id").innerHTML = `Número do pedido: ${id}`;
}


$( document ).ready(function() {
    window.onload = updateData();
});