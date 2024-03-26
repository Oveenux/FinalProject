from flask import Flask, render_template, Response
from access_config.host_AD import hostConfig
import wbFunctions as func

app = Flask(__name__)

@app.route('/')
def index():
    # Esta función renderiza la plantilla HTML que mostrará la gráfica
    return render_template('inicioWP.html')

@app.route('/monitoreo')
def index2():
    return render_template('monitoreoWP.html')

@app.route('/historicos')
def index3():
    return render_template('historicosWP.html')

@app.route('/stream')
def stream():
    return Response(func.generar_datos(), content_type='text/event-stream')

if __name__ == '__main__':
    app.run(**hostConfig)