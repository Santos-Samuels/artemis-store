const getId = () => {
    var id = window.location.search.replace("?", "");
    console.log(id);
}

var teste

const updateData = async () => {
    var id = window.location.search.replace("?", "");

    await axios({
        method: "get",
        url: `/api/produtos?id=${id}`,
        headers: { "Content-Type": "multipart/form-data" },
    }).then(function (response) {
        console.log(response.data);
        updatingData(response.data.item[0])
    })
    .catch(function (error) {
        console.log(error);
    });


}

const updatingData = (product) => {
    document.getElementById("product-name").innerHTML = product.product_name;
    document.getElementById("price").innerHTML = "R$ " + product.price.replace(".", ",");
    document.getElementById("description").innerHTML = product.description;

    var active = false
    var i = 0

    product.product_images.map((product_image) => {
        console.log(active)
        document.getElementById("indicators").innerHTML += `
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${i}" class="active" aria-current="true" aria-label="Slide ${i + 1}"></button>
        `
        
        document.getElementById("images").innerHTML += `<div class="carousel-item ${active == false ? "active" : ""}">
            <img src="${product_image}" class="d-block w-100 rounded" alt="...">
        </div>`
        active = true;
        i++;
    })

}




window.onload = updateData();