var tempExtInicial = [];
var tempNevInicial = [];
var humedadExtInicial = [];
var humedadNevInicial = [];
var luminosidadInicial = [];
var vientoInicial = [];
var tmstamps = [];
var unidades = ["°C", "°C", "%", "%", "Lux", "km/h"]; // Unidades correspondientes

// Función para gŕafico con 1 variable    
function createChart(ctx, label, backgroundColor, borderColor, y_unit) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Inicialmente no hay etiquetas
            datasets: [{
                label: label,
                data: [],
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1,
                fill: true,
                pointRadius: 0,
                cubicInterpolationMode: 'monotone'
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Tiempo (h)',
                        color: 'black',
                    },
                    ticks: {
                        color: 'black' // Color del texto de las etiquetas del eje y
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: y_unit,
                        color: 'black',
                    },
                    ticks: {
                        color: 'black' // Color del texto de las etiquetas del eje y
                    },
                    beginAtZero: true
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
                        color: 'black' // Color del texto de la leyenda
                    }
                }
            }
        }
    });
}

// Función para gŕafica con 2 variables
function createChart2V(ctx, label1, label2, borderColor1, borderColor2, y_unit) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], 
            datasets: [{
                label: label1,
                data: [],
                borderColor: borderColor1,
                backgroundColor: borderColor1, 
                borderWidth: 2,
                fill: false,
                pointRadius: 3,
                

            },
            {
                label: label2,
                data: [],
                borderColor: borderColor2,
                backgroundColor: borderColor2,
                borderWidth: 2,
                fill: false,
                pointRadius: 6,
                pointStyle: 'triangle'

            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Tiempo (h)',
                        color: 'black',
                    },
                    ticks: {
                        color: 'black' // Color del texto de las etiquetas del eje y
                    },
                },
                    
                y: {
                    title: {
                        display: true,
                        text: y_unit,
                        color: 'black',
                    },
                    ticks: {
                        color: 'black' // Color del texto de las etiquetas del eje y
                    },
                    beginAtZero: true
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
                        usePointStyle: true, // Utiliza el estilo del punto para la leyenda
                        padding: 25,
                        color: 'black',
                    }
                }
            }
        }
    });
}



function eliminarUltimoDato(chart,limiteLongitud){
    if (chart.data.labels.length > limiteLongitud) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }
    chart.update();
}

function eliminarUltimoDato2V(chart,limiteLongitud){
    if (chart.data.labels.length > limiteLongitud) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
        chart.data.datasets[1].data.shift();
    }
    chart.update();
}

function graficaInicial(chart, nuevoTiempo, nuevaVariable, limiteLongitud) {
    chart.data.labels.push(...nuevoTiempo);
    chart.data.datasets[0].data.push(...nuevaVariable);
    eliminarUltimoDato(chart,limiteLongitud)
}

function graficaInicial2V(chart, nuevoTiempo, nuevaVariable1, nuevaVariable2, limiteLongitud) {
    chart.data.labels.push(...nuevoTiempo);
    chart.data.datasets[0].data.push(...nuevaVariable1);
    chart.data.datasets[1].data.push(...nuevaVariable2);
    eliminarUltimoDato2V(chart,limiteLongitud)
}

function actualizarDatosGrafica(chart, nuevoTiempo, nuevaVariable, limiteLongitud) {
    // Agregar el nuevo valor al final del conjunto de datos de la gráfica
    chart.data.labels.push(nuevoTiempo);
    chart.data.datasets[0].data.push(nuevaVariable);
    eliminarUltimoDato(chart,limiteLongitud)
    
}

function actualizarDatosGrafica2V(chart, nuevoTiempo, nuevaVariable1, nuevaVariable2, limiteLongitud) {
    chart.data.labels.push(nuevoTiempo);
    chart.data.datasets[0].data.push(nuevaVariable1);
    chart.data.datasets[1].data.push(nuevaVariable2);
    eliminarUltimoDato2V(chart,limiteLongitud)
}

function actualizarMarcadores(valores, unidades) {
    
        // Obtener todos los elementos <span> con la clase 'value'
        var spans = document.querySelectorAll('.infoGrid-container-2 .value');

        // Iterar sobre los spans y asignarles el valor y la unidad correspondientes
        spans.forEach(function(span, index) {
            var valor = valores[index];
            var unidad = unidades[index] || ""; // Si no hay unidad definida, usar una cadena vacía
            span.textContent = valor + " " + unidad; // Concatenar valor y unidad
        });
}

function getDataFromServer(callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                tempExtInicial =  response.tempExti;
                tempNevInicial = response.tempNevi;
                humedadExtInicial = response.humedadExti;
                humedadNevInicial = response.humedadNevi;
                luminosidadInicial = response.luminosidadi;
                vientoInicial = response.vientoi;

                // Itera sobre cada cadena en "labels" y obtiene el timestamp
                response.labels.forEach(label => {
                    // Divide la cadena por espacios y selecciona la parte [4] (el timestamp)
                    var parts = label.split(" ");
                    const timestamp = parts[4];
                    // Agrega el timestamp al array de timestamps
                    tmstamps.push(timestamp);
                });


                // Llamar al callback una vez que se hayan asignado los datos
                callback();
            } else {
                console.error('Error al obtener los datos:', xhr.status);
            }
        }
    };
    xhr.open('POST', '/get_data'); // Ruta relativa a la dirección de tu servidor
    xhr.send();
}

function fetchDataAndDrawChart() {
    fetch('/stream', {method: "POST"})

        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudieron obtener los datos');
            }
            return response.json();
        })
        .then(data => {
            if (Object.keys(data).length === 0) {
                console.log('No hay datos disponibles');
                return; // No hagas nada si no hay datos disponibles
            }

            var estampa = data.label.split(" ");
            var timestamp = estampa[4];
            var variables = data.variables;
            var tempExt = parseFloat(variables[0]);
            var tempNev = parseFloat(variables[1]);
            var humedadExt = parseFloat(variables[2]);
            var humedadNev = parseFloat(variables[3]);
            var luminosidad = parseFloat(variables[4]);
            var viento = parseFloat(variables[5]);

            actualizarMarcadores(variables, unidades)

            actualizarDatosGrafica2V(tempChart, timestamp, tempExt, tempNev, 10);
            actualizarDatosGrafica2V(humidityChart, timestamp, humedadExt, humedadNev, 10);
            actualizarDatosGrafica(windChart, timestamp, viento, 10);
            actualizarDatosGrafica(lumChart, timestamp, luminosidad, 10);

        })
        .catch(error => console.error('Error fetching data:', error));
}


document.addEventListener('DOMContentLoaded', function () {
    getDataFromServer(function() {
        
        graficaInicial2V(tempChart, tmstamps, tempExtInicial, tempNevInicial, 10);
        graficaInicial2V(humidityChart, tmstamps, humedadExtInicial, humedadNevInicial, 10);
        graficaInicial(lumChart, tmstamps, luminosidadInicial, 10);
        graficaInicial(windChart, tmstamps, vientoInicial, 10);

        var valores = [tempExtInicial[9], tempNevInicial[9], humedadExtInicial[9], 
                        humedadNevInicial[9], luminosidadInicial[9], vientoInicial[9]]; // Valores de las variables
        
        actualizarMarcadores(valores, unidades);
        
    });
});




var ctx1 = document.getElementById('tempChart').getContext('2d');
var tempChart = createChart2V(ctx1, 'Temperatura exterior', 'Temperatura nevera', '#FAA500', '#7BA0C0', 'Grados Celsius (°C)');

var ctx2 = document.getElementById('humidityChart').getContext('2d');
var humidityChart = createChart2V(ctx2, 'Humedad exterior', 'Humedad nevera', '#2667FF', 'rgba(155, 155, 155, 1)', 'Porcentaje (%)');

var ctx3 = document.getElementById('lumChart').getContext('2d');
var lumChart = createChart(ctx3, 'Luminosidad', '#FFE90050', '#FFE900','Lux (lx)');

var ctx4 = document.getElementById('windChart').getContext('2d');
var windChart = createChart(ctx4, 'Velocidad del viento', '#6050A850', '#6050A8','Velocidad (Km/h)');



setInterval(fetchDataAndDrawChart, 5000); 
