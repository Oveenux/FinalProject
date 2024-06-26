
var menuAbierto = false;
var jsonData;
var graficos = [];
var cuadroInfo = [];
var indiceGraficoActual;
var stat = 0;
var iteracion = 0;

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

function agregarCero(numero) {
    return numero < 10 ? "0" + numero : numero;
}

function formatearFecha(estampa) {
    var fecha = new Date(estampa);
    var dia = agregarCero(fecha.getDate());
    var mes = agregarCero(fecha.getMonth() + 1);
    var anio = fecha.getFullYear();
    var horas = agregarCero(fecha.getUTCHours());
    var minutos = agregarCero(fecha.getMinutes());
    var segundos = agregarCero(fecha.getSeconds());

    return anio + "-" + mes + "-" + dia + " " + horas + ":" + minutos + ":" + segundos;
}


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
    } else if (titulo === 'VV'){
        titulo = 'Viento';
    } else if (titulo === 'VA'){
        titulo = 'Voltaje A';
    } else if (titulo === 'VB'){
        titulo = 'Voltaje B';
    }else if (titulo === 'VC'){
        titulo = 'Voltaje C';
    } else if (titulo === 'IA'){
        titulo = 'Corriente A';
    } else if (titulo === 'IB'){
        titulo = 'Corriente B';
    } else if (titulo === 'IC'){
        titulo = 'Corriente C';
    } else if (titulo === 'PA'){
        titulo = 'Potencia A';
    } else if (titulo === 'PB'){
        titulo = 'Potencia B';
    } else if (titulo === 'PC'){
        titulo = 'Potencia C';
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
    var thIndex = document.createElement('th');
    thIndex.textContent = "N°";
    filaEncabezado.appendChild(thIndex);

    var keys = Object.keys(data);
    for (var key in data) {
        var th = document.createElement('th');
        titulo = key;
        th.textContent = tituloEncabezados(titulo);
        filaEncabezado.appendChild(th);
    }

    for (var i = 0; i < data[key].length; i++) {
        var fila = tabla.insertRow();

        var cellIndex = fila.insertCell();
        cellIndex.textContent = i+1;
        
        for (var j = 0; j < keys.length; j++) {
            var Cell = fila.insertCell();
            Cell.textContent = data[keys[j]][i];
        }        
    }

    return tabla;
}

function createChart(ctx, label, estampa, variable ,backgroundColor, borderColor, y_unit) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: estampa, // Inicialmente no hay etiquetas
            datasets: [{
                label: label,
                data: variable,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 2,
                fill: true,
                pointRadius: 0,
                cubicInterpolationMode: 'monotone',
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Tiempo',
                        color: 'black',
                        font: {
                            size: 16,
                        },
                    },
                    ticks: {
                        font: {
                            size: 16,
                        },
                        color: 'black', // Color del texto de las etiquetas del eje x
                        maxRotation: 0, // Ángulo de rotación máximo (en grados)
                        minRotation: 0,
                        callback: function(value, index, values) {

                            var fechaConSegundos = estampa[value]
                            var fechaSinSegundos = fechaConSegundos.slice(0, -3);

                            var numEtiquetasAMostrar = 8; // Número específico de etiquetas a mostrar
                            var intervalo = Math.max(Math.floor(values.length / numEtiquetasAMostrar), 1);
        
                            // Mostrar solo las etiquetas equiespaciadas según el número calculado
                            if (index % intervalo === 0) {
                                return fechaSinSegundos; // Mostrar la etiqueta original
                            } else {
                                return null; // Ocultar la etiqueta
                            
                            }
                        }
        
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: y_unit,
                        color: 'black',
                        font: {
                            size: 20,
                        },
                    },
                    ticks: {
                        font: {
                            size: 16,
                        },
                        color: 'black',
                    },
                    beginAtZero: false
                }
            },
            layout: {
                padding: {
                    left: 8,
                    right: 8,
                    top: 8,
                    bottom: 8,
                }
            },
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 20 ,
                        },
                        color: 'black',
                    },
                }
            }
        }
    });
}

function crearGrafica(data, estampa, key) {

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.classList.add('grafico-canvas');

    var color;
    var imagV;

    titulo = key;
    if (titulo === 'TEMP') {
        titulo = 'Temperatura exterior';
        createChart(ctx, titulo, estampa, data.TEMP, '#55836760', '#558367','Grados Celsius (°C)');
        color = '#55836785';
        imagV = 'temp.png';
    } else if (titulo === 'TEMPNEV') {
        titulo = 'Temperatura nevera';
        createChart(ctx, titulo, estampa, data.TEMPNEV, '#7BA0C060', '#7BA0C0','Grados Celsius (°C)');
        color = '#7BA0C085';
        imagV = 'temp.png';
    } else if (titulo === 'HUM') {
        titulo = 'Humedad exterior';
        createChart(ctx, titulo, estampa, data.HUM,'#2667FF60', '#2667FF', 'Porcentaje (%)');
        color = '#2667FF85';
        imagV = 'hum.png';
    } else if (titulo === 'HUMNEV') {
        titulo = 'Humedad nevera';
        createChart(ctx, titulo, estampa, data.HUMNEV,'#88888860', '#888888', 'Porcentaje (%)');
        color = '#9B9B9B85';
        imagV = 'hum.png';
    } else if (titulo === 'LUX') {
        titulo = 'Luminosidad';
        createChart(ctx, titulo, estampa, data.LUX, '#FAA50060', '#FAA500', 'Lux (lx)');
        imagV = 'sun.png';
        color = '#FAA50085';
    } else if (titulo === 'VV') {
        titulo = 'Velocidad del viento';
        createChart(ctx, titulo, estampa, data.VV, '#6050A860', '#6050A8','Velocidad (m/s)');
        color = '#6050A885';
        imagV = 'viento.png';
    } else if (titulo === 'VA'){
        titulo = 'Voltaje A';
        color = '#2667FF85'
        imagV = 'energy.png';
        createChart(ctx, titulo, estampa, data.VA, '#2667FF60', '#2667FF','Voltios (V)');
    } else if (titulo === 'VB'){
        titulo = 'Voltaje B';
        color = '#2667FF85'
        imagV = 'energy.png';
        createChart(ctx, titulo, estampa, data.VB, '#2667FF60', '#2667FF','Voltios (V)');
    }else if (titulo === 'VC'){
        titulo = 'Voltaje C';
        color = '#2667FF85'
        imagV = 'energy.png';
        createChart(ctx, titulo, estampa, data.VC, '#2667FF60', '#2667FF','Voltios (V)');
    } else if (titulo === 'IA'){
        titulo = 'Corriente A';
        color = '#FAA50085'
        imagV = 'energy.png';
        createChart(ctx, titulo, estampa, data.IA, '#FAA50060', '#FAA500','Amperios (A)');
    } else if (titulo === 'IB'){
        titulo = 'Corriente B';
        color = '#FAA50085'
        imagV = 'energy.png';
        createChart(ctx, titulo, estampa, data.IB, '#FAA50060', '#FAA500','Amperios (A)');
    } else if (titulo === 'IC'){
        titulo = 'Corriente C';
        color = '#FAA50085'
        imagV = 'energy.png';
        createChart(ctx, titulo, estampa, data.IC, '#FAA50060', '#FAA500','Amperios (A)');
    } else if (titulo === 'PA'){
        titulo = 'Potencia A';
        color = '#6050A885'
        imagV = 'energy.png';
        createChart(ctx, titulo, estampa, data.PA, '#6050A860', '#6050A8','Vatios (W)');
    } else if (titulo === 'PB'){
        titulo = 'Potencia B';
        color = '#6050A885'
        imagV = 'energy.png';
        createChart(ctx, titulo, estampa, data.PB, '#6050A860', '#6050A8','Vatios (W)');
    } else if (titulo === 'PC'){
        titulo = 'Potencia C';
        color = '#6050A885'
        imagV = 'energy.png';
        createChart(ctx, titulo, estampa, data.PC, '#6050A860', '#6050A8','Vatios (W)');
    } 

    return [canvas, color, imagV];
}

// Función para convertir JSON a CSV
function convertToCSV(data) {
    // Obtener las claves (nombres de las variables)
    const keys = Object.keys(data);
  
    // Convertir los datos a una matriz 2D
    const rows = data[keys[0]].map((_, index) => {
      return keys.map(key => data[key][index]);
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

// Función para mostrar el gráfico actual
function mostrarGrafico() {
    // Eliminar todos los gráficos del contenedor
    contenedor.innerHTML = '';

    // Agregar el gráfico actual al contenedor
    contenedor.appendChild(graficos[indiceGraficoActual]);
    actualizarMensajeGraficas();
    actualizarMarcadores(cuadroInfo);
}

function mostrarGraficoAnterior() {
    if (indiceGraficoActual > 0) {
        indiceGraficoActual--;
        mostrarGrafico();
    }
}

// Función para mostrar el siguiente gráfico
function mostrarGraficoSiguiente() {
    if (indiceGraficoActual < graficos.length - 2) {
        indiceGraficoActual++;
        mostrarGrafico();
    }
}

function flechaIzquierda(event) {
    // Si se presiona la flecha izquierda o la flecha arriba
    if (event.keyCode === 37 || event.keyCode === 38) {
        mostrarGraficoAnterior();
    }
}

function flechaDerecha(event) {
    if (event.keyCode === 39 || event.keyCode === 40) {
        mostrarGraficoSiguiente();
    }
}

function actualizarMensajeGraficas() {
    const mensajeElemento = document.getElementById('mensajeGraficas');
    const numeroActual = indiceGraficoActual + 1;
    const total = graficos.length-1;
    mensajeElemento.textContent = `${numeroActual}/${total}`;
}

function mostrarBotonesDes() {
    botonAnterior.style.display = 'block';
    botonSiguiente.style.display = 'block';
    mensajeGraficas.style.display = 'block';
}

function mostrarCuadro() {
    var variableContainers = document.querySelectorAll("#variable-container");
    variableContainers.forEach(function(container) {
        container.classList.remove("hidden");
        container.classList.add("flex");
    });
}

function ocultarCuadro() {
    var variableContainers = document.querySelectorAll("#variable-container");
    variableContainers.forEach(function(container) {
        container.classList.remove("flex");
        container.classList.add("hidden");
    });
}

function actualizarMarcadores(valores) {

    // Calcular los índices de los valores a mostrar
    var primerIndice = indiceGraficoActual * 2;

    var variableContainer = document.getElementById('variable-container');

    variableContainer.style.backgroundColor = valores[primerIndice];

    // Crea un elemento de imagen
    const img = document.createElement('img');
    const imageUrl = '../static/images/icons/' + valores[primerIndice+1];
    img.src = imageUrl;

    variableContainer.innerHTML = '';
    variableContainer.appendChild(img);
    
}

document.getElementById("myForm").addEventListener("submit", function(event){
    event.preventDefault(); // Evitar la acción predeterminada de envío del formulario

    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    var checkboxesMarcados = [];

    var contenedor = document.getElementById('chartsContainer');
    var imageContainer = document.getElementById('variable-container');
    graficos.length = 0;
    cuadroInfo.length = 0;
    indiceGraficoActual = 0;
    contenedor.innerHTML = '';
    imageContainer.innerHTML = '';

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

        iteracion++;


        if ('VA' in data) {
            // Guardar el valor del campo "TIMESTAMP"
            const VA = data.VA;
            // Eliminar el campo "TIMESTAMP" del objeto
            delete data.VA;
            // Agregar el campo "TIMESTAMP" al final del objeto
            data.VA = VA;
        }
        if ('VB' in data) {
            const VB = data.VB;
            delete data.VB;
            data.VB = VB;
        }
        if ('VC' in data) {
            const VC = data.VC;
            delete data.VC;
            data.VC = VC;
        }
        if ('IA' in data) {
            const IA = data.IA;
            delete data.IA;
            data.IA = IA;
        }
        if ('IB' in data) {
            const IB = data.IB;
            delete data.IB;
            data.IB = IB;
        }
        if ('IC' in data) {
            const IC = data.IC;
            delete data.IC;
            data.IC = IC;
        }
        if ('PA' in data) {
            const PA = data.PA;
            delete data.PA;
            data.PA = PA;
        }
        if ('PB' in data) {
            const PB = data.PB;
            delete data.PB;
            data.PB = PB;
        }
        if ('PC' in data) {
            const PC = data.PC;
            delete data.PC;
            data.PC = PC;
        }
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
        
        for (var key in data) {
            var informacion = crearGrafica(data, data.TIMESTAMP, key);
            var canvas = informacion[0];
            graficos.push(canvas);
            cuadroInfo.push(informacion[1], informacion[2]);
        }

        contenedor.appendChild(graficos[0]);
        mostrarBotonesDes();
        if (stat == 0) {
            mostrarCuadro();
        }
        actualizarMarcadores(cuadroInfo);
        actualizarMensajeGraficas();

        for (var i = 0; i < data.TIMESTAMP.length; i++) {
            var estampa = data.TIMESTAMP[i];
            var fechaFormateada = formatearFecha(estampa);
            data.TIMESTAMP[i] = fechaFormateada;
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
        if (this.isOn) {
            ocultarCuadro(); // Llama a la función mostrarCuadro si el switch está encendido
            stat = 1;
        } else {
            stat = 0;
            if (iteracion != 0) {
                mostrarCuadro();
            }
        }
      }
    }
});

const botonAnterior = document.getElementById('botonAnterior');
const botonSiguiente = document.getElementById('botonSiguiente');
const contenedor = document.getElementById('chartsContainer');

// Agregar controladores de eventos de clic a los botones
botonAnterior.addEventListener('click', mostrarGraficoAnterior);
botonSiguiente.addEventListener('click', mostrarGraficoSiguiente);
// Controladores de eventos para cambio de graficos con flechas
document.addEventListener('keydown', flechaIzquierda);
document.addEventListener('keydown', flechaDerecha);