from access_config.DB_Access import authentication
from flask import jsonify, request
import mysql.connector
import random
import time

def conectar():
    try:
        # Start the MySQL database connection.
        connection2db = mysql.connector.connect(**authentication)
        return connection2db
    except mysql.connector.Error as error:
        print(f'Failed connection to database: \n {error}')
        return None

def generar_datos():
    while True:
        timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
        tempExt = random.randint(25,35)
        tempNev = random.randint(1,5)  # Simulación de datos de temperatura
        humedadExt = random.randint(50,59)
        humedadNev = random.randint(73,89)
        luminosidad = random.randint(30,80)
        viento = random.randint(13,18)
        yield f"data: {timestamp} {tempExt} {tempNev} {humedadExt} {humedadNev} {luminosidad} {viento}\n\n"
        time.sleep(5)  # Enviar datos cada 5 segundos

def get_data():
    try:
        conn = conectar()
        cursor = conn.cursor(dictionary=True)
        # Consulta para obtener los últimos 10 datos
        sql = "SELECT TIMESTAMP, TEMP, TEMPNEV, HUM, HUMNEV, LUX, VV FROM datos ORDER BY NUM DESC LIMIT 10"
        cursor.execute(sql)
        result = cursor.fetchall()

        # Procesa los resultados de la consulta
        timestamps = [row['TIMESTAMP'] for row in reversed(result)]
        tempExti = [row['TEMP'] for row in reversed(result)]
        tempNevi = [row['TEMPNEV'] for row in reversed(result)]
        humedadExti = [row['HUM'] for row in reversed(result)]
        humedadNevi = [row['HUMNEV'] for row in reversed(result)]
        luminosidadi = [row['LUX'] for row in reversed(result)]
        vientoi = [row['VV'] for row in reversed(result)]

        global ultimo_almacenado
        ultimo_almacenado = timestamps[-1]
        print('ultimo = ', ultimo_almacenado)

        cursor.close()
        conn.close()
        
        return jsonify({"labels": timestamps, "luminosidadi": luminosidadi, "vientoi": vientoi, "tempExti": tempExti,
                        "tempNevi": tempNevi, "humedadExti": humedadExti, "humedadNevi": humedadNevi})
        
    except Exception as e:
        return str(e)
    
def buscar_ultimoDato():
    conn = conectar()
    cursor = conn.cursor()
    # Consulta para obtener los últimos 10 datos
    sql = "SELECT TIMESTAMP FROM datos ORDER BY NUM DESC LIMIT 1"
    cursor.execute(sql)
    respuesta = cursor.fetchone()
    ultimoDato_DB = respuesta[0]
    cursor.close()
    conn.close()
    return ultimoDato_DB

def actualizar_ultimoDato():

    global ultimo_almacenado
    
    if 'ultimo_almacenado' not in globals():
        global ultimo_almacenado
        ultimo_almacenado = buscar_ultimoDato()
    

    conn = conectar()
    cursor = conn.cursor()
    # Consulta para obtener los últimos 10 datos
    sql = "SELECT TIMESTAMP, TEMP, TEMPNEV, HUM, HUMNEV, LUX, VV FROM datos ORDER BY NUM DESC LIMIT 1"
    cursor.execute(sql)
    ultimoFila = cursor.fetchone()
    timestamp = ultimoFila[0]

    if ultimo_almacenado != timestamp :
        print(ultimo_almacenado)
        print(timestamp)
        print("Nuevos datos")
        cursor.close()
        conn.close()

        return jsonify({})
        
    else:

        print(ultimo_almacenado, '=', timestamp)
        print("No hay nuevos datos")

        
        variables = []
        for variable in ultimoFila[1:]:
            variables.append(variable)
        
        print(variables)
        ultimo_almacenado = timestamp

        cursor.close()
        conn.close()

        return jsonify({"label": timestamp, "variables":variables})
    
def search_data():
    if request.method == 'POST':

        # Manejar los datos del formulario aquí
        start_datetime = request.form['start_datetime']
        end_datetime = request.form['end_datetime']

        # Cambiar el foramto de las fechas
        start_datetime = start_datetime.split('T')
        start_datetime = start_datetime[0] + ' ' + start_datetime [1] + ':00'

        end_datetime = end_datetime.split('T')
        end_datetime = end_datetime[0] + ' ' + end_datetime[1] + ':00'
       
        valores_checkbox = []

        for valor in request.form.getlist('checkboxesMarcados'):
            if valor != '0':
                valores_checkbox.append(valor)

        if len(valores_checkbox) == 0:
            valores_checkbox = ["TEMP","TEMPNEV","HUM","HUMNEV","LUX","VV"]
        
        columnas_sql = ', '.join(valores_checkbox)

        conn = conectar()
        cursor = conn.cursor(dictionary=True)
        consulta = (f"SELECT {columnas_sql}, TIMESTAMP FROM datos "
                    "WHERE TIMESTAMP >= %s AND TIMESTAMP <= %s")
        
        cursor.execute(consulta, (start_datetime, end_datetime))
        hist = cursor.fetchall()

        datos_agrupados = {}
        for fila in hist:
            for columna, valor in fila.items():
                if columna not in datos_agrupados:
                    datos_agrupados[columna] = []
                datos_agrupados[columna].append(valor)

        cursor.close()
        conn.close()

        return jsonify(datos_agrupados)