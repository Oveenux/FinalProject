var vaInicial = [];
var iaInicial = [];
var paInicial = [];
var vbInicial = [];
var ibInicial = [];
var pbInicial = [];
var vcInicial = [];
var icInicial = [];
var pcInicial = [];
var tmstamps = [];
var unidades = ["V", "A", "W", "V", "A", "W", "V", "A", "W"]; // Unidades correspondientes

// Función para gŕafica con 3 variables
function createChart3V(ctx, label1, label2, label3, borderColor1, borderColor2, borderColor3, y_unit) {
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

            },
            {
                label: label3,
                data: [],
                borderColor: borderColor3,
                backgroundColor: borderColor3,
                borderWidth: 2,
                fill: false,
                pointRadius: 6,
                pointStyle: 'crossRot'

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
                        color: 'black' // Color del texto de las etiquetas del eje x
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
                        usePointStyle: true, // Utiliza el estilo del punto para la leyenda
                        padding: 25,
                        color: 'black',
                    }
                }
            }
        }
    });
}



function eliminarUltimoDato3V(chart,limiteLongitud){
    if (chart.data.labels.length > limiteLongitud) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
        chart.data.datasets[1].data.shift();
        chart.data.datasets[2].data.shift();
    }
    chart.update();
}



function graficaInicial3V(chart, nuevoTiempo, nuevaVariable1, nuevaVariable2, nuevaVariable3,limiteLongitud) {
    chart.data.labels.push(...nuevoTiempo);
    chart.data.datasets[0].data.push(...nuevaVariable1);
    chart.data.datasets[1].data.push(...nuevaVariable2);
    chart.data.datasets[2].data.push(...nuevaVariable3);
    eliminarUltimoDato3V(chart,limiteLongitud)
}

function actualizarDatosGrafica3V(chart, nuevoTiempo, nuevaVariable1, nuevaVariable2, nuevaVariable3,limiteLongitud) {
    chart.data.labels.push(nuevoTiempo);
    chart.data.datasets[0].data.push(nuevaVariable1);
    chart.data.datasets[1].data.push(nuevaVariable2);
    chart.data.datasets[2].data.push(nuevaVariable3);
    eliminarUltimoDato3V(chart,limiteLongitud)
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
                vaInicial = response.VAi;
                iaInicial = response.IAi;
                paInicial = response.PAi;
                vbInicial = response.VBi;
                ibInicial = response.IBi;
                pbInicial = response.PBi;
                vcInicial = response.VCi;
                icInicial = response.ICi;
                pcInicial = response.PCi;

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
    xhr.open('POST', '/get_ElectricalData'); // Ruta relativa a la dirección de tu servidor
    xhr.send();
}

function fetchDataAndDrawChart() {
    fetch('/stream_ElectricalData', {method: "POST"})

        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudieron obtener los datos');
            }
            return response.json();
        })
        .then(data => {
            if (Object.keys(data).length === 0) {
                return; // No hagas nada si no hay datos disponibles
            }

            var estampa = data.label.split(" ");
            // var timestamp = estampa[4]; // --> Para base de datos
            var timestamp = estampa[1];
            var variables = data.variables;
            
            var VA = parseFloat(variables[0]);
            var VB = parseFloat(variables[1]);
            var VC = parseFloat(variables[2]);
            console.log(VA, VB, VC)
            var IA = parseFloat(variables[3]);
            var IB = parseFloat(variables[4]);
            var IC = parseFloat(variables[5]);
            var PA = parseFloat(variables[6]);
            var PB = parseFloat(variables[7]);
            var PC = parseFloat(variables[8]);

            let marcadores = [VA, IA, PA, VB, IB, PB, VC, IC, PC]
            actualizarMarcadores(marcadores, unidades)

            actualizarDatosGrafica3V(voltajeChart, timestamp, VA, VB, VC, 10);
            actualizarDatosGrafica3V(corrienteChart, timestamp, IA, IB, IC, 10);
            actualizarDatosGrafica3V(potenciaChart, timestamp, PA, PB, PC, 10);
        })
        .catch(error => console.error('Error fetching data:', error));
}


document.addEventListener('DOMContentLoaded', function () {
    getDataFromServer(function() {
        
        graficaInicial3V(voltajeChart, tmstamps, vaInicial, vbInicial, vcInicial, 10);
        graficaInicial3V(corrienteChart, tmstamps, iaInicial, ibInicial, icInicial, 10);
        graficaInicial3V(potenciaChart, tmstamps, paInicial, pbInicial, pcInicial, 10);

        var valores = [vaInicial[9], iaInicial[9], paInicial[9], 
                        vbInicial[9], ibInicial[9], pbInicial[9],
                        vcInicial[9], icInicial[9], pcInicial[9]]; // Valores de las variables
        
        actualizarMarcadores(valores, unidades);
        
    });
});

var ctx1 = document.getElementById('voltajeChart').getContext('2d');
var voltajeChart = createChart3V(ctx1, 'Voltaje A', 'Voltaje B', "Voltaje C", "#2667FF",'#FAA500', '#6050A8', 'Voltios (V)');

var ctx2 = document.getElementById('corrienteChart').getContext('2d');
var corrienteChart = createChart3V(ctx2, 'Corriente A', 'Corriente B', "Corriente C", "#2667FF", '#FAA500', '#6050A8', 'Amperios (A)');

var ctx3 = document.getElementById('potenciaChart').getContext('2d');
var potenciaChart = createChart3V(ctx3, 'Potencia A', 'Potencia B', "Potencia C", "#2667FF", '#FAA500', '#6050A8', 'Vatios (W)');


setInterval(fetchDataAndDrawChart, 5000); 
