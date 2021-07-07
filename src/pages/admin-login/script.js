const loginIn = async () => {
    const login = document.getElementById("admin-login-email").value.toLowerCase();
    const password = document.getElementById("admin-login-password").value;

    var data = new FormData();

    data.append("login", login);
    data.append("password", password);

    await axios({
        method: "post",
        url: "api/admin/",
        data: data,
        headers: { "Content-Type": "multipart/alternative" },
    }).then(function (response) {
        console.log(response.data);
        if(response.data.msg == "Login concluido"){
            alert("Login Concluido")
            window.location = "/admin";
        }else{
            alert("Login ou senha errados");
        }
    })
    .catch(function (error) {
        console.log(error);
    });
}