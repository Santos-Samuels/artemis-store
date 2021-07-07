const sendMessage = () => {
    const name = document.getElementById("contact-name").value;
    const msg = document.getElementById("contact-message").value;

    var text = `Olá, aqui quem fala é ${name} !\n\n${msg}`;

    window.location = `https://api.whatsapp.com/send?phone=557598578488?&text=${text}`;
}