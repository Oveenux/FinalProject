from flask import Flask, render_template
from access_config.host_AD import hostConfig
import wsFunctions as func

# WEB SERVER ECOMEDIX

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('inicioWP.html')

@app.route('/monitoreo')
def index2():
    return render_template('monitoreoWP.html')

@app.route('/monitoreoElectrico')
def index3():
    return render_template('monitoreoElectrico.html')

@app.route('/historicos')
def index4():
    return render_template('historicosWP.html')

@app.route('/get_data', methods = ['POST'])
# Route for initial charts data
def get_data():
    return func.get_data()

@app.route('/stream', methods = ['POST'])
# Route for updating of charts
def stream():
    return func.actualizar_ultimoDato(datos = "TEMP, TEMPNEV, HUM, HUMNEV, LUX, VV")

@app.route('/get_ElectricalData', methods = ['POST'])
# Route for initial charts data
def get_ElectricalData():
    return func.get_ElectricalData()

# @app.route('/stream_ElectricalData', methods = ['POST'])
# # Route for updating of charts
# def stream_ElectricalData():
#     return func.actualizar_ultimoDato(datos = "V-A, V-B, V-C, I-A, I-B, I-C, P-A, P-B, P-C")

@app.route('/search_data', methods=['POST'])
# Route for historical data search
def search_data():
    return func.search_data()

if __name__ == '__main__':
    app.run(**hostConfig)