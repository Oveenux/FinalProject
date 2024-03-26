function closeContactBox() {
    document.getElementById('contactBox').style.display = 'none';
}

document.getElementById('contactBtn').addEventListener('click', function () {
    document.getElementById('contactBox').style.display = 'block';
});
        
function copyToClipboard() {
    var email = document.getElementById("email").innerText;

    // Crear un elemento de texto temporal
    var emailTextArea = document.createElement("textarea");
    emailTextArea.value = email;

    // Añadir el elemento al DOM
    document.body.appendChild(emailTextArea);

    // Seleccionar el texto dentro del elemento
    emailTextArea.select();
    emailTextArea.setSelectionRange(0, 99999); /* Para dispositivos móviles */

    // Copiar el texto al portapapeles
    document.execCommand("copy");

    // Eliminar el elemento temporal
    document.body.removeChild(emailTextArea);

    // Mostrar una notificación o realizar alguna otra acción de retroalimentación
    alert("¡Correo electrónico copiado al portapapeles!");
} 

function closeInfoBox() {
    document.getElementById('infoBox').style.display = 'none';
}

document.getElementById('Btn').addEventListener('click', function () {
    document.getElementById('infoBox').style.display = 'block';
});