
var menuAbierto = false;

function toggleMenu() {
    var menu = document.getElementById("menuDesplegable");
    if (!menuAbierto) { // Si el menú está cerrado
        menu.style.display = "block"; // Abrir el menú
        menuAbierto = true; // Actualizar el estado
    } else {
        menu.style.display = "none"; // Cerrar el menú
        menuAbierto = false; // Actualizar el estado
    }
}

function limpiarCheckboxes() {
    var checkboxes = document.querySelectorAll('#menuDesplegable input[type="checkbox"]');
    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
}

function crearTabla(data) {

    var tablaExistente = document.getElementById('tablaDatos');
    if (tablaExistente) {
        // Si la tabla existe, eliminarla
        tablaExistente.remove();
    }

    var tabla = document.createElement('table');
    tabla.id = 'tablaDatos';

    var encabezado = tabla.createTHead();
    var filaEncabezado = encabezado.insertRow();
    
    // Crear encabezados de la tabla
    for (var key in data) {
        var th = document.createElement('th');
        th.textContent = key.charAt(0).toUpperCase() + key.slice(1); // Convertir la primera letra a mayúscula
        filaEncabezado.appendChild(th);
        console.log(th);
    }

    // Crear filas de la tabla
    // Crear filas de la tabla con los datos de 'tempExt' y 'luminosidad'
    for (var i = 0; i < data.tempExt.length; i++) {
        var fila = tabla.insertRow();
        
        var tempExtCell = fila.insertCell();
        tempExtCell.textContent = data.tempExt[i];

        var luminosidadCell = fila.insertCell();
        luminosidadCell.textContent = data.luminosidad[i];
    }

    return tabla;
}


document.getElementById("myForm").addEventListener("submit", function(event){
    event.preventDefault(); // Evitar la acción predeterminada de envío del formulario

    // Obtener los valores de los campos del formulario
    var startDatetime = document.getElementById("start_datetime").value;
    var endDatetime = document.getElementById("end_datetime").value;

    // Obtener los datos del formulario
    var formData = new FormData(document.getElementById("myForm"));

    // Enviar el formulario 
    fetch("/search_data", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (response.ok) {
            // La solicitud se completó correctamente
            console.log("Formulario enviado exitosamente");
            return response.json();
        } else {
            // La solicitud no se completó correctamente
            console.error("Error al enviar el formulario");
        }

    })
    .then(data => {

        if (Object.keys(data).length === 0) {
            console.log('No hay datos disponibles');
            return; // No hagas nada si no hay datos disponibles
        }

        // Manejar la respuesta de texto
        console.log("Respuesta del servidor:", data);
        var tabla = crearTabla(data);
        document.getElementById("tabla-container").appendChild(tabla);
    })
    .catch(error => {
        // Ocurrió un error al enviar la solicitud
        console.error("Error:", error);
    });

});


