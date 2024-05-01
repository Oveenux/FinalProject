from flask import Flask, render_template
from access_config.host_AD import hostConfig
import wsFunctions as func

app = Flask(__name__)

# WEB SERVER EcoMedix

@app.route('/')
def index():
    # Función para renderizar la plantilla
    return render_template('inicioWP.html')

@app.route('/monitoreo')
def index2():
    return render_template('monitoreoWP.html')

@app.route('/historicos')
def index3():
    return render_template('historicosWP.html')

@app.route('/get_data', methods = ['POST'])
# Route for initial charts data
def get_data():
    return func.get_data()

@app.route('/stream', methods = ['POST'])
# Route for updating of charts
def stream():
    return func.actualizar_ultimoDato()

@app.route('/search_data', methods=['POST'])
# Route for historical data search
def search_data():
    return func.search_data()

if __name__ == '__main__':
    app.run(**hostConfig)