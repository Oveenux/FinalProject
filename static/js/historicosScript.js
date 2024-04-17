
var menuAbierto = false;
var jsonData;

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

document.addEventListener('click', function(event) {
    var menu = document.getElementById("menuDesplegable");
    var btnMenu = document.getElementById("filtro_btn");
    if (menuAbierto && event.target !== menu && event.target !== btnMenu && !menu.contains(event.target)) {
        menu.style.display = "none";
        menuAbierto = false;
    }
});

function setDateTimeNow() {
    // Obtener la fecha y hora actual
    var currentDate = new Date();
    var currentDateTimeString = currentDate.getFullYear().toString().padStart(4, '0') + '-' +
                               (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' +
                               currentDate.getDate().toString().padStart(2, '0') + 'T' +
                               currentDate.getHours().toString().padStart(2, '0') + ':' +
                               currentDate.getMinutes().toString().padStart(2, '0');
    
    // Asignar la fecha y hora actual al input
    document.getElementById('start_datetime').max = currentDateTimeString;
    document.getElementById('end_datetime').max = currentDateTimeString;
    document.getElementById('end_datetime').value = currentDateTimeString;
}

// Llamar a la función para establecer la fecha y hora actual cuando se carga la página
window.onload = setDateTimeNow;

function limpiarCheckboxes() {
    var checkboxes = document.querySelectorAll('#menuDesplegable input[type="checkbox"]');
    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
}

function tituloEncabezados(titulo){
    if (titulo === 'TEMP') {
        titulo = 'Temperatura exterior';
    } else if (titulo === 'TEMPNEV') {
        titulo = 'Temperatura nevera';
    } else if (titulo === 'HUM') {
        titulo = 'Humedad exterior';
    } else if (titulo === 'HUMNEV') {
        titulo = 'Humedad nevera';
    } else if (titulo === 'LUX') {
        titulo = 'Luminosidad';
    } else if (titulo === 'TIMESTAMP') {
        titulo = 'Fecha';
    } else {
        titulo = 'Viento';
    }
    return titulo
}

function eliminarTabla(tabla) {
    var tablaExistente = document.getElementById(tabla);
    if (tablaExistente) {
        // Si la tabla existe, eliminarla
        tablaExistente.remove();
    }
}

function crearTabla(data) {

    eliminarTabla('tablaDatos');

    var tabla = document.createElement('table');
    tabla.id = 'tablaDatos';

    var encabezado = tabla.createTHead();
    var filaEncabezado = encabezado.insertRow();
    
    // Crear encabezados de la tabla
    var keys = Object.keys(data);
    for (var key in data) {
        var th = document.createElement('th');
        titulo = key; // Convertir la primera letra a mayúscula
        th.textContent = tituloEncabezados(titulo)
        filaEncabezado.appendChild(th);
    }

    for (var i = 0; i < data[key].length; i++) {
        var fila = tabla.insertRow();
        
        for (var j = 0; j < keys.length; j++) {
            var Cell = fila.insertCell();
            Cell.textContent = data[keys[j]][i];
        }        
    }

    return tabla;
}

// Función para convertir JSON a CSV
function convertToCSV(data) {
    // Obtener las claves (nombres de las variables)
    const keys = Object.keys(data);
  
    // Formatear la fecha si existe
    function formatDate(value) {
      // Si es una fecha, devolvemos el valor encerrado en comillas
      return value instanceof Date ? `"${value}"` : value;
    }
  
    // Reemplazar coma por punto en ciertas columnas
    function replaceComma(value, key) {
      return key === "TIMESTAMP" ? value.replace(/,/g, '.') : value;
    }
  
    // Convertir los datos a una matriz 2D
    const rows = data[keys[0]].map((_, index) => {
      return keys.map(key => formatDate(replaceComma(data[key][index], key)));
    });
  
    // Construir el contenido CSV
    const csvContent = [
      keys.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
  
    // Crear un objeto Blob con los datos CSV
    return new Blob([csvContent], { type: 'text/csv' });
}
  
// Función para descargar el archivo CSV
function downloadCSV() {
    // Convertir los datos JSON a CSV
    const csvData = convertToCSV(jsonData);
  
    // Crear un enlace de descarga
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(csvData);
    downloadLink.download = 'datos.csv'; // Nombre del archivo CSV
  
    // Hacer clic en el enlace para descargar el archivo
    downloadLink.click();
}

document.getElementById("myForm").addEventListener("submit", function(event){
    event.preventDefault(); // Evitar la acción predeterminada de envío del formulario

    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    var checkboxesMarcados = [];

    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            checkboxesMarcados.push(checkbox.value);
        } else {
            checkboxesMarcados.push(0);
        }
    });

    // Obtener los datos del formulario
    var formData = new FormData(document.getElementById("myForm"));

    checkboxesMarcados.forEach(function(value) {
        formData.append('checkboxesMarcados', value);
    });

    // Enviar el formulario 
    fetch("/search_data", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (response.ok) {
            // La solicitud se completó correctamente
            return response.json();
        } else {
            // La solicitud no se completó correctamente
            console.error("Error al enviar el formulario");
        }

    })
    .then(data => {

        if ('TIMESTAMP' in data) {
            // Guardar el valor del campo "TIMESTAMP"
            const timestamp = data.TIMESTAMP;
            // Eliminar el campo "TIMESTAMP" del objeto
            delete data.TIMESTAMP;
            // Agregar el campo "TIMESTAMP" al final del objeto
            data.TIMESTAMP = timestamp;
        }
        

        if (Object.keys(data).length === 0) {
            console.log('No hay datos disponibles');
            return; // No hagas nada si no hay datos disponibles
        }

        var tabla = crearTabla(data);
        document.getElementById("tabla-scroll").appendChild(tabla);

        jsonData = data

        if (jsonData !== undefined && Object.keys(jsonData).length > 0) {
            // Si hay datos, mostrar el botón
            document.getElementById('downloadButton').style.display = 'flex';
        } else {
            // Si no hay datos, ocultar el botón
            document.getElementById('downloadButton').style.display = 'none';
        }

    })
    .catch(error => {
        // Ocurrió un error al enviar la solicitud
        console.error("Error:", error);
    });
});
 
document.getElementById('downloadButton').addEventListener('click', function() {  
    if (!jsonData || Object.keys(jsonData).length === 0) {
        console.error("No hay datos para descargar.");
        return; // Salir de la función si no hay datos
      }    
    downloadCSV();
});

new Vue({
    el: '#app',
    data: {
      isOn: false
    },
    methods: {
      toggleSwitch() {
        this.isOn = !this.isOn;
      }
    }
});