from flask import Flask, render_template
from access_config.host_AD import hostConfig
app = Flask(__name__)

@app.route('/')
def index():
    # Esta función renderiza la plantilla HTML que mostrará la gráfica
    return render_template('InicioWP.html')

if __name__ == '__main__':
    app.run(**hostConfig)