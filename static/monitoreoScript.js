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
                pointRadius: 3,
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


function actualizarDatosGrafica(chart, nuevoTiempo, nuevaVariable, limiteLongitud) {
    // Agregar el nuevo valor al final del conjunto de datos de la gráfica
    chart.data.labels.push(nuevoTiempo);
    chart.data.datasets[0].data.push(nuevaVariable);

    // Verificar y eliminar el primer valor si se supera un cierto límite de longitud
    if (chart.data.labels.length > limiteLongitud) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }

    // Actualizar la gráfica
    chart.update();
}

function actualizarDatosGrafica2V(chart, nuevoTiempo, nuevaVariable1, nuevaVariable2, limiteLongitud) {

    chart.data.labels.push(nuevoTiempo);
    chart.data.datasets[0].data.push(nuevaVariable1);
    chart.data.datasets[1].data.push(nuevaVariable2);

    if (chart.data.labels.length > limiteLongitud) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
        chart.data.datasets[1].data.shift();
    }

    chart.update();
}


var ctx1 = document.getElementById('tempChart').getContext('2d');
var tempChart = createChart2V(ctx1, 'Temperatura exterior', 'Temperatura nevera', '#FAA500', '#7BA0C0', 'Grados Celsius (°C)');

var ctx2 = document.getElementById('humidityChart').getContext('2d');
var humidityChart = createChart2V(ctx2, 'Humedad exterior', 'Humedad nevera', 'rgba(99, 99, 255, 1)', 'rgba(155, 155, 155, 1)', 'Porcentaje (%)');

var ctx3 = document.getElementById('lumChart').getContext('2d');
var lumChart = createChart(ctx3, 'Luminosidad', '#FFE90050', '#FFE900','Lux (lx)');

var ctx4 = document.getElementById('windChart').getContext('2d');
var windChart = createChart(ctx4, 'Velocidad del viento', '#6050A850', '#6050A8','Velocidad (Km/h)');

var eventoStream = new EventSource('/stream');
eventoStream.onmessage = function(event) {
    var datos = event.data.split(' ');

    // Variables para gráficas 
    var timestamp = datos[1];
    var tempExt = parseFloat(datos[2]);
    var tempNev = parseFloat(datos[3]);
    var humedadExt = parseFloat(datos[4]);
    var humedadNev = parseFloat(datos[5]);
    var luminosidad = parseFloat(datos[6]);
    var viento = parseFloat(datos[7]);
    
    var partesTimestamp = timestamp.split(':');
    
    var horas = partesTimestamp[0];
    var minutos = partesTimestamp[1];
    var tiempo = horas + ':' + minutos;
    
    
    document.getElementById('mensaje').innerHTML = "Nuevo dato recibido - Tiempo: " + tiempo + "  - Temperatura: " + tempExt;

    actualizarDatosGrafica2V(tempChart, timestamp, tempExt, tempNev, 10);
    actualizarDatosGrafica2V(humidityChart, timestamp, humedadExt, humedadNev, 10);
    actualizarDatosGrafica(windChart, tiempo, viento, 10);
    actualizarDatosGrafica(lumChart, timestamp, luminosidad, 10);

};
